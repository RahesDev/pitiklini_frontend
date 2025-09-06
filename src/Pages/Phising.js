import React from "react";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const Phising = () => {
    const { t } = useTranslation();
  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div>
        <div className="Verification">
          <div className="container">
            <div>
              <h6>
                {" "}
                <i className="fa-solid fa-arrow-left-long mr-3"></i> {t('security')}
              </h6>
              <div className="row justify-content-center cards">
                <div className="col-lg-4">
                  <span className="heading">{t('createAntiPhasingCode')}</span>
                  <div className="input-groups icons">
                    <h6 className="input-label">{t('antiPhisingCode')}</h6>
                    <input
                      className="input-field"
                      placeholder="Input 4-8 Numbers or letters "
                    />
                    <span className="textgreen eyeicons"> 56 s </span>
                  </div>
                  <div className="input-groups icons">
                    <h6 className="input-label">{t('emailVerificationcode')}</h6>
                    <input
                      className="input-field"
                      placeholder="Enter the code"
                    />
                    <span className="textgreen eyeicons"> {t('send')} </span>
                  </div>

                  <div className="Submit my-4">
                    <button>{t('confirm')}</button>
                  </div>

                  <div className="foot">
                    <p>
                      {t('Didnt_code')} <a>{t('resend')}</a>
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
};

export default Phising;
