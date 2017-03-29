/// <binding />
module.exports = {
    context: __dirname + '/app',
    entry: './index.js',
    output: {
        path: __dirname + '/app',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: __dirname + '/app',
                loader: 'babel'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.css$/,
                include: __dirname + '/app',
                loaders: 'style!css'
            },
            {
                test: /\.scss$/,
                include: __dirname + '/app',
                loaders: 'style!css!sass'
            }
        ]
    }
}