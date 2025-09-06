import React, { useEffect } from "react";
import QR from "../assets/qr.png";
import Header from "./Header";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const EnableTFA = () => {
  const { t } = useTranslation();
  const [loaderButton, setloaderButton] = useState(false);
  const [tfaDetails, setTfaDetails] = useState({});
  const [tfaCode, setTfaCode] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [addDetails, setaddDetails] = useState({});
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    console.log("-0-0--0-CALL API API API-0-0-0-0-0-0-0-0", "=-=-=-resp");
    fetchTfaData();
  }, []);

  const fetchTfaData = async () => {
    try {
      // console.log("-0-0--0-0-0-0-0-0-0-0-0-0", "=-=-=-resp");
      var data = {
        apiUrl: apiService.getTfaDetials,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      console.log(resp, "=-=-=-resp");
      if (resp.status == true) {
        setSiteLoader(false);
        setaddDetails(resp.data);
        // let tfastatus = localStorage.getItem("tfa_status");
        let tfastatus = sessionStorage.getItem("tfa_status");
        setTfaDetails(tfastatus);
      } else {
      }
    } catch (error) {}
  };

  const handleSubmit = async () => {
    setValidationErrors({});
    if (!tfaCode || tfaCode === "") {
      showerrorToast("2FA code is required");
    } else {
      let tfaStatus = tfaDetails;
      var data = {
        apiUrl: apiService.changeTfaStatus,
        payload: {
          userToken: tfaCode,
          tfaStatus: tfaStatus,
        },
      };
      setloaderButton(true);
      var resp = await postMethod(data);
      setloaderButton(false);
      if (resp.status) {
        showsuccessToast(resp.Message);
        setTfaCode("");
        fetchTfaData();
        // localStorage.setItem("tfa_status", resp.result.tfastatus);
        sessionStorage.setItem("tfa_status", resp.result.tfastatus);
        if (typeof resp?.errors !== "undefined") {
          const isErrorEmpty = Object.keys(resp?.errors).length === 0;
          if (!isErrorEmpty) {
            setValidationErrors(resp?.errors);
          }
        } else {
        }
      } else {
        showerrorToast(resp.Message);
      }
    }
  };
  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Secret Key Copied");
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
        <div className="reg_new_backcol">
          <div className="Verification">
            <div className="container">
              <div>
                <Link to="/security">
                  <h6 className="padfor_new_top">
                    {" "}
                    <i className="fa-solid fa-arrow-left-long mr-3"></i>{" "}
                    {t("security")}
                  </h6>
                </Link>
                <div className="row justify-content-center cards">
                  <div className="col-lg-4">
                    {tfaDetails == 0 ? (
                      <span className="heading">{t("enable_2FA")}</span>
                    ) : (
                      <span className="heading">{t("disable2FA")}</span>
                    )}

                    <div className="notify notify_flex">
                      {" "}
                      <div className="bulb">
                        <i className="ri-lightbulb-line"></i>
                      </div>
                      {tfaDetails == 0 ? (
                        <div className="notify-asset">
                          {t("enableTwoFactor")}
                        </div>
                      ) : (
                        <div className="notify-asset">
                          {t("disabletwofactorauthentication")}
                        </div>
                      )}
                    </div>
                    <div className="add-key">
                      <h2>{t("addkeyinGoogleAuthenticatorandbackup")}</h2>
                      <p>{t("openGoogleAuthenticator")}</p>
                    </div>

                    {tfaDetails == 0 ? (
                      <div className="input-groups scan-qr">
                        <img src={addDetails.tfa_url} alt="QR" />
                        <div className="scan-qr-cont">
                          <h5>***************</h5>
                          <h4
                            className="copy-key"
                            onClick={() => copy(addDetails.tfaenablekey)}
                          >
                            <span>
                              <i className="ri-file-copy-line"></i>
                            </span>
                            <span className="copy-content">{t("copyKey")}</span>
                          </h4>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div className="input-groups ">
                      <h6 className="input-label">{t("2FA_Code")}</h6>
                      <input
                        type="number"
                        min="0"
                        max="999999"
                        name="tfaCode"
                        value={tfaCode}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 6) {
                            setTfaCode(value);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "e" ||
                            e.key === "E" ||
                            e.key === "+" ||
                            e.key === "-"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        className="input-field"
                        placeholder={t("pleaseEnterYourCode")}
                      />
                    </div>

                    {/* <div className="input-groups icons">
                    <h6 className="input-label">2FA Code</h6>
                    <input
                      className="input-field"
                      placeholder="Enter the code"
                    />
                    <span className="textgreen icons-num"> 56 s </span>
                  </div> */}

                    <div className="Submit mar-top-bot">
                      {tfaDetails == 0 ? (
                        loaderButton == false ? (
                          <button onClick={handleSubmit}>{t("enable")}</button>
                        ) : (
                          <button>{t("loading")} ...</button>
                        )
                      ) : loaderButton == false ? (
                        <button onClick={handleSubmit}>{t("disable")}</button>
                      ) : (
                        <button>{t("loading")} ...</button>
                      )}
                    </div>

                    {/* <div className="foot">
                    <p>
                      Didn't receive a code ? <a>Resend</a>
                    </p>
                  </div> */}
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

export default EnableTFA;
