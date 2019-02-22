var unicodeRegExp = require('unicoderegexp');
/*

*/
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function(context) {
    var options = context.options[0] || {}

    var ignoreAttributes = (options.ignoreAttributes || [])
    .concat(['className', 'key'])

    var ignoreTags = (options.ignoreTags || [])
    .concat(['Trans', 'Plural'])

    var ignoreFunctions = (options.ignoreFunctions || [])
    .slice()

    function reportUnTranslatedString(node) {
        context.report({
            node: node,
            message: 'String is not marked for translation.'
        });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    function guessStringIsLocalisable(str) {
        if (!str || typeof str !== 'string') {
            return false
        }
        return (
            str.indexOf(' ') > -1 || (
                unicodeRegExp.letter.test(str[0]) &&
                str[0].toUpperCase() === str[0] && (
                    str.substr(1).toLowerCase() === str.substr(1) ||
                    str.substr(1).toUpperCase() === str.substr(1)
                ) &&
                !/[\-_0-9]/.test(str)
            )
        )
    }

    function nodeIsJSXLingui (node) {
        if (!node) {
            return false
        }
        return (
            node.openingElement &&
            ignoreTags.indexOf(node.openingElement.name.name) !== -1
        )
    }

    function findParent(node, type) {
        if (node.type === type) {
            return node
        }
        if (!node.parent) {
            return null
        }
        return findParent(node.parent, type)
    }

    return {
        TemplateLiteral: function(node) {
            const parentJSXAttr = findParent(node, 'JSXAttribute')

            if (
                node.quasis &&
                node.quasis.some(q => (
                    q.value &&
                    unicodeRegExp.letter.test(q.value.raw) &&
                    guessStringIsLocalisable(q.value.raw)
                )) &&
                (
                    !parentJSXAttr ||
                    ignoreAttributes.indexOf(parentJSXAttr.name.name) === -1
                )
            ) {
                reportUnTranslatedString(node)
            }
        },
        Literal: function(node) {
            const d = what => (console.log('here', what) || true)
            const parentJSX = findParent(node, 'JSXElement')
            const parentJSXAttr = findParent(node, 'JSXAttribute')
            if (
                node.value &&
                unicodeRegExp.letter.test(node.value) &&
                node.parent &&
                (
                    (
                        node.parent.type === 'JSXElement' &&
                        !nodeIsJSXLingui(node.parent)
                    ) ||
                    (
                        node.parent.type === 'JSXExpressionContainer'
                    ) ||
                    (
                        parentJSXAttr &&
                        ignoreAttributes.indexOf(parentJSXAttr.name.name) === -1 &&
                        guessStringIsLocalisable(node.value)
                    ) ||
                    (
                        (
                            node.parent.type === 'ReturnStatement' ||
                            node.parent.type === 'BinaryExpression' ||
                            node.parent.type === 'ArrowFunctionExpression' ||
                            node.parent.type === 'VariableDeclarator' ||
                            node.parent.type === 'Property' ||
                            node.parent.type === 'ConditionalExpression' ||
                            node.parent.type === 'ArrayExpression' ||
                            node.parent.type === 'AssignmentExpression' ||
                            (
                                node.parent.type === 'CallExpression' &&
                                ignoreFunctions.indexOf(node.parent.callee.name) === -1
                            )
                        ) &&
                        guessStringIsLocalisable(node.value)
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
    "type": "object",
    "properties": {
        "ignoreAttributes": {
            "type": "array"
        },
        "ignoreTags": {
            "type": "array"
        },
        "ignoreFunctions": {
            "type": "array"
        }
    },
    "additionalProperties": false,
}];
