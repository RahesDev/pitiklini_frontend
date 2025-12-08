import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Side_bar from "./Side_bar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Dropdown } from "semantic-ui-react";
import "react-phone-input-2/lib/style.css";
import { Bars } from "react-loader-spinner";
import Switch from "react-switch";
import { t } from "i18next";

const Security = () => {
  useEffect(() => {
    getProfile();
    getAntistatus();
    getVipAmounts();
    getvipuser();
    // FindData();
    // fetchTfaData();
  }, []);

  const [profileData, setprofileData] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [antiStatus, setAntiStatus] = useState("");
  const navigate = useNavigate();
  const [tfaDetails, setTfaDetails] = useState("");
  const [changeCode, setchangeCode] = useState(false);
  const [checked, setChecked] = useState(false);
  const [currencyAmount, setCurrencyAmount, currencyAmountref] = useState("");
  const [vipData, setVipData] = useState({ USDT: 0, PTK: 0 });
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [dataExist, setdataExist, dataExistref] = useState(false);

  const vipcurrencies = [
    { key: "USDT", value: "USDT", text: "USDT" },
    { key: "PTK", value: "PTK", text: "PTK" },
  ];

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setprofileData(resp.Message);
        setTfaDetails(resp.Message.tfastatus);
        setAntiStatus(resp.Message.AntiphisingStatus);
        sessionStorage.setItem("tfa_status", resp.data.tfastatus);
        // localStorage.setItem("tfa_status", resp.data.tfastatus);
      }
    } catch (error) {}
  };

  const getAntistatus = async () => {
    try {
      var data = {
        apiUrl: apiService.anti_status_check,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        console.log(resp, "---resp---");
        setChecked(resp.PhishinStatus == "true" ? true : false);
      }
    } catch (error) {}
  };

  const getVipAmounts = async () => {
    try {
      const data = { apiUrl: apiService.getVipDatas };
      setSiteLoader(true);
      const resp = await getMethod(data);
setSiteLoader(false);
      if (resp.status) {
        setVipData(resp.vipDatas);
      }
    } catch (err) {}
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
            console.log(resp, "---resp---");
             setdataExist(resp.PhishinStatus === "true");
          }
        } catch (error) {}
  }

  const handleCurrencySelect = (e, data) => {
    setSelectedCurrency(data.value);

    if (data.value === "USDT") {
      setCurrencyAmount(vipData.USDT);
    } else if (data.value === "PTK") {
      setCurrencyAmount(vipData.PTK);
    }
  };

  const enableVip = async () => {
  if (!selectedCurrency) {
    return toast.error("Please select a currency");
  }

  const body = {
    currency: selectedCurrency,
    amount: currencyAmount,
  };

  try {
    const resp = await postMethod({
      apiUrl: apiService.enableVipUser,
      payload: body,
    });

    if (resp.status) {
      toast.success("VIP Badge Activated!");
      getvipuser();
    } else {
      toast.error(resp.message);
    }
  } catch (err) {}
};

  const handleChange = async (nextChecked) => {
    setChecked(nextChecked);
    var data = {
      apiUrl: apiService.anti_status_change,
      payload: checked,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      // console.log(resp,"---resp---");
      showsuccessToast(resp.Message);
      getProfile();
    }
  };

  // const FindData = async () => {
  //   var data = {
  //     apiUrl: apiService.findDetails,
  //   };
  //   setSiteLoader(true);

  //   var responce = await postMethod(data);
  //   setSiteLoader(false);

  //   if (responce.data != null) {
  //     if (responce.data.APcode != "") {
  //       var str = responce.data.APcode;
  //       setAPcodes(str);
  //       setchangeCode(true);
  //     } else {
  //       setchangeCode(false);
  //     }
  //   } else {
  //     setchangeCode(false);
  //   }
  //   // console.log(changeCode,"changecokowendoiwn");
  // };

  // const fetchTfaData = async () => {
  //   try {
  //     var data = {
  //       apiUrl: apiService.getTfaDetials,
  //     };
  //     setSiteLoader(true);
  //     var resp = await getMethod(data);
  //     setSiteLoader(false);
  //     let tfastatus = localStorage.getItem("tfa_status");
  //     setTfaDetails(tfastatus);
  //     console.log(tfastatus,"tfastatus=-=-=-=-");
  //   } catch (error) {}
  // };

  const obfuscateEmail = (email) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    const firstFive = localPart.slice(0, 5);
    return `${firstFive}***@${domainPart}`;
  };

  const obfuscateMobileNumber = (mobileNumber) => {
    if (!mobileNumber) return "";
    const firstFive = mobileNumber.slice(0, 5);
    const lastOne = mobileNumber.slice(-1);
    return `${firstFive}****${lastOne}`;
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
              <div className="col-lg-2 col-md-0 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 col-md-12 padin_lefrig_dash">
                <div className="dashboard_content border_none">
                  <div className="security_content">
                    <h3>{t("security")}</h3>
                  </div>
                  <div className="security_settings">
                    <div>
                      {t("yourSecuritySettingIs")}{" "}
                      {profileData.tfastatus == 0 &&
                      // profileData.AntiphisingStatus == 0 &&
                      profileData.AntiphisingEnabledStatus == 0 ? (
                        <span className="low-clr">{t("low")}</span>
                      ) : profileData.tfastatus == 0 ||
                        // profileData.AntiphisingStatus == 0 ||
                        profileData.AntiphisingEnabledStatus == 0 ? (
                        <span className="mid-clr">{t("medium")}</span>
                      ) : (
                        <span className="high-clr">{t("high")}</span>
                      )}
                    </div>
                    <div className="low_line">
                      {profileData.tfastatus == 0 &&
                      // profileData.AntiphisingStatus == 0 &&
                      profileData.AntiphisingEnabledStatus == 0 ? (
                        <>
                          <p className="verify_fail mb-1">
                            <i class="ri-shield-keyhole-line"></i> {t("low")}
                          </p>
                          <img
                            src={require("../assets/low_line.png")}
                            className="secu_img"
                            alt="Low security"
                          />
                        </>
                      ) : profileData.tfastatus == 0 ||
                        // profileData.AntiphisingStatus == 0 ||
                        profileData.AntiphisingEnabledStatus == 0 ? (
                        <>
                          <p className="verify_medium mb-1">
                            <i class="ri-shield-keyhole-line"></i> {t("medium")}
                          </p>
                          <img
                            src={require("../assets/mid_line.png")}
                            className="secu_img"
                            alt="Medium security"
                          />
                        </>
                      ) : (
                        <>
                          <p className="verify_success mb-1">
                            <i class="ri-shield-keyhole-line"></i> {t("high")}
                          </p>
                          <img
                            src={require("../assets/high_line.png")}
                            className="secu_img"
                            alt="High security"
                          />
                        </>
                      )}
                      {/* <p>
                      {" "}
                      <i class="ri-shield-keyhole-line"></i> Low
                    </p>
                    <img src={require("../assets/low_line.png")} /> */}
                    </div>
                  </div>
                  {profileData.vipBadge && profileData.vipBadge === true && (
                    <>
                      <div className="two_fa_heading">{t("vip")}</div>
                      <div className="security_email_content">
                        <div className="security_email_item">
                          <div className="">
                            <h3>
                              {t("vipbadgehead")}
                              {""}
                              {dataExistref.current ? (
                                ""
                              ) : (
                                <>
                                  {" "}
                                  {selectedCurrency ? (
                                    <>
                                      [ {currencyAmountref.current}{" "}
                                      {selectedCurrency} / Month ]
                                    </>
                                  ) : (
                                    ""
                                  )}{" "}
                                </>
                              )}
                            </h3>
                            {/* <p>{t("itIsUsedForLoginWithdrawals")}</p> */}
                            {dataExistref.current ? (
                              ""
                            ) : (
                              <div className="form_div">
                                <div className="sides">
                                  <div className="w-100 rights">
                                    <Dropdown
                                      placeholder={t("selectacoin")}
                                      fluid
                                      className="dep-drops"
                                      selection
                                      options={vipcurrencies}
                                      onChange={handleCurrencySelect}
                                      isSearchable={true}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="email_id_text">
                          <div className="enable_btn">
                            {dataExistref.current ? (
                              <button>{t("enabled")}</button>
                            ) : (
                              <button onClick={enableVip}>{t("enable")}</button>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="two_fa_heading">
                    {t("twoFactorAuthentication")}
                  </div>
                  <div className="security_email_content">
                    <div className="security_email_item">
                      <img src={require("../assets/icons/email_icon.webp")} />

                      <div className="">
                        <h3>{t("emailVerification")}</h3>
                        <p>{t("itIsUsedForLoginWithdrawals")}</p>
                      </div>
                    </div>
                    <div className="email_id_text">
                      <i class="ri-checkbox-circle-fill"></i>{" "}
                      <span> {obfuscateEmail(profileData.email)}</span>
                    </div>
                  </div>
                  {/* <div className="security_email_content">
                  <div className="security_email_item">
                    <img src={require("../assets/phone_icon.png")} />

                    <div className="">
                      <h3>Phone No Verification</h3>
                      <p>
                        To safeguard your transactions and account, use your
                        phone number.
                      </p>
                    </div>
                  </div>
                  <div className="email_id_text">
                    {" "}
                    {profileData.mobileNumber == "" ? (
                     <span>Not Verified</span>
                    ) : (<>
                      <i class="ri-checkbox-circle-fill"></i>
                      <span>{obfuscateMobileNumber(profileData.mobileNumber)}</span>
                      </>
                    )}
                   
                  </div>
                </div> */}
                  <div className="security_email_content">
                    <div className="security_email_item">
                      <img src={require("../assets/icons/2fa.webp")} />

                      <div className="">
                        <h3>2FA</h3>
                        <p>{t("use2faToProtectYourAccount")}</p>
                      </div>
                    </div>
                    <div className="secneww_diiv">
                      {tfaDetails == 0 ? (
                        <div className="disabled_text ">
                          <p>
                            <span className="text-lightGrey nowra_txt">
                              {" "}
                              <i class="ri-close-circle-fill"></i>{" "}
                              {t("disabled")}{" "}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p>
                            <span className="text-lightGrey nowra_txt">
                              {" "}
                              <i
                                class="ri-checkbox-circle-fill"
                                style={{ color: "#22b477" }}
                              ></i>{" "}
                              {t("enabled")}{" "}
                            </span>
                          </p>
                        </div>
                      )}
                      {tfaDetails == 0 ? (
                        <div className="enable_btn">
                          <Link to="/enabletfa">
                            <button>{t("enable")}</button>
                          </Link>
                        </div>
                      ) : (
                        <div className="disable_btn">
                          <Link to="/enabletfa">
                            <button>{t("disable")}</button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="two_fa_heading">{t("advancedSecurity")}</div>
                  <div className="security_email_content">
                    <div className="security_email_item">
                      <img
                        src={require("../assets/icons/anti_phishing_icon.webp")}
                      />

                      <div className="">
                        <div className="d-flex gap-3 align-items-center">
                          <h3>{t("antiPhisingCode")}</h3>
                          <div className="mb-2">
                            {antiStatus == 1 && (
                              <Switch
                                checked={checked}
                                onChange={handleChange}
                                onColor="#ffc630" // Color inside the switch when on
                                offColor="#fa5d72" // Color inside the switch when off
                                handleDiameter={14} // Diameter of the switch handle (button)
                                height={19} // Height of the switch
                                width={33} // Width of the switch
                                uncheckedIcon={false} // No icon when off
                                checkedIcon={false} // No icon when on
                                handleStyle={{
                                  boxShadow: "none", // This removes the glow or shadow around the handle
                                  backgroundColor: "white", // Ensure the handle is white
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <p>{t("displayedInEmailsFromPitikliniToSafeguard")}</p>
                      </div>
                    </div>
                    <div className="secneww_diiv">
                      {antiStatus == 0 || checked == false ? (
                        <div className="">
                          <p>
                            {" "}
                            <span className="text-lightGrey nowra_txt">
                              <i class="ri-close-circle-fill"></i>{" "}
                              {t("disabled")}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p>
                            {" "}
                            <span className="text-lightGrey nowra_txt">
                              {" "}
                              <i
                                class="ri-checkbox-circle-fill"
                                style={{ color: "#22b477" }}
                              ></i>{" "}
                              {t("enabled")}
                            </span>
                          </p>
                        </div>
                      )}
                      {antiStatus == 0 ? (
                        <div className="enable_btn">
                          <Link to="/anti-phishing">
                            <button>{t("enable")}</button>
                          </Link>
                        </div>
                      ) : (
                        // <div className="disable_btn">
                        <div className="enable_btn">
                          <Link to="/anti-phishing">
                            <button>{t("change")}</button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="two_fa_heading">
                    {t("passwordManagement")}
                  </div>
                  <div className="security_email_content">
                    <div className="security_email_item">
                      <img
                        src={require("../assets/icons/login_password_icon.webp")}
                      />

                      <div>
                        <h3>{t("loginPassword")}</h3>
                        <p>{t("loginPasswordIsUsedToLogin")}</p>
                      </div>
                    </div>

                    <div className="enable_btn">
                      <Link to="/security_change">
                        {" "}
                        <button>{t("change")}</button>
                      </Link>
                    </div>
                  </div>

                  {/* <div className="two_fa_heading">Account Management</div>
                <div className="security_email_content">
                  <div className="security_email_item">
                    <img src={require("../assets/delete_icon.png")} />

                    <div className="">
                      <h3>Delete Account</h3>
                      <p>
                        Note: All the related data will be deleted and cannot be
                        recovered after the deletion.
                      </p>
                    </div>
                  </div>

                  <div className="delete_button">
                    <button>Delete</button>
                  </div>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Security;
