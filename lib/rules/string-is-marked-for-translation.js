var unicodeRegExp = require('unicoderegexp');
/*

*/
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
    function reportUnTranslatedString(node) {
        context.report({
            node: node,
            message: 'String is not marked for translation.'
        });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
        TemplateLiteral: function(node) {
            if (
                node.parent &&
                (
                    node.parent.type === 'VariableDeclarator' ||
                    node.parent.type === 'JSXExpressionContainer'
                )
            ) {
                reportUnTranslatedString(node)
            }
        },
        Literal: function(node) {
            if (
                unicodeRegExp.letter.test(node.value) &&
                node.parent &&
                (
                    node.parent.type === 'ReturnStatement' ||
                    node.parent.type === 'CallExpression' ||
                    node.parent.type === 'ArrowFunctionExpression' ||
                    node.parent.type === 'Property' ||
                    node.parent.type === 'VariableDeclarator' ||
                    node.parent.type === 'JSXExpressionContainer' ||
                    node.parent.type === 'JSXAttribute' ||
                    (
                        node.parent.type.indexOf('JSXElement') !== -1 &&
                        !(
                            node.parent.openingElement.name.name === 'Trans' ||
                            node.parent.openingElement.name.name === 'Plural'
                        )
                    )
                ) &&
                typeof node.value !== "boolean" &&
                (
                    node._babelType === 'JSXText' ||
                    node._babelType === 'StringLiteral' ||
                    node._babelType === 'Literal'
                )
            ) {
                reportUnTranslatedString(node);
            }
        }
    };
};

module.exports.schema = [{
    type: 'object',
    properties: {},
    additionalProperties: false
}];
