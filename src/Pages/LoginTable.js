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

const LoginTable = () => {
   const { t } = useTranslation();
  const [sessionHistory, setsessionHistory] = useState([]);
  const [logincurrentpage, setlogincurrentpage] = useState(1);
  const [logintotalpage, setloginTotalpages] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    getLoginHistory(1);
  }, [0]);

  const getLoginHistory = async (page) => {
    try {
      var payload = {
        perpage: loginrecordpage,
        page: page,
      };
      var data = {
        apiUrl: apiService.getSessionHisotry,
        payload: payload,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setsessionHistory(resp.data.data);
        setloginTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const loginrecordpage = 5;
  const loginpagerange = 5;

  const handlepagelogin = (event, pageNumber) => {
    setlogincurrentpage(pageNumber);
    getLoginHistory(pageNumber);
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
                        <Link
                          to="/loginHistory"
                          className="history-links active"
                        >
                          {t('login')}
                        </Link>
                        {/* <Link to="/referralHistory" className="history-links">
                                  Referral
                                </Link> */}
                        <Link to="/depositHistory" className="history-links">
                          {t('deposit')}
                        </Link>
                        <Link to="/withdrawHistory" className="history-links">
                          {t('withdraw')}
                        </Link>
                        <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t('internal_transfer')}
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
                              <th>Date</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {" "}
                                {t('IpAddress')}
                              </th>
                              <th className="opt-btn-flex table-action">
                                {t('device')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {sessionHistory.length > 0 && sessionHistory ? (
                              sessionHistory.map((item, i) => {
                                return (
                                  <tr>
                                    <td className="opt-percent font_14 pad-left-23 nowra_txt">
                                      {Moment(item.createdDate).format(
                                        "DD.MM.YYYY hh:mm a"
                                      )}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.ipAddress}
                                    </td>
                                    <td className="opt-term font_14 px-2 table_center_last pad-top-14px nowra_txt">
                                      {item.platform}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center py-5">
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

                        {sessionHistory && sessionHistory.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(
                                  logintotalpage / loginrecordpage
                                )}
                                page={logincurrentpage}
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

export default LoginTable;
