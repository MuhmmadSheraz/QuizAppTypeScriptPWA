import React, { useEffect, useState } from 'react';
import './App.css';
import { FilteredQuestions } from './Types/quizQuestionTYpes'
import { getQuestions } from './Services/quizServices'
import { QuestionCard } from "./Components/QuestionCard/questionCard"
import { ResultCard } from "./Components/ResultCard/index"
import firebase from "./firebase"
import Swal from 'sweetalert2'
  import axios from "axios"
  

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
     const askForPermissioToReceiveNotifications = async () => {
      try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log("Token===>", token);
        
        return token;
      } catch (error) {
        console.error(error);
      }
    }
    askForPermissioToReceiveNotifications()
  }, [])
  let body = {
    notification: {
      title: "Firebase",
      body: "Kia Kehny Qibla",
      icon: "http://url-to-an-icon/icon.png",
    },
    to:
      "fXkL4tYeslJhuGBFDwx7ZQ:APA91bGfO-qfEg4V8Q7LIWpEP-88DpIj8QMPVx4OdGMqltJcl5nvRHFSgfYocMZNmk7BDdjCeYgUKdBKmUznAMBrYDfU41_Qk2YLT417KwSHDfj95rQp2gQH6oysQfRAjDaD7elItWPU",
  };
  const checkNoti = () => {
    axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      data: body,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "key=" + "AAAABs5B4KY:APA91bEUO52e84TWQy_F_Va_qN1RLiJPw9IYXRHJJT-gvCXbj7Hi6U2BaQ89aPg2q1Z-Cii-0JQbQ9U2KqLalNGHIBSLGfrfwFMind-18gxH-8Rsnvtorw7rw0dvgBXVoQf6uzhq256r"
      }
    }).then((res) => {
      console.log(res)
    }).catch((e) => {
      console.log(e)
    })
  };
  useEffect(() => {
    fetchindData()
    const msg = firebase.messaging()
    msg.requestPermission().then(() => {
      return msg.getToken()
    }).then(data=>{
      console.log("Token *****",data)
    })
    return (()=>{
      
    })
  }, [])
useEffect(() => {
  console.log("hello")
  checkNoti()
  return () => {
    checkNoti()  }
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
