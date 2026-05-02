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
import { t } from "i18next";

const TradeTable = () => {
  const [perpage, setperpage] = useState(5);
  const [tradeHistoryData, settradeHistory] = useState([]);

  const [currentPageHis, setcurrentPageHis] = useState(1);
  const [totalHist, settotalHist] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  const recordPerPageHist = 5;

  useEffect(() => {
    tradeHistory(1);
  }, [0]);

  const tradeHistory = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
      };
      var data = {
        apiUrl: apiService.tradeHistory,
        payload: obj,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        settradeHistory(resp.result);
        settotalHist(resp.count);
      } else {
      }
    } catch (error) {}
  };

  const orderhistoryactive = (event, pageNumber) => {
    setcurrentPageHis(pageNumber); // call API to get data based on pageNumber
    tradeHistory(pageNumber);
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
                    {t("trade")} {t("history")}
                  </div>

                  {/* Header */}
                  <div className="flex items-center bg-gray rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("date")}</div>
                    <div className="flex-1 text-center">{t("pair")}</div>
                    <div className="flex-1 text-center">{t("Type")}</div>
                    <div className="flex-1 text-center">{t("price")}</div>
                    <div className="flex-1 text-center">{t("amount")}</div>
                    <div className="flex-1 text-center">{t("total")}</div>
                    <div className="flex-1 text-center">{t("status")}</div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 flex flex-col gap-3">
                    {tradeHistoryData.length > 0 ? (
                      tradeHistoryData.map((item, i) => {
                        const date = Moment(item.created_at).format(
                          "DD.MM.YYYY hh:mm a",
                        );

                        const isBuy = item.type?.toLowerCase() === "buy";

                        return (
                          <div
                            key={i}
                            className="flex items-center bg-black border border-gray rounded-lg px-4 py-4 hover:bg-gray transition"
                          >
                            {/* Date */}
                            <div className="flex-1 text-secondary text-sm">
                              {date}
                            </div>

                            {/* Pair */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {item.pair}
                            </div>

                            {/* Type */}
                            <div className="flex-1 text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  isBuy
                                    ? "bg-green-custom/20 text-green-custom"
                                    : "bg-red-custom/20 text-red-custom"
                                }`}
                              >
                                {item.type}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {item.askPrice}
                            </div>

                            {/* Amount */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {item.askAmount}
                            </div>

                            {/* Total */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {item.total}
                            </div>

                            {/* Status */}
                            <div className="flex-1 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  isBuy
                                    ? "bg-green-custom/20 text-green-custom"
                                    : "bg-red-custom/20 text-red-custom"
                                }`}
                              >
                                Filled
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10">
                        <img
                          src={require("../assets/No-data.webp")}
                          className="w-24"
                          alt="no data"
                        />
                        <div className="text-secondary10 mt-3">
                          No Records Found
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {tradeHistoryData && tradeHistoryData.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(totalHist / recordPerPageHist)}
                          page={currentPageHis}
                          onChange={orderhistoryactive}
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

export default TradeTable;
