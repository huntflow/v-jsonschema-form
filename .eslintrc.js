module.exports = {
  root: true,

  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended', '@vue/prettier'],

  rules: {
    'no-prototype-builtins': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  globals: {},

  overrides: [
    {
      files: '**/*.test.[jt]s',
      env: {
        jest: true
      }
    }
  ]
};
