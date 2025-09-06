import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Side_bar from "./Side_bar";
import AssetListTable from "./AssetListTable";
import HistoryListTable from "./HistoryListTable";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import { t } from "i18next";

const TradeTable = () => {
  const [perpage, setperpage] = useState(5);
  const [tradeHistoryData, settradeHistory] = useState([]);

  const [currentPageHis, setcurrentPageHis] = useState(1);
  const [totalHist, settotalHist] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  const recordPerPageHist = 5;

  useEffect(() => {
    tradeHistory(1);
  }, [0]);

  const tradeHistory = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
      };
      var data = {
        apiUrl: apiService.tradeHistory,
        payload: obj,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        settradeHistory(resp.result);
        settotalHist(resp.count);
      } else {
      }
    } catch (error) {}
  };

  const orderhistoryactive = (event, pageNumber) => {
    setcurrentPageHis(pageNumber); // call API to get data based on pageNumber
    tradeHistory(pageNumber);
  };
  return (
    <>
      <section>
        <Header />
      </section>
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
        <main className="dashboard_main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 padin_lefrig_dash">
                <section className="asset_section">
                  <div className="row">
                    <div className="buy_head">
                      <div className="Buycrypto_title">{t("history")}</div>
                      <ul className="history-lists">
                        <Link to="/loginHistory" className="history-links">
                          {t("login")}
                        </Link>
                        {/* <Link to="/referralHistory" className="history-links">
                          Referral
                        </Link> */}
                        <Link to="/depositHistory" className="history-links">
                          {t("deposit")}
                        </Link>
                        <Link to="/withdrawHistory" className="history-links">
                          {t("withdraw")}
                        </Link>
                        <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t("internal_transfer")}
                        </Link>
                        <Link to="/swapHistory" className="history-links">
                          {t("convert")}
                        </Link>
                        {/* <Link to="/stakingHistory" className="history-links">
                          Staking
                        </Link> */}
                        <Link to="/orderHistory" className="history-links">
                          {t("openOrder")}
                        </Link>
                        <Link
                          to="/cancelorderHistory"
                          className="history-links"
                        >
                          {t("closeOrder")}
                        </Link>
                        <Link
                          to="/tradeHistory"
                          className="history-links active"
                        >
                          {t("trade")}
                        </Link>
                        {/* <Link to="/rewardsHistory" className="history-links">
                          Rewards
                        </Link> */}

                        {/* <Link to="/stoporderHistory" className="history-links">
                          Stop Order
                        </Link> */}
                      </ul>
                      {/* <AssetListTable /> */}
                      {/* <HistoryListTable /> */}

                      <div className="table-responsive table-cont">
                        <table className="table">
                          <thead>
                            <tr className="stake-head">
                              <th>{t("date")}</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("pair")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("Type")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("price")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("amount")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("total")}
                              </th>
                              <th className="opt-btn-flex table-action text-center">
                                {t("status")}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {tradeHistoryData.length > 0 ? (
                              tradeHistoryData.map((item, i) => {
                                var datesHis = Moment(item.created_at).format(
                                  "DD.MM.YYYY hh:mm a"
                                );
                                return (
                                  <tr>
                                    <td className="opt-percent font_14 pad-left-23 nowra_txt">
                                      {datesHis}
                                    </td>
                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.pair}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.type}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.askPrice}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.askAmount}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.total}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-center nowra_txt">
                                      {item.type == "buy" ? (
                                        <span className="text-green">
                                          Filled
                                        </span>
                                      ) : (
                                        <span className="text-red">Filled</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={7} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                      />
                                    </div>
                                    <div className="no_records_text">
                                      No Records Found
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {tradeHistoryData && tradeHistoryData.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(totalHist / recordPerPageHist)}
                                page={currentPageHis}
                                onChange={orderhistoryactive}
                                size="small"
                                sx={{
                                  "& .MuiPaginationItem-root": {
                                    color: "#fff", // Default text color for pagination items
                                    // backgroundColor: "#2D1E23",
                                    // "&:hover": {
                                    //   backgroundColor: "#453a1f",
                                    //   color: "#ffc630",
                                    // },
                                  },
                                  "& .Mui-selected": {
                                    backgroundColor: "#bd7f10 !important", // Background color for selected item
                                    color: "#000", // Text color for selected item
                                    "&:hover": {
                                      backgroundColor: "#bd7f10",
                                      color: "#000",
                                    },
                                  },
                                  "& .MuiPaginationItem-ellipsis": {
                                    color: "#fff", // Color for ellipsis
                                  },
                                  "& .MuiPaginationItem-icon": {
                                    color: "#fff", // Color for icon (if present)
                                  },
                                }}
                                // renderItem={(item) => (
                                //   <PaginationItem
                                //     slots={{
                                //       previous: ArrowBackIcon,
                                //       next: ArrowForwardIcon,
                                //     }}
                                //     {...item}
                                //   />
                                // )}
                              />
                            </Stack>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default TradeTable;
