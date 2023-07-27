import React, { useEffect, useState } from 'react';

import './MainScreen.less';
import './PlayerNamesScreen.less';

const PlayerNamesScreen = ({ numPlayers, onStartGame }) => {
  const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let i = 1; i <= numPlayers; i++) {
      arr.push('pepe');
    }
    setPlayerNames(arr);
  }, [numPlayers]); 



  const handlePlayerNameChange = (index, event) => {
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = event.target.value;
    setPlayerNames(updatedPlayerNames);
  };

  const handleStartGame = () => {
    // Validar que se hayan introducido todos los nombres de los jugadores
    if (playerNames.some(name => name.trim() === '')) {
      alert('Por favor, introduce los nombres de todos los jugadores.');
    } else {
      onStartGame(playerNames);
    }
  };

  return (
    <div className="player-names-container">
      <h2>Jugadores</h2>
      <div className="player-names-input-container">
        {playerNames.map((name, index) => (
          <input
            className="player-name-input"
            key={index}
            type="text"
            placeholder={`Jugador ${index + 1}`}
            value={name}
            onChange={(e) => handlePlayerNameChange(index, e)}
          />
        ))}
      </div>
      <button className="start-button" onClick={handleStartGame}>Iniciar Juego</button>
    </div>
  );
};

export default PlayerNamesScreen;
