import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/app';

const rootElement = document.querySelector('.app');

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
