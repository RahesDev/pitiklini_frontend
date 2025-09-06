import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Moment from "moment";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

const MyOrdersTable = () => {
  const { t } = useTranslation();
  const [p2pOrders, setp2pOrders, p2pOrdersref] = useState([]);
  const [p2pcurrentpage, setp2pcurrentpage, p2pcurrentpageref] = useState(1);
  const [p2ptotalpages, setp2pTotalpages, p2ptotalpageref] = useState(0);

  useEffect(() => {
    getp2pOrders(1); // Load first page initially
  }, []);

  const getp2pOrders = async (page = 1) => {
    try {
      var data = {
        apiUrl: apiService.p2pOrders,
        payload: { FilPerpage: 5, FilPage: page },
      };
      var p2p_orders_list = await postMethod(data);
      if (p2p_orders_list.status === true) {
        setp2pOrders(p2p_orders_list.returnObj.Message);
        setp2pTotalpages(p2p_orders_list.returnObj.pages);
        setp2pcurrentpage(page);
      }
    } catch (error) {
      console.error("Error fetching P2P orders:", error);
    }
  };

  const handlePageChange = (event, page) => {
    getp2pOrders(page);
  };

  let navigate = useNavigate();

  const navpage = async (link) => {
    navigate("/p2p/order/" + link);
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
                  {/* head */}
                  <div className="p2p-order-head">
                    <Link to="/p2p">
                      <div className="p2p-order-title text-p2p">{t('p2p')}</div>
                    </Link>
                    <div className="p2p-side-arrow">
                      <i className="ri-arrow-right-s-line"></i>
                    </div>
                    <div className="p2p-order-title text-order">{t('orders')}</div>
                  </div>

                  {/* nav tabs */}
                  <div className="mt-4">
                    <ul className="history-lists">
                      <Link to="/processorders" className="history-links">
                        {t('processOrders')}
                      </Link>
                      <Link to="/myorders" className="history-links active">
                        {t('myOrders')}
                      </Link>
                      <Link to="/myhistory" className="history-links">
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
                            {t('unit')}
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
                        {p2pOrdersref.current &&
                        p2pOrdersref.current.length > 0 ? (
                          p2pOrdersref.current.map((item, i) => (
                            <tr key={i} onClick={() => navpage(item.orderId)} className="link_text">
                              <td className="table-flex">
                                <img
                                  src={item.fromCurrency.Currency_image}
                                  alt=""
                                />
                                <div className="table-opt-name">
                                  <h4 className="opt-name font_14">
                                    {item.fromCurrency.currencyName}
                                  </h4>
                                  <h3 className="opt-sub font_14">
                                    {item.fromCurrency.currencySymbol}
                                  </h3>
                                </div>
                              </td>
                              <td className="opt-percent font_14 table_center_text pad-left-23 text-nowrap">
                                {Moment(item.createdAt).format("lll")}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23">
                                {parseFloat(item.totalAmount).toFixed(4)}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23">
                                {parseFloat(item.price).toFixed(2)} {item.secondCurrnecy}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23 text-nowrap">
                                {parseFloat(item.fromLimit).toFixed(4)} -{" "}
                                {parseFloat(item.toLimit).toFixed(4)}{" "}
                                {item.firstCurrency}
                              </td>
                              <td
                                className={`opt-term font_14 table_center_text pad-left-23 ${
                                  item.orderType === "buy"
                                    ? "text-green"
                                    : "text-sell-red"
                                }`}
                              >
                                {item.orderType}
                              </td>
                              <td className="opt-btn-flex opt-term table-action pad-left-23 text-center">
                                {item.status == "active" ? 
                                <span className="text-yellow">{t('active')}</span> :
                                item.status == "filled" ?
                                <span className="text-green">{t('filled')}</span> :
                                item.status == "partially" ?
                                <span className="text-orange">{t('partially')}</span> :
                                <span className="text-red">{t('cancelled')}</span> 
                              }
                              </td>
                            </tr>
                          ))
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
                                {t('noRecordsFound')}
                              </div>
                            </div>
                          </td>
                        </tr>
                        )}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {/* <div className="paginate">
                      <Stack spacing={2}>
                        <Pagination
                          count={p2ptotalpageref.current}
                          page={p2pcurrentpageref.current}
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
                    {p2pOrdersref.current.length > 0 ? (
                    <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={p2ptotalpageref.current}
                          page={p2pcurrentpageref.current}
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
                    ) : ("") }
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

export default MyOrdersTable;
