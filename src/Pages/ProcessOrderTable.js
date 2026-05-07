import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Moment from "moment";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";
import DashboardLayout from "./DashboardLayout";

const ProcessOrderTable = () => {
  const { t } = useTranslation();
  const [notification, Setnotification, notificationref] = useState([]);
  const [notifyCurrentPage, setnotifyCurrentPage, notifyCurrentPageref] =
    useState(1); // Start with page 1
  const [notifytotalpage, Setnotifytotalpage, notifytotalpageref] = useState(0);
  usePageLeaveConfirm(
    "Are you sure you want to leave P2P?",
    "/processorders",
    true,
    [
      "/p2p/order/:id",
      "/p2p",
      "/p2p/chat/:id",
      "/myorders",
      "/myhistory",
      "/p2p/dispute/:id",
      "/postad",
      "/Paymentmethod",
    ],
  );

  useEffect(() => {
    notify(notifyCurrentPage);
  }, [notifyCurrentPage]);

  const [orderType, setOrderType] = useState("buy");

  const handlePageChange = (event, value) => {
    setnotifyCurrentPage(value);
  };

  const notify = async (page = 1) => {
    var Notification = {
      apiUrl: apiService.getp2pnotification,
      payload: { page, limit: 5 },
    };
    var resp = await postMethod(Notification);
    if (resp.status) {
      Setnotification(resp.data);
      Setnotifytotalpage(Math.ceil(resp.total / 5)); // Set total pages based on the total notifications and the limit
    } else {
      Setnotification([]);
    }
  };

  let navigate = useNavigate();

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
                      Order details with time stamp and order details.
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
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "buy"
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

                {/* <div className="table-responsive table-cont dash_table_content mt-0 p-0"> */}
                <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#181a20] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="overflow-x-auto">
                    <table className="table-auto w-max min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("sNo")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("dateTime")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            From
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme text-center">
                            {t("message")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {notificationref.current &&
                        notificationref.current.length > 0 ? (
                          notificationref.current.map((item, i) => (
                            <tr
                              key={i}
                              onClick={() => navchatpage(item.link)}
                              className="border-t border-white/5 align-middle transition-colors hover:bg-white/[0.02]"
                            >
                              <td className="table-flex opt-term">{i + 1}</td>
                              <td className="opt-term font_14 table_center_text">
                                {Moment(item.createdAt).format("lll")}
                              </td>
                              <td className="opt-term font_14 table_center_text">
                                {item.from_user_name}
                              </td>
                              <td className="table_center_text text-white">
                                <div className="opt-action-normal">
                                  {item.message}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
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
                    {notificationref.current.length > 0 ? (
                      // <div className="pagination">
                      <div className="flex justify-center mt-6">
                        <Stack spacing={2}>
                          <Pagination
                            count={notifytotalpageref.current}
                            page={notifyCurrentPageref.current}
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

export default ProcessOrderTable;
