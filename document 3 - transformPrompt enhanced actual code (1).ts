
/**
 * transformPrompt.ts
 *
 * Rewrites student‑authored code so that:
 *  1. Every *bare* call to `prompt()` becomes `await prompt()`
 *  2. The nearest containing function / callback is marked `async`
 *  3. If a bare prompt exists at top level the whole file is wrapped
 *     in an `async` IIFE.
 *
 * Dependencies:
 *   npm i acorn acorn-walk astring
 *   npm i -D @types/acorn
 */
import * as acorn from 'acorn';
import * as astring from 'astring';
import * as walk from 'acorn-walk';

/**
 * Transforms the supplied source string. If no `prompt(` substring is
 * present the original source is returned unmodified.
 */
export function transformPrompt(src: string): string {
  if (!src.includes('prompt(')) return src;      // ‑ fast path

  // Parse as a classic <script>; change to "module" if you teach ES modules
  const ast = acorn.parse(src, {
    ecmaVersion: 'latest',
    sourceType: 'script',
  }) as acorn.Node & { body: any[] };

  let needsTopLevelWrap = false;

  // Traverse with ancestor information
  walk.fullAncestor(ast, (node: any, ancestors: any[]) => {
    if (isBarePromptCall(node)) {
      const parent = ancestors[ancestors.length - 2];

      // Insert AwaitExpression if one is not already there
      if (parent?.type !== 'AwaitExpression') {
        const awaitExpr = { type: 'AwaitExpression', argument: node };
        replaceChild(parent, node, awaitExpr);
      }

      // Mark the nearest function async, else request top‑level wrap
      for (let i = ancestors.length - 2; i >= 0; --i) {
        const anc = ancestors[i];
        if (isFunctionLike(anc)) {
          anc.async ||= true;            // make async if not already
          return;                        // done
        }
        if (anc.type === 'Program') {
          needsTopLevelWrap = true;
          return;                        // reached top level
        }
      }
    }
  });

  const rewritten = astring.generate(ast);

  if (!needsTopLevelWrap) return rewritten;

  // Wrap entire script in async IIFE so that top‑level awaits are legal
  const wrapper = `(async () => {
${rewritten}
})();`;
  return wrapper;
}

/* ------------------------------------------------------------------ */

function isBarePromptCall(node: any): boolean {
  return (
    node?.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'prompt'
  );
}

function isFunctionLike(node: any): boolean {
  return (
    node &&
    (node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression')
  );
}

/**
 * Mutates `parent` so that the child reference `oldNode`
 * is replaced with `newNode`. Works for both arrays and scalars.
 */
function replaceChild(parent: any, oldNode: any, newNode: any): void {
  if (!parent) return;
  for (const key of Object.keys(parent)) {
    const val = parent[key];
    if (Array.isArray(val)) {
      const idx = val.indexOf(oldNode);
      if (idx !== -1) {
        val[idx] = newNode;
        return;
      }
    } else if (val === oldNode) {
      parent[key] = newNode;
      return;
    }
  }
}
