const fs = require('fs');
const ejs = require('ejs');
const rimraf = require('rimraf');
const webpack = require('webpack');
const Browsersync = require('browser-sync');
const task = require('./task');
// const connectHistoryApiFallback = require('connect-history-api-fallback');
const config = require('./config');

global.HMR = !process.argv.includes('--no-hmr');
module.exports = task('run', () => new Promise((resolve) => {
    rimraf.sync('public/dist/*', { nosort: true, dot: true });
    let count = 0;
    const bs = Browsersync.create();
    const webpackConfig = require('./webpack.config');
    const compiler = webpack(webpackConfig);
    const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: webpackConfig.stats
    });
    compiler.hooks.done.tap('done', (stats) => {
        const bundle = stats.compilation.chunks.find(x=>x.name==='main').files[0];
        const template = fs.readFileSync('./public/index.ejs', 'utf8');
        const render = ejs.compile(template, {filename: './public/index.ejs'});
        const output = render({debug: true, bundle: `/dist/${bundle}`}, config);
        fs.writeFileSync('./public/index.html', output, 'utf8');

        count += 1;
        if(count === 1){
            bs.init({
                port: process.env.PORT || 3000,
                ui: {port: Number(process.env.PORT || 3000) + 1},
                server: {
                    baseDir: 'public',
                    middleware: [
                        webpackDevMiddleware,
                        require('webpack-hot-middleware')(compiler),
                        require('connect-history-api-fallback')
                    ]
                }
            }, resolve);
        }
    });
}));
