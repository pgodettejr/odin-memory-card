import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'

// BEGIN

// WHEN the user goes to the website/browser app via web address
export default function App() {
  // DISPLAY the entire application
  return (
    <>
      {/* SHOW these logos in the top left corner */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Possibly move the heading elements above this div into their own separate wrapper */}
      {/* SHOW the Heading (Game title) in the top left corner under the logos */}
      <h1>Memorymon</h1>

      {/* SHOW the game description directly under the Heading */}
      <h3>
        Get points by clicking on a image, but don't click on any more than once
      </h3>

      {/* SHOW the Scoreboard in the top right corner */}
      <div className="App">
        <Scoreboard />
      </div>

      <p>
        Edit <code>src/App.jsx</code> and save to test HMR
      </p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="powered-by">
        Website powered by Paul Godette Jr.
      </p>
    </>
  );

  // WHEN this component is called
  function Scoreboard() {
    // Acts as initial state as well as the state that holds the array of cards
    const [pokemon, setPokemon] = useState([]);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Possible states: 'playing', 'won', 'lost'
    const [gameState, setGameState] = useState('playing'); 

    // Functions that handle the change in scores
    function handleScore() {
      setScore((score) => score + 1);
    }

    function handleHighScore() {
      // IF this is the player's first game OR the player's score is greater than the previous High Score
      if (highScore === 0 || score > highScore) {
        // INCREMENT the High Score (by 1? by how much?)
        setHighScore(score);
      }
    }

    // Checks for win condition whenever the score and the pokemon states change
    function handleWin() {
      if (pokemon && score === pokemon.length) {
        // SET the game state to "won"
        setGameState('won');
        console.log("Congratulations! You've won the game!");
        // RESET Score back to 0 for a new game
        setScore(0); 
      }
    }

    function handleLoss() {
      if (score !== pokemon.length) {
        setGameState('lost');
        console.log("Game Over. You've lost the game. There were other cards you hadn't clicked on yet.");
        // RESET Score back to 0 for a new game
        setScore(0); 
      }
    }

    return (
      <>
        <div className="scoreboard">
          <p id="playerScore" value={score} onChange={handleScore}>
            <strong>Score:</strong> {score}
          </p>
          <p id="highScore" value={highScore} onChange={handleHighScore}>
            <strong>High Score:</strong> {highScore}
          </p>
        </div>

        <div className="play-mat">
          <Deck
            pokemon={pokemon}
            setPokemon={setPokemon}
            score={score}
            highScore={highScore}
            gameState={gameState}
            handleScore={handleScore}
            handleHighScore={handleHighScore}
            handleWin={handleWin}
            handleLoss={handleLoss}
          />
        </div>
      </>
    );
  }



  // WHEN this function is called
  // INIT a function or equation that will:
  function Deck(props) { 
    // CALL the Pokémon API to fetch data for all starter Pokémon from all generations.
    const starters = async () => {
      try {
        // IDs for starter Pokemon from all generations. 
        // TODO: This array may need to be moved up outside this function and under the App itself instead. Possibly even move the entire function up there too.
        const starterIds = [1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656, 722, 725, 728, 810, 813, 816, 906, 909, 912]; 

        // PRINT data representing each starter pokemon from the JSON returned from the API
        const starterData = [];
        
        // INIT a "for of" loop for the array representing the starters
        // FOR each item in the array representing all starter pokemon from the API
        for (const id of starterIds) {
          let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
          let response = await fetch(url);
          let result = await response.json();

          // PUSH that item's data into the data array representing the starter pokemon
          starterData.push(result);
        }
        // ENDFOR
        
        console.log('Starter Data Array: ', starterData);
        // RETURN the new array representing only starter pokemon
        return (starterData);
      } catch (err) {
        console.error(err);
      }
    };


    // SET the 'pokemon' array to include only those starter pokemon returned from the API. 
    useEffect(() => {
      const starterInfo = async () => {
        const starterCards = await starters();
        props.setPokemon(starterCards);
      }

      starterInfo();
    }, [props.setPokemon]); // Dependency array with props.setPokemon to avoid infinite loop

    // SET the array of cards in a completely different random order
    const shuffle = (array) => {
      const shuffledArray = [...array];
      // Variation of Fisher-Yates method of shuffling items/cards in an array reliably and always at random
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
      }

      return shuffledArray;
    };

    const randomizeCards = () => {
      props.setPokemon(shuffle(props.pokemon));
    }

    return (
      <>
        {props.pokemon.length === 0 ? (
          <p>Loading the cards...</p>
        ) : (
          <div className="deck">
            {/* DISPLAY each card inside the deck */}
            {props.pokemon.map((mon) => (
              <Card 
                key={mon.id}
                pokemon={mon}
                cardImage={mon.sprites.front_default}
                cardName={mon.name}
                score={props.score}
                highScore={props.highScore}
                handleScore={props.handleScore}
                handleHighScore={props.handleHighScore}
                handleWin={props.handleWin}
                handleLoss={props.handleLoss}
                gameState={props.gameState}
                setGameState={props.setGameState}
                randomizeCards={randomizeCards}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}

// WHEN this component is called
function Card(props) {
  const [clicked, setClicked] = useState(false);

  // WHEN the card is clicked
  const handleClick = () => {
    // Prevents state updates if the game is already over
    if (props.gameState === 'won' || props.gameState === 'lost') {
      props.setGameState('playing');
    }

    setClicked(!clicked);

    // IF the player clicks on a card they've clicked on previously
    if (clicked) {
      // DETERMINE if all cards have been clicked on already
      props.handleWin();
      // SET the high score if applicable
      props.handleHighScore();
      props.handleLoss();
    // ELSE IF the player clicked on a card that is different from all the previous cards they've clicked on
    } else {
      // INCREMENT the Score by 1
      props.handleScore();
    }

    props.randomizeCards();
    // ENDIF
  }

  return (
    <>
      {/* DISPLAY a card */}
      {/* CALL the handleClick function when the card is clicked */}
      <div className="card" key={props.cardImage} onClick={handleClick}>
        {/* DISPLAY another image inside the card */}
        <img src={props.cardImage} alt={props.cardName} />
        {/* SHOW a text description of the card */}
        <p>{props.cardName}</p>
      </div>
    </>
  );
}