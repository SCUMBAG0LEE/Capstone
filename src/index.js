// This file serves as the entry point of the JavaScript application. It initializes the application and renders the Home component into the root div of the HTML file.

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Predict from './components/Predict';
import AuthPage from './components/AuthPage';
import About from './components/About';
import NotFound from './components/NotFound';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/predict" component={Predict} />
        <Route path="/login" component={AuthPage} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);