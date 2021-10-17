import './Nav.css';
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Contract } from '../scripts/contract';
// import Blockies from "react-blockies";


const bj = new Contract();

function Game(props) {

    const { id } = useParams();

    const [info, setInfo] = useState({});
    const [gameState, setGameState] = useState(''); // open, started, dealing, betting
    const [players, setPlayers] = useState();

    const getGameInfo = async () => {
        const result = await bj.gameInfo(id);
        setInfo(result);
        console.log('Game info',info);
    }

    const getPlayers = async () => {
        let players = []
        for (let i= 0; i < info.size; i++) {
            const p = await bj.player(id, i);
            players.push(p);
        }

        setPlayers(players);
        
    }

    useEffect(() => {
        getGameInfo();
        info.active ? setGameState('started') : setGameState('open');
    }, [])


    const join = async () => {
        await bj.join(id);
        setGameState('open');
    }

    const start = async () => {
        if (gameState !== 'open') {
            console.log('state needs to be open')
            return;
        }
        await bj.start(id);
        setGameState('started');

    }

    const deal = async () => {
        await getPlayers();
        await bj.deal(id, info.size);
        setGameState('dealing')
    }

    const bet = async () => {
        
    }

    return (
        <div class='game__start' id={info.id}>
            <button class='game_button border btn-dark bg-primary ' onClick={join} hidden={gameState!=='open'}>
              Join
              <span id='button_value'>{info.active === true ? "(started)" : ""}</span>
            </button>

            <button class='game_button border btn-dark bg-primary' onClick={start} hidden={gameState!=='open'}>
              Start
              <span id='button_value'>{info.active === true ? "(started)" : ""}</span>
            </button>

            <button class='game_button border btn-dark bg-primary' onClick={deal} hidden={gameState!=='started'}>
              Deal
              <span id='button_value'></span>
            </button>

            <div class='cards'>

            </div>
        </div>
        
    )
}

export default (Game);