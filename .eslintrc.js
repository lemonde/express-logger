module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'mocha-no-only'],
  rules: {
    'mocha-no-only/mocha-no-only': ['error'],
    'no-console': 'off',
  },
  globals: {},
}
