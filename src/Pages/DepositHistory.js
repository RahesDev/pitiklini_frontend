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

const Dashboard = () => {
   const { t } = useTranslation();
  const [depositHistory, setdepositHistory] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [depositcurrentpage, setdepositcurrentpage] = useState(1);
  const [deposittotalpage, setdepositTotalpages] = useState(0);

  useEffect(() => {
    getdepositHistory(1);
  }, [0]);

  const getdepositHistory = async (page) => {
    var obj = {
      apiUrl: apiService.deposit_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    setSiteLoader(true);

    var deposit_history_list = await postMethod(obj);
    setSiteLoader(false);

    if (deposit_history_list) {
      setdepositHistory(deposit_history_list.result);
      setdepositTotalpages(deposit_history_list.total);
      console.log("deposit_history_list.pages===", deposittotalpage);
    }
  };

  const depositrecordpage = 5;
  const depositpagerange = 5;
  const handlepagedeposit = (event, page) => {
    getdepositHistory(page);
    setdepositcurrentpage(page);
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Address copied");
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
                          {t('login')}
                        </Link>
                        {/* <Link to="/referralHistory" className="history-links">
                          Referral
                        </Link> */}
                        <Link
                          to="/depositHistory"
                          className="history-links active"
                        >
                          {t('deposit')}
                        </Link>
                        <Link to="/withdrawHistory" className="history-links">
                          {t('withdraw')}
                        </Link>
                        <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t('internalTransfer')}
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
                              <th>{t('date')}</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('currency')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('amount')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {" "}
                                {t('transactionId')}
                              </th>
                              <th className="opt-btn-flex table-action text-center">
                                {t('status')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {depositHistory && depositHistory.length > 0 ? (
                              depositHistory.map((item, i) => {
                                return (
                                  <tr>
                                    <td className="opt-percent font_14 pad-left-23 nowra_txt">
                                      {Moment(item.date).format(
                                        "DD.MM.YYYY hh:mm a"
                                      )}
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.currencySymbol}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {parseFloat(item.amount).toFixed(8)}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.txnid != undefined
                                        ? item.txnid.substring(0, 10) + "..."
                                        : "-"}
                                      <i
                                        class="ri-file-copy-line text-yellow cursor-pointer"
                                        onClick={() => copy(item.txnid)}
                                      ></i>
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-green text-center">
                                      {t('completed')}
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
                                        alt=""
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
                        {depositHistory && depositHistory.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(
                                  deposittotalpage / depositrecordpage
                                )}
                                page={depositcurrentpage}
                                onChange={handlepagedeposit}
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

export default Dashboard;
