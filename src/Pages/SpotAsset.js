import React, { useEffect } from "react";
import useState from "react-usestateref";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Side_bar from "./Side_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
// import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import AssetListTable from "./AssetListTable";
import WalletViewTable from "./WalletViewTable";
import Select from "react-select";
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

const Assets = () => {
  const cryptOptions = [
    { value: "BTC", label: "BTC" },
    { value: "INR", label: "INR" },
    { value: "USDT", label: "USDT" },
    { value: "USD", label: "USD" },
  ];

  useEffect(() => {
    // getDefault("USDT");
    getUserTotalbalance(currentPage);
    getUserbalance(currentPage);
  }, [0]);

  const [overallValue, setoverallValue] = useState(0);
  const [coinviewValue, setcoinviewValue] = useState({});
  const [walletviewValue, setwalletviewValue] = useState([]);
  const [perpage, setperpage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setsearch, searchref] = useState("");
  const [totalAllbalance, setTotalAllbalance] = useState(0);
  const [totalAllbalanceINR, setTotalAllbalanceINR] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);
  const [AvailablePrice, setAvailablePrice] = useState(0);
  const [inorderPrice, setinorderPrice] = useState(0);

  const [isBalanceVisible, setIsBalanceVisible, isBalanceVisibleref] =
    useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [availableSpot, setavailableSpot] = useState(0);
  const [inorderSpot, setinorderSpot] = useState(0);
  const [totalSpot, settotalSpot] = useState(0);
  const [totalSpotINR, settotalSpotINR] = useState(0);
  const [availableFunding, setavailableFunding] = useState(0);
  const [inorderFunding, setinorderFunding] = useState(0);
  const [totalFunding, settotalFunding] = useState(0);
  const [totalFundingINR, settotalFundingINR] = useState(0);
  const [balanceDatas, setbalanceDatas] = useState([]);
  const [balanceDetails, setbalanceDetails] = useState([]);
  const [total, settotal] = useState(0);
  const recordPerPage = 5;

  const onSelect_currency = async (e, option) => {
    let selectedCurrency = e.label;
    getDefault(selectedCurrency);
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prev) => !prev);
  };

  const handlePageChange = (event, value) => {
    console.log(value, "ujbjjnjn");

    setCurrentPage(value);
    var current_page = +value * 5;
    var prev_page = +current_page - 5;
    var resp_balance = [];
    for (var i = prev_page; i < current_page; i++) {
      if (balanceDatas[i] !== undefined) {
        resp_balance.push(balanceDatas[i]);
      }
    }
    setbalanceDetails(resp_balance);
  };

  const getDefault = async (data) => {
    try {
      var obj = {
        currency: data,
      };
      console.log(obj, "obj");
      var data = {
        apiUrl: apiService.balanceOverallBalance,
        payload: obj,
      };
      const response = await postMethod(data);
      console.log(response, "=-=-=response=-=-=-response-=-=-");
      if (response.status == true) {
        console.log(response.coinView, "coinViewcoinViewcoinView");
        console.log(response.overallValue, "responseresponseresponse");
        console.log(response.walletView, "walletViewwalletViewwalletView");
        setoverallValue(response.overallValue.value.toFixed(8));
        setcoinviewValue(response.coinView);
        setwalletviewValue(response.walletView);
      } else {
      }
    } catch (error) {}
  };

  const getUserTotalbalance = async (pages) => {
    var obj = {
      perpage: perpage,
      page: pages,
      search: searchref.current,
    };
    var data = {
      apiUrl: apiService.getUserTotalbalanceAll,
      payload: obj,
    };
    setSiteLoader(true);
    var resp = await postMethod(data);
    setSiteLoader(false);
    console.log(resp, "----=--=-=-=resp-=-=-=-=");
    if (resp.status == true) {
      var balanceData = resp.balance;
      setTotalAllbalance(balanceData.total_balance_new);
      setTotalAllbalanceINR(balanceData.total_balance_inr);
      setavailableSpot(balanceData.available_balance);
      setinorderSpot(balanceData.inorder_balance);
      settotalSpot(balanceData.total_balance_spot);
      setavailableFunding(balanceData.available_balance_funding);
      setinorderFunding(balanceData.inorder_balance_funding);
      settotalFunding(balanceData.total_balance_funding);
      settotalSpotINR(balanceData.total_spot_balance_inr);
      settotalFundingINR(balanceData.total_funding_balance_inr);
    }
  };

  const getUserbalance = async (pages) => {
    // setSiteLoader(false);
    var obj = {
      perpage: perpage,
      page: pages,
      search: searchref.current,
    };

    var data = {
      apiUrl: apiService.getUserBalance,
      payload: obj,
    };
    // setSiteLoader(true);
    var resp = await postMethod(data);
    // setSiteLoader(false);

    if (resp.status == true) {
      // setSiteLoader(false);
      console.log(resp.Message, "=-=-=-resp.Message=-=-=-");
      var balanceData = resp.Message;
      setbalanceDatas(balanceData);

      var current_page = +resp.current * 5;
      var prev_page = +current_page - 5;
      var resp_balance = [];
      for (var i = prev_page; i < current_page; i++) {
        if (balanceData[i] !== undefined) {
          resp_balance.push(balanceData[i]);
        }
      }
      // resp_balance = resp_balance.filter(Boolean);
      setbalanceDetails(resp_balance);
      var totalnumber = resp.total;
      settotal(resp.total);
      // console.log(resp.total, "resp.totalresp.total");
      var balanceData = resp.balance;
    } else {
    }
  };

  const hide = async (e, ption) => {};

  const navigate = useNavigate();

  const depositNav = () => {
    navigate("/deposit");
  };

  const stakeNav = () => {
    navigate("/staking");
  };

  return (
    <>
      <section>
        <Header />
      </section>
      {siteLoader == true ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#bd7f10"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <main className="dashboard_main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 padin_lefrig_dash">
                <section className="asset_section">
                  <div className="row mt-4">
                    <div className="asset_title">{t("spotAssets")}</div>
                    <div className="col-lg-12">
                      {/* Estimated Value */}
                      <div className="esti-container">
                        <div className="esti-sub-container">
                          <div className="esti-left">
                            <span className="esti-title">
                              {t("spot-balance")}
                              <span
                                onClick={toggleBalanceVisibility}
                                className="mx-2 eye-icon"
                              >
                                {isBalanceVisible ? (
                                  <i class="fa-regular fa-eye ass_eye"></i>
                                ) : (
                                  <i class="fa-regular fa-eye-slash ass_eye"></i>
                                )}
                              </span>
                            </span>
                            <span className="esti-usdt">
                              {/* {overallValue} */}
                              {isBalanceVisible ? (
                                <>
                                  {totalSpot == "" ||
                                  totalSpot == null ||
                                  totalSpot == undefined
                                    ? 0.0
                                    : totalSpot.toFixed(4)}{" "}
                                </>
                              ) : (
                                "****"
                              )}
                              <span className="esti-span ">
                                USDT
                                {/* <Select
                                options={cryptOptions}
                                placeholder="USDT"
                                className="esti-span"
                                styles={colourStyles}
                                onChange={onSelect_currency}
                              /> */}
                              </span>{" "}
                            </span>
                            <span className="esti-num">
                              ~{" "}
                              {isBalanceVisible ? (
                                <>
                                  {totalSpotINR == "" ||
                                  totalSpotINR == null ||
                                  totalSpotINR == undefined
                                    ? 0.0
                                    : totalSpotINR.toFixed(4)}
                                </>
                              ) : (
                                "****"
                              )}{" "}
                              INR
                            </span>
                          </div>
                          <div className="dash-bal-btns-wrapper ">
                            <Link to="/deposit">
                              <button className="dash-bal-btn">
                                {t("deposit")}
                              </button>
                            </Link>
                            <Link to="/withdraw">
                              <button className="dash-bal-btn">
                                {t("withdrawal")}
                              </button>
                            </Link>
                            {/* <Link to="/internaltransfer">
                              <button className="dash-bal-btn">Transfer</button>
                            </Link> */}
                          </div>
                        </div>
                      </div>
                      {/* <div
                        class="nav nav-tabs asset-nav-tabs"
                        id="nav-tab"
                        role="tablist"
                      >
                        <button
                          class="nav-link active"
                          id="nav-home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-home"
                          type="button"
                          role="tab"
                          aria-controls="nav-home"
                          aria-selected="true"
                        >
                          Wallet View
                        </button>
                        <button
                          class="nav-link "
                          id="nav-orders-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-orders"
                          type="button"
                          role="tab"
                          aria-controls="nav-orders"
                          aria-selected="false"
                        >
                          Spot
                        </button>
                        <button
                          class="nav-link "
                          id="nav-funding-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-funding"
                          type="button"
                          role="tab"
                          aria-controls="nav-funding"
                          aria-selected="false"
                        >
                          Funding
                        </button>
                      </div> */}

                      <div className="terms justify-content-end">
                        <div class="checkbox-container">
                          <input
                            id="custom-checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="input-field regular_checkbox"
                            type="checkbox"
                          />
                          <label htmlFor="custom-checkbox"></label>
                        </div>
                        <label
                          htmlFor="custom-checkbox"
                          className="terms-check"
                        >
                          {t("hidesmallbalances")}
                        </label>
                      </div>

                      <div class="tab-content" id="nav-tabContent">
                        {/* <div
                          class="tab-pane fade mt-4"
                          id="nav-orders"
                          role="tabpanel"
                          aria-labelledby="nav-orders-tab"
                          tabindex="0"
                        > */}
                        <div className="table-responsive table-cont">
                          <table className="table">
                            <thead>
                              <tr className="stake-head-assss ">
                                <th>{t("assets")}</th>
                                <th className="opt-nowrap txt-center pad-left-23 pad-l-100">
                                  {t("onOrders")}
                                </th>
                                <th className="opt-nowrap txt-center pad-left-23  pad-l-100">
                                  {t("availablebalance")}
                                </th>
                                <th className="opt-btn-flex table-action p-r-25">
                                  {t("totalBalance")}
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {balanceDetails && balanceDetails.length > 0 ? (
                                balanceDetails
                                  .filter(
                                    (item) =>
                                      !isChecked || item.currencyBalance > 0
                                  )
                                  .map((item, i) => {
                                    return (
                                      <tr key={i}>
                                        <td className="table-flex">
                                          <img
                                            src={item?.currencyImage}
                                            alt=""
                                          />
                                          <div className="table-opt-name">
                                            <h4 className="opt-name  font_14">
                                              {item?.currencysymbol}
                                            </h4>
                                            <h3 className="opt-sub font-satoshi font_14">
                                              {item?.currencyName}
                                            </h3>
                                          </div>
                                        </td>

                                        <td className="opt-term  font_14 table_center_text pad-left-23 pad-l-100 nowra_txt">
                                          {isBalanceVisible ? (
                                            <>
                                              {parseFloat(
                                                item?.holdAmount
                                              ).toFixed(4)}
                                            </>
                                          ) : (
                                            " ****"
                                          )}{" "}
                                          {item?.currencysymbol}
                                        </td>
                                        <td className="opt-term  font_14 table_center_text pad-left-23 pad-l-100 nowra_txt">
                                          {isBalanceVisible ? (
                                            <>
                                              {parseFloat(
                                                item?.currencyBalance
                                              ).toFixed(4)}
                                            </>
                                          ) : (
                                            "****"
                                          )}{" "}
                                          {item?.currencysymbol}
                                        </td>
                                        <td className="opt-term  font_14 pad-left-23 assnewch_lasttd nowra_txt">
                                          {isBalanceVisible ? (
                                            <>
                                              {parseFloat(
                                                item?.currencyBalance +
                                                  parseFloat(item?.holdAmount)
                                              ).toFixed(4)}
                                            </>
                                          ) : (
                                            "****"
                                          )}{" "}
                                          {item?.currencysymbol}{" "}
                                        </td>
                                      </tr>
                                    );
                                  })
                              ) : (
                                <tr>
                                  <td colSpan={4} className="text-center py-5">
                                    <div className="empty_data">
                                      <div className="empty_data_img">
                                        <img
                                          src={require("../assets/No-data.webp")}
                                          width="100px"
                                        />
                                      </div>
                                      <div className="no_records_text">
                                        {t("noRecordsFound")}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {balanceDetails && balanceDetails.length > 0 ? (
                            <div className="pagination">
                              <Stack spacing={2}>
                                <Pagination
                                  count={Math.ceil(total / recordPerPage)}
                                  page={currentPage}
                                  onChange={handlePageChange}
                                  size="small"
                                  sx={{
                                    "& .MuiPaginationItem-root": {
                                      color: "#fff", // Default text color for pagination items
                                      // backgroundColor: "#2D1E23",
                                      // "&:hover": {
                                      //   backgroundColor: "#453a1f",
                                      //   color: "#ffc630",
                                      // },
                                    },
                                    "& .Mui-selected": {
                                      backgroundColor: "#bd7f10 !important", // Background color for selected item
                                      color: "#000", // Text color for selected item
                                      "&:hover": {
                                        backgroundColor: "#bd7f10",
                                        color: "#000",
                                      },
                                    },
                                    "& .MuiPaginationItem-ellipsis": {
                                      color: "#fff", // Color for ellipsis
                                    },
                                    "& .MuiPaginationItem-icon": {
                                      color: "#fff", // Color for icon (if present)
                                    },
                                  }}
                                  // renderItem={(item) => (
                                  //   <PaginationItem
                                  //     slots={{
                                  //       previous: ArrowBackIcon,
                                  //       next: ArrowForwardIcon,
                                  //     }}
                                  //     {...item}
                                  //   />
                                  // )}
                                />
                              </Stack>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Assets;
