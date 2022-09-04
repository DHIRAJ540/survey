import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../utils/firebase";
import { PrimaryButton, SecondaryButton } from "../components/Button";
import "./Home.css";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Options = ({
  count,
  setCurrentAnswer,
  questionNumber,

  answers,
}) => {
  const options = [];
  for (let i = 1; i <= count; i++) {
    options.push(
      <div
        className={`range_option ${
          answers[questionNumber] === i ? "active" : ""
        }`}
        key={i}
        onClick={() => {
          setCurrentAnswer(i);
          answers[questionNumber] = i;
          localStorage.setItem("review", JSON.stringify(answers));
        }}
      >
        {i}
      </div>
    );
  }
  return <div className="range_container">{options}</div>;
};

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [welcomeScreen, setWelcomeScreen] = useState(true);
  const [questionScreen, setQuestionScreen] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [exitScreen, setExitScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //   const [currentQuestion, setCurrent]
  let [answers, setAnswers] = useState({});
  const questionCollectionRef = collection(db, "questions");

  const handleAnswer = () => {
    answers[questionNumber] = currentAnswer;
    setAnswers(answers);
    // console.log(answers);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setQuestionScreen(false);

    setModalIsOpen(false);
    const ansArray = [];
    let ansLength = 0;

    Object.keys(answers).map((key) => {
      ansArray.push({
        question: questions[key - 1].question,
        answer: answers[key],
      });
    });

    const reviewRes = await addDoc(collection(db, "reviews"), {
      response: ansArray,
      id: "",
      completed: ansLength === questions.length ? true : false,
    });

    const reviewRef = doc(db, "reviews", reviewRes.id);

    await updateDoc(reviewRef, {
      id: reviewRes.id,
    });

    setModalIsOpen(false);
    setIsLoading(false);
    setExitScreen(true);

    // console.log(ansArray);
  };

  useEffect(() => {
    const getQuestions = async () => {
      const questionsSnapshot = await getDocs(questionCollectionRef);
      const questionsList = questionsSnapshot.docs.map((doc) => doc.data());
      setQuestions(questionsList);
      //   console.log(questionsList);
    };
    getQuestions();
    const prevAns = JSON.parse(localStorage.getItem("review"));
    if (prevAns) setAnswers(prevAns);
  }, []);

  useEffect(() => {
    // console.log(questionNumber);
  }, [questionNumber]);

  return (
    <div>
      {isLoading && (
        <div className="loader">
          <h2>Loading...</h2>
        </div>
      )}
      {welcomeScreen && (
        <div className="welcome">
          <h1>Welcome to the survey.</h1>
          <p>Click on the below button to start the survey.</p>
          <PrimaryButton
            label="Start"
            color="blue"
            onClick={() => {
              setWelcomeScreen(false);
              setQuestionScreen(true);
            }}
          />
        </div>
      )}
      {questionScreen && questions && (
        <div className="container">
          <div className="question_container">
            <div className="question_header">
              <h2>Customer survey</h2>
              <h3>
                {questionNumber}/{questions.length}{" "}
              </h3>
            </div>
            <div className="main">
              <div className="question">
                {questionNumber}. {questions[questionNumber - 1].question}
              </div>
              <div className="options">
                {questions[questionNumber - 1].type === "range" ? (
                  <div className="range">
                    {
                      <Options
                        count={questions[questionNumber - 1].range}
                        setCurrentAnswer={setCurrentAnswer}
                        questionNumber={questionNumber}
                        setQuestionNumber={setQuestionNumber}
                        handleAnswer={handleAnswer}
                        questions={questions}
                        answers={answers}
                      />
                    }
                  </div>
                ) : (
                  <div className="text_input">
                    <input
                      type="text"
                      onChange={(e) => {
                        setCurrentAnswer(e.target.value);
                        answers[questionNumber] = e.target.value;
                        localStorage.setItem("review", JSON.stringify(answers));
                      }}
                      value={answers[questionNumber]}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="buttons_container">
              <PrimaryButton
                label="Prev"
                color="pink"
                onClick={() =>
                  setQuestionNumber((prev) => (prev > 1 ? prev - 1 : 1))
                }
              />
              <div>
                <PrimaryButton
                  label={`${
                    questionNumber < questions.length ? "Next" : "Submit"
                  }`}
                  color="blue"
                  onClick={() => {
                    if (questionNumber < questions.length) {
                      setQuestionNumber((prev) =>
                        prev < questions.length ? prev + 1 : questions.length
                      );
                    } else {
                      handleAnswer();
                      setModalIsOpen(true);
                    }
                  }}
                />
                {questionNumber < questions.length ? (
                  <SecondaryButton
                    color="blue"
                    label="Skip"
                    onClick={() => {
                      setQuestionNumber((prev) =>
                        prev < questions.length ? prev + 1 : questions.length
                      );
                    }}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {exitScreen && (
        <div className="exit">
          <h1>Thanks for your response.</h1>
          <PrimaryButton
            label="Submit another response"
            color="blue"
            onClick={() => window.location.reload()}
          />
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        // appElement={"#root"}
      >
        <div className="submit_modal">
          <h2>Click on the below button to submit your response.</h2>
          <PrimaryButton
            label="Submit"
            color="blue"
            onClick={() => handleSubmit()}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Home;
