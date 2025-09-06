import React from "react";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const Anti = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>
      <main className="anti_phishing_main">
        <div>
          <div className="Verification ">
            <div className="container">
              <div>
                <h6>
                  {" "}
                  <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('quickBuy')}
                </h6>
                <div className="row justify-content-center cards">
                  <div className="col-lg-4">
                    <span class="heading">{t('Fillthedetails')}</span>

                    <div className="input-groups icons mt-4">
                      <h6 className="input-label">{t('CardNumber')}</h6>
                      <input
                        className="input-field"
                        placeholder="Enter the card number"
                      />
                    </div>
                    <div className="input-groups icons">
                      <h6 className="input-label">{t('CardName')}</h6>
                      <input
                        className="input-field"
                        placeholder="Enter the card name"
                      />
                    </div>

                    <div className="row">
                      <div className="input-groups col-lg-6 icons">
                        <h6 className="input-label">{t('ExpiryDate')}</h6>
                        <input
                          className="input-field"
                          placeholder="07-07-2024"
                        />
                      </div>
                      <div className="input-groups col-lg-6 icons">
                        <h6 className="input-label">{t('cvv')}</h6>
                        <input
                          className="input-field"
                          placeholder="Enter the CVV Number"
                        />
                      </div>
                    </div>

                    <div className="Submit my-4">
                      <button>{t('confirm')}</button>
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

export default Anti;
