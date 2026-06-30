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
import DashboardLayout from "./DashboardLayout";

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

  const [orderType, setOrderType] = useState("buy");

  const handlePageChange = (event, value) => {
    sethistorycurrentpage(value);
    getp2pHistory(value); // Fetch data for the selected page
  };

  let navigate = useNavigate();

  const navpage = async (link) => {
    navigate("/p2p/chat/" + link);
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
                      {t("p2pplatform")}
                    </h2>
                    <h3 className="p2p_main_title text-[#ffff]">
                      {t("OrderHistory")}
                    </h3>
                    <span className="p2p_subtitle text-[#BD7F10]">
                      {t("OrderHistorydetals")}
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
                      onClick={() => navchatpage("/myorders")}
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "sell"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myOrders")}
                    </button>

                    <button
                      type="button"
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "buy"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myHistory")}
                    </button>
                  </div>
                </div>
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
                            {t("orderType")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("status")}
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
                              <tr
                                key={i}
                                onClick={() => navpage(item.orderId)}
                                className="border-t border-white/5 align-middle transition-colors hover:bg-white/[0.02]"
                              >
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
                                  {status == "Confirmed" ? (
                                    <span className="text-yellow">
                                      {t("confirmed")}
                                    </span>
                                  ) : status == "Paid" ? (
                                    <span className="text-green">
                                      {t("paid")}
                                    </span>
                                  ) : status == "Completed" ? (
                                    <span className="text-orange">
                                      {t("completed")}
                                    </span>
                                  ) : (
                                    <span className="text-red">
                                      {t("cancelled")}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
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

                    {p2pHistoryref.current.length > 0 ? (
                      // <div className="pagination">
                      <div className="flex justify-center mt-6">
                        <Stack spacing={2}>
                          <Pagination
                            count={historytotalpageref.current}
                            page={historycurrentpageref.current}
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

export default MyHistoryTable;
