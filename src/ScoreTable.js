import React, { useState } from 'react';

const ScoreTable = ({ game, setGame }) => {
  const [currentRound, setCurrentRound] = useState(0);

  const drawCell = (roundIndex, playerIndex) => {
    if (currentRound === roundIndex) {
      // editable
      return (
        <>
          <input
            type="number"
            value={game[roundIndex][playerIndex].bet}
            onChange={(e) =>
              onScoreChange(roundIndex, playerIndex, 'bet', e.target.value)
            }
          />
          <input
            type="number"
            value={game[roundIndex][playerIndex].wins}
            onChange={(e) =>
              onScoreChange(roundIndex, playerIndex, 'wins', e.target.value)
            }
          />
        </>
      );
    } else if (currentRound > roundIndex){
      return (<span>{game[roundIndex][playerIndex].bet + ' | ' + game[roundIndex][playerIndex].score}</span>);
    } else {
      // blank
      return (<span/>);
    }
  };

  const calculateScore = (roundIndex, playerIndex) => {
    const playerRound = game[roundIndex][playerIndex];
    let previousScore = 0;
    if(roundIndex > 0) {
      previousScore = game[roundIndex - 1][playerIndex].score;
    }
    
    if (playerRound.bet === 0) {
      if (playerRound.wins === 0) {
        playerRound.score = previousScore + 10 * (roundIndex + 1);
      } else {
        playerRound.score = previousScore - 10 * (roundIndex + 1);
      }
    } else if (playerRound.wins === playerRound.bet) {
      playerRound.score = previousScore + playerRound.bet * 20;
    } else {
      playerRound.score = previousScore - Math.abs(playerRound.bet - playerRound.wins) * 10;
    }
    
    game[roundIndex][playerIndex] = playerRound;
    setGame(game);
  }

  const onScoreChange = (roundIndex, playerIndex, field, value) => {
    value = parseInt(value);
    if (value >= 0) {
      game[roundIndex][playerIndex][field] = value;
      setGame(game);
    }
  };

  const onNextRound = () => {
    game[currentRound].forEach((_, playerIndex) => {
      calculateScore(currentRound, playerIndex);
    });
    setCurrentRound(currentRound + 1);
  };

  const getPlayersNames = () => {
    return game[0].reduce((acc, playerObj) => {
      acc.push(playerObj.playerName);
      return acc;
    }, []);
  }

  return (
    <div className="score-table">
      {game.length && 
        <table>
          <thead>
            <tr>
              <th>Ronda</th>
              {getPlayersNames().map((player, index) => (
                <th key={index}>{player}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {game.map((round, roundIndex) => (
              <tr key={roundIndex}>
                <td>Ronda {roundIndex + 1}</td>
                {getPlayersNames().map((_, playerIndex) => (
                  <td key={playerIndex}>
                    {drawCell(roundIndex, playerIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      }
      <button className="next-round-button" onClick={onNextRound}>Siguiente ronda</button>
    </div>
  );
};

export default ScoreTable;
