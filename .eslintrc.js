module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    allowExpressions: 'off',
    'no-console': 'error',
    'no-misudes-promises': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-misuses-promises': 'off',
    '@typescript-eslint/no-base-to-string': 'off'
  }
}
