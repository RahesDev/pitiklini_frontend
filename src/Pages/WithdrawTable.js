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
import { useTranslation } from "react-i18next";

const WithdrawTable = () => {
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [withdrawcurrentpage, setwithdrawcurrentpage] = useState(1);
  const [withdrawtotalpage, setwithdrawTotalpages] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getwithdrawHistory(1);
  }, [0]);

  const getwithdrawHistory = async (page) => {
    var data = {
      apiUrl: apiService.withdraw_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    setSiteLoader(true);
    var withdraw_history_list = await postMethod(data);
    setSiteLoader(false);
    if (withdraw_history_list) {
      console.log(
        withdraw_history_list,
        "--- withdraw_history_list--",
        withdraw_history_list.result,
        withdraw_history_list.pages
      );
      setwithdrawHistory(withdraw_history_list.result);
      setwithdrawTotalpages(withdraw_history_list.pages);
    }
  };

  const withdrawrecordpage = 5;
  const withdrawpagerange = 5;

  const handlepagewithdraw = (event, page) => {
    getwithdrawHistory(page);
    setwithdrawcurrentpage(page);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied");
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
                      <div className="Buycrypto_title">{t('history')}</div>
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
                        <Link
                          to="/withdrawHistory"
                          className="history-links active"
                        >
                          {t("withdraw")}
                        </Link>
                        <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t("internal_transfer")}
                        </Link>
                        <Link to="/swapHistory" className="history-links">
                        {t('convert')}

                        </Link>
                        {/* <Link to="/stakingHistory" className="history-links">
                          Staking
                        </Link> */}
                        <Link to="/orderHistory" className="history-links">
                        {t('openOrder')}

                        </Link>
                        <Link
                          to="/cancelorderHistory"
                          className="history-links"
                        >
                                                    {t('closeOrder')}

                        </Link>
                        <Link to="/tradeHistory" className="history-links">
                        {t('trade')}

                        </Link>
                         <Link to="/notificationHistory" className="history-links">
                            {t('notification')}
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
                              <th>{t('transactionId')}</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('amount')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('currency')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('date')}
                              </th>
                              <th className="opt-btn-flex table-action text-center">
                                {t('status')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {withdrawHistory.length > 0 ? (
                              withdrawHistory.map((data, i) => {
                                return (
                                  <tr>
                                    <td className="opt-term font_14 pad-left-23 nowra_txt">
                                      {data.txn_id != undefined
                                        ? data.txn_id.slice(0, 10)
                                        : "-"}
                                      <i
                                        class="fa fa-clone"
                                        aria-hidden="true"
                                        onClick={() => copy(data.txn_id)}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "4px",
                                        }}
                                      ></i>
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {data.amount == undefined
                                        ? 0
                                        : data.amount.toFixed(4)}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {data.currency}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {Moment(data.created_at).format("lll")}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-center nowra_txt">
                                      {data.txn_id != "--------" ? (
                                        <span className="text-green">
                                          {t('completed')}
                                        </span>
                                      ) : (
                                        <span className="text-yellow">
                                          {t('pending')}
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={5} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                      />
                                    </div>
                                    <div className="no_records_text">
                                      {t('noRecordsFound')}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {withdrawHistory && withdrawHistory.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(withdrawtotalpage)}
                                page={withdrawcurrentpage}
                                onChange={handlepagewithdraw}
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

export default WithdrawTable;
