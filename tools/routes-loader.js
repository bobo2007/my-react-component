const toRegExp = require('path-to-regexp');

function escape(text){
    return text.replace('\'','\\\'').replace('\\', '\\\\');
}

module.exports = function routesLoader(source){
    this.cacheable();
    const output = ['[\n'];
    const routes = JSON.parse(source);
    for(const route of routes){
        const keys = [];
        const pattern = toRegExp(route.path, keys);
        const require = route.chunk && route.chunk === 'main' ? 
        module => `Promise.resolve(require('${escape(module)}').default)` : 
        module => `new Promise(function(resolve, reject){
            try{
                require.ensure
            }
        })`
    }
}