import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'

// TODO: Nothing showing in the browser when we "npm run dev". Find out why that is.

// TODO: Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.

// TODO/BRANCH: Render "You Win/Lose" screen when game ends that also disables further card clicks until the game is reset/restarted. Google "how to disable clickable elements in React". Possibly a modal that pops up over the game board? DO NOT put it in the existing effect that ends the game when the player wins or in the handleClick function under the Card component. Make it its own separate render function.

// Everything else autocomplete suggested after the last comment lol

// TODO/BRANCH: Add a "Restart Game" button that resets all states to their initial values and reshuffles the cards.
// TODO/BRANCH: Add sound effects for card clicks, winning, and losing.
// TODO/BRANCH: Add animations for card flips and shuffling.
// TODO/BRANCH: Implement difficulty levels that change the number of cards in the deck.
// TODO/BRANCH: Add a timer that tracks how long it takes to complete the game.

// Use "cv-app-complete" in Codesandbox as a reference in Chrome browser while building out the Memorymon app.

// BEGIN

// WHEN the user goes to the website/browser app via web address
// DISPLAY the entire application
export default function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Possibly move the heading elements above this div into their own separate wrapper */}
      {/* SHOW the Heading (Game title) in the top left corner */}
      <h1>Memorymon</h1>

      {/* SHOW the game description directly under the Heading */}
      <h3>
        Get points by clicking on a image, but don't click on any more than once
      </h3>

      {/* SHOW the Scoreboard in the top right corner */}
      <Scoreboard />

      <p>
        Edit <code>src/App.jsx</code> and save to test HMR
      </p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );

  // Scoreboard component may go in its own separate file

  // WHEN this component is called
  function Scoreboard() {
    // These states may need to move up outside this component as parents for everything. They definitely do if Scoreboard is in its own file.
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // If we need this, pass it as a prop to Deck component and call it in "handleHighScore" function
    // const [reset, setReset] = useState(true);

    // Functions that handle the change in scores
    // Example: setNumber(n => n + 1) to increment scores
    // Should score be "n" instead before returning "score + 1"?
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

    return (
      <>
        <div className="scoreboard">
          <p id="playerScore" value={score} onChange={handleScore}>
            Score: {score}
          </p>
          <p id="highScore" value={highScore} onChange={handleHighScore}>
            High Score: {highScore}
          </p>
        </div>
        <Deck
          score={score}
          highScore={highScore}
          handleScore={handleScore}
          handleHighScore={handleHighScore}
        />
      </>
    );
  }

  // Should this function also be responsible for removing the current cards from the display or not?
  // The cards should display again without calling the entire App component (unmount/remount) if possible. This is so the Scoreboard doesn't end up getting called again.
  // Should this function invoke when the entire App component mounts or just when the Deck component mounts?
  // This function is NOT a useEffect (because it needs to be called multiple times, not just once on mount?)

  // TODO: An error occurred in the <Deck> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

  // WHEN this function is called
  // INIT a function or equation that will:
  function Deck(props) {
    // These states might also need to move up as parents for all the components not just this one. They definitely will if Shuffle is in its own file.

    // Acts as initial state as well as the state that holds the array of cards
    const [pokemon, setPokemon] = useState([]); 

    // Possible states: 'playing', 'won', 'lost'
    const [gameState, setGameState] = useState('playing'); 

    // const [shuffled, setShuffled] = useState([]);

    // TODO: How are we going to implement the logic/code that only pulls the starters. Is it by ID number ranges? Do we need to use a "map()" method?
    // TODO: SET variables equal to the properties we need that represent the starters from the API
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
        
        // RETURN the new array representing only starter pokemon
        return starterData;
      } catch (err) {
        console.error(err);
      }
    };

    // CALL the function that fetches only starter pokemon from the API
    setPokemon(starters);

    // Does this even need to be a useEffect? Or just a normal function called when Deck component mounts?
    // SET the array of cards in a completely different random order
    useEffect(() => {
      const shuffle = (array) => {
        // Variation of Fisher-Yates method of shuffling items/cards in an array reliably and always at random
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          let temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      };

      // SET the cards in the newly shuffled order
      setPokemon(shuffle(pokemon));
    }, [pokemon]);

    // Effect that checks for win condition whenever the score and the pokemon states change
    useEffect(() => {
      // IF the player has clicked on all cards without any duplicates
      if (props.score === pokemon.length) {
        // SET the game state to "won"
        setGameState('won');
        // POSSIBLY trigger some kind of celebration animation or sound effect here
        console.log("Congratulations! You've won the game!");
      }
    }, [props.score, pokemon.length]); // Dependency array runs only when 'pokemon' state updates


    // Alternative useEffect per Gemini
    // useEffect(() => {
    //   const allClicked = pokemon.every((mon) => mon.clicked === true); // Might not need === true
    //   if (allClicked) {
    //     setGameState('won');
    //     console.log("Congratulations! You've won the game!");
    //   }
    // }, [pokemon]); // Dependency array runs only when 'pokemon' state updates

    // const handleCardClick = (id) => {
    //   // Logic for handling card clicks and updating score goes here
      
    //   // Prevents state updates if the game is already over
    //   if (gameState === 'won') return;

    //   setPokemon((prevPokemon) =>
    //     prevPokemon.map((mon) =>
    //       mon.id === id ? { ...mon, clicked: true } : mon
    //     )
    //   );
    // };

    return (
      <>
        {pokemon.length > 0 ? (
          <div className="deck">
            {/* DISPLAY each card inside the deck */}
            {pokemon.map((mon) => (
              <Card 
                // key={mon.id}
                pokemon={pokemon}
                cardImage={mon.sprites.front_default}
                cardName={mon.name}
                gameState={gameState}
                score={props.score}
                highScore={props.highScore}
                handleScore={props.handleScore}
                handleHighScore={props.handleHighScore}
                // onClick={() => {
                //   // handleCardClick(mon.id);
                //   // Logic for handling score changes may go here instead
                //   console.log(`You clicked on ${mon.name}`); }
                // }
              />
            ))}
          </div>
        ) : (
          <p>Loading cards...</p>
        )}
      </>
    );
  }
}

// Example Card component setup

// useEffects for image and text generation Pokémon API call goes inside this component. They will go where the GET pseudocode is. The text has to match the image from the API - be in sync, even when randomized. The useEffects will not have an empty dependency array (changes after all renders or on mount + array item changes)

// WHEN this component is called
function Card(props) {
  const [cardImage, setCardImage] = useState();
  const [cardName, setCardName] = useState('');
  const [clicked, setClicked] = useState(false);

  // This conditional below might go back to the Scoreboard component and somehow call Card component from there?
  // If there are no cards left that have a clicked state of "false", then the game is over and the player has won. How do we check to see if there are any cards left with clicked state of "false"?

  const handleClick = () => {
    // Prevents state updates if the game is already over
    if (props.gameState === 'won') return;

    setClicked(true);

    // IF the player clicks on a card they've clicked on previously
    if (clicked === true) {
      // SET the Score back to 0
      props.handleScore(0);
      // ELSE IF the player clicked on a card that is different from all the previous cards they've clicked on
    } else {
      // INCREMENT the Score by 1
      props.handleScore();
      props.handleHighScore();
    }
    // ENDIF
  }

  // response.json could be { conditional? } depending on the API structure
  // This might not need to be an Effect either since we only need to fetch the data once per card when the Deck component calls this component. 
  // Possibly make this a carbon copy of the for...of loop in Deck component instead? (if we move starter IDs up outside Deck component)
  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json().then(data => {
      // GET (fetch) that image from Pokémon API (useEffect)
      setCardImage(data.sprites.front_default);
      // GET (fetch) the name of the card (text) from Pokémon API (useEffect)
      setCardName(data.name);
    }));
  }, [cardImage, cardName]);

  return (
    <>
      {/* DISPLAY a card */}
      {/* CALL the handleClick function when the card is clicked */}
      {/* Should this be a button instead of a div for accessibility purposes? */}
      <div className="card" key={cardImage} onClick={handleClick}>
        {/* DISPLAY another image inside the card */}
        <img src={cardImage} alt={cardName} />
        {/* SHOW a text description of the card */}
        <p>{cardName}</p>
      </div>
    </>
  );
}


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// const fetchPokemon = async () => {
//         // Fetch pokemon
//         const promises = [];
//         for (let i = 1; i <= 10; i++) {
//           let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
//           let response = await fetch(url);
//           let result = response.json();
//           promises.push(result);
//         }

//         const data = await Promise.all(promises);
//         shuffle(data);
//         setPokemon(data);
//       };

// export default App