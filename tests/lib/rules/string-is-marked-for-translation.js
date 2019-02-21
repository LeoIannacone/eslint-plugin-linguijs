/**
 * @fileoverview Catch strings that aren't marked for translation
 * @author Rami Valta
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/string-is-marked-for-translation');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('string-is-marked-for-translation', rule, {
  valid: [
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        <Trans>',
        '          Some string',
        '        </Trans>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>+()</div>);', // Non-letter characters should be allowed
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const val = <Trans>Some string</Trans>',
        '    return <div>{val}</div>;',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
    },
  ],

  invalid: [,
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>test</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>æøå</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (<div>{\'test\'}</div>);',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    },

     {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const foo = (<div>test</div>);',
        '    return foo;',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const varObjectTest = { testKey : (<div>test</div>) };',
        '    return varObjectTest.testKey;',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  foo: (<div>hello</div>),',
        '  render() {',
        '    return this.foo;',
        '  },',
        '});'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        asdjfl',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    }, {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        asdjfl',
        '        test',
        '        foo',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        <h4>FALSELS</h4>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{message: 'String is not marked for translation.'}]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        <FormattedMessage defaultMessage="houheirh"/>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [{ message: 'String is not marked for translation.' }]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        <FormattedMessage defaultMessage="houheirh" something="hello"/>',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'const word = "Hello"',
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {word}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'const word = `Hello ${1}`',
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {word}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <div>',
        '        {`Hello ${1}`}',
        '      </div>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    return (',
        '      <Trans>',
        '        {`Hello ${1}`}',
        '      </Trans>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const some = {hello: "world"}',
        '    return (',
        '      <Trans>',
        '        {some.hello}',
        '      </Trans>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const some = val = () => "world"',
        '    return (',
        '      <Trans>',
        '        {some()}',
        '      </Trans>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  render() {',
        '    const some = val = () => true',
        '    return (',
        '      <Trans>',
        '        {some("world")}',
        '      </Trans>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
    {
      code: [
        'class Comp1 extends Component {',
        '  someFunction(val) {',
        '   return "some_value"',
        '}',
        '  render() {',
        '    return (',
        '      <Trans>',
        '        {someFunction()}',
        '      </Trans>',
        '    );',
        '  }',
        '}'
      ].join('\n'),
      args: [1],
      parser: 'babel-eslint',
      errors: [
        { message: 'String is not marked for translation.' },
      ]
    },
  ]
});
