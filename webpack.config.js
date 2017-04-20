module.exports = {
    entry: './src/index.js',
    output: {
        path: './public',
        filename: 'index.bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: {
                plugins: [
                    ['import', [{ libraryName: "antd", style: 'css' }]],
                ],
                babelrc: false,
                presets: ['es2015', 'stage-2', 'react']
            }
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.svg/,
            loader: 'svg-loader'
        }]
    }
}
