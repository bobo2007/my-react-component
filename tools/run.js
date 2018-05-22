const fs = require('fs');
const ejs = require('ejs');
const rimraf = require('rimraf');
const webpack = require('webpack');
const Browsersync = require('browser-sync');
const task = require('./task');
const webpackConfig = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const connectHistoryApiFallback = require('connect-history-api-fallback');
const config = require('./config');

global.HMR = !process.argv.includes('--no-hmr');
module.exports = task('run', () => new Promise((resolve) => {
    rimraf.sync('public/dist/*', { nosort: true, dot: true });
    let count = 0;
    const bs = Browsersync.create();
    
}));