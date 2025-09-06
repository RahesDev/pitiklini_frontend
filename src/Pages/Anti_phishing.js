import React, { useEffect } from "react";
import Header from "./Header";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const Anti = () => {
  const { t } = useTranslation();
  const [siteLoader, setSiteLoader] = useState(false);
  const navigate = useNavigate();
  const [counter, setCounter] = useState(0);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  useEffect(() => {
    FindData();
  }, [0]);

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0 && isEmailSubmitted) {
      setIsResendVisible(true);
    }
    return () => clearTimeout(timer);
  }, [counter, isEmailSubmitted]);

  const data = {
    APcode: "",
    changeAPcode: "",
    Status: "",
  };

  const [formData, setformData] = useState(data);
  const [otpPage, setotpPage] = useState(true);
  const [codePage, setcodePage] = useState(true);
  const [changeCode, setchangeCode] = useState(false);
  const [Anticode, setAnticode] = useState("");
  const [checked, setChecked] = useState(false);
  const [AntiPcode, setAntiPcode] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [changeAnticode, setchangeAnticode] = useState(false);
  const [APcodevalied, setAPcodevalied] = useState("");
  const [APcodes, setAPcodes] = useState("");
  const [OTP, setOTP] = useState("");
  const [resendClick, setResendClick] = useState(false);

  const getValue = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let values = { ...formData, ...{ [name]: sanitizedValue } };
    setformData(values);
    condition(values);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      // Block the spacebar key
      e.preventDefault();
    }
  };

  const fetchOTP = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (value.length <= 4) {
      setOTP(value);
    }
    // setOTP(value);
  };

  const condition = (formData) => {
    const Err = {};
    if (formData.APcode == "") {
      setAntiPcode(true);
      Err.APcode = t("antiPhisingCodeIsReq");
    } else if (formData.APcode.length < 4) {
      Err.APcode = t("min4charallow");
      setAntiPcode(true);
    } else if (formData.APcode.length > 20) {
      Err.APcode = t("max20charallow");
      setAntiPcode(true);
    } else if (!formData.APcode.match(/[!@#$%^&*(),.?":{}|<>]/g)) {
      setAntiPcode(true);
      Err.APcode = t("pleaseEnteroneSpecialChar");
    } else {
      setAntiPcode(false);
    }

    if (formData.changeAPcode == "") {
      Err.changeAPcode = t("antiPhisingCodeReq");
      setchangeAnticode(true);
    } else if (formData.changeAPcode.length < 4) {
      Err.changeAPcode = t("min4charallow");
      setchangeAnticode(true);
    } else if (formData.changeAPcode.length > 20) {
      Err.changeAPcode = t("max20charallow");
      setchangeAnticode(true);
    } else if (!formData.changeAPcode.match(/[!@#$%^&*(),.?":{}|<>]/g)) {
      setchangeAnticode(true);
      Err.changeAPcode = t("pleaseEnteroneSpecialChar");
    } else {
      setchangeAnticode(false);
    }
    setAPcodevalied(Err);
    return Err;
  };

  const createCode = async () => {
    if (APcodes == "") {
      condition(formData);
      if (
        formData.APcode != "" &&
        formData.APcode.length > 4 &&
        formData.APcode.length < 21 &&
        AntiPcode == false
      ) {
        formData["Status"] = checked;
        var data = {
          apiUrl: apiService.antiphishingcode,
          payload: formData,
        };
        setButtonLoader(true);
        var responce = await postMethod(data);
        setButtonLoader(false);
        if (responce.Status == true) {
          showsuccessToast(responce.Message);
          setotpPage(false);
          setIsEmailSubmitted(true);
          setCounter(120);
          setIsResendVisible(false);
        }
      }
    } else {
      showerrorToast("Already code created");
    }
  };

  const verifyOTP = async () => {
    console.log(formData.APcode, "formData.APcode");
    console.log(formData.changeAPcode, "formData.changeAPcode");
    if (OTP != "") {
      var obj = {
        OTP: OTP,
        changeAPcode: formData.changeAPcode,
        APcode: formData.APcode,
      };
      var data = {
        apiUrl: apiService.verificationOtp,
        payload: obj,
      };
      setButtonLoader(true);
      var responce = await postMethod(data);
      setButtonLoader(false);
      if (responce.Status == true) {
        showsuccessToast(responce.Message);
        navigate("/security");
        setchangeCode(true);
        FindData();
      } else {
        showerrorToast(responce.Message);
      }
    } else {
      showerrorToast("Enter OTP");
    }
  };

  const changeAntiCode = async () => {
    condition(formData);
    console.log(formData.changeAPcode, "ihihihiuhuhuhhiuu", changeAnticode);
    if (
      formData.changeAPcode != "" &&
      formData.changeAPcode.length > 4 &&
      formData.changeAPcode.length < 21 &&
      changeAnticode == false
    ) {
      console.log("Inside");
      var data = {
        apiUrl: apiService.changeAntiPhising,
        payload: formData,
      };
      setButtonLoader(true);
      var responce = await postMethod(data);
      setButtonLoader(false);
      if (responce.Status == true) {
        showsuccessToast(responce.Message);
        setcodePage(false);
        setIsEmailSubmitted(true);
        setCounter(120);
        setIsResendVisible(false);
        console.log(formData.changeAPcode, "formData.changeAPcode");
      } else {
        showerrorToast(responce.Message);
        setcodePage(true);
      }
    }
  };

  const FindData = async () => {
    var data = {
      apiUrl: apiService.findDetails,
      payload: formData,
    };
    setSiteLoader(true);
    var responce = await postMethod(data);
    setSiteLoader(false);
    if (responce.data != null) {
      if (responce.data.APcode != "") {
        var str = responce.data.APcode;
        setAPcodes(str);
        var replaced = str.replace(/.(?=.{4,}$)/g, "*");
        setAnticode(replaced);
        setchangeCode(true);
      } else {
        setchangeCode(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      // console.log("----resend comes-----");
      var data = {
        apiUrl: apiService.antiResendotp,
        payload: formData,
      };
      setOTP("");
      setResendClick(true);
      var resp = await postMethod(data);
      setResendClick(false);
      if (resp.Status == true) {
        setIsEmailSubmitted(true);
        setCounter(120);
        setIsResendVisible(false);
        showsuccessToast(resp.Message);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      setButtonLoader(false);
    }
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Old antiphising code copied");
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
    <>
      <section className="Non_fixed_nav">
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
        <main className="anti_phishing_main">
          <div className="reg_new_backcol">
            <div className="Verification ">
              <div className="container">
                <div>
                  <Link to="/security">
                    <h6 className="padfor_new_top">
                      {" "}
                      <i class="fa-solid fa-arrow-left-long mr-3"></i>{" "}
                      {t("security")}
                    </h6>
                  </Link>
                  <div className="row justify-content-center cards">
                    {changeCode == false ? (
                      <div className="col-lg-4">
                        <span class="heading">
                          {t("create_AntiPhishing_Code")}
                        </span>

                        {otpPage == true ? (
                          <div className="input-groups icons mt-4">
                            <h6 className="input-label">
                              {t("antiPhishingCode")}
                            </h6>
                            <input
                              type="text"
                              name="APcode"
                              maxLength={20}
                              onChange={getValue}
                              onKeyDown={handleKeyDown}
                              className="input-field"
                              placeholder={t("enterAntiPhisingCode")}
                            />
                            {AntiPcode == true ? (
                              <p className="errorcss">
                                {" "}
                                {APcodevalied.APcode}{" "}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                        ) : (
                          <div className="input-groups icons">
                            <h6 className="input-label">
                              {t("emailVerificationcode")}
                            </h6>
                            <input
                              type="Number"
                              value={OTP}
                              onKeyDown={(evt) =>
                                ["e", "E", "+", "-"].includes(evt.key) &&
                                evt.preventDefault()
                              }
                              onChange={fetchOTP}
                              min={1000}
                              max={9999}
                              className="input-field"
                              placeholder={t("enterTheCode")}
                            />
                          </div>
                        )}

                        <div className="Submit my-4">
                          {otpPage == true ? (
                            buttonLoader == false ? (
                              <button onClick={createCode}>
                                {t("confirm")}
                              </button>
                            ) : (
                              <button>{t("loading")} ...</button>
                            )
                          ) : buttonLoader == false ? (
                            <button onClick={verifyOTP}>
                              {t("verify_OTP")}
                            </button>
                          ) : (
                            <button>{t("loading")} ...</button>
                          )}
                        </div>

                        {isEmailSubmitted && (
                          <div className="foot">
                            <p>
                              {t("Didnt_code")}{" "}
                              {resendClick == false ? (
                                <>
                                  {isResendVisible ? (
                                    <span
                                      onClick={handleResend}
                                      className="cursor-pointer"
                                    >
                                      <a> {t("resend")}</a>{" "}
                                    </span>
                                  ) : (
                                    <span className="text-yellow">
                                      {" "}
                                      {counter}s
                                    </span>
                                  )}
                                </>
                              ) : (
                                <i class="fa-solid fa-circle-notch fa-spin text-yellow px-2"></i>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="col-lg-4">
                          <div className="input-groups icons mt-4">
                            <h6 className="input-label">
                              {t("oldAntiPhishingCode")}
                            </h6>
                            <div className="flex_input_posion">
                              <input
                                type="text"
                                value={Anticode}
                                readOnly
                                className="input-field"
                              />
                              <i
                                class="ri-file-copy-line reg_eye_anti cursor-pointer mx-2"
                                onClick={() => copy(APcodes)}
                              ></i>
                            </div>
                          </div>
                          {codePage == true ? (
                            <div className="input-groups icons mt-4">
                              <h6 className="input-label">
                                {t("changeAntiPhishingCode")}
                              </h6>
                              <input
                                type="text"
                                name="changeAPcode"
                                maxLength={20}
                                onChange={getValue}
                                onKeyDown={handleKeyDown}
                                className="input-field"
                                placeholder={t("enterAntiPhisingCode")}
                              />
                              {changeAnticode == true ? (
                                <p className="errorcss">
                                  {" "}
                                  {APcodevalied.changeAPcode}{" "}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          ) : (
                            <div className="input-groups icons">
                              <h6 className="input-label">
                                {t("emailVerificationcode")}
                              </h6>
                              <input
                                type="Number"
                                value={OTP}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-"].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                onChange={fetchOTP}
                                min={1000}
                                max={9999}
                                className="input-field"
                                placeholder={t("enterTheCode")}
                              />
                            </div>
                          )}

                          <div className="Submit my-4">
                            {codePage == true ? (
                              buttonLoader == false ? (
                                <button onClick={changeAntiCode}>
                                  {t("change")}
                                </button>
                              ) : (
                                <button>{t("loading")} ...</button>
                              )
                            ) : buttonLoader == false ? (
                              <button onClick={verifyOTP}>
                                {t("verify_OTP")}
                              </button>
                            ) : (
                              <button>{t("loading")} ...</button>
                            )}
                          </div>
                          {isEmailSubmitted && (
                            <div className="foot">
                              <p>
                                {t("Didnt_code")}{" "}
                                {resendClick == false ? (
                                  <>
                                    {isResendVisible ? (
                                      <span
                                        onClick={handleResend}
                                        className="cursor-pointer"
                                      >
                                        <a> {t("resend")}</a>{" "}
                                      </span>
                                    ) : (
                                      <span className="text-yellow">
                                        {" "}
                                        {counter}s
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <i class="fa-solid fa-circle-notch fa-spin text-yellow px-2"></i>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
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

export default Anti;
