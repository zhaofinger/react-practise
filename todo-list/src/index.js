/**
 * @Author: zhaoFinger
 * @Date: 2017-09-15 14:22:03
 * @Last Modified by:   zhaoFinger
 * @Last Modified time: 2017-09-15 14:22:03
 */

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import todoApp from './reducers';

let store = createStore(todoApp);

let rootElement = document.getElementById('root');
render(
	<Provider store={store}>
		<App />
	</Provider>,
	rootElement
);