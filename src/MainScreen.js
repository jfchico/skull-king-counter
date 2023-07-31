import React, { useState, useEffect } from 'react';
import PlayerNamesScreen from './PlayerNamesScreen';
import ScoreTable from './ScoreTable';
import { GiCrownedSkull, GiSkullBolt } from 'react-icons/gi';

import Modal from './Modal';

import './MainScreen.less';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 10;
const COOKIE_NAME = 'skullKingGame';

const MainScreen = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const [numPlayers, setNumPlayers] = useState(MIN_PLAYERS);
  const [showPlayerNames, setShowPlayerNames] = useState(false);
  const [showScoreTable, setShowScoreTable] = useState(false);
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState([]);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false);

  useEffect(() => {
    // Cargar el estado de la partida desde las cookies al cargar el componente
    const loadedGame = loadGame();
    if (!game[0]?.length && loadedGame.game && loadedGame.game[0]?.length) {
      setGame(loadedGame.game);
      setCurrentRound(loadedGame.currentRound);
      setShowScoreTable(true);
    }
  }, []);

  useEffect(() => {
    saveGame();
  }, [game]);

  const handleNumPlayersChange = (event) => {
    setNumPlayers(event.target.value);
  };

  const handleStartGame = () => {
    if (numPlayers >= MIN_PLAYERS && numPlayers <= MAX_PLAYERS) {
      setShowPlayerNames(true);
    } else {
      alert('El número de jugadores debe estar entre 3 y 6.');
    }
  };

  const getNumberOfRounds = (players) => {
    const cards = 66;
    let numRounds = 10;
    const numPlayers = players.length;

    if (numPlayers > 6) {
      numRounds= Math.floor(cards / numPlayers);
    }

    return numRounds;
  };

  const generateGame = (players) => {
    const newGame = [];
    for (let i = 1; i <= getNumberOfRounds(players); i++) {
      const round = [];
      players.forEach(player => {
        round.push({playerName: player, bet: '', score: 0, wins: '', mermaidOnSkull: 0, skullOnPirates: 0});
      });
      newGame.push(round);
    }

    setGame(newGame);
  };

  const handleStartGameWithPlayers = (playerNames) => {
    // Asignar nombres de jugadores y mostrar la tabla de puntuaciones
    // playerNames es un array con los nombres de los jugadores en el mismo orden que sus índices en la tabla
    setShowPlayerNames(false);
    generateGame(playerNames);

    // Mostrar la tabla de puntuaciones
    setShowScoreTable(true);
  };

  const saveGame = () => {
    localStorage.setItem(COOKIE_NAME, JSON.stringify({currentRound, game}));
  };

  const loadGame = () => {
    const gameData = localStorage.getItem(COOKIE_NAME);
    return JSON.parse(gameData);
  };

  const newGame = () => {
    setNumPlayers(MIN_PLAYERS);
    setShowPlayerNames(false);
    setShowScoreTable(false);
    setPlayers([]);
    setGame([]);
    setCurrentRound(0);
  }

  const drawOptions = () => {
    const options = [];
    for(let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }

    return options;
  }

  const handleCloseNewGameModal = () => {
    setIsNewGameModalOpen(false);
  }

  const handleOpenNewGameModal = () => {
    setIsNewGameModalOpen(true);
  }

  const handleStartNewGame = () => {
    handleCloseNewGameModal();
    newGame();
  }

  return (
    <div className="main-screen-container">
      <h1 className="main-title">Skull <GiCrownedSkull/> King</h1>
      {showScoreTable &&
        <button className="new-game-button" onClick={handleOpenNewGameModal}><GiSkullBolt/></button>
      }
      {!showPlayerNames && !showScoreTable && (
        <div className="form-container">
          <label htmlFor="numPlayers" className="form-label">
            Número de jugadores:
          </label>
          <select
            id="numPlayers"
            value={numPlayers}
            onChange={handleNumPlayersChange}
            className="form-select"
          >
            {drawOptions()}
          </select>
          <button className="start-button" onClick={handleStartGame}>
            Iniciar Juego
          </button>
        </div>
      )}
      {showPlayerNames && !showScoreTable && (
        <PlayerNamesScreen numPlayers={numPlayers} onStartGame={handleStartGameWithPlayers} />
      )}
      {showScoreTable && (
        <ScoreTable
          game={[...game]}
          setGame={setGame}
          currentRound={currentRound}
          setCurrentRound={setCurrentRound}
        />
      )}
      {isNewGameModalOpen && (
        <Modal isOpen={isNewGameModalOpen} onClose={handleCloseNewGameModal}>
          <h2>¿Seguro que quieres empezar un juego nuevo?</h2>
          <div className="new-game-buttons-container">
            <button className="start-button" onClick={handleStartNewGame}>Sí!</button>
            <button className="cancel-button" onClick={handleCloseNewGameModal}>Mmm, mejor no</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MainScreen;
