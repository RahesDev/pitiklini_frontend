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

function CancelOrderTable() {
  const { t } = useTranslation();
  const [perpage, setperpage] = useState(5);

  const [cancelOrders, setcancelOrders] = useState([]);

  const [currentPagecan, setCurrentPagecan] = useState(1);
  const [totalcan, settotalcan] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  const recordPerPagecan = 5;

  useEffect(() => {
    getCancelOrders(1);
  }, [0]);

  const getCancelOrders = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
      };
      var data = {
        apiUrl: apiService.getCancelOrders,
        payload: obj,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setcancelOrders(resp.result);
        settotalcan(resp.count);
      } else {
      }
    } catch (error) {}
  };

  const cancelPageChange = (event, pageNumber) => {
    setCurrentPagecan(pageNumber); // call API to get data based on pageNumber
    getCancelOrders(pageNumber);
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
                          className="history-links active"
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
                                {t('pair')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('type')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('side')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('quantity')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('price')}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t('total')}
                              </th>
                              <th className="opt-btn-flex table-action">
                                {t('status')}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {cancelOrders?.length > 0 ? (
                              cancelOrders.map((item, i) => {
                                var total =
                                  item.ordertype == "Stop"
                                    ? +item.filledAmount * +item.stoporderprice
                                    : +item.filledAmount * +item.price;
                                var price =
                                  item.ordertype == "Stop"
                                    ? +item.stoporderprice
                                    : +item.price;
                                return (
                                  <tr>
                                    <td className="opt-percent font_14 pad-left-23 nowra_txt">
                                      {item.createddate}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.pairName}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.ordertype}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.tradeType}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {item.filledAmount} {item.firstSymbol}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {price} {item.toSymbol}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                      {total} {item.toSymbol}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-red nowra_txt">
                                      {t('cancelled')}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={8} className="text-center py-5">
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
                        {cancelOrders && cancelOrders.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(totalcan / recordPerPagecan)}
                                page={currentPagecan}
                                onChange={cancelPageChange}
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
}

export default CancelOrderTable;
