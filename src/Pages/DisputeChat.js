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
import { useTranslation } from "react-i18next";
import { Dropdown } from "semantic-ui-react";


const DisputeChat = () => {
    const { t } = useTranslation();
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
            text: 'I haven\'t received payment from the buyer.',
        },
        {
            key: 'no_payment1',
            value: 'I haven\'t received payment from the seller.',
            text: 'I haven\'t received payment from the seller.',
        },
        {
            key: 'less_payment',
            value: 'The buyer paid less than the required amount.',
            text: 'The buyer paid less than the required amount.',
        },
        {
            key: 'account_frozen',
            value: 'After I received the payment, my account got frozen.',
            text: 'After I received the payment, my account got frozen.',
        },
        {
            key: 'name_mismatch',
            value: 'The name of the payer is different from the name of the buyer on the platform.',
            text: 'The name of the payer is different from the name of the buyer on the platform.',
        },
        {
            key: 'name_mismatch1',
            value: 'The name of the payer is different from the name of the seller on the platform.',
            text: 'The name of the payer is different from the name of the seller on the platform.',
        },
        {
            key: 'others',
            value: 'others',
            text: 'others',
        },
    ];

    const [remainingSeconds, setRemainingSeconds] = useState(null);


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



    const navigate = useNavigate();

    const getp2pChat = async () => {
        setSiteLoader(true);

        var onj = {
            orderId: headurlref.current,
        };
        var data = {
            apiUrl: apiService.getdisputechat,
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
                    const totalSeconds = 1 * 60; // 20 minutes = 1200 seconds
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





    const submitChat = async (file) => {
        try {

            var obj = {
                "message": formValue.message,
                "file": file,
                "type": UserIDref.current == p2pDataref.current.userId._id ? "advertiser" : "user",
                "orderId": window.location.href.split("/").pop(),
                "p2porderId": confirmp2porderref.current._id,
            }




            if (formValue.message != "" || file != "") {
                setSiteLoader(true);
                var data = {
                    apiUrl: apiService.adminp2pchat,
                    payload: obj,
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




    const [raiseloader, setraiseloader, raiseloaderref] = useState(false);
    const [raiseValid, setraiseValid] = useState(0);
    const [raisename, setraisename, raisenameref] = useState("");



    const UploadImage = (type, val) => {
        setchatloading(true);
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
            setchatloading(false);
            showerrorToast(
                "File does not support. You must use .png, .jpg,  .jpeg,  .pdf,  .doc,  .docx "
            );
            return false;
        } else if (fileSize > 10000000) {
            setchatloading(false);

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


                    // console.log(type);

                    await submitChat(data.secure_url);

                    setchatloading(false);

                })
                .catch((err) => {
                    setchatloading(false);

                    console.log(err);
                });
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




    return (
        <>
            <section className="Non_fixed_nav">
                <Header />
            </section>{" "}
            <div>
                <div className="Verification">
                    <div className="container">
                        <div>
                            <div className="row justify-content-center payment-cards mt-4">

                                <div className="col-lg-6">
                                    <div className="chat-box m-0">
                                        <div className="chat-flex">
                                            <div className="p2p_namefrst_change align-items-center">
                                                A
                                            </div>
                                            <div className="chat-content">
                                                <span className="pay-btc">
                                                    Admin
                                                </span>

                                            </div>
                                        </div>
                                        {/* inner box */}
                                        <div className="inner-box">
                                            <div className="chat_section">
                                                {profileDataref.current != null &&
                                                    p2pchatref.current &&
                                                    p2pchatref.current.map((chat, i) => {
                                                        const isAdmin = chat.type === "admin";
                                                        const message = chat.admin_msg || chat.user_msg;
                                                        const file = chat.admin_file || chat.user_file;

                                                        return (
                                                            <div
                                                                className={
                                                                    isAdmin
                                                                        ? "char_recive w-100 d-flex justify-content-start "
                                                                        : "char_recive w-100 d-flex justify-content-end"
                                                                }
                                                                key={i}
                                                            >
                                                                <div className={isAdmin ? "chat_conent" : "char_send"}>
                                                                    <div className="chat_conent">
                                                                        <p>{Moment(chat.createdAt).format("LT")}</p>

                                                                        {message && (
                                                                            <div className="j-img-content-two">{message}</div>
                                                                        )}

                                                                        {file && (
                                                                            <img src={file} width="250px" alt="chat file" />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
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
                                                        <div className="start-icon1" onClick={() => document.getElementById("fileInput1").click()}>
                                                            <img src={require("../assets/Attach.png")} alt="Attach" style={{ cursor: "pointer" }} />
                                                        </div>

                                                        <input
                                                            type="file"
                                                            id="fileInput1"
                                                            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => {
                                                                console.log("2222");
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

                </div>
            </div>
        </>
    );


};

export default DisputeChat;

