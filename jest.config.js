module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  transformIgnorePatterns: ['/node_modules/(?!(@storybook/.*\\.vue$))'],
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.jsx?$': ['babel-jest', { envName: 'test' }],
    '.*\\.(vue)$': 'vue-jest'
  },
  // timers: 'modern',
  clearMocks: true
};
