import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation, Home, Game, Contact, Join } from "./pages/index";
import ReactNotification from 'react-notifications-component';
import { Contract } from './scripts/contract';


function App() {
  
  let mm = window.ethereum; // metamask
  mm.enable(); //

  const [ chain, setChain ] = useState(mm.chainId);
  const [ address, setAddress ] = useState(mm.selectedAddress);

  

  mm.on('chainChanged', (newChain) => {
    setChain(newChain);

  });

  mm.on('accountsChanged', (accounts) => {
    setAddress(accounts);
  })


  // const blackjack = new Contract(chain, address);



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
