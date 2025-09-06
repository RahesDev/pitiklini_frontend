import React from "react";
import { advertiserDetails } from "../utils/mockData";
import { useTranslation } from "react-i18next";

const AdvertiserTable = () => {
  const { t } = useTranslation();
  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head">
            <th>{t("advertiser")}</th>
            <th className="opt-nowrap txt-center pad-left-23">{t("price")}</th>
            <th className="opt-nowrap txt-center pad-left-23">
              {t("available_Limits")}
            </th>
            <th className="opt-nowrap txt-center pad-left-23">
              {t("payment_Method")}
            </th>
            <th className="opt-btn-flex table-action ">{t("trade")}</th>
          </tr>
        </thead>

        <tbody>
          {advertiserDetails.map((options) => {
            return (
              <tr key={options.id}>
                <td className="table-flex">
                  <img src={require(`../assets/${options.optImg}`)} alt="" />
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
                  <span className="opt-price-span">{t("INR")} </span>
                </td>

                <td className="opt-nowrap opt-percent font_14 table_center_text pad-left-23">
                  <div className="table-opt-name table-flex-col">
                    <h4 className="opt-name font_14">
                      <span className="opt-sub opt-sub-amt">
                        {t("amount")}{" "}
                      </span>{" "}
                      <span className="opt-amount"> {options.amountBtc} </span>
                    </h4>
                    <h3 className="opt-sub font_14">
                      <span className="opt-sub opt-sub-lmt">{t("limit")} </span>{" "}
                      <span className="opt-amount"> {options.limit}</span>
                    </h3>
                  </div>
                </td>

                <td className="opt-nowrap opt-term font_14 table_center_text pad-left-23">
                  <span className="opt-pay">{options.paymentMethod} </span>
                </td>
                <td className="opt-btn-flex table-action pad-left-23">
                  <button className="ad-buy-btn">{options.trade}</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="paginate">
        <span>
          <i class="fa-solid fa-chevron-left"></i>
        </span>
        <span className="paginate-one">1</span>
        <span>2</span>
        <span>
          <i class="fa-solid fa-chevron-right"></i>
        </span>
      </div>
    </div>
  );
};

export default AdvertiserTable;
