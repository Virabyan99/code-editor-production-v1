import * as acorn from 'acorn';
import * as astring from 'astring';

export function transformForEvaluation(src: string): string {
  try {
    const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module' });
    const body = ast.body;
    if (body.length > 0) {
      const lastStatement = body[body.length - 1];
      if (lastStatement.type === 'ExpressionStatement') {
        body[body.length - 1] = {
          type: 'ReturnStatement',
          argument: lastStatement.expression,
        };
      }
    }
    return astring.generate({
      type: 'Program',
      body: body,
    });
  } catch (err) {
    return src;
  }
}