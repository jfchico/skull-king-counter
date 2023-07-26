import React, { useState, useEffect } from 'react';
import PlayerNamesScreen from './PlayerNamesScreen';
import ScoreTable from './ScoreTable';
import Cookies from 'js-cookie';

import './MainScreen.less';

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 6;
const COOKIE_NAME = 'skullKingGame';

const MainScreen = () => {
  const [numPlayers, setNumPlayers] = useState(MIN_PLAYERS);
  const [showPlayerNames, setShowPlayerNames] = useState(false);
  const [showScoreTable, setShowScoreTable] = useState(false);
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState([]);

  // useEffect(() => {
  //   // Cargar el estado de la partida desde las cookies al cargar el componente
  //   const loadedGame = loadGameFromCookies();
  //   if (loadedGame && loadedGame.length) {
  //     console.log("🚀 ~ file: MainScreen.js:17 ~ useEffect ~ loadedGame:", JSON.parse(loadedGame));
  //     setGame(loadedGame);
  //     setShowScoreTable(true);
  //   }
  // }, []);

  useEffect(() => {
    generateGame();
  }, [players]);

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

  const generateGame = () => {
    const newGame = [];
    for (let i = 1; i <= 10; i++) {
      const round = [];
      players.forEach(player => {
        round.push({playerName: player, bet: 0, score: 0, wins: 0});
      });
      newGame.push(round);
    }

    setGame(newGame);
  };

  const handleStartGameWithPlayers = (playerNames) => {
    // Asignar nombres de jugadores y mostrar la tabla de puntuaciones
    // playerNames es un array con los nombres de los jugadores en el mismo orden que sus índices en la tabla
    setShowPlayerNames(false);
    setPlayers(playerNames);

    // Mostrar la tabla de puntuaciones
    setShowScoreTable(true);
  };

  const saveGameToCookies = () => {
    // Guardar el estado de la partida en las cookies
    Cookies.remove(COOKIE_NAME, { path: '' });
    Cookies.set(COOKIE_NAME, JSON.stringify(game), { path: '' });
    // Cookies.set(COOKIE_NAME, JSON.stringify(game));
  };

  const loadGameFromCookies = () => {
    // Cargar el estado de la partida desde las cookies
    const gameData = Cookies.get(COOKIE_NAME);
    return gameData;
  };

  const newGame = () => {
    setNumPlayers(MIN_PLAYERS);
    setShowPlayerNames(false);
    setShowScoreTable(false);
    setPlayers([]);
    setGame([]);
  }

  const drawOptions = () => {
    const options = [];
    for(let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) {
      options.push(<option key={i} value={i}>{i}</option>);
    }

    return options;
  }

  return (
    <div className="main-screen-container">
      <h1 className="main-title">Skull King - Contador de Puntos</h1>
      <button className="delete-game" onClick={newGame}>Nuevo Juego</button>
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
      {showPlayerNames && (
        <PlayerNamesScreen numPlayers={numPlayers} onStartGame={handleStartGameWithPlayers} />
      )}
      {showScoreTable && (
        <ScoreTable
          game={[...game]}
          setGame={setGame}
        />
      )}
    </div>
  );
};

export default MainScreen;
