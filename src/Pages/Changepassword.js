import React from "react";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const Changepassword = () => {
    const { t } = useTranslation();
  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div>
        <div className="Verification ">
          <div className="container">
            <div>
              <h6>
                {" "}
                <i className="fa-solid fa-arrow-left-long mr-3"></i> {t('login')}
              </h6>
              <div className="row justify-content-center cards">
                <div className="col-lg-4">
                  <h4 className="reset-heading">{t('resetPassword')}</h4>
                  <div className="input-groups icons">
                    <div className="reset-label">{t('newPassword')}</div>
                    <input
                      className="reset-input"
                      placeholder="Enter the new password"
                    />
                    {/* <img
                      src={require("../assets/Eye.png")}
                      width="15px"
                      className="reset-eyeicon"
                    /> */}
                    <i class="fa-regular fa-eye reset-eyeicon "></i>
                  </div>
                  <div className="input-groups icons">
                    <div className="reset-label">{t('confirmPassword')}</div>
                    <input
                      className="reset-input"
                      placeholder="Re-Enter the new password"
                    />
                    
                    <i class="fa-regular fa-eye reset-eyeicon "></i>
                  </div>

                  <div>
                    <button className="reset-btn">{t('resetPassword')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Changepassword;
