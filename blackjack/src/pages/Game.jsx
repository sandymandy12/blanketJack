import './Nav.css';
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Contract } from '../scripts/contract';
import Modal from 'react-modal';

// import Blockies from "react-blockies";

let network = parseInt(window.ethereum.chainId, 16);
const bj = new Contract(network);

function Game(props) {

    const { id } = useParams();

    const [info, setInfo] = useState({});
    const [gameState, setGameState] = useState(''); // open, started, dealing, betting
    const [players, setPlayers] = useState();
    const [buyIn, setBuyIn] = useState(1.00);


    const handleInput = async (e)  => {
        setBuyIn((e.target.value));
      }

    const getGameInfo = async () => {
        const info = await bj.gameInfo(id);
        console.log(info);
        setInfo(info);
        setGameState(await bj.status(id));
    }

    const buyInPlaceholder = () => {
        console('buy in placeholder - ', buyIn)
        return 'Buy in for ';
    }

    const getPlayers = async () => {
        let players = await bj.players();
        setPlayers(players);

    }

    useEffect(() => {
        getGameInfo();
    }, [])

    const join = async () => {
        console.log('buyIn from join - ', buyIn);
        await bj.join(id, buyIn);
        // setGameState(state);
    }

    const start = async () => {
        if (gameState !== 'OPEN') {
            console.log('state needs to be open')
            return;
        }
        await bj.start(id);
        setGameState(await bj.status());
    }

    const deal = async () => {
        await getPlayers();
        await bj.deal(id, info.size);
        setGameState(await bj.status());
    }

    const bet = async (_amount) => {
        await bj.bet(_amount);
    }

    return (
        <div class='game__start' id={info.id}>
            <h2>{gameState} | Players [{info.size}] | Buy-In [{info.minimumBet}]</h2>
            <input placeholder='Buy in' onChange={handleInput}/>
            <button class='game_button border btn-dark bg-primary ' onClick={join} hidden={gameState!=='OPEN'}>
              Join
              <span id='button_value'>{info.active === true ? "(started)" : ""}</span>
            </button>
            
            <button class='game_button border btn-dark bg-primary' onClick={start} hidden={gameState!=='OPEN'}>
              Start
              <span id='button_value'>{info.active === true ? "(started)" : ""}</span>
            </button>

            <button class='game_button border btn-dark bg-primary' onClick={deal} hidden={gameState!=='DEALING'}>
              Deal
              <span id='button_value'></span>
            </button>

            <div class='cards'>

            </div>
        </div>
        
    )
}


export default (Game);