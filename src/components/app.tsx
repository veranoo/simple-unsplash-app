import React from 'react';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

// ES Modules syntax
import Unsplash from 'unsplash-js';
// require syntax
const unsplash = new Unsplash({
  accessKey: process.env.ACCES_KEY
});

unsplash.collections
  .listCollections()
  .then(res => res.json())
  .then(response => {
    console.log(response);
  });

// unsplash.categories.listCategories().then(response => {
//   console.log(response);
// });

const About = () => <div>About</div>;
const Users = () => <div>Users</div>;
const Home = () => <div>Home</div>;

const App: React.FC = () => {
  return (
    <>
      <Reset />
      <Router>
        <div>
          <nav>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <Link to='/users'>Users</Link>
          </nav>
          <Switch>
            <Route path='/about'>
              <About />
            </Route>
            <Route path='/users'>
              <Users />
            </Route>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
};

export default App;
