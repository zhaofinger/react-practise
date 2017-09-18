module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	// https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
	extends: 'react',
	plugins: [
		'html'
	],
	// add your custom rules here
	rules: {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		// 关闭indent
		'indent': 0,
		// 关闭 no-tabs
		'no-tabs': 0,
		// 关闭花括号前面的空格
		'space-before-function-paren': 0,
		// 分号
		'semi': [2, 'always'],
		// 文末换行
		'eol-last': 0,
		//
		'no-undef': 0,
		// 定义未使用
		'no-unused-vars': 0
	}
};
