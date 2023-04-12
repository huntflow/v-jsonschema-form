module.exports = {
  root: true,

  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', 'plugin:prettier-vue/recommended'],

  rules: {
    'no-prototype-builtins': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  globals: {}
};
