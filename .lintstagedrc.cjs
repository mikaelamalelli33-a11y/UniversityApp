module.exports = {
  '*.{js,jsx}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,json,md}': ['prettier --write'],
};
