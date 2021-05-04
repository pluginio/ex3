const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = () => {
    return {
        entry: {
            electron: path.resolve(__dirname, './electron.ts'),
            'electron.min': './electron.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, './build/desktop')
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
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    include: /\.min\.js$/,
                    minify(file, sourceMap) {
                        const extractedComments = []
                        const {
                            error,
                            map,
                            code,
                            warnings
                        } = require('uglify-js').minify(file, {
                            warnings: false,
                            compress: {
                                sequences: true,
                                dead_code: true,
                                conditionals: true,
                                booleans: true,
                                unused: true,
                                if_return: true,
                                join_vars: true,
                                drop_console: true
                            },
                            toplevel: false,
                            ie8: false,
                            keep_fnames: false
                        })

                        return {error, map, code, warnings, extractedComments}
                    }
                })
            ]
        },
        target: 'electron-main',

        node: {
            __dirname: false
        }
    }
}
