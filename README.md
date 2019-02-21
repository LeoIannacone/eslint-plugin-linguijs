ESLint-plugin-linguijs
===================

Lingui.JS specific linting rules for ESLint, based on `eslint-plugin-react-intl`

# Installation

Install [ESLint](https://www.github.com/eslint/eslint) either locally or globally.

```sh
$ npm install eslint
```

If you installed `ESLint` globally, you have to install React-intl plugin globally too. Otherwise, install it locally.

```sh
$ npm install eslint-plugin-react-intl
```

# Configuration

Add `plugins` section and specify ESLint-plugin-React as a plugin.

```json
{
  "plugins": [
    "linguijs"
  ]
}
```

# List of supported rules

* string-is-marked-for-translation: Catch strings that aren't marked for translation, e.g. contained in a <Trans /> or <Plural> component from LinguiJS.

# License

ESLint-plugin-linguijs is licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
