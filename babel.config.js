module.exports = function babelConfig(api) {
	api.cache(true);

	const presets = [
		'@babel/preset-env',
	];
	const plugins = [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		'@babel/plugin-transform-classes',
		'@babel/plugin-transform-regenerator',
	];

	return {
		presets,
		plugins,
	};
};
