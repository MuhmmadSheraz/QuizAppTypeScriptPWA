import React, { useEffect, useState } from 'react';
import './App.css';
import { FilteredQuestions } from './Types/quizQuestionTYpes'
import { getQuestions } from './Services/quizServices'
import 'bootstrap/dist/css/bootstrap.min.css';
import { QuestionCard } from "./Components/QuestionCard/questionCard"
import { ResultCard } from "./Components/ResultCard/index"
import Swal from 'sweetalert2'

function App() {
  let [iteration, setIterations] = useState(0)
  let [allQuestions, setAllQuestions] = useState<FilteredQuestions[]>([])
  const totalQuestions: number = 5;
  let [score, setScore] = useState<number>(0)
  let [showResult, setShowResult] = useState<Boolean>(false)
  const [startQuiz, setStartQuiz] = useState<Boolean>(false)
  const fetchindData = async () => {
    const data: FilteredQuestions[] = await getQuestions(totalQuestions, "easy");
    setAllQuestions(data)
  }
  useEffect(() => {
    fetchindData()
  }, [])

  const nextQuestion = (userAnswer: string) => {
    console.log("user Input", userAnswer)
    // changeIndex()

    if (userAnswer === "") {
      return (Swal.fire({
        icon: 'warning',
        text: 'Please Select Any of Above Options',
      }))
    }
    const correctAnswer = allQuestions[iteration].correct_answer;
    if (userAnswer === correctAnswer) {
      setScore(++score)
      setIterations(++iteration)
    }
    if (userAnswer !== correctAnswer) {
      setIterations(++iteration)
    }
    if (iteration === allQuestions.length) {
      setShowResult(true)
    }


  }
  if (!allQuestions.length) {
    return (<div className="center text-center" >
      <h3 className=" text-center">Loading.. </h3>
    </div>)
  }
  if (showResult) {
    return <ResultCard score={score} totalQuestion={totalQuestions} />
  }
  if (startQuiz) {
    return <QuestionCard
      question={allQuestions[iteration].question
      }
      options={allQuestions[iteration].options}
      current_Score={score}
      callBack={nextQuestion}
      currentIteration={iteration}

    />
  }
  const startTheQuiz = () => {
    setStartQuiz(true)
  }
  return (

    <div className="App">
      <div className="mainWrapper">
        <div className="content_main">
          <p className="headerheading">Welcome To Quiz </p>
          <button className="startBtn rounded-pill" onClick={startTheQuiz}> StartQuiz</button>
        </div>
      </div >
    </div >

  )
}

export default App;
