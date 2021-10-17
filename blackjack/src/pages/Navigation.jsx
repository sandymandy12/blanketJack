import { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import  { Contract } from '../scripts/contract';



const bj = new Contract();
const address = bj.address;
const href = `https://alfajores-blockscout.celo-testnet.org/address/${address}/transactions`;

function Navigation(props) {

  const [balance, setBalance] = useState([]);

  const updateBalance = async () => {
    const bal = await bj.balance();
    setBalance(bal);
  }
  useEffect(() => {
    updateBalance();
  },[])

  return (
    <div className="navigation">
      <nav class="navbar navbar-expand navbar-dark bg-dark">
        <div class="container">
          <Link class="navbar-brand glow" to="/">
            BlackJack
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
                <span id="balance" href={href}>{balance.balance} </span>
                [ {String(balance.network).toUpperCase()} ]
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