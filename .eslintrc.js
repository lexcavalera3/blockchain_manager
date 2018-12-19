module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 2017
  },
  "env": {
    "es6": true
  },

  "rules": {
    "max-len": [2, 120, 4, {"ignoreUrls": true}],
    "quote-props": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    "comma-dangle": ["error", "never"]
  }
};
