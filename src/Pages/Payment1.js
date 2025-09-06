import React, { useEffect } from "react";
import useState from "react-usestateref";
import Header from "./Header";
import { socket } from "../context/socket";
import Countdown from "react-countdown";
import Moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";

const Payment = () => {
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

  const [siteLoader, setSiteLoader] = useState(false);
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
  const [confirmorderloader, setconfirmloader] = useState(false);
  const [loader, setloader] = useState(false);
  const [headurl, setheadurl, headurlref] = useState("");

  const navigate = useNavigate();

  const getp2pChat = async () => {
    setSiteLoader(true);

    var onj = {
      orderId: headurlref.current,
    };
    var data = {
      apiUrl: apiService.getp2pchat,
      payload: onj,
    };
    var resp = await postMethod(data);
    setSiteLoader(false);

    if (resp) {
      var data = resp.Message;
      setp2pchat(data);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const santisedValue = value.replace(/^\s+/, "");
    let formData = { ...formValue, ...{ [name]: santisedValue } };
    setFormValue(formData);
  };

  const [UserID, setUserID, UserIDref] = useState("");

  useEffect(() => {
    setSiteLoader(true);

    // const token = localStorage.getItem("PTKToken");
    const token = sessionStorage.getItem("PTKToken");
    const PTK = token.split("_")[1];
    setUserID(PTK);

    const urls = window.location.href;
    console.log(urls, "urls");
    const chat = urls.split("/").pop();
    console.log(chat, "chat");

    setheadurl(chat);

    // let socket_token = localStorage.getItem("socketToken");
    let socket_token = sessionStorage.getItem("socketToken");
    console.log(socket_token, "inniknkijn");
    let socketsplit = socket_token?.split(`"_`);
    socket.connect();
    getProfile();

    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      if (res.Reason == "p2pchat") {
        getp2pChat();
      } else if (res.Reason == "notify") {
        setnotifymessage(res.Message);
        showsuccessToast(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        //getp2pconfirmOrder();
        getconfirmOrder();
      } else if (res.Reason == "ordercancel") {
        setnotifymessage(res.Message);
        showsuccessToast(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        //getp2pconfirmOrder();
        getconfirmOrder();
      }
    });
    socket.emit("socketResponse");
    setSiteLoader(false);
  }, [0]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  const getProfile = async () => {
    try {
      setSiteLoader(true);
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      console.log("userprofile data===", resp);
      setSiteLoader(false);

      if (resp.status) {
        if (resp.Message != null) {
          setprofileData(resp.Message);
          setprofileStatus(true);
          console.log("profiledata===", profileDataref.current);
          if (profileStatusref.current != null) {
            getp2pOrder();
            getp2pChat();
          }
        }
      }
    } catch (error) { }
  };

  const getp2pOrder = async () => {
    setSiteLoader(true);

    var onj = {
      orderId: headurlref.current,
    };
    var data = {
      apiUrl: apiService.getp2pOrder,
      payload: onj,
    };
    var resp = await postMethod(data);
    setSiteLoader(false);

    console.log(resp, "-=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setp2pData(resp.Message);

      setp2pbalance(resp.p2pbalance);

      console.log(resp.Message, "===========================");

      let paymentTime =
        resp.Message.pay_time != null && resp.Message.pay_time != ""
          ? parseInt(resp.Message.pay_time)
          : "15";
      setpayTime(paymentTime);
      if (resp.bank) {
        setbankData(resp.bank);
      }
      console.log(UserIDref.current, resp.Message.userId._id);

      if (profileDataref.current != null) {
        if (resp.Message.orderType == "buy") {
          if (UserIDref.current == resp.Message.userId._id) {
            setorderType("Buy");
          } else {
            setorderType("Sell");
          }
        } else {
          if (UserIDref.current == resp.Message.userId._id) {
            setorderType("Sell");
          } else {
            setorderType("Buy");
          }
        }
      }

      console.log(orderTyperef.current, "nkkm============================")
      var dates = Moment(resp.Message.createdAt).format("DD.MM.YYYY h:m a");
      setp2pDate(dates);
      setp2pRating(resp.rating);
      setp2pOrdercount(resp.completed_count);
      getconfirmOrder();
    }
  };

  const getp2pconfirmOrder = async () => {
    var onj = {
      orderId: headurlref.current,
    };
    var data = {
      apiUrl: apiService.p2p_confirm_check,
      payload: onj,
    };
    setSiteLoader(true);

    var resp = await postMethod(data);
    setSiteLoader(false);

    if (resp) {
      var data = resp.Message;
      setconfirmp2pcheck(resp.Message);
    }
  };

  const getconfirmOrder = async () => {
    var onj = {
      orderId: headurlref.current,
    };
    setSiteLoader(true);

    var data = {
      apiUrl: apiService.confirmp2porder,
      payload: onj,
    };
    var resp = await postMethod(data);
    setSiteLoader(false);

    console.log(resp, " confirmp2porder -=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setconfirmp2porder(resp.Message);
      if (resp.Message.status == 0) {
        console.log(resp.Message.datetime, " confirmp2porder -=-=-resp=-=-");

        var timer =
          new Date(resp.Message.datetime).getTime() +
          payTimeref.current * 60 * 1000;
        var current_time = new Date().getTime();

        console.log("timer", current_time, timer);

        if (timer > current_time) {
          setTimerstatus("active");

          console.log("timer", Timerstatusref.current);

          console.log(
            UserIDref.current,
            p2pDataref.current,
            orderTyperef.current,
            confirmp2porderref.current.status
          );
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

  const handleChange_buycancel = async (e) => {
    e.preventDefault();
    console.log("e.target===", e.target.innerText);
    buyer_cancel();
  };

  const cancel_confirmorder_sell = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    setSiteLoader(true);

    var data = {
      apiUrl: apiService.cancelConfirmSell,
      payload: onj,
    };
    var resp = await postMethod(data);
    setSiteLoader(false);

    if (resp.status) {
      setsellTimerstatus("deactive");
      setsellTimer("");
    }
  };

  const buyer_confirmation = async (status) => {
    try {
      var order_Id = window.location.href.split("/").pop();
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      setSiteLoader(true);

      var data = {
        apiUrl: apiService.buyer_confirm,
        payload: obj,
      };
      setconfirmloader(true);
      var resp = await postMethod(data);
      setconfirmloader(false);
      setSiteLoader(false);

      if (resp.status) {
        // navigate(`/p2p/complete/${order_Id}`)
        showsuccessToast(resp.Message);
        getp2pChat();
        getp2pOrder();
        getconfirmOrder();
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) { }
  };

  const submitChat = async () => {
    try {
      formValue.file = p2pfileref.current;
      formValue.orderId = window.location.href.split("/").pop();
      formValue.p2porderId = confirmp2porderref.current._id;
      formValue.type =
        UserIDref.current == p2pDataref.current.user_id ? "advertiser" : "user";

      if (formValue.message != "" || formValue.file != "") {
        setSiteLoader(true);
        var data = {
          apiUrl: apiService.p2pchat,
          payload: formValue,
        };
        setchatloading(true);
        var resp = await postMethod(data);
        setSiteLoader(false);

        if (resp.status) {
          setchatloading(false);
          getp2pChat();
          setRunningTimer(true);
          formValue.message = "";
          setp2pfile("");
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        showerrorToast("Please enter message or attach file");
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
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        navigate("/p2p");
        showsuccessToast(resp.Message);
        getp2pOrder();
        getconfirmOrder();
        setRunningTimer(false);
        clearInterval(intervalref.current);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) { }
  };

  const buyer_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: status,
      };
      setSiteLoader(true);

      var data = {
        apiUrl: apiService.buyer_pay_cancel,
        payload: obj,
      };

      var resp = await postMethod(data);

      setSiteLoader(false);

      if (resp.status) {
        showsuccessToast(resp.Message);
        getp2pChat();
        getp2pOrder();
        navigate("/p2p");
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) { }
  };

  const handleChange_confirm = async (e) => {
    e.preventDefault();
    if (e.target.innerText == "Confirm Payment") {
      buyer_confirmation("Completed");
    } else if (e.target.innerText == "Confirm Release") {
      seller_confirmation("Completed");
    }
  };

  const cancel_confirm_buy = async () => {
    var onj = {
      orderId: window.location.href.split("/").pop(),
    };
    setSiteLoader(true);

    var data = {
      apiUrl: apiService.cancelConfirmBuy,
      payload: onj,
    };
    var resp = await postMethod(data);

    setSiteLoader(false);

    if (resp.status) {
      setTimerstatus("deactive");
      setTimer("");
      showerrorToast(resp.Message);
      navigate("/p2p");
    }
  };

  const dispute_handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    setdisputequery(sanitizedValue);
  };


  const [raiseloader, setraiseloader, raiseloaderref] = useState(false);
  const [raiseValid, setraiseValid] = useState(0);
  const [raisename, setraisename, raisenameref] = useState(false);



  const disputeUpload = (type, val) => {
    setraiseloader(true);
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
      setraiseloader(false);
      showerrorToast(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 10000000) {
      setraiseloader(false);

      showerrorToast("Please upload a file smaller than 1 MB");
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
            setraiseValid(1);
            setdisputefile(data.secure_url);
            setraisename(fileName);
          }
          setraiseloader(false);

        })
        .catch((err) => {
          setraiseloader(false);

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

      if (obj.query != "" && obj.attachment != "") {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        setSiteLoader(true);

        var resp = await postMethod(data);
        setSiteLoader(false);

        if (resp.status) {
          showsuccessToast(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
          setdisputequery("");
          setdisputefile("");
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        showerrorToast("Please enter reason and proof for dispute");
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

      if (obj.query != "" && obj.attachment != "" ) {
        var data = {
          apiUrl: apiService.raise_dispute,
          payload: obj,
        };
        setSiteLoader(true);

        var resp = await postMethod(data);
        setSiteLoader(false);

        if (resp.status) {
          showsuccessToast(resp.Message);
          getp2pOrder();
          getp2pconfirmOrder();
          setdisputequery("");
          setdisputefile("");
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        showerrorToast("Please enter reason and proof for dispute");
      }
    } catch (error) { }
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

  const copy_to_clipboard = async (type, text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast(type + " copied successfully");
  };

    const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div>
        <div className="Verification">
          <div className="container">
            <div>
              {/* <Link to="/p2p">
              <h6>
                <i class="fa-solid fa-arrow-left-long mr-3"></i> P2P
              </h6>
              </Link> */}
              <div className="row justify-content-center payment-cards mt-4">
                <div className="col-lg-6">
                  <h5 className="pay-title">
                    {orderTyperef.current == "Buy" ? (
                      <h1 className="mb-4">
                        You are buying {p2pDataref.current.firstCurrency}
                      </h1>
                    ) : (
                      <h1 className="mb-4">
                        You are selling {p2pDataref.current.firstCurrency}
                      </h1>
                    )}
                  </h5>
                  <p className="pay-content">
                    Complete the payment within{" "}
                    <span className="pay-span">
                      {p2pDataref.current.pay_time}
                    </span>{" "}
                    Otherwise, the order will be canceled
                  </p>
                  <div className="pay-wrapper-two">
                    <div className="pay-flex">
                      <span className="pay-btc">Order Details</span>
                    </div>

                    <div className="pay-flex">
                      <span className="pay-name">Price</span>
                      <span className="pay-money">
                        {parseFloat(p2pDataref.current.price).toFixed(2)}{" "}
                        <span className="pay-name">
                          {" "}
                          {p2pDataref.current.secondCurrnecy}{" "}
                        </span>{" "}
                      </span>
                    </div>

                    <div className="pay-flex">
                      <span className="pay-name">Amount</span>
                      <span className="pay-money">
                        {confirmp2porderref.current.askAmount}{" "}
                        <span className="pay-btc">
                          {" "}
                          {p2pDataref.current.firstCurrency}
                        </span>
                      </span>
                    </div>

                    {profileDataref.current != null ? (
                      orderTyperef.current == "Sell" ? (
                        <div className="pay-flex">
                          <span className="pay-name">Will Receive</span>
                          <span className="pay-btc">
                            {parseFloat(
                              p2pDataref.current.price *
                              confirmp2porderref.current.askAmount
                            ).toFixed(2)}{" "}
                            {p2pDataref.current.secondCurrnecy}
                          </span>
                        </div>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}

                    {profileDataref.current != null ? (
                      UserIDref.current != p2pDataref.current.userId?._id &&
                        orderTyperef.current == "Buy" &&
                        confirmp2porderref.current.status == 0 ? (
                        <>
                          {confirmp2porderref.current.paymentMethod ==
                            "BankTransfer" ||
                            confirmp2porderref.current.paymentMethod == "IMPS" ? (
                            bankDataref.current ? (
                              <div className="color_border ne_bg_txt">
                                <div className="pay-wrapper">
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {p2pDataref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Selected Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {confirmp2porderref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Number
                                    </span>
                                    <span className="pay-money">
                                      {bankDataref.current.Account_Number}{" "}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Number",
                                            bankDataref.current.Account_Number
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Holder
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Accout_HolderName}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Holder",
                                            bankDataref.current
                                              .Accout_HolderName
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">Bank Name</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Bank_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Bank Name",
                                            bankDataref.current.Bank_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Branch Name
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Branch_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Branch Name",
                                            bankDataref.current.Branch_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>

                                  <div className="pay-flex">
                                    <span className="pay-name">IFSC Code</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.IFSC_code}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "IFSC Code",
                                            bankDataref.current.IFSC_code
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : bankDataref.current ? (
                            <div className="color_border ne_bg_txt">
                              <div className="pay-wrapper">
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {p2pDataref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Selected Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {confirmp2porderref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-name">
                                    Account Holder Name
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Accout_HolderName}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "Account Holder",
                                          bankDataref.current.Accout_HolderName
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                <div className="pay-flex">
                                  <span className="pay-name">
                                    {confirmp2porderref.current.paymentMethod ==
                                      "Paytm"
                                      ? "Paytm ID"
                                      : "UPID"}
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Upid_ID}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "ID",
                                          bankDataref.current.Upid_ID
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                  <div className="pay-flex">
                                    <span className="pay-name mt-4">
                                      Payment QR Code
                                    </span>
                                    <span className="pay-money">
                                    <img
                                    src={bankDataref.current.QRcode}
                                    width="150px"
                                    className="mx-auto d-block"
                                    alt="Payment QR Code"
                                  /></span>
                                  </div>
                                </div>
                            </div>
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
                      UserIDref.current == p2pDataref.current.userId?._id &&
                        orderTyperef.current == "Buy" &&
                        confirmp2porderref.current.status == 0 ? (
                        <>
                          {confirmp2porderref.current.paymentMethod ==
                            "BankTransfer" ||
                            confirmp2porderref.current.paymentMethod == "IMPS" ? (
                            bankDataref.current ? (
                              <div className="color_border ne_bg_txt">
                                <div className="pay-wrapper">
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {p2pDataref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Selected Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {confirmp2porderref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Number
                                    </span>
                                    <span className="pay-money">
                                      {bankDataref.current.Account_Number}{" "}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Number",
                                            bankDataref.current.Account_Number
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Holder
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Accout_HolderName}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Holder",
                                            bankDataref.current
                                              .Accout_HolderName
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">Bank Name</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Bank_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Bank Name",
                                            bankDataref.current.Bank_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Branch Name
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Branch_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Branch Name",
                                            bankDataref.current.Branch_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>

                                  <div className="pay-flex">
                                    <span className="pay-name">IFSC Code</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.IFSC_code}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "IFSC Code",
                                            bankDataref.current.IFSC_code
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : bankDataref.current ? (
                            <div className="color_border ne_bg_txt">
                              <div className="pay-wrapper">
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {p2pDataref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Selected Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {confirmp2porderref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-name">
                                    Account Holder Name
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Accout_HolderName}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "Account Holder",
                                          bankDataref.current.Accout_HolderName
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                <div className="pay-flex">
                                  <span className="pay-name">
                                    {confirmp2porderref.current.paymentMethod ==
                                      "Paytm"
                                      ? "Paytm ID"
                                      : "UPID"}
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Upid_ID}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "ID",
                                          bankDataref.current.Upid_ID
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                  <div className="pay-flex">
                                    <span className="pay-name mt-4">
                                      Payment QR Code
                                    </span>
                                    <span className="pay-money">
                                    <img
                                    src={bankDataref.current.QRcode}
                                    width="150px"
                                    className="mx-auto d-block"
                                    alt="Payment QR Code"
                                  /></span>
                                  </div>
                              </div>
                            </div>
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
                      UserIDref.current != p2pDataref.current.userId?._id &&
                        orderTyperef.current == "Sell" &&
                        confirmp2porderref.current.status == 0 ? (
                        <>
                          {confirmp2porderref.current.paymentMethod ==
                            "BankTransfer" ||
                            confirmp2porderref.current.paymentMethod == "IMPS" ? (
                            bankDataref.current ? (
                              <div className="color_border ne_bg_txt">
                                <div className="pay-wrapper">
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {p2pDataref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Selected Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {confirmp2porderref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Number
                                    </span>
                                    <span className="pay-money">
                                      {bankDataref.current.Account_Number}{" "}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Number",
                                            bankDataref.current.Account_Number
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Holder
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Accout_HolderName}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Holder",
                                            bankDataref.current
                                              .Accout_HolderName
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">Bank Name</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Bank_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Bank Name",
                                            bankDataref.current.Bank_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Branch Name
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Branch_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Branch Name",
                                            bankDataref.current.Branch_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>

                                  <div className="pay-flex">
                                    <span className="pay-name">IFSC Code</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.IFSC_code}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "IFSC Code",
                                            bankDataref.current.IFSC_code
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : bankDataref.current ? (
                            <div className="color_border ne_bg_txt">
                              <div className="pay-wrapper">
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {p2pDataref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Selected Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {confirmp2porderref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-name">
                                    Account Holder Name
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Accout_HolderName}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "Account Holder",
                                          bankDataref.current.Accout_HolderName
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                <div className="pay-flex">
                                  <span className="pay-name">
                                    {confirmp2porderref.current.paymentMethod ==
                                      "Paytm"
                                      ? "Paytm ID"
                                      : "UPID"}
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Upid_ID}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "ID",
                                          bankDataref.current.Upid_ID
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                  <div className="pay-flex">
                                    <span className="pay-name mt-4">
                                      Payment QR Code
                                    </span>
                                    <span className="pay-money">
                                    <img
                                    src={bankDataref.current.QRcode}
                                    width="150px"
                                    className="mx-auto d-block"
                                    alt="Payment QR Code"
                                  /></span>
                                  </div>
                              </div>
                            </div>
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
                      UserIDref.current == p2pDataref.current.userId?._id &&
                        orderTyperef.current == "Sell" &&
                        confirmp2porderref.current.status == 0 ? (
                        <>
                          {confirmp2porderref.current.paymentMethod ==
                            "BankTransfer" ||
                            confirmp2porderref.current.paymentMethod == "IMPS" ? (
                            bankDataref.current ? (
                              <div className="color_border ne_bg_txt">
                                <div className="pay-wrapper">
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {p2pDataref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-method">
                                      Selected Payment Method
                                    </span>
                                    <span className="pay-bank">
                                      {confirmp2porderref.current.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Number
                                    </span>
                                    <span className="pay-money">
                                      {bankDataref.current.Account_Number}{" "}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Number",
                                            bankDataref.current.Account_Number
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Account Holder
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Accout_HolderName}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Account Holder",
                                            bankDataref.current
                                              .Accout_HolderName
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">Bank Name</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Bank_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Bank Name",
                                            bankDataref.current.Bank_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <div className="pay-flex">
                                    <span className="pay-name">
                                      Branch Name
                                    </span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.Branch_Name}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "Branch Name",
                                            bankDataref.current.Branch_Name
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>

                                  <div className="pay-flex">
                                    <span className="pay-name">IFSC Code</span>
                                    <span className="pay-money">
                                      {" "}
                                      {bankDataref.current.IFSC_code}
                                      <i
                                        class="ri-file-copy-line cursor-pointer"
                                        onClick={() =>
                                          copy_to_clipboard(
                                            "IFSC Code",
                                            bankDataref.current.IFSC_code
                                          )
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )
                          ) : bankDataref.current ? (
                            <div className="color_border ne_bg_txt">
                              <div className="pay-wrapper">
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {p2pDataref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-method">
                                    Selected Payment Method
                                  </span>
                                  <span className="pay-bank">
                                    {confirmp2porderref.current.paymentMethod}
                                  </span>
                                </div>
                                <div className="pay-flex">
                                  <span className="pay-name">
                                    Account Holder Name
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Accout_HolderName}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "Account Holder",
                                          bankDataref.current.Accout_HolderName
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                <div className="pay-flex">
                                  <span className="pay-name">
                                    {confirmp2porderref.current.paymentMethod ==
                                      "Paytm"
                                      ? "Paytm ID"
                                      : "UPID"}
                                  </span>
                                  <span className="pay-money">
                                    {bankDataref.current.Upid_ID}{" "}
                                    <i
                                      class="ri-file-copy-line cursor-pointer"
                                      onClick={() =>
                                        copy_to_clipboard(
                                          "ID",
                                          bankDataref.current.Upid_ID
                                        )
                                      }
                                    ></i>
                                  </span>
                                </div>

                                  <div className="pay-flex">
                                    <span className="pay-name mt-4">
                                      Payment QR Code
                                    </span>
                                    <span className="pay-money">
                                    <img
                                    src={bankDataref.current.QRcode}
                                    width="150px"
                                    className="mx-auto d-block"
                                    alt="Payment QR Code"
                                  /></span>
                                  </div>
                              </div>
                            </div>
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
                      orderTyperef.current == "Sell" &&
                        UserIDref.current == p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 &&
                        sellTimerstatusref.current == "active" ? (
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
                          <p className="pay-name mt-4" >- Buyer paid the amount</p>
                          <p className="pay-name">- Release the crypto within 15 minutes</p>
                          <p className="pay-name">
                            - If you are not release within 15 mintutes, order
                            will be disputed automatically
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
                        UserIDref.current == p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                          <div className="aling_caseds justify-content-end">
                            {confirmorderloader == false ? (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                onClick={handleChange_confirm}
                              >
                                Confirm Release
                              </button>
                            ) : (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                              >
                                Processing.....
                              </button>
                            )}

                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              data-bs-toggle="modal"
                              data-bs-target="#raise_dispute_sell"
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
                        UserIDref.current != p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 &&
                        sellTimerstatusref.current == "active" ? (
                        // <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                        // <div className="aling_caseds justify-content-end">
                        //   <button
                        //     type="button"
                        //     class="proceed-btn txt-center"
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
                          <p className="pay-name mt-4">- Buyer paid the amount</p>
                          <p className="pay-name">- Release the crypto within 15 minutes</p>
                          <p className="pay-name">
                            - If you are not release within 15 mintutes, order
                            will be disputed automatically
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
                        UserIDref.current != p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                          <div className="aling_caseds justify-content-end">
                            {confirmorderloader == false ? (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                onClick={handleChange_confirm}
                              >
                                Confirm Release
                              </button>
                            ) : (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                              >
                                Processing.....
                              </button>
                            )}

                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              data-bs-toggle="modal"
                              data-bs-target="#raise_dispute_sell"
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
                        UserIDref.current == p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 0 &&
                        Timerstatusref.current == "active" ? (
                        <div className="timer">
                          <h6>
                            Payment to be made within{" "}
                            {payTimeref.current < 60
                              ? payTimeref.current + " minutes"
                              : payTimeref.current / 60 == 1
                                ? payTimeref.current / 60 + " hour"
                                : payTimeref.current / 60 + " hours"}{" "}
                            <span>
                              <Countdown
                                date={Timerref.current}
                                renderer={renderer}
                              />
                            </span>
                          </h6>
                          <p className="pay-name mt-4">- Please pay fast</p>
                          <p className="pay-name">- Do not accept third party payment</p>
                          <p className="pay-name">
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
                        UserIDref.current == p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 0 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                          <div className="aling_caseds justify-content-end">
                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              onClick={handleChange_buycancel}
                            >
                              Cancel
                            </button>

                            {confirmorderloader == false ? (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                onClick={handleChange_confirm}
                              >
                                Confirm Payment
                              </button>
                            ) : (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
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
                        UserIDref.current != p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 0 &&
                        Timerstatusref.current == "active" ? (
                        <div className="timer">
                          <h6>
                            Payment to be made within{" "}
                            {payTimeref.current < 60
                              ? payTimeref.current + " minutes"
                              : payTimeref.current / 60 == 1
                                ? payTimeref.current / 60 + " hour"
                                : payTimeref.current / 60 + " hours"}{" "}
                            <span>
                              <Countdown
                                date={Timerref.current}
                                renderer={renderer}
                              />
                            </span>
                          </h6>
                          <p className="pay-name mt-4">- Please pay fast</p>
                          <p className="pay-name">- Do not accept third party payment</p>
                          <p className="pay-name">
                            - If you are not pay within{" "}
                            {payTimeref.current < 60
                              ? payTimeref.current + " minutes"
                              : payTimeref.current / 60 == 1
                                ? payTimeref.current / 60 + " hour"
                                : payTimeref.current / 60 + " hours"}{" "}
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
                        UserIDref.current != p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 0 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading cancel-payment-butns">
                          <div className="aling_caseds justify-content-star payment-cancel-confirm">
                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              onClick={handleChange_buycancel}
                            >
                              Cancel
                            </button>

                            {confirmorderloader == false ? (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                onClick={handleChange_confirm}
                              >
                                Confirm Payment
                              </button>
                            ) : (
                              <button
                                type="button"
                                class="proceed-btn txt-center"
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
                        UserIDref.current != p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                          <div className="aling_caseds justify-content-end">
                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              data-bs-toggle="modal"
                              data-bs-target="#raise_dispute_buy"
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
                        UserIDref.current == p2pDataref.current?.userId?._id &&
                        confirmp2porderref.current.status == 1 ? (
                        <div class="form register_login  marhing_pading pl-0 paddinte_ledy_o pt-0 right_pading">
                          <div className="aling_caseds justify-content-end">
                            <button
                              type="button"
                              class="proceed-btn txt-center"
                              data-bs-toggle="modal"
                              data-bs-target="#raise_dispute_buy"
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

                    {/* <div className="pay-flex">
                      <span className="pay-method">Total Amount</span>
                      <span className="pay-buy">00.00 INR</span>
                    </div> */}
                    {/* <div className="proceed-btn txt-center">
                      Proceed to payment
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="chat-box">
                    <div className="chat-flex">
                      <div className="p2p_namefrst_change align-items-center">
                        {/* <img
                          src={require("../assets/j.png")}
                          alt="j-img"
                          className="j-img"
                        /> */}
                        {p2pDataref.current.userId?.displayname ? p2pDataref.current.userId.displayname[0] : ""}
                      </div>
                      <div className="chat-content">
                        <span className="pay-btc">
                          {p2pDataref.current.userId?.displayname}
                        </span>
                        <span className="chat-para">
                          {p2pOrdercountref.current} Volume |{" "}
                          {p2pRatingref.current}% Transaction rate
                        </span>
                      </div>
                    </div>
                    {/* inner box */}
                    <div className="inner-box">
                      <div className="chat_section">
                        {profileDataref.current != null
                          ? p2pchatref.current &&
                          p2pchatref.current.map((chat, i) => {
                            return chat.type == "advertiser" ? (
                              chat.user_id == UserIDref.current &&
                                chat.default == 0 ? (
                                <div className="char_recive w-100 d-flex justify-content-end">
                                  <div className=" char_send">
                                    <div className="chat_conent p_new_end">
                                      <p>
                                        {/* <span>{chat.adv_name}</span>{" "} */}
                                        {Moment(chat.createdAt).format("LT")}
                                      </p>

                                      {chat.adv_msg != "" &&
                                        chat.adv_msg != undefined ? (
                                        <div className="j-img-content-two">
                                          {chat.adv_msg}
                                        </div>
                                      ) : chat.user_msg != "" &&
                                        chat.user_msg != undefined ? (
                                        <div className="j-img-content-two">
                                          {chat.user_msg}
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {chat.adv_file != "" &&
                                        chat.adv_file != undefined ? (
                                        <img
                                          src={chat.adv_file}
                                          width="250px"
                                          className=""
                                        />
                                      ) : chat.user_file != "" &&
                                        chat.user_file != undefined ? (
                                        <img
                                          src={chat.user_file}
                                          width="250px"
                                          className=""
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : chat.user_id != UserIDref.current ? (
                                <div className="char_recive">
                                  <div className="chat_conent">
                                    <p>
                                      {/* <span>{chat.adv_name}</span>{" "} */}
                                      {Moment(chat.createdAt).format("LT")}
                                    </p>

                                    {chat.user_msg != "" &&
                                      chat.user_msg != undefined ? (
                                      <div className="j-img-content-two">
                                        {chat.user_msg}
                                      </div>
                                    ) : chat.adv_msg != "" &&
                                      chat.adv_msg != undefined ? (
                                      <div className="j-img-content-two">
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
                                        width="250px"
                                      />
                                    ) : chat.adv_file != "" &&
                                      chat.adv_file != undefined ? (
                                      <img
                                        src={chat.adv_file}
                                        width="250px"
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
                            ) : chat.user_id == UserIDref.current &&
                              chat.default == 0 ? (
                              <div className="char_recive w-100 d-flex justify-content-end">
                                <div className=" char_send">
                                  <div className="chat_conent p_new_end">
                                    <p>
                                      <span>{/* {chat.user_name} */}</span>{" "}
                                      {Moment(chat.createdAt).format("LT")}
                                    </p>

                                    {chat.user_msg != "" &&
                                      chat.user_msg != undefined ? (
                                      <div className="j-img-content-two">
                                        {chat.user_msg}
                                      </div>
                                    ) : chat.adv_msg != "" &&
                                      chat.adv_msg != undefined ? (
                                      <div className="j-img-content-two">
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
                                        width="250px"
                                      />
                                    ) : chat.adv_file != "" &&
                                      chat.adv_file != undefined ? (
                                      <img
                                        src={chat.adv_file}
                                        width="250px"
                                        className=""
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : chat.user_id != UserIDref.current ? (
                              <div className="char_recive">
                                <div className="chat_conent">
                                  <p>
                                    {/* <span>{chat.user_name}</span>{" "} */}
                                    {Moment(chat.createdAt).format("LT")}
                                  </p>

                                  {chat.user_msg != "" &&
                                    chat.user_msg != undefined ? (
                                    <div className="j-img-content-two">
                                      {chat.user_msg}
                                    </div>
                                  ) : chat.adv_msg != "" &&
                                    chat.adv_msg != undefined ? (
                                    <div className="j-img-content-two">
                                      {chat.adv_msg}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {chat.user_file != "" &&
                                    chat.user_file != undefined ? (
                                    <img
                                      src={chat.user_file}
                                      width="250px"
                                      className=""
                                    />
                                  ) : chat.adv_file != "" &&
                                    chat.adv_file != undefined ? (
                                    <img
                                      src={chat.adv_file}
                                      width="250px"
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
                    </div>

                    {confirmp2porderref.current.status != 2 ? (
                      <div className="start-wrapper">
                        <input
                          type="text"
                          placeholder="Start chat here"
                          name="message"
                          value={message}
                          onChange={handleChange}
                          className="start-input"
                        />

                        {chatloading == false ? (
                          <div className="start-icon" onClick={submitChat}>
                            <img
                              src={require("../assets/start-arrow.png")}
                              alt=""
                            />
                          </div>
                        ) : (
                          <div className="start-icon">
                            <i class="fa-solid fa-spinner fa-spin p2p_chat_send"></i>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="modal fade"
            id="raise_dispute_buy"
            tabindex="-1"
            aria-labelledby="raise_dispute_buyLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content">
                <div class="modal-header lvl-one-header">
                  <h1 class="modal-title fs-5" id="raise_dispute_buyLabel">
                    Reason for dispute
                  </h1>
                  <button
                    type="button"
                    class="btn-close btn-close-custom"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                {/* <div className="modal-not-header">
                  <div className="modal-notify-content">
                    To complete level one verification, Please provide your
                    basic information. Thank you!
                  </div>
                </div> */}

                <div className="modal-body personal_verify_body lvl-one-body">
                  <div className="mar-top-12">
                    <div className="first_name">
                      <h4 className="select_id_text">Name</h4>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-100"
                        name="query"
                        maxLength={40}
                        value={disputequeryref.current}
                        onChange={dispute_handleChange}
                      />
                    </div>

                    <div className="first_name my-4">
                      <h4 className="select_id_text">Attachment</h4>
                    </div>

                    <div className="upload-container">
                    {raiseloaderref.current == false ? (
                      raiseValid == 0 ? (
                        <div className="inner_frst_display">
                        <i class="fa-solid fa-cloud-arrow-up font_soze_12"></i>
                        <p>Upload front of your document</p>
                      </div>
                      ): (
                        <img
                        src={disputefileref.current}
                        className="up_im_past"
                        alt="Dispute proof"
                      />
                      )
                    ) : (
                      <div className="inner_frst_display">
<i class="fa-solid fa-spinner fa-spin"></i>
</div>
                    )}

                      <input
                        type="file"
                        name="file"
                        onChange={(e) =>
                          disputeUpload("file", e.target.files[0])
                        }
                        className="image_upload_kyc"
                      />

                     <p className="pay-name text-center mt-4">{raisenameref.current}</p>

                    </div>
                    <div class=" bor-top-next">
                      <button
                        className="modal_continue_btn mt-4 "
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        // onClick={thirdSubmit}
                        onClick={dispute_buy}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="modal fade"
            id="raise_dispute_sell"
            tabindex="-1"
            aria-labelledby="raise_dispute_sellLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content">
                <div class="modal-header lvl-one-header">
                  <h1 class="modal-title fs-5" id="raise_dispute_sellLabel">
                    Reason for dispute
                  </h1>
                  <button
                    type="button"
                    class="btn-close btn-close-custom"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                {/* <div className="modal-not-header">
                  <div className="modal-notify-content">
                    To complete level one verification, Please provide your
                    basic information. Thank you!
                  </div>
                </div> */}

                <div className="modal-body personal_verify_body lvl-one-body">
                  <div className="mar-top-12">
                    <div className="first_name">
                      <h4 className="select_id_text">Name</h4>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-100"
                        name="query"
                        maxLength={40}
                        value={disputequeryref.current}
                        onChange={dispute_handleChange}
                      />
                    </div>

                    <div className="first_name my-4">
                      <h4 className="select_id_text">Attachment</h4>
                    </div>

                    <div className="upload-container">
                    {raiseloaderref.current == false ? (
                      raiseValid == 0 ? (
                        <div className="inner_frst_display">
                        <i class="fa-solid fa-cloud-arrow-up font_soze_12"></i>
                        <p>Upload front of your document</p>
                      </div>
                      ): (
                        <img
                        src={disputefileref.current}
                        className="up_im_past"
                        alt="Dispute proof"
                      />
                      )
                    ) : (
                      <div className="inner_frst_display">
<i class="fa-solid fa-spinner fa-spin"></i>
</div>
                    )}

                      <input
                        type="file"
                        name="file"
                        onChange={(e) =>
                          disputeUpload("file", e.target.files[0])
                        }
                        className="image_upload_kyc"
                      />
                      <p className="pay-name text-center mt-4">{raisenameref.current}</p>

                    </div>
                    <div class=" bor-top-next">
                      <button
                        className="modal_continue_btn mt-4"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={dispute_sell}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
