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

const Dashboard = () => {
  const { t } = useTranslation();
  const [depositHistory, setdepositHistory] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [depositcurrentpage, setdepositcurrentpage] = useState(1);
  const [deposittotalpage, setdepositTotalpages] = useState(0);

  useEffect(() => {
    getdepositHistory(1);
  }, [0]);

  const getdepositHistory = async (page) => {
    var obj = {
      apiUrl: apiService.deposit_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    setSiteLoader(true);

    var deposit_history_list = await postMethod(obj);
    setSiteLoader(false);

    if (deposit_history_list) {
      setdepositHistory(deposit_history_list.result);
      setdepositTotalpages(deposit_history_list.total);
      console.log("deposit_history_list.pages===", deposittotalpage);
    }
  };

  const depositrecordpage = 5;
  const depositpagerange = 5;
  const handlepagedeposit = (event, page) => {
    getdepositHistory(page);
    setdepositcurrentpage(page);
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Address copied");
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
              {/* <AssetListTable /> */}
              {/* <HistoryListTable /> */}

              <div className="w-full">
                <div className="bg-black rounded-xl p-4">
                  <div className="text-primary text-lg font-bold mb-8">
                    {t("deposit")} {t("history")}
                  </div>

                  {/* Header */}
                  <div className="flex items-center bg-gray rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("date")}</div>
                    <div className="flex-1 text-center">{t("currency")}</div>
                    <div className="flex-1 text-center">{t("amount")}</div>
                    <div className="flex-1 text-center">
                      {t("transactionId")}
                    </div>
                    <div className="flex-1 text-center">{t("status")}</div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 flex flex-col gap-3">
                    {depositHistory && depositHistory.length > 0 ? (
                      depositHistory.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center bg-black border border-gray rounded-lg px-4 py-4 hover:bg-gray transition"
                        >
                          {/* Date */}
                          <div className="flex-1 text-secondary text-sm">
                            {Moment(item.date).format("DD.MM.YYYY hh:mm a")}
                          </div>

                          {/* Currency */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {item.currencySymbol}
                          </div>

                          {/* Amount */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {parseFloat(item.amount).toFixed(8)}
                          </div>

                          {/* Transaction ID */}
                          <div className="flex-1 flex items-center justify-center gap-2 text-secondary10 text-sm">
                            <span className="truncate">
                              {item.txnid
                                ? item.txnid.substring(0, 10) + "..."
                                : "-"}
                            </span>
                            <i
                              className="ri-file-copy-line cursor-pointer text-secondary10 hover:text-primary shrink-0"
                              onClick={() => copy(item.txnid)}
                            ></i>
                          </div>

                          {/* Status (always completed here) */}
                          <div className="flex-1 flex justify-center">
                            <span className="px-4 py-1 rounded-full text-sm bg-green-custom/20 text-green-custom">
                              {t("completed")}
                            </span>
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
                  {depositHistory && depositHistory.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(
                            deposittotalpage / depositrecordpage,
                          )}
                          page={depositcurrentpage}
                          onChange={handlepagedeposit}
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
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
