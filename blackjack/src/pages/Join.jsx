import React, { useState, useEffect } from "react";
import './Nav.css';
import { Contract } from '../scripts/contract';
import Blockies from "react-blockies";
import { Link } from "react-router-dom";


const bj = new Contract();

const blockies = (_address) => {
  const href = `https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions`;
  return(
    <a class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0" href={href}>
      <Blockies seed={_address} size={8} scale={8} /> 
    </a>
  )
}

function Join() {

  const [total, setTotal] = useState(0);
  const [games, setGames] = useState([]);
  const [buyIn, setBuyIn] = useState(1.00);


  const getGameInfo = async () => {
    const t = await bj.total();
    const info = await bj.listGames();

    setTotal(t);

    console.log(t)

    setGames(info);
  }

  const handleInput = (e)  => {
    setBuyIn((e.target.value));
  }


  const createGame = async (e) => {
    await bj.create();
  }



  useEffect(() => {
    getGameInfo();
  }, [])

  return (
    <div className="game">
      <div class="container">
        <div className="game__create position-sticky">
          
          <button class='game__create_form border btn-dark' onClick={createGame}>
            CREATE GAME ({total} total)
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
    <div class="card mb-4 " >
      
      <div className='game__item' class="card-body bg-dark">
        <ul class='list-group list-group-horizontal'>
          <div className="game__item_block">
            {blockies(_game.address)}
          </div>


          <span class='game__info text-light' id='gameId'>
            <p>Game {_game.id}</p>
          </span>  

          <span class='game__info text-light' id='players'>
            <p>Players: {_game.size}</p>
          </span> 
          
          <span  class='game__info text-light' id='buyIn' hidden={!_game.active}>
            <p>Buy in: {_game.buyIn}</p>
          </span>
          

          <Link to={'/game/' + _game.id}>
            <button class='join_button border btn-dark bg-primary rounded-pill' disabled={_game.active}>
              Join
              <span id='button_value' value={_game.active == false ? "(started)" : ""} />
            </button>
          </Link>

        </ul> 
        
      </div>
    </div>
  )
}

export default Join;