import React, { useEffect, useRef } from "react";
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
import { useTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";


const Payment = () => {
  const { t } = useTranslation();
    const navigate = useNavigate();
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


  const disputeReasonOptions = [
    {
      key: 'no_payment',
      value: 'I haven\'t received payment from the buyer.',
      text: t('I haven\'t received payment from the buyer.'),
    },
    {
      key: 'no_payment1',
      value: 'I haven\'t received payment from the seller.',
      text: t('I haven\'t received payment from the seller.'),
    },
    {
      key: 'less_payment',
      value: 'The buyer paid less than the required amount.',
      text: t('The buyer paid less than the required amount.'),
    },
    {
      key: 'account_frozen',
      value: 'After I received the payment, my account got frozen.',
      text: t('After I received the payment, my account got frozen.'),
    },
    {
      key: 'name_mismatch',
      value: 'The name of the payer is different from the name of the buyer on the platform.',
      text: t('The name of the payer is different from the name of the buyer on the platform.'),
    },
    {
      key: 'name_mismatch1',
      value: 'The name of the payer is different from the name of the seller on the platform.',
      text: t('The name of the payer is different from the name of the seller on the platform.'),
    },
    {
      key: 'others',
      value: 'others',
      text: t('others'),
    },
  ];

  const [remainingSeconds, setRemainingSeconds] = useState(null);


  const [siteLoader, setSiteLoader, siteLoaderref] = useState(false);
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
  const [disputeReason, setdisputeReason, disputeReasonref] = useState("");
  const [appealstatus, setappealstatus, appealstatusref] = useState(false);


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
  const [disputeDetails, setdisputeDetails, disputeDetailsref] = useState({});

  const ratingModalRef = useRef(null);
  const currentOrderForRating = useRef(null);

  const submitP2PRating = (orderId, stars) => {
    try {
      const payload = { orderId, stars };

      postMethod({ apiUrl: apiService.p2p_user_ratings, payload })
        .then((resp) => {
          console.error("p2p rating saved resp:", resp);
          // NOW call refresh APIs here
          getp2pChat();
          getp2pOrder();
          getconfirmOrder();
        })
        .catch((err) => {
          console.error("p2p rating save error:", err);
        });
    } catch (e) {
      console.error("submitP2PRating fire error:", e);
    }
    // finally {
    //   // Immediately navigate away (no waiting)
    //   navigate("/p2p");
    // }
    setTimeout(() => navigate("/p2p"), 200);
  };

  // ------------- SHOW RATING MODAL -------------
  const showRatingModalForOrder = (orderId) => {
    currentOrderForRating.current = orderId;

    // If Bootstrap is loaded globally, use window.bootstrap.Modal
    const modalEl = document.getElementById("p2pRatingModal");
    let bsModal;
    if (modalEl) {
      // Use existing instance or create new
      bsModal =
        window.bootstrap && window.bootstrap.Modal
          ? window.bootstrap.Modal.getInstance(modalEl) ||
            new window.bootstrap.Modal(modalEl)
          : null;

      if (bsModal) bsModal.show();
    }
  };

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
    console.log("p2p chat resp", resp);
    if (resp) {
      var data = resp.Message;
      setp2pchat(data);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // console.log("value", value);
    const santisedValue = value.replace(/^\s+/, "");
    let formData = { ...formValue, ...{ [name]: santisedValue } };
    setFormValue(formData);
  };

  const [UserID, setUserID, UserIDref] = useState("");

  useEffect(() => {
    setSiteLoader(true);
    const token = sessionStorage.getItem("PTKToken");
    const PTK = token.split("_")[1];
    setUserID(PTK);

    const urls = window.location.href;
    // console.log(urls, "urls");
    const chat = urls.split("/").pop();
    // console.log(chat, "chat");

    setheadurl(chat);

    // let socket_token = localStorage.getItem("socketToken");
    let socket_token = sessionStorage.getItem("socketToken");
    // console.log(socket_token, "inniknkijn");
    let socketsplit = socket_token?.split(`"_`);
    // console.log("socketsplit --> ",socketsplit);
    socket.connect();
    getProfile();

    // const socketEventname = "socketResponse" + socketsplit[0] ;

    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      console.log("socketResponse ressss-->>", res);
      if (res.Reason == "p2pchat") {
        getp2pChat();
      } else if (res.Reason == "notify") {
        setnotifymessage(res.Message);
        showsuccessToast(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        getDispute();
        //getp2pconfirmOrder();
        getconfirmOrder();
      } else if (res.Reason == "ordercancel") {
        setnotifymessage(res.Message);
        showsuccessToast(res.Message, {
          toastId: "3",
        });
        getp2pOrder();
        getDispute();
        //getp2pconfirmOrder();
        getconfirmOrder();
      }
    });

    socket.emit("socketResponse");

    setSiteLoader(false);
    // socket.on("socketResponse", async (response) => {
    //   console.log("response====>>>",response);
    // })

    // return () => {
    //   socket.off("socketResponse");
    // };
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
            getDispute();
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
        // setbankData(resp.bank);
        if (UserIDref.current == resp.user_id) {
          setbankData(resp.opp_userbank);
        }
        else if (UserIDref.current == resp.opp_user_id) {
          setbankData(resp.user_bank);
        }
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


  const getDispute = async () => {
    setSiteLoader(true);

    const payload = {
      orderId: headurlref.current,
    };

    const data = {
      apiUrl: apiService.getdispute,
      payload,
    };

    try {
      const resp = await postMethod(data);
      setSiteLoader(false);

      if (resp.status === true) {
        const dispute = resp.Message;
        setdisputeDetails(dispute);

        // If dispute is raised, calculate the remaining time
        if (dispute.status === "raised" && dispute.updatedAt) {
          const updatedTime = new Date(dispute.updatedAt).getTime();
          const now = new Date().getTime();

          const elapsedSeconds = Math.floor((now - updatedTime) / 1000);
          const totalSeconds = 20 * 60; // 20 minutes = 1200 seconds
          // const totalSeconds = 1 * 60;
          const remaining = totalSeconds - elapsedSeconds;

          if (remaining > 0) {
            setRemainingSeconds(remaining);

            let seconds = remaining;
            const timerInterval = setInterval(() => {
              seconds--;
              setRemainingSeconds(seconds);

              if (seconds <= 0) {
                clearInterval(timerInterval);
              }
            }, 1000);
          } else {
            setRemainingSeconds(0); // Already passed 20 minutes
          }
        }
      }
    } catch (error) {
      console.error("Error fetching dispute:", error);
      setSiteLoader(false);
    }
  };


  const Updatedispute = async (status) => {
    setSiteLoader(true);

    const payload = {
      orderId: headurlref.current,
      status: status
    };

    const data = {
      apiUrl: apiService.updatedispute,
      payload,
    };

    try {
      const resp = await postMethod(data);
      setSiteLoader(false);

      if (resp.status === true) {
        getDispute();
      }
    } catch (error) {
      console.error("Error fetching dispute:", error);
      setSiteLoader(false);
    }
  };

  // get_dispute

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
      } else if (resp.Message.status == 1 && resp.Message.dispute_status == 0) {
        var timer = new Date(resp.Message.paytime).getTime() + 15 * 60 * 1000;
        var current_time = new Date().getTime();
        if (timer > current_time) {
          setsellTimerstatus("active");
          setsellTimer(timer);
        }
      }
      else if (resp.Message.dispute_status == 1) {
        var timer = new Date(resp.Message.updatedAt).getTime() + 15 * 60 * 1000;
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
        showsuccessToast(resp.Message);
        // navigate(`/p2p/complete/${order_Id}`)
        const orderId = window.location.href.split("/").pop();
        showRatingModalForOrder(orderId);
        // getp2pChat();
        // getp2pOrder();
        // getconfirmOrder();
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
        UserIDref.current == p2pDataref.current.userId._id ? "advertiser" : "user";

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
      setconfirmloader(true);
      var resp = await postMethod(data);
      if (resp.status) {
        setconfirmloader(false);
        setSiteLoader(false);
        showsuccessToast(resp.Message);
        setRunningTimer(false);
        clearInterval(intervalref.current);
        // navigate("/p2p");
        const orderId = window.location.href.split("/").pop();
         setTimeout(() => {
           showRatingModalForOrder(orderId);
         }, 300);
        // getp2pOrder();
        // getconfirmOrder();
        // setRunningTimer(false);
        // clearInterval(intervalref.current);
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
        // getp2pChat();
        // getp2pOrder();
        // navigate("/p2p");
         const orderId = window.location.href.split("/").pop();
         showRatingModalForOrder(orderId);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) { }
  };

  // const handleChange_confirm = async (e) => {
  //   e.preventDefault();
  //   if (e.target.innerText == "Confirm Payment") {
  //     buyer_confirmation("Completed");
  //   } else if (e.target.innerText == "Confirm Release") {
  //     seller_confirmation("Completed");
  //   }
  // };

   const handleChange_confirm = async (action) => {
    console.log("confimed actions----",action)
    if (action == "payment") {
      buyer_confirmation("Completed");
    } else if (action == "release") {
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
      // navigate("/p2p");
      const orderId = window.location.href.split("/").pop();
      showRatingModalForOrder(orderId);
    }
  };

  const dispute_handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // const sanitizedValue = value.replace(/\s/g, "");
    setdisputequery(value);
  };


  const [raiseloader, setraiseloader, raiseloaderref] = useState(false);
  const [raiseValid, setraiseValid] = useState(0);
  const [raisename, setraisename, raisenameref] = useState("");



  const UploadImage = (type, val) => {
    setSiteLoader(true);
    const fileExtension = val.name.split(".").at(-1);
    const fileSize = val.size;
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "pdf" &&
      fileExtension != "doc" &&
      fileExtension != "docx"
    ) {
      setSiteLoader(false);
      showerrorToast(
        "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
      );
      return false;
    } else if (fileSize > 10000000) {
      setSiteLoader(false);

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
        .then(async (data) => {

          if (type == "file") {
            setp2pfile(data.secure_url);
            await submitChat();
          }
          setSiteLoader(false);

        })
        .catch((err) => {
          setSiteLoader(false);

          console.log(err);
        });
    }
  };




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
          setraisename("");
          getDispute();
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
          setraisename("");

          getDispute();
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
      {siteLoaderref.current == true ? (
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
        <div>
          <div className="Verification">
            <div className="container">
              <div>
                <div className="row justify-content-center payment-cards mt-4">
                  <div className="col-lg-6">
                    <h5 className="pay-title">
                      {orderTyperef.current == "Buy" ? (
                        <h1 className="mb-4">
                          {t("youarebuying")} {p2pDataref.current.firstCurrency}
                        </h1>
                      ) : (
                        <h1 className="mb-4">
                          {t("youareselling")}{" "}
                          {p2pDataref.current.firstCurrency}
                        </h1>
                      )}
                    </h5>
                    {profileDataref.current != null ? (
                      orderTyperef.current == "Buy" &&
                      profileDataref.current._id ==
                        p2pDataref.current.user_id &&
                      confirmp2porderref.current.status == 0 &&
                      Timerstatusref.current == "active" ? (
                        <p className="pay-content">
                          {t("completethepaymentwithin")}{" "}
                          <span className="pay-span">
                            {p2pDataref.current.pay_time}
                          </span>{" "}
                          {t("otherwisetheorderwillbecanceled")}
                        </p>
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )}
                    <div className="pay-wrapper-two">
                      <div className="pay-flex">
                        <span className="pay-btc">{t("orderDetails")}</span>
                      </div>
                      <div className="pay-flex">
                        <span className="pay-name">{t("price")}</span>
                        <span className="pay-money">
                          {parseFloat(p2pDataref.current.price).toFixed(2)}{" "}
                          <span className="pay-name">
                            {" "}
                            {p2pDataref.current.secondCurrnecy}{" "}
                          </span>{" "}
                        </span>
                      </div>
                      <div className="pay-flex">
                        <span className="pay-name">{t("amount")}</span>
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
                            <span className="pay-name">{t("willReceive")}</span>
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
                            {confirmp2porderref.current.paymentMethod !=
                            null ? (
                              bankDataref.current ? (
                                <div className="color_border ne_bg_txt">
                                  <div className="pay-wrapper">
                                    <div className="pay-flex">
                                      <span className="pay-method">
                                        {t("payment_Method")}
                                      </span>
                                      <span className="pay-bank">
                                        {p2pDataref.current.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="pay-flex">
                                      <span className="pay-method">
                                        {t("selectedPaymentMethod")}
                                      </span>
                                      <span className="pay-bank">
                                        {
                                          confirmp2porderref.current
                                            .paymentMethod
                                        }
                                      </span>
                                      {/* <span className="pay-bank">
                                        {p2pDataref.current.paymentMethod}
                                      </span> */}
                                    </div>
                                    <div className="pay-flex">
                                      <span className="pay-name">
                                        {t("bankAccountDetails")}
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
                                        {t("account_name")}
                                      </span>
                                      <span className="pay-money">
                                        {" "}
                                        {bankDataref.current.Accout_HolderName}
                                        <i
                                          class="ri-file-copy-line cursor-pointer"
                                          onClick={() =>
                                            copy_to_clipboard(
                                              t("account_name"),
                                              bankDataref.current
                                                .Accout_HolderName
                                            )
                                          }
                                        ></i>
                                      </span>
                                    </div>
                                    <div className="pay-flex">
                                      <span className="pay-name">
                                        {t("bankName")}
                                      </span>
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
                                        {t("Currency")}
                                      </span>
                                      <span className="pay-money">
                                        {" "}
                                        {bankDataref.current.Currency}
                                        <i
                                          class="ri-file-copy-line cursor-pointer"
                                          onClick={() =>
                                            copy_to_clipboard(
                                              t("Currency"),
                                              bankDataref.current.Currency
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
                            {confirmp2porderref.current.paymentMethod !=
                            null ? (
                              bankDataref.current ? (
                                <div className="color_border ne_bg_txt">
                                  <div className="pay-wrapper">
                                    <div className="pay-flex">
                                      <span className="pay-method">
                                        {t("payment_Method")}
                                      </span>
                                      <span className="pay-bank">
                                        {p2pDataref.current.paymentMethod}
                                      </span>
                                    </div>
                                    <div className="pay-flex">
                                      <span className="pay-method">
                                        {t("selectedPaymentMethod")}
                                      </span>
                                      <span className="pay-bank">
                                        {
                                          confirmp2porderref.current
                                            .paymentMethod
                                        }
                                      </span>
                                    </div>

                                    <div className="pay-flex">
                                      <span className="pay-name">
                                        {t("bankAccountDetails")}
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
                                        {t("account_name")}
                                      </span>
                                      <span className="pay-money">
                                        {" "}
                                        {bankDataref.current.Accout_HolderName}
                                        <i
                                          class="ri-file-copy-line cursor-pointer"
                                          onClick={() =>
                                            copy_to_clipboard(
                                              t("account_name"),
                                              bankDataref.current
                                                .Accout_HolderName
                                            )
                                          }
                                        ></i>
                                      </span>
                                    </div>

                                    <div className="pay-flex">
                                      <span className="pay-name">
                                        {t("bankName")}
                                      </span>
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
                                        {t("Currency")}
                                      </span>
                                      <span className="pay-money">
                                        {" "}
                                        {bankDataref.current.Currency}
                                        <i
                                          class="ri-file-copy-line cursor-pointer"
                                          onClick={() =>
                                            copy_to_clipboard(
                                              t("Currency"),
                                              bankDataref.current.Currency
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
                            ) : (
                              ""
                            )}

                            <p className="preview mt-3 timer_element">
                              {t("pleasedothepaymentin")}{" "}
                              <span className="primary_red">
                                {payTimeref.current} {t("minutes")}
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
                        orderTyperef.current == "Sell" &&
                        UserIDref.current == p2pDataref.current.userId?._id &&
                        confirmp2porderref.current.status == 1 &&
                        sellTimerstatusref.current == "active" ? (
                          <div className="timer">
                            <h6>
                              {t("releasethecrypto")}
                              <span>
                                <Countdown
                                  date={sellTimerref.current}
                                  renderer={renderer_sell}
                                />
                              </span>
                            </h6>
                            <p className="pay-name mt-4">
                              - {t("buyerpaidtheamount")}
                            </p>
                            <p className="pay-name">
                              - {t("releasethecrypto")}
                            </p>
                            <p className="pay-name">
                              - {t("ifyouarenotreleasewithin")}
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
                                  // onClick={handleChange_confirm}
                                  onClick={() =>
                                    handleChange_confirm("release")
                                  }
                                >
                                  {t("confirmRelease")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                >
                                  {t("processing")}.....
                                </button>
                              )}

                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                data-bs-toggle="modal"
                                data-bs-target="#raise_dispute_sell"
                                onClick={() => {
                                  setdisputeReason("");
                                  setappealstatus(false);
                                }}
                              >
                                {t("raisDispute")}
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
                          <div className="timer">
                            <h6>
                              {t("releasethecrypto")}
                              <span>
                                <Countdown
                                  date={sellTimerref.current}
                                  renderer={renderer_sell}
                                />
                              </span>
                            </h6>
                            <p className="pay-name mt-4">
                              - {t("buyerpaidtheamount")}
                            </p>
                            <p className="pay-name">
                              - {t("releasethecrypto")}
                            </p>
                            <p className="pay-name">
                              - {t("ifyouarenotreleasewithin")}
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
                                  // onClick={handleChange_confirm}
                                  onClick={() =>
                                    handleChange_confirm("release")
                                  }
                                >
                                  {t("confirmRelease")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                >
                                  {t("processing")}.....
                                </button>
                              )}

                              <button
                                type="button"
                                class="proceed-btn txt-center"
                                data-bs-toggle="modal"
                                data-bs-target="#raise_dispute_sell"
                              >
                                {t("raisDispute")}
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
                              {t("paymenttobemadewithin")}{" "}
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
                            <p className="pay-name mt-4">
                              - {t("pleasepayfast")}
                            </p>
                            <p className="pay-name">
                              - {t("donotacceptthirdpartypayment")}
                            </p>
                            <p className="pay-name">
                              - {t("ifyouarenotpaywithin")}{" "}
                              {payTimeref.current < 60
                                ? payTimeref.current + " minutes"
                                : payTimeref.current / 60 == 1
                                ? payTimeref.current / 60 + " hour"
                                : payTimeref.current / 60 + " hours"}
                              , {t("orderwillbecancelledautomatically")}
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
                                {t("cancel")}
                              </button>

                              {confirmorderloader == false ? (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                  // onClick={handleChange_confirm}
                                  onClick={() =>
                                    handleChange_confirm("payment")
                                  }
                                >
                                  {t("confirmPayment")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                >
                                  {t("processing")}.....
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
                            <h6 className="timer_in_title">
                              {t("paymenttobemadewithin")}{" "}
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
                            <p className="pay-name mt-4">
                              - {t("pleasepayfast")}
                            </p>
                            <p className="pay-name">
                              - {t("donotacceptthirdpartypayment")}
                            </p>
                            <p className="pay-name">
                              - {t("ifyouarenotpaywithin")}{" "}
                              {payTimeref.current < 60
                                ? payTimeref.current + " minutes"
                                : payTimeref.current / 60 == 1
                                ? payTimeref.current / 60 + " hour"
                                : payTimeref.current / 60 + " hours"}{" "}
                              {t("orderwillbecancelledautomatically")}
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
                                {t("cancel")}
                              </button>

                              {confirmorderloader == false ? (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                  // onClick={handleChange_confirm}
                                  onClick={() =>
                                    handleChange_confirm("payment")
                                  }
                                >
                                  {t("confirmPayment")}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  class="proceed-btn txt-center"
                                >
                                  {t("processing")}.....
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
                                {t("raisDispute")}
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
                                {t("raisDispute")}
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
                  <div className="col-lg-6">
                    <div className="chat-box">
                      <div className="chat-flex">
                        <div className="p2p_namefrst_change align-items-center">
                          {p2pDataref.current.userId?.displayname
                            ? p2pDataref.current.userId.displayname[0]
                            : ""}
                        </div>
                        <div className="chat-content">
                          <span className="pay-btc">
                            {p2pDataref.current.userId?.displayname}
                          </span>
                          <span className="chat-para">
                            {p2pOrdercountref.current} Volume |{" "}
                            {parseFloat(p2pRatingref.current).toFixed(2)}%
                            Transaction rate
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
                                            {Moment(chat.createdAt).format(
                                              "LT"
                                            )}
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                submitChat();
                              }
                            }}
                          />

                          {chatloading == false ? (
                            <>
                              <div
                                className="start-icon1"
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                              >
                                <img
                                  src={require("../assets/Attach.png")}
                                  alt="Attach"
                                  style={{ cursor: "pointer" }}
                                />
                              </div>

                              <input
                                type="file"
                                id="fileInput"
                                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    UploadImage("file", file);
                                  }
                                }}
                              />

                              <div className="start-icon" onClick={submitChat}>
                                <img
                                  src={require("../assets/start-arrow.png")}
                                  alt=""
                                />
                              </div>
                            </>
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
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-header lvl-one-header">
                    <button
                      type="button"
                      className="btn-close btn-close-custom"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  {disputeDetailsref.current.status === "raised" &&
                  remainingSeconds != null ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t(
                              "Appeal submitted. Awaiting response from other party."
                            )}
                          </h4>
                          <p className="select_id_text mb-3">
                            {t("The other party must respond within:")}{" "}
                            {Math.floor(remainingSeconds / 60)}m{" "}
                            {remainingSeconds % 60}s
                          </p>

                          <ol>
                            <li className="select_id_text1 mb-3">
                              {t("If both parties agree, click")}{" "}
                              <b>{t("Cancel Appeal")}</b>.
                            </li>
                            <li className="select_id_text1 mb-3">
                              {t(
                                "If no response in 20 minutes, arbitration starts."
                              )}
                            </li>
                            <li className="select_id_text1 mb-3">
                              {t("You can upload more evidence anytime.")}
                            </li>
                          </ol>

                          {remainingSeconds == 0 ? (
                            <div className="bor-top-next">
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("not_resolved")}
                              >
                                {t("Not Resolved")}
                              </button>
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("resolved")}
                              >
                                {t("Issues Resolved")}
                              </button>
                            </div>
                          ) : (
                            <div className="bor-top-next">
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("cancel")}
                              >
                                {t("Cancel Appeal")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : disputeDetailsref.current.status === "resolved" ||
                    disputeDetailsref.current.status === "cancel" ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t("Issues Resolved")}
                          </h4>

                          <img
                            src={require("../assets/leaderboard-success.png")}
                            alt="leaderboard-success"
                            width="50%"
                            className="d-block mx-auto"
                          />

                          <div className="bor-top-next">
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              {t("Back")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : disputeDetailsref.current.status === "not_resolved" ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t("Awaiting Assistance from Customer Service")}
                          </h4>
                          <p className="select_id_text mb-3">
                            {t(
                              "Customer service is reviewing this appeal. processing may take several hours."
                            )}
                          </p>

                          {/* <p className="select_id_text mb-3">
                          Customer service is reviewing this appeal. processing may take several hours.
                        </p> */}

                          <div className="bor-top-next">
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              {t("Back")}
                            </button>
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => Updatedispute("resolved")}
                            >
                              {t("Issues Resolved")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          {remainingSeconds === null && (
                            <div className="first_name">
                              <h4 className="modal-title mb-4">
                                {t("Raise Help")}
                              </h4>

                              <h4 className="select_id_text">
                                {t("Experiencing problems")}?
                              </h4>
                              <Dropdown
                                placeholder={t("Select a Appeal reason")}
                                fluid
                                selection
                                className="dep-drops"
                                options={disputeReasonOptions}
                                value={disputeReason}
                                onChange={(e, { value }) =>
                                  setdisputeReason(value)
                                }
                              />
                            </div>
                          )}

                          {disputeReason &&
                            appealstatus &&
                            remainingSeconds === null && (
                              <>
                                <div className="first_name mt-3">
                                  <h4 className="select_id_text">
                                    {t("query")}
                                  </h4>
                                  <input
                                    type="text"
                                    placeholder="Enter your query"
                                    className="w-100"
                                    name="query"
                                    maxLength={40}
                                    value={disputequery}
                                    onChange={dispute_handleChange}
                                  />
                                </div>

                                <div className="first_name my-4">
                                  <h4 className="select_id_text">
                                    {t("attachment")}
                                  </h4>
                                </div>

                                <div className="upload-container">
                                  {!raiseloader ? (
                                    raiseValid === 0 ? (
                                      <div className="inner_frst_display">
                                        <i className="fa-solid fa-cloud-arrow-up font_soze_12"></i>
                                        <p>{t("uploadfront")}</p>
                                      </div>
                                    ) : (
                                      <img
                                        src={disputefile}
                                        className="up_im_past"
                                        alt="Dispute proof"
                                      />
                                    )
                                  ) : (
                                    <div className="inner_frst_display">
                                      <i className="fa-solid fa-spinner fa-spin"></i>
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

                                  {raisenameref.current && (
                                    <p className="pay-name text-center mt-4">
                                      {raisenameref.current}
                                    </p>
                                  )}
                                </div>

                                <div className="bor-top-next">
                                  <button
                                    className="modal_continue_btn mt-4"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={dispute_buy}
                                  >
                                    {t("Submit Appeal")}
                                  </button>
                                </div>
                              </>
                            )}

                          {/* Appeal not yet submitted and reason selected */}
                          {disputeReason &&
                            !appealstatus &&
                            remainingSeconds === null && (
                              <div className="first_name mt-3">
                                <h4 className="select_id_text1">
                                  {t(
                                    "You can try to resolve the issue by following these steps"
                                  )}
                                  :
                                </h4>
                                <h4 className="select_id_text">
                                  1.{" "}
                                  {t(
                                    "Make sure your account information is correct"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text">
                                  2. {t("Check the")}{" "}
                                  {orderTyperef.current == "Buy"
                                    ? "seller's"
                                    : "buyer's"}{" "}
                                  {t(
                                    "payment proof or chat with them for clarification"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text">
                                  3.{" "}
                                  {t(
                                    "Some payment methods may take 1–3 days to complete"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text1">
                                  *{" "}
                                  {t(
                                    "If the issue remains, you can initiate an appeal"
                                  )}
                                  .
                                </h4>

                                <div className="bor-top-next d-flex gap-2">
                                  <button
                                    className="modal_continue_btn mt-4"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setdisputeReason("")}
                                  >
                                    {orderTyperef.current == "Buy"
                                      ? " Contact Seller"
                                      : " Contact Buyer"}
                                  </button>
                                  <button
                                    className="modal_continue_btn mt-4"
                                    // data-bs-dismiss="modal"
                                    // aria-label="Close"
                                    onClick={() => setappealstatus(true)}
                                  >
                                    {t("Appeal")}
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* <div class="modal-dialog modal-dialog-centered modal-md">
              <div class="modal-content">
                <div class="modal-header lvl-one-header">
                  <h1 class="modal-title fs-5" id="raise_dispute_buyLabel">
                    {t('reasonfordispute')}
                  </h1>
                  <button
                    type="button"
                    class="btn-close btn-close-custom"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>


                <div className="modal-body personal_verify_body lvl-one-body">
                  <div className="mar-top-12">
                    <div className="first_name">
                      <h4 className="select_id_text">{t('query')}</h4>
                      <input
                        type="text"
                        placeholder="Enter your query"
                        className="w-100"
                        name="query"
                        maxLength={40}
                        value={disputequeryref.current}
                        onChange={dispute_handleChange}
                      />
                    </div>

                    <div className="first_name my-4">
                      <h4 className="select_id_text">{t('attachment')}</h4>
                    </div>

                    <div className="upload-container">
                      {raiseloaderref.current == false ? (
                        raiseValid == 0 ? (
                          <div className="inner_frst_display">
                            <i class="fa-solid fa-cloud-arrow-up font_soze_12"></i>
                            <p>{t('uploadfront')}</p>
                          </div>
                        ) : (
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
                      {raisenameref.current != "" ? (
                        <p className="pay-name text-center mt-4">{raisenameref.current}</p>
                      ) : (
                        ""
                      )}



                    </div>
                    <div class=" bor-top-next">
                      <button
                        className="modal_continue_btn mt-4 "
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        // onClick={thirdSubmit}
                        onClick={dispute_buy}
                      >
                        {t('submit')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            </div>

            <div
              className="modal fade"
              id="raise_dispute_sell"
              tabIndex="-1"
              aria-labelledby="raise_dispute_sellLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-header lvl-one-header">
                    <button
                      type="button"
                      className="btn-close btn-close-custom"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  {disputeDetailsref.current.status === "raised" &&
                  remainingSeconds != null ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t(
                              "Appeal submitted. Awaiting response from other party."
                            )}
                          </h4>
                          <p className="select_id_text mb-3">
                            {t("The other party must respond within:")}{" "}
                            {Math.floor(remainingSeconds / 60)}m{" "}
                            {remainingSeconds % 60}s
                          </p>

                          <ol>
                            <li className="select_id_text1 mb-3">
                              {t("If both parties agree, click")}{" "}
                              <b>{t("Cancel Appeal")}</b>.
                            </li>
                            <li className="select_id_text1 mb-3">
                              {t(
                                "If no response in 20 minutes, arbitration starts."
                              )}
                            </li>
                            <li className="select_id_text1 mb-3">
                              {t("You can upload more evidence anytime.")}
                            </li>
                          </ol>

                          {remainingSeconds == 0 ? (
                            <div className="bor-top-next">
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("not_resolved")}
                              >
                                {t("Not Resolved")}
                              </button>
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("resolved")}
                              >
                                {t("Issues Resolved")}
                              </button>
                            </div>
                          ) : (
                            <div className="bor-top-next">
                              <button
                                className="modal_continue_btn mt-4"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => Updatedispute("cancel")}
                              >
                                {t("Cancel Appeal")}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : disputeDetailsref.current.status === "resolved" ||
                    disputeDetailsref.current.status === "cancel" ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t("Issues Resolved")}
                          </h4>

                          <img
                            src={require("../assets/leaderboard-success.png")}
                            alt="leaderboard-success"
                            width="50%"
                            className="d-block mx-auto"
                          />

                          <div className="bor-top-next">
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              {t("Back")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : disputeDetailsref.current.status === "not_resolved" ? (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          <h4 className="modal-title mb-4">
                            {t("Awaiting Assistance from Customer Service")}
                          </h4>
                          <p className="select_id_text mb-3">
                            {t(
                              "Customer service is reviewing this appeal. processing may take several hours."
                            )}
                          </p>

                          <p className="select_id_text mb-3">
                            {t(
                              "Customer service is reviewing this appeal. processing may take several hours."
                            )}
                          </p>

                          <div className="bor-top-next">
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              {t("Back")}
                            </button>
                            <button
                              className="modal_continue_btn mt-4"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => Updatedispute("resolved")}
                            >
                              {t("Issues Resolved")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-body personal_verify_body lvl-one-body">
                        <div className="mar-top-12">
                          {remainingSeconds === null && (
                            <div className="first_name">
                              <h4 className="modal-title mb-4">
                                {t("Raise Help")}
                              </h4>

                              <h4 className="select_id_text">
                                {t("Experiencing problems")}?
                              </h4>
                              <Dropdown
                                placeholder={t("Select a Appeal reason")}
                                fluid
                                selection
                                className="dep-drops"
                                options={disputeReasonOptions}
                                value={disputeReason}
                                onChange={(e, { value }) =>
                                  setdisputeReason(value)
                                }
                              />
                            </div>
                          )}

                          {disputeReason &&
                            appealstatus &&
                            remainingSeconds === null && (
                              <>
                                <div className="first_name mt-3">
                                  <h4 className="select_id_text">
                                    {t("query")}
                                  </h4>
                                  <input
                                    type="text"
                                    placeholder="Enter your query"
                                    className="w-100"
                                    name="query"
                                    maxLength={40}
                                    value={disputequery}
                                    onChange={dispute_handleChange}
                                  />
                                </div>

                                <div className="first_name my-4">
                                  <h4 className="select_id_text">
                                    {t("attachment")}
                                  </h4>
                                </div>

                                <div className="upload-container">
                                  {!raiseloader ? (
                                    raiseValid === 0 ? (
                                      <div className="inner_frst_display">
                                        <i className="fa-solid fa-cloud-arrow-up font_soze_12"></i>
                                        <p>{t("uploadfront")}</p>
                                      </div>
                                    ) : (
                                      <img
                                        src={disputefile}
                                        className="up_im_past"
                                        alt="Dispute proof"
                                      />
                                    )
                                  ) : (
                                    <div className="inner_frst_display">
                                      <i className="fa-solid fa-spinner fa-spin"></i>
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

                                  {raisenameref.current && (
                                    <p className="pay-name text-center mt-4">
                                      {raisenameref.current}
                                    </p>
                                  )}
                                </div>

                                <div className="bor-top-next">
                                  <button
                                    className="modal_continue_btn mt-4"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={dispute_sell}
                                  >
                                    {t("Submit Appeal")}
                                  </button>
                                </div>
                              </>
                            )}

                          {/* Appeal not yet submitted and reason selected */}
                          {disputeReason &&
                            !appealstatus &&
                            remainingSeconds === null && (
                              <div className="first_name mt-3">
                                <h4 className="select_id_text1">
                                  {t(
                                    "You can try to resolve the issue by following these steps"
                                  )}
                                  :
                                </h4>
                                <h4 className="select_id_text">
                                  1.{" "}
                                  {t(
                                    "Make sure your account information is correct"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text">
                                  2. {t("Check the")}{" "}
                                  {orderTyperef.current == "Buy"
                                    ? "seller's"
                                    : "buyer's"}{" "}
                                  {t(
                                    "payment proof or chat with them for clarification"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text">
                                  3.{" "}
                                  {t(
                                    "Some payment methods may take 1–3 days to complete"
                                  )}
                                  .
                                </h4>
                                <h4 className="select_id_text1">
                                  *{" "}
                                  {t(
                                    "If the issue remains, you can initiate an appeal"
                                  )}
                                  .
                                </h4>

                                <div className="bor-top-next d-flex gap-2">
                                  <button
                                    className="modal_continue_btn mt-4"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setdisputeReason("")}
                                  >
                                    {orderTyperef.current == "Buy"
                                      ? " Contact Seller"
                                      : " Contact Buyer"}
                                  </button>
                                  <button
                                    className="modal_continue_btn mt-4"
                                    // data-bs-dismiss="modal"
                                    // aria-label="Close"
                                    onClick={() => setappealstatus(true)}
                                  >
                                    {t("Appeal")}
                                  </button>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div
              className="modal fade"
              id="p2pRatingModal"
              tabIndex="-1"
              aria-labelledby="p2pRatingModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content">
                  <div className="modal-header lvl-one-header">
                    <h5 className="modal-title" id="p2pRatingModalLabel">
                      Rate the trade
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-custom"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="modal-body personal_verify_body lvl-one-body text-center">
                    <p className="mb-4 text-whte">
                      Please rate your experience (1-5 stars)
                    </p>

                    <div className="mb-4">
                      {/* clickable stars; each star calls submit immediately */}
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          role="button"
                          style={{
                            fontSize: 32,
                            cursor: "pointer",
                            margin: "0 6px",
                            backgroundColor: "#daecee",
                            color: "#daecee",
                          }}
                          onClick={() => {
                            // get current orderId from ref (set when showing modal)
                            const orderId =
                              currentOrderForRating.current ||
                              window.location.href.split("/").pop();
                            // Hide modal immediately (so user doesn't see it stuck)
                            const modalEl =
                              document.getElementById("p2pRatingModal");
                            if (
                              modalEl &&
                              window.bootstrap &&
                              window.bootstrap.Modal
                            ) {
                              const inst =
                                window.bootstrap.Modal.getInstance(modalEl);
                              if (inst) inst.hide();
                              else new window.bootstrap.Modal(modalEl).hide();
                            }
                            // Submit rating (fire-and-forget) and immediately navigate
                            submitP2PRating(orderId, n);
                            // DELAY TO LET API FIRE AND THEN NAVIGATE
                            setTimeout(() => {
                              navigate("/p2p");
                            }, 200);
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="small text-muted">
                      Thanks for your feedback!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );


};

export default Payment;
