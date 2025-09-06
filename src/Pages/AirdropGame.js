import React, { useEffect } from "react";
import Header from "./Header";
import useState from "react-usestateref";
import { leaderboard } from "../utils/mockData";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { Bars } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const AirdropGame = () => {
  const [isStart, setIsStart] = useState(true);
  const [isSlideTop, setIsSlideTop] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);  // Track if timer is running
  const [time, setTime] = useState(0);  // Timer state in seconds
  const [answer, setAnswer] = useState("");  // Track answer input
  const [error, setError] = useState("");  // Error message
  const [finalResult, setFinalResult, finalResultref] = useState(null);  // Final answer and time
  const [equation, setEquation] = useState(""); // Generated equation for the quiz
  const [solution, setSolution] = useState(null); // Solution for the equation
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userPosition, setUserPosition] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const { t } = useTranslation();

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomEquation() {
    const coefficientA1 = getRandomInt(1, 10);
    const constantB1 = getRandomInt(-10, 10);
    const coefficientA2 = getRandomInt(1, 10);
    const constantB2 = getRandomInt(-10, 10);

    const equationType = getRandomInt(0, 2);
    let equation;
    let solution;

    switch (equationType) {
      case 0:
        equation = `${coefficientA1}x + ${constantB1} = ${coefficientA2}x + ${constantB2}`;
        solution = (constantB2 - constantB1) / (coefficientA1 - coefficientA2);
        break;
      case 1:
        const randomFactor = getRandomInt(1, 5);
        const randomConstant = getRandomInt(1, 5);
        equation = `${coefficientA1}(${randomFactor}x - ${randomConstant}) + ${constantB1} = ${coefficientA2}`;
        solution = (coefficientA2 - constantB1 + (coefficientA1 * randomConstant)) / (coefficientA1 * randomFactor);
        break;
      case 2:
        const additionalValue = getRandomInt(1, 5) / 5;
        equation = `${coefficientA1}x + ${additionalValue} + ${constantB1} = ${coefficientA2}x + ${constantB2}`;
        solution = (constantB2 - constantB1 - additionalValue) / (coefficientA1 - coefficientA2);
        break;
      default:
        equation = `${coefficientA1}x + ${constantB1} = ${coefficientA2}x + ${constantB2}`;
        solution = (constantB2 - constantB1) / (coefficientA1 - coefficientA2);
        break;
    }

    return { equation, solution };
  }

  useEffect(() => {
    const { equation, solution } = generateRandomEquation();
    // console.log(equation ,"--- equ soln ---- ",solution);
    setEquation(equation);
    setSolution(solution);
  }, []);

  const handleClick = () => {
    setIsStart(false);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.length > 20) {
      return;  // Don't allow more than 15 characters
    }

    setAnswer(value);

    // Show error if the input is cleared, otherwise hide the error
    if (value.trim() === "") {
      setError("Please enter an answer !");
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (answer.trim() === "") {
      setError("Please enter an answer !");
      return;
    }

    if (parseFloat(answer) === parseFloat(solution)) {
      // console.log("------ Answer correct ----");
      setError("");
      setIsTimerRunning(false);
      setFinalResult({
        answer: answer,
        time: formatTime(time),
        equation: equation,
        solution: solution
      });
      // console.log("Value submitted :",finalResultref.current);

      // Make an API call to send the correct answer and time to the backend
      var data = {
        apiUrl: apiService.quizSubmit,
        payload: finalResultref.current
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status == true) {
        setSubmitStatus(true);
        showsuccessToast(resp.Message);
      }

    } else {
      // console.log("------ Answer is Innncorrect ----");
      showerrorToast("Answer you entered is incorrect.Please try again")
      setIsTimerRunning(false);
      sessionStorage.setItem("stepsCompleted", false);
      navigate("/airdroptokens");
      // setError("Incorrect answer. Try again.");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    userStatusCheck();
    const verify = sessionStorage.getItem("stepsCompleted");
    if (verify == "false" || !verify) {
      navigate("/airdroptokens");
    }
  }, [])

  const userStatusCheck = async () => {
    try {
      var dataGet = {
        apiUrl: apiService.getUserStatus,
      };
      setSiteLoader(true);
      const data = await getMethod(dataGet);
      // console.log(data, "data");
      const { userStatus } = data;
      setSiteLoader(false);
      if (userStatus == 1) {
        setSubmitStatus(true);
      }
    } catch (error) {
    }
  }

  const handleSlideTop = () => {
    setIsSlideTop((prevSlideTop) => !prevSlideTop);
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  useEffect(() => {
    if (submitStatus) {
      const fetchLeaderboard = async () => {
        try {
          const data = {
            apiUrl: apiService.quizLeaderboard // This should be the endpoint to fetch leaderboard data
          };
          setSiteLoader(true);
          var response = await getMethod(data);
          setSiteLoader(false);
          // console.log(response,"-----response---");
          if (response.status == true) {
            setUserPosition(response.data);
            setCurrentUser(response.data.userDetails);
            // console.log(response.data.userDetails,"----current user position---",response.data);
            setLeaderboard(response.data.top10Leaderboard); // Assuming you have a leaderboard state to store data
          } else {
            showerrorToast("Failed to fetch leaderboard data");
          }
        } catch (error) {
          showerrorToast("An error occurred while fetching the leaderboard");
        }
      };

      fetchLeaderboard();
    }
  }, [submitStatus]);

  return (
    <>
      <section className="Non_fixed_nav airdrop-nav ">
        <Header />
      </section>
      {siteLoader == true ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#ffc630"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <section className="airdrop-container">
          <div className="container">
            <div className="row airdrop-row">
              <div className="col-lg-12 my-3 py-4">
                {" "}
                {/* Start When you're ready */}
                {submitStatus == false ? (
                  <div className="welcome-outer">
                    <div className="wel-border">
                      <div className="wel-start-inner ">
                        <h4 className="welcome-title">{t('start_Ready')}</h4>
                        <h5 className="welcome-content wel-content-width">
                          {t('type_possible')}
                        </h5>
                        <div className={`start-box ${!isStart ? "blurred" : ""}`}>
                          <h6>
                            {t('if')} <span>{equation},</span>
                          </h6>
                          <p>{t('what_x')}</p>
                          <input
                            type="number"
                            placeholder="Enter the answer here"
                            className="start-input"
                            value={answer}
                            name="answer"
                            onKeyDown={(evt) =>
                              ["e", "E", "+"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            onChange={handleInputChange}
                            disabled={isStart}
                            maxLength={20}
                          />
                          {error && <div className="errorcss">{error}</div>}
                          {isStart && (
                            <div className="wel-start-btn-wrap">
                              <button onClick={handleClick}>{t('start')}</button>
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                          {buttonLoader == false ? (
                            <button className={isStart == false ? "airdrop-step-btn" : "airdrop-step-btn-disabled"}
                              onClick={handleSubmit}
                              disabled={isStart}
                            >{t('submit')}</button>
                          ) : (
                            <button className="airdrop-step-btn"
                              disabled={isStart}
                            >{t('Loading')}...</button>
                          )}
                        </div>
                        {/* {error && <div className="error-message">{error}</div>} */}
                      </div>
                      <div className="stopwatch-container">
                        <img
                          src={require("../assets/stopwatch.png")}
                          alt="stopwatch"
                        />
                        {/* <span>00:00:00</span> */}
                        <span>{formatTime(time)}</span>
                      </div>
                      {/* {finalResult && (
                  <div className="result-box">
                    <h4>Final Answer: {finalResult.answer}</h4>
                    <h5>Time Taken: {finalResult.time}</h5>
                  </div>
                )} */}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link to="/airdroptokens">
                      <h6 className="air_back">
                        {" "}
                        <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('back')}
                      </h6>
                    </Link>
                    <div className="leaderboard-outer mt-2">
                      <div className="leaderboard-inner">
                        <h5 className="welcome-title mb-4">{t('well_Done')}</h5>
                        <div className="success-img-wrapper">
                          <img
                            src={require("../assets/leaderboard-success.png")}
                            alt="leaderboard-success"

                          />
                        </div>
                        <p>
                          {t('your_estimated')}
                          <span class="text-style-1 mx-1"> {currentUser.time} </span>
                        </p>

                        <div
                          className={`leaderboard-container ${isSlideTop
                              ? "leaderboard-height"
                              : "leaderboard-container"
                            } `}
                        >
                          <div className="leaderboard-title">
                            <div>
                              <span>
                                <i class="fa-solid fa-chart-simple"></i>
                              </span>
                              <span className="mx-3 Leaderboard">{t('leaderboard')}</span>
                            </div>
                            <div onClick={handleSlideTop}>
                              {isSlideTop ? (
                                <span>
                                  <i class="fa-solid fa-down-left-and-up-right-to-center"></i>
                                </span>
                              ) : (
                                <span>
                                  <i class="fa-solid fa-up-right-and-down-left-from-center"></i>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="leaderboard-main">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="text-start pad-lft-20">{t('position')}</th>
                                  <th>{t('username')}</th>
                                  <th className="text-end">{t('time_Taken')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaderboard.map((leaderDetails, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-start pad-lft-30 ">
                                        {index + 1}
                                      </td>
                                      <td>{leaderDetails.username}</td>
                                      <td className="text-yellow led-pad-ryt-20 text-end">
                                        {leaderDetails.time}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="leaderboard-footer">
                            <div className="leaderboard-footer-content">
                              {t('you')} <span>( {userPosition.userPosition} )</span>
                            </div>
                            <div className="leaderboard-footer-content pad-ryt-30">
                              {currentUser.username}
                            </div>
                            <div className="leaderboard-footer-content">
                              {currentUser.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AirdropGame;
