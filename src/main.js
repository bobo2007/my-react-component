import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import router from './router';
import history from './history';

let routes = require('./routes.json').default;

const container = document.getElementById('container');

function renderComponent(compont){
    ReactDom.render(<Provider store={store}>{component}</Provider>, container);
}

function render(location){
    router.resolve(routes, location)
    .then(renderComponent)
    .catch(error => router.resolve(routes, {...location, error}).then(renderComponent));
}

history.listen(render);
render(history.location);
if(module.hot){
    module.hot.accept('./routes.json', () => {
        routes = require('./routes.json').default;
        render(history.location);
    });
}
