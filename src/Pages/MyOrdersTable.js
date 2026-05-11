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
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";
import DashboardLayout from "./DashboardLayout";

const MyOrdersTable = () => {
  const { t } = useTranslation();
  const [p2pOrders, setp2pOrders, p2pOrdersref] = useState([]);
  const [p2pcurrentpage, setp2pcurrentpage, p2pcurrentpageref] = useState(1);
  const [p2ptotalpages, setp2pTotalpages, p2ptotalpageref] = useState(0);
  // usePageLeaveConfirm(
  //   "Are you sure you want to leave P2P?",
  //   "/myorders",
  //   true,
  //   [
  //     "/p2p/order/:id",
  //     "/processorders",
  //     "/myhistory",
  //     "/p2p/chat/:id",
  //     "/p2p",
  //     "/p2p/dispute/:id",
  //     "/postad",
  //     "/Paymentmethod",
  //   ],
  // );

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

  const [orderType, setOrderType] = useState("buy");

  const handlePageChange = (event, page) => {
    getp2pOrders(page);
  };

  let navigate = useNavigate();

  const navpage = async (link) => {
    navigate("/p2p/order/" + link);
  };

  const navchatpage = (link) => {
    navigate(link);
  };

  return (
    <>
      <DashboardLayout>
        <section className="asset_section">
          <div className="buy_head">
            <div className="w-full">
              <div className="bg-black rounded-xl p-4">
                <div className="p2p_header_row flex justify-between items-center mb-6">
                  <div>
                    <h2 className="p2p_main_title text-[#BD7F10]">
                      P2P Platform
                    </h2>
                    <h3 className="p2p_main_title text-[#ffff]">
                      Order History
                    </h3>
                    <span className="p2p_subtitle text-[#BD7F10]">
                      Order details with time stamp and order details
                    </span>
                  </div>
                  {/* <div className="flex space-x-4">
                    <Link
                      to={loginStatus ? "/postad" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      + Post Advertisement
                    </Link>
                    <Link
                      to={loginStatus ? "/Paymentmethod" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      Payment Method
                    </Link>
                    <Link
                      to={loginStatus ? "/processorders" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      {t("orders")}
                    </Link>
                  </div> */}
                </div>

                <div className="p2p_header_row flex justify-between items-center mb-6">
                  <div className="flex rounded-2xl bg-[#060913] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      onClick={() => navchatpage("/processorders")}
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "sell"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("processOrders")}
                    </button>

                    <button
                      type="button"
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "buy"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myOrders")}
                    </button>

                    <button
                      type="button"
                      onClick={() => navchatpage("/myhistory")}
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "sell"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myHistory")}
                    </button>
                  </div>
                </div>
                {/* <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,#141b2d_0%,#11182a_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"> */}
                <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#181a20] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="overflow-x-auto">
                    <table className="table-auto w-max min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("currency")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("dateTime")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("quantity")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("price")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("unit")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("orderType")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("status")}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {p2pOrdersref.current &&
                        p2pOrdersref.current.length > 0 ? (
                          p2pOrdersref.current.map((item, i) => (
                            <tr
                              key={i}
                              onClick={() => navpage(item.orderId)}
                              className="border-t border-white/5 align-middle transition-colors hover:bg-white/[0.02]"
                            >
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
                                {parseFloat(item.price).toFixed(2)}{" "}
                                {item.secondCurrnecy}
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
                                {item.status == "active" ? (
                                  <span className="text-yellow">
                                    {t("active")}
                                  </span>
                                ) : item.status == "filled" ? (
                                  <span className="text-green">
                                    {t("filled")}
                                  </span>
                                ) : item.status == "partially" ? (
                                  <span className="text-orange">
                                    {t("partially")}
                                  </span>
                                ) : (
                                  <span className="text-red">
                                    {t("cancelled")}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-10 text-center text-sm text-white/60"
                            >
                              {/* <div className="empty_data">
                                <div className="empty_data_img">
                                  <img
                                    src={require("../assets/No-data.webp")}
                                    width="100px"
                                  />
                                </div>
                                <div className="no_records_text"> */}
                              {t("noRecordsFound")}
                              {/* </div>
                              </div> */}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {p2pOrdersref.current.length > 0 ? (
                      // <div className="pagination">
                      <div className="flex justify-center mt-6">
                        <Stack spacing={2}>
                          <Pagination
                            count={p2ptotalpageref.current}
                            page={p2pcurrentpageref.current}
                            onChange={handlePageChange}
                            size="small"
                            sx={{
                              "& .MuiPagination-ul": { gap: "6px" },
                              "& .MuiPaginationItem-root": {
                                color: "#fff",
                                borderRadius: "6px",
                                minWidth: "34px",
                                height: "34px",
                              },
                              "& .MuiPaginationItem-root:hover": {
                                backgroundColor: "#BD7F10",
                                color: "#000",
                              },
                              "& .Mui-selected": {
                                backgroundColor: "#BD7F10 !important",
                                color: "#000",
                                fontWeight: "600",
                              },
                              "& .MuiPaginationItem-icon": {
                                color: "inherit",
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
            </div>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

export default MyOrdersTable;
