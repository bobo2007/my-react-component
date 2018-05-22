const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('webpack-assets-manifest');
const pkg = require('../package.json');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR;
const babelConfig = Object.assign({}, pkg.babel, {
    babelrc: false,
    cacheDirectory: useHMR,
    presets: pkg.babel.presets.map(x => x === 'env' ? ['env', {"es2015": {"modules": false}}] : x)
});
const reScript = /\.(js|jsx)$/;
const reImage = /\.(bmp|gif|jpg|png|jpeg|svg)$/;


const config = {
    mode: 'none',
    context: path.resolve(__dirname, '../src'),
    entry: [
        './main.js'
    ],
    output: {
        path: path.resolve(__dirname, '../public/dist'),
        publicPath: isDebug ? `http://localhost:${process.env.PORT || 3000}/dist/` : '/dist/',
        filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
        chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
        sourcePrefix: ' '
    },
    devtool: isDebug ? 'source-map' : false,
    stats: {
        colors: true,
        reasons: isDebug,
        hash: isVerbose,
        version: isVerbose,
        timings: true,
        chunks: isVerbose,
        chunkModules: isVerbose,
        cached: isVerbose,
        cachedAssets: isVerbose
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
            __DEV__: isDebug
        }),
        new AssetsPlugin({
            path: path.resolve(__dirname, '../public/dist'),
            filename: 'assets.json',
            prettyPrint: true
        }),
        new webpack.LoaderOptionsPlugin({
            debug: isDebug,
            minimize: !isDebug
        })
    ],
    module: {
        rules: [
            {
                test: reScript,
                include: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname, '../component')
                ],
                loader: 'babel-loader',
                options: babelConfig
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: isDebug,
                            importLoaders: true,
                            modules: true,
                            localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
                            minimize: !isDebug
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                include: [
                    path.resolve(__dirname, '../src/routes.json')
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelConfig
                    },
                    {
                        loader: path.resolve(__dirname, './routes-loader.js')
                    }
                ]
            },
            {
                test: /\.md$/,
                loader: path.resolve(__dirname, '../markdown-loader.js')
            },
            {
                test: reImage,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            },
            {
                test: /\.(eot|ttf|wav|mp3)$/,
                loader: 'file-loader'
            }
        ]
    }
}
// release (production) mode
if(!isDebug){
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warning: isVerbose
        }
    }));
    config.plugins.push(new webpack.optimize.AggressiveMergingPlugin())
}

// HMR
if(isDebug && useHMR){
    babelConfig.plugins.unshift('react-hot-loader/babel');
    // Add 'webpack-hot-middleware/client' into the entry array. This connects to the server to receive notifications when the bundle rebuilds and then updates your client bundle accordingly.
    config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
    config.plugins.push(new webpack.HotModuleReplacementPlugin()); // Enables Hot Module Replacement
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin()); // 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
}

module.exports = config;

