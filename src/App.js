import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Wallet from './pages/Wallet';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Switch>
            <Route path="/" exact component={ Login } />
            <Route path="/carteira" component={ Wallet } />
          </Switch>
        </HashRouter>
      </div>);
  }
}

export default App;
