import React, { useEffect } from "react";
import { stakeHistory } from "../utils/mockData";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import moment from "moment";
import { Box, Modal } from "@material-ui/core";
import { t } from "i18next";

const StakeHisTable = () => {
  const [stakeHistory, setstakeHistory, stakeHistoryref] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);
  const [choosingtype, setchoosingtype] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [popdata, setpopdata] = useState(false);

  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      getStakingHistory(1);
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, [0]);

  const [historyLoader, sethistoryLoader] = useState(false);

  const chooseHistory = async (value, page) => {
    if (loginStatus == false) {
      return;
    } else {
      setchoosingtype(value);
      if (value === "fixed") {
        sethistoryLoader(true);
        var data = {
          apiUrl: apiService.getFixedstakingHistory,
          payload: { FilPerpage: 5, FilPage: page, type: value },
        };
        var resp = await postMethod(data);
        sethistoryLoader(false);

        if (resp.status) {
          // console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
          setstakeHistory(resp.data);
          settotal(resp.total);
        }
      } else {
        sethistoryLoader(true);
        var data = {
          apiUrl: apiService.getFlexiblestakingHistory,
          payload: { FilPerpage: 5, FilPage: page, type: value },
        };
        var resp = await postMethod(data);
        sethistoryLoader(false);
        if (resp.status) {
          // console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
          setstakeHistory(resp.data);
          settotal(resp.total);
        }
      }
    }
  };

  const getStakingHistory = async (page) => {
    try {
      sethistoryLoader(true);
      var data = {
        apiUrl: apiService.getAllstakingHistory,
        payload: { FilPerpage: 5, FilPage: page },
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      sethistoryLoader(false);

      if (resp.status) {
        // console.log(resp.data, "=-=-resp-=-=-=resp-=-resp.data");
        setstakeHistory(resp.data);
        settotal(resp.total);
      }
    } catch (error) {
      // showerrorToast("Please try again later");
    }
  };

  const claimNow = async (claimData) => {
    // console.log("0998098908908");
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
        showsuccessToast(resp.Message);
        getStakingHistory(1);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      // showerrorToast("Please try again later");
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
        showsuccessToast(resp.Message);
        getStakingHistory(1);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      // showerrorToast("Please try again later");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [total, settotal] = useState(5);
  const recordPerPage = 5;

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    if (!!choosingtype) {
      chooseHistory(choosingtype, pageNumber);
    } else {
      getStakingHistory(pageNumber);
    }
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  const historyOptions = [
    { key: "all", text: "All", value: "" },
    { key: "fixed", text: "Fixed", value: "fixed" },
    { key: "flexible", text: "Flexible", value: "flexible" },
  ];

  const handleOpen = (data) => {
    console.log("data->>>>>>", data);
    setOpen(true);

    function getDurationBetweenDates(date1, date2) {
      console.log(date1, "<<--date1,date2-->>", date2);
      const diffMs = new Date(date2) - new Date(date1);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    }

    const currentDate = new Date(); // Get the current date/time
    if (data.type === "fixed") {
      // Calculate the duration between start and end date
      const duration = getDurationBetweenDates(currentDate, data.endDate);

      var obj = {
        stakeCurrencsymbol: data.stakeCurrencsymbol,
        totalInterest: data.totalInterest,
        popdata: data.popdata,
        type: data.type,
        endDate: moment(data.endDate).format("DD/MM/YYYY hh:mm:ss"),
        // duration :`${duration.days} days, ${duration.hours} hours, ${duration.minutes} minutes`
        duration: `${duration.days} days`,
      };
      setpopdata(obj);
    } else if (data.type === "flexible") {
      // Calculate the duration between start and current date
      const duration = getDurationBetweenDates(data.startDate, currentDate);
      var stakeEndDate = new Date(data.startDate).getTime();
      var nextDay = +stakeEndDate + 1000 * 60 * 60 * 24;
      const date = new Date(nextDay); // Convert to a Date object
      var obj = {
        stakeCurrencsymbol: data.stakeCurrencsymbol,
        totalInterest: data.totalInterest,
        type: data.type,
        endDate: moment(nextDay).format("DD/MM/YYYY hh:mm:ss"),
        duration: `${duration.days} days`,
      };
      setpopdata(obj);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {siteLoader == true ? (
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
        <>
          <div className="staking-flex">
            {/* <select
              name=""
              id=""
              className="opt-select"
              onClick={(e) => chooseHistory(e.target.value, "1")}
            >
              <option value="" selected disabled>
                All
              </option>
              <option value="fixed">Fixed</option>
              <option value="flexible">Flexible</option>
            </select> */}

            <Dropdown
              placeholder="All"
              fluid
              selection
              options={historyOptions}
              onChange={(e, { value }) => chooseHistory(value, "1")}
              className="opt-select-stakeoptions"
            />

            <Link to="/stakingHistory">
              <div className="d-flex gap-2 text-yellow">
                {t("viewAll")} <i class="fa-solid fa-chevron-right"></i>
              </div>
            </Link>
          </div>
          <div className="table-responsive table-cont">
            <table className="table">
              <thead>
                <tr className="stake-head font-satoshi">
                  <th>{t("package")}</th>
                  <th className="pad-left-23 txt-center">{t("totalAmount")}</th>
                  <th className="pad-left-23 txt-center">{t("APY/APR")}</th>
                  <th className="pad-left-23 txt-center">{t("type")}</th>
                  {/* {choosingtype == "fixed" && */}
                  <th className="pad-left-23 txt-center opt-nowrap">
                    {" "}
                    {t("interestCycle")}
                  </th>
                  {/* } */}
                  <th className="pad-left-23 txt-center opt-nowrap">
                    {t("stakeDate")}
                  </th>
                  {/* {choosingtype == "fixed" && */}
                  <th className="pad-left-23 txt-center opt-nowrap">
                    {t("stakeEndDate")}
                  </th>
                  <th className="pad-left-23 txt-center opt-nowrap">
                    {t("totalInterest")}
                  </th>
                  <th className="opt-nowrap table-action pad-left-23 pad-rght-tab">
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
                      get_time + +interest_cycle * 24 * 60 * 60 * 1000;

                    var claim_date = "";
                    if (item.type == "fixed") {
                      claim_date = item.endDate;
                    } else {
                      claim_date = "-";
                    }
                    var currentDate = new Date().getTime();
                    var stakeEndDate = new Date(item.startDate).getTime();
                    var nextDay = +stakeEndDate + 1000 * 60 * 60 * 24;
                    claim_date = moment(claim_date).format("DD/MM/YYYY");
                    var cliii = "";
                    if (+nextDay < +currentDate) {
                      var cliii = "fasle";
                    } else {
                      var cliii = "true";
                    }
                    return (
                      <tr>
                        <td className="opt-percent font-satoshi font_14 px-2 pad-top-14px">
                          <div className="d-flex gap-1">
                            <img src={item.currencyImage} width="30px" />{" "}
                            {item.stakeCurrencsymbol}
                          </div>
                        </td>
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          {item.stakeAmont} {item.stakeCurrencsymbol}
                        </td>
                        <td className=" opt-percent font-satoshi font_14 table_center_text pad-left-23">
                          {item.currentAPY}%
                        </td>
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          {item.type}
                        </td>
                        {/* {item.type == "fixed" && */}
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          {item.type == "fixed"
                            ? item.stakingPlan + " days"
                            : "-"}
                        </td>
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          {moment(item.startDate).format("DD/MM/YYYY")}
                        </td>
                        {/* {item.type == "fixed" && */}
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          {item.type == "fixed"
                            ? moment(item.endDate).format("DD/MM/YYYY")
                            : "-"}
                        </td>
                        <td className="opt-term font-satoshi font_14 table_center_text pad-left-23">
                          <div className="minimum">
                            {item.type == "fixed" ? (
                              <p>
                                {parseFloat(item.totalInterest).toFixed(6)}{" "}
                                {item.stakeCurrencsymbol}
                              </p>
                            ) : (
                              <p>
                                {parseFloat(item.totalInterest).toFixed(6)}{" "}
                                {item.stakeCurrencsymbol}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="opt-btn-flex table_action pad-left-23">
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
                                <button
                                  className="notactive"
                                  onClick={() => handleOpen(item)}
                                >
                                  {" "}
                                  {t("claim")}{" "}
                                </button>
                              ) : (
                                <button
                                  className="notactive"
                                  style={{ cursor: "not-allowed" }}
                                >
                                  {" "}
                                  {t("claimed")}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="minimum">
                              {item.status === 0 && cliii === "false" ? (
                                <button
                                  className="active"
                                  onClick={() => claimNowFlexible(item)}
                                >
                                  {t("claimNow")}
                                </button>
                              ) : item.status === 0 && cliii === "true" ? (
                                <button
                                  className="notactive"
                                  onClick={() => handleOpen(item)}
                                >
                                  {t("claim")}{" "}
                                </button>
                              ) : (
                                <button
                                  className="notactive"
                                  style={{ cursor: "not-allowed" }}
                                >
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
                    <td colSpan={9} className="text-center py-5">
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
            {stakeHistoryref.current && stakeHistoryref.current.length > 0 ? (
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
                    //       previous: ArrowBackIcon,
                    //       next: ArrowForwardIcon,
                    //     }}
                    //     {...item}
                    //   />
                    // )}slots={{
                    //
                  />
                </Stack>
              </div>
            ) : (
              ""
            )}
          </div>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="email-popup-modal-title"
            aria-describedby="email-popup-modal-description"
          >
            <Box>
              <div className="email-popup-card stake-claim-popup">
                <div className="email-pop-icon">
                  <span onClick={handleClose}>
                    <i class="fa-regular fa-circle-xmark"></i>
                  </span>
                </div>

                <div className="row justify-content-center cards mt-2">
                  <div className="col-lg-12">
                    <div className="text-center">
                      <span class="heading stake_new_hea">
                        {t("stakingNotification")}
                      </span>
                    </div>

                    <div className="notify">
                      {" "}
                      {t("rewardFromStakingCanOnlyBe")}
                    </div>

                    <div className="stak_pop_new">
                      <div className="stak_pop_new_inn">
                        <span className="stake-pop-left">
                          {t("currencyName")}
                        </span>
                        <span className="stake-pop-right">
                          {popdata.stakeCurrencsymbol}
                        </span>
                      </div>
                      <div className="stak_pop_new_inn">
                        <span className="stake-pop-left">{t("reward")}</span>
                        <span className="stake-pop-right">
                          {popdata.totalInterest
                            ? popdata.totalInterest.toFixed(8)
                            : 0.0}
                        </span>
                      </div>
                      <div className="stak_pop_new_inn">
                        <span className="stake-pop-left">
                          {t("stakingPeriod")}
                        </span>
                        <span className="stake-pop-right">
                          {popdata.duration}
                        </span>
                      </div>
                      <div className="stak_pop_new_inn">
                        <span className="stake-pop-left">
                          {t("stakingPeriodEndDate")}
                        </span>
                        <span className="stake-pop-right">
                          {popdata.endDate ? popdata.endDate : popdata.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default StakeHisTable;
