import React, { useEffect } from "react";
import Header from "./Header";
import StakeOptTable from "./StakeOptTable";
import StakeHisTable from "./StakeHisTable";
import STAKEBITCOIN from "../assets/stake-bitcoin.webp";
import STAKEHERO from "../assets/stake-hero-ab.webp";
import useState from "react-usestateref";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Select from "react-select";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import { t } from "i18next";

const colourStyles = {
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isFocused ? "#222327" : "#222327",
    color: isFocused ? "#ffc630" : "#fff",
    cursor: isDisabled ? "not-allowed" : "pointer",
    borderBottom: `1px solid ${isFocused ? "#ffc630" : "#17171a"}`,
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
  }),
};

const Staking = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      get_staking_details();
      stakchoose("fixed");
      getStakingHistory(1);
      get_stake_profit();
      getUserTotalbalance();
      setLoginStatus(true);
    } else {
      get_staking_details();
      stakchoose("fixed");
      setLoginStatus(false);
    }
  }, [0]);

  const [perpage, setperpage] = useState(10);
  const [fixedStaking, setfixedStaking, fixedStakingref] = useState([]);
  const [flexibleStaking, setflexibleStaking] = useState([]);
  const [stakingdDetails, setstakingdDetails, stakingdDetailsref] = useState(
    []
  );

  const stakingOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "flexible", label: "Flexible" },
  ];

  const [plan, setplan] = useState("fixed");

  const [stakeHistory, setstakeHistory] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);
  const [historyLoader, sethistoryLoader] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(5);

  const [YesterdayProfit, setYesterdayProfit] = useState(0);
  const [todayProfit, settodayProfit] = useState(0);

  const recordPerPage = 5;
  const pageRange = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getStakingHistory(pageNumber);
  };

  // console.log(plan, "plan");

  const get_staking_details = async (pages) => {
    try {
      var stake_obj = {
        FilPerpage: perpage,
        FilPage: pages,
        search: "",
      };

      var data = {
        apiUrl: apiService.get_staking_details,
        payload: stake_obj,
      };

      var resp = await postMethod(data);
      setstakingdDetails(resp.data.result);
      stakchoose("fixed");
    } catch (err) {}
  };

  const stakchoose = (data) => {
    setplan(data);
    // console.log("]]]]]]]]]]", stakingdDetailsref.current);

    if (data === "fixed") {
      var stakedata = [];
      for (var i = 0; i < stakingdDetailsref.current.length; i++) {
        // console.log("===");

        var obj = {
          currencyName: stakingdDetailsref.current[i].currencyName,
          currencyImage: stakingdDetailsref.current[i].currencyImage,
          currencySymbol: stakingdDetailsref.current[i].currencySymbol,
          minimimumStaking: stakingdDetailsref.current[i].minimumStaking,
          maximimumStaking: stakingdDetailsref.current[i].maximumStaking,
          currencyId: stakingdDetailsref.current[i].currencyId,
          duration: [
            {
              duration: stakingdDetailsref.current[i].firstDuration,
              durationApy: stakingdDetailsref.current[i].FistDurationAPY,
            },
            {
              duration: stakingdDetailsref.current[i].secondDuration,
              durationApy: stakingdDetailsref.current[i].SecondDurationAPY,
            },
            {
              duration: stakingdDetailsref.current[i].thirdDuration,
              durationApy: stakingdDetailsref.current[i].ThirdDurationAPY,
            },
            {
              duration: stakingdDetailsref.current[i].fourthDuration,
              durationApy: stakingdDetailsref.current[i].FourthDurationAPY,
            },
          ],
          apy: stakingdDetailsref.current[i].apy,
          stakeid: stakingdDetailsref.current[i]._id,
          type: "fixed",
          // APRinterest: stakingdDetailsref.current[i].APRinterest,
          APRinterest:
            stakingdDetailsref.current[i].FistDurationAPY +
            " - " +
            stakingdDetailsref.current[i].FourthDurationAPY,
        };
        stakedata.push(obj);
      }
      // console.log(stakedata, "stakedata");
      setfixedStaking(stakedata);
    } else {
      var stakedata = [];

      for (var i = 0; i < stakingdDetailsref.current.length; i++) {
        var obj = {
          currencyname: stakingdDetailsref.current[i].currencyName,
          currencyImage: stakingdDetailsref.current[i].currencyImage,
          currencySymbol: stakingdDetailsref.current[i].currencySymbol,
          currencyId: stakingdDetailsref.current[i].currencyId,
          minimimumStaking: stakingdDetailsref.current[i].minimumStakingflex,
          maximimumStaking: stakingdDetailsref.current[i].maximumStakingflex,
          apy: stakingdDetailsref.current[i].apy,
          stakeid: stakingdDetailsref.current[i]._id,
          type: "flexible",
          APRinterest: stakingdDetailsref.current[i].APRinterest,
        };
        stakedata.push(obj);
      }
      setflexibleStaking(stakedata);
    }

    // console.log(fixedStakingref.current, "fixedStaking");
  };

  const getStakingHistory = async (page) => {
    try {
      sethistoryLoader(true);
      var data = {
        apiUrl: apiService.getAllstakingHistory,
        payload: { FilPerpage: 5, FilPage: page },
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      sethistoryLoader(false);

      if (resp.status) {
        setstakeHistory(resp.data);
        settotal(resp.total);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };
  const get_stake_profit = async () => {
    try {
      var data = {
        apiUrl: apiService.get_stake_profit,
      };
      var resp = await postMethod(data);
      // console.log(resp);
      settodayProfit(resp.todayProfit);
      setYesterdayProfit(resp.yesterdayProfit);
    } catch (err) {}
  };

  const [AvailablePrice, setAvailablePrice] = useState(0);
  const [search, setsearch, searchref] = useState("");

  const getUserTotalbalance = async (pages) => {
    var obj = {
      perpage: perpage,
      page: 1,
      search: search,
    };
    var data = {
      apiUrl: apiService.getUserTotalbalanceAll,
      payload: obj,
    };
    setSiteLoader(true);
    var resp = await postMethod(data);
    setSiteLoader(false);

    if (resp.status == true) {
      var balanceData = resp.balance;
      // console.log(balanceData);
      // console.log(balanceData.total_balance);
      // console.log(balanceData.available_balance);
      // console.log(balanceData.inorder_balance);
      setAvailablePrice(balanceData.total_balance_new);
    }
  };

  const stakeOptions = [
    { key: "fixed", text: "Fixed", value: "fixed" },
    { key: "flexible", text: "Flexible", value: "flexible" },
  ];

  return (
    <>
      <Header />
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
        <div className="">
          {/* staking-hero */}
          <div className="staking-hero">
            <div className="container">
              <div className="row stake-wrapper">
                <div className="col-lg-8">
                  <h6 className="stake-contents ">
                    Stake Your Crypto{" "}
                    <span className="crypto-span">{t("securely")} </span>{" "}
                    {t("and")} <span className="crypto-span"> {t("earn")}</span>{" "}
                    {t("interest")}
                  </h6>
                  <div className="stake-sub-para">
                    {t("maximizeYourCryptoAssets")}
                  </div>
                </div>

                <div className="col-lg-4 stake-reward-right">
                  <div className="staking-rewards ">
                    <div className="staking-flex ">
                      <h4 className="stake-asset">{t("assets")} (USDT)</h4>
                      <Link to="/rewards">
                        <h6 className="stake-sub-asset ">
                          {t("myRewards")}{" "}
                          <span className="stake-arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                          </span>{" "}
                        </h6>
                      </Link>
                    </div>
                    <h2 className="stake-price ">
                      {AvailablePrice ? AvailablePrice.toFixed(2) : 0}
                    </h2>
                    {/* <h5 className="stake-total">=$00.00</h5> */}
                    <div className="staking-flex mt-4">
                      <div>
                        <h5 className="stake-profit">
                          {t("yesterdayProfit")} (USDT)
                        </h5>
                        <h6 className="stake-profit-total ">
                          {YesterdayProfit ? YesterdayProfit.toFixed(2) : 0}
                        </h6>
                      </div>
                      <div className="">
                        <h5 className="stake-profit">
                          {t("totalProfit")} (USDT)
                        </h5>
                        <h6 className="stake-profit-total">
                          {todayProfit ? todayProfit.toFixed(2) : 0}
                        </h6>
                      </div>
                      <div className="stake-bit">
                        <img
                          src={STAKEBITCOIN}
                          alt=""
                          className="stake-bit-img"
                          style={{ width: "50px" }}
                        />
                      </div>
                      <div className="stake-hero-pic">
                        <img
                          src={STAKEHERO}
                          alt=""
                          className="stake-hero-img"
                          style={{ width: "170px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* staking options */}
          <div className="">
            <div className="container">
              <h5 className="stake-opt-title">{t("stakingOptions")}</h5>
              <div className="staking-flex mar-bot-24">
                {/* <select
                  name=""
                  id=""
                  className="opt-select"
                  onClick={(e) => stakchoose(e.target.value)}
                >
                  <option value="fixed">Fixed</option>
                  <option value="flexible">Flexible</option>
                </select> */}
                <Dropdown
                  placeholder="Choose Option"
                  fluid
                  selection
                  options={stakeOptions}
                  onChange={(e, { value }) => stakchoose(value)}
                  className="opt-select-stakeoptions"
                />
              </div>

              {/* <div className="custom-select-stake">
                <Select
                  className="esti-span"
                  styles={colourStyles}
                  options={stakingOptions}
                  onChange={stakchoose}
                  placeholder="All Items"
                />
              </div> */}

              <StakeOptTable
                data={plan === "fixed" ? fixedStaking : flexibleStaking}
              />
            </div>
          </div>

          {loginStatus == true ? (
            <>
              {/* staking history */}
              <div className="">
                <div className="container">
                  <h5 className="stake-opt-title ">{t("stakingHistory")}</h5>
                  <StakeHisTable />
                </div>
              </div>
            </>
          ) : (
            ""
          )}

          {/* FAQ */}
          <div>
            <div className="container">
              <h5 className="stake-opt-title">FAQ</h5>
              <div
                class="accordion accordion-flush stake-acc-flush"
                id="accordionFlushExample"
              >
                <div className="staking-faq">
                  <div class="accordion-item stake-acc-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                      <button
                        class="accordion-button collapsed stake-acc-btn"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                      >
                        1. {t("stakingFaqOne")}
                      </button>
                    </h2>
                    <div
                      id="flush-collapseOne"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingOne"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">{t("stakingFaqAnsOne")}</div>
                    </div>
                  </div>
                  <div class="accordion-item stake-acc-item">
                    <h2 class="accordion-header" id="flush-headingTwo">
                      <button
                        class="accordion-button collapsed stake-acc-btn"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                      >
                        2. {t("stakingFaqTwo")}
                      </button>
                    </h2>
                    <div
                      id="flush-collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingTwo"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">{t("stakingFaqAnsTwo")}</div>
                    </div>
                  </div>
                  <div class="accordion-item stake-acc-item">
                    <h2 class="accordion-header" id="flush-headingThree">
                      <button
                        class="accordion-button collapsed stake-acc-btn"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseThree"
                        aria-expanded="false"
                        aria-controls="flush-collapseThree"
                      >
                        3. {t("stakingFaqThree")}
                      </button>
                    </h2>
                    <div
                      id="flush-collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="flush-headingThree"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        {t("stakingFaqAnsThree")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staking;
