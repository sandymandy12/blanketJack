import React, { useEffect } from 'react';
import './App.css';
import { connectCeloWallet } from './scripts/contract';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Home, Game, Contact } from "./pages/index";
import ReactNotification from 'react-notifications-component';

function App() {
  
  useEffect(() =>{
    connectCeloWallet();
  },[])
  
  return (
    <div className="App">
      <Router>
      <Navigation />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/games" exact component={() => <Game />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <ReactNotification />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
