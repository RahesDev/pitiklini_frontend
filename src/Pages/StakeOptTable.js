import React, { useEffect } from "react";
import { selectDate, stakeOpt } from "../utils/mockData";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Bitcoin from "../assets/btc.png";
import line from "../assets/straightLine.png";
import useState from "react-usestateref";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { t } from "i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StakeOptTable = (data) => {
  const [open, setOpen] = useState(false);
  const [stakeData, setStakeData, stakeDataref] = useState({});
  const [Duration, setDuration] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [stakecurrentDate, setstakeCurrentDate] = useState("");
  const [stakeendDate, setstakeendDate] = useState("");
  const [accuralDate, setaccuralDate] = useState("");
  const [stakeValue, setstakeValue] = useState("");
  const [userDailyInterest, setuserDailyInterest] = useState(0);
  const [userTotlaInterest, setuserTotlaInterest] = useState(0);
  const [FlexibleEarn, setFlexibleEarn] = useState(0);
  const [TotalFlexible, setTotalFlexible] = useState(0);
  const [apy, setApy] = useState(0);
  const [errorState, setErrorState] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [buttonStatus, setbuttonStatus] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [availaleBalance, setavailableBalance, availaleBalanceref] =
    useState(0);

  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      const todaydate = new Date();
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedCurrentDate = todaydate.toLocaleString("en-GB", options);
      setCurrentDate(formattedCurrentDate);
      setLoginStatus(true);
      // console.log(stakeData, "stakeData");
    } else {
      setLoginStatus(false);
    }
  }, []);

  const navigate = useNavigate();

  const loginNave = async () => {
    navigate("/login");
  };

  const handleOpen = (option) => {
    console.log(option, "optinons");
    setStakeData(option);
    setOpen(true);
    getBalance();
    const todaydate = new Date();
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedCurrentDate = todaydate.toLocaleString("en-GB", options);
    setCurrentDate(formattedCurrentDate);
    // console.log(stakeData, "stakeData");
  };

  const handleClose = () => {
    setOpen(false);
    setErrorState(false);
    setErrorMsg("");
    setDuration("");
    setuserTotlaInterest("");
    setTotalFlexible("");
    setstakeValue(0);
  };

  const selectDuration = (data) => {
    console.log(data, "ljfijdsalkf", data.durationApy);
    setDuration(data.duration);
    setApy(data.durationApy);
    if (Duration !== "") {
      setErrorState(false);
      setErrorMsg("");
    }
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    // endDate.setDate(currentDate.getDate() + data.duration);
    if (data.duration >= 1) {
      endDate.setDate(currentDate.getDate() + data.duration);
    } else if (data.duration === 0.5) {
      endDate.setHours(currentDate.getHours() + 12);
    }
    setstakeCurrentDate(currentDate);
    setstakeendDate(endDate);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedCurrentDate = currentDate.toLocaleString("en-GB", options);
    const formattedEndDate = endDate.toLocaleString("en-GB", options);
    setCurrentDate(formattedCurrentDate);
    setendDate(formattedEndDate);
    setaccuralDate(formattedEndDate);

    if (stakeValue && !isNaN(parseFloat(stakeValue))) {
      const amount = parseFloat(stakeValue);
      if (stakeData.type === "fixed") {
        const dailyInterest = amount * (+data.durationApy / 100 / 365);
        const totalInterest = parseFloat(dailyInterest) * data.duration;
        setuserTotlaInterest(totalInterest || 0);
        setuserDailyInterest(dailyInterest || 0);
        setErrorMsg("");
        setstakeValue(0);
      } else if (stakeData.type === "flexible") {
        const dailyInterestFlex = amount * (+stakeData.APRinterest / 100 / 365);
        const totalInterestFlex = parseFloat(dailyInterestFlex) * 1;
        setFlexibleEarn(dailyInterestFlex || 0);
        setTotalFlexible(totalInterestFlex);
        setErrorMsg("");
        setstakeValue(0);
      }
    }
  };

  // const stakeAmount = (e) => {
  //   try {
  //     console.log("stakeAmount ---- comes ------ 1111 ");
  //     const value = e.target.value;

  //     if (Duration == "" && stakeData.type === "fixed") {
  //       console.log("its comes for fixed check");
  //       setErrorState(true);
  //       setErrorMsg("Choose Duration");
  //     } else if (value.length > 15) {
  //       setstakeValue();
  //       setErrorState(true);
  //       setErrorMsg("Invalid Amount");
  //     } else if (value == "00000") {
  //       setErrorState(true);
  //       setErrorMsg("Invalid Amount");
  //     } else if (value == "0.0000") {
  //       setErrorState(true);
  //       setErrorMsg("Invalid Amount");
  //     } else if (value < stakeData.minimimumStaking) {
  //       setErrorState(true);
  //       setErrorMsg(`Minimum staking level ${stakeData.minimimumStaking} `);
  //     } else if (value > stakeData.maximimumStaking) {
  //       setErrorState(true);
  //       setErrorMsg(`Minimum staking level ${stakeData.maximimumStaking} `);
  //     } else {
  //       setErrorState(false);
  //       setstakeValue(value);
  //       setbuttonStatus(true);
  //     }

  //     var amount = parseFloat(e.target.value);
  //     if (stakeData.type === "fixed") {
  //       var dailyinterest = amount * (+apy / 100 / 365);
  //       var totalInterest = parseFloat(dailyinterest) * Duration;
  //       setuserTotlaInterest(totalInterest ? totalInterest : 0);
  //       setuserDailyInterest(dailyinterest ? dailyinterest : 0);
  //     } else if (stakeData.type === "flexible") {
  //       console.log("amount::::", amount, "interest:::", stakeData.APRinterest);
  //       var dailyinterestDate = amount * (+stakeData.APRinterest / 100 / 365);
  //       var totalInterestFlex = parseFloat(dailyinterestDate) * 1;
  //       setFlexibleEarn(dailyinterestDate ? dailyinterestDate : 0);
  //       setTotalFlexible(totalInterestFlex);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //     // showerrorToast("Please try again later");
  //   }
  // };

  const getBalance = async () => {
    console.log("currency_id--->>>", stakeDataref.current.currencyId);
    var obj = { currency_id: stakeDataref.current.currencyId };
    var data = {
      apiUrl: apiService.getBalancestake,
      payload: obj,
    };
    var resp = await postMethod(data);
    setavailableBalance(resp.balance ? resp.balance : 0);
    // getstakeBalance()
  };
  const getstakeBalance = async () => {
    getBalance();
  };

  const caluculateMax = () => {
    if (Duration == "" && stakeData.type === "fixed") {
      setErrorState(true);
      setErrorMsg("Choose Duration");
    } else {
      setErrorState(false);
      setstakeValue(availaleBalanceref.current);
      setbuttonStatus(true);
      if (stakeData.type === "fixed") {
        var dailyinterest = availaleBalanceref.current * (+apy / 100 / 365);
        var totalInterest = parseFloat(dailyinterest) * Duration;
        setuserTotlaInterest(totalInterest ? totalInterest : 0);
        setuserDailyInterest(dailyinterest ? dailyinterest : 0);
      } else if (stakeData.type === "flexible") {
        var dailyinterestDate =
          availaleBalanceref.current * (+stakeData.APRinterest / 100 / 365);
        var totalInterestFlex = parseFloat(dailyinterestDate) * 1;
        setFlexibleEarn(dailyinterestDate ? dailyinterestDate : 0);
        setTotalFlexible(totalInterestFlex);
      }
    }
  };

  const stakeAmount = (e) => {
    try {
      const value = e.target.value;

      const regex = /^\d*\.?\d*$/;

      // If value doesn't match the regex, do nothing
      if (!regex.test(value)) {
        return;
      }

      // Limit to 15 characters/digits including the decimal point
      if (value.length > 15) {
        setErrorState(true);
        setErrorMsg("You can only enter up to 15 digits.");
        setbuttonStatus(false);
        return;
      }

      setstakeValue(value);

      // Convert value to a number to handle numeric comparison later
      const amount = parseFloat(value);

      // Initial validation: Check if it's a valid number
      if (isNaN(amount)) {
        setErrorState(true);
        setErrorMsg("Please enter a valid amount");
        setbuttonStatus(false);
        return;
      }

      // Validation for duration if necessary
      if (Duration === "" && stakeData.type === "fixed") {
        setErrorState(true);
        setErrorMsg("Choose Duration");
        setbuttonStatus(false);
      }
      // Check for length of the input
      // else if (value.length > 15) {
      //   setErrorState(true);
      //   setErrorMsg("Amount is too long");
      // }
      // Check for invalid leading zeros
      // else if (value.startsWith("0") && value.length > 1) {
      //   setErrorState(true);
      //   setErrorMsg("Invalid Amount");
      //   setbuttonStatus(false);
      // }
      // Check for minimum staking level
      else if (amount < stakeData.minimimumStaking) {
        setErrorState(true);
        setErrorMsg(`Minimum staking level is ${stakeData.minimimumStaking}`);
        setbuttonStatus(false);
      }
      // Check for maximum staking level
      else if (amount > stakeData.maximimumStaking) {
        setErrorState(true);
        setErrorMsg(`Maximum staking level is ${stakeData.maximimumStaking}`);
        setbuttonStatus(false);
      }
      // If all validations pass, set the value and clear any errors
      else {
        setErrorState(false);
        setErrorMsg(""); // Clear the error message
        // Now we can set the valid value
        setbuttonStatus(true); // Enable button
      }

      // Additional logic for calculating interest, assuming amount is valid
      if (!isNaN(amount)) {
        if (stakeData.type === "fixed") {
          const dailyInterest = amount * (+apy / 100 / 365);
          const totalInterest = parseFloat(dailyInterest) * Duration;
          setuserTotlaInterest(totalInterest || 0);
          setuserDailyInterest(dailyInterest || 0);
        } else if (stakeData.type === "flexible") {
          const dailyInterestFlex =
            amount * (+stakeData.APRinterest / 100 / 365);
          const totalInterestFlex = parseFloat(dailyInterestFlex) * 1;
          setFlexibleEarn(dailyInterestFlex || 0);
          setTotalFlexible(totalInterestFlex);
        }
      }
    } catch (error) {
      // console.log("Error", error);
    }
  };

  const stake = async (e) => {
    try {
      const currentDate = new Date();

      e.preventDefault();
      setbuttonLoader(true);
      // console.log("staketSubmitfunction");
      var obj = {
        stakingPlan: stakeData.type === "fixed" ? Duration : 0,
        totalInterest:
          stakeData.type === "fixed" ? +userTotlaInterest : +TotalFlexible,
        dailyinterest:
          stakeData.type == "fixed" ? +userDailyInterest : +FlexibleEarn,
        startDate: stakeData.type == "fixed" ? stakecurrentDate : currentDate,
        endDate: stakeendDate,
        currentAPY: stakeData.type === "fixed" ? +apy : +stakeData.APRinterest,
        stakeMore: stakeData.stakeid,
        stakeAmont: +stakeValue,
        type: stakeData.type,
      };
      // console.log(obj,"-----obj----stake---");
      // return;
      var data = {
        apiUrl: apiService.confirmStaking,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status == true) {
        setbuttonLoader(false);
        showsuccessToast(resp.Message);
        handleClose();
        window.location.reload();
      } else {
        setbuttonLoader(false);
        showerrorToast(resp.Message);
      }
    } catch (err) {}
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head font-satoshi">
            <th>{t("currency")}</th>
            <th className="txt-center opt-nowrap pad-left-23">
              {t("Reference APR / APY")}
            </th>
            <th className="txt-center opt-nowrap pad-left-23">
              {t("minimumStaking")}
            </th>
            <th className="txt-center opt-nowrap pad-left-23">
              {t("maximumStaking")}
            </th>
            <th className="txt-center pad-left-23">{t("term")}</th>
            <th className="opt-btn-flex table-action pad-left-23 pad-rght-tab-staknew">
              {t("action")}
            </th>
          </tr>
        </thead>

        <tbody>
          {data.data.length > 0 ? (
            data.data.map((options) => {
              return (
                <tr key={options.id}>
                  <td className="table-flex">
                    <img src={options.currencyImage} alt="" />
                    <div className="table-opt-name">
                      <h4 className="opt-name font-satoshi font_14">
                        {options.currencyName}
                      </h4>
                      <h3 className="opt-sub font-satoshi font_14">
                        {options.currencySymbol}
                      </h3>
                    </div>
                  </td>
                  <td className="opt-percent font-satoshi font_14 table_center_text pad-left-23">
                    {options.APRinterest} %
                  </td>
                  <td className="opt-percent font-satoshi font_14 table_center_text pad-left-23">
                    {options.minimimumStaking}
                  </td>
                  <td className="opt-percent font-satoshi font_14 table_center_text pad-left-23">
                    {options.maximimumStaking}
                  </td>
                  <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                    {options.type}
                  </td>
                  <td className="opt-btn-flex table-action pad-left-23">
                    {loginStatus == true ? (
                      <button
                        className="action_btn"
                        onClick={() => handleOpen(options)}
                      >
                        {t("stakeNow")}
                      </button>
                    ) : (
                      <button
                        className="action_btn"
                        onClick={() => loginNave()}
                      >
                        {t("loginToContinue")}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-5">
                <div className="empty_data">
                  <div className="empty_data_img">
                    <img
                      src={require("../assets/No-data.webp")}
                      width="100px"
                    />
                  </div>
                  <div className="no_records_text">{t("noRecordsFound")}</div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <div className="paginate font-satoshi">
        <span>
          <i class="fa-solid fa-chevron-left"></i>
        </span>
        <span className="paginate-one">1</span>
        <span>2</span>
        <span>
          <i class="fa-solid fa-chevron-right"></i>
        </span>
      </div> */}

      {/* staking flexible */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modals">
          <div className="container">
            <div className="row">
              {/* left - staking flexible*/}
              <div className="col-lg-6 left-preview">
                <div className="left">
                  <div className="modal-left-header">
                    <img
                      src={stakeData.currencyImage}
                      alt="currency"
                      className="bitcoin-img"
                    />
                    <span className="stake-flexi">
                      {t("staking")} - {stakeData.type}
                    </span>
                  </div>
                  <div className="modal-left-main">
                    {stakeData.type === "fixed" ? (
                      <div className="modal-selectDate">
                        <h6 className="modal-select-title">
                          {t("selectTheDate")}
                        </h6>
                        <div className="modal-flex">
                          {stakeData.duration === "" ||
                          stakeData.duration === undefined ||
                          stakeData.duration === null
                            ? ""
                            : stakeData.duration.length > 0
                            ? stakeData.duration.map((days) => {
                                return (
                                  <div
                                    key={days.duration}
                                    className={`${
                                      Duration === days.duration
                                        ? "modal-days-active"
                                        : "modal-days"
                                    }`}
                                    onClick={() => selectDuration(days)}
                                  >
                                    <p>{days.duration} D</p>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {stakeData.type === "fixed" ? (
                      <div className="modal-left-flex">
                        <h6 className="modal-titles">{t("Reference APY")}</h6>
                        <h5 className="modal-titles-green">{apy} %</h5>
                      </div>
                    ) : (
                      <div className="modal-left-flex">
                        <h6 className="modal-titles">{t("Reference APR")}</h6>
                        <h5 className="modal-titles-green">
                          {stakeData.APRinterest} %
                        </h5>
                      </div>
                    )}

                    <div className="modal-left-flex">
                      {" "}
                      <h6 className="modal-titles">{t("term")}</h6>
                      <h5 className="modal-right-titles">{stakeData.type}</h5>
                    </div>
                    {stakeData.type === "fixed" ? (
                      <div className="modal-left-flex">
                        {" "}
                        <h6 className="modal-titles">
                          {t("redemptionPeriod")}
                        </h6>
                        <h5 className="modal-right-titles">
                          {Duration === "" ||
                          Duration === undefined ||
                          Duration === null
                            ? 0
                            : Duration}{" "}
                          {t("days")}
                        </h5>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="modal-left-foot">
                    <h6 className="modal-left-title">{t("amount")}</h6>
                    <div className="modal-input">
                      <input
                        type="number"
                        placeholder={t("enterAmount")}
                        className="modal-input-num"
                        value={stakeValue}
                        onChange={stakeAmount}
                        min="0"
                      />
                      {errorState === true ? (
                        <p className="text-red"> {errorMsg}</p>
                      ) : (
                        ""
                      )}
                      <span className="modal-span1">
                        {stakeData.currencySymbol}
                      </span>
                      <span className="modal-span2" onClick={caluculateMax}>
                        MAX
                      </span>
                    </div>
                    <div className="modal-left-flex">
                      <h5 className="modal-titles">{t("minimumAmount")}</h5>
                      <h4 className="modal-right-titles">
                        {" "}
                        {stakeData.minimimumStaking} {stakeData.currencySymbol}
                      </h4>
                    </div>
                    <div className="modal-left-flex">
                      <h5 className="modal-titles">{t("maximumAmount")}</h5>
                      <h4 className="modal-right-titles">
                        {stakeData.maximimumStaking} {stakeData.currencySymbol}
                      </h4>
                    </div>
                    <div className="modal-left-flex">
                      <h5 className="modal-titles">{t("availableBalance")}</h5>
                      <h4 className="modal-right-titles">
                        {availaleBalanceref.current} {stakeData.currencySymbol}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* right - Preview*/}
              <div className="col-lg-6 right-col">
                <div className="right">
                  <div className="modal-right-header modal-left-flex">
                    <h5 className="stake-flexi">{t("preview")}</h5>
                    <i
                      className="fa-regular fa-circle-xmark cross_circle"
                      onClick={handleClose}
                    ></i>
                  </div>

                  <div className="modal-right-main">
                    <div className="modal-right-main-flex">
                      {stakeData.type === "fixed" ? (
                        <>
                          {/* IMG */}
                          <div className="straight-img">
                            <img src={line} alt="line" className="line-pic" />
                          </div>
                          {/* RIGHT CONTENT */}
                          <div className="modal-flex-col">
                            <div className="modal-left-flex">
                              <h6 className="modal-titles">
                                {t("subscriptionDate")}
                              </h6>
                              <h5 className="modal-right-titles">
                                {currentDate ? currentDate : "--.--"}
                              </h5>
                            </div>
                            <div className="modal-left-flex">
                              {" "}
                              <h6 className="modal-titles">
                                {t("accuralDate")}
                              </h6>
                              <h5 className="modal-right-titles">
                                {accuralDate ? accuralDate : "--.--"}
                              </h5>
                            </div>
                            <div className="modal-left-flex">
                              {" "}
                              <h6 className="modal-titles">
                                {this("profitDistributionDate")}
                              </h6>
                              <h5 className="modal-right-titles">
                                {endDate ? endDate : "--.--"}
                              </h5>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="modal-flex-col">
                          <div className="modal-left-flex">
                            <h6 className="modal-titles">
                              {t("subscriptionDate")}
                            </h6>
                            <h5 className="modal-right-titles">
                              {currentDate ? currentDate : "--.--"}
                            </h5>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="modal-left-flex pad--border">
                      {" "}
                      <h6 className="modal-titles">{t("stakeAmount")}</h6>
                      <h5 className="modal-right-titles">
                        {stakeValue} {stakeData.currencySymbol}
                      </h5>
                    </div>
                    <div className="modal-estimated">
                      <h6 className="modal-left-title">
                        {t("estimatedReturns")}
                      </h6>
                      <div className="modal-left-flex">
                        <h5 className="modal-titles">
                          {stakeData.currencySymbol} {t("earnings")}
                        </h5>
                        {stakeData.type === "fixed" ? (
                          <h4 className="modal-titles-green">
                            {userTotlaInterest
                              ? userTotlaInterest.toFixed(6)
                              : "00.00"}
                          </h4>
                        ) : (
                          <h4 className="modal-titles-green">
                            {TotalFlexible ? TotalFlexible.toFixed(6) : "00.00"}
                          </h4>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-right-foot">
                  {buttonLoader == true ? (
                    <button className="modal-right-btn">
                      {t("loading")} ...
                    </button>
                  ) : buttonStatus == true ? (
                    <button className="modal-right-btn" onClick={stake}>
                      {t("stake")}
                    </button>
                  ) : (
                    <button className="modal-right-btn-disabled" disabled>
                      {t("stake")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default StakeOptTable;
