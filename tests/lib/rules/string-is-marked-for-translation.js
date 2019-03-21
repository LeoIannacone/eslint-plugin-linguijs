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

var allValid = [
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
        '    return (',
        '      <div>',
        '        <Trans>',
        '          Some string<span>nested here <a href="/">another one</a></span>',
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
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div className="someClassName">',
      '        {user.name}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div ingoredAttr="someClassName">',
      '        {user.name}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    options: [{ ignoreAttributes: ["ingoredAttr"] }],
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <CustomComponent>',
      '        Some test',
      '      </CustomComponent>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    options: [{ ignoreTags: ["CustomComponent"] }],
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div>',
      '        {cls("Some test")}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    options: [{ ignoreFunctions: ["cls"] }],
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div key="something">',
      '        {user.name}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
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

  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div>',
      '        <FormattedMessage defaultMessage="somemessage" something="right"/>',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
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
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <Image src="/something.png" className={ cls("titleBold") } />',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  _getTitle() {',
      '    return `${var1} • ${var2}`',
      '  }',
      '  render() {',
      '    return (',
      '      <div>',
      '        {this._getTitle()}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    const some = val = () => true',
      '    return (',
      '      <div>',
      '        {some("world")}',
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
      '        {this._getRow(',
      '          "/emails/images/templates/pro/postajob/idCard.png"',
      '        )}',
      '      </div>',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <Button className={`Button-amount item-${k}`} />',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <Button className="Button-amount item" />',
      '    );',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '   const cls = el => el ? `Copyright-${el}` : "Copyright"',
      '   return null',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    options: [{ ignoreFunctions: ["cls"] }],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '   const title = I18n._(t`${this.props.enquiry.id} job`)',
      '   return title',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '   const title = i18n._(plural({',
      '     value: count,',
      '     one: "You have one message",',
      '     other: "You have # messages",',
      '   }))',
      '   return title',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '   document.querySelector(".Main .ButtonBack")',
      '   const d = document.querySelectorAll(".Main .ButtonBack")',
      '   return null',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '   lodash.something(".MessageComposer textarea: nth - child(2)")',
      '   return null',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    options: [{ ignoreFunctions: ["lodash.something"] }],
    parser: 'babel-eslint',
  },
  {
    code: [
      'export const goBack = ({ alt, router }) => {',
      '  return navigator.userAgent.indexOf("Safari") !== -1',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
    options: [{ ignoreFunctions: ["userAgent.indexOf"] }],
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <Button type="SUBMIT" />',
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

var allInvalid = [
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
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (<div>{\'this\'}</div>);',
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
      '    const foo = (<div>test</div>);',
      '    return foo;',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
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
    errors: [{ message: 'String is not marked for translation.' }]
  },
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    return (',
      '      <div>',
      '        <FormattedMessage defaultMessage="Some message"/>',
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
      '        <FormattedMessage defaultMessage="Somemessage" something="hello world"/>',
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
      '    const some = {hello: "World"}',
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
      '    const some = val = () => "World"',
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
      '      <div>',
      '        {some("World")}',
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
      '  someFunction(val) {',
      '   return "some value"',
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
  {
    code: [
      'class Comp1 extends Component {',
      '  render() {',
      '    const some = val = () => {',
      '      return `${creditLabel} (some other string)`',
      '    }',
      '    return (',
      '      <div>',
      '        {some()}',
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
      '    const insuranceType = this.props.type === "pli" ? "public liability" : "professional indemnity"',
      '    return (',
      '      <div>',
      '        {insuranceType}',
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
      'class Comp1 extends Component {',
      '  _getTitle() {',
      '    return [',
      '      <TitleEmoji key={cls("titleEmoji")}>👋</TitleEmoji>,',
      '      "You\'ve been invited to a job",',
      '    ]',
      ' }',
      '  render() {',
      '    return (',
      '      <div>',
      '        {this._getTitle()}',
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
      '      <Button label="Submit" />',
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
      '    let heading = "Customer\'s phone number"',
      '    if(something === "b2b") {',
      '       heading = "Property manager\'s phone number"',
      '    }',
      '    return heading',
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
      'class Comp1 extends Component {',
      '  render() {',
      '   const subTitle = "This is string " +',
      '     "Takes two lines."',
      '   return(',
      '     <TrustPilotReviewGeneric',
      '       subTitle = { subTitle } />',
      '    )',
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
      'class Comp1 extends Component {',
      '  render() {',
      '   return (',
      '     <Trans>',
      '       This text is ok',
      '       <Button lable="this is not" />',
      '     </Trans>',
      '    )',
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
      '    const errorMessage = priceResult.coupon.message || "Discount code invalid"',
      '    return errorMessage',
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
      '    throw new Error("A prop error")',
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
      '  onSendReminder () {',
      '    return Promise.reject("Not Implemented")',
      '  }',
      '  render() {',
      '    this.onSendReminder()',
      '  }',
      '}'
    ].join('\n'),
    args: [1],
    parser: 'babel-eslint',
    options: [{
      ignoreFunctions: ["console.log"],
    }],
    errors: [
      { message: 'String is not marked for translation.' },
    ]
  },
]

var ruleTester = new RuleTester();
ruleTester.run('string-is-marked-for-translation', rule, {
  valid: [
    ...allValid,
  ],
  invalid: [
    ...allInvalid,
  ]
});
