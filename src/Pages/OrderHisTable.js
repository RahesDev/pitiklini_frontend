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

const OrderHisTable = () => {
  const { t } = useTranslation();
  const [perpage, setperpage] = useState(5);
  const [activeOrderDatas, setActiveOders] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalactive, settotalactive] = useState(0);

  const recordPerPage = 5;

  useEffect(() => {
    getActiveOrders(1);
  }, [0]);

  const getActiveOrders = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
      };
      var data = {
        apiUrl: apiService.getActiveOrders,
        payload: obj,
      };

      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        settotalactive(resp.count);
        setActiveOders(resp.result);
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
          "Order cancelled successfully, your amount credit to your wallet",
        );
        getActiveOrders(1);
      } else {
        toast.error("Please try again later");
      }
    } catch (error) {
      toast.error("Please try again later");
    }
  };

  const activePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getActiveOrders(pageNumber);
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
                    {t("openOrder")} {t("history")}
                  </div>

                  {/* Header */}
                  <div className="flex items-center bg-gray rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("date")}</div>
                    <div className="flex-1 text-center">{t("pair")}</div>
                    <div className="flex-1 text-center">{t("type")}</div>
                    <div className="flex-1 text-center">{t("side")}</div>
                    <div className="flex-1 text-center">{t("quantity")}</div>
                    <div className="flex-1 text-center">{t("price")}</div>
                    <div className="flex-1 text-center">{t("total")}</div>
                    <div className="flex-1 text-center">{t("status")}</div>
                    <div className="flex-1 text-center">{t("action")}</div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 flex flex-col gap-3">
                    {activeOrderDatas?.length > 0 ? (
                      activeOrderDatas.map((item, i) => {
                        const date = Moment(item.createddate).format(
                          "DD.MM.YYYY hh:mm a",
                        );

                        const price =
                          item.ordertype === "Stop"
                            ? parseFloat(item.stoporderprice).toFixed(8)
                            : parseFloat(item.price).toFixed(8);

                        const total =
                          item.ordertype === "Stop"
                            ? (item.filledAmount * item.stoporderprice).toFixed(
                                8,
                              )
                            : (item.filledAmount * item.price).toFixed(8);

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
                              {item.pairName}
                            </div>

                            {/* Type */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {item.ordertype}
                            </div>

                            {/* Side */}
                            <div className="flex-1 text-center text-sm">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  item.tradeType?.toLowerCase() === "buy"
                                    ? "bg-green-custom/20 text-green-custom"
                                    : "bg-red-custom/20 text-red-custom"
                                }`}
                              >
                                {item.tradeType}
                              </span>
                            </div>

                            {/* Quantity */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {parseFloat(item.filledAmount).toFixed(8)}{" "}
                              {item.firstSymbol}
                            </div>

                            {/* Price */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {price} {item.toSymbol}
                            </div>

                            {/* Total */}
                            <div className="flex-1 text-center text-secondary text-sm">
                              {total} {item.toSymbol}
                            </div>

                            {/* Status */}
                            <div className="flex-1 text-center text-sm">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  item.tradeType?.toLowerCase() === "buy"
                                    ? "bg-green-custom/20 text-green-custom"
                                    : "bg-red-custom/20 text-red-custom"
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>

                            {/* Action */}
                            <div className="flex-1 flex justify-center">
                              <button
                                onClick={() => orderCancel(item)}
                                className="px-4 py-1 rounded-lg bg-red-custom/20 text-red-custom hover:bg-red-custom/30 text-xs transition"
                              >
                                {t("cancel")}
                              </button>
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
                          {t("noRecordsFound")}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {activeOrderDatas && activeOrderDatas.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(totalactive / recordPerPage)}
                          page={currentPage}
                          onChange={activePageChange}
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

export default OrderHisTable;
