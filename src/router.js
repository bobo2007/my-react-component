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
    
}

function resolve(routes, context){
    for(const route of routes){
        const params = matchURI(route, context.error ? '/error' : context.pathname);
        
    }
}