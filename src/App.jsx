import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Quiz from './components/Quiz';

// Features to add: 
// - automatic boxes width
// - a game finito l'hover sui buttoni non deve funzionare


export default function App() {

  const [questions, setQuestions] = React.useState("");
  // possibleGameStatuses = ["active", "over", "pre-start"]
  const [gameStatus, setGameStatus] = React.useState("pre-start")

  // switch to fetch when clicking "Play"
  const [fetchPls, setFetchPls] = React.useState(false)

  const [finalScore, setFinalScore] = React.useState(0)

  // Shuffle function to randomise answers' array
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  
  React.useEffect(() => {
    // Import data and add a "mixed answers" array. Set the data to "questions" state.
    async function getData() {
      const res = await fetch("https://opentdb.com/api.php?amount=5");
      const questionsData = await res.json();
      setQuestions(questionsData.results);

      const updatedQuestions = questionsData.results.map((el) => {

          return { ...el,
          mixed_answers: shuffle([...el.incorrect_answers, el.correct_answer]),
          given_answer: "",
          id: uuidv4()
          }

      })
      setQuestions(updatedQuestions)
    }
    
    getData();
  }, [fetchPls]);  

  // Manipulate the code to create the HTML code for the questions and answers
  const renderQuestions = questions ?
  questions.map((questionGroup) => (
    <Quiz
      questions={questions}
      handleChange={handleChange}
      key={questionGroup.id}
      questionGroup={questionGroup}
      gameStatus={gameStatus} />
  ))
  : "";

  // Handle "submit answers" button
  function handleChange(e){
    e.preventDefault()

    const valore = e.target.value

    setQuestions(prevQuestions => {
      return prevQuestions.map(obj => {
        if(e.target.name === obj.question){
          return {...obj, given_answer: valore}
        } else {
          return obj
        }
      })
    })
    
  }



  // Handle submit
  function handleSubmit(e){
    e.preventDefault()
    if(gameStatus === "pre-start"){
      setGameStatus("active")
    } else if(gameStatus === "active" && questions.some(question => question.given_answer === "")){
      alert("It's a tricky quiz, but you must complete all of it to continue :)")
    } else if (gameStatus === "active") {
      setGameStatus("over")
      questions.map(el => el.correct_answer === el.given_answer ? setFinalScore(prevScore =>prevScore + 1) : "")

    } else if (gameStatus === "over") {
      setFinalScore(0)
      setGameStatus("pre-start")
      setFetchPls(prevFetch => !prevFetch)
    }
     
  }


  return (
    <>
      {gameStatus === "pre-start" ?
      <h1>Click on the button below to start the quiz.</h1> : 
      renderQuestions
      }
      <form>
        {gameStatus === "active" ? 
        <button onClick={handleSubmit}>Check Answers</button>
        : gameStatus === "over" ? 
        <button onClick={handleSubmit}>Play again</button> : 
        <button onClick={handleSubmit}>Play</button> }
        {gameStatus === "over" ? <h3 className='score'>You scored {finalScore}/5 answers</h3> : ""}
      </form>
    </>
  );
}
