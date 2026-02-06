import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Side_bar from "./Side_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import Moment from "moment";
import { getAuthToken } from "../core/lib/localStorage";
import { setAuthorization } from "../core/service/axios";
const Dashboard = () => {
  useEffect(() => {
    let token_socket = sessionStorage.getItem("user_token");
    setAuthorization(token_socket);
    if (!token_socket) {
      navigate("/login");
    }
    setSiteLoader(true);
    getProfile();
    getvipuser();
    Kycdata();
    getPortfolio();
    getUserbalance(currentPage);
    getUserTotalbalance(currentPage);
    generateWallet();
    console.log(profileData, "-=profileData=-");
  }, [0]);

  const [perpage, setperpage] = useState(5);
  const { t } = useTranslation();
  const [search, setsearch, searchref] = useState("");
  const [balanceDetails, setbalanceDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(0);
  const [totalINRPrice, setToatalINRPrice] = useState(0);
  const [totalAllbalance, setTotalAllbalance] = useState(0);
  const [AvailablePrice, setAvailablePrice] = useState(0);
  const [inorderPrice, setinorderPrice] = useState(0);
  const [profileData, setprofileData, profileDataref] = useState("");
  const [profileDataLevel, setprofileDataLevel, profileDataLevelref] =
    useState("");
  const [getKYCData, setgetKYCData] = useState(0);
  const [lastLogin, setLastLogin] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [siteLoader, setSiteLoader, siteLoaderref] = useState(true);
  const [balanceDatas, setbalanceDatas] = useState([]);
  const recordPerPage = 5;
  const navigate = useNavigate();

  const [dataExist, setdataExist, dataExistref] = useState(false);

  const depositNav = () => {
    navigate("/deposit");
  };
  const withdrawNav = () => {
    navigate("/Withdraw");
  };

  const handleChange = (e) => {
    try {
      const sanitizedValue = e.target.value.replace(/\s/g, "");
      console.log(sanitizedValue, "-=-sanitizedValue=-=");
      setsearch(sanitizedValue);
      // setsearch(e.target.value);
      searchWalletList();
    } catch (error) {}
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      // Block the spacebar key
      e.preventDefault();
    }
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

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      if (resp.status == true) {
        setprofileData(resp.Message);
        const lvelDidct =
          resp.Message.tfastatus == 0 &&
          resp.Message.AntiphisingEnabledStatus == 0
            ? "Low"
            : resp.Message.tfastatus == 0 ||
              resp.Message.AntiphisingEnabledStatus == 0
            ? "Medium"
            : "High";
        setprofileDataLevel(lvelDidct);
        sessionStorage.setItem("tfa_status", resp.Message.tfastatus);
        setSiteLoader(false);
        //profileData.AntiphisingStatus == 0 ?
      } else {
        setSiteLoader(false);
      }
    } catch (error) {
      setSiteLoader(false);
    }
  };

    const getvipuser = async () => {
          try {
            var data = {
              apiUrl: apiService.getVipUserDetail,
            };
            setSiteLoader(true);
            var resp = await getMethod(data);
            setSiteLoader(false);
            if (resp.status) {
              // console.log(resp, "---resp---");
               setdataExist(resp.PhishinStatus === "true");
            }
          } catch (error) {}
    }

  const Kycdata = async () => {
    setSiteLoader(true);
    var data = {
      apiUrl: apiService.getKYC,
    };
    var resp = await getMethod(data);
    if (resp.status && resp.status != "") {
      setSiteLoader(true);
      var kycData = resp.datas.userDetails;
      setgetKYCData(kycData);
      console.log(resp.datas.userDetails.kycstatus, "kycData");
      setSiteLoader(false);
      if (resp.datas.userDetails.kycstatus == 1) {
        var data = {
          apiUrl: apiService.UserwalletBalance,
        };
        var resp = await getMethod(data);
      }
    } else {
      setSiteLoader(false);
    }
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

    if (resp.status == true) {
      var balanceData = resp.balance;
      setTotalAllbalance(balanceData.total_balance_new);
      setAvailablePrice(balanceData.available_balance);
      setinorderPrice(balanceData.inorder_balance);
      setSiteLoader(false);
    } else {
      setSiteLoader(false);
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
      // console.log(resp.Message, "=-=-=-resp.Message=-=-=-");
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

  const searchWalletList = async () => {
    // console.log(searchref.current,"-=-=searchref.current=--");
    if (
      searchref.current !== "" &&
      searchref.current !== undefined &&
      searchref.current !== null
    ) {
      const regexPattern = new RegExp(searchref.current, "i");
      const searchWallet = balanceDatas.filter((data) =>
        regexPattern.test(data.currencysymbol)
      );
      // const searchWallet = balanceDatas.filter(data => data.currencysymbol.toLowerCase() === searchref.current.toLowerCase());
      if (searchWallet.length > 0) {
        setbalanceDetails(searchWallet);
        // setDataHide(false);
        settotal(1);
      } else {
        getUserbalance(1);
      }
    } else {
      getUserbalance(1);
    }
  };

  const getPortfolio = async () => {
    var data = {
      apiUrl: apiService.portfolioBalance,
    };
    setSiteLoader(true);
    var resp = await getMethod(data);

    if (resp.status == true) {
      // console.log(resp, "=-=-=-resp.Message=-=-=-");
      var balanceData = resp.balance;
      setToatalINRPrice(balanceData.total_balance);
      setAvailablePrice(balanceData.available_balance);
      setinorderPrice(balanceData.inorder_balance);
      setSiteLoader(false);
    } else {
      setSiteLoader(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const [changeCode, setchangeCode] = useState(false);

  // const FindData = async () => {
  //   var data = {
  //     apiUrl: apiService.findDetails,
  //   };
  //   setSiteLoader(true);
  //   var responce = await postMethod(data);
  //   setSiteLoader(false);

  //   if (responce.data != null) {
  //     if (responce.data.APcode != "") {
  //       setchangeCode(true);
  //     } else {
  //       setchangeCode(false);
  //     }
  //   } else {
  //     setchangeCode(false);
  //   }
  // };

  const generateWallet = async () => {
    try {
      var data = {
        apiUrl: apiService.walletAddUpdate,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      // setSiteLoader(false);
      if (resp.status) {
        setSiteLoader(false);
        // console.log(resp, "=-=-=-=-resp=-=-=-");
      } else {
        setSiteLoader(false);
      }
    } catch (error) {
      setSiteLoader(false);
      // console.log(error,"wallet add error");
    }
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Code copied");
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  return (
    <>
      <section>
        <Header />
      </section>

      {siteLoaderref.current == true ? (
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
              <div className="col-lg-2 col-md-0 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 col-md-12 padin_lefrig_dash">
                <div className="dashboard_content">
                  <div className="dash_user_name">
                    <h3>
                      {t("hello")} {profileData.displayname}{" "}
                      {profileData.vipBadge &&
                        profileData.vipBadge === true &&
                        dataExistref.current && (
                          <span className="vipbge_dhbrd"> [ ⭐VIP ]</span>
                        )}
                    </h3>
                  </div>

                  <div className="verified_low_btn">
                    {getKYCData.kycstatus == 1 ? (
                      <>
                        <p className="dash-verified mt-1">
                          <img
                            src={require("../assets/icons/verified.webp")}
                            alt="verify"
                            x
                          />{" "}
                          {t("verifiedProfile")}
                        </p>
                      </>
                    ) : getKYCData.kycstatus == 2 ? (
                      <>
                        <p className="verify_medium mt-1">
                          <i class="ri-error-warning-fill"></i> {t("pending")}
                        </p>
                      </>
                    ) : getKYCData.kycstatus == 3 ? (
                      <>
                        <p className="dash-notVerified mt-1">
                          <img
                            src={require("../assets/icons/notverify.webp")}
                            alt="rejected"
                          />{" "}
                          {t("rejected")}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="dash-notVerified mt-1">
                          <img
                            src={require("../assets/icons/notverify.webp")}
                            alt="not-verify"
                          />{" "}
                          {t("notverified")}
                        </p>
                      </>
                    )}

                    {/* <div className="secuirty_box_title mt-0">
                      {profileDataref.current.tfastatus == 0 &&
                        profileDataref.current.AntiphisingEnabledStatus == 0 ? (
                        <>
                          <p className="verify_fail">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">Low</span>
                          </p>
                        </>
                      ) : profileDataref.current.tfastatus == 0 ||
                          profileDataref.current.AntiphisingEnabledStatus == 0 ? (
                        <>
                          <p className="verify_medium">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">Medium</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="verify_success">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">High</span>
                          </p>
                        </>
                      )}
                    </div> */}
                    <div className="secuirty_box_title mt-0">
                      {profileDataLevelref.current == "Low" ? (
                        <>
                          <p className="verify_fail">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">{t("low")}</span>
                          </p>
                        </>
                      ) : profileDataLevelref.current == "Medium" ? (
                        <>
                          <p className="verify_medium">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">{t("medium")}</span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="verify_success">
                            <i class="ri-shield-keyhole-line"></i>
                            <span className="mx-2">{t("high")}</span>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="user_id_card">
                    <div className="uid_content">
                      <h4>{t("Name")}</h4>
                      <p>{profileData.displayname}</p>
                    </div>
                    <div className="uid_content">
                      <h4>{t("email_label")}</h4>
                      <p>{profileData.email}</p>
                    </div>
                    <div className="uid_content">
                      <Link to="/security">
                        <h4 className="mb-3">
                          {t("securityLevel")}{" "}
                          <i class="ri-arrow-right-s-line"></i>
                        </h4>
                      </Link>
                      {profileDataLevelref.current == "Low" ? (
                        <>
                          <p className="verify_fail">{t("low")}</p>
                        </>
                      ) : profileDataLevelref.current == "Medium" ? (
                        <>
                          <p className="verify_medium">{t("medium")}</p>
                        </>
                      ) : (
                        <>
                          <p className="verify_success">{t("high")}</p>
                        </>
                      )}
                    </div>
                    <div className="uid_content">
                      <h4>{t("SignUpTime")}</h4>
                      <p>{Moment(profileData.createdDate).format("lll")}</p>
                    </div>
                    <div className="uid_content">
                      <Link to="/loginHistory">
                        <h4 className="mb-3">
                          {t("lastSignIn")}{" "}
                          <i class="ri-arrow-right-s-line"></i>
                        </h4>
                      </Link>
                      <p>{Moment(profileData.lastLogintime).format("lll")}</p>
                    </div>
                  </div>

                  <div className="row pad-y-40">
                    <div className="col-lg-12">
                      <div className="secuirty_box p-0">
                        <div className="secuirty_box_title">
                          <h3>{t("balance")}</h3>
                          <Link to="/assets">
                            <p className="bln_view">
                              {t("view")} <i class="ri-arrow-right-s-line"></i>
                            </p>
                          </Link>
                        </div>
                        <div className="secuirty_box_content deposit_blc_content ">
                          <div className="login_verify_content">
                            <h4>{t("totalbalance")}</h4>
                            <p className="total_balance_amt">
                              {totalAllbalance == "" ||
                              totalAllbalance == null ||
                              totalAllbalance == undefined
                                ? 0.0
                                : totalAllbalance.toFixed(2)}
                              <span className="usd_text"> USD</span>
                            </p>
                          </div>
                          <div className="dash-bal-btns-wrapper ">
                            <button
                              className="dash-bal-btn"
                              onClick={depositNav}
                            >
                              {t("deposit")}
                            </button>
                            <button
                              className="dash-bal-btn"
                              onClick={withdrawNav}
                            >
                              {t("withdrawal")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-lg-6">
                      <div className="secuirty_box border_none">
                        <div className="secuirty_box_title">
                          <h3>Identification</h3>
                          {getKYCData.kycstatus == 1 ? (
                            <>
                              <p className="identity-verify-succes">
                                <i class="ri-error-warning-fill"></i> Verified
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="verify_fail">
                                <i class="ri-error-warning-fill"></i> Not
                                verified
                              </p>
                            </>
                          )}
                        </div>
                        <Link to="/kyc">
                          <div className="secuirty_box_content security-flex security-height">
                            <div className="img-verify-box">
                              <div className="login_asset">
                                <img
                                  src={require("../assets/dash_id_icon.png")}
                                />
                              </div>
                              <div className="login_verify_content">
                                <h4>Deposit / Withdrawal / Trade Authority</h4>
                                <p>Complete the KYC</p>
                              </div>
                            </div>
                            <div>
                              <img
                                src={require("../assets/yellow-arrow.png")}
                                className="yellow-arrow-img"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div> */}
                  </div>

                  <div className="row pad-y-40">
                    <div className="col-lg-6">
                      <div className="secuirty_box p-0 border_none">
                        <div className="secuirty_box_title">
                          <h3>{t("identification")}</h3>
                          {getKYCData.kycstatus == 1 ? (
                            <>
                              <p className="identity-verify-succes">
                                <i className="fa-solid fa-circle-check"></i>{" "}
                                <span className="mx-2">{t("verified")}</span>
                              </p>
                            </>
                          ) : getKYCData.kycstatus == 2 ? (
                            <>
                              <p className="verify_medium">
                                <i className="ri-error-warning-fill"></i>
                                <span className="mx-2">{t("pending")}</span>
                              </p>
                            </>
                          ) : getKYCData.kycstatus == 3 ? (
                            <>
                              <p className="verify_fail">
                                <i className="fa-solid fa-circle-xmark"></i>{" "}
                                <span className="mx-2">{t("rejected")}</span>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="verify_fail">
                                <i className="fa-solid fa-circle-xmark"></i>
                                <span className="mx-2">{t("notverified")}</span>
                              </p>
                            </>
                          )}
                        </div>
                        <Link to="/kyc">
                          <div className="secuirty_box_content security-flex security-height">
                            <div className="img-verify-box">
                              <div className="login_asset">
                                <img
                                  src={require("../assets/icons/dash_id_icon.webp")}
                                  alt=""
                                />
                              </div>
                              <div className="login_verify_content">
                                <h4>{t("alldewitrade")}</h4>
                                <p>{t("completetheKYC")}</p>
                              </div>
                            </div>
                            <div>
                              <img
                                src={require("../assets/icons/yellow-arrow.webp")}
                                className="yellow-arrow-img"
                                alt=""
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="secuirty_box p-0">
                        <div className="secuirty_box_title">
                          <h3>{t("security")}</h3>
                          {profileDataLevelref.current == "Low" ? (
                            <>
                              <p className="verify_fail">
                                <i class="ri-shield-keyhole-line"></i>
                                <span className="mx-2">{t("low")}</span>
                              </p>
                            </>
                          ) : profileDataLevelref.current == "Medium" ? (
                            <>
                              <p className="verify_medium">
                                <i class="ri-shield-keyhole-line"></i>
                                <span className="mx-2">{t("medium")}</span>
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="verify_success">
                                <i class="ri-shield-keyhole-line"></i>
                                <span className="mx-2">{t("high")}</span>
                              </p>
                            </>
                          )}
                        </div>
                        <Link to="/security">
                          <div className="secuirty_box_content security-flex security-login-h">
                            <div className="img-verify-box">
                              <div className="login_asset">
                                <img
                                  src={require("../assets/icons/login_icon.webp")}
                                  alt=""
                                />
                              </div>
                              <div className="login_verify_content">
                                <h4>{t("verification")}</h4>
                                <p>{t("loginwithpassword")}</p>
                              </div>
                            </div>
                            <div>
                              <img
                                src={require("../assets/icons/yellow-arrow.webp")}
                                className="yellow-arrow-img"
                                alt=""
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    {/* <div className="col-lg-6">
                      <div className="secuirty_box border_none">
                        <div className="secuirty_box_title">
                          <h3>Referral </h3>
                          <Link to="/refferal">
                            <p className="bln_view">
                              Invite Now <i class="ri-arrow-right-s-line"></i>
                            </p>
                          </Link>
                        </div>
                        <div className="secuirty_box_content refer_content">
                          <div className="login_verify_content">
                            <h4>Referral Code</h4>
                            <p>
                              {profileData.referralCode}{" "}
                              <i
                                class="ri-file-copy-line cursor-pointer mx-2"
                                onClick={() => copy(profileData.referralCode)}
                              ></i>
                            </p>
                          </div>
                          <div className="referral_asset">
                            <img
                              src={require("../assets/referral_asset.webp")}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-lg-6">
                      <div className="secuirty_box border_none">
                        <div className="secuirty_box_title">
                          <h3>Identification</h3>
                          {getKYCData.kycstatus == 1 ? (
                            <>
                              <p className="verify_success">
                                <i class="ri-error-warning-fill"></i> verified
                              </p>
                            </>
                          ) : getKYCData.kycstatus == 2 ? (
                            <>
                              <p className="verify_medium">
                                <i class="ri-error-warning-fill"></i> Pending
                              </p>
                            </>
                          ) : getKYCData.kycstatus == 3 ? (
                            <>
                              <p className="verify_fail">
                                <i class="ri-error-warning-fill"></i> Rejected
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="verify_fail">
                                <i class="ri-error-warning-fill"></i> Not
                                verified
                              </p>
                            </>
                          )}
                        </div>
                        <Link to="/kyc">
                          <div className="secuirty_box_content security-flex">
                            <div className="img-verify-box">
                              <div className="login_asset">
                                <img
                                  src={require("../assets/dash_id_icon.png")}
                                />
                              </div>
                              <div className="login_verify_content">
                                <h4>Deposit / Withdrawal / Trade Authority</h4>
                                <p>Complete the KYC</p>
                              </div>
                            </div>
                            <div>
                              <img
                                src={require("../assets/yellow-arrow.png")}
                                className="yellow-arrow-img"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="row pad-y-40">
                    <div className="col-lg-6">
                      <div className="secuirty_box">
                        <div className="secuirty_box_title">
                          <h3>Balance</h3>
                          <Link to="/assets">
                            <p className="bln_view">
                              View <i class="ri-arrow-right-s-line"></i>
                            </p>
                          </Link>
                        </div>
                        <div className="secuirty_box_content deposit_blc_content">
                          <div className="login_verify_content">
                            <h4>Total Balance</h4>
                            <p className="total_balance_amt">
                              {AvailablePrice == "" ||
                              AvailablePrice == null ||
                              AvailablePrice == undefined
                                ? 0.0
                                : AvailablePrice.toFixed(4)}
                              <span className="usd_text"> USD</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="secuirty_box border_none">
                        <div className="secuirty_box_title">
                          <h3>Referral </h3>
                          <Link to="/refferal">
                            <p className="bln_view">
                              Invite Now <i class="ri-arrow-right-s-line"></i>
                            </p>
                          </Link>
                        </div>
                        <div className="secuirty_box_content refer_content">
                          <div className="login_verify_content">
                            <h4>Referral Code</h4>
                            <p>
                              {profileData.referralCode}{" "}
                              <i
                                class="ri-file-copy-line cursor-pointer mx-2"
                                onClick={() => copy(profileData.referralCode)}
                              ></i>
                            </p>
                          </div>
                          <div className="referral_asset">
                            <img
                              src={require("../assets/referral_asset.webp")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div className="container dash-btn-flex">
                    <button className="deposit_btn" onClick={depositNav}>
                      Deposit
                    </button>
                    <button className="withdraw_btn" onClick={withdrawNav}>
                      Withdrawal
                    </button>
                  </div> */}

                  {/* table */}
                  <div className="dashboard_table">
                    <div className="staking-flex dash_assets mar-top-60">
                      <h5 className="opt-title">{t("assets")}</h5>
                      <div className="stake-search-container">
                        <input
                          type="text"
                          maxLength={15}
                          placeholder={t("search")}
                          className="stake-input"
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <i
                          className="fa-solid fa-magnifying-glass"
                          onClick={() => searchWalletList()}
                        ></i>
                      </div>
                    </div>
                    <div className="table-responsive table-cont dash_table_content">
                      <table className="table ">
                        <thead>
                          <tr className="stake-head">
                            <th className="p-l-15">{t("assets")}</th>
                            <th className="table_center_text opt-nowrap txt-center pad-left-23">
                              {t("onOrders")}
                            </th>
                            <th className="table_center_text opt-nowrap txt-center pad-left-23">
                              {t("availablebalance")}
                            </th>
                            <th className="table_center_text opt-nowrap txt-center pad-left-23">
                              {t("totalBalance")}
                            </th>
                            <th className="text-end p-r-25">
                              {t("actionneww")}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {balanceDetails && balanceDetails.length > 0 ? (
                            balanceDetails.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td className="table-flex">
                                    <img src={item?.currencyImage} alt="" />
                                    <div className="table-opt-name">
                                      <h4 className="opt-name font_14">
                                        {item?.currencysymbol}
                                      </h4>
                                      <h3 className="opt-sub font_14">
                                        {item?.currencyName}
                                      </h3>
                                    </div>
                                  </td>
                                  <td className="opt-term font_14 table_center_text pad-left-23">
                                    {parseFloat(
                                      item?.holdAmount +
                                        parseFloat(item?.p2phold),
                                    ).toFixed(4)}
                                    {item?.currencysymbol}
                                  </td>
                                  <td className="opt-term font_14 table_center_text pad-left-23">
                                    {parseFloat(
                                      item?.currencyBalance +
                                        parseFloat(item?.p2p),
                                    ).toFixed(4)}{" "}
                                    {item?.currencysymbol}
                                  </td>
                                  <td className="opt-term font_14 table_center_text pad-left-23">
                                    {parseFloat(
                                      item?.currencyBalance +
                                        parseFloat(item?.holdAmount) +
                                        parseFloat(item?.p2p) +
                                        parseFloat(item?.p2phold),
                                    ).toFixed(4)}{" "}
                                    {item?.currencysymbol}{" "}
                                  </td>
                                  <td className="opt-btn-flex text-end pad-left-23">
                                    <Link
                                      to="/deposit"
                                      className="deposit_top_button"
                                    >
                                      <button className="action_btn">
                                        {t("deposit")}
                                      </button>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center py-5">
                                <div className="empty_data">
                                  <div className="empty_data_img">
                                    <img
                                      src={require("../assets/No-data.webp")}
                                      width="100px"
                                      alt=""
                                    />
                                  </div>
                                  <div className="no_records_text">
                                    {t("noAssetsFound")}
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
                                  color: "#eaecef", // Default text color for pagination items
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
                                  color: "#eaecef", // Color for ellipsis
                                },
                                "& .MuiPaginationItem-icon": {
                                  color: "#eaecef", // Color for icon (if present)
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Dashboard;
