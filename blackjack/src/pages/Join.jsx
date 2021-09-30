import React, { useState, useEffect } from "react";
import './Nav.css';
import { Contract, listGames } from '../scripts/contract';
import Blockies from "react-blockies";
import { useTable } from 'react-table';


const ERC20_DECIMALS = 18;

const bj = new Contract();


const blockies = (_address) => {
  const href = `https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions`;
  return(
    <a class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0" href={href}>
      <Blockies seed={_address} size={8} scale={8} /> 
    </a>
  )
}

const createGame = async () => {
  bj.connectWallet();
  await bj.create({
    contract: bj.contract,
    kit: bj.kit
  });
}

function Join() {

  const [games, setGames] = useState([])


  useEffect(async () => {
    const g = await listGames(bj.contract);
    setGames(g.gameInfo);
  })


  return (
    <div className="game">
      <div class="container">
        <div className="game__create position-sticky" onClick={createGame}>
          <button class="nav-link border btn-dark rounded-pill">
            <span id="create"></span>
            Create game
          </button>
        </div>
        <div class="row align-items-center my-5">
          
          <div class="col-sm-5">
            
            <ul className="game__listings hover-shadow">
              {games.map(game => {
                return gameTemplate(game);
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function gameTemplate(_game) {
  return (
    <div class="card mb-4 rounded" >
      
      <div className='game__item' class="card-body bg-dark">
        <ul class='list-group list-group-horizontal'>
          <li className="game__item_block">
            {blockies(_game.address)}
          </li>


          <span class='game__info text-light' id='players'>
            <p>Players: {_game.size}</p>
          </span>  
          
          <span  class='game__info text-light' id='buyIn' hidden={!_game.active}>
            <p>Buy in: {_game.buyIn}</p>
          </span>
          

          <li class='btn'>
            <button class='join_button border btn-dark bg-primary rounded-pill' disabled={_game.active}>
              Join
              <span id='button_value' value={_game.active == false ? "(started)" : ""} />
            </button>
          </li>

        </ul> 
        
      </div>
    </div>
  )
}

export default Join;