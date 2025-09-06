import React, { useState } from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";
import { Dropdown } from "semantic-ui-react";
import useStateRef from "react-usestateref";
import { Button, Form, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { useTranslation } from "react-i18next";

const Swap = () => {
    const { t } = useTranslation();
  const currArrayCrypto = [
    {
      value: "ETH",
      key: "ETH",
      text: "ETH",
      image: {
        avatar: true,
        src: "https://res.cloudinary.com/taikonz-com/image/upload/v1664015323/fswpx9cb8ygezbx25edq.png",
      },
    },
    {
      value: "USDC",
      key: "USDC",
      text: "USDC",
      image: {
        avatar: true,
        src: "https://res.cloudinary.com/taikonz-com/image/upload/v1664014174/t4ayejcmp5be42sm1o7k.png",
      },
    },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState("ETH");
  const [allCurrency, setAllCurrency] = useState([]);
  const selectToken = (e, { value }) => {
    setSelectedCurrency(value);
  };

  return (
    <>
      <section>
        <Header />
      </section>

      <main className="dashboard_main">
        <div className="container">
          <div className="row swap_main">
            <div className="col-lg-2">
              <Side_bar />
            </div>

            <div className="col-lg-5 convert_center_box">
              <div className="convert_card-wrapper border_none">
                <div className="convert_card">
                  <div className="convert_title">
                    <h3>{t('fiat_deposit')}</h3>
                    <p className="text_yellow">
                      {t('assets')} <i class="ri-arrow-right-s-line"></i>
                    </p>
                  </div>
                  <div className="spend_content">
                    <div className="spend_text">
                      <h4 className="spend_chng ">{t('deposit')}</h4>
                      <p className="text_yellow visually-hidden">{t('max')}</p>
                    </div>
                    <div className="spend_amt">
                      <h3>0.00</h3>
                      <Dropdown
                        inline
                        placeholder="INR"
                        options={allCurrency}
                        value={selectedCurrency}
                        onChange={selectToken}
                      />
                    </div>
                  </div>
                  <div className="swap_balance mt-3">
                    {t('minimumAmount')} <span className="mx-2">00.00 BTC</span>
                  </div>
                  <div className="swap_icon mt-4">
                    <img src={require("../assets/down-fiat.png")} alt=""/>
                  </div>
                  <div className="spend_content mt-4">
                    <div className="spend_text">
                      <h4 className="spend_chng ">{t('payment_Method')}</h4>
                      <p className="text_yellow visually-hidden">{t('max')}</p>
                    </div>
                    <div className="spend_amt">
                      <h3 className="spend-manual">{t('manualdeposit')}</h3>
                      <Dropdown
                        inline
                        options={allCurrency}
                        value={selectedCurrency}
                        onChange={selectToken}
                      />
                    </div>
                  </div>
                  <div className="Convert_btn">
                    <button className="mt-5">{t('continue')}</button>
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

export default Swap;
