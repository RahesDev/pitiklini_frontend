import React, { useState } from "react";
import { advertiserDetails } from "../utils/mockData";
import { useTranslation } from "react-i18next";

const AdvertiseTab = () => {
  const { t } = useTranslation();
  const [isBuy, setIsBuy] = useState(false);
  const [isIndexVal, setIsIndexVal] = useState("");

  const handleClick = (i) => {
    setIsBuy(true);
    setIsIndexVal(i);
  };

  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head">
            <th>{t('advertiser')}</th>
            <th className="opt-nowrap txt-center pad-left-23">{t('price')}</th>
            <th className="opt-nowrap txt-center pad-left-23">
            {t('available_Limits')}
            </th>
            <th className="opt-nowrap txt-center pad-left-23">
            {t('payment_Method')}
            </th>
            <th className="opt-btn-flex table-action ">{t('trade')}</th>
          </tr>
        </thead>

        <tbody>
          {advertiserDetails.map((options, i) => {
            return (
              <>
                {i === isIndexVal ? (
                  <tr>
                    <td colSpan="5">
                      <div className="row ">
                        <div className="col-lg-7 ">
                          <div className="table-flex">
                            <img
                              src={require(`../assets/${options.optImg}`)}
                              alt=""
                            />
                            <div className="table-opt-name">
                              <h4 className="opt-nowrap opt-name font_14">
                                {options.optName}
                              </h4>
                              <h3 className="opt-nowrap opt-sub font_14">
                                {options.optSub}
                              </h3>
                            </div>
                          </div>
                          <div className="ad-buy-details">
                            <div className="opt-nowrap opt-term font_14 ">
                              {options.price} {t('INR')}
                              <div className="opt-price-span mt-2">{t('price')}</div>
                            </div>
                            <div className="opt-nowrap opt-term font_14 ">
                              <span className="opt-pay">
                                {options.paymentMethod}{" "}
                              </span>
                              <div className="opt-price-span mt-2">
                              {t('payment_Method')}
                              </div>
                            </div>
                            <div className="opt-nowrap opt-term font_14">
                              {options.limit}
                              <div className="opt-price-span mt-2"> {t('limit')}</div>
                            </div>
                            <div className="opt-nowrap opt-term font_14 ">
                              {t('15_min')}
                              <div className="opt-price-span mt-2">
                                {t('payment_Time_Limit')}
                              </div>
                            </div>
                            <div className="opt-nowrap opt-term font_14 ">
                              {t('0_025BTC')}
                              <div className="opt-price-span mt-2">
                                {t('available')}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-5 youpay">
                          <form className="youpay-form">
                            <label htmlFor="you-pay">{t('you_Pay')}</label>
                            <div className="">
                              <input
                                type="text"
                                placeholder="Enter Amount"
                                className="w-100 pay-input"
                              />
                            </div>
                            <label htmlFor="you-pay">{t('you_Receive')}</label>
                            <div className="">
                              <input
                                type="text"
                                placeholder="0.00"
                                className="w-100 receive-input"
                              />
                            </div>
                            <div className="youpay-btns">
                              <button className="youpay-cancel">{t('cancel')}</button>
                              <button className="youpay-buy">{t('buy_USDT')}</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={options.id}>
                    <td className="table-flex">
                      <img
                        src={require(`../assets/${options.optImg}`)}
                        alt=""
                      />
                      <div className="table-opt-name">
                        <h4 className="opt-nowrap opt-name font_14">
                          {options.optName}
                        </h4>
                        <h3 className="opt-nowrap opt-sub font_14">
                          {options.optSub}
                        </h3>
                      </div>
                    </td>

                    <td className="opt-nowrap opt-price font_14 table_center_text pad-left-23">
                      {options.price}{" "}
                      <span className="opt-price-span">{t('INR')} </span>
                    </td>

                    <td className="opt-nowrap opt-percent font_14 table_center_text pad-left-23">
                      <div className="table-opt-name table-flex-col">
                        <h4 className="opt-name font_14">
                          <span className="opt-sub opt-sub-amt">{t('amount')} </span>{" "}
                          <span className="opt-amount">
                            {" "}
                            {options.amountBtc}{" "}
                          </span>
                        </h4>
                        <h3 className="opt-sub font_14">
                          <span className="opt-sub opt-sub-lmt">{t('limit')} </span>{" "}
                          <span className="opt-amount"> {options.limit}</span>
                        </h3>
                      </div>
                    </td>

                    <td className="opt-nowrap opt-term font_14 table_center_text pad-left-23">
                      <span className="opt-pay">{options.paymentMethod} </span>
                    </td>

                    <td className="opt-btn-flex table-action pad-left-23">
                      <button
                        className="ad-buy-btn"
                        onClick={() => handleClick(i)}
                      >
                        {options.trade}
                      </button>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>

      {/* <div className="paginate">
        <span>
          <i class="fa-solid fa-chevron-left"></i>
        </span>
        <span className="paginate-one">1</span>
        <span>2</span>
        <span>
          <i class="fa-solid fa-chevron-right"></i>
        </span>
      </div> */}
    </div>
  );
};

export default AdvertiseTab;
