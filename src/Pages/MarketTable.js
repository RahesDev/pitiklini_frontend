import React from "react";
import { historyList, marketTable } from "../utils/mockData";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const MarketTable = () => {
   const { t } = useTranslation();
  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head">
            <th>{t('pair')}</th>
            <th className="opt-nowrap txt-center pad-left-23">{t('price')}</th>
            <th className="opt-nowrap txt-center pad-left-23">
              {t('fiatprice')}(usd)
            </th>
            <th className="opt-nowrap txt-center pad-left-23">{t('24HVolume')}</th>
            <th className="opt-btn-flex table-action ">{t('24HChange')}</th>
          </tr>
        </thead>

        <tbody>
          {marketTable.map((options) => {
            return (
              <tr key={options.id}>
                <td className="table-flex">
                  <img src={require(`../assets/${options.optImg}`)} alt="" />
                  <h4 className="opt-name font_14 left-5">{options.optName}</h4>
                  <h3 className="opt-sub font_14">{options.optSub}</h3>
                </td>

                <td className="opt-percent font_14 table_center_text pad-left-23">
                  {options.fiatAccount}
                </td>
                <td className="opt-term font_14 table_center_text pad-left-23">
                  {options.cryptoAccount}{" "}
                </td>
                <td className="opt-term font_14 table_center_text pad-left-23">
                  {options.total}
                </td>
                <td className="opt-btn-flex table-action pad-left-23 text-green">
                  {options.action}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="paginate font-satoshi">
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

export default MarketTable;
