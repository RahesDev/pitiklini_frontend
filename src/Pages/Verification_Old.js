import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Verification() {
   const { t } = useTranslation();
  const [OTP, setOTP] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [counter, setCounter] = useState(120);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [otpError, setotpError, otpErrorref] = useState(false);
  const [resendClick, setResendClick] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendVisible(true);
    }
  }, [counter]);

  // const handleOTPsetOTP = (e) => {
  //   setOTP(e.target.value);
  //   setotpError(false);
  // };

  const submit = async () => {
    try {
      if (OTP !== "" && otpErrorref.current == false) {
        // console.log(OTP, "otp-=-=-");
        var obj = {
          emailOtp: OTP,
          email: sessionStorage.getItem("useremail"),
        };

        var data = {
          apiUrl: apiService.emailotpverify,
          payload: obj,
        };
        setbuttonLoader(true);
        var resp = await postMethod(data);
        setbuttonLoader(false);
        if (resp.status == true) {
          showsuccessToast(resp.Message);
          navigate("/login");
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        // toast.error("Enter OTP");
        setotpError(true);
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const handleResend = async () => {
    // Add logic to resend the OTP
    // console.log('OTP resent');
    try {
      var obj = {
        email: sessionStorage.getItem("useremail"),
      };

      var data = {
        apiUrl: apiService.resendCode,
        payload: obj,
      };
      setOTP("");
      setResendClick(true);
      var resp = await postMethod(data);
      setResendClick(false);
      if (resp.status) {
        setCounter(120);
        setIsResendVisible(false);
        showsuccessToast(resp.Message);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setOTP(value);
      setotpError(value.length < 4); // Set error if less than 4 digits
    }
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
      </section>{" "}
      <div className="reg_new_backcol">
        <div className="Verification">
          <div className="container">
            <div>
              <Link to="/register">
                <h6 className="padfor_new_top">
                  {" "}
                  <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('register')}
                </h6>
              </Link>

              <div className="row justify-content-center cards">
                <div className="col-lg-4">
                  <span class="heading">{t('verification')}</span>

                  <div className="notify">
                    {" "}
                    {t('wehavesent')}{" "}
                  </div>

                  <div className="input-groups icons">
                    <h6 className="input-label">{t('emailVerificationcode')}</h6>
                    <input
                      type="number"
                      name="OTP"
                      min={1000}
                      max={9999}
                      value={OTP}
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      onChange={handleChange}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   if (value.length <= 4) {
                      //     setOTP(value);
                      //     setotpError(false); // Reset error state when input is valid
                      //   }
                      // }}
                      className="input-field"
                      placeholder="Enter the Code"
                    />
                    {otpErrorref.current == true ? (
                      <p className="errorcss">{t('enteravalidOTP')}</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="Submit my-4">
                    {buttonLoader == false ? (
                      <button onClick={submit}>{t('submit')}</button>
                    ) : (
                      <button>{t('loading')} ...</button>
                    )}
                  </div>

                  <div className="foot">
                    <p>
                      {t('Didnt_code')}{" "}
                      {resendClick == false ? (
                        <>
                          {isResendVisible ? (
                            <span
                              onClick={handleResend}
                              className="cursor-pointer"
                            >
                              <a> {t('resend')}</a>
                            </span>
                          ) : (
                            <span className="text_yellow">{counter}s</span>
                          )}
                        </>
                      ) : (
                        <i class="fa-solid fa-circle-notch fa-spin text-yellow px-2"></i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
