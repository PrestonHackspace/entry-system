import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './components/App';
import { NewApiHub } from './api';

// import './css/style.css';
// import './fonts/material-icons.css';

async function main() {
  const api = await NewApiHub();

  const bootstrap = await api.configApi(null).bootstrap();

  const root = document.getElementById('root');

  ReactDOM.render(<App bootstrap={bootstrap} apiHub={api} />, root);
}

window.addEventListener('load', main);
