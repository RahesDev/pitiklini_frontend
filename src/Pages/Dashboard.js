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
import DashboardLayout from "./DashboardLayout";
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
  };

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
        regexPattern.test(data.currencysymbol),
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
      <DashboardLayout>
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
          <div className="w-full">
            <div className="dashboard_content">
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
              <div className="w-full">
                <div className="bg-black rounded-xl p-4 ">
                  <div className="flex items-center px-8 flex-wrap gap-3">
                    {/* Left: Name + VIP */}
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg text-secondary font-bold">
                        {t("hello")} {profileData.displayname}
                      </h3>

                      {profileData.vipBadge === true &&
                        dataExistref.current && (
                          <span className="text-yellow-500 text-sm font-medium">
                            ⭐ VIP
                          </span>
                        )}
                    </div>

                    {/* Right: Status + Security */}
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* KYC Status */}
                      <div className="flex items-center gap-1 text-sm">
                        {getKYCData.kycstatus == 1 ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <img
                              src={require("../assets/icons/verified.webp")}
                              className="w-4 h-4"
                              alt=""
                            />
                            {t("verifiedProfile")}
                          </span>
                        ) : getKYCData.kycstatus == 2 ? (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <i className="ri-error-warning-fill"></i>
                            {t("pending")}
                          </span>
                        ) : getKYCData.kycstatus == 3 ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <img
                              src={require("../assets/icons/notverify.webp")}
                              className="w-4 h-4"
                              alt=""
                            />
                            {t("rejected")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500">
                            <img
                              src={require("../assets/icons/notverify.webp")}
                              className="w-4 h-4"
                              alt=""
                            />
                            {t("notverified")}
                          </span>
                        )}
                      </div>

                      {/* Security Level */}
                      <div className="flex items-center gap-1 text-sm">
                        {profileDataLevelref.current === "Low" ? (
                          <span className="flex items-center gap-1 text-red-500">
                            <i className="ri-shield-keyhole-line"></i>
                            {t("low")}
                          </span>
                        ) : profileDataLevelref.current === "Medium" ? (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <i className="ri-shield-keyhole-line"></i>
                            {t("medium")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600">
                            <i className="ri-shield-keyhole-line"></i>
                            {t("high")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row pad-y-40">
                    <div className="col-lg-12">
                      <div className="user_id_card">
                        <div className="uid_content">
                          <h4 className="font-ibm">{t("UID")}</h4>
                          <p className="font-ibm">{profileData.uuid}</p>
                        </div>
                        <div className="uid_content">
                          <h4 className="font-ibm">{t("email_label")}</h4>
                          <p className="font-ibm">{profileData.email}</p>
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
                          <p>
                            {Moment(profileData.lastLogintime).format("lll")}
                          </p>
                        </div>
                      </div>
                      <div className="secuirty_box p-0">
                        <div className="secuirty_box_title">
                          <h3 className="font-ibm">{t("balance")}</h3>
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

                  {/* TOP BAR (KEEP SEARCH) */}
                  <div className="flex justify-between items-center my-6">
                    <div className="text-primary text-lg font-bold">
                      {t("assets")}
                    </div>

                    <div className="flex items-center bg-[#1C1E24] rounded-lg px-3 py-2">
                      <input
                        type="text"
                        maxLength={15}
                        placeholder={t("search")}
                        className="bg-transparent outline-none text-sm text-white placeholder:text-gray-400"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                      />
                      <i
                        className="fa-solid fa-magnifying-glass text-gray-400 ml-2 cursor-pointer"
                        onClick={() => searchWalletList()}
                      ></i>
                    </div>
                  </div>

                  {/* HEADER */}
                  <div className="flex items-center bg-[#1C1E24] rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("assets")}</div>
                    <div className="flex-1 text-center">{t("onOrders")}</div>
                    <div className="flex-1 text-center">
                      {t("availablebalance")}
                    </div>
                    <div className="flex-1 text-center">
                      {t("totalBalance")}
                    </div>
                    <div className="flex-1 text-end">{t("actionneww")}</div>
                  </div>

                  {/* BODY */}
                  <div className="mt-3 flex flex-col gap-3">
                    {balanceDetails && balanceDetails.length > 0 ? (
                      balanceDetails.map((item, i) => {
                        return (
                          <div
                            key={i}
                            className="flex items-center bg-black border border-[#2A2D35] rounded-lg px-4 py-4 hover:bg-[#1C1E24] transition"
                          >
                            {/* ASSET */}
                            <div className="flex-1 flex items-center gap-3">
                              <img
                                src={item?.currencyImage}
                                className="w-8 h-8"
                              />
                              <div>
                                <div className="text-white text-sm font-medium">
                                  {item?.currencysymbol}
                                </div>
                                <div className="text-center text-secondary text-sm font-ibm">
                                  {item?.currencyName}
                                </div>
                              </div>
                            </div>

                            {/* ON ORDERS */}
                            <div className="flex-1 text-center text-secondary text-sm font-ibm">
                              {parseFloat(
                                item?.holdAmount + parseFloat(item?.p2phold),
                              ).toFixed(4)}{" "}
                              {item?.currencysymbol}
                            </div>

                            {/* AVAILABLE */}
                            <div className="flex-1 text-center text-secondary text-sm font-ibm">
                              {parseFloat(
                                item?.currencyBalance + parseFloat(item?.p2p),
                              ).toFixed(4)}{" "}
                              {item?.currencysymbol}
                            </div>

                            {/* TOTAL */}
                            <div className="flex-1 text-center text-secondary text-sm font-ibm">
                              {parseFloat(
                                item?.currencyBalance +
                                  parseFloat(item?.holdAmount) +
                                  parseFloat(item?.p2p) +
                                  parseFloat(item?.p2phold),
                              ).toFixed(4)}{" "}
                              {item?.currencysymbol}
                            </div>

                            {/* ACTION */}
                            <div className="flex-1 flex justify-end">
                              <Link to="/deposit">
                                <button className="px-4 py-1.5 rounded-md bg-[#BD7F10] text-black text-xs font-semibold hover:opacity-90">
                                  {t("deposit")}
                                </button>
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <img
                          src={require("../assets/No-data.webp")}
                          className="w-24"
                          alt="no data"
                        />
                        <div className="text-gray-400 mt-3">
                          {t("noAssetsFound")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PAGINATION (same style as your sample) */}
                  {balanceDetails && balanceDetails.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(total / recordPerPage)}
                          page={currentPage}
                          onChange={handlePageChange}
                          size="small"
                          sx={{
                            "& .MuiPagination-ul": { gap: "6px" },
                            "& .MuiPaginationItem-root": {
                              color: "#fff",
                              borderRadius: "6px",
                              minWidth: "34px",
                              height: "34px",
                            },
                            "& .MuiPaginationItem-root:hover": {
                              backgroundColor: "#BD7F10",
                              color: "#000",
                            },
                            "& .Mui-selected": {
                              backgroundColor: "#BD7F10 !important",
                              color: "#000",
                              fontWeight: "600",
                            },
                            "& .MuiPaginationItem-icon": {
                              color: "inherit",
                            },
                          }}
                        />
                      </Stack>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
