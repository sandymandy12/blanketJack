import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Home, Game, Contact, Join } from "./pages/index";
import ReactNotification from 'react-notifications-component';

function App() {
  
  return (
    <div className="App">
      <ReactNotification />
      <Router>
        <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/join" exact component={() => <Join />} />
          <Route path="/game/:id" exact component={() => <Game />} />          
          <Route path="/contact" exact component={() => <Contact />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
