import he from 'he';
import { v4 as uuidv4 } from 'uuid';

export default function Quiz({questionGroup, handleChange, gameStatus}){

    function handleGameOverStyling(answer){
        if(gameStatus === "over"){
            return questionGroup.correct_answer === answer ? 
            "#add4a3" : 
            questionGroup.given_answer === answer &&
            questionGroup.given_answer !== questionGroup.correct_answer?
            "red" : ""
        }

    }

    return (
        // Manipulate the code to create the HTML code for the questions and answers

            <div key={questionGroup.id} className='question-group'>
                <h3>{he.decode(questionGroup.question)}</h3>
                {questionGroup.mixed_answers.map(answer => {
                return <li key={uuidv4()} className='radio-button'>
                    <input
                        type="radio"
                        name={questionGroup.question}
                        value={answer}
                        checked={questionGroup.given_answer === answer}
                        onChange={handleChange}
                        disabled={gameStatus === "over" ? true : false}
                    />

                    <label 
                        htmlFor={answer}
                        style={{backgroundColor: handleGameOverStyling(answer)}}
                    >{he.decode(answer)}</label>

                </li>
                })}
            </div>

    )
}