import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/app';

const rootElement = document.querySelector('.app');

window['fbAsyncInit'] = () => {
  window['FB'].init({
    appId: '1435646576649598',
    status: true,
    xfbml: true,
    version: 'v2.7' // or v2.6, v2.5, v2.4, v2.3
  });
};

const render = (Component: React.FC) => {
  ReactDOM.render(<Component />, rootElement);
};

render(App);

if (module.hot) {
  module.hot.accept('./components/app', async () => {
    const NextApp = await import('./components/app');
    render(NextApp.default);
  });
}
