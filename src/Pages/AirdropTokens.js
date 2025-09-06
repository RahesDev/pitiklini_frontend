import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import moment from "moment";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import Countdown from "react-countdown";
import { Bars } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const AirdropTokens = () => {
  const stepperNum = [1, 2, 3, 4];
  const { t } = useTranslation();
  // const [timeRemaining, setTimeRemaining] = useState(null);
  // const [dropStartTime, setDropStartTime] = useState(null);

  const [stepCount, setStepCount] = useState(1);
  const [userStatus, setUserStatus] = useState(0);
  const [airdrop, setAirdrop, airdropref] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [stage, setStage] = useState("before"); // 'before', 'during', or 'after' the airdrop
  const [apiCalled, setApiCalled] = useState(false);
  const [dropStatus, setDropStatus] = useState(1);
  const [loginStatus, setLoginStatus] = useState(false);
  const [siteLoader, setSiteLoader] = useState(false);

  const navigate = useNavigate();

  const handleSlide = () => {
    setStepCount((prevStep) =>
      prevStep < stepperNum.length ? prevStep + 1 : prevStep
    );
    // console.log(stepCount);
    if (loginStatus === false) {
      navigate("/login"); // Redirect to login if not logged in
    }
    if (stepCount == 4) {
      sessionStorage.setItem("stepsCompleted", true);
    }
  };

  const filteredStepperNum = stepperNum.slice(0, -1);

  useEffect(() => {
    fetchDropDatas();
    loginCheck();
  }, []);

  const fetchDropDatas = async () => {
    try {
      const dataGet = { apiUrl: apiService.getAirdropSetting };
      setSiteLoader(true);
      const data = await getMethod(dataGet);
      if(data.status == true){
      setAirdrop(data.data);
      setDropStatus(data.data.status);
      setSiteLoader(false);
      // console.log(data.data, "----data------",data.data.status);
      }else {
        setDropStatus(0);
      }
      // console.log(stage, "----stage------");
      // console.log(apiCalled, "----apiCalled------");
    } catch (error) {
      // console.log(error, "----error------");
    }
  };

  const loginCheck = async () => {
    let tokenVerify = sessionStorage.getItem("user_token");
    if (!tokenVerify || tokenVerify == "") {
      setLoginStatus(false);
    } else {
      setLoginStatus(true);
      var dataGet = {
        apiUrl: apiService.getUserStatus,
      };
      setSiteLoader(true);
      const data = await getMethod(dataGet);
      // console.log(data, "data");
      const { userStatus } = data;
      setUserStatus(userStatus);
      setSiteLoader(false);
    }
  };

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateCountdown();
  }, [airdrop, currentTime]);

  const handleAirdropEnd = async () => {
    try {
      // console.log("Airdrop ended, API response:--- ends come");
      const dataGet = { apiUrl: apiService.dropEndaction };
      const data = await getMethod(dataGet);
      // console.log(data.message, "----- ends mess ----");
      setStage("before");
      sessionStorage.setItem("stepsCompleted", false);
      loginCheck();
    } catch (error) {
      // console.log("Error ending airdrop:", error);
    }
  };

  const calculateCountdown = () => {
    if (airdropref.current !== "") {
      const { dropDate, dropStart, dropEnd, dropTime } = airdropref.current;
      let dropStartTime = new Date(dropDate);

      // Handle AM/PM for dropStart
      const isPM = dropStart.includes("PM");
      let startHour = parseInt(dropStart.replace(/[^\d]/g, ""), 10);
      if (isPM && startHour !== 12) {
        startHour += 12; // Convert PM hours to 24-hour format
      } else if (!isPM && startHour === 12) {
        startHour = 0; // Convert 12 AM to 0 hours
      }
      dropStartTime.setHours(startHour, 0, 0, 0); // Set to the correct drop start time

      // If the initial dropStartTime is in the future, set stage to 'before'
      if (currentTime < dropStartTime) {
        const dropEndTime = new Date(
          dropStartTime.getTime() + dropEnd * 60 * 60 * 1000
        );
        setStage("before");
        const timeDiff = dropStartTime - currentTime;
        setCountdown({
          days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)), 
          hours: Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
        setApiCalled(false);
        return;
      }

      // Calculate the number of intervals that have passed since dropStartTime
      const intervalMs = dropTime * 60 * 60 * 1000;
      const elapsedMs = currentTime - dropStartTime;
      const intervalsPassed = Math.floor(elapsedMs / intervalMs);

      // Calculate the latest dropStartTime
      const latestDropStartTime = new Date(
        dropStartTime.getTime() + intervalsPassed * intervalMs
      );

      // Calculate dropEndTime for the latest airdrop
      const dropEndTime = new Date(
        latestDropStartTime.getTime() + dropEnd * 60 * 60 * 1000
      );

      if (currentTime >= latestDropStartTime && currentTime < dropEndTime) {
        // Stage: During the airdrop
        setStage("during");
        const timeDiff = dropEndTime - currentTime;
        setCountdown({
          hours: Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });

        // Check if countdown reached zero
        // console.log(timeDiff, "timeDiff----apiCalled", apiCalled);
        if (timeDiff <= 2000 && !apiCalled) {
          handleAirdropEnd(); // API call when countdown reaches zero
          setApiCalled(true); // Prevent further API calls during this drop
        }
      } else {
        // Stage: After the airdrop, before the next one
        const nextDropStartTime = new Date(
          latestDropStartTime.getTime() + intervalMs
        );
        setStage("before");
        const timeDiff = nextDropStartTime - currentTime;
        setCountdown({
          hours: Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
        });
        setApiCalled(false);
      }
    }
  };

  const handleTelegram = () => {
    // Redirect to the Telegram bot with /start command
    window.open('https://t.me/Wxdlcoin_Bot?start', '_blank'); // Replace YourBotName with your bot's username
  };

  const loginNav = () => {
    navigate("/login");
  }

  return (
    <>
      {" "}
      <section className="Non_fixed_nav airdrop-nav ">
        <Header />
      </section>{" "}
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
        {stepCount <= 3 ? (
          <div className="container">
            <div className="row airdrop-row">
              <div className="col-lg-12 text-center my-3 py-4">
                {dropStatus == 1 ? (
                <div>
                  {/* airdrop title */}
                  <div>
                    <h5 className="Play-and-Win-Your-Free-Tokens">
                      {t('play_Your')}
                      <span className="text-style-1"> {t('free_Tokens')}</span>
                    </h5>
                    <div className="free-token-content">
                      {t('answer_the_quiz')}
                    </div>
                  </div>

                  {/* stepper */}
                  <div className="step-container">
                    {/* {stepperNum.map((stepper, index) => {
                      return (
                        <div
                          key={stepper}
                          className={`stepper-contents ${
                            stepCount >= index + 1 && "active-step"
                          } ${stepCount > index && "active-line"}`}
                        >
                          <div className="stepper-count">{stepper}</div>
                        </div>
                      );
                    })} */}{" "}
                    {filteredStepperNum.map((stepper, index) => (
                      <div
                        key={stepper}
                        className={`stepper-contents ${
                          stepCount >= index + 1 ? "active-step" : ""
                        } ${stepCount > index ? "active-line" : ""}`}
                      >
                        <div className="stepper-count">{stepper}</div>
                      </div>
                    ))}
                  </div>

                  {/* box */}
                  <div className="outer-box">
                    <div className="Frame-15307">
                      {/* {timeLeft ? ( */}
                      <div className="earning-cards">
                        {airdrop ? (
                          <div>
                            {stage === "before" && (
                              <div className="identify-title mb-5">
                                <p className="identify-title mb-4">
                                  {t('next_Airdrop')}
                                </p>
                                <p className="countdown-style mb-5">
                                {countdown.days > 0 && `${countdown.days}d `} {countdown.hours}h {countdown.minutes}m{" "}
                                  {countdown.seconds}s
                                </p>
                              </div>
                            )}
                            {stage === "during" && (
                              <div className="identify-title mb-5">
                                <p className="identify-title mb-4">
                                  {t('airdrop_Ends')}
                                </p>
                                <p className="countdown-style mb-5">
                                {countdown.days > 0 && `${countdown.days}d `} {countdown.hours}h {countdown.minutes}m{" "}
                                  {countdown.seconds}s
                                </p>
                              </div>
                            )}
                            {stage === "after" && (
                              <div className="identify-title mb-5">
                                <p className="identify-title mb-4">
                                {t('next_Airdrop')}
                                </p>
                                <p className="countdown-style mb-5">
                                {countdown.days > 0 && `${countdown.days}d `} {countdown.hours}h {countdown.minutes}m{" "}
                                  {countdown.seconds}s
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p>{t('loading_airdropdata')}...</p>
                        )}
                      </div>
                      {/* ) : ( */}
                      {userStatus == 0 ? (
                        <div className="earning-cards mt-4">
                          <h6 className="STEP-1">
                            {" "}
                            {stepCount === 3
                              ? "Are you ready ?"
                              : stepCount === 2
                              ? "STEP 2"
                              : "STEP 1"}
                          </h6>
                          <p className="Register-with-Voltrix-Crypt-to-join-the-airdrop pt-2">
                            {" "}
                            {stepCount === 3
                              ? "If you’re ready click here to begin the game!"
                              : stepCount === 2
                              ? " Register with Voltrix Crypt to join the airdrop!"
                              : " Register with Voltrix Crypt to join the airdrop!"}
                          </p>
                          {/* <div className="d-flex align-items-center justify-content-center"> */}
                          <div className="air_main_change">
                            <button
                              className={
                                loginStatus === false || stage == "during"
                                  ? "airdrop-step-btn"
                                  : "airdrop-step-btn-disabled"
                              }
                              // onClick={handleSlide}
                              // onClick={stage == "during" ? handleSlide : null} // Enable click only when the airdrop is active
                              onClick={
                                loginStatus === false
                                  ? () => loginNav() // If not logged in, navigate to login
                                  : stage === "during"
                                  ? handleSlide // If logged in and airdrop active, handle the slide
                                  : null // Otherwise, do nothing
                              }
                              disabled={loginStatus !== false && stage !== "during"}
                            >
                              {stepCount === 3 ? (
                                <span>
                                  {t('lets_Go')}{" "}
                                  <span className="mx-1 lets-arrow">
                                    <i class="fa-solid fa-arrow-right"></i>
                                  </span>
                                </span>
                              ) : stepCount === 2 ? (
                                <div className="text-clr" onClick={handleTelegram}>
                                  <div className="d-flex align-items-center justify-content-center gap-2">
                                    <span>
                                      <i class="fa-brands fa-telegram"></i>{" "}
                                    </span>
                                    <span className="">{t('telegram')}</span>
                                    <i class="fa-brands fa-telegram"></i>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {loginStatus == false ? (
                                    <div className="text-clr" onClick={()=>loginNav()}>
                                      <span>
                                        {" "}
                                        {t('login')}
                                        <span className="mx-1 lets-arrow">
                                          <i class="fa-solid fa-arrow-right"></i>
                                        </span>
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-clr">
                                        <span>
                                        {t('lets_Go')}
                                          <span className="mx-1 lets-arrow">
                                            <i class="fa-solid fa-arrow-right"></i>
                                          </span>
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </button>
                            {stepCount === 2 && (
                              <div
                                className="cursor-pointer"
                                onClick={handleSlide}
                              >
                                <span className="text-clr">
                                  {t('skip')}{" "}
                                  <i class="fa-solid fa-arrow-right px-2"></i>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="airdrop-finish-ones mt-5">
                          <span className="identify-title">
                            {t('you_yourtask')}
                          </span>
                          <span className="identify-title">
                            {t('wait_airdrop')}
                          </span>
                          <div className="mb-2">
                          <Link to="/airdropgame">
                          <button className="airdrop-step-btn viewlea">
                           <span className="mb-3">
                                  {t('viewleaderboard')}
                                  <span className="mx-1 lets-arrow">
                                    <i class="fa-solid fa-arrow-right"></i>
                                  </span>
                                </span>
                                </button>
                        </Link>
                        </div>
                        </div>
                      )}
                      {/* )} */}
                    </div>
                  </div>
                </div>
        ) : (
          <div className="welcome-outer-airno" data-aos="fade-up">
            <div className="welcome-inner-airno">
                <div className="air_no_main mt-4">
                  <img src={require("../assets/airdrop-nostatus.png")} alt="OOPS!" className="air-no-img"/>
                  <div className="air_no_main mt-2">
                    <div className="d-flex flex-column g-2">
                    <h5 className="noair_head">
                    {t('missed_This_Airdrop')}
                      <span className="text-style-1"> {t('dont_Worry')}</span>
                    </h5>
                    <span className="identify-title-airno">
                    {t('stay_futureopportunities')}
                    </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <Link to={loginStatus == false ? "/" : "/dashboard"}>
                          <button
                            className="airdrop-step-btn"
                          >
                            {t('back')}
                          </button>
                        </Link>
                      </div>
                  </div>
                 </div> 
             </div> 
          </div>
        )}
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row airdrop-row">
              <div className="col-lg-12 my-3 py-4">
                {" "}
                {/* welcome box */}
                <div className="welcome-outer" data-aos="fade-up">
                  <div className="welcome-inner">
                    <div>
                      <h4 className="welcome-title">{t('welcometotheGame')}</h4>
                      <h5 className="welcome-content ">{t('hereshowitworks')}</h5>
                      <div className="wel-step-wrapper mar-top-42">
                        <h6 className="wel-step">{t('step_1')}</h6>
                        <div className="wel-step-content-wrap">
                          <h5 className="wel-sub-title">{t('startthe_Time')}</h5>
                          <p className="wel-sub-content">
                            {t('clickbuttontobegin')}
                          </p>
                        </div>
                      </div>{" "}
                      <div className="wel-step-wrapper mar-top-42">
                        <h6 className="wel-step">{t('step_1')} 2</h6>
                        <div className="wel-step-content-wrap">
                          <h5 className="wel-sub-title">{t('answerquickly')}</h5>
                          <p className="wel-sub-content">
                            {t('respondtothequiz')}
                          </p>
                        </div>
                      </div>
                      <div className="wel-step-wrapper mar-top-42">
                        <h6 className="wel-step">{t('step_1')} 3</h6>
                        <div className="wel-step-content-wrap">
                          <h5 className="wel-sub-title">{t('trackTime')}</h5>
                          <p className="wel-sub-content">
                            {t('yourresponsetime')}
                          </p>
                        </div>
                      </div>
                      <div className="wel-step-wrapper mar-top-42">
                        <h6 className="wel-step">{t('step_1')} 4</h6>
                        <div className="wel-step-content-wrap">
                          <h5 className="wel-sub-title">{t('wintheReward')}</h5>
                          <p className="wel-sub-content">
                            {t('thefastestreward')}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center my-4">
                        <Link to="/airdropgame"> 
                          <button
                            className="airdrop-step-btn"
                            onClick={handleSlide}
                          >
                            {t('next')}
                          </button>
                       </Link> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      )}
    </>
  );
};

export default AirdropTokens;
