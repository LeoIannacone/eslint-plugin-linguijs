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
    .concat([
        'plural', // lingui JS functions
        'querySelector',
        'querySelectorAll'
    ])

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

                // Ignored all uper cases, allow only "This" format
                // We consider strings like THIS as contant
                str[0].toUpperCase() === str[0] &&
                str.substr(1).toLowerCase() === str.substr(1) &&

                !/[\-_0-9\/]/.test(str)
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

    // Returns the call tree in the format obj1.obj2.func()
    function getFullFunctionCall(functionCallee, previous = '') {
        if (!functionCallee) {
            return previous
        }
        if (!previous) {
            previous = functionCallee.name || (functionCallee.property && functionCallee.property.name) || ''
        }
        if (functionCallee.object) {
            if (functionCallee.name) {
                return functionCallee.name + '.' + previous
            } else if (functionCallee.object && functionCallee.object.parent) {
                const parent = functionCallee.object.parent
                if (parent.object) {
                    if (parent.object.name) {
                        previous = parent.object.name + '.' + previous
                    } else if (parent.object.property) {
                        previous = parent.object.property.name + '.' + previous
                    }
                    return getFullFunctionCall(parent.object, previous)
                }
            }
        }
        return previous
    }

    if (!process.env.ENABLE_LINGUI) {
        return {}
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
                parentFunction.callee.object.name.toLowerCase() === 'i18n' &&
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

            let isInIgnoredFunction = false
            if (parentArrowFunctionName) {
                isInIgnoredFunction = ignoreFunctions.indexOf(parentArrowFunctionName) !== -1
            }
            if (parentFunction) {
                const functionCallee = parentFunction.callee
                const fullCallCode = getFullFunctionCall(functionCallee).split('.').reverse()
                isInIgnoredFunction = ignoreFunctions.some(funcName => {
                    if (functionCallee.name) {
                        return functionCallee.name === funcName
                    } else if (functionCallee.property) {
                        const fullFuncName = funcName.split('.').reverse()
                        if (fullFuncName.length === 1) {
                            return funcName === functionCallee.property.name
                        }

                        // In case of functions like 'something.functioname'
                        // maske sure we compare all the cases
                        for (let i = 0; i < fullFuncName.length; i++) {
                            if (fullFuncName[i] !== fullCallCode[i]) {
                                return false
                            }
                        }
                        return true
                    }
                })
            }


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
                        !nodeIsIgnored(parentJSXAttr.parent) &&
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
                            node.parent.type === 'LogicalExpression' ||
                            node.parent.type === 'NewExpression' ||
                            parentFunction ||
                            parentArrowFunctionName
                        ) &&
                        !parentJSXIgnored &&
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
