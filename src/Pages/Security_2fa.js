import React from "react";
import Header from "./Header";
import { t } from "i18next";

const Changepassword = () => {
  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <main className="anti_phishing_main">
        <div>
          <div className="Verification ">
            <div className="container">
              <div>
                <h6>
                  {" "}
                  <i className="fa-solid fa-arrow-left-long mr-3"></i>
                  {t("security")}
                </h6>
                <div className="row justify-content-center cards">
                  <div className="col-lg-4">
                    <span className="heading">{t("enable_2FA")}</span>

                    <div className="notify"> {t("2fa-notify-content")}</div>
                    <div className="two_fa_qr">
                      <img
                        src={require("../assets/2fa_qr.png")}
                        className="two-qr"
                        alt=""
                      />
                      <p>{t("Scan the QR code")}</p>
                    </div>
                    <div className="input-groups icons">
                      <h6 className="input-label">{t("2FA_Code.")}</h6>
                      <input
                        className="input-field"
                        placeholder="Enter the code"
                      />
                      <span className="textgreen icons-num"> 56 s </span>
                    </div>

                    <div className="Submit my-4">
                      <button>{t("enable")}</button>
                    </div>

                    <div className="foot">
                      <p>
                        {t("Didnt_code")} <a>{t("resend")}</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Changepassword;
