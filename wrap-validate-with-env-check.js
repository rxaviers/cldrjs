module.exports = function(babel, options) {
  "use strict";
  
  const t = babel.types;

  const NODE_ENV = t.memberExpression(t.memberExpression(t.identifier("process"), t.identifier("env")), t.identifier("NODE_ENV"));
  const PRODUCTION_EXPRESSION = t.binaryExpression("!==", NODE_ENV, t.stringLiteral("production"));

  const SEEN_SYMBOL = Symbol('expression.seen');

  return {
    visitor: {
      CallExpression: {
        exit: function(path) {
          const node = path.node;

          // Ignore if it's already been processed
          if (node[SEEN_SYMBOL]) {
            return;
          }

          if (
            path.get('callee').isIdentifier({name: 'validate'}) ||
            path.get('callee').isIdentifier({name: 'validateType'}) ||
            path.get('callee').isIdentifier({name: 'validateTypePath'}) ||
            path.get('callee').isIdentifier({name: 'validateTypeString'}) ||
            path.get('callee').isIdentifier({name: 'validateTypeFunction'}) ||
            path.get('callee').isIdentifier({name: 'validateTypePlainObject'}) ||
            path.get('callee').isIdentifier({name: 'validatePresence'})
          ) {
            // Turns this code:
            //
            // validate(...);
            //
            // into this:
            //
            // if (process.env.NODE_ENV !== "production") {
            //   validate(...);
            // }
            //
            // The goal is to strip out validation calls entirely in production.
            node[SEEN_SYMBOL] = true;
            path.replaceWith(
              t.ifStatement(
                PRODUCTION_EXPRESSION,
                t.blockStatement([
                    t.expressionStatement(node),
                ])
              )
            );
          }
        },
      },
    },
  };
};