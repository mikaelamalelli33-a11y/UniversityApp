module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'build', 'ci'],
    ],
    'subject-max-length': [2, 'always', 100],
    // Disabled — allows Albanian text in commit subjects
    'subject-case': [0],
    // Scope and subject are optional — only type is required
    'scope-empty': [0],
    'subject-empty': [0],
  },
};
