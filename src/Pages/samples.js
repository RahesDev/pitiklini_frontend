import React, { useEffect } from "react";
import useState from "react-usestateref";
import Header from "../../Newcomponent/Header";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../../../core/service/detail";
import { getMethod, postMethod } from "../../../core/service/common.api";
import Footernew from "../../footer_buttom";
import { Grid, Paper, Container } from "@mui/material";
import { setAuthorization } from "../../../core/service/axios";
import { Button } from "semantic-ui-react";
import { Dropdown } from "semantic-ui-react";
import { socket } from "../../context/socket";
import Countdown from "react-countdown";
import Moment from "moment";

function Home() {
  const friendOptions = [
    {
      key: "Jenny Hess",
      text: "Jenny Hess",
      value: "Jenny Hess",
    },
    {
      key: "Elliot Fu",
      text: "Elliot Fu",
      value: "Elliot Fu",
    },
    {
      key: "Stevie Feliciano",
      text: "Stevie Feliciano",
      value: "Stevie Feliciano",
    },
    {
      key: "Christian",
      text: "Christian",
      value: "Christian",
    },
    {
      key: "Matt",
      text: "Matt",
      value: "Matt",
    },
    {
      key: "Justen Kitsune",
      text: "Justen Kitsune",
      value: "Justen Kitsune",
    },
  ];

  const initialFormValue = {
    message: "",
    file: "",
    type: "",
    orderId: "",
    p2porderId: "",
  };

  const p2pFormValue = {
    qty: "",
    total: "",
  };

  const [p2pData, setp2pData, p2pDataref] = useState("");
  const [orderType, setorderType, orderTyperef] = useState("");
  const [p2pdate, setp2pDate, p2pdateref] = useState("");
  const [profileData, setprofileData, profileDataref] = useState(null);
  const [profileStatus, setprofileStatus, profileStatusref] = useState(false);
  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const [p2pfile, setp2pfile, p2pfileref] = useState("");
  const [chatloading, setchatloading] = useState(false);
  const { message, file, type, orderId, p2porderId } = formValue;
  const [p2pchat, setp2pchat, p2pchatref] = useState("");
  const [interval, setintervalchat, intervalref] = useState("");
  const [runningTimer, setRunningTimer] = useState(false);
  const [bankData, setbankData, bankDataref] = useState("");
  const [socket_token, set_socket_token, socketref] = useState("");
  const [notifyp2pData, setnotifyp2pData, notifyp2pDataref] = useState("");
  const [p2pformValue, setp2pFormValue, p2pformValueref] =
    useState(p2pFormValue);
  const [notifymessage, setnotifymessage, notifymessageref] = useState("");
  const [confirmp2pcheck, setconfirmp2pcheck, confirmp2pcheckref] = useState(
    []
  );
  const { qty, total } = p2pformValue;
  const [p2pbalance, setp2pbalance, p2pbalanceref] = useState("");
  const [disputefile, setdisputefile, disputefileref] = useState("");
  const [disputequery, setdisputequery, disputequeryref] = useState("");
  const [confirmp2porder, setconfirmp2porder, confirmp2porderref] =
    useState("");
  const [p2pbankcheck, setp2pbankcheck, p2pbankcheckref] = useState(false);
  const [p2pbankData, setp2pbankData, p2pbankDataref] = useState("");
  const [Timer, setTimer, Timerref] = useState("");
  const [Timerstatus, setTimerstatus, Timerstatusref] = useState("deactive");

  const [sellTimer, setsellTimer, sellTimerref] = useState("");
  const [sellTimerstatus, setsellTimerstatus, sellTimerstatusref] =
    useState("deactive");
  const [payTime, setpayTime, payTimeref] = useState("15");
  const [p2pRating, setp2pRating, p2pRatingref] = useState(0);
  const [p2pOrdercount, setp2pOrdercount, p2pOrdercountref] = useState(0);
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let socket_token = localStorage.getItem("socket_token");
    let socketsplit = socket_token.split("_");
    socket.connect();
    getProfile();
    //getp2pconfirmOrder();
    //getconfirmOrder();

    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      if (res.Reason == "p2pchat") {
        getp2pChat();
      } else if (res.Reason == "notify") {
        setnotifymessage(res.Message);
        toast.success(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        //getp2pconfirmOrder();
        getconfirmOrder();
      } else if (res.Reason == "ordercancel") {
        setnotifymessage(res.Message);
        toast.success(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        //getp2pconfirmOrder();
        getconfirmOrder();
      }
    });
  }, [0]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  const closePopup = async () => { };

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      console.log("userprofile data===", resp);
      if (resp.status) {
        if (resp.data != null) {
          setprofileData(resp.data);
          setprofileStatus(true);
          console.log("profiledata===", profileStatusref.current);
          if (profileStatusref.current != null) {
            getp2pOrder();
            getp2pChat();
          }
        }
      }
    } catch (error) { }
  };

  const getp2pOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.getp2pOrder,
      payload: onj,
    };
    setloader(true);
    var resp = await postMethod(data);
    setloader(false);
    console.log(resp.bank, "-=-=-resp=-=-");
    //console.log("profileDataref.current._id====",profileDataref.current._id.toString());
    //  console.log("resp.Message.userId.toString()====",resp.Message.userId.toString());
    if (resp) {
      var data = resp.Message;
      setp2pData(resp.Message);
      setp2pbalance(resp.p2pbalance);
      let paymentTime =
        resp.Message.pay_time != null && resp.Message.pay_time != ""
          ? resp.Message.pay_time
          : "15";
      setpayTime(paymentTime);
      if (resp.bank) {
        setbankData(resp.bank);
      }
      if (profileDataref.current != null) {
        if (resp.Message.orderType == "buy") {
          if (profileDataref.current._id == resp.Message.user_id) {
            setorderType("Buy");
          } else {
            setorderType("Sell");
          }
        } else {
          if (profileDataref.current._id == resp.Message.user_id) {
            setorderType("Sell");
          } else {
            setorderType("Buy");
          }
        }
      }
      var dates = Moment(resp.Message.createdAt).format("DD.MM.YYYY h:m a");
      setp2pDate(dates);
      setp2pRating(resp.rating);
      setp2pOrdercount(resp.completed_count);
      getconfirmOrder();
    }
  };

  const getp2pconfirmOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.p2p_confirm_check,
      payload: onj,
    };
    var resp = await postMethod(data);
    if (resp) {
      var data = resp.Message;
      setconfirmp2pcheck(resp.Message);
    }
  };

  const getconfirmOrder = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.confirmp2porder,
      payload: onj,
    };
    setconfirmloader(true);
    var resp = await postMethod(data);
    //console.log(resp, " confirmp2porder -=-=-resp=-=-");
    if (resp) {
      setconfirmloader(false);

      var data = resp.Message;
      setconfirmp2porder(resp.Message);
      if (resp.Message.status == 0) {
        var timer =
          new Date(resp.Message.datetime).getTime() +
          payTimeref.current * 60 * 1000;
        var current_time = new Date().getTime();
        if (timer > current_time) {
          setTimerstatus("active");
          setTimer(timer);
        }
      } else if (resp.Message.status == 1) {
        var timer = new Date(resp.Message.paytime).getTime() + 15 * 60 * 1000;
        var current_time = new Date().getTime();
        if (timer > current_time) {
          setsellTimerstatus("active");
          setsellTimer(timer);
        }
      }

      setp2pbankData(resp.bank_details);
      setp2pbankcheck(true);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
  };
  const [confirmorderloader, setconfirmloader] = useState(false);

  const handleChange_confirm = async (e) => {
    e.preventDefault();
    if (e.target.innerText == "Confirm Payment") {
      buyer_confirmation("Completed");
    } else if (e.target.innerText == "Confirm Release") {
      seller_confirmation("Completed");
    }
  };

  const handleChange_buycancel = async (e) => {
    e.preventDefault();
    console.log("e.target===", e.target.innerText);
    buyer_cancel();
  };

  const handleChange_sellcancel = async (e) => {
    e.preventDefault();
    seller_cancel();
  };
  const imageUpload = (type, val) => {
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    const fileName = val.name;
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "pdf" &&
      fileExtension != "doc" &&
      fileExtension != "docx"
    ) {
      toast.error(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 1000000) {
      toast.error("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      data.append("file", val);
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (type == "file") {
            setp2pfile(data.secure_url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitChat = async () => {
    try {
      formValue.file = p2pfileref.current;
      formValue.orderId = window.location.href.split("/").pop();
      formValue.p2porderId = confirmp2porderref.current._id;
      formValue.type =
        profileDataref.current._id == p2pDataref.current.user_id
          ? "advertiser"
          : "user";

      if (formValue.message != "" || formValue.file != "") {
        setchatloading(true);
        var data = {
          apiUrl: apiService.p2pchat,
          payload: formValue,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          setchatloading(false);
          getp2pChat();
          setRunningTimer(true);
          formValue.message = "";
          setp2pfile("");
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter message or attach file");
      }
    } catch (error) { }
  };

  const getp2pChat = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.getp2pchat,
      payload: onj,
    };
    var resp = await postMethod(data);
    if (resp) {
      var data = resp.Message;
      setp2pchat(data);
    }
  };

  const buyer_confirmation = async (status) => {
    try {
      var order_Id = window.location.href.split("/").pop();
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.buyer_confirm,
        payload: obj,
      };
      setconfirmloader(true);
      var resp = await postMethod(data);
      setconfirmloader(false);
      if (resp.status) {
        // navigate(`/p2p/complete/${order_Id}`)
        toast.success(resp.Message);
        getp2pChat();
        getp2pOrder();
        getconfirmOrder();
      } else {
        toast.error(resp.Message);
      }
    } catch (error) { }
  };

  const seller_confirmation = async (status) => {
    try {
      var order_Id = window.location.href.split("/").pop();

      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.seller_confirm,
        payload: obj,
      };
      setconfirmloader(true);
      var resp = await postMethod(data);
      setconfirmloader(false);
      if (resp.status) {
        navigate(`/p2p/complete/${order_Id}`);
        toast.success(resp.Message);
        getp2pOrder();
        getconfirmOrder();
        setRunningTimer(false);
        clearInterval(intervalref.current);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) { }
  };

  const buyer_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.buyer_pay_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pChat();
        getp2pOrder();
        navigate("/p2p");
      } else {
        toast.error(resp.Message);
      }
    } catch (error) { }
  };

  const seller_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      var data = {
        apiUrl: apiService.seller_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        getp2pOrder();
      } else {
        toast.error(resp.Message);
      }
    } catch (error) { }
  };

  const copy_to_clipboard = async (type, text) => {
    navigator.clipboard.writeText(text);
    toast.success(type + " copied successfully");
  };

  const confirm_handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let p2pformData = { ...formValue, ...{ [name]: value } };
    setp2pFormValue(p2pformData);
    if (p2pformValueref.current.qty > 0) {
      var order_qty = p2pformValueref.current.qty;
      var min_qty = p2pDataref.current.fromLimit;
      var max_qty = p2pDataref.current.toLimit;
      if (
        order_qty < p2pDataref.current.fromLimit ||
        order_qty > p2pDataref.current.toLimit
      ) {
        toast.error(
          "Please enter quantity between " + min_qty + " and " + max_qty + ""
        );
      } else {
        p2pformValueref.current.total = order_qty * p2pDataref.current.price;
      }
    } else {
      toast.error("Please enter valid quantity");
    }
  };

  const dispute_handleChange = async (e) => {
    e.preventDefault();
    setdisputequery(e.target.value);
  };

  const disputeUpload = (type, val) => {
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    const fileName = val.name;
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "pdf" &&
      fileExtension != "doc" &&
      fileExtension != "docx"
    ) {
      toast.error(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 1000000) {
      toast.error("Please upload a file smaller than 1 MB");
      return false;
    } else {
      const data = new FormData();
      data.append("file", val);
      data.append("upload_preset", "sztbiwly");
      data.append("cloud_name", "taikonz-com");
      console.log("formdata===", data);
      fetch("  https://api.cloudinary.com/v1_1/taikonz-com/auto/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (type == "file") {
            setdisputefile(data.secure_url);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const dispute_buy = async () => {
    try {
      var obj = {};
      obj.type = "buy";
      obj.query = disputequeryref.current;
      obj.attachment = disputefileref.current;
      obj.orderId = confirmp2porderref.current.orderId;
      obj.p2p_orderId = window.location.href.split("/").pop();

      if (obj.query != "") {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
          setdisputequery("");
          setdisputefile("");
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter reason for dispute");
      }
    } catch (error) { }
  };

  const dispute_sell = async () => {
    try {
      var obj = {};
      obj.type = "sell";
      obj.query = disputequeryref.current;
      obj.attachment = disputefileref.current;
      obj.orderId = confirmp2porderref.current.orderId;
      obj.p2p_orderId = window.location.href.split("/").pop();

      if (obj.query != "") {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        var resp = await postMethod(data);
        if (resp.status) {
          toast.success(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
          setdisputequery("");
          setdisputefile("");
        } else {
          toast.error(resp.Message);
        }
      } else {
        toast.error("Please enter reason for dispute");
      }
    } catch (error) { }
  };

  const cancel_confirm_buy = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.cancelConfirmBuy,
      payload: onj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      setTimerstatus("deactive");
      setTimer("");
      toast.error(resp.Message);
      navigate("/p2p");
    }
  };

  const cancel_confirmorder_sell = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    var data = {
      apiUrl: apiService.cancelConfirmSell,
      payload: onj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      setsellTimerstatus("deactive");
      setsellTimer("");
    }
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      cancel_confirm_buy();
    } else {
      return (
        <div className="timer_section1">
          <div className="timer-sect">
            <span>{hours}h</span> :<span>{minutes}m</span> :
            <span>{seconds}s</span>
          </div>
        </div>
      );
    }
  };

  const renderer_sell = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      cancel_confirmorder_sell();
    } else {
      return (
        <div className="timer_section1">
          <div className="timer-sect">
            <span>{hours}h</span> :<span>{minutes}m</span> :
            <span>{seconds}s</span>
          </div>
        </div>
      );
    }
  };

  const navback = async () => {
    navigate("/p2p");
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee new_login_bb">
        <Header />
        {loader == true ? (
          <Grid item xs={12} sm={12} md={8} lg={12} xl={12}>
            <div className="loading">
              <i class="fa-solid fa-spinner fa-spin-pulse "></i>
            </div>
          </Grid>
        ) : (
          <Container maxWidth="xl">
            <Grid
              container
              spacing={2}
              justifyContent={"center"}
              marginTop={"20px"}
            >
              {/* Item for xs (extra small) screens */}
              <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                <div className="card_logoki pading_cardd">
                  <Grid
                    container
                    spacing={2}
                    justifyContent={"start"}
                    marginTop={"20px"}
                  >
                    {/* Item for xs (extra small) screens */}
                    <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                      <div className="form_content">
                        <Button className="back_butn" onClick={() => navback()}>
                          <i class="ri-arrow-left-line"></i> Back
                        </Button>
                        {orderTyperef.current == "Buy" ? (
                          <h1 className="mb-4">
                            You are buying {p2pDataref.current.firstCurrency}
                          </h1>
                        ) : (
                          <h1 className="mb-4">
                            You are selling {p2pDataref.current.firstCurrency}
                          </h1>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent={"start"}
                    marginTop={"0px"}
                    className="pt-0"
                  >
                    {/* Item for xs (extra small) screens */}
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="pt-0"
                    >
                      <Grid
                        container
                        spacing={2}
                        justifyContent={"start"}
                        marginTop={"0px"}
                        className="pt-0"
                      >
                        {/* Item for xs (extra small) screens */}
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={6}
                          xl={6}
                          className="pt-0"
                        >
                          <div className="step-5 ">
                            <div class="form_login_section p-0 mt-4">
                              <div class="form register_login p-0">
                                <form className="form_pading_s">
                                 
                                  <div className="color_border chat_theme">
                                    <div class="form-group flex_start_sae">
                                      <p className="preview">
                                        Price:
                                        <span>
                                          {parseFloat(
                                            p2pDataref.current.price
                                          ).toFixed(2)}{" "}
                                          {p2pDataref.current.secondCurrnecy}
                                        </span>
                                      </p>
                                    </div>
                                    <div class="form-group flex_start_sae ">
                                      <p className="preview">
                                        Amount:{" "}
                                        <span>
                                          {confirmp2porderref.current.askAmount}{" "}
                                          {p2pDataref.current.firstCurrency}
                                        </span>
                                      </p>
                                    </div>

                                    {profileDataref.current != null ? (
                                      orderTyperef.current == "Sell" ? (
                                        <div class="form-group flex_start_sae">
                                          <p className="preview">
                                            Will Receive :
                                            <span>
                                              {parseFloat(
                                                p2pDataref.current.price *
                                                confirmp2porderref.current
                                                  .askAmount
                                              ).toFixed(2)}{" "}
                                              {
                                                p2pDataref.current
                                                  .secondCurrnecy
                                              }
                                            </span>
                                          </p>
                                        </div>
                                      ) : (
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </div>

                                  {profileDataref.current != null ? (
                                    profileDataref.current._id !=
                                      p2pDataref.current.user_id &&
                                      orderTyperef.current == "Buy" &&
                                      confirmp2porderref.current.status == 0 ? (
                                      <>
                                        {p2pDataref.current.paymentMethod ==
                                          "All payments" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>All Payments</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                {bankDataref.current
                                                  .Gpay_Number != undefined &&
                                                  bankDataref.current
                                                    .Gpay_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      UPI ID:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Gpay_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "UPI ID",
                                                              bankDataref
                                                                .current
                                                                .Gpay_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}

                                                {bankDataref.current
                                                  .Paytm_Number != undefined &&
                                                  bankDataref.current
                                                    .Paytm_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      Paytm Number:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Paytm_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "Paytm Number",
                                                              bankDataref
                                                                .current
                                                                .Paytm_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Bank Transfer" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Bank Transfer</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "UPI ID" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Gpay_Number !=
                                            undefined &&
                                            bankDataref.current.Gpay_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>UPI ID</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Name",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    UPI ID:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Paytm" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Paytm_Number !=
                                            undefined &&
                                            bankDataref.current.Paytm_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Paytm</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Paytm Number:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}

                                        <p className="preview mt-3 timer_element">
                                          Please do the payment in:{" "}
                                          <span className="primary_red">
                                            {payTimeref.current} minutes
                                          </span>
                                        </p>
                                      </>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {profileDataref.current != null ? (
                                    profileDataref.current._id ==
                                      p2pDataref.current.user_id &&
                                      orderTyperef.current == "Buy" &&
                                      confirmp2porderref.current.status == 0 ? (
                                      <>
                                        {p2pDataref.current.paymentMethod ==
                                          "All payments" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>All Payments</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                {bankDataref.current
                                                  .Gpay_Number != undefined &&
                                                  bankDataref.current
                                                    .Gpay_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      UPI ID:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Gpay_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "UPI ID",
                                                              bankDataref
                                                                .current
                                                                .Gpay_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}

                                                {bankDataref.current
                                                  .Paytm_Number != undefined &&
                                                  bankDataref.current
                                                    .Paytm_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      Paytm Number:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Paytm_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "Paytm Number",
                                                              bankDataref
                                                                .current
                                                                .Paytm_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Bank Transfer" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Bank Transfer</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "UPI ID" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Gpay_Number !=
                                            undefined &&
                                            bankDataref.current.Gpay_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>UPI ID</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Name",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    UPI ID:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Paytm" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Paytm_Number !=
                                            undefined &&
                                            bankDataref.current.Paytm_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Paytm</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Paytm Number:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}

                                        <p className="preview mt-3 timer_element">
                                          Please do the payment in:{" "}
                                          <span className="primary_red">
                                            {payTimeref.current} minutes
                                          </span>
                                        </p>
                                      </>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {profileDataref.current != null ? (
                                    profileDataref.current._id !=
                                      p2pDataref.current.user_id &&
                                      orderTyperef.current == "Sell" &&
                                      confirmp2porderref.current.status == 0 ? (
                                      <>
                                        {p2pDataref.current.paymentMethod ==
                                          "All payments" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>All Payments</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                {bankDataref.current
                                                  .Gpay_Number != undefined &&
                                                  bankDataref.current
                                                    .Gpay_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      UPI ID:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Gpay_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "UPI ID",
                                                              bankDataref
                                                                .current
                                                                .Gpay_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}

                                                {bankDataref.current
                                                  .Paytm_Number != undefined &&
                                                  bankDataref.current
                                                    .Paytm_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      Paytm Number:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Paytm_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "Paytm Number",
                                                              bankDataref
                                                                .current
                                                                .Paytm_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Bank Transfer" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Bank Transfer</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "UPI ID" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Gpay_Number !=
                                            undefined &&
                                            bankDataref.current.Gpay_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>UPI ID</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Name",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    UPI ID:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Paytm" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Paytm_Number !=
                                            undefined &&
                                            bankDataref.current.Paytm_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Paytm</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Paytm Number:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}

                                  {profileDataref.current != null ? (
                                    profileDataref.current._id ==
                                      p2pDataref.current.user_id &&
                                      orderTyperef.current == "Sell" &&
                                      confirmp2porderref.current.status == 0 ? (
                                      <>
                                        {p2pDataref.current.paymentMethod ==
                                          "All payments" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>All Payments</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                {bankDataref.current
                                                  .Gpay_Number != undefined &&
                                                  bankDataref.current
                                                    .Gpay_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      UPI ID:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Gpay_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "UPI ID",
                                                              bankDataref
                                                                .current
                                                                .Gpay_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}

                                                {bankDataref.current
                                                  .Paytm_Number != undefined &&
                                                  bankDataref.current
                                                    .Paytm_Number != "" ? (
                                                  <div class="form-group flex_start_sae ">
                                                    <p className="preview">
                                                      Paytm Number:
                                                      <span>
                                                        {
                                                          bankDataref.current
                                                            .Paytm_Number
                                                        }
                                                        <i
                                                          class="ri-file-copy-line"
                                                          onClick={() =>
                                                            copy_to_clipboard(
                                                              "Paytm Number",
                                                              bankDataref
                                                                .current
                                                                .Paytm_Number
                                                            )
                                                          }
                                                        ></i>
                                                      </span>
                                                    </p>
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Bank Transfer" ? (
                                          bankDataref.current ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Bank Transfer</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Account Number:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Account_Number
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Number",
                                                            bankDataref.current
                                                              .Account_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Account Holder:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Account Holder",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Bank Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Bank_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Bank Name",
                                                            bankDataref.current
                                                              .Bank_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Branch Name:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Branch_Name
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Branch Name",
                                                            bankDataref.current
                                                              .Branch_Name
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>

                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    IFSC Code:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .IFSC_code
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "IFSC Code",
                                                            bankDataref.current
                                                              .IFSC_code
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "UPI ID" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Gpay_Number !=
                                            undefined &&
                                            bankDataref.current.Gpay_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>UPI ID</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "Name",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    UPI ID:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : p2pDataref.current.paymentMethod ==
                                          "Paytm" ? (
                                          bankDataref.current &&
                                            bankDataref.current.Paytm_Number !=
                                            undefined &&
                                            bankDataref.current.Paytm_Number !=
                                            "" ? (
                                            <div className="color_border ne_bg_txt">
                                              <div className="devision_clas">
                                                <p className="preview">
                                                  Payment Method:{" "}
                                                  <span>Paytm</span>
                                                </p>
                                              </div>
                                              <div className="p-4 pt-3 pb-3">
                                                <div class="form-group flex_start_sae">
                                                  <p className="preview">
                                                    Name:{" "}
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Accout_HolderName
                                                      }{" "}
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Accout_HolderName
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                                <div class="form-group flex_start_sae ">
                                                  <p className="preview">
                                                    Paytm Number:
                                                    <span>
                                                      {
                                                        bankDataref.current
                                                          .Gpay_Number
                                                      }
                                                      <i
                                                        class="ri-file-copy-line"
                                                        onClick={() =>
                                                          copy_to_clipboard(
                                                            "UPI ID",
                                                            bankDataref.current
                                                              .Gpay_Number
                                                          )
                                                        }
                                                      ></i>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          ""
                                        )}
                                      </>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </form>

                                {/* <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                <div className="aling_caseds justify-content-end">
                                  <button
                                    type="button"
                                    class="btn btn-primary w-100 m-0 w-fit"
                                    //onClick={() => formSubmit("step2")}
                                  >
                                    Transferred, Notify Seller
                                  </button>
                                </div>
                              </div> */}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Sell" &&
                                    profileDataref.current._id ==
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 &&
                                    sellTimerstatusref.current == "active" ? (
                                    // <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                    // <div className="aling_caseds justify-content-end">
                                    //   <button
                                    //     type="button"
                                    //     class="btn btn-primary w-100 m-0 w-fit"
                                    //     //onClick={() => formSubmit("step2")}
                                    //   >
                                    //     Buyer paid the amount, Release the crypto within 15 minutes
                                    //     If you are not release within 15 mintutes, order will be disputed automatically
                                    //   </button>
                                    //   <span>
                                    //       <Countdown
                                    //         date={sellTimerref.current}
                                    //         renderer={renderer_sell}
                                    //       />
                                    //     </span>
                                    // </div>
                                    // </div>

                                    <div className="timer">
                                      <h6>
                                        Release the crypto within 15 minutes
                                        <span>
                                          <Countdown
                                            date={sellTimerref.current}
                                            renderer={renderer_sell}
                                          />
                                        </span>
                                      </h6>
                                      <p>- Buyer paid the amount</p>
                                      <p>
                                        - Release the crypto within 15 minutes
                                      </p>
                                      <p>
                                        - If you are not release within 15
                                        mintutes, order will be disputed
                                        automatically
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Sell" &&
                                    profileDataref.current._id ==
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                      <div className="aling_caseds justify-content-end">
                                        {confirmorderloader == false ? (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                            onClick={handleChange_confirm}
                                          >
                                            Confirm Release
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                          >
                                            Processing.....
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          class="btn btn-primary w-100 m-0 w-fit"
                                          data-toggle="modal"
                                          data-target="#raise_dispute_sell"
                                        >
                                          Raise Dispute
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Sell" &&
                                    profileDataref.current._id !=
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 &&
                                    sellTimerstatusref.current == "active" ? (
                                    // <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                    // <div className="aling_caseds justify-content-end">
                                    //   <button
                                    //     type="button"
                                    //     class="btn btn-primary w-100 m-0 w-fit"
                                    //     //onClick={() => formSubmit("step2")}
                                    //   >
                                    //     Buyer paid the amount, Release the crypto within 15 minutes
                                    //     If you are not release within 15 mintutes, order will be disputed automatically
                                    //   </button>
                                    //   <span>
                                    //     <Countdown
                                    //       date={sellTimerref.current}
                                    //       renderer={renderer_sell}
                                    //     />
                                    //   </span>
                                    // </div>
                                    // </div>

                                    <div className="timer">
                                      <h6>
                                        Release the crypto within 15 minutes
                                        <span>
                                          <Countdown
                                            date={sellTimerref.current}
                                            renderer={renderer_sell}
                                          />
                                        </span>
                                      </h6>
                                      <p>- Buyer paid the amount</p>
                                      <p>
                                        - Release the crypto within 15 minutes
                                      </p>
                                      <p>
                                        - If you are not release within 15
                                        mintutes, order will be disputed
                                        automatically
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Sell" &&
                                    profileDataref.current._id !=
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                      <div className="aling_caseds justify-content-end">
                                        {confirmorderloader == false ? (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                            onClick={handleChange_confirm}
                                          >
                                            Confirm Release
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                          >
                                            Processing.....
                                          </button>
                                        )}

                                        <button
                                          type="button"
                                          class="btn btn-primary w-100 m-0 w-fit"
                                          data-toggle="modal"
                                          data-target="#raise_dispute_sell"
                                        >
                                          Raise Dispute
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id ==
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 0 &&
                                    Timerstatusref.current == "active" ? (
                                    <div className="timer">
                                      <h6>
                                        Payment to be made within{" "}
                                        {payTimeref.current < 60
                                          ? payTimeref.current + " minutes"
                                          : payTimeref.current / 60 == 1
                                            ? payTimeref.current / 60 + " hour"
                                            : payTimeref.current / 60 +
                                            " hours"}{" "}
                                        <span>
                                          <Countdown
                                            date={Timerref.current}
                                            renderer={renderer}
                                          />
                                        </span>
                                      </h6>
                                      <p>- Please pay fast</p>
                                      <p>- Do not accept third party payment</p>
                                      <p>
                                        - If you are not pay within{" "}
                                        {payTimeref.current < 60
                                          ? payTimeref.current + " minutes"
                                          : payTimeref.current / 60 == 1
                                            ? payTimeref.current / 60 + " hour"
                                            : payTimeref.current / 60 + " hours"}
                                        , order will be cancelled automatically
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id ==
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 0 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading" >
                                      <div className="aling_caseds justify-content-end">
                                        <button
                                          type="button"
                                          class="btn btn-primary w-100 m-0 w-fit"
                                          onClick={handleChange_buycancel}
                                        >
                                          Cancel
                                        </button>

                                        {confirmorderloader == false ? (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                            onClick={handleChange_confirm}
                                          >
                                            Confirm Payment
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                          >
                                            Processing.....
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id !=
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 0 &&
                                    Timerstatusref.current == "active" ? (
                                    <div className="timer">
                                      <h6>
                                        Payment to be made within{" "}
                                        {payTimeref.current < 60
                                          ? payTimeref.current + " minutes"
                                          : payTimeref.current / 60 == 1
                                            ? payTimeref.current / 60 + " hour"
                                            : payTimeref.current / 60 +
                                            " hours"}{" "}
                                        <span>
                                          <Countdown
                                            date={Timerref.current}
                                            renderer={renderer}
                                          />
                                        </span>
                                      </h6>
                                      <p>- Please pay fast</p>
                                      <p>- Do not accept third party payment</p>
                                      <p>
                                        - If you are not pay within{" "}
                                        {payTimeref.current < 60
                                          ? payTimeref.current + " minutes"
                                          : payTimeref.current / 60 == 1
                                            ? payTimeref.current / 60 + " hour"
                                            : payTimeref.current / 60 +
                                            " hours"}{" "}
                                        order will be cancelled automatically
                                      </p>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id !=
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 0 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading cancel-payment-butns">
                                      <div className="aling_caseds justify-content-star payment-cancel-confirm">
                                        <button
                                          type="button"
                                          class="btn w-100 m-0 w-fit payment_cancel_btn"
                                          onClick={handleChange_buycancel}
                                        >
                                          Cancel
                                        </button>

                                        {confirmorderloader == false ? (
                                          <button
                                            type="button"
                                            class="btn btn-primary cancel-payment w-100 m-0 w-fit mt-0"
                                            onClick={handleChange_confirm}
                                          >
                                            Confirm Payment
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            class="btn btn-primary w-100 m-0 w-fit"
                                          >
                                            Processing.....
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id !=
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                      <div className="aling_caseds justify-content-end">
                                        <button
                                          type="button"
                                          class="btn btn-primary w-100 m-0 w-fit"
                                          data-toggle="modal"
                                          data-target="#raise_dispute_buy"
                                        >
                                          Raise Dispute
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}

                                {profileDataref.current != null ? (
                                  orderTyperef.current == "Buy" &&
                                    profileDataref.current._id ==
                                    p2pDataref.current.user_id &&
                                    confirmp2porderref.current.status == 1 ? (
                                    <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                                      <div className="aling_caseds justify-content-end">
                                        <button
                                          type="button"
                                          class="btn btn-primary w-100 m-0 w-fit"
                                          data-toggle="modal"
                                          data-target="#raise_dispute_buy"
                                        >
                                          Raise Dispute
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={6}
                          xl={6}
                          className="pt-0"
                        >
                          <div className="step-5  mt-4 pt-1">
                            <div class="form_login_section p-0">
                              <div class="form register_login form-bg p-0">
                                {/* <form className="form_pading_s"> */}
                                <div className="pading_bott_mae">
                                  {p2pDataref.current != null ? (
                                    p2pDataref.current.userId != null ? (
                                      <div className="data_inner flex_image_coloe w-fit justify-content-between ">
                                        <div className="profile_image1 chat-profile">
                                          <img
                                            src={
                                              p2pDataref.current
                                                .profile_image == null ||
                                                p2pDataref.current
                                                  .profile_image == undefined ||
                                                p2pDataref.current
                                                  .profile_image == ""
                                                ? require("../../../img/New_images/profile_img.png")
                                                : p2pDataref.current
                                                  .profile_image
                                            }
                                            className="img-fluid"
                                          />
                                          <div className="name_details">
                                            <h5>
                                              {
                                                p2pDataref.current.userId
                                                  .username
                                              }
                                            </h5>
                                            <p className="p-0 text-left">
                                              {p2pOrdercountref.current} TRADES
                                              | {p2pRatingref.current}%
                                            </p>
                                          </div>
                                        </div>
                                        <div className="button_cirle">
                                          <a href="">
                                            <i class="ri-message-2-fill"></i>
                                          </a>
                                        </div>
                                      </div>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </div>

                                <div className="chat_contianer">
                                  <div className="chat_section">
                                    {profileDataref.current != null
                                      ? p2pchatref.current &&
                                      p2pchatref.current.map((chat, i) => {
                                        return chat.type == "advertiser" ? (
                                          chat.advertiserId ==
                                            profileDataref.current._id &&
                                            chat.default == 0 ? (
                                            <div className="char_recive w-100 d-flex justify-content-end">
                                              <div className=" char_send">
                                                <div className="chat_conent">
                                                  <p>
                                                    <span>
                                                      {chat.adv_name}
                                                    </span>{" "}
                                                    {Moment(
                                                      chat.createdAt
                                                    ).format("LT")}
                                                  </p>

                                                  {chat.adv_msg != "" &&
                                                    chat.adv_msg !=
                                                    undefined ? (
                                                    <div className="chart_card">
                                                      {chat.adv_msg}
                                                    </div>
                                                  ) : chat.user_msg != "" &&
                                                    chat.user_msg !=
                                                    undefined ? (
                                                    <div className="chart_card">
                                                      {chat.user_msg}
                                                    </div>
                                                  ) : (
                                                    ""
                                                  )}
                                                  {chat.adv_file != "" &&
                                                    chat.adv_file !=
                                                    undefined ? (
                                                    <img
                                                      src={chat.adv_file}
                                                      className=""
                                                    />
                                                  ) : chat.user_file != "" &&
                                                    chat.user_file !=
                                                    undefined ? (
                                                    <img
                                                      src={chat.user_file}
                                                      className=""
                                                    />
                                                  ) : (
                                                    ""
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ) : chat.advertiserId !=
                                            profileDataref.current._id ? (
                                            <div className="char_recive">
                                              <div className="chat_conent">
                                                <p>
                                                  <span>{chat.adv_name}</span>{" "}
                                                  {Moment(
                                                    chat.createdAt
                                                  ).format("LT")}
                                                </p>

                                                {chat.user_msg != "" &&
                                                  chat.user_msg != undefined ? (
                                                  <div className="chart_card">
                                                    {chat.user_msg}
                                                  </div>
                                                ) : chat.adv_msg != "" &&
                                                  chat.adv_msg !=
                                                  undefined ? (
                                                  <div className="chart_card">
                                                    {chat.adv_msg}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                                {chat.user_file != "" &&
                                                  chat.user_file !=
                                                  undefined ? (
                                                  <img
                                                    src={chat.user_file}
                                                    className=""
                                                  />
                                                ) : chat.adv_file != "" &&
                                                  chat.adv_file !=
                                                  undefined ? (
                                                  <img
                                                    src={chat.adv_file}
                                                    className=""
                                                  />
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : chat.userId ==
                                          profileDataref.current._id &&
                                          chat.default == 0 ? (
                                          <div className="char_recive w-100 d-flex justify-content-end">
                                            <div className=" char_send">
                                              <div className="chat_conent">
                                                <p>
                                                  <span>
                                                    {chat.user_name}
                                                  </span>{" "}
                                                  {Moment(
                                                    chat.createdAt
                                                  ).format("LT")}
                                                </p>

                                                {chat.user_msg != "" &&
                                                  chat.user_msg != undefined ? (
                                                  <div className="chart_card">
                                                    {chat.user_msg}
                                                  </div>
                                                ) : chat.adv_msg != "" &&
                                                  chat.adv_msg !=
                                                  undefined ? (
                                                  <div className="chart_card">
                                                    {chat.adv_msg}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                                {chat.user_file != "" &&
                                                  chat.user_file !=
                                                  undefined ? (
                                                  <img
                                                    src={chat.user_file}
                                                    className=""
                                                  />
                                                ) : chat.adv_file != "" &&
                                                  chat.adv_file !=
                                                  undefined ? (
                                                  <img
                                                    src={chat.adv_file}
                                                    className=""
                                                  />
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ) : chat.userId !=
                                          profileDataref.current._id ? (
                                          <div className="char_recive">
                                            <div className="chat_conent">
                                              <p>
                                                <span>{chat.user_name}</span>{" "}
                                                {Moment(
                                                  chat.createdAt
                                                ).format("LT")}
                                              </p>

                                              {chat.user_msg != "" &&
                                                chat.user_msg != undefined ? (
                                                <div className="chart_card">
                                                  {chat.user_msg}
                                                </div>
                                              ) : chat.adv_msg != "" &&
                                                chat.adv_msg != undefined ? (
                                                <div className="chart_card">
                                                  {chat.adv_msg}
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                              {chat.user_file != "" &&
                                                chat.user_file != undefined ? (
                                                <img
                                                  src={chat.user_file}
                                                  className=""
                                                />
                                              ) : chat.adv_file != "" &&
                                                chat.adv_file != undefined ? (
                                                <img
                                                  src={chat.adv_file}
                                                  className=""
                                                />
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        );
                                      })
                                      : ""}
                                  </div>
                                  {confirmp2porderref.current.status != 2 ? (
                                    <div className="chat_footer">
                                      <input
                                        type="text"
                                        placeholder="Say Something"
                                        name="message"
                                        value={message}
                                        onChange={handleChange}
                                      />
                                      {chatloading == false ? (
                                        <button onClick={submitChat}>
                                          Send
                                        </button>
                                      ) : (
                                        <button>Sending...</button>
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>

                                {/* <div className="chat_contianer">
                                  <div className="chat_section">
                                    <div className="char_recive">
                                      <div className="chat_conent">
                                        <p>
                                          <span>Vikram Rao</span> 12:34 PM
                                        </p>
                                        <div className="chart_card">
                                          Hey Olivia, I’ve finished with the
                                          requirements doc! I made some notes in
                                          the gdoc as well for Phoenix to look
                                          over.
                                        </div>
                                      </div>
                                    </div>
                                    <div className="char_recive w-100 d-flex justify-content-end">
                                      <div className=" char_send">
                                        <div className="chat_conent">
                                          <p>
                                            <span>Vikram Rao</span> 12:34 PM
                                          </p>
                                          <div className="chart_card">
                                            Hey Olivia, I’ve finished with the
                                            requirements doc! I made some notes
                                            in the gdoc as well for Phoenix to
                                            look over.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="char_recive w-100 d-flex justify-content-end">
                                      <div className=" char_send">
                                        <div className="chat_conent">
                                          <p>
                                            <span>Vikram Rao</span> 12:34 PM
                                          </p>
                                          <div className="chart_card">
                                            Hey Olivia, I’ve finished with the
                                            requirements doc! I made some notes
                                            in the gdoc as well for Phoenix to
                                            look over.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="char_recive w-100 d-flex justify-content-end">
                                      <div className=" char_send">
                                        <div className="chat_conent">
                                          <p>
                                            <span>Vikram Rao</span> 12:34 PM
                                          </p>
                                          <div className="chart_card">
                                            Hey Olivia, I’ve finished with the
                                            requirements doc! I made some notes
                                            in the gdoc as well for Phoenix to
                                            look over.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="char_recive w-100 d-flex justify-content-end">
                                      <div className=" char_send">
                                        <div className="chat_conent">
                                          <p>
                                            <span>Vikram Rao</span> 12:34 PM
                                          </p>
                                          <div className="chart_card">
                                            Hey Olivia, I’ve finished with the
                                            requirements doc! I made some notes
                                            in the gdoc as well for Phoenix to
                                            look over.
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="chat_footer">
                                    <input
                                      type="text"
                                      placeholder="Say Something"
                                    />
                                    <button>Send</button>
                                  </div>
                                </div> */}

                                {/* </form> */}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            {/* Your other components and content */}
          </Container>
        )}
      </main>

      <div
        id="raise_dispute_buy"
        class="modal launchpad_doce fade"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Raise Dispute </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                <div className="input_section">
                  <p>
                    <span>Reason for dispute</span>
                  </p>
                  <div className="input_select_s newbtind">
                    <input
                      type="text"
                      name="query"
                      value={disputequeryref.current}
                      onChange={dispute_handleChange}
                    />
                  </div>
                </div>
                <div className="input_section">
                  <p>
                    <span>Attachment</span>
                  </p>
                  <div className="input_select_s">
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => disputeUpload("file", e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="submiot">
                  <button
                    type="button"
                    class="btn btn-primary w-100 m-0 w-fit"
                    onClick={dispute_buy}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        id="raise_dispute_sell"
        class="modal launchpad_doce fade"
        role="dialog"
      >
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content">
            <div class="modal-body model_confirms">
              <h1> Raise Dispute </h1>
              <form className="launch_card new_table  pt-5 tranbg">
                <div className="input_section">
                  <p>
                    <span>Reason for dispute</span>
                  </p>
                  <div className="input_select_s newbtind">
                    <input
                      type="text"
                      name="query"
                      value={disputequeryref.current}
                      onChange={dispute_handleChange}
                    />
                  </div>
                </div>
                <div className="input_section">
                  <p>
                    <span>Attachment</span>
                  </p>
                  <div className="input_select_s">
                    <input
                      type="file"
                      name="file"
                      onChange={(e) => disputeUpload("file", e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="submiot">
                  <button
                    type="button"
                    class="btn btn-primary w-100 m-0 w-fit"
                    onClick={dispute_sell}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
