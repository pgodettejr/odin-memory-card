import { useState, useEffect } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'

// TODO: App continues to go through an infinite loop of re-rendering the array with just the starter pokemon, the console logs displaying the array over and over again. Find out why this is happening and how to fix it. Possibly has to do with a useEffect (in Deck component?) that might need an empty array to only run it once or some other dependency array instead of running it on every render. 
// ATTEMPT #1: Tried to put the starter function (call?) inside a useEffect that only runs once on mount instead of calling it directly in the body of the Deck component. This caused me to have to call 'starters' inside the same Effect and "remove" (comment out the other Effect). This makes the page go blank again and 'pokemon.map' is not defined.

// TODO/BRANCH: Render "You Win/Lose" screen when game ends that also disables further card clicks until the game is reset/restarted. Google "how to disable clickable elements in React". Possibly a modal that pops up over the game board? DO NOT put it in the existing effect that ends the game when the player wins or in the handleClick function under the Card component. Make it its own separate render function.

// Everything else autocomplete suggested after the last comment lol

// TODO/BRANCH: Add a "Restart Game" button that resets all states to their initial values and reshuffles the cards.
// TODO/BRANCH: Add sound effects for card clicks, winning, and losing.
// TODO/BRANCH: Add animations for card flips and shuffling.
// TODO/BRANCH: Implement difficulty levels that change the number of cards in the deck.
// TODO/BRANCH: Add a timer that tracks how long it takes to complete the game.

// Use "cv-app-complete" in Codesandbox as a reference in Chrome browser while building out the Memorymon app.

// TODO: Why the screen comes up blank, explained by AI Console: The console message "An error occurred in the <App, Scoreboard> component" indicates that an unhandled JavaScript error was thrown within your React application's <App, Scoreboard> component during rendering, in a lifecycle method, or inside a useEffect hook. When an error occurs in a React component's render phase or a method that React calls, and it's not caught, it will propagate up the component tree. React then "unmounts" the entire component tree, leading to a blank screen or a broken UI. The message also suggests adding an ERROR BOUNDARY, which is a specialized React component designed to catch JavaScript errors anywhere in its child component tree, log those errors, and display a fallback UI instead of the crashed component tree. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.

// Attempt at writing an Error Boundary component to catch errors in the Deck component. 

// Unreachable code detected.ts(7027)
// Compilation Skipped: Inline `class` declarations are not supported

// Move class declarations outside of components/hooks.

//   class ErrorBoundary extends React.Component {
//     constructor(props) {
//       super(props);
//       this.state = { hasError: false };
//     }

//     static getDerivedStateFromError(error) {
//       // Update state so the next render will show the fallback UI.
//       return { hasError: true };
//     }

//     componentDidCatch(error, errorInfo) {
//       // You can also log the error to an error reporting service
//       console.error("ErrorBoundary caught an error", error, errorInfo);
//     }

//     render() {
//       if (this.state.hasError) {
//         // You can render any custom fallback UI
//         return <h1>Something went wrong.</h1>;
//       }

//       return this.props.children; 
//     }
//   }


// TODO: Cannot update a component (`App`) while rendering a different component (`Deck`). To locate the bad setState() call inside `Deck`, follow the stack trace as described in https://react.dev/link/setstate-in-render. This error is likely caused by a setState() call in the Deck component that is being called during the render phase of the App component. To fix this, we need to move any state updates that are happening in the Deck component to a useEffect hook or to an event handler function that is called after the component has rendered. 
// The most likely scenario is that Deck is calling a prop that updates App's state directly during its render, or Deck itself has a useEffect without a dependency array that causes App's state to update, or Deck is calling a function that causes App's state to update directly in its component body.
// Calling a state-setting function directly within the body of a functional component or within the render method of a class component, which executes on every render.
// Passing a function that immediately calls a state-setter as a prop, and that prop is then executed during the child component's render.
// Side effects that update state not being properly encapsulated (e.g., in useEffect or componentDidMount/componentDidUpdate with dependency arrays or conditions).

// BEGIN

// WHEN the user goes to the website/browser app via web address
export default function App() {
  // Acts as initial state as well as the state that holds the array of cards
  const [pokemon, setPokemon] = useState([]);

  // This just makes the page go blank again on render
  // const [pokemon, setPokemon] = useState();

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
        <Scoreboard
          pokemon={pokemon}
        />
      </div>

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
  function Scoreboard(props) {
    // These states may need to move up outside this component as parents for everything. They definitely do if Scoreboard is in its own file.
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    // Possible states: 'playing', 'won', 'lost'
    // Moving this to the App component made the app go blank again and didn't solve the infinite loop error
    const [gameState, setGameState] = useState('playing'); 

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

    // Effect that checks for win condition whenever the score and the pokemon states change
    // OPTION: Possibly add a property to each card object in the pokemon array that was returned via JSON. Property would represent the clicked status of the card. Then we could check for win condition by checking if all cards have been clicked (clicked === true). This would be an alternative to checking if the score is equal to the length of the pokemon array. (e.g. pokemon.every((mon) => mon.clicked === true) or pokemon.clicked = true)
    // TODO: Stop the pokemon array call and win game message from showing up in console infinitely. This is happening despite a dependency array of 'score' being the second argument. Look at infinite counter example from React docs for a possible solution and apply a similar solution to this code (App or Deck component). Change this from an Effect to just another handle function that is called after the score is updated?
    // useEffect(() => {
    //   // IF the player has clicked on all cards without any duplicates
    //   if (pokemon && score === pokemon.length) {
    //     // SET the game state to "won"
    //     setGameState('won');
    //     // POSSIBLY trigger some kind of celebration animation or sound effect here
    //     console.log("Congratulations! You've won the game!");
    //   }

    //   return () => {
    //     // Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops. This is likely caused by a setState() call in the Deck component that is being called during the render phase of the App component. To fix this, we need to move any state updates that are happening in the Deck component to a useEffect hook or to an event handler function that is called after the component has rendered.
    //     setGameState('playing');
    //   }
    // }, [score]); // Dependency array runs only when 'score' state updates.

    function handleWin() {
      if (pokemon && score === pokemon.length) {
        // SET the game state to "won"
        setGameState('won');
        // POSSIBLY trigger some kind of celebration animation or sound effect here
        console.log("Congratulations! You've won the game!");
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

        <div className="play-mat">
          <Deck
            pokemon={props.pokemon}
            score={score}
            highScore={highScore}
            gameState={gameState}
            handleScore={handleScore}
            handleHighScore={handleHighScore}
            handleWin={handleWin}
          />
        </div>
      </>
    );
  }

  // Should this function also be responsible for removing the current cards from the display or not?
  // The cards should display again without calling the entire App component (unmount/remount) if possible. This is so the Scoreboard doesn't end up getting called again.
  // Should this function invoke when the entire App component mounts or just when the Deck component mounts?
  // This function is NOT a useEffect (because it needs to be called multiple times, not just once on mount?)

  // TODO: While this component is being called, nothing is showing in the browser any time we "npm run dev". Find out why that is.

  // TODO: Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop. This is happening even when all component calls and the Vite and React logos are commented out. Find out why this is happening and how to fix it. 

  // ATTEMPT #1 (Autocomplete): It might be because of the useEffects that are being called in the Card component. Try moving those useEffects up to the Deck component instead and see if that fixes the issue. It didn't.

  // ATTEMPT #2: Lift 'pokemon' and 'gameState' states up to the App and Scoreboard components respectively and pass them down as props to the Deck component. This way, the Deck component can manage the state of the cards and the game state without causing too many re-renders.

  // ATTEMPT #3 (AI DevTools Console): Provide a default empty array for 'pokemon' if it's a prop that's not always provided by the parent (Scoreboard) component. e.g. 'function Deck({ ...props?, pokemon = [] })

  // WHEN this function is called
  // INIT a function or equation that will:
  function Deck(props) {
    // const [shuffled, setShuffled] = useState([]);

    // TODO: How are we going to implement the logic/code responsible for only pulling the starters. Will it be by ID number ranges? Do we need to use a "map()" method?
    // TODO: SET variables equal to the properties we need that represent the starters from the API
    // TODO: This is not done running when the return statement tries to go through. This fetches all the starters correctly, but is the last thing that happens when we step through the code. Nothing happens after starterData is returned.

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


    // CALL the function that fetches only starter pokemon from the API. 
    // Do we need the extra parentheses after "starters" here? I think we do because it's an async function that returns a promise.
    // TODO: We might not be able to call this as is. May need to wait for the promise to resolve from "starters" function before we can set the state of "pokemon" to the returned array. Look into how to do this with async functions and useEffect....except try not to use an Effect if possible since we want this to be called multiple times, not just once on mount. Maybe we can call this function inside the useEffect that runs when the Deck component mounts? Or maybe we can just call it directly in the body of the Deck component and use "await" to wait for the promise to resolve before setting the state of "pokemon" to the returned array? Maybe wrap this in a try...catch block to handle any errors that may occur during the fetch process?
    // ERROR: When called - Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead. Either calling setPokemon inside this async function is causing this error or calling this function directly below this is causing it. AI AUTOCOMPLETE: Try moving this function call inside a useEffect that runs when the Deck component mounts and see if that fixes the issue?

    useEffect(() => {
      const starterInfo = async () => {
        const starterCards = await starters();
        setPokemon(starterCards);
      }

      starterInfo();
    }, []);

    // Does this even need to be a useEffect? Or just a normal function called when Deck component mounts?
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

    if (pokemon) {
      // SET the cards in the newly shuffled order
      // setPokemon(shuffle(pokemon));
      console.log('Pokemon array: ', pokemon);
      console.log(pokemon.length);
    }

    return (
      <>
      {/* TODO: Uncaught TypeError: Cannot read properties of undefined (reading 'length') for 'pokemon.length'. Can't read the state of pokemon array as it's not defined yet? Does it have to do with the API call not completing yet? Read over when state is defined/called and when the API call completes. There is nothing in the pokemon array on page load - no fetching from API? */}
        {pokemon.length === 0 ? (
          <p>Loading the cards...</p>
        ) : (
          <div className="deck">
            {/* DISPLAY each card inside the deck */}
            {/* Do we even need cardImage and cardName here since it's being called in the Card component? Maybe we just need to pass the entire "mon" object as a prop to the Card component and then call the properties inside the Card component instead? */}
            {pokemon.map((mon) => (
              <Card 
                key={mon.id}
                pokemon={pokemon}
                cardImage={mon.sprites.front_default}
                cardName={mon.name}
                score={props.score}
                highScore={props.highScore}
                handleScore={props.handleScore}
                handleHighScore={props.handleHighScore}
                // onClick={() => {
                //   // handleCardClick(mon.id);
                //   // Logic for handling score changes may go here instead
                //   console.log(`You clicked on ${mon.name}`); }
                // }
                onClick={() => shuffle(pokemon)}
              />
            ))}
          </div>
        )}
      </>
    );
  }
}

// Example Card component setup

// useEffects for image and text generation Pokémon API call go inside this component. They will go where the GET pseudocode is. The text has to match the image from the API - be in sync, even when randomized. The useEffects will not have an empty dependency array (changes after all renders or on mount + array item changes)

// WHEN this component is called
function Card(props) {
  // const [cardImage, setCardImage] = useState();
  // const [cardName, setCardName] = useState('');
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
  // This may need to be an async await function that has the useEffect inside of it
  // Do we even need to fetch the data again here since we're already fetching it in the Deck component and passing it down as props?

  // TODO: Fix this errors we're getting - GET https://pokeapi.co/api/v2/pokemon/undefined 404 (Not Found) means 'props.id' is undefined. We need to pass the id of the pokemon as a prop to the Card component from the Deck component when we call it. Then we can use that id in the fetch line of code here. Other error is "Uncaught (in promise) SyntaxError: Unexpected token 'N', "Not Found" is not valid JSON"
  // ATTEMPT #1: pass { props, id } as arguments in the Card component above instead of just 'props' alone, then use 'id' again instead of 'props.id' in the fetch line of code and the dependency array in the Effect below. Changed back to 'props' followed by 'props.key', 'mon.id' (won't let us declare it as a dependency array - had to still use 'props.key' array itself, comes up not defined) and 'props.mon.id' (still undefined).

  // ATTEMPTS: wrap this in a try...catch block that waits on 'starters' to finish before fetching the images, AI Console suggestion to wrap this in a conditional that checks for 'props.id' or 'id'. AI suggestion probably won't solve the problem of the images actually showing up, just showing the errors that's it.
  // useEffect(() => {
  //   fetch(`https://pokeapi.co/api/v2/pokemon/${props.key}`).then(response => {
  //     if (!response.ok) {
  //       return response.text().then(text => {
  //         throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
  //       });
  //     }

  //     return response.json();
  //   })
  //     .then(data => {
  //       // GET (fetch) that image from Pokémon API (useEffect)
  //       setCardImage(data.sprites.front_default);
  //       // GET (fetch) the name of the card (text) from Pokémon API (useEffect)
  //       setCardName(data.name);
  //     });
  // }, [props.key]); // Removed cardImage and cardName and replaced them with props.id in the dependency array. This way the useEffect will only run when the id of the card changes, which is what we want.

  return (
    <>
      {/* DISPLAY a card */}
      {/* CALL the handleClick function when the card is clicked */}
      {/* Should this be a button instead of a div for accessibility purposes? */}
      <div className="card" key={props.cardImage} onClick={handleClick}>
        {/* DISPLAY another image inside the card */}
        <img src={props.cardImage} alt={props.cardName} />
        {/* SHOW a text description of the card */}
        <p>{props.cardName}</p>
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