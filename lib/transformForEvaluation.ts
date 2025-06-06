import * as acorn from 'acorn';
import * as astring from 'astring';
import type { Program, ReturnStatement, ExpressionStatement } from 'estree';

export function transformForEvaluation(src: string): string {
  try {
    const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' }) as Program;
    const body = ast.body;
    if (body.length > 0) {
      const lastStatement = body[body.length - 1];
      if (lastStatement.type === 'ExpressionStatement') {
        const returnStatement: ReturnStatement = {
          type: 'ReturnStatement',
          start: lastStatement.start,
          end: lastStatement.end,
          argument: (lastStatement as ExpressionStatement).expression,
        };
        body[body.length - 1] = returnStatement;
      }
    }
    return astring.generate(ast);
  } catch (err) {
    return src;
  }
}