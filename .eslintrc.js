module.exports = {
  extends: ['airbnb'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // custom rules can be added here
    'prefer-const': 'error',
  },
};
