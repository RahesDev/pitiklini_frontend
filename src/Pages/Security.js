import React, { useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
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
  };

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
    <DashboardLayout>
      {siteLoader == true ? (
        <div className="flex min-h-[calc(100vh-90px)] items-center justify-center bg-slate-950 px-4">
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
        <section className="asset_section font-ibm text-secondary text-[12px]">
          <div className="buy_head">
            <div className="w-full">
              <div className="space-y-8">
                <div className="rounded-2xl bg-[#18191D] border border-gray shadow-xl p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray mb-4">
                    <div>
                      <p className="text-[20px] font-semibold text-primary font-ibm  mb-2">
                        {t("security")}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-[16px] font-semibold text-secondary">
                          {t("yourSecuritySettingIs")}
                        </span>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ${
                            profileData.tfastatus == 0 &&
                            profileData.AntiphisingEnabledStatus == 0
                              ? "bg-rose-500/15 text-rose-400"
                              : profileData.tfastatus == 0 ||
                                  profileData.AntiphisingEnabledStatus == 0
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-emerald-500/15 text-emerald-400"
                          }`}
                        >
                          <i
                            className={`ri-${
                              profileData.tfastatus == 0 &&
                              profileData.AntiphisingEnabledStatus == 0
                                ? "shield-close-line"
                                : profileData.tfastatus == 0 ||
                                    profileData.AntiphisingEnabledStatus == 0
                                  ? "shield-half-line"
                                  : "shield-check-line"
                            } text-lg`}
                          />
                          {profileData.tfastatus == 0 &&
                          profileData.AntiphisingEnabledStatus == 0
                            ? t("low")
                            : profileData.tfastatus == 0 ||
                                profileData.AntiphisingEnabledStatus == 0
                              ? t("medium")
                              : t("high")}
                        </span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-secondary">
                      <i className="ri-shield-keyhole-line text-lg text-primary" />
                      <span>{t("securityScore")}</span>
                    </div>
                  </div>

                  {profileData.vipBadge && profileData.vipBadge === true && (
                    <div className="space-y-4 rounded-2xl bg-[#18191D] border border-gray shadow-xl p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[16px] uppercase tracking-[0.18em] text-secondary">
                            {t("vip")}
                          </p>
                          <h3 className="mt-2 text-[16px] font-semibold text-secondary">
                            {t("vipbadgehead")}
                            {dataExistref.current ? null : selectedCurrency ? (
                              <span className="ml-2 text-[12px] font-medium text-secondary">
                                [ {currencyAmountref.current} {selectedCurrency}{" "}
                                / Month ]
                              </span>
                            ) : null}
                          </h3>
                        </div>
                        <div className="flex flex-col gap-3 sm:items-end">
                          {dataExistref.current ? null : (
                            <Dropdown
                              placeholder={t("selectacoin")}
                              fluid
                              className="w-full min-w-[220px] rounded-3xl bg-slate-900 text-slate-200"
                              selection
                              options={vipcurrencies}
                              onChange={handleCurrencySelect}
                              isSearchable={true}
                            />
                          )}
                          <button
                            onClick={enableVip}
                            className={`rounded-2xl px-4 py-3 text-[12px] font-semibold transition ${dataExistref.current ? "bg-slate-800 text-slate-200" : "bg-primary text-slate-950 hover:bg-amber-300"}`}
                          >
                            {dataExistref.current ? t("enabled") : t("enable")}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-[18px] font-semibold text-primary mb-4">
                    {t("twoFactorAuthentication")}
                  </div>
                  <div className="flex flex-col gap-4 rounded-2xl mb-4 bg-[#18191D] border border-gray shadow-xl p-5 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800">
                        <img
                          src={require("../assets/icons/email_icon.webp")}
                          alt="Email"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-primary">
                          {t("emailVerification")}
                        </h3>
                        <p className="mt-1 text-[12px] text-secondary">
                          {t("itIsUsedForLoginWithdrawals")}
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-secondary">
                      <i className="ri-checkbox-circle-fill text-emerald-400" />
                      <span>{obfuscateEmail(profileData.email)}</span>
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
                  <div className="flex flex-col gap-4 rounded-2xl bg-[#18191D] mb-4 border border-gray shadow-xl p-5 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-start gap-4">
                      <img
                        src={require("../assets/icons/2fa.webp")}
                        alt="2FA"
                        className="h-10 w-10 rounded-3xl bg-slate-800 p-2"
                      />

                      <div className="text-[12px] text-secondary">
                        <h3 className="text-[16px] font-semibold text-primary">
                          2FA
                        </h3>
                        <p className="text-[12px] text-secondary">
                          {t("use2faToProtectYourAccount")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      {tfaDetails == 0 ? (
                        <div className="text-slate-200">
                          <p>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-secondary">
                              <i className="ri-close-circle-fill text-rose-400" />
                              {t("disabled")}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p>
                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-secondary">
                              <i className="ri-checkbox-circle-fill text-emerald-400" />
                              {t("enabled")}
                            </span>
                          </p>
                        </div>
                      )}
                      {tfaDetails == 0 ? (
                        <Link to="/enabletfa">
                          <button className="rounded-2xl bg-primary px-4 py-3 text-[12px] font-semibold text-slate-950 transition hover:bg-amber-300">
                            {t("enable")}
                          </button>
                        </Link>
                      ) : (
                        <Link to="/enabletfa">
                          <button className="rounded-2xl bg-primary px-4 py-3 text-[12px] font-semibold text-slate-950 transition hover:bg-amber-300">
                            {t("disable")}
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="text-[18px] font-semibold text-primary mb-4">
                    {t("advancedSecurity")}
                  </div>
                  <div className="flex flex-col gap-4 rounded-2xl mb-4 bg-[#18191D] border border-gray shadow-xl p-5 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800">
                        <img
                          src={require("../assets/icons/anti_phishing_icon.webp")}
                          alt="Anti-phishing"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-primary">
                          {t("antiPhisingCode")}
                        </h3>
                        <p className="mt-1 text-[12px] text-secondary">
                          {t("displayedInEmailsFromPitikliniToSafeguard")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 items-start sm:items-end">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[12px] text-secondary">
                        {antiStatus == 0 || checked == false ? (
                          <span className="inline-flex items-center gap-2 text-rose-400 text-[12px]">
                            <i className="ri-close-circle-fill" />
                            {t("disabled")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-emerald-400 text-[12px]">
                            <i className="ri-checkbox-circle-fill" />
                            {t("enabled")}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        {antiStatus == 1 && (
                          <Switch
                            checked={checked}
                            onChange={handleChange}
                            onColor="#ffc630"
                            offColor="#fa5d72"
                            handleDiameter={14}
                            height={19}
                            width={33}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            handleStyle={{
                              boxShadow: "none",
                              backgroundColor: "white",
                            }}
                          />
                        )}
                        <Link to="/anti-phishing">
                          <button className="rounded-2xl bg-primary px-4 py-3 text-[12px] font-semibold text-slate-950 transition hover:bg-amber-300">
                            {antiStatus == 0 ? t("enable") : t("change")}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="text-[18px] font-semibold text-primary mb-4">
                    {t("passwordManagement")}
                  </div>
                  <div className="flex flex-col gap-4 rounded-2xl mb-4 bg-[#18191D] border border-gray shadow-xl p-5 sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-800">
                        <img
                          src={require("../assets/icons/login_password_icon.webp")}
                          alt="Password"
                          className="h-6 w-6"
                        />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-primary">
                          {t("loginPassword")}
                        </h3>
                        <p className="mt-1 text-[12px] text-secondary">
                          {t("loginPasswordIsUsedToLogin")}
                        </p>
                      </div>
                    </div>
                    <Link to="/security_change">
                      <button className="rounded-2xl bg-primary px-4 py-3 text-[12px] font-semibold text-slate-950 transition hover:bg-amber-300">
                        {t("change")}
                      </button>
                    </Link>
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
        </section>
      )}
    </DashboardLayout>
  );
};

export default Security;
