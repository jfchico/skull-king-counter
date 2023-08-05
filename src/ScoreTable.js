import React, { useState, useEffect } from 'react';
import { GiCrownedSkull, GiMermaid, GiPirateSkull } from 'react-icons/gi';
import { AiFillMinusCircle } from 'react-icons/ai';
import { MdViewList, MdViewModule } from 'react-icons/md';
import useDetectKeyboardOpen from 'use-detect-keyboard-open';
import Modal from './Modal';

import './MainScreen.less';
import './ScoreTable.less';

const ScoreTable = ({ game, setGame, currentRound, setCurrentRound }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numOfPirates, setNumOfPirates] = useState(0);
  const [numOfMermaids, setNumOfMermaids] = useState(0);
  const [isDisabledPirates, setIsDisabledPirates] = useState(false);
  const [isDisabledMermaids, setIsDisabledMermaids] = useState(false);
  const [modalOnPlayer, setModalOnPlayer] = useState(null);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [editScore, setEditScore] = useState({open: false});
  const [displayTable, setDisplayTable] = useState(false);
  const isKeyboardOpen = useDetectKeyboardOpen();

  useEffect(() => {
    // Ajustar la altura de la cabecera al cargar el componente
    const thead = document.querySelector('thead');
    if (thead) {
      const tbody = document.querySelector('tbody');
      if (tbody) {
        const tbodyRow = tbody.querySelector('tr');
        if (tbodyRow) {
          thead.style.height = `${tbodyRow.offsetHeight}px`;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (numOfMermaids > 0) {
      setIsDisabledPirates(true);
      setIsDisabledMermaids(true);
    } else {
      setIsDisabledMermaids(false);
      setIsDisabledPirates(false);
    }
  }, [numOfMermaids]);

  useEffect(() => {
    if (numOfPirates > 0) {
      setIsDisabledMermaids(true);
    } else {
      setIsDisabledMermaids(false);
    }
  }, [numOfPirates]);

  useEffect(() => {
    if (currentRound === game.length - 1)
      setIsVictoryModalOpen(true);
  }, [currentRound]);

  const getCurrentRoundCell = (roundIndex, playerIndex) => {
    return (
      <div className="round-inputs">
        <input
          type="number"
          className="bet-input"
          value={game[roundIndex][playerIndex].bet}
          onChange={(e) =>
            onScoreChange(roundIndex, playerIndex, 'bet', e.target.value)
          }
        />
        <input
          type="number"
          className="wins-input"
          value={game[roundIndex][playerIndex].wins}
          onChange={(e) =>
            onScoreChange(roundIndex, playerIndex, 'wins', e.target.value)
          }
        />
        <button className="skull-king-button" onClick={() => handleOpenModal(playerIndex)}><GiCrownedSkull /></button>
        {!!game[roundIndex][playerIndex].mermaidOnSkull && <div className="skull-icon mermaid-icon-container"><GiMermaid /></div>}
        {!!game[roundIndex][playerIndex].skullOnPirates && <div className="skull-icon skull-icon-container"><GiCrownedSkull /></div>}
      </div>
    );
  }

  const getPastRoundCell = (roundIndex, playerIndex) => {
    return (<span onClick={() => setEditScore({roundIndex, playerIndex, open: true, score: game[roundIndex][playerIndex].score})}>{game[roundIndex][playerIndex].bet} | {game[roundIndex][playerIndex].wins} | {game[roundIndex][playerIndex].score}</span>);
  }

  const drawCell = (roundIndex, playerIndex) => {
    if (currentRound === roundIndex) {
      // editable
      return getCurrentRoundCell(roundIndex, playerIndex);
    } else if (currentRound > roundIndex){
      return getPastRoundCell(roundIndex, playerIndex);
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
    
    if (playerRound.bet === 0 || playerRound.bet === '') {
      playerRound.bet = 0;
      if (playerRound.wins === 0 || playerRound.wins === '') {
        playerRound.wins = 0;
        playerRound.score = previousScore + 10 * (roundIndex + 1);
      } else {
        playerRound.score = previousScore - 10 * (roundIndex + 1);
      }
    } else if (playerRound.wins === playerRound.bet) {
      playerRound.score = previousScore + playerRound.bet * 20;
      playerRound.score += playerRound.skullOnPirates * 30;
      playerRound.score += playerRound.mermaidOnSkull * 50;
      
    } else {
      playerRound.score = previousScore - Math.abs(playerRound.bet - playerRound.wins) * 10;
    }
    
    game[roundIndex][playerIndex] = playerRound;
    setGame(game);
  }

  const onScoreChange = (roundIndex, playerIndex, field, value) => {
    if (value === '') {
      value = '' ;
    } else {
      value = parseInt(value);
    }

    if (value >= 0 || value === '') {
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
  };

  const handleOpenModal = (playerIndex) => {
    setIsModalOpen(true);
    setModalOnPlayer(playerIndex);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNumOfMermaids(0);
    setNumOfPirates(0);
    setModalOnPlayer(null);
  };

  const handleAcceptCloseModal = () => {    
    game[currentRound][modalOnPlayer].skullOnPirates = numOfPirates;
    game[currentRound][modalOnPlayer].mermaidOnSkull = numOfMermaids;
    setGame(game);
    handleCloseModal();
  };

  const addPirate = () => {
    if (!isDisabledPirates && numOfPirates <= 4) {
      setNumOfPirates(numOfPirates + 1);
    }
  };

  const addMermaid = () => {
    if (!isDisabledMermaids) 
      setNumOfMermaids(numOfMermaids + 1);
  };

  const substractIcon = () => {
    if (numOfMermaids > 0) {
      setNumOfMermaids(numOfMermaids - 1);
    } else if (numOfPirates) {
      setNumOfPirates(numOfPirates - 1);
    }
  }

  const additionRow = () => {
    let row = [];
    if (numOfPirates > 0) {
      for (let i = 0; i < numOfPirates; i++) {
        row.push(
          <GiPirateSkull />
        );
      } 
    } else if (numOfMermaids) {
      row.push(<GiMermaid />);
    }

    let substractButton;
    if (numOfMermaids > 0 || numOfPirates > 0) {
      substractButton = <button className="substract-button" onClick={substractIcon}><AiFillMinusCircle /></button>;
    }

    return (
      <div className="row-container">
        <div>{row}</div>
        {substractButton}
      </div>
    );
  };

  const getWinnerName = () => {
    let winnerName;
    let winnerScore;

    game[game.length - 1].forEach(player => {
      if (winnerScore === undefined || player.score > winnerScore) {
        winnerName = player.playerName;
        winnerScore = player.score;
      }
    });

    return winnerName;
  }

  const onEditScore = () => {
    const {roundIndex, playerIndex, score} = editScore;
    game[roundIndex][playerIndex].score = parseInt(score);

    setEditScore({open: false});
    setGame(game);
  }

  const getGridScore = (playerIndex) => {
    const roundIndex = currentRound > 0 ? currentRound - 1 : 0;
    return <span className="player-score" onClick={() => currentRound > 0 && setEditScore({roundIndex, playerIndex, open: true, score: game[roundIndex][playerIndex].score})}>{game[roundIndex][playerIndex].score}</span>
  }

  const displayView = () => {
    if (displayTable) {
      return (
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
                <td>{roundIndex + 1}</td>
                {getPlayersNames().map((_, playerIndex) => (
                  <td key={playerIndex}>
                    {drawCell(roundIndex, playerIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      const displayingRound = currentRound >= game.length ? currentRound -1: currentRound;
      return (
        <div className="score-grid">
          {
            game[displayingRound].map((player, playerIndex) => {
            return (
              <div className="player-score-container">
                <span className="player-name">{player.playerName}</span>
                {getGridScore(playerIndex)}
                {getCurrentRoundCell(displayingRound, playerIndex)}
              </div>
            ); 
            })
          }
        </div>
      );
    }
  }

  return (
    <div className="score-container">
      <button className="accept-button change-view-button" onClick={() => setDisplayTable(!displayTable)}>{displayTable ? <MdViewModule /> : <MdViewList />}</button>
      {game.length && 
        <>
          <div className="round-container">
            <span className="round-label">Ronda </span>
            <span className="round-value">{currentRound + 1}</span>
          </div>
        <div className={`score-view ${isKeyboardOpen ? 'keyboard-open' : 'keyboard-close'}`}>
          {displayView()}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2>Skull<GiCrownedSkull />King!</h2>
            <div className="modal-content skull-modal">
                <div className="addition-button-container">
                  <button className={!isDisabledMermaids ? 'mermaid-button enabled' : 'mermaid-button disabled'} disabled={isDisabledMermaids} onClick={addMermaid}><GiMermaid /></button>
                  <button className={!isDisabledPirates ? 'pirate-button enabled' : 'pirate-button disabled'} disabled={isDisabledPirates} onClick={addPirate}><GiPirateSkull /></button>
                </div>
                <div className="addition-container">
                  {additionRow()}
                </div>
            </div>
            <button className="accept-button" onClick={handleAcceptCloseModal}><GiCrownedSkull /> PUM!</button>
          </Modal>
        </div>
        </>
      }
      {currentRound <= game.length - 1 && <button className="next-round-button" onClick={onNextRound}>{currentRound >= game.length - 1 ? "Terminar" : "Siguiente ronda"}</button>}
      {currentRound > game.length - 1 &&
        <Modal isOpen={isVictoryModalOpen} onClose={() => setIsVictoryModalOpen(false)}>
          <div className="modal-content winner-message">
            <h2>{getWinnerName()}</h2>
            <h2>Eres el Skull King!<GiCrownedSkull className="skull-king" /></h2>
            <button className="accept-button" onClick={() => setIsVictoryModalOpen(false)}><GiCrownedSkull /> PUM!</button>
          </div>
        </Modal>
      }
      {editScore.open && 
        <Modal isOpen={editScore.open} onClose={() => setEditScore({open: false})}>
          <h2>Editando la puntuación de la ronda {editScore.roundIndex} para {game[editScore.roundIndex][editScore.playerIndex].playerName}</h2>
          <div className="modal-content">
            <input
              type="number"
              className="edit-score-input"
              value={editScore.score}
              onChange={(e) =>
                setEditScore({...editScore, score: e.target.value})
              }
            />
          </div>

          <button className="accept-button" onClick={onEditScore}>Aceptar</button>
        </Modal>
      }
    </div>
  );
};

export default ScoreTable;
