/**
 * Setup the global elements of the react app:
 *  - redux store
 *  - react router
 *  - main component: App
 */
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { initialState } from 'store/initialStateSlice';
import configureAppStore from './store/store';

import { createCartoSlice } from '@carto/react-redux';

const store = configureAppStore();

store.reducerManager.add('carto', createCartoSlice(initialState));

const { domain, clientId, scopes, audience } = initialState.oauth;

if (!clientId) {
  alert('Need to define a clientId. Please check the file store/initalStateSlice.js');
}

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    scopes={scopes.join(' ')}
    audience={audience}
    cacheLocation='localstorage'
  >
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
