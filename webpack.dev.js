const path = require('path')

module.exports = () => {
    return {
        entry: path.resolve(__dirname, './src/ex3.ts'),
        output: {
            filename: 'ex3.js',
            path: __dirname + '/dev'
        },
        devServer: {
            disableHostCheck: true
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [{loader: 'ts-loader'}]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', '.json'],
            modules: ['node_modules', 'src'],
            symlinks: false
        },
        devtool: 'source-map',
        plugins: []
    }
}
