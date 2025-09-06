import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData4";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneInput from "react-phone-input-2";
import { Dropdown } from "semantic-ui-react";
import "react-phone-input-2/lib/style.css";
import Side_bar from "./Side_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import moment from "moment";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Dashboard = () => {
  const value = {
    Subject: "",
    Category: "Choose Category",
    text: "",
  };
  const { t } = useTranslation();

  const [Formdata, setFormdata] = useState(value);

  const [SubjectErr, setSubjectErr] = useState(value);
  const [CategoryErr, setCategoryErr] = useState(value);
  const [textErr, settextErr] = useState(value);
  const [siteLoader, setSiteLoader] = useState(false);

  const [formErr, setformErr] = useState("");

  const [user, setuser] = useState([]);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [closebuttonLoader, setClosebuttonLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalpages] = useState(0);
  const [supportCategories, setCategories] = useState([]);
  const [viewChat, setViewChat] = useState(false);
  const [replyMess, replyMessage, replyMessref] = useState("");
  const [chatDatas, setChatDatas] = useState("");
  const [chatHistory, setchatHistory] = useState([]);

  const { Subject, Category, text } = Formdata;
  const [updateField, setUpdateField] = useState("");
  const [open, setOpen] = useState(false);
  const [supportdata, setsupportdata, supportdataref] = useState("");

  // const getItem = (e) => {
  //   var { name, value } = e.target;
  //   if (name === "Category") {
  //     setUpdateField("category");
  //   }
  //   const sanitizedValue = name === "Subject" ? value.replace(/\s/g, "") : value;
  //   let check = { ...Formdata, ...{ [name]: sanitizedValue } };
  //   setFormdata(check);
  //   validate(check);
  // };
  const getItem = (e) => {
    let { name, value } = e.target;
    if (name === "Subject" || name === "text") {
      value = value.replace(/^\s+/, "");
    }
    if (name === "Category") {
      setUpdateField("category");
    }
    let check = { ...Formdata, [name]: value };
    setFormdata(check);
    validate(check);
  };

  const [skipCount, setSkipCount] = useState(true);

  useEffect(() => {
    console.log("use effect running");
    if (skipCount) setSkipCount(false);
    if (!skipCount) {
      validate(Formdata);
    }
  }, [updateField]);

  const recordPerPage = 5;
  const totalRecords = 15;
  const pageRange = 5;

  useEffect(() => {
    viewData(1);
    getCategory();
  }, [0]);
  const checkKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      reply();
    }
  };

  const validate = async (condition) => {
    var error = {};
    console.log({ Subject });
    if (condition.Subject == "") {
      error.Subject = t("subjectIsReqField");
      setSubjectErr(true);
    } else if (condition.Subject?.length < 5) {
      error.Subject = t("min5CharOnlyAllowed");
      setSubjectErr(true);
    } else if (condition.Subject?.length > 50) {
      error.Subject = t("max50CharOnlyAllowed");
      setSubjectErr(true);
    } else if (condition.Category === "Choose Category") {
      setSubjectErr(false);
      error.Category = t("categoryIsReqField");
      setCategoryErr(true);
    } else if (condition.text == "") {
      setCategoryErr(false);
      error.text = t("messageIsReqField");
      settextErr(true);
    } else if (condition.text?.length < 3) {
      error.text = t("min3CharOnlyAllowed");
      settextErr(true);
    } else if (condition.text?.length > 250) {
      error.text = t("max250CharOnlyAllowed");
      settextErr(true);
    } else {
      settextErr(false);
    }
    setformErr(error);
  };

  const submit = async () => {
    validate(Formdata);
    // return false;
    if (
      Formdata.Subject != "" &&
      Formdata.Subject.length > 5 &&
      Formdata.Subject.length <= 50 &&
      Formdata.Category != "Choose Category" &&
      Formdata.text != "" &&
      Formdata.text.length > 3 &&
      Formdata.text.length <= 250
    ) {
      var data = {
        apiUrl: apiService.createdSupport,
        payload: Formdata,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      toast.success(resp.Message);
      const obj = {
        Subject: "",
        Category: "",
        text: "",
      };
      setFormdata(obj);
      viewData();
    } else {
      //toast.error("All are required fields");
    }
  };
  const viewData = async (page) => {
    try {
      // var obj = {
      //   perpage: recordPerPage,
      //   page: currentPage,
      // };
      var api = {
        apiUrl: apiService.findedSupport,
        payload: { perpage: 5, page: page ? page : 1 },
      };
      setSiteLoader(true);
      var view = await postMethod(api);
      console.log(view, "=-=-view=-=-=-");
      setSiteLoader(false);
      if (view.status) {
        setuser(view.data.data);
        setTotalpages(view.data.total);
        console.log(view.data.total);
      }
    } catch (error) {}
  };

  const getCategory = async () => {
    try {
      var api = {
        apiUrl: apiService.supportCategories,
      };
      var response = await getMethod(api);
      console.log(response, "=-==-response=-=");
      if (response.status) {
        setCategories(response.data);
      }
    } catch (error) {}
  };

  const userChat = async (data) => {
    try {
      console.log("=-=-==data=--=-=", data);
      setChatDatas(data);
      setViewChat(true);
      var obj = {
        _id: data._id,
      };
      var api = {
        apiUrl: apiService.getSupportDetails,
        payload: obj,
      };
      var view = await postMethod(api);
      if (view) {
        setchatHistory(view.Message.reply);
      } else {
        setchatHistory([]);
      }
      console.log(view, "=-=-view=-=-=-view=-=-=-view=-=");
      console.log(view.data.total);
    } catch (error) {}
  };
  const closeTicket = async (data) => {
    console.log("data-->>clicks", data);
    try {
      var obj = {
        _id: data._id,
        tag: "user",
      };
      var api = {
        apiUrl: apiService.ticket_close,
        payload: obj,
      };
      setClosebuttonLoader(true);
      var view = await postMethod(api);
      console.log("view --->>>", view);
      if (view) {
        // userChat(chatDatas);
        setClosebuttonLoader(false);
        viewData(1);
        handleClose();
        toast.success(view.Message);
      } else {
        setClosebuttonLoader(false);
        toast.error(view.Message);
      }
    } catch (error) {}
  };

  const reply = async () => {
    try {
      if (Object.keys(replyMessref.current).length > 0) {
        var obj = {
          message: replyMessref.current,
          chatId: chatDatas._id,
          tag: "user",
          image: "",
          status: "0",
        };
        var api = {
          apiUrl: apiService.addUserSupport,
          payload: obj,
        };
        var view = await postMethod(api);
        if (view) {
          console.log("**********");
          userChat(chatDatas);
          replyMessage("");
          toast.success(view.Message);
        }
      } else {
        toast.error("Please enter the message!");
      }
    } catch (error) {}
  };

  const categoryOptions = supportCategories.map((item, i) => ({
    key: i,
    text: item.category,
    value: item.category,
  }));

  const handlePageChange = (e, pageNumber) => {
    // console.log("pageNumber->>",pageNumber);
    viewData(pageNumber);
    setCurrentPage(pageNumber);
  };

  const handleOpen = (data) => {
    setOpen(true);
    setsupportdata(data ? data : "");
    console.log("data-->>", data);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <section>
        <Header />
      </section>

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
        <>
          <main className="dashboard_main">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-2 padlef_0_col">
                  <Side_bar />
                </div>

                <div className="col-lg-10 padin_lefrig_dash">
                  <section className="asset_section">
                    <div className="row">
                      <div className="withdraw_title_content">
                        <div className="withdraw_title">{t("support")}</div>
                      </div>
                      <div className="col-lg-7">
                        <div className="deposit support-deposit mt-5">
                          <div className="form_div support-form-div">
                            <div className="sides">
                              <div className="w-100 rights">
                                <h4>
                                  {" "}
                                  <span className="support-category-span">
                                    1
                                  </span>{" "}
                                  {t("subject")}{" "}
                                </h4>
                                <input
                                  type="text"
                                  name="Subject"
                                  maxLength={50}
                                  value={Subject}
                                  onChange={getItem}
                                  placeholder={t("enterTheSubject")}
                                  fluid
                                  className="dep-drops"
                                />
                                {SubjectErr == true ? (
                                  <span
                                    className="errorcss"
                                    style={{ textAlign: "left" }}
                                  >
                                    {formErr.Subject}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="form_div support-form-div">
                            <h4>
                              {" "}
                              <span className="support-category-span">
                                2
                              </span>{" "}
                              {t("selectategory")}
                            </h4>
                            {/* <select
                          className="dep-drops"
                          name="Category"
                          value={Category}
                          onChange={getItem}
                        >
                          <option selected disabled>
                            Choose Category
                          </option>
                          {supportCategories.length > 0 ? (
                            supportCategories.map((item, i) => (
                              <option className="support_select" selected>
                                {item.category}
                              </option>
                            ))
                          ) : (
                            <option selected>Choose Category</option>
                          )}
                        </select> */}

                            <Dropdown
                              placeholder={t("chooseCategory")}
                              fluid
                              selection
                              options={categoryOptions}
                              value={Category}
                              onChange={(e, { value }) =>
                                getItem({ target: { name: "Category", value } })
                              }
                              className="dep-drops"
                            />

                            {/* <Dropdown
                          placeholder="Select Coin"
                          fluid
                          className="dep-drops"
                          selection
                          options={fromCurrencyRef.current}
                          onChange={(o) =>
                            onSelect(o, "fromTab")
                          }
                          onChange={handleOnChange_from}
                        /> */}
                            {CategoryErr == true ? (
                              <span
                                className="errorcss"
                                style={{ textAlign: "left" }}
                              >
                                {formErr.Category}
                              </span>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="form_div boder-none  support-form-div">
                            <h4>
                              {" "}
                              <span className="support-category-span">
                                3
                              </span>{" "}
                              {t("message")}
                            </h4>

                            <textarea
                              maxLength="250"
                              name="text"
                              value={text}
                              onChange={getItem}
                              placeholder={t("enterTheMessage")}
                              fluid
                              rows="5"
                              className="dep-drops support_textarea"
                            />
                            {textErr == true ? (
                              <span
                                className="errorcss"
                                style={{ textAlign: "left" }}
                              >
                                {formErr.text}{" "}
                              </span>
                            ) : (
                              ""
                            )}
                            <div className="sumbit_btn">
                              {buttonLoader == false ? (
                                <button onClick={submit}>{t("submit")}</button>
                              ) : (
                                <button>{t("loading")} ...</button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* faq */}
                      <div className="col-lg-5">
                        <div>
                          <div className="container-lg">
                            <div
                              class="accordion accordion-flush"
                              id="accordionFlushExample"
                            >
                              <div className="faq mt-5">
                                <h5 className="faq-title">{t("FAQ")}</h5>
                                <div class="accordion-item ">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingOne"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseOne"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseOne"
                                    >
                                      1. {t("howcanIrecover")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseOne"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingOne"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("usetheForgotassword")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item ">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingTwo"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseTwo"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseTwo"
                                    >
                                      2. {t("whatshouldIdo")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseTwo"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingTwo"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("immediatelychange")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item ">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingThree"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseThree"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseThree"
                                    >
                                      3. {t("howdoIreportaproblem")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseThree"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("gototheTransaction")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item ">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingFour"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseFour"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseFour"
                                    >
                                      4. {t("whatarethewithdrawal")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseFour"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingFour"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("withdrawallimits")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item ">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingFive"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseFive"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseFive"
                                    >
                                      5. {t("howdoIdeposit")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseFive"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingFive"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("useastrongunique")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard_table">
                      <div className="staking-flex dash_assets">
                        <h5 className="opt-title">{t("supportHistory")}</h5>
                        <div className="d-flex gap-2 text-yellow">
                          {/* View <i class="fa-solid fa-chevron-right"></i> */}
                        </div>
                      </div>
                      <div className="table-responsive table-cont dash_table_content support-his-table">
                        <table className="table ">
                          <thead>
                            <tr className="stake-head">
                              <th>{t("ticketID")}</th>
                              <th className="table_center_text">
                                {t("subject")}
                              </th>
                              <th className="table_center_text">
                                {t("message")}
                              </th>
                              <th className="table_center_text">
                                {t("category")}
                              </th>
                              <th className="table_center_text ">
                                {t("dateTime")}
                              </th>
                              <th className="table_center_text mar-ryt">
                                {t("moreDetails")}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {user.length > 0 ? (
                              user.map((data, i) => (
                                <tr>
                                  <td className="opt-term">
                                    #{data._id.substring(0, 8)}
                                  </td>
                                  <td className="opt-term font_14 table_center_text">
                                    {data.subject.length > 10
                                      ? data.subject.substring(0, 10)
                                      : data.subject.substring(0, 5)}
                                    ...
                                  </td>
                                  <td className="opt-term font_14 table_center_text table_icon">
                                    {data.message > 10
                                      ? data.message.substring(0, 10)
                                      : data.message.substring(0, 5)}
                                    ...
                                  </td>
                                  <td className="opt-term font_14 table_center_text">
                                    {data.category}
                                  </td>
                                  <td className="opt-term  table_center_text">
                                    <div className="opt-action-normal">
                                      {moment(data.updated_at).format("lll")}
                                    </div>
                                  </td>
                                  <td
                                    className="table_center_text  text-white"
                                    onClick={() => handleOpen(data)}
                                  >
                                    <button class="action_btn">
                                      {t("view")}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                        alt=""
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

                        {user.length > 0 ? (
                          <div className="pagination">
                            <Stack spacing={2}>
                              <Pagination
                                count={Math.ceil(totalPage / recordPerPage)}
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
                                    backgroundColor: "#bd7f10 !important", // Background color for selected item
                                    color: "#000", // Text color for selected item
                                    "&:hover": {
                                      backgroundColor: "#bd7f10",
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
                  </section>
                </div>
              </div>
            </div>
          </main>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className="modals_support">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 support-modal">
                    <div>
                      <div className="support-left-flex">
                        <h5 className="support-modal-title">{t("details")}</h5>

                        <i
                          className="fa-regular fa-circle-xmark cross_circle"
                          onClick={handleClose}
                        ></i>
                      </div>
                      <div className="">
                        <div className="support-modal-top">
                          <h6 className="">{t("ticketID")}</h6>
                          <p className="">
                            #
                            {supportdataref.current
                              ? supportdataref.current._id.substring(0, 8)
                              : ""}
                          </p>
                        </div>
                        <div className="support-modal-top">
                          <h6 className="">{t("subject")}</h6>
                          <p className="">
                            {supportdataref.current
                              ? supportdataref.current.subject
                              : ""}
                          </p>
                        </div>
                        <div className="support-modal-top">
                          <h6 className="">{t("message")}</h6>
                          <p>
                            {supportdataref.current
                              ? supportdataref.current.message
                              : ""}
                          </p>
                        </div>
                        <div className="support-modal-top">
                          <h6 className="">{t("category")}</h6>
                          <p className="">
                            {supportdataref.current
                              ? supportdataref.current.category
                              : ""}
                          </p>
                        </div>
                        <div className="support-modal-top">
                          <h6 className="">{t("dateTime")}</h6>
                          <p className="">
                            {supportdataref.current
                              ? moment(
                                  supportdataref.current.updated_at
                                ).format("lll")
                              : ""}
                          </p>
                        </div>
                        <div className="support-modal-top d-flex justify-content-center w-100">
                          {closebuttonLoader == false ? (
                            <>
                              {supportdataref.current.status == 0 ? (
                                <button
                                  class="action_btn"
                                  onClick={() =>
                                    closeTicket(supportdataref.current)
                                  }
                                >
                                  {t("close")}
                                </button>
                              ) : (
                                <button class="action_btn_closed">
                                  {t("closed")}
                                </button>
                              )}
                            </>
                          ) : (
                            <button class="action_btn">
                              {t("loading")}...
                            </button>
                          )}
                        </div>
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

export default Dashboard;
