import React, { useEffect } from "react";
import DashboardLayout from "./DashboardLayout";
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

const WithdrawTable = () => {
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [withdrawcurrentpage, setwithdrawcurrentpage] = useState(1);
  const [withdrawtotalpage, setwithdrawTotalpages] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    getwithdrawHistory(1);
  }, [0]);

  const getwithdrawHistory = async (page) => {
    var data = {
      apiUrl: apiService.withdraw_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    setSiteLoader(true);
    var withdraw_history_list = await postMethod(data);
    setSiteLoader(false);
    if (withdraw_history_list) {
      console.log(
        withdraw_history_list,
        "--- withdraw_history_list--",
        withdraw_history_list.result,
        withdraw_history_list.pages,
      );
      setwithdrawHistory(withdraw_history_list.result);
      setwithdrawTotalpages(withdraw_history_list.pages);
    }
  };

  const withdrawrecordpage = 5;
  const withdrawpagerange = 5;

  const handlepagewithdraw = (event, page) => {
    getwithdrawHistory(page);
    setwithdrawcurrentpage(page);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied");
  };

  return (
    <>
      <DashboardLayout>
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
          <section className="asset_section">
            <div className="buy_head">
              <div className="w-full">
                <div className="bg-black rounded-xl p-4">
                  <div className="text-primary text-lg font-bold mb-8">
                    {t("withdraw")} {t("history")}
                  </div>

                  {/* Header */}
                  <div className="flex items-center bg-gray rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("transactionId")}</div>
                    <div className="flex-1 text-center">{t("amount")}</div>
                    <div className="flex-1 text-center">{t("currency")}</div>
                    <div className="flex-1 text-center">{t("date")}</div>
                    <div className="flex-1 text-center">{t("status")}</div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 flex flex-col gap-3">
                    {withdrawHistory.length > 0 ? (
                      withdrawHistory.map((data, i) => (
                        <div
                          key={i}
                          className="flex items-center bg-black border border-gray rounded-lg px-4 py-4 hover:bg-gray transition"
                        >
                          {/* Transaction ID */}
                          <div className="flex-1 flex items-center gap-2 text-secondary10 text-sm ">
                            {data.txn_id ? data.txn_id.slice(0, 10) : "-"}
                            <i
                              className="ri-file-copy-line cursor-pointer text-secondary10 hover:text-primary"
                              onClick={() => copy(data.txn_id)}
                            ></i>
                          </div>

                          {/* Amount */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {data.amount ? data.amount.toFixed(4) : 0}
                          </div>

                          {/* Currency */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {data.currency}
                          </div>

                          {/* Date */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {Moment(data.created_at).format("lll")}
                          </div>

                          {/* Status */}
                          <div className="flex-1 flex justify-center">
                            {(() => {
                              const status = data.status?.toLowerCase();

                              if (status === "completed") {
                                return (
                                  <span className="px-4 py-1 rounded-full text-sm bg-green-custom/20 text-green-custom">
                                    {t("completed")}
                                  </span>
                                );
                              }

                              if (status === "cancelled") {
                                return (
                                  <span className="px-4 py-1 rounded-full text-sm bg-red-custom/20 text-red-custom">
                                    {t("cancelled")}
                                  </span>
                                );
                              }

                              return (
                                <span className="px-4 py-1 rounded-full text-sm bg-primary/20 text-primary">
                                  {t("pending")}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <img
                          src={require("../assets/No-data.webp")}
                          className="w-24"
                          alt="no data"
                        />
                        <div className="text-secondary10 mt-3">
                          {t("noRecordsFound")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {withdrawHistory.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(withdrawtotalpage)}
                          page={withdrawcurrentpage}
                          onChange={handlepagewithdraw}
                          size="small"
                          sx={{
                            "& .MuiPagination-ul": {
                              gap: "6px",
                            },

                            /* ALL buttons (numbers + arrows) */
                            "& .MuiPaginationItem-root": {
                              color: "#fff",
                              borderRadius: "6px",
                              minWidth: "34px",
                              height: "34px",
                              backgroundColor: "transparent",
                              transition: "all 0.2s ease",
                            },

                            /* HOVER (apply to everything including arrows) */
                            "& .MuiPaginationItem-root:hover": {
                              backgroundColor: "#BD7F10",
                              color: "#000",
                            },

                            /* SELECTED */
                            "& .Mui-selected": {
                              backgroundColor: "#BD7F10 !important",
                              color: "#000",
                              fontWeight: "600",
                            },

                            /* PREV / NEXT buttons (force same style) */
                            "& .MuiPaginationItem-previousNext": {
                              borderRadius: "6px",
                            },

                            /* ICON inside arrows */
                            "& .MuiPaginationItem-icon": {
                              color: "inherit", // 👈 makes arrow follow text color
                            },
                          }}
                        />
                      </Stack>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* </div> */}
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default WithdrawTable;
