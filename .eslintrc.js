module.exports = {
	env: {
		browser: true,
		es6: true,
		"jest/globals": true,
	},
	extends: 'airbnb-base',
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		},
		settings: {
			'import/resolver': {
				webpack: {
					config: 'config/webpack.dev.js'
				}
			}
		},
	plugins: [
			'vue',
			'jest',
	],
	rules: {
			'no-tabs': 0,
			'indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'no-underscore-dangle': 0,
			'comma-dangle': ['error', {
				'arrays': 'always-multiline',
				'objects': 'always-multiline',
				'imports': 'never',
				'exports': 'only-multiline',
				'functions': 'only-multiline'
			}],
			'object-curly-newline': ['error', {
				'ImportDeclaration': 'never'
			}],
			'implicit-arrow-linebreak': 0,
			'no-return-assign': ['error', 'except-parens'],
			'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
	},
	overrides: [
		{
			files: ['*.test.js'],
			excludedFiles: 'webpack.test.js',
			rules: {
				'global-require': 0,
				'prefer-destructuring': [0, {AssignmentExpression: {object: true}}],
			},
		},
	],
};
