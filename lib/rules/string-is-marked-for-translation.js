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
    .concat(['Trans', 'Plural']) // lingui JSX elements

    var ignoreFunctions = (options.ignoreFunctions || [])
    .concat(['plural']) // lingui JS functions

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
            ) && // ignore the following patterns
            // Mainly CSS
            str.indexOf('!important') === -1 &&
            str.indexOf('@font-face') === -1 &&
            str.indexOf('?#') === -1 &&
            str.indexOf('@import url') === -1 &&
            !/<\w+>/.test(str)
        )
    }

    function nodeIsIgnored (node) {
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

    function findParentJSXIgnored (node) {
        if (!node) {
            return null
        }
        if (nodeIsIgnored(node)) {
            return node
        }
        return findParentJSXIgnored(findParent(node.parent, 'JSXElement'))
    }

    function findParentArrowFunctionName (node) {
        const arrowFunction = findParent(node, 'ArrowFunctionExpression')
        if (!arrowFunction) {
            return null
        }
        if(arrowFunction.parent.type === 'VariableDeclarator') {
            return arrowFunction.parent.id.name
        }
    }

    return {
        TemplateLiteral: function(node) {
            const parentJSXAttr = findParent(node, 'JSXAttribute')
            const parentFunction = findParent(node, 'CallExpression')

            // Ignore I18n._(t`some string`)
            const isInLinguiTemplate = (
                node.parent &&
                node.parent.tag &&
                node.parent.tag.name === 't' &&
                parentFunction &&
                parentFunction.callee.object &&
                parentFunction.callee.object.name === 'I18n' &&
                parentFunction.callee.property &&
                parentFunction.callee.property.name === '_'
            )

            if (
                !isInLinguiTemplate &&
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
            const parentJSXIgnored = findParentJSXIgnored(parentJSX)
            const parentJSXAttr = findParent(node, 'JSXAttribute')
            const parentFunction = findParent(node, 'CallExpression')
            const parentArrowFunctionName = findParentArrowFunctionName(node, 'ArrowFunctionExpression')

            const isInIgnoredFunction = (
                (parentFunction && ignoreFunctions.indexOf(parentFunction.callee.name) !== -1) ||
                (parentArrowFunctionName && ignoreFunctions.indexOf(parentArrowFunctionName) !== -1) ||
                false
            )

            if (
                node.value &&
                unicodeRegExp.letter.test(node.value) &&
                node.parent &&
                (
                    (
                        node.parent.type === 'JSXElement' && !parentJSXIgnored
                    ) ||
                    (
                        node.parent.type === 'JSXExpressionContainer'
                    ) ||
                    (
                        parentJSXAttr &&
                        ignoreAttributes.indexOf(parentJSXAttr.name.name) === -1 &&
                        !parentJSXIgnored &&
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
                            parentFunction ||
                            parentArrowFunctionName
                        ) &&
                        !isInIgnoredFunction &&
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
