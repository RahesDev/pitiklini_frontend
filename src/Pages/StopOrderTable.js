import React,{ useEffect } from "react";
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

function StopOrderTable() {
  const { t } = useTranslation();
    const [perpage, setperpage] = useState(5);
    const [stopOrders, setstopOrders] = useState([]);
  
    const [currentPagestop, setCurrentPagestop] = useState(1);
    const [totalStop, settotalStop] = useState(0);
    const [siteLoader, setSiteLoader] = useState(false);
  
    const recordPerPageStop = 5;
  
    useEffect(() => {
      getStopOrders(1);
    }, [0]);

    const getStopOrders = async (pages) => {
        try {
          var obj = {
            FilPerpage: perpage,
            FilPage: pages,
          };
          var data = {
            apiUrl: apiService.getStopOrders,
            payload: obj,
          };
          setSiteLoader(true);
          var resp = await postMethod(data);
          setSiteLoader(false);
          if (resp.status) {
            settotalStop(resp.count);
            setstopOrders(resp.result);
          } else {
          }
        } catch (error) {}
      };
    
      const orderCancel = async (cancelDatas) => {
        try {
          var obj = {
            _id: cancelDatas._id,
          };
          var data = {
            apiUrl: apiService.cancelOrder,
            payload: obj,
          };
          var fetchTradeHisotory = await postMethod(data);
          if (fetchTradeHisotory) {
            toast.success(
              "Order cancelled successfully, your amount credit to your wallet"
            );
          } else {
            toast.error("Please try again later");
          }
        } catch (error) {
          toast.error("Please try again later");
        }
      };
    
      const orderstopactive = (event, pageNumber) => {
        setCurrentPagestop(pageNumber); // call API to get data based on pageNumber
        getStopOrders(pageNumber);
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
                color="#ffc630"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            <main className="dashboard_main">
              <div className="container">
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
                            <Link to="/depositHistory" className="history-links ">
                              {t('deposit')}
                            </Link>
                            <Link to="/withdrawHistory" className="history-links ">
                              {t('withdraw')}
                            </Link>
                            <Link to="/tradeHistory" className="history-links ">
                              {t('trade')}
                            </Link>
                            <Link to="/loginHistory" className="history-links ">
                              {t('login')}
                            </Link>
                            <Link to="/swapHistory" className="history-links">
                              {t('convert')}
                            </Link>
                            <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t('internalTransfer')}
                        </Link>
                            <Link to="/referralHistory" className="history-links ">
                              {t('referral')}
                            </Link>
                            <Link to="/rewardsHistory" className="history-links">
                              {t('rewards')}
                            </Link>
                            <Link to="/stakingHistory" className="history-links ">
                              {t('staking')}
                            </Link>
                            <Link
                              to="/orderHistory"
                              className="history-links"
                            >
                              {t('openOrder')}
                            </Link>
                            <Link to="/cancelorderHistory" className="history-links">
                              {t('closeOrder')}
                            </Link>
                            <Link to="/stoporderHistory" className="history-links active">
                              {t('stopOrder')}
                            </Link>
                             <Link to="/notificationHistory" className="history-links">
                              {t('notification')}
                            </Link>
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
                                  {t('side')}
                                  </th>
                                  <th className="opt-nowrap txt-center pad-left-23">
                                    {t('quantity')}
                                  </th>
                                  <th className="opt-nowrap txt-center pad-left-23">
                                  {t('stopPrice')}
                                  </th>
                                  <th className="opt-nowrap txt-center pad-left-23">
                                  {t('limitPrice')}
                                  </th>
                                  <th className="opt-nowrap txt-center pad-left-23">
                                    {t('total')}
                                  </th>
                                  <th className="opt-nowrap txt-center pad-left-23">
                                    {t('status')}
                                  </th>
                                  <th className="opt-btn-flex table-action text-center">
                                    {t('action')}
                                  </th>
                                </tr>
                              </thead>
    
                              <tbody>
                                {stopOrders?.length > 0 ? (
                                  stopOrders.map((item, i) => {
                                    var dates = Moment(item.createddate).format(
                                      "DD.MM.YYYY hh:mm a"
                                    );
                                    return (
                                      <tr>
                                        <td className="opt-percent font_14 pad-left-23">
                                          {dates}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                          {item.pairName}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                          {item.tradeType}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                          {parseFloat(item.filledAmount).toFixed(8)}{" "}
                                          {item.firstSymbol}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                        {parseFloat(item.price).toFixed(8)}{" "}
                                        {item.toSymbol}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                        {parseFloat(item.stoporderprice).toFixed(
                                        8
                                      )}{" "}
                                      {item.toSymbol}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                        {parseFloat(
                                        item.filledAmount * item.stoporderprice
                                      ).toFixed(8)}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23">
                                        {item.tradeType == "buy" ? (
                                        <span className="text-green">
                                          {item.status}
                                        </span>
                                      ) : (
                                        <span className="text-red">
                                          {item.status}
                                        </span>
                                      )}
                                        </td>
                                        <td className="opt-btn-flex table-action pad-left-23 text-green text-center">
                                        <button
                                        className="action_btn"
                                        onClick={() => orderCancel(item)}
                                      >
                                        {t('cancel')}
                                      </button>
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
                            {stopOrders && stopOrders.length > 0 ? (
                              <div className="pagination">
                                <Stack spacing={2}>
                                  <Pagination
                                count={Math.ceil(totalStop / recordPerPageStop)}
                                page={currentPagestop}
                                onChange={orderstopactive}
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
        </>
      );
}

export default StopOrderTable;