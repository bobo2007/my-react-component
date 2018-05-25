import React from 'react';

function decodeParam(val){
    if(!(typeof val === 'string' || val.length === 0 )){
        return val;
    }
    try{
        return decodeURIComponent(val);
    } catch (err){
        if(err instanceof URIError){
            err.message = `Failed to decode param '${val}'`;
            err.status = 400;
        }
        throw err;
    }
}

function matchURI(route, path){
    const match = route.pattern.exec(path);
    if(!match){
        return null;
    }
     const params = Object.create(null);
     for(let i=1; i < match.length; i += 1){
         params[route.keys[i-1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
     }
     return params;
}

function resolve(routes, context){
    for(const route of routes){
        const params = matchURI(route, context.error ? '/error' : context.pathname);
        if(!params){
            continue;
        }
        if(route.data){
            // 加载数据
            const keys = Object.keys(route.data);
            return Promise.all([
                route.load(),
                ...keys.map((key) => {
                    const query = route.data[key];
                    const method = query.substring(0, query.indexof(' '));
                    let url = query.substr(query.indexof(' ') + 1);
                    Object.keys(params).forEach((k) => {
                        url = url.replace(`${k}`, params[k]);
                    });
                    return fetch(url, {method}).then(resp => resp.json);
                })
            ]).then()
        }
        return route.load().then(Page => <Page route={{...route, params}} error={context.error}/>);
    }
    const error = new Error('Page not found');
    error.status = 404;
    return Promise.reject(error);
}

export default resolve;