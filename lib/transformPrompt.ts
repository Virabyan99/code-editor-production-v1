// lib/transformPrompt.ts
import * as acorn from 'acorn';
import * as astring from 'astring';
import * as walk from 'acorn-walk';

export function transformPrompt(src: string): string {
  if (!src.includes('prompt(')) return src; // Fast path

  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' }) as acorn.Node & { body: any[] };
  let needsTopLevelWrap = false;

  walk.fullAncestor(ast, (node: any, ancestors: any[]) => {
    if (node.type === 'CallExpression' && node.callee.name === 'prompt') {
      const parent = ancestors[ancestors.length - 2];
      if (parent?.type !== 'AwaitExpression') {
        const awaitExpr = { type: 'AwaitExpression', argument: node };
        replaceChild(parent, node, awaitExpr);
      }
      for (let i = ancestors.length - 2; i >= 0; i--) {
        const anc = ancestors[i];
        if (anc.type === 'FunctionDeclaration' || anc.type === 'FunctionExpression' || anc.type === 'ArrowFunctionExpression') {
          anc.async ||= true;
          return;
        }
        if (anc.type === 'Program') {
          needsTopLevelWrap = true;
          return;
        }
      }
    }
  });

  const rewritten = astring.generate(ast);
  if (!needsTopLevelWrap) return rewritten;

  return `(async () => {
    try {
      ${rewritten}
    } catch (e) {
      console.error('Error with prompt:', e);
    }
  })();`;
}

function replaceChild(parent: any, oldNode: any, newNode: any): void {
  if (!parent) return;
  for (const key of Object.keys(parent)) {
    const val = parent[key];
    if (Array.isArray(val)) {
      const idx = val.indexOf(oldNode);
      if (idx !== -1) val[idx] = newNode;
    } else if (val === oldNode) {
      parent[key] = newNode;
    }
  }
}