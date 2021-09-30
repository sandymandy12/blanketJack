import { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import  { Contract } from '../scripts/contract';

const address = window.celo.selectedAddress;
const href = `https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`;

const bj = new Contract();

function Navigation(props) {

  const [balance, setBalance] = useState(0);

  const updateBalance = async () => {
    await bj.connectWallet();
    const bal = await bj.balance();
    setBalance(bal);
  }
  useEffect(() => {
    updateBalance();
  },[balance])

  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand glow" to="/">
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
                  props.location.pathname === "/join" ? "active" : ""
                }`}
              >
                <Link class="nav-link" to="/join">
                  Join
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
                
                <span id="balance" href={href}>{balance} </span>
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


export default withRouter(Navigation);