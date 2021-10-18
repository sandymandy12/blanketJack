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
    const [jModelOpen, setJModelOpen] = useState(false);


    const handleInput = (e)  => {
        setBuyIn((e.target.value));
      }

    const getGameInfo = async () => {
        console.log('gameid-', id)
        const info = await bj.gameInfo(id);
        const status = await bj.status(id)
        setInfo(info);
        setGameState(status);
        console.log('status', status);
    }

    const getPlayers = async () => {
        let players = []
        for (let i= 0; i < info.size; i++) {
            const p = await bj.player(id, i);
            players.push(p);
        }

        setPlayers(players);
        
    }

    const getStatus = async (_id) => {
        const status = await bj.status(id);
        console.log(status);
        return status;
    }

    useEffect(() => {
        getGameInfo();
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
    }

    const bet = async () => {
        
    }

    return (
        <div class='game__start' id={info.id}>
            <h2>{gameState}</h2>
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

function joinModal(props) {
    return (
        <Modal isOpen={props.open}>
            <h2>{props.gameId}</h2>
        </Modal>
    )
}

export default (Game);