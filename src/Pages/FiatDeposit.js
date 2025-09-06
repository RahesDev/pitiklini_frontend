import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function FiatDeposit() {
    const { t } = useTranslation();
  const [OTP, setOTP] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [counter, setCounter] = useState(60);
  const [isResendVisible, setIsResendVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendVisible(true);
    }
  }, [counter]);

  const submit = async () => {
    try {
      if (OTP !== "") {
        console.log(OTP, "otp-=-=-");
        var obj = {
          emailOtp: OTP,
          // email: localStorage.getItem("useremail"),
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
          toast.success(resp.Message);
          navigate("/login");
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Enter OTP");
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const handleResend = async () => {
    setCounter(60);
    setIsResendVisible(false);
    // Add logic to resend the OTP
    console.log("OTP resent");
    try {
      var obj = {
        email: sessionStorage.getItem("useremail"),
      };

      var data = {
        apiUrl: apiService.resendCode,
        payload: obj,
      };
      setbuttonLoader(true);

      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status) {
        toast.success(resp.Message);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div>
        <div className="Verification assets_main">
          <div className="container">
            <div className="table_padding_bottom">
              <Link to="/buycrypto">
                <h6>
                  {" "}
                  <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('fiat_deposit')}
                </h6>
              </Link>
              <div className="row justify-content-center">
                <div className="col-lg-6 post-ad-card">
                  <span class="post-ad-title">{t('depositInstructions')}</span>

                  <div className="fiat-notify">
                    {" "}
                    {t('confirmname')}
                  </div>
                  <div className="name_of_fidex">
                    <p>{t('nameonyourPitikliniCryptaccount')}</p>
                    <h4>{t('xyzmhsa611')}</h4>

                    <h3>
                      {t('copythefollowingtransferform')}{" "}
                    </h3>
                  </div>

                  <div className="input-groups">
                    <h6 className="input-label ref-label-title">{t('reference')}</h6>
                    <div className="ref_input">
                      <input
                        type="disable"
                        name="OTP"
                        className="fiat-inputs"
                        placeholder="EAA12 XYZ XYZ XYZO"
                      />
                      <i class="ri-file-copy-line text-yellow"></i>
                    </div>
                  </div>
                  <div className="input-groups fiat_deposit_name_details">
                    <div className="fiat_deposit_detail">
                      <h6 className="input-label ref-label-title">{t('name')}</h6>
                      <div className="ref_input">
                        <input
                          type="disable"
                          name="OTP"
                          className="fiat-inputs"
                          placeholder="EAA12 XYZ  LTD"
                        />
                        <i class="ri-file-copy-line text-yellow"></i>
                      </div>
                    </div>
                    <div className="fiat_deposit_detail">
                      <h6 className="input-label ref-label-title">{t('address')}</h6>
                      <div className="ref_input">
                        <input
                          type="disable"
                          name="OTP"
                          className="fiat-inputs"
                          placeholder="EAA12 XYZ XYZ XYZO"
                        />
                        <i class="ri-file-copy-line text-yellow"></i>
                      </div>
                    </div>
                  </div>
                  <div className="input-groups fiat_deposit_name_details">
                    <div className="fiat_deposit_detail">
                      <h6 className="input-label ref-label-title">{t('bankname')}</h6>
                      <div className="ref_input">
                        <input
                          type="disable"
                          name="OTP"
                          className="fiat-inputs"
                          placeholder="EAA12 XYZ  LTD"
                        />
                        <i class="ri-file-copy-line text-yellow"></i>
                      </div>
                    </div>
                    <div className="fiat_deposit_detail">
                      <h6 className="input-label ref-label-title">
                        {t('bankAddress')}
                      </h6>
                      <div className="ref_input">
                        <input
                          type="disable"
                          name="OTP"
                          className="fiat-inputs"
                          placeholder="EAA12 XYZ XYZ XYZO"
                        />
                        <i class="ri-file-copy-line text-yellow"></i>
                      </div>
                    </div>
                  </div>
                  <div className="input-groups icons">
                    <h6 className="input-label ref-label-title">
                      {t('accountnumber')}
                    </h6>
                    <div className="ref_input">
                      <input
                        type="number"
                        name="OTP"
                        className="fiat-inputs"
                        placeholder="0012003560039956"
                      />
                    </div>
                  </div>
                  <div className="input-groups icons ifsc_code_content">
                    <h6 className="input-label ref-label-title">{t('ifscCode')}</h6>
                    <div className="ref_input">
                      <input
                        type="number"
                        name="OTP"
                        className="fiat-inputs"
                        placeholder="0012003560039956"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="fill_text">{t('fillthedetails')}</h3>
                  </div>
                  <div className="input-groups icons">
                    <h6 className="input-label ref-label-title">
                      {t('transactionId')}
                    </h6>
                    <div className="ref_input">
                      <input
                        type="text"
                        name="OTP"
                        className="fiat-inputs"
                        placeholder="Enter the transaction ID"
                      />
                    </div>
                  </div>
                  <div className="input-groups icons">
                    <h6 className="input-label ref-label-title">
                      {t('transactionProof')}
                    </h6>
                    <div className="ref_input upload_icon">
                      <input
                        type="text"
                        name="OTP"
                        className="fiat-inputs"
                        placeholder="Upload the proof"
                      />
                      <i class="ri-upload-2-line"></i>
                    </div>
                  </div>
                  <div className="Submit my-4" onClick={submit}>
                    {buttonLoader == false ? (
                      <button>{t('submit')}</button>
                    ) : (
                      <button>{t('loading')} ...</button>
                    )}
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
