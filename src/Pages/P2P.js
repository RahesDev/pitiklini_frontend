import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import "semantic-ui-css/semantic.min.css";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";

const P2P = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [p2pOrders, setP2POrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectPayment, setselectPayment] = useState("");
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState("buy");
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
  const [fiatCurrencies, setFiatCurrencies] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedFiat, setSelectedFiat] = useState("");
  const [profileData, setProfileData, profileDataRef] = useState("");
  const [isBuy, setIsBuy] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [isIndexVal, setIsIndexVal] = useState("");
  const [UserID, setUserID, UserIDref] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  const [preferPayment, setpreferPayment] = useState([]);

      // usePageLeaveConfirm();
       usePageLeaveConfirm("Are you sure you want to leave P2P?", "/p2p");

  // const preferPayment = [
  //   { value: "All Payment", text: "All Payment" },
  //   { key: "imps", text: "IMPS", value: "IMPS" },
  //   { key: "upid", text: "UPI ID", value: "UPID" },
  //   { key: "paytm", text: "Paytm", value: "Paytm" },
  //   { key: "bankTransfer", text: "Bank Transfer", value: "BankTransfer" },
  // ];

  const allpayment = [
    { key: "imps", text: "IMPS", value: "IMPS" },
    { key: "upid", text: "UPID", value: "UPID" },
    { key: "paytm", text: "Paytm", value: "Paytm" },
    { key: "bankTransfer", text: "Bank Transfer", value: "BankTransfer" },
  ];

  useEffect(() => {
    // const token = localStorage.getItem("PTKToken");
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      setLoginStatus(true);
      const token = sessionStorage.getItem("PTKToken");
      const PTK = token.split("_")[1];
      setUserID(PTK);
      console.log(UserIDref.current, "setUserID");
      getAllP2POrders();
      getProfile();
    } else {
      getAllP2POrdersbefore();
      setLoginStatus(false);
    }

    getAllCurrency();
    getallPaymentMethods();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [
    paymentMethod,
    orderType,
    selectedCrypto,
    selectedFiat,
    p2pOrders,
    amount,
  ]);

  const getAllP2POrdersbefore = async () => {
    try {
      setSiteLoader(true);
      const data = {
        apiUrl: apiService.p2pGetOrderBefore,
        payload: {
          currency: selectedCrypto || selectedFiat,
        },
      };
      const resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setP2POrders(resp.Message);
        setFilteredOrders(resp.Message);

        console.log(resp, "resp");
      }
    } catch (error) {
      console.error("Error fetching P2P orders:", error);
    }
  };

  const loginNave = async () => {
    navigate("/login");
  };

  const getAllP2POrders = async () => {
    try {
      setSiteLoader(true);
      const data = {
        apiUrl: apiService.p2pGetOrder,
        payload: {
          currency: selectedCrypto || selectedFiat,
        },
      };
      const resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setP2POrders(resp.Message);
        setFilteredOrders(resp.Message);

        console.log(resp, "resp");
      }
    } catch (error) {
      console.error("Error fetching P2P orders:", error);
    }
  };

  const getAllCurrency = async () => {
    setSiteLoader(true);

    try {
      const data = { apiUrl: apiService.getP2Pcurrency };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data) {
        const cryptoArray = resp.data
          .filter((currency) => currency.coinType === "1")
          .map((currency) => ({
            key: currency._id,
            text: currency.currencySymbol,
            value: currency.currencySymbol,
            image: {
              avatar: true,
              src: currency.Currency_image,
            },
          }));

        const fiatArray = resp.data
          .filter((currency) => currency.coinType === "2")
          .map((currency) => ({
            key: currency._id,
            text: currency.currencySymbol,
            value: currency.currencySymbol,
            image: {
              avatar: true,
              src: currency.Currency_image,
            },
          }));

        setCryptoCurrencies(cryptoArray);
        setFiatCurrencies(fiatArray);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const getProfile = async () => {
    try {
      setSiteLoader(true);

      const data = { apiUrl: apiService.getUserDetails };
      const resp = await getMethod(data);
      setSiteLoader(false);

      if (resp.status) {
        setProfileData(resp.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const filterOrders = () => {
    setSiteLoader(true);

    let filtered = p2pOrders;

    if (paymentMethod) {
      filtered = filtered.filter(
        (order) => order.paymentMethod === paymentMethod
      );
    }

    if (orderType) {
      filtered = filtered.filter((order) => order.orderType != orderType);
    }

    if (selectedCrypto) {
      filtered = filtered.filter(
        (order) => order.firstCurrency === selectedCrypto
      );
    }

    if (selectedFiat) {
      console.log(selectedFiat, filtered);
      filtered = filtered.filter(
        (order) => order.secondCurrency == selectedFiat
      );
    }

    if (amount) {
      console.log(amount, filtered);
      // filtered = filtered.filter((order) => order.price === amount);
      // filtered = filtered.filter((order) => order.price.startsWith(amount));
      filtered = filtered.filter((order) => amount >= order.fromLimit && amount <= order.toLimit);

    }

    setFilteredOrders(filtered);
    setSiteLoader(false);
  };

  const handleClick = (i, option) => {
    console.log(i, option);
    setIsBuy(option);
    setIsIndexVal(i);
  };

  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [error, setError] = useState("");

  const validatePayAmount = (value) => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue) || value === "") {
      setError(t("pleaseEnterValidAmt"));
      return false;
    } else if (numericValue <= 0) {
      setError(t("amtMustBeGreaterThanZero"));
      return false;
    } else if (numericValue < isBuy.fromLimit) {
      setError(`${t("amtShouldNotlessThan")} ${isBuy.fromLimit}.`);
      return false;
    } else if (numericValue > isBuy.toLimit) {
      setError(`${t("amountShouldNotExceed")} ${isBuy.toLimit}.`);
      return false;
    } else if (numericValue > isBuy.available_qty) {
      setError(`${t("amtShouldNotExceedThanAvlQuan")} ${isBuy.available_qty}.`);
      return false;
    }

    setError(""); // Clear error if all validations pass
    return true;
  };

  const handlePayAmountChange = (e) => {
    const value = e.target.value;

    if (validatePayAmount(value)) {
      setPayAmount(value);
      const calculatedReceiveAmount =
        parseFloat(value) * parseFloat(isBuy.price);
      setReceiveAmount(calculatedReceiveAmount.toFixed(2));
    } else {
      setPayAmount(value);
      setReceiveAmount("");
    }

    // const numericValue = parseFloat(value);
    // if (
    //   !isNaN(numericValue) &&
    //   numericValue >= isBuy.fromLimit &&
    //   numericValue <= isBuy.toLimit
    // ) {
    //   setPayAmount(value);
    //   const calculatedReceiveAmount = numericValue * parseFloat(isBuy.price);
    //   setReceiveAmount(calculatedReceiveAmount.toFixed(2));
    // } else {
    //   showerrorToast("Enter the valid quantity");
    //   setPayAmount(value);
    //   const calculatedReceiveAmount = numericValue * parseFloat(isBuy.price);
    //   setReceiveAmount(calculatedReceiveAmount.toFixed(2));
    // }
  };

  const handleCancel = () => {
    setPayAmount("");
    setReceiveAmount("");
    setIsIndexVal("");
  };

  const confirm_order_buy = async () => {
    console.log("ijkjknkn");
    try {
      console.log("buy");

      if (payAmount != "" && receiveAmount != "") {
        if (selectPayment != "") {
          var obj = {
            qty: payAmount,
            total: receiveAmount,
            paymentMethod: selectPayment,
            orderId: isBuy.orderId,
            type: "buy",
          };

          console.log(obj, "ihjujhuj");
          var data = {
            apiUrl: apiService.p2p_confirm_order,
            payload: obj,
          };
          var resp = await postMethod(data);
          setSiteLoader(false);

          if (resp.status) {
            showsuccessToast(resp.Message);
            navigate(resp.link);
          } else {
            showerrorToast(resp.Message);
          }
        } else {
          showerrorToast("Please select the payment methods");
        }
      } else {
        showerrorToast("Please enter valid quantity");
      }
    } catch (error) {
      console.log(error, "ijknkkijjkijkijmki");
    }
  };

  const confirm_order_sell = async () => {
    console.log("iiknjdnsdnsd");
    try {
      var obj = {};
      obj.qty = payAmount;
      obj.paymentMethod = selectPayment;

      obj.total = receiveAmount;
      obj.orderId = isBuy.orderId;
      obj.type = "sell";

      if (obj.qty != "" && obj.total != "") {
        if (selectPayment != "") {
          var data = {
            apiUrl: apiService.p2p_confirm_sellorder,
            payload: obj,
          };
          setSiteLoader(true);

          var resp = await postMethod(data);
          setSiteLoader(false);

          if (resp.status) {
            showsuccessToast(resp.Message);
            navigate(resp.link);
            window.location.href = resp.link;
          } else {
            showerrorToast(resp.Message);
          }
        } else {
          showerrorToast("Please select the payment methods");
        }
      } else {
        showerrorToast("Please enter quantity");
      }
    } catch (error) {}
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  const getallPaymentMethods = async () => {
    setSiteLoader(true);

    try {
      const data = { apiUrl: apiService.get_p2p_payments };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data) {
        if(resp.data.length > 0)
        {
          let response = [];
          for(let i=0;i<resp.data.length;i++)
          {
            let obj = { 
            key: resp.data[i]._id,
            text: resp.data[i].payment_name,
            value: resp.data[i].payment_name,
            }
            response.push(obj);
        }
        setpreferPayment(response);
      }
     }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  return (
    <>
      <Header />

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
        <main className="dashboard_main">
          <div className="container-lg">
            <div className="row">
              <div className="col-lg-12">
                <section className="asset_section">
                  <div className="row">
                    <div className="p2p_title p2p-flex-title">
                      {t("p2p")}{" "}
                      <div className="p2p-head-right">
                        <span className="p2p-right-links">
                          <img
                            src={require("../assets/icons/p2p-orders.webp")}
                            alt="p2p-order"
                            className="p2p-right-icons"
                          />
                          <Link
                            to={
                              loginStatus == true ? "/processorders" : "/login"
                            }
                            className="p2p-right-links"
                          >
                            {t("orders")}
                          </Link>
                        </span>
                        <span className="p2p-right-links">
                          <img
                            src={require("../assets/icons/p2p-plus.png")}
                            alt="p2p-order"
                            className="p2p-right-icons"
                          />
                          <Link
                            to={loginStatus == true ? "/postad" : "/login"}
                            className="p2p-right-links"
                          >
                            {t("postads")}
                          </Link>
                        </span>
                        <span className="p2p-right-links">
                          <img
                            src={require("../assets/icons/p2p-payment.webp")}
                            alt="p2p-payment"
                            className="p2p-right-icons"
                          />
                          <Link
                            to={
                              loginStatus == true ? "/Paymentmethod" : "/login"
                            }
                            className="p2p-right-links"
                          >
                            {t("payment_Method")}
                          </Link>
                        </span>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="filter-btns-wrapper mb-5">
                        <div className="fil-buy-sell">
                          <span
                            className={`fil-sell ${
                              orderType === "buy" ? "fil-buy" : ""
                            }`}
                            onClick={() => setOrderType("buy")}
                          >
                            {t("buy")}
                          </span>
                          <span
                            className={`fil-sell ${
                              orderType === "sell" ? "fil-sell-red" : ""
                            }`}
                            onClick={() => setOrderType("sell")}
                          >
                            {t("sell")}
                          </span>
                        </div>

                        <div className="fil-country fil_drp_mob">
                          <Dropdown
                            placeholder="Crypto "
                            fluid
                            selection
                            options={cryptoCurrencies}
                            onChange={(e, { value }) =>
                              setSelectedCrypto(value)
                            }
                          />
                        </div>

                        <div className="fil-country fil_drp_mob">
                          <Dropdown
                            placeholder="Fiat "
                            fluid
                            selection
                            options={fiatCurrencies}
                            onChange={(e, { value }) => setSelectedFiat(value)}
                          />
                        </div>

                        <div className="fil-payment fil_drp_mob">
                          <Dropdown
                            placeholder={t("allPaymentMethod")}
                            fluid
                            selection
                            options={preferPayment}
                            onChange={(e, { value }) => setPaymentMethod(value)}
                            value={paymentMethod}
                          />
                        </div>

                        <div className="fil-enter fil_drp_mob">
                          <input
                            type="text"
                            placeholder={t("available_Limits")}
                            className="fil-amount fil_drp_mob"
                            value={amount}
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            // onChange={(e) => setAmount(e.target.value)}
                            onChange={(e) => {
                              const value = e.target.value;
                              // const numericValue = value.replace(/\D/g, "");
                              const numericValue = value.replace(
                                /[^0-9.]/g,
                                ""
                              );
                              const parts = numericValue.split(".");
                              if (parts.length > 2) {
                                return;
                              }
                              if (numericValue.length <= 15) {
                                setAmount(numericValue);
                              }
                            }}
                          />
                          <span className="fil-inr">
                            {selectedCrypto ? selectedCrypto : ""}
                          </span>
                          {/* <span className="white-das">|</span>
                          <span className="fil-search">Search</span> */}
                        </div>
                      </div>

                      <div className="table-responsive table-cont new_desig_non">
                        <table className="table">
                          <thead>
                            <tr className="stake-head-p2pnew">
                              <th>{t("advertiser")}</th>
                              {/* <th className="opt-nowrap txt-center pad-left-23"> */}
                              <th className="opt-nowrap pad-left-23 newpad_respdesi">
                                {t("price")}
                              </th>
                              <th className="opt-nowrap pad-left-23 newpad_respdesi">
                                {t("available_Limits")}
                              </th>
                              <th className="opt-nowrap pad-left-23 newpad_respdesi">
                                {t("payment_Method")}
                              </th>
                              <th className="opt-nowrap pad-left-23 newpad_respdesi">
                                {/* Date & Time */}
                                {t("ordersCount")}
                              </th>
                              <th className="table_action p-r-25">
                                {t("action")}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredOrders && filteredOrders.length > 0 ? (
                              filteredOrders.map((options, i) => (
                                <React.Fragment key={options.id}>
                                  {i === isIndexVal ? (
                                    <tr>
                                      <td colSpan="5">
                                        <div className="row bord-top">
                                          <div className="col-lg-7 pad-all-3">
                                            <div className="table-flex">
                                              <div className="p2p_namefrst_change">
                                                <span>
                                                  {options.displayname.charAt(
                                                    0
                                                  )}
                                                </span>
                                              </div>
                                              <div className="table-opt-name">
                                                <h4 className="opt-nowrap opt-name font_14">
                                                  {options.displayname}
                                                </h4>
                                                <h3 className="opt-nowrap opt-sub font_14 font_12_nepp">
                                              {` Trades : ${options.trades} | ⭐ : ${options.stars}`}
                                            </h3>
                                                {/* <h3 className="opt-nowrap opt-sub font_14 font_12_nepp">
                                                  {`${
                                                    options.orders_count
                                                  } Volume | ${parseFloat(
                                                    options.rating
                                                  ).toFixed(
                                                    2
                                                  )} % Transaction rate`}
                                                </h3> */}
                                              </div>
                                            </div>
                                            <div className="ad-buy-details">
                                              <div className="opt-nowrap opt-term font_14 ">
                                                {options.price}{" "}
                                                {options?.secondCurrency}
                                                <div className="opt-price-span mar-t-price">
                                                  {t("price")}
                                                </div>
                                              </div>
                                              <div className="opt-nowrap opt-term font_14 ">
                                                <span className="opt-pay">
                                                  {options.paymentMethod}{" "}
                                                </span>
                                                <div className="opt-price-span mar-t-price">
                                                  {t("payment_Method")}
                                                </div>
                                              </div>
                                              <div className="opt-nowrap opt-term font_14">
                                                {options && options.fromLimit} -{" "}
                                                {options && options.toLimit}{" "}
                                                {options &&
                                                  options.firstCurrency}
                                                <div className="opt-price-span mar-t-price">
                                                  {t("limit")}
                                                </div>
                                              </div>
                                              <div className="opt-nowrap opt-term font_14 ">
                                                {options.pay_duration}
                                                <div className="opt-price-span mar-t-price">
                                                  {t("payment_Time_Limit")}
                                                </div>
                                              </div>
                                              <div className="opt-nowrap opt-term font_14 ">
                                                {options.available_qty}{" "}
                                                {options.firstCurrency}
                                                <div className="opt-price-span mar-t-price">
                                                  {t("available")}
                                                </div>
                                              </div>

                                              {options.requirements != null &&
                                              options.requirements != "" ? (
                                                <div className="opt-nowrap opt-term font_14 ">
                                                  {options.requirements}{" "}
                                                  <div className="opt-price-span mar-t-price">
                                                    {t("requirements")}
                                                  </div>
                                                </div>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>

                                          <div className="col-lg-5 col-md-6 col-sm-6 col-5 youpay">
                                            <form className="youpay-form">
                                              <label htmlFor="quantity-sell">
                                                {t("enterquantityto")}{" "}
                                                {orderType == "buy"
                                                  ? "Buy"
                                                  : "Sell"}
                                              </label>
                                              <div className="p2p-pay-input mb-4">
                                                <input
                                                  id="quantity-sell"
                                                  type="text"
                                                  placeholder={t("enterAmount")}
                                                  className="w-100 pay-input mb-0"
                                                  value={payAmount}
                                                  onChange={(e) => {
                                                    // Allow only numbers and limit the length to 10 digits
                                                    const value =
                                                      e.target.value;
                                                    if (
                                                      value.length <= 30 &&
                                                      /^[0-9]*\.?[0-9]*$/.test(
                                                        value
                                                      )
                                                    ) {
                                                      handlePayAmountChange(e);
                                                    }
                                                  }}
                                                  onKeyDown={(evt) =>
                                                    [
                                                      "e",
                                                      "E",
                                                      "+",
                                                      "-",
                                                    ].includes(evt.key) &&
                                                    evt.preventDefault()
                                                  }
                                                />
                                                {error && (
                                                  <p className="errorcss mb-0">
                                                    {error}
                                                  </p>
                                                )}
                                                <span className="youpay-span">
                                                  {options.firstCurrency}
                                                </span>
                                              </div>

                                              <label htmlFor="you-pay">
                                                {t("youwillpay")}
                                              </label>
                                              <div className="p2p-pay-input">
                                                <input
                                                  type="text"
                                                  placeholder="0.00"
                                                  className="w-100 receive-input"
                                                  value={receiveAmount}
                                                  readOnly
                                                />
                                                <span>
                                                  {options.secondCurrnecy}
                                                </span>
                                              </div>

                                              <label htmlFor="you-pay">
                                                {t("selectPaymentMethod")}
                                              </label>

                                              <div className=" mb-4">
                                                {options.paymentMethod ==
                                                "All Payment" ? (
                                                  <Dropdown
                                                    placeholder={t(
                                                      "choosePayMethod"
                                                    )}
                                                    className="you-pay-select"
                                                    fluid
                                                    selection
                                                    options={allpayment}
                                                    onChange={(e, { value }) =>
                                                      setselectPayment(value)
                                                    }
                                                    value={selectPayment}
                                                  />
                                                ) : (
                                                  <Dropdown
                                                    placeholder={t(
                                                      "choosePayMethod"
                                                    )}
                                                    className="you-pay-select"
                                                    fluid
                                                    selection
                                                    options={[
                                                      {
                                                        value:
                                                          options.paymentMethod,
                                                        text: options.paymentMethod,
                                                      },
                                                    ]}
                                                    onChange={(e, { value }) =>
                                                      setselectPayment(value)
                                                    }
                                                    value={selectPayment}
                                                  />
                                                )}
                                              </div>

                                              <div className="youpay-btns">
                                                <button
                                                  type="button"
                                                  className="youpay-cancel"
                                                  onClick={handleCancel}
                                                >
                                                  {t("cancel")}
                                                </button>
                                                {orderType == "buy" ? (
                                                  <Link
                                                    type="submit"
                                                    onClick={() =>
                                                      confirm_order_buy()
                                                    }
                                                    className={`${
                                                      orderType == "buy"
                                                        ? "fil-buy"
                                                        : "action_btn_sell"
                                                    } `}
                                                  >
                                                    {t("buy")}
                                                  </Link>
                                                ) : (
                                                  <Link
                                                    type="submit"
                                                    onClick={() =>
                                                      confirm_order_sell()
                                                    }
                                                    className={`${
                                                      orderType == "buy"
                                                        ? "fil-buy"
                                                        : "youpay-sell"
                                                    } `}
                                                  >
                                                    <span className="mx-1">
                                                      {t("sell")}
                                                    </span>
                                                    {options.firstCurrency}
                                                  </Link>
                                                )}
                                              </div>
                                            </form>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={options.id}>
                                      <td>
                                        <div className="table-flex">
                                          {/* <img
                                          src={require(`../assets/j.png`)}
                                          alt={options.optName}
                                        /> */}
                                          <div className="p2p_namefrst_change">
                                            <span>
                                              {options.displayname.charAt(0)}
                                            </span>
                                          </div>
                                          <div className="table-opt-name">
                                            <h4 className="opt-nowrap opt-name font_14">
                                              {options.displayname}
                                            </h4>
                                            <h3 className="opt-nowrap opt-sub font_14 font_12_nepp">
                                              {` Trades : ${options.trades} | ⭐ : ${options.stars}`}
                                            </h3>
                                          </div>
                                        </div>
                                      </td>
                                      {/* <td className="opt-nowrap opt-price font_14 table_center_text pad-left-23"> */}
                                      <td className="opt-nowrap opt-price font_14 pad-left-23 newpad_respdesi">
                                        <span className="opt-price-span">
                                          {options.price}
                                        </span>{" "}
                                        {options?.secondCurrency}
                                      </td>

                                      <td className="opt-nowrap opt-percent font_14 pad-left-23 newpad_respdesi">
                                        <div className="table-opt-name table-flex-col">
                                          <h4 className="opt-name font_14">
                                            <span className="opt-sub opt-sub-amt new_pp_amn">
                                              {t("amount")}{" "}
                                            </span>
                                            <span className="opt-amount">
                                              {options && options.available_qty}{" "}
                                              {options && options.firstCurrency}
                                            </span>
                                          </h4>
                                          <h3 className="opt-sub font_14">
                                            <span className="opt-sub opt-sub-lmt new_pp_amn">
                                              {t("limit")}{" "}
                                            </span>
                                            <span className="opt-amount">
                                              {" "}
                                              {options &&
                                                options.fromLimit} -{" "}
                                              {options && options.toLimit}{" "}
                                              {options && options.firstCurrency}
                                            </span>
                                          </h3>
                                        </div>
                                      </td>
                                      <td className="opt-nowrap opt-term font_14 pad-left-23 newpad_respdesi">
                                        <span className="opt-pay">
                                          {options && options.paymentMethod}{" "}
                                        </span>
                                      </td>
                                      <td className="opt-nowrap opt-price font_14 pad-left-23 newpad_respdesi">
                                        {/* {moment(options.date).format("lll")} */}
                                        {/* <h3 className="opt-nowrap opt-sub font_14 font_12_nepp"> */}
                                        <h3 className="opt-nowrap font_14">
                                          {`${
                                            options.orders_count
                                          } Volume | ${parseFloat(
                                            options.rating
                                          ).toFixed(2)} % Transaction rate`}
                                        </h3>
                                      </td>

                                      <td className="opt-btn-flex table-action pad-left-23">
                                        {loginStatus == true ? (
                                          <>
                                            {options.user_id ==
                                            UserIDref.current ? (
                                              <Link
                                                className={`${
                                                  orderType == "buy"
                                                    ? "p2p-buy"
                                                    : "action_btn_sell"
                                                } `}
                                                to={`/p2p/order/${options.orderId}`}
                                              >
                                                {t("view")}
                                              </Link>
                                            ) : (
                                              <Link
                                                className={`${
                                                  orderType == "buy"
                                                    ? "p2p-buy"
                                                    : "action_btn_sell"
                                                } `}
                                                onClick={() =>
                                                  handleClick(i, options)
                                                }
                                              >
                                                {orderType == "buy"
                                                  ? "Buy"
                                                  : "Sell"}
                                              </Link>
                                            )}
                                          </>
                                        ) : (
                                          <button
                                            className="action_btn"
                                            onClick={() => loginNave()}
                                          >
                                            {t("login")}
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
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
                      </div>
                      <div className="new_desig_disfrst">
                        {filteredOrders && filteredOrders.length > 0
                          ? filteredOrders.map((options, i) => (
                              <div className="p2p_resp_man" key={options.id}>
                                <div className="p2p_resp_man_dis">
                                  <div className="p2p_resp_cente">
                                    <div className="table-flex">
                                      <div className="p2p_namefrst_change">
                                        <span>
                                          {options.displayname.charAt(0)}
                                        </span>
                                      </div>
                                      <h4 className="p2p_name_nw">
                                        {options.displayname}
                                      </h4>
                                    </div>
                                    <div className="">
                                      <h3 className="nw_p2p_ordercou">
                                        {`${
                                          options.orders_count
                                        } Volume | ${parseFloat(
                                          options.rating
                                        ).toFixed(2)} % Transaction rate`}
                                      </h3>
                                    </div>
                                    <div className="nwp2p_pricespa_min">
                                      <span className="nwp2p_pricespa">
                                        {options.price}
                                      </span>{" "}
                                      {options?.secondCurrency}
                                    </div>
                                    <div className="nwp2p_limico_man">
                                      <h3 className="">
                                        <span className="">
                                          {t("amount")}:{" "}
                                        </span>
                                        <span className="">
                                          {options && options.available_qty}{" "}
                                          {options && options.firstCurrency}
                                        </span>
                                      </h3>
                                      <h3 className="">
                                        <span className="">{t("limit")}: </span>
                                        <span className="">
                                          {" "}
                                          {options && options.fromLimit} -{" "}
                                          {options && options.toLimit}{" "}
                                          {options && options.firstCurrency}
                                        </span>
                                      </h3>
                                    </div>
                                    <div className="newp2p_spa_betpay">
                                      <div className="newp2p_spa_betpay_below">
                                        <span className="p2pnw_payme">
                                          {options && options.paymentMethod}{" "}
                                        </span>
                                      </div>
                                      <div className="table-action-nwpp">
                                        {loginStatus == true ? (
                                          <>
                                            {options.user_id ==
                                            UserIDref.current ? (
                                              <Link
                                                className={`${
                                                  orderType == "buy"
                                                    ? "p2p-buy"
                                                    : "action_btn_sell"
                                                } `}
                                                to={`/p2p/order/${options.orderId}`}
                                              >
                                                {t("view")}
                                              </Link>
                                            ) : (
                                              <Link
                                                className={`${
                                                  orderType == "buy"
                                                    ? "p2p-buy"
                                                    : "action_btn_sell"
                                                } `}
                                                onClick={() =>
                                                  handleClick(i, options)
                                                }
                                              >
                                                {orderType == "buy"
                                                  ? "Buy"
                                                  : "Sell"}
                                              </Link>
                                            )}
                                          </>
                                        ) : (
                                          <button
                                            className="action_btn"
                                            onClick={() => loginNave()}
                                          >
                                            {t("login")}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {i === isIndexVal && (
                                  <div className="youpay">
                                    <form className="youpay-form">
                                      <label htmlFor="quantity-sell">
                                        {t("enterquantityto")}{" "}
                                        {orderType == "buy" ? "Buy" : "Sell"}
                                      </label>
                                      <div className="p2p-pay-input mb-4">
                                        <input
                                          id="quantity-sell"
                                          type="text"
                                          placeholder={t("enterAmount")}
                                          className="w-100 pay-input mb-0"
                                          value={payAmount}
                                          onChange={(e) => {
                                            // Allow only numbers and limit the length to 10 digits
                                            const value = e.target.value;
                                            if (
                                              value.length <= 30 &&
                                              /^[0-9]*\.?[0-9]*$/.test(value)
                                            ) {
                                              handlePayAmountChange(e);
                                            }
                                          }}
                                          onKeyDown={(evt) =>
                                            ["e", "E", "+", "-"].includes(
                                              evt.key
                                            ) && evt.preventDefault()
                                          }
                                        />
                                        {error && (
                                          <p className="errorcss mb-0">
                                            {error}
                                          </p>
                                        )}
                                        <span className="youpay-span">
                                          {options.firstCurrency}
                                        </span>
                                      </div>

                                      <label htmlFor="you-pay">
                                        {t("youwillpay")}
                                      </label>
                                      <div className="p2p-pay-input">
                                        <input
                                          type="text"
                                          placeholder="0.00"
                                          className="w-100 receive-input"
                                          value={receiveAmount}
                                          readOnly
                                        />
                                        <span>{options.secondCurrnecy}</span>
                                      </div>

                                      <label htmlFor="you-pay">
                                        {t("selectPaymentMethod")}
                                      </label>

                                      <div className=" mb-4">
                                        {options.paymentMethod ==
                                        "All Payment" ? (
                                          <Dropdown
                                            placeholder={t("choosePayMethod")}
                                            className="you-pay-select"
                                            fluid
                                            selection
                                            options={allpayment}
                                            onChange={(e, { value }) =>
                                              setselectPayment(value)
                                            }
                                            value={selectPayment}
                                          />
                                        ) : (
                                          <Dropdown
                                            placeholder={t("choosePayMethod")}
                                            className="you-pay-select"
                                            fluid
                                            selection
                                            options={[
                                              {
                                                value: options.paymentMethod,
                                                text: options.paymentMethod,
                                              },
                                            ]}
                                            onChange={(e, { value }) =>
                                              setselectPayment(value)
                                            }
                                            value={selectPayment}
                                          />
                                        )}
                                      </div>

                                      <div className="youpay-btns">
                                        <button
                                          type="button"
                                          className="youpay-cancel"
                                          onClick={handleCancel}
                                        >
                                          {t("cancel")}
                                        </button>
                                        {orderType == "buy" ? (
                                          <Link
                                            type="submit"
                                            onClick={() => confirm_order_buy()}
                                            className={`${
                                              orderType == "buy"
                                                ? "fil-buy"
                                                : "action_btn_sell"
                                            } `}
                                          >
                                            {t("buy")}
                                          </Link>
                                        ) : (
                                          <Link
                                            type="submit"
                                            onClick={() => confirm_order_sell()}
                                            className={`${
                                              orderType == "buy"
                                                ? "fil-buy"
                                                : "youpay-sell"
                                            } `}
                                          >
                                            <span className="mx-1">
                                              {t("sell")}
                                            </span>
                                            {options.firstCurrency}
                                          </Link>
                                        )}
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            ))
                          : ""}
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

export default P2P;
