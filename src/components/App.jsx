import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'

// Use "cv-app-complete" in Codesandbox as a reference in Chrome browser while building out the Memorymon app.

// BEGIN

// WHEN the user goes to the website/browser app via web address
// DISPLAY the entire application
export default function App() {
  return (
    <>
      <div className="App">
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

        {/* TODO: currentCard and prevCard aren't defined */}
        {/* SHOW the Scoreboard in the top right corner */}
        <Scoreboard />

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  );

  // Scoreboard component may go in its own separate file

  // WHEN this component is called
  function Scoreboard() {
    // These states may need to move up outside this component as parents for everything. They definitely do if Scoreboard is in its own file.
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

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

    // This conditional below might end up going in the Card components and will call Scoreboard component?
    // Or keep it here and somehow call Card component from here?

    // IF the player clicks on a card they've clicked on previously
    if (currentCard === prevCard) {
      // SET the Score back to 0
      score = 0;
      // ELSE IF the player clicked on a card that is different from all the previous cards they've clicked on
    } else if (currentCard !== prevCard) {
      // INCREMENT the Score by 1
      handleScore();
      handleHighScore();
    }
    // ENDIF

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
      </>
    );
  }

  // Should this function also be responsible for removing the current cards from the display or not?
  // The cards should display again without calling the entire App component (unmount/remount) if possible. This is so the Scoreboard doesn't end up getting called again.
  // Should this function invoke when the entire App component mounts or just when the Deck component mounts?
  // This function is NOT a useEffect (because it needs to be called multiple times, not just once on mount?)

  // Rename this "cardShuffle()"?
  // WHEN this function is called
  // INIT a function or equation that will:
  function Shuffle() {
    // These might also need to move up as parents for all the components not just this one. They definitely will if Shuffle is in its own file.
    const [pokemon, setPokemon] = useState([]);
    // const [shuffled, setShuffled] = useState([]);

    // Is this useEffect doing too many things? There are 3 functions in it. useEffects should only do one thing?
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

      // DISPLAY the cards in that new order set by the previous equation or function
      setPokemon(shuffle(pokemon));
      
      // TODO: How are we going to implement the logic/code that only pulls the starters. Is it by ID number ranges? Do we need to use a "map()" method?
      // TODO: SET variables equal to the properties we need that represent the starters from the API
      const starters = async () => {
        try {
          // IDs for starter Pokemon from all generations
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

      setPokemon(starters);
      shuffle(pokemon);
    }, [pokemon]);
  }
}

// Example Card component setup

// useEffects for image and text generation Pokémon API call goes inside this component. They will go where the GET pseudocode is. The text has to match the image from the API - be in sync, even when randomized. The useEffects will not have an empty dependency array (changes after all renders or on mount + array item changes)
// WHEN this component is called
function Card() {
  const [cardImage, setCardImage] = useState();
  const [cardName, setCardName] = useState('');

  // response.json could be { conditional? } depending on the API structure
  useEffect(() => {
    fetch().then(response => response.json().then(data => {
      // GET (fetch) that image from Pokémon API (useEffect)
      setCardImage(data.sprites.front_default);
      // GET (fetch) the name of the card (text) from Pokémon API (useEffect)
      setCardName(data.name);
    }));
  }, [cardImage, cardName]);

  return (
    <>
      {/* DISPLAY a card */}
      <div className="card">
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