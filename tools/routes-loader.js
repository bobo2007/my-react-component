const toRegExp = require('path-to-regexp');

function escape(text){
    return text.replace('\'','\\\'').replace('\\', '\\\\');
}

    // {
    //     path: '/about',
    //     pattern: /^\\/about(?:\/(?=$))?$/i,
    //     keys: [],
    //     page: './about',
    //     data: { task: 'GET /api/tasks/$id' },
    //     load: function () { return new Promise(resolve => require(['./about'], resolve)); }
    // }

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
                import('${escape(module)}').then(() => resolve('${escape(module)}'))
            } catch (err){
                reject(err);  
            }
        })`;
        output.push('{\n');
        output.push(`path: '${escape(route.path)}', \n`);
        output.push(`pattern: ${pattern.toString()}, \n`);
        output.push(`keys: ${JSON.stringify(keys)}, \n`);
        output.push(`page: '${escape(route.page)}', \n`);
        if(route.data){
            output.push(`data: ${JSON.stringify(route.data)}, \n`);
        }
        output.push(`load(){\n  return ${require(route.page)};  \n}, \n`);
        output.push('},\n');
    }
    output.push(']');
    return `export default ${output.join('')}`;
}