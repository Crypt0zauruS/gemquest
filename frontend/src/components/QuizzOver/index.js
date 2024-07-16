import { forwardRef, memo, useState } from "react";
import { GiTrophyCup } from "react-icons/gi";
import { SiStartrek } from "react-icons/si";
import Loader from "../Loader";
import { ToastContainer } from "react-toastify";

const QuizzOver = forwardRef((props, ref) => {
  const {
    levelNames,
    score,
    quizzLevel,
    percent,
    maxQuestions,
    loadLevelQuestions,
    askedQuestions,
    isLastLevel,
  } = props;

  const [loading, setLoading] = useState(false);

  const getFinalMessage = (score) => {
    if (score === 0) {
      return "Don't worry! You can try again and conquer the stars!";
    } else if (score > 0 && score <= 3) {
      return "Good effort, Captain! Keep training and you'll reach the stars!";
    } else if (score > 3 && score <= 6) {
      return "Well done, Commander! You're on your way to greatness!";
    } else if (score > 6 && score < 9) {
      return "Excellent work, Admiral! You're nearly a star expert!";
    } else {
      return "Outstanding, Admiral! You're an expert among the stars!";
    }
  };

  const decision = isLastLevel ? (
    <>
      <div className="stepsBtnContainer">
        <p className="successMsg">
          <GiTrophyCup size="50px" /> {getFinalMessage(score)}{" "}
        </p>
        <button className="btnResult gameOver" disabled={loading}>
          Mint Your Gems !
        </button>
      </div>
      <div className="percentage">
        <div className="progressPercent">
          Your score: {percent.toFixed(1)} %
        </div>
        <div className="progressPercent">
          Your mark: {score}/{maxQuestions * levelNames.length}
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="stepsBtnContainer">
        <p className="successMsg">
          <SiStartrek size="50px" /> Go ahead {levelNames[quizzLevel]}!
        </p>
        <button
          className="btnResult success"
          onClick={() => loadLevelQuestions(quizzLevel)}
        >
          Next level
        </button>
      </div>
      <div className="percentage">
        <div className="progressPercent">
          Your score: {percent.toFixed(1)} %
        </div>
        <div className="progressPercent">
          Your mark: {score}/{maxQuestions * (quizzLevel + 1)}
        </div>
      </div>
    </>
  );

  const QuestionsAndAnswers = (
    <table className="answers">
      <thead>
        <tr>
          <th>Questions</th>
          <th>Answers</th>
          <th>Your Answers</th>
        </tr>
      </thead>
      <tbody>
        {askedQuestions.map((questionData, index) => (
          <tr key={index}>
            <td>{questionData.question}</td>
            <td>{questionData.answer}</td>
            <td>{questionData.userAnswer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <ToastContainer />
      {decision}
      {loading && <Loader loadingMsg={"Transaction in progress..."} />}
      <hr />
      <div className="answerContainer">{QuestionsAndAnswers}</div>
    </>
  );
});

export default memo(QuizzOver);
