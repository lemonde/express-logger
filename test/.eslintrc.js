module.exports = {
  globals: {
    describe: true,
    it: true,
    beforeEach: true,
    afterEach: true,
    before: true,
    after: true,
    context: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
}
