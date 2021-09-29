import { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import Blockies from "react-blockies";

import { getBalance } from '../scripts/contract';

const blockStyle = {
  position: 'absolute', top: '50%',
  transform: 'translate(-50%, -50%)'
}
const _address = window.celo.selectedAddress;
const href = `https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions`;

function Navigation(props) {

  const [balance, setBalance] = useState(0);
  const updateBalance = async() => {
    const bal = await getBalance();
    setBalance(bal);
  }
  useEffect(() => {
    updateBalance();
  },[balance])

  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand" to="/">
            Blanket Jacket
          </Link>
          
          <div>
            <ul class="navbar-nav ml-auto">
              <li
                class={`nav-item  ${
                  props.location.pathname === "/" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/">
                  Home
                  <span class="sr-only">(current)</span>
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/game" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/games">
                  Games
                </Link>
              </li>
              <li
                class={`nav-item  ${
                  props.location.pathname === "/contact" ? "active" : ""
                }`}
              >
              </li>
              <li>
              <button class="nav-link border btn-dark rounded-pill">
                
                <span id="balance" >{balance} </span>
                cUSD
              </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

/**
 * 
 * <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0" >
                  <Blockies seed={_address} size={6} scale={8} href={href} /> 
                </div>
 */

export default withRouter(Navigation);