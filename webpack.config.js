const path = require('path');

module.exports = {
	entry: {
		app: './src/app.js',
		'pdf.worker': './node_modules/pdfjs-dist/build/pdf.worker.entry.js'
	},

	output: {
		filename: 'public/[name].bundle.js',
		path: path.join(__dirname, 'public'),
		//publicPath: '/',
	},

	mode: 'development',

	devServer: {
		port:3000,
		//contentBase: ['./public']
	},
	
	module: {
		rules: [
			{
				test: /\js/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},

	plugins: [
		//new CleanWebpackPlugin(['public'])
		
	],

}
