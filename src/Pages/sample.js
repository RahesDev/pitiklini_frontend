import React, { useEffect } from "react";
import Header from "../../Newcomponent/Header";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../../../core/service/detail";
import { getMethod, postMethod } from "../../../core/service/common.api";
import { Grid, Paper, Container } from "@mui/material";
import { getAuthToken } from "../../../core/lib/localStorage";
import { Dropdown } from "semantic-ui-react";
import useState from "react-usestateref";
import Pagination from "react-js-pagination";
import Moment from "moment";
import countrylist from "../../country.json";
import $ from "jquery";
import useStateRef from "react-usestateref";
function Home() {
  const inputType = "password";
  const options = ["one", "two", "three"];
  const countryOptions = countrylist.data.map((country) => ({
    key: country.name,
    text: country.name,
    value: country.name,
  }));

  const preferPayment = [
    { value: "All payments", text: "All payments" },
    {
      value: "Bank Transfer",
      text: "Bank Transfer",
    },
    { value: "UPI ID", text: "UPI ID" },
    { value: "Paytm", text: "Paytm" },
  ];

  const [getP2POrders, setgetAllp2pOrders, getP2POrdersref] = useState([]);
  const [buyP2POrders, setbuyP2POrders, buyP2POrdersref] = useState([]);
  const [sellP2POrders, setsellP2POrders, sellP2POrdersref] = useState([]);
  const [sendDatas, setSendDatas, sendDatasref] = useState("");
  const [show, setShow, showref] = useState(false);
  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCurrencyFiat, setallCurrencyFiat, allCurrencyFiatref] = useState(
    []
  );
  const [activetab, setActive, activetabref] = useState("All");
  const [activetype, setActivetype, activetyperef] = useState("BTC");
  const [fiatCurrency, setfiatCurrency, fiatCurrencyref] = useState("INR");
  const [profileDatas, setprofileData, profileDatasref] = useState("");
  const [loginTrue, setloginTrue, loginTrueref] = useState(false);

  const [p2pbalance, setp2pbalance, p2pbalanceref] = useState("");
  const [p2pData, setp2pData, p2pDataref] = useState("");

  const [currentp2pBuy, setcurrentp2pBuy, currentp2pBuyref] = useState([]);
  const [currentp2pSell, setcurrentp2pSell, currentp2pSellref] = useState([]);

  const [notification, Setnotification, notificationref] = useState([]);
  const [notifyCurrentPage, setnotifyCurrentPage, notifyCurrentPageref] =
    useState();
  const [notifytotalpage, Setnotifytotalpage, notifytotalpageref] = useState(0);

  const [p2pOrders, setp2pOrders, p2pOrdersref] = useState([]);
  const [p2pcurrentpage, setp2pcurrentpage, p2pcurrentpageref] = useState(1);
  const [p2ptotalpage, setp2pTotalpages, p2ptotalpageref] = useState(0);

  const [p2pHistory, setp2pHistory, p2pHistoryref] = useState([]);
  const [historycurrentpage, sethistorycurrentpage, historycurrentpageref] =
    useState(1);
  const [historytotalpage, sethistoryTotalpages, historytotalpageref] =
    useState(0);
  const [authtoken, setauthtoken] = useState(false);
  const [p2pLoader, setp2pLoader, p2pLoaderref] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    getAllp2pOrders();
    getAllcurrency();
    let user_token = getAuthToken();
    console.log("user_token===", typeof user_token);
    console.log("user_token.length===", user_token.length);
    if (user_token != "" && user_token != undefined && user_token != null) {
      setauthtoken(user_token);
      setloginTrue(true);
      getProfile();
    
      // let socket_token = localStorage.getItem("socket_token");
      // let socketsplit = socket_token.split("_");
      // socket.connect();

      // socket.off("socketResponse");
      // socket.on("socketResponse", function (res) {
      //   if (res.Reason == "ordercancel") {
      //     getAllp2pOrders();
      //   }
      // });

      if (
        countryName != "" &&
        countryName != null &&
        countryName != undefined &&
        amountValue != "" &&
        amountValue != null &&
        amountValue != undefined &&
        paymentmethod != "" &&
        paymentmethod != null &&
        paymentmethod != undefined
      ) {
        var data = [];
        for (var i = 0; i < getP2POrdersref.current.length; i++) {
          if (
            getP2POrders[i].location == countryName &&
            getP2POrders[i].price == amountValue &&
            getP2POrders[i].paymentMethod == paymentmethod
          ) {
            var obj = {
              firstCurrency: getP2POrders[i].firstCurrency,
              fromLimit: getP2POrders[i].fromLimit,
              location: getP2POrders[i].location,
              orderId: getP2POrders[i].orderId,
              orderType: getP2POrders[i].orderType,
              orders_count: getP2POrders[i].orders_count,
              paymentMethod: getP2POrders[i].paymentMethod,
              price: getP2POrders[i].price,
              processAmount: getP2POrders[i].processAmount,
              profile_image: getP2POrders[i].profile_image,
              rating: getP2POrders[i].rating,
              secondCurrnecy: getP2POrders[i].secondCurrnecy,
              toLimit: getP2POrders[i].toLimit,
              totalAmount: getP2POrders[i].totalAmount,
              user_id: getP2POrders[i].user_id,
              username: getP2POrders[i].username,
            };
            data.push(obj);
          }
        }
        console.log(data, "data");
        if (data == "") {
          setbuyP2POrders([]);
          setsellP2POrders([]);
        } else {
          setgetAllp2pOrders(data);
          var buy = data.filter((data) => data.orderType == "sell");
          buy.sort(function (a, b) {
            return a.price - b.price;
          });
          setbuyP2POrders(buy);

          var sell = data.filter((data) => data.orderType == "buy");
          sell.sort(function (a, b) {
            return b.price - a.price;
          });
          setsellP2POrders(sell);
        }
      }
      setauthtoken(true);
    } else {
      setauthtoken(false);
      setloginTrue(false);
    }
  }, []);

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        console.log("resp.status", resp.data);
        setprofileData(resp.data);
      }
    } catch (error) {}
  };


  const defaulatCurrFiat = allCurrencyFiatref.current[0];

  const onSelect = async (option) => {
    console.log(option, "-=-onSelecttop");

    if (option.label == "Select Currency") {
      console.log("call currency all");
      setfiatCurrency(option.value);
      console.log("call currency all", fiatCurrencyref.current);
      getAllp2pOrders();
      setActive(activetabref.current);
      setActivetype("buy");
    } else {
      setfiatCurrency(option.label);
      var onj = {
        currency: option.label,
      };
      var data = {
        apiUrl: apiService.p2pGetOrder,
        payload: onj,
      };
      var resp = await postMethod(data);
      if (resp) {
        var data = resp.Message;
        setgetAllp2pOrders(resp.Message);
      }
    }
  };

  const handleChange = async (e) => {
    const newActiveTab = e.target.getAttribute("data-tab");
    console.log("newActiveTab===", newActiveTab);

    setActive(newActiveTab);
    console.log("activetabref.current===", activetabref.current);
    setActivetype("buy");
    getAllp2pOrders();
  };

  const handleChange_type = async (e) => {
    const type = e.target.getAttribute("data-tab");
    if (type == "Buy") {
      setActive("All");
      $("a#All").trigger("click");
    } else {
      setActive("sellAll");
      $("a#sellAll").trigger("click");
    }
    console.log("activetabref.current buy sell===", activetabref.current);
  };

  const getp2pOrder = async (data) => {
    setp2pData(data);
    var onj = {
      fromCurrency: data.fromCurrency,
    };
    var data = {
      apiUrl: apiService.getp2pBalance,
      payload: onj,
    };
    var resp = await postMethod(data);
    console.log(resp.Message, "-=-=-resp=-=-");
    if (resp) {
      var data = resp.Message;
      setp2pbalance(resp.p2pbalance);
    }
  };

  const navp2ppage = async (orderid) => {
    navigate("/p2p/confirm-order/" + orderid);
  };

  const navp2pview = async (orderid) => {
    navigate("/p2p/view-order/" + orderid);
  };

  const navlogin = async () => {
    navigate("/login");
  };

  const notifyrecordPerPage = 5;

  const notifypageRange = 5;
  const notify = async (page) => {
    var payload = {
      perpage: 5,
      page: page,
    };

    var Notification = {
      apiUrl: apiService.getnotification,
      payload: payload,
    };
    var resp = await postMethod(Notification);
    if (resp.status) {
      Setnotification(resp.data.data);
      console.log(resp.data.data, "=-=-resp.data.data-==-=");

      Setnotifytotalpage(resp.data.total);
      console.log(resp.data.total, "=-=resp.data.total=-=-=");
    } else {
    }
  };

  const handlenotifyPageChange = (pageNumber) => {
    notify(pageNumber);
    setnotifyCurrentPage(pageNumber);
  };

  const navchatpage = async (link) => {
    navigate(link);
  };

  const getp2pOrders = async (page) => {
    try {
      var data = {
        apiUrl: apiService.p2pOrders,
        payload: { FilPerpage: 5, FilPage: page },
      };
      var p2p_orders_list = await postMethod(data);
      if (p2p_orders_list.status == true) {
        //if (p2p_orders_list.Message.fromCurrency != null) {
        setp2pOrders(p2p_orders_list.returnObj.Message);
        //console.log(p2p_orders_list.returnObj.Message, "==============message");
        setp2pTotalpages(p2p_orders_list.returnObj.total);
        // }
      }
    } catch (error) {}
  };
  const [countryName, setCountryName] = useState("");
  const [paymentmethod, setPaymentMethod] = useState();
  // Other state variables and functions

  const choosecountryfilter = (e, value) => {
    // getAllp2pOrders();
    console.log(e, "--", value.value);
    setCountryName(value.value);
    var data = [];
    for (var i = 0; i < getP2POrdersref.current.length; i++) {
      if (getP2POrders[i].location == value.value) {
        var obj = {
          firstCurrency: getP2POrders[i].firstCurrency,
          fromLimit: getP2POrders[i].fromLimit,
          location: getP2POrders[i].location,
          orderId: getP2POrders[i].orderId,
          orderType: getP2POrders[i].orderType,
          orders_count: getP2POrders[i].orders_count,
          paymentMethod: getP2POrders[i].paymentMethod,
          price: getP2POrders[i].price,
          processAmount: getP2POrders[i].processAmount,
          profile_image: getP2POrders[i].profile_image,
          rating: getP2POrders[i].rating,
          secondCurrnecy: getP2POrders[i].secondCurrnecy,
          toLimit: getP2POrders[i].toLimit,
          totalAmount: getP2POrders[i].totalAmount,
          user_id: getP2POrders[i].user_id,
          username: getP2POrders[i].username,
        };
        data.push(obj);
      }
    }
    console.log(data, "data");
    if (data == "") {
      setbuyP2POrders([]);
      setsellP2POrders([]);
    } else {
      setgetAllp2pOrders(data);
      var buy = data.filter((data) => data.orderType == "sell");
      buy.sort(function (a, b) {
        return a.price - b.price;
      });
      setbuyP2POrders(buy);

      var sell = data.filter((data) => data.orderType == "buy");
      sell.sort(function (a, b) {
        return b.price - a.price;
      });
      setsellP2POrders(sell);
    }
  };

  const [amountValue, setamountValue] = useStateRef("");

  const amountfilteration = (value) => {
    if (value.toString().length > 20) {
    } else {
      setamountValue(value);
      const result = getP2POrdersref.current.filter((word) => {
        return word.price.toLowerCase().includes(value);
      });

      console.log(result, "result");

      if (result == "") {
        setbuyP2POrders([]);
        setsellP2POrders([]);
      } else {
        setgetAllp2pOrders(result);
        var buy = result.filter((data) => data.orderType == "sell");
        buy.sort(function (a, b) {
          return a.price - b.price;
        });
        setbuyP2POrders(buy);

        var sell = result.filter((data) => data.orderType == "buy");
        sell.sort(function (a, b) {
          return b.price - a.price;
        });
        setsellP2POrders(sell);
      }
    }
  };

  const paymentfilteration = (e, value) => {
    console.log(e, "--", value.value);
    setPaymentMethod(value.value);
    var data = [];
    for (var i = 0; i < getP2POrdersref.current.length; i++) {
      if (getP2POrders[i].paymentMethod == value.value) {
        var obj = {
          firstCurrency: getP2POrders[i].firstCurrency,
          fromLimit: getP2POrders[i].fromLimit,
          location: getP2POrders[i].location,
          orderId: getP2POrders[i].orderId,
          orderType: getP2POrders[i].orderType,
          orders_count: getP2POrders[i].orders_count,
          paymentMethod: getP2POrders[i].paymentMethod,
          price: getP2POrders[i].price,
          processAmount: getP2POrders[i].processAmount,
          profile_image: getP2POrders[i].profile_image,
          rating: getP2POrders[i].rating,
          secondCurrnecy: getP2POrders[i].secondCurrnecy,
          toLimit: getP2POrders[i].toLimit,
          totalAmount: getP2POrders[i].totalAmount,
          user_id: getP2POrders[i].user_id,
          username: getP2POrders[i].username,
        };
        data.push(obj);
      }
    }
    console.log(data, "data");
    if (data == "") {
      setbuyP2POrders([]);
      setsellP2POrders([]);
    } else {
      setgetAllp2pOrders(data);
      var buy = data.filter((data) => data.orderType == "sell");
      buy.sort(function (a, b) {
        return a.price - b.price;
      });
      setbuyP2POrders(buy);

      var sell = data.filter((data) => data.orderType == "buy");
      sell.sort(function (a, b) {
        return b.price - a.price;
      });
      setsellP2POrders(sell);
    }
  };
  const p2precordpage = 5;
  const p2ppagerange = 5;
  const handlepagep2p = (p2ppage) => {
    console.log(p2ppage, "==-=-=-p2ppage==-==-=");
    getp2pOrders(p2ppage);
    setp2pcurrentpage(p2ppage);
  };

  const navpage = async (link) => {
    navigate("/p2p/view-order/" + link);
  };

  const getp2pHistory = async (page) => {
    var data = {
      apiUrl: apiService.p2pHistory,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var p2p_orders_list = await postMethod(data);
    if (p2p_orders_list.status) {
      setp2pHistory(p2p_orders_list.returnObj.Message);
      sethistoryTotalpages(p2p_orders_list.returnObj.total);
    }
  };

  const historyrecordpage = 5;
  const historypagerange = 5;
  const handlepagep2phistory = (p2ppage) => {
    console.log(p2ppage, "==-=-=-p2ppage==-==-=");
    getp2pHistory(p2ppage);
    sethistorycurrentpage(p2ppage);
  };

  const navpostad = async () => {
    navigate("/p2p/post-ad");
  };

  return (
    <div className="">
      <main className="main-content tradepage-bg  bg-cover onlywhitee new_login_bb">
        <Header />
        <div className="class-padding">
          <Grid
            container
            spacing={2}
            justifyContent={"center"}
            marginTop={"20px"}
          >
            {/* Item for xs (extra small) screens */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="heading_card_new">
                <h1>
                  Peer-to-peer
                  <i class="ri-arrow-right-line"></i>
                </h1>
              </div>
            </Grid>

            {p2pLoaderref.current == true ? (
              <Grid item xs={12} sm={12} md={8} lg={12} xl={12}>
                <div className="loading">
                  <i class="fa-solid fa-spinner fa-spin-pulse "></i>
                </div>
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="bootsrab_tabs pb-0">
                    <ul class="nav nav-tabs">
                      <li class="active">
                        <a
                          data-toggle="tab"
                          data-tab="Buy"
                          href="#Buy"
                          className="active"
                          onClick={handleChange_type}
                        >
                          Buy
                        </a>
                      </li>
                      <li>
                        <a
                          data-toggle="tab"
                          data-tab="Sell"
                          href="#Sell"
                          onClick={handleChange_type}
                        >
                          Sell
                        </a>
                      </li>
                      {authtoken == true ? (
                        <>
                          <li>
                            <a data-toggle="tab" href="#Orders">
                              Orders
                            </a>
                          </li>
                          <li>
                            <a
                              data-toggle="tab"
                              href="#Post_an_Ad"
                              onClick={() => navpostad()}
                            >
                              Post an Ad
                            </a>
                          </li>
                        </>
                      ) : (
                        ""
                      )}
                    </ul>
                  </div>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div class="tab-content">
                 
                    <div id="Orders" class="tab-pane fade ">
                      <Grid
                        container
                        spacing={2}
                        justifyContent={"center"}
                        marginTop={"0px"}
                      >
                        {/* Item for xs (extra small) screens */}
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          paddingTop={"0px"}
                          className="pt-0"
                        >
                          <div className="histroy_tabs">
                           
                            <ul class="nav nav-tabs">
                              <li class="active">
                                <a
                                  data-toggle="tab"
                                  href="#Allorders"
                                  className="active"
                                >
                                  Process Orders
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#InProcesss">
                                  My Orders
                                </a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#Expired">
                                  My History
                                </a>
                              </li>
                            </ul>

                            <div class="tab-content mt-4">
                              <div
                                id="Allorders"
                                class="tab-pane fade in active show"
                              >
                                <div className="table_responsive">
                                  <div className="table_section">
                                    <div class="custom-table">
                                      <div class="table-row header">
                                        <div class="table-cell">S.No</div>
                                        <div class="table-cell">
                                          Date & Time
                                        </div>
                                        <div class="table-cell">From</div>
                                        <div class="table-cell">Message </div>
                                      </div>
                                      {notificationref.current &&
                                      notificationref.current.length > 0 ? (
                                        notificationref.current.map(
                                          (item, i) => {
                                            return (
                                              <div
                                                class="table-row border_table_row buttonddd"
                                                onClick={() =>
                                                  navchatpage(item.link)
                                                }
                                              >
                                                <div class="table-cell">
                                                  <div className="data_inner color_tet">
                                                    {i + 1}
                                                  </div>
                                                </div>
                                                <div class="table-cell">
                                                  <div className="data_inner color_tet">
                                                    {Moment(
                                                      item.createdAt
                                                    ).format("lll")}
                                                  </div>
                                                </div>{" "}
                                                <div class="table-cell">
                                                  <div className="data_inner color_tet">
                                                    {item.from_user_name}
                                                  </div>
                                                </div>
                                                <div class="table-cell">
                                                  <div className="data_inner color_tet">
                                                    {item.message}
                                                  </div>
                                                </div>{" "}
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <div class="table-row border_table_row buttonddd">
                                          <div class="table-cell">
                                            <div className="data_inner color_tet">
                                              No results found
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {notificationref.current.length > 0 ? (
                                  <Pagination
                                    itemClass="page-item" // add it for bootstrap 4
                                    linkClass="page-link" // add it for bootstrap 4
                                    activePage={notifyCurrentPage}
                                    itemsCountPerPage={notifyrecordPerPage}
                                    totalItemsCount={notifytotalpage}
                                    pageRangeDisplayed={notifypageRange}
                                    onChange={handlenotifyPageChange}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div id="InProcesss" class="tab-pane fade   ">
                                <div className="table_responsive">
                                  <div className="table_section">
                                    <div class="custom-table">
                                      <div class="table-row header">
                                        <div class="table-cell">
                                          Date & Time
                                        </div>
                                        <div class="table-cell">Currency</div>
                                        <div class="table-cell">Quantity</div>
                                        <div class="table-cell">Price </div>
                                        <div class="table-cell">Limit </div>
                                        <div class="table-cell">
                                          Order Type{" "}
                                        </div>
                                        <div class="table-cell">Status </div>
                                      </div>
                                      {p2pOrdersref.current &&
                                      p2pOrdersref.current.length > 0 ? (
                                        p2pOrdersref.current.map((item, i) => {
                                          return (
                                            <div
                                              class="table-row border_table_row buttonddd"
                                              onClick={() =>
                                                navpage(item.orderId)
                                              }
                                            >
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {Moment(
                                                    item.created_at
                                                  ).format("lll")}
                                                </div>
                                              </div>
                                              <div class="table-cell">
                                                <div className="data_inner flex_image_coloe text_primary_txt">
                                                  <img
                                                    src={
                                                      item.fromCurrency
                                                        .Currency_image
                                                    }
                                                    className="img-fluid"
                                                  />
                                                  {
                                                    item.fromCurrency
                                                      .currencyName
                                                  }{" "}
                                                  <small>
                                                    {
                                                      item.fromCurrency
                                                        .currencySymbol
                                                    }
                                                  </small>
                                                </div>
                                              </div>
                                              <div class="table-cell">
                                                <div className="data_inner font_bold_s">
                                                  <p className="font_14">
                                                    {" "}
                                                    <span>
                                                      {/* <small className="colo_textDa">
                                            Quantity:
                                          </small> */}
                                                      <b className="mr-2 font_16">
                                                        {" "}
                                                        {parseFloat(
                                                          item.totalAmount
                                                        ).toFixed(8)}
                                                      </b>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner font_bold_s">
                                                  <p className="font_14">
                                                    {" "}
                                                    <span>
                                                      {/* <small className="colo_textDa">
                                            Price:
                                          </small> */}
                                                      <b className="mr-2 font_16">
                                                        {" "}
                                                        {parseFloat(
                                                          item.price
                                                        ).toFixed(2)}
                                                      </b>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner ">
                                                  <div className="data_limit_p2p max-width_tavke">
                                                    <p>
                                                      {/* <span>Limit:</span>  */}
                                                      {parseFloat(
                                                        item.fromLimit
                                                      ).toFixed(8)}{" "}
                                                      -{" "}
                                                      {parseFloat(
                                                        item.toLimit
                                                      ).toFixed(8)}{" "}
                                                      {item.firstCurrency}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {item.orderType == "buy" ? (
                                                    <p className="primary_green">
                                                      Buy
                                                    </p>
                                                  ) : (
                                                    <p className="primary_red">
                                                      Sell
                                                    </p>
                                                  )}
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {item.status}
                                                </div>
                                              </div>{" "}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div class="table-row border_table_row buttonddd">
                                          <div class="table-cell">
                                            <div className="data_inner color_tet">
                                              No results found
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {p2pOrdersref.current.length > 0 ? (
                                  <Pagination
                                    itemClass="page-item" // add it for bootstrap 4
                                    linkClass="page-link" // add it for bootstrap 4
                                    activePage={p2pcurrentpage}
                                    itemsCountPerPage={p2precordpage}
                                    totalItemsCount={p2ptotalpage}
                                    pageRangeDisplayed={p2ppagerange}
                                    onChange={handlepagep2p}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                              <div id="Expired" class="tab-pane fade">
                                <div className="table_responsive">
                                  <div className="table_section">
                                    <div class="custom-table">
                                      <div class="table-row header">
                                        <div class="table-cell">
                                          Date & Time
                                        </div>
                                        <div class="table-cell">Currency</div>
                                        <div class="table-cell">Quantity</div>
                                        <div class="table-cell">Price </div>
                                        <div class="table-cell">
                                          Order Type{" "}
                                        </div>
                                        <div class="table-cell">Status </div>
                                      </div>
                                      {p2pHistoryref.current &&
                                      p2pHistoryref.current.length > 0 ? (
                                        p2pHistoryref.current.map((item, i) => {
                                          var status = "";
                                          if (item.status == 0) {
                                            status = "Confirmed";
                                          }
                                          if (item.status == 1) {
                                            status = "Paid";
                                          } else if (item.status == 2) {
                                            status = "Completed";
                                          } else if (item.status == 3) {
                                            status = "Cancelled";
                                          }
                                          return (
                                            <div
                                              class="table-row border_table_row buttonddd"
                                              onClick={() =>
                                                navpage(item.orderId)
                                              }
                                            >
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {Moment(item.datetime).format(
                                                    "lll"
                                                  )}
                                                </div>
                                              </div>
                                              <div class="table-cell">
                                                <div className="data_inner flex_image_coloe text_primary_txt">
                                                  <img
                                                    src={
                                                      item.firstCurrency
                                                        .Currency_image
                                                    }
                                                    className="img-fluid"
                                                  />
                                                  {
                                                    item.firstCurrency
                                                      .currencyName
                                                  }{" "}
                                                  <small>
                                                    {
                                                      item.firstCurrency
                                                        .currencySymbol
                                                    }
                                                  </small>
                                                </div>
                                              </div>
                                              <div class="table-cell">
                                                <div className="data_inner font_bold_s">
                                                  <p className="font_14">
                                                    {" "}
                                                    <span>
                                                      {/* <small className="colo_textDa">
                                            Quantity:
                                          </small> */}
                                                      <b className="mr-2 font_16">
                                                        {" "}
                                                        {parseFloat(
                                                          item.askAmount
                                                        ).toFixed(8)}
                                                      </b>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner font_bold_s">
                                                  <p className="font_14">
                                                    {" "}
                                                    <span>
                                                      {/* <small className="colo_textDa">
                                            Price:
                                          </small> */}
                                                      <b className="mr-2 font_16">
                                                        {" "}
                                                        {parseFloat(
                                                          item.askPrice
                                                        ).toFixed(2)}
                                                      </b>
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {item.type == "buy" ? (
                                                    <p className="primary_green">
                                                      Buy
                                                    </p>
                                                  ) : (
                                                    <p className="primary_red">
                                                      Sell
                                                    </p>
                                                  )}
                                                </div>
                                              </div>{" "}
                                              <div class="table-cell">
                                                <div className="data_inner color_tet">
                                                  {status}
                                                </div>
                                              </div>{" "}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        <div class="table-row border_table_row buttonddd">
                                          <div class="table-cell">
                                            <div className="data_inner color_tet">
                                              No results found
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {p2pHistoryref.current.length > 0 ? (
                                  <Pagination
                                    itemClass="page-item" // add it for bootstrap 4
                                    linkClass="page-link" // add it for bootstrap 4
                                    activePage={historycurrentpageref.current}
                                    itemsCountPerPage={historyrecordpage}
                                    totalItemsCount={
                                      historytotalpageref.current
                                    }
                                    pageRangeDisplayed={historypagerange}
                                    onChange={handlepagep2phistory}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </>
            )}
          </Grid>
          {/* Your other components and content */}
        </div>
      </main>
    </div>
  );
}

export default Home;
