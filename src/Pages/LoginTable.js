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

const LoginTable = () => {
  const { t } = useTranslation();
  const [sessionHistory, setsessionHistory] = useState([]);
  const [logincurrentpage, setlogincurrentpage] = useState(1);
  const [logintotalpage, setloginTotalpages] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    getLoginHistory(1);
  }, [0]);

  const getLoginHistory = async (page) => {
    try {
      var payload = {
        perpage: loginrecordpage,
        page: page,
      };
      var data = {
        apiUrl: apiService.getSessionHisotry,
        payload: payload,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setsessionHistory(resp.data.data);
        setloginTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const loginrecordpage = 5;
  const loginpagerange = 5;

  const handlepagelogin = (event, pageNumber) => {
    setlogincurrentpage(pageNumber);
    getLoginHistory(pageNumber);
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
                    {t("login")} {t("history")}
                  </div>

                  {/* Header */}
                  <div className="flex items-center bg-gray rounded-lg px-4 py-3 text-primary text-sm">
                    <div className="flex-1">{t("date")}</div>
                    <div className="flex-1 text-center">{t("IpAddress")}</div>
                    <div className="flex-1 text-center">{t("device")}</div>
                  </div>

                  {/* Body */}
                  <div className="mt-3 flex flex-col gap-3">
                    {sessionHistory.length > 0 ? (
                      sessionHistory.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center bg-black border border-gray rounded-lg px-4 py-4 hover:bg-gray transition"
                        >
                          {/* Date */}
                          <div className="flex-1 text-secondary text-sm">
                            {Moment(item.createdDate).format(
                              "DD.MM.YYYY hh:mm a",
                            )}
                          </div>

                          {/* IP Address */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {item.ipAddress}
                          </div>

                          {/* Device */}
                          <div className="flex-1 text-center text-secondary text-sm">
                            {item.platform}
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
                  {sessionHistory.length > 0 && (
                    <div className="flex justify-center mt-6">
                      <Stack spacing={2}>
                        <Pagination
                          count={Math.ceil(logintotalpage / loginrecordpage)}
                          page={logincurrentpage}
                          onChange={handlepagelogin}
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

export default LoginTable;
