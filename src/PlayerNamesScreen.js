import React, { useEffect, useState } from 'react';

const PlayerNamesScreen = ({ numPlayers, onStartGame }) => {
  const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let i = 1; i <= numPlayers; i++) {
      arr.push('jugador_' + i);
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
    <div>
      <h2>Introduce los nombres de los jugadores:</h2>
      <div>
        {playerNames.map((name, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Jugador ${index + 1}`}
            value={name}
            onChange={(e) => handlePlayerNameChange(index, e)}
          />
        ))}
      </div>
      <button onClick={handleStartGame}>Iniciar Juego</button>
    </div>
  );
};

export default PlayerNamesScreen;
