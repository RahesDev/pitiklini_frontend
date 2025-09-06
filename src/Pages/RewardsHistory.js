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

function RewardsHistory() {
  
  const { t } = useTranslation();
  const [rewardHistory, setrewardHistory] = useState([]);
  const [rewardcurrentpage, setrewardcurrentpage] = useState(1);
  const [rewardtotalpage, setrewardTotalpages] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    getRewardHistory(1);
  }, [0]);

  const getRewardHistory = async (page) => {
    try {
      var payload = {
        perpage: rewardrecordpage,
        page: page,
      };
      var data = {
        apiUrl: apiService.getUserRewards,
        payload: payload,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        // console.log(resp.data.data, "---resp.data.data---", resp.data);
        setrewardHistory(resp.data.data);
        setrewardTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const rewardrecordpage = 5;
  const rewardpagerange = 5;

  const handlepagelogin = (event, pageNumber) => {
    setrewardcurrentpage(pageNumber);
    getRewardHistory(pageNumber);
  };

  return (
    <div>
      <section>
        <Header />
      </section>
      {siteLoader == true ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#ffc630"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <main className="dashboard_main">
          <div className="container-lg">
            <div className="row">
              <div className="col-lg-2">
                <Side_bar />
              </div>

              <div className="col-lg-10">
                <section className="asset_section">
                  <div className="row">
                    <div className="buy_head">
                      <div className="Buycrypto_title">{t('history')}</div>
                      <ul className="history-lists">

                        <Link to="/loginHistory" className="history-links">
                          {t('login')}
                        </Link> 
                        <Link to="/referralHistory" className="history-links">
                          {t('referral')}
                        </Link>
                        <Link
                          to="/depositHistory"
                          className="history-links"
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
                        <Link to="/stakingHistory" className="history-links">
                          {t('staking')}
                        </Link>
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
                        <Link to="/rewardsHistory" className="history-links active">
                          {t('rewards')}
                        </Link>
                         <Link to="/notificationHistory" className="history-links">
                            {t('notification')}
                          </Link>

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
                              <th>{t('siNO')}</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('type')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('amount')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('currency')}
                              </th>
                              <th className="opt-btn-flex txt-center table-action">
                                {t('dateclaimed')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {rewardHistory.length > 0 && rewardHistory ? (
                              rewardHistory.map((item, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="opt-percent font_14 pad-left-23">
                                      {i + 1}
                                    </td>
                                    <td className="opt-percent table_center_text font_14 pad-left-23">
                                      {item.type}
                                    </td>
                                    <td className="opt-percent table_center_text font_14 pad-left-23">
                                      {item.amount}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.currency}
                                    </td>
                                    <td className="opt-term font_14 px-2 table_center_text pad-top-14px">
                                      {Moment(item.dateClaimed).format(
                                        "DD.MM.YYYY hh:mm a"
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

                        {rewardHistory && rewardHistory.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(
                                  rewardtotalpage / rewardrecordpage
                                )}
                                page={rewardcurrentpage}
                                onChange={handlepagelogin}
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
                                    backgroundColor: "#ffc630 !important", // Background color for selected item
                                    color: "#000", // Text color for selected item
                                    "&:hover": {
                                      backgroundColor: "#ffc630",
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
    </div>
  );
}

export default RewardsHistory;
