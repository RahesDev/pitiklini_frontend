import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Moment from "moment";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";

const MyHistoryTable = () => {
   const { t } = useTranslation();
  useEffect(() => {
    getp2pHistory(1); // Load first page initially
  }, []);

  const [p2pHistory, setp2pHistory, p2pHistoryref] = useState([]);
  const [historycurrentpage, sethistorycurrentpage, historycurrentpageref] =
    useState(1);
  const [historytotalpage, sethistoryTotalpages, historytotalpageref] =
    useState(0);

  const getp2pHistory = async (page = 1) => {
    var data = {
      apiUrl: apiService.p2pHistory,
      payload: { limit: 5, page },
    };
    var p2p_orders_list = await postMethod(data);
    if (p2p_orders_list.status) {
      setp2pHistory(p2p_orders_list.returnObj.Message);
      sethistoryTotalpages(Math.ceil(p2p_orders_list.returnObj.total / 5)); // Adjust total pages calculation
    }
  };

  const handlePageChange = (event, value) => {
    sethistorycurrentpage(value);
    getp2pHistory(value); // Fetch data for the selected page
  };

  let navigate = useNavigate();

  const navpage = async (link) => {
    navigate("/p2p/chat/" + link);
  };

  return (
    <>
      <Header />

      <main className="dashboard_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <section className="asset_section">
                <div className="row">
                  <div className="p2p-order-head">
                    <Link to="/p2p">
                      <div className="p2p-order-title text-p2p">{t('p2p')}</div>
                    </Link>
                    <div className="p2p-side-arrow">
                      <i className="ri-arrow-right-s-line"></i>
                    </div>
                    <div className="p2p-order-title text-order">{t('orders')}</div>
                  </div>

                  <div className="mt-4">
                    <ul className="history-lists">
                      <Link to="/processorders" className="history-links">
                        {t('processOrders')}
                      </Link>
                      <Link to="/myorders" className="history-links">
                        {t('myOrders')}
                      </Link>
                      <Link to="/myhistory" className="history-links active">
                        {t('myHistory')}
                      </Link>
                    </ul>
                  </div>

                  <div className="table-responsive table-cont mt-0 p-0">
                    <table className="table">
                      <thead>
                        <tr className="stake-head">
                          <th>{t('currency')}</th>
                          <th className="opt-nowrap txt-center pad-left-23">
                            {t('dateTime')}
                          </th>
                          <th className="opt-nowrap txt-center pad-left-23">
                            {t('quantity')}
                          </th>
                          <th className="opt-nowrap txt-center pad-left-23">
                            {t('price')}
                          </th>
                          <th className="opt-nowrap txt-center pad-left-23">
                            {t('orderType')}
                          </th>
                          <th className="opt-btn-flex table-action text-center">
                            {t('status')}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {p2pHistoryref.current &&
                        p2pHistoryref.current.length > 0 ? (
                          p2pHistoryref.current.map((item, i) => {
                            var status = "";
                            if (item.status == 0) status = "Confirmed";
                            if (item.status == 1) status = "Paid";
                            else if (item.status == 2) status = "Completed";
                            else if (item.status == 3) status = "Cancelled";

                            return (
                              <tr key={i} onClick={() => navpage(item.orderId)} className="link_text">
                                <td className="table-flex">
                                  <img
                                    src={item.firstCurrency.Currency_image}
                                    alt={item.firstCurrency.currencyName}
                                  />
                                  <div className="table-opt-name">
                                    <h4 className="opt-name font_14">
                                      {item.firstCurrency.currencyName}
                                    </h4>
                                    <h3 className="opt-sub font_14">
                                      {item.firstCurrency.currencySymbol}
                                    </h3>
                                  </div>
                                </td>
                                <td className="opt-percent font_14 table_center_text pad-left-23 text-nowrap">
                                  {Moment(item.datetime).format("lll")}
                                </td>
                                <td className="opt-term font_14 table_center_text pad-left-23">
                                  {parseFloat(item.askAmount).toFixed(8)}
                                </td>
                                <td className="opt-term font_14 table_center_text pad-left-23">
                                  {parseFloat(item.askPrice).toFixed(2)}
                                </td>
                                <td
                                  className={`opt-term font_14 table_center_text pad-left-23 ${
                                    item.type === "buy"
                                      ? "text-green"
                                      : "text-sell-red"
                                  }`}
                                >
                                  {item.type}
                                </td>
                                <td className="opt-btn-flex opt-term table-action pad-left-23 text-center">
                                {status == "Confirmed" ? 
                                <span className="text-yellow">{t('confirmed')}</span> :
                                status == "Paid" ?
                                <span className="text-green">{t('paid')}</span> :
                                status == "Completed" ?
                                <span className="text-orange">{t('completed')}</span> :
                                <span className="text-red">{t('cancelled')}</span> 
                              }
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                          <td colSpan={6} className="text-center py-5">
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

                    {/* Pagination */}
                    {/* <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={historytotalpageref.current}
                          page={historycurrentpageref.current}
                          onChange={handlePageChange}
                          size="small"
                          renderItem={(item) => (
                            <PaginationItem
                              slots={{
                                previous: ArrowBackIcon,
                                next: ArrowForwardIcon,
                              }}
                              {...item}
                            />
                          )}
                        />
                      </Stack>
                    </div> */}
                    {p2pHistoryref.current.length > 0 ? (
                    <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={historytotalpageref.current}
                          page={historycurrentpageref.current}
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
                              backgroundColor: "#BD7F10 !important", // Background color for selected item
                              color: "#000", // Text color for selected item
                              "&:hover": {
                                backgroundColor: "#BD7F10",
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
                    ) : ("")}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MyHistoryTable;
