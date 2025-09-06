import React, { useEffect } from "react";
import Header from "./Header";
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
import moment from "moment";
import { t } from "i18next";

const StakingTable = () => {
  const [stakestage, setstakestage] = useState("flexible");

  const [stakeHistory, setstakeHistory, stakeHistoryref] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    getStakingHistory(1);
  }, [0]);

  const [historyLoader, sethistoryLoader] = useState(false);

  const getStakingHistory = async (page) => {
    try {
      console.log("[[", page);
      sethistoryLoader(true);
      var data = {
        apiUrl: apiService.getAllstakingHistory,
        payload: { FilPerpage: 5, FilPage: page },
      };
      var resp = await postMethod(data);
      sethistoryLoader(false);
      if (resp.status) {
        console.log("[]]");
        console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
        setstakeHistory(resp.data);
        settotal(resp.total);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const claimNow = async (claimData) => {
    console.log("0998098908908");
    try {
      var obj = {
        _id: claimData._id,
      };
      var data = {
        apiUrl: apiService.claimNowapi,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getStakingHistory(1);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const claimNowFlexible = async (claimData) => {
    try {
      var obj = {
        _id: claimData._id,
      };
      var data = {
        apiUrl: apiService.claimNowapiFlexible,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getStakingHistory(1);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      // toast.error("Please try again later");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(5);
  const recordPerPage = 5;
  const pageRange = 5;

  const handlePageChange = (event, pageNumber) => {
    console.log("=====");
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getStakingHistory(pageNumber);
  };

  return (
    <>
      <section>
        <Header />
      </section>
      {historyLoader == true ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#ffc630"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <main className="dashboard_main">
          <div className="container-lg">
            <div className="row">
              <div className="col-lg-2">
                <Side_bar />
              </div>

              <div className="col-lg-10">
                <section className="asset_section">
                  <div className="row">
                    <div className="buy_head">
                      <div className="Buycrypto_title">{t("history")}</div>
                      <ul className="history-lists">
                        <Link to="/loginHistory" className="history-links">
                          {t("login")}
                        </Link>
                        <Link to="/referralHistory" className="history-links">
                          {t("referral")}
                        </Link>
                        <Link to="/depositHistory" className="history-links">
                          {t("deposit")}
                        </Link>
                        <Link to="/withdrawHistory" className="history-links">
                          {t("withdraw")}
                        </Link>
                        <Link
                          to="/internaltransferhistory"
                          className="history-links"
                        >
                          {t("internal_transfer")}
                        </Link>
                        <Link to="/swapHistory" className="history-links">
                          {t("convert")}
                        </Link>
                        <Link
                          to="/stakingHistory"
                          className="history-links active"
                        >
                          {t("staking")}
                        </Link>
                        <Link to="/orderHistory" className="history-links">
                          {t("openOrder")}
                        </Link>
                        <Link
                          to="/cancelorderHistory"
                          className="history-links"
                        >
                          {t("closeOrder")}
                        </Link>
                        <Link to="/tradeHistory" className="history-links">
                          {t("trade")}
                        </Link>
                        <Link to="/rewardsHistory" className="history-links">
                          {t("rewards")}
                        </Link>
                         <Link to="/notificationHistory" className="history-links">
                          {t('notification')}
                        </Link>

                        {/* <Link to="/stoporderHistory" className="history-links">
                          Stop Order
                        </Link> */}
                      </ul>
                      {/* <AssetListTable /> */}
                      {/* <HistoryListTable /> */}

                      <div className="table-responsive table-cont">
                        <table className="table">
                          <thead>
                            <tr className="stake-head">
                              <th>{t("package")}</th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("totalAmount")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("APY/APR")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("type")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("interestCycle")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("stakeDate")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("stakeEndDate")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("nextClaimDate")}
                              </th>
                              <th className="opt-nowrap txt-center pad-left-23">
                                {t("totalInterest")}
                              </th>
                              <th className="opt-btn-flex table-action text-center">
                                {t("action")}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {stakeHistoryref.current &&
                            stakeHistoryref.current?.length > 0 ? (
                              stakeHistoryref.current.map((item, i) => {
                                var get_time = new Date(item.date).getTime();
                                var interest_cycle =
                                  item.type == "fixed" ? item.stakingPlan : "";

                                var added_date =
                                  get_time +
                                  +interest_cycle * 24 * 60 * 60 * 1000;

                                var claim_date = "";
                                if (item.type == "fixed") {
                                  claim_date = item.endDate;
                                } else {
                                  claim_date = "-";
                                }

                                claim_date =
                                  moment(claim_date).format("DD/MM/YYYY");
                                return (
                                  <tr>
                                    <td className="opt-percent font_14 pad-left-23">
                                      <img
                                        src={item.currencyImage}
                                        width="24px"
                                        style={{
                                          marginRight: "6px",
                                          marginBottom: "2px",
                                        }}
                                      />
                                      {item.stakeCurrencsymbol}
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23">
                                      {item.stakeAmont}{" "}
                                      {item.stakeCurrencsymbol}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.currentAPY}%
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.type}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.type == "fixed"
                                        ? item.stakingPlan + " days"
                                        : "-"}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {moment(item.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.type == "fixed"
                                        ? moment(item.endDate).format(
                                            "DD/MM/YYYY"
                                          )
                                        : "-"}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.type == "fixed"
                                        ? moment(item.endDate).format(
                                            "DD/MM/YYYY"
                                          )
                                        : "-"}
                                    </td>
                                    <td className="opt-term font_14 table_center_text pad-left-23">
                                      {item.type == "fixed" ? (
                                        <p>
                                          {parseFloat(
                                            item.totalInterest
                                          ).toFixed(6)}{" "}
                                          {item.stakeCurrencsymbol}
                                        </p>
                                      ) : (
                                        <p>
                                          {parseFloat(
                                            item.totalInterest
                                          ).toFixed(6)}{" "}
                                          {item.stakeCurrencsymbol}
                                        </p>
                                      )}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23">
                                      {item.type == "fixed" ? (
                                        <div className="minimum">
                                          {item.status == 1 ? (
                                            <button
                                              className="active"
                                              onClick={() => claimNow(item)}
                                            >
                                              {t("claimNow")}
                                            </button>
                                          ) : item.status == 0 ? (
                                            <button className="notactive">
                                              {t("claim")}
                                            </button>
                                          ) : (
                                            <button className="notactive">
                                              {" "}
                                              {t("claimed")}
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="minimum">
                                          {item.status == 0 ? (
                                            <button
                                              className="active"
                                              onClick={() =>
                                                claimNowFlexible(item)
                                              }
                                            >
                                              {t("claimNow")}
                                            </button>
                                          ) : (
                                            <button className="notactive">
                                              {t("claimed")}
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={10} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                      />
                                    </div>
                                    <div className="no_records_text">
                                      {t("noRecordsFound")}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>

                        {stakeHistoryref.current &&
                        stakeHistoryref.current.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(total / recordPerPage)}
                                page={currentPage}
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
                                    backgroundColor: "#ffc630 !important", // Background color for selected item
                                    color: "#000", // Text color for selected item
                                    "&:hover": {
                                      backgroundColor: "#ffc630",
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
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default StakingTable;
