import React from 'react';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Photo } from '../pages/photo';
import { Home } from '../pages/home';
import { Section } from '../pages/section';
import { createGlobalStyle } from 'styled-components';
import { UnsplashProvider } from '../providers/unsplash-provider';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial,sans-serif ;
  }
`;

const App: React.FC = () => {
  return (
    <UnsplashProvider>
      <Reset />
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path='/photo/:id?' component={Photo} />
          <Route path='/section/:id?' component={Section} />
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </UnsplashProvider>
  );
};

export default App;
