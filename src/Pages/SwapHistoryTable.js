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
import moment from "moment";
import { useTranslation } from "react-i18next";

const SwapHistoryTable = () => {
  const { t } = useTranslation();
  const [swapHistory, setswapHistory] = useState([]);
  const [totalPage, setTotalpages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    swaphistory(1);
  }, [0]);

  const swaphistory = async (page) => {
    try {
      var payload = {
        perpage: 5,
        page: page,
      };
      var data = {
        apiUrl: apiService.swappingHistory,
        payload: payload,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setswapHistory(resp.data.data);
        setTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const recordPerPage = 5;

  const handlePageChange = (event, pageNumber) => {
    swaphistory(pageNumber);
    setCurrentPage(pageNumber);
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
                           {t('internalTransfer')}
                        </Link>
                        <Link
                          to="/swapHistory"
                          className="history-links active"
                        >
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
                              <th className="pl-none">S.No</th>
                              <th className="opt-nowrap txt-center">
                                {t('dte_Time')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('fromCurrency')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('tocurrency')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('amount')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('received')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('price')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('totalAmount')}
                              </th>
                              <th className="opt-btn-flex table-action text-center">
                                {t('fee')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {swapHistory.length > 0 && swapHistory ? (
                              swapHistory.map((item, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="opt-percent font_14 pad-left-23">
                                      {i + 1}
                                    </td>
                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {moment(item.createdDate).format("lll")}
                                    </td>
                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.fromCurrency}
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.toCurrency}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {parseFloat(item.amount).toFixed(4)} {""}{" "}
                                      {item.fromCurrency}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {parseFloat(item.receivedAmount).toFixed(
                                        4
                                      )}{" "}
                                      {""} {item.toCurrency}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {parseFloat(item.price).toFixed(4)} {""}{" "}
                                      {item.toCurrency}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {parseFloat(item.totalAmount).toFixed(6)}{" "}
                                      {item.fromCurrency}
                                    </td>
                                    <td className="opt-term font_14 px-2 table_center_text pad-top-14px nowra_txt">
                                      {parseFloat(item.fee).toFixed(6)} {""}{" "}
                                      {item.fromCurrency}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={9} className="text-center py-5">
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
                        {swapHistory && swapHistory.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(totalPage / recordPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
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

export default SwapHistoryTable;
