import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import "semantic-ui-css/semantic.min.css";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";
import DashboardLayout from "./DashboardLayout";
import Payment from "./view-order";

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
  const [selectedFiat, setSelectedFiat] = useState("");
  const [profileData, setProfileData, profileDataRef] = useState("");
  const [isBuy, setIsBuy] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [isIndexVal, setIsIndexVal] = useState("");
  const [UserID, setUserID, UserIDref] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [preferPayment, setpreferPayment] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [cryptoStartIndex, setCryptoStartIndex] = useState(0);

  const visibleCryptoCount = 3;

  const visibleCryptos = cryptoCurrencies.slice(
    cryptoStartIndex,
    cryptoStartIndex + visibleCryptoCount,
  );

  const canGoPrev = cryptoStartIndex > 0;
  const canGoNext =
    cryptoStartIndex + visibleCryptoCount < cryptoCurrencies.length;

  usePageLeaveConfirm("Are you sure you want to leave P2P?", "/p2p", true, [
    "/p2p/order/:id",
    "/processorders",
    "/p2p/chat/:id",
    "/myorders",
    "/p2p/dispute/:id",
    "/postad",
    "/Paymentmethod",
  ]);

  const allpayment = [
    { key: "imps", text: "IMPS", value: "IMPS" },
    { key: "upid", text: "UPID", value: "UPID" },
    { key: "paytm", text: "Paytm", value: "Paytm" },
    { key: "bankTransfer", text: "Bank Transfer", value: "BankTransfer" },
  ];

  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      setLoginStatus(true);
      const token = sessionStorage.getItem("PTKToken");
      const PTK = token ? token.split("_")[1] : "";
      setUserID(PTK);
      getAllP2POrders();
      getProfile();
    } else {
      getAllP2POrdersbefore();
      setLoginStatus(false);
    }

    getAllCurrency();
    getallPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        payload: { currency: selectedCrypto || selectedFiat },
      };
      const resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setP2POrders(resp.Message);
        setFilteredOrders(resp.Message);
      }
    } catch (error) {
      setSiteLoader(false);
      console.error(error);
    }
  };

  const getAllP2POrders = async () => {
    try {
      setSiteLoader(true);
      const data = {
        apiUrl: apiService.p2pGetOrder,
        payload: { currency: selectedCrypto || selectedFiat },
      };
      const resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setP2POrders(resp.Message);
        setFilteredOrders(resp.Message);
      }
    } catch (error) {
      setSiteLoader(false);
      console.error(error);
    }
  };

  const getAllCurrency = async () => {
    try {
      setSiteLoader(true);
      const data = { apiUrl: apiService.getP2Pcurrency };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data) {
        const cryptoArray = resp.data
          .filter((c) => c.coinType === "1")
          .map((currency) => ({
            key: currency._id,
            text: currency.currencySymbol || currency.name || "Unknown",
            value: currency.currencySymbol || currency.name || "Unknown",
            image: { avatar: true, src: currency.Currency_image },
          }));
        const fiatArray = resp.data
          .filter((c) => c.coinType === "2")
          .map((currency) => ({
            key: currency._id,
            text: currency.currencySymbol || currency.name || "Unknown",
            value: currency.currencySymbol || currency.name || "Unknown",
            image: { avatar: true, src: currency.Currency_image },
          }));
        console.log("Crypto Array:", cryptoArray);
        console.log("Fiat Array:", fiatArray);
        setCryptoCurrencies(cryptoArray);
        setFiatCurrencies(fiatArray);
      } else {
        console.warn("No currency data received from API");
      }
    } catch (error) {
      setSiteLoader(false);
      console.error("Error fetching currencies:", error);
    }
  };

  const getProfile = async () => {
    try {
      setSiteLoader(true);
      const data = { apiUrl: apiService.getUserDetails };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) setProfileData(resp.data);
    } catch (error) {
      setSiteLoader(false);
    }
  };

  const getallPaymentMethods = async () => {
    try {
      setSiteLoader(true);
      const data = { apiUrl: apiService.get_p2p_payments };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data && resp.data.length > 0) {
        const response = resp.data.map((p) => ({
          key: p._id,
          text: p.payment_name,
          value: p.payment_name,
        }));
        setpreferPayment(response);
      }
    } catch (error) {
      setSiteLoader(false);
      console.error(error);
    }
  };

  const filterOrders = () => {
    setSiteLoader(true);
    let filtered = Array.isArray(p2pOrders) ? p2pOrders.slice() : [];
    if (paymentMethod)
      filtered = filtered.filter((o) => o.paymentMethod === paymentMethod);
    if (orderType) filtered = filtered.filter((o) => o.orderType !== orderType);
    if (selectedCrypto)
      filtered = filtered.filter((o) => o.firstCurrency === selectedCrypto);
    if (selectedFiat)
      filtered = filtered.filter((o) => o.secondCurrency === selectedFiat);
    if (amount)
      filtered = filtered.filter(
        (o) => amount >= o.fromLimit && amount <= o.toLimit,
      );
    setFilteredOrders(filtered);
    setSiteLoader(false);
  };

  const handleClick = (i, option) => {
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
    }
    if (numericValue <= 0) {
      setError(t("amtMustBeGreaterThanZero"));
      return false;
    }
    if (isBuy && numericValue < isBuy.fromLimit) {
      setError(`${t("amtShouldNotlessThan")} ${isBuy.fromLimit}.`);
      return false;
    }
    if (isBuy && numericValue > isBuy.toLimit) {
      setError(`${t("amountShouldNotExceed")} ${isBuy.toLimit}.`);
      return false;
    }
    if (isBuy && numericValue > isBuy.available_qty) {
      setError(`${t("amtShouldNotExceedThanAvlQuan")} ${isBuy.available_qty}.`);
      return false;
    }
    setError("");
    return true;
  };

  const handlePayAmountChange = (e) => {
    const value = e.target.value;
    if (validatePayAmount(value)) {
      setPayAmount(value);
      const calculatedReceiveAmount =
        parseFloat(value) * parseFloat(isBuy.price || 0);
      setReceiveAmount(
        isNaN(calculatedReceiveAmount)
          ? ""
          : calculatedReceiveAmount.toFixed(2),
      );
    } else {
      setPayAmount(value);
      setReceiveAmount("");
    }
  };

  const handleCancel = () => {
    setPayAmount("");
    setReceiveAmount("");
    setIsIndexVal("");
  };

  const confirm_order_buy = async () => {
    try {
      if (payAmount !== "" && receiveAmount !== "") {
        if (selectPayment !== "") {
          const obj = {
            qty: payAmount,
            total: receiveAmount,
            paymentMethod: selectPayment,
            orderId: isBuy.orderId,
            type: "buy",
          };
          setSiteLoader(true);
          const data = { apiUrl: apiService.p2p_confirm_order, payload: obj };
          const resp = await postMethod(data);
          setSiteLoader(false);
          if (resp.status) {
            toast.success(resp.Message);
            navigate(resp.link || "/");
          } else toast.error(resp.Message);
        } else toast.error("Please select the payment methods");
      } else toast.error("Please enter valid quantity");
    } catch (error) {
      setSiteLoader(false);
    }
  };

  const confirm_order_sell = async () => {
    try {
      const obj = {
        qty: payAmount,
        paymentMethod: selectPayment,
        total: receiveAmount,
        orderId: isBuy.orderId,
        type: "sell",
      };
      if (obj.qty !== "" && obj.total !== "") {
        if (selectPayment !== "") {
          setSiteLoader(true);
          const data = {
            apiUrl: apiService.p2p_confirm_sellorder,
            payload: obj,
          };
          const resp = await postMethod(data);
          setSiteLoader(false);
          if (resp.status) {
            toast.success(resp.Message);
            navigate(resp.link || "/");
            window.location.href = resp.link || "/";
          } else toast.error(resp.Message);
        } else toast.error("Please select the payment methods");
      } else toast.error("Please enter quantity");
    } catch (error) {
      setSiteLoader(false);
    }
  };

  console.log("Filtered Orders:", filteredOrders);

  return (
    <DashboardLayout>
      {siteLoader ? (
        <div className="loadercss">
          <Bars
            height="80"
            width="80"
            color="#ffc630"
            ariaLabel="bars-loading"
            visible={true}
          />
        </div>
      ) : (
        <section className="asset_section">
          <div className="buy_head">
            <div className="w-full">
              <div className="bg-black rounded-xl p-4">
                <div className="p2p_header_row flex justify-between items-center mb-6">
                  <div>
                    <h2 className="p2p_main_title text-[#BD7F10]">
                      P2P Platform
                    </h2>
                    <h3 className="p2p_main_title text-[#ffff]">
                      P2P Marketplace
                    </h3>
                    <span className="p2p_subtitle text-[#BD7F10]">
                      Institutional marketplace for high-volume asset
                      conversion.
                    </span>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      to={loginStatus ? "/postad" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-black px-4 py-2 rounded-lg flex items-center"
                    >
                      + Post Advertisement
                    </Link>
                    <Link
                      to={loginStatus ? "/Paymentmethod" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-black px-4 py-2 rounded-lg flex items-center"
                    >
                      Payment Method
                    </Link>
                    <Link
                      to={loginStatus ? "/processorders" : "/login"}
                      className="post-black-btn bg-[#BD7F10] text-black px-4 py-2 rounded-lg flex items-center"
                    >
                      {t("orders")}
                    </Link>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3 col-md-4 col-12">
                    <div className="w-full max-w-[340px] space-y-6">
                      {/* Buy / Sell Toggle */}
                      <div className="flex rounded-2xl bg-[#060913] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                        <button
                          type="button"
                          onClick={() => setOrderType("buy")}
                          className={`flex-1 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                            orderType === "buy"
                              ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                              : "text-[#7f8798] hover:text-white"
                          }`}
                        >
                          {t("buy")}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOrderType("sell")}
                          className={`flex-1 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                            orderType === "sell"
                              ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                              : "text-[#7f8798] hover:text-white"
                          }`}
                        >
                          {t("sell")}
                        </button>
                      </div>

                      {/* Market Filters Card */}
                      {/* <div className="rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,#141b2d_0%,#11182a_100%)] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"> */}
                      <div className="rounded-[28px] border border-white/5 bg-[#181a20] px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                        <div className="mb-6 flex items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5 text-white/90"
                          >
                            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
                          </svg>
                          <span className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-white">
                            Market Filters
                          </span>
                        </div>

                        {/* Asset */}
                        <div className="mb-6">
                          <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.2em] text-white/85">
                            Asset
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                canGoPrev &&
                                setCryptoStartIndex((prev) =>
                                  Math.max(prev - 1, 0),
                                )
                              }
                              disabled={!canGoPrev}
                              className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-[#282A30] transition-all ${
                                canGoPrev
                                  ? "text-white hover:bg-white/10"
                                  : "cursor-not-allowed text-white/30"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                            </button>

                            <div className="flex flex-1 gap-3 overflow-hidden">
                              {visibleCryptos && visibleCryptos.length > 0 ? (
                                visibleCryptos.map((crypto) => (
                                  <button
                                    key={crypto.key}
                                    type="button"
                                    onClick={() =>
                                      setSelectedCrypto(crypto.value)
                                    }
                                    className={`min-w-[72px] rounded-lg px-4 py-3 text-sm font-bold uppercase transition-all duration-200 whitespace-nowrap ${
                                      selectedCrypto === crypto.value
                                        ? "bg-[#c98a11] text-white"
                                        : "bg-[#282A30] text-white hover:bg-white/12"
                                    }`}
                                  >
                                    {crypto.text || "N/A"}
                                  </button>
                                ))
                              ) : (
                                <div className="text-xs text-white/50">
                                  No assets available
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                canGoNext &&
                                setCryptoStartIndex((prev) =>
                                  Math.min(
                                    prev + 1,
                                    cryptoCurrencies.length -
                                      visibleCryptoCount,
                                  ),
                                )
                              }
                              disabled={!canGoNext}
                              className={`flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-[#282A30] transition-all ${
                                canGoNext
                                  ? "text-white hover:bg-white/10"
                                  : "cursor-not-allowed text-white/30"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="mb-6">
                          <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.2em] text-white/85">
                            Amount
                          </label>

                          <div className="flex items-center rounded-xl bg-[#050811] px-4 py-4">
                            <input
                              type="text"
                              placeholder="Enter amount..."
                              value={amount}
                              onChange={(e) => {
                                const v = e.target.value.replace(
                                  /[^0-9.]/g,
                                  "",
                                );
                                const parts = v.split(".");
                                if (parts.length <= 2 && v.length <= 15)
                                  setAmount(v);
                              }}
                              className="w-full border-none bg-transparent text-base text-white outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus:border-none focus:shadow-none placeholder:text-[#6b7280]"
                            />
                            <span className="ml-3 text-sm font-bold uppercase text-white">
                              {selectedCrypto}
                            </span>
                          </div>
                        </div>

                        {/* Fiat Currency */}
                        <div className="mb-6">
                          <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.2em] text-white/85">
                            Fiat Currency
                          </label>

                          <div className="relative">
                            <div className="[&_.ui.selection.dropdown]:!min-h-[56px] [&_.ui.selection.dropdown]:!w-full [&_.ui.selection.dropdown]:!rounded-xl [&_.ui.selection.dropdown]:!border-0 [&_.ui.selection.dropdown]:!bg-[#050811] [&_.ui.selection.dropdown]:!px-4 [&_.ui.selection.dropdown]:!pr-12 [&_.ui.selection.dropdown]:!text-white [&_.ui.selection.dropdown]:!shadow-none [&_.ui.selection.dropdown]:!flex [&_.ui.selection.dropdown]:!items-center [&_.ui.selection.dropdown>.text]:!text-white [&_.ui.selection.dropdown>.default.text]:!text-[#6b7280] [&_.ui.selection.dropdown>.dropdown.icon]:!hidden">
                              <Dropdown
                                placeholder="USD - US Dollar"
                                fluid
                                selection
                                options={fiatCurrencies}
                                onChange={(e, { value }) =>
                                  setSelectedFiat(value)
                                }
                                value={selectedFiat || ""}
                              />
                            </div>

                            <svg
                              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f8798]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-8">
                          <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.2em] text-white/85">
                            Payment Method
                          </label>

                          <div className="relative">
                            <div className="[&_.ui.selection.dropdown]:!min-h-[56px] [&_.ui.selection.dropdown]:!w-full [&_.ui.selection.dropdown]:!rounded-xl [&_.ui.selection.dropdown]:!border-0 [&_.ui.selection.dropdown]:!bg-[#050811] [&_.ui.selection.dropdown]:!px-4 [&_.ui.selection.dropdown]:!pr-12 [&_.ui.selection.dropdown]:!text-white [&_.ui.selection.dropdown]:!shadow-none [&_.ui.selection.dropdown]:!flex [&_.ui.selection.dropdown]:!items-center [&_.ui.selection.dropdown>.text]:!text-white [&_.ui.selection.dropdown>.default.text]:!text-[#6b7280] [&_.ui.selection.dropdown>.dropdown.icon]:!hidden">
                              <Dropdown
                                placeholder={t("allPaymentMethod")}
                                fluid
                                selection
                                options={preferPayment}
                                onChange={(e, { value }) => {
                                  e.stopPropagation();
                                  setPaymentMethod(value);
                                }}
                                value={paymentMethod || ""}
                              />
                            </div>

                            <svg
                              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7f8798]"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>

                        {/* More Filters */}
                        <div className="mb-6 flex cursor-pointer items-center justify-between text-[#c98a11]">
                          <span className="text-[12px] font-bold uppercase tracking-[0.2em]">
                            More Filters
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                          <label className="flex items-center gap-4 cursor-pointer">
                            <input type="checkbox" className="peer sr-only" />
                            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#c98a11] bg-transparent text-[#c98a11] peer-checked:bg-[#c98a11] peer-checked:text-[#111827]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="h-3.5 w-3.5"
                              >
                                <path d="M5 12l5 5L20 7" />
                              </svg>
                            </span>
                            <span className="text-[15px] leading-7 text-white/85">
                              Verified Merchants
                              <br />
                              Only
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9 col-md-8 col-12">
                    {/* <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,#141b2d_0%,#11182a_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"> */}
                    <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#181a20] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                      <div className="overflow-x-auto">
                        <table className="table-auto w-max min-w-full border-separate border-spacing-0">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55">
                                {t("advertiser")}
                              </th>
                              <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55">
                                {t("price")}
                              </th>
                              <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55">
                                {t("available_Limits")}
                              </th>
                              <th className="px-1 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55 whitespace-nowrap">
                                {t("payment_Method")}
                              </th>
                              <th className="px-3 py-4 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55 whitespace-nowrap">
                                {t("action")}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredOrders && filteredOrders.length > 0 ? (
                              filteredOrders.map((options, i) => (
                                <React.Fragment key={options.orderId || i}>
                                  <tr className="border-t border-white/5 align-middle transition-colors hover:bg-white/[0.02]">
                                    <td className="px-4 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c98a11] text-sm font-extrabold uppercase text-white shadow-[0_8px_20px_rgba(201,138,17,0.28)]">
                                          {options.displayname?.charAt(0)}
                                        </div>

                                        <div className="min-w-0">
                                          <h4 className="truncate text-sm font-semibold text-white">
                                            {options.displayname}
                                          </h4>
                                          <div className="mt-1 truncate text-xs text-white/55">
                                            {`Trades: ${options.trades} | ⭐ ${options.stars}`}
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <div className="text-base font-extrabold text-white">
                                        {options.price}
                                      </div>
                                      <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                                        {options.secondCurrency}
                                      </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                      <div className="space-y-1.5">
                                        <div className="text-sm text-white/85">
                                          <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                                            Available
                                          </span>
                                          {options.available_qty}{" "}
                                          {options.firstCurrency}
                                        </div>
                                        <div className="text-sm text-white/85">
                                          <span className="mr-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                                            Limit
                                          </span>
                                          {options.fromLimit} -{" "}
                                          {options.toLimit}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="px-1 py-4 whitespace-nowrap">
                                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/85">
                                        {options.paymentMethod}
                                      </span>
                                    </td>

                                    <td className="px-3 py-4 text-right whitespace-nowrap">
                                      {loginStatus ? (
                                        options.user_id == UserIDref.current ? (
                                          <Link
                                            className="inline-flex min-w-[96px] items-center justify-center rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/15"
                                            to={`/p2p/order/${options.orderId}`}
                                          >
                                            {t("view")}
                                          </Link>
                                        ) : (
                                          <button
                                            className={`inline-flex min-w-[120px] items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                                              orderType === "buy"
                                                ? "bg-[#c98a11] text-black hover:bg-[#d79a1a]"
                                                : "bg-[#d14b4b] text-black hover:bg-[#df5b5b]"
                                            }`}
                                            onClick={() =>
                                              handleClick(i, options)
                                            }
                                          >
                                            {orderType === "buy"
                                              ? "Buy"
                                              : "Sell"}{" "}
                                            {options.firstCurrency}
                                          </button>
                                        )
                                      ) : (
                                        <button
                                          className="inline-flex min-w-[96px] items-center justify-center rounded-xl bg-[#c98a11] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#d79a1a]"
                                          onClick={() => navigate("/login")}
                                        >
                                          {t("login")}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                  {i === isIndexVal && (
                                    <tr className="bg-[#09111d]">
                                      <td colSpan={5} className="px-4 py-6">
                                        <div className="rounded-[24px] border border-white/10 bg-[#04060d] p-6">
                                          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                                            <div className="space-y-4">
                                              <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c98a11] text-base font-extrabold uppercase text-black">
                                                  {options.displayname?.charAt(
                                                    0,
                                                  )}
                                                </div>
                                                <div>
                                                  <h4 className="text-sm font-semibold text-white">
                                                    {options.displayname}
                                                  </h4>
                                                  <p className="mt-1 text-xs text-white/60">
                                                    {`Trades: ${options.trades} | ⭐ ${options.stars}`}
                                                  </p>
                                                </div>
                                              </div>

                                              <div className="grid gap-3 sm:grid-cols-2">
                                                <div className="rounded-2xl bg-white/5 p-4">
                                                  <div className="text-[13px] uppercase tracking-[0.22em] text-white/50">
                                                    {t("price")}
                                                  </div>
                                                  <div className="mt-2 text-lg font-semibold text-white">
                                                    {options.price}{" "}
                                                    {options.secondCurrency}
                                                  </div>
                                                </div>

                                                <div className="rounded-2xl bg-white/5 p-4">
                                                  <div className="text-[13px] uppercase tracking-[0.22em] text-white/50">
                                                    {t("payment_Method")}
                                                  </div>
                                                  <div className="mt-2 text-lg font-semibold text-white">
                                                    {options.paymentMethod}
                                                  </div>
                                                </div>

                                                <div className="rounded-2xl bg-white/5 p-4">
                                                  <div className="text-[13px] uppercase tracking-[0.22em] text-white/50">
                                                    {t("limit")}
                                                  </div>
                                                  <div className="mt-2 text-lg font-semibold text-white">
                                                    {options.fromLimit} -{" "}
                                                    {options.toLimit}{" "}
                                                    {options.firstCurrency}
                                                  </div>
                                                </div>

                                                <div className="rounded-2xl bg-white/5 p-4">
                                                  <div className="text-[13px] uppercase tracking-[0.22em] text-white/50">
                                                    {t("available")}
                                                  </div>
                                                  <div className="mt-2 text-lg font-semibold text-white">
                                                    {options.available_qty}{" "}
                                                    {options.firstCurrency}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>

                                            <div className="rounded-[24px] border border-white/10 bg-[#07101a] p-6">
                                              <form className="space-y-5">
                                                <div>
                                                  <label className="mb-3 block text-sm font-semibold text-white/70">
                                                    {t("enterquantityto")}{" "}
                                                    {orderType === "buy"
                                                      ? t("buy")
                                                      : t("sell")}
                                                  </label>
                                                  <div className="relative">
                                                    <input
                                                      type="text"
                                                      placeholder={t(
                                                        "enterAmount",
                                                      )}
                                                      value={payAmount}
                                                      onChange={(e) => {
                                                        const value =
                                                          e.target.value;
                                                        if (
                                                          value.length <= 30 &&
                                                          /^[0-9]*\.?[0-9]*$/.test(
                                                            value,
                                                          )
                                                        ) {
                                                          handlePayAmountChange(
                                                            e,
                                                          );
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
                                                      className="w-full rounded-2xl border border-white/10 bg-[#02060d] px-4 py-3 text-white outline-none focus:border-[#c98a11] focus:ring-2 focus:ring-[#c98a11]/20"
                                                    />
                                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase text-white/70">
                                                      {options.firstCurrency}
                                                    </span>
                                                  </div>
                                                  {error && (
                                                    <p className="mt-2 text-sm text-red-500">
                                                      {error}
                                                    </p>
                                                  )}
                                                </div>

                                                <div>
                                                  <label className="mb-3 block text-sm font-semibold text-white/70">
                                                    {t("youwillpay")}
                                                  </label>
                                                  <div className="rounded-2xl border border-white/10 bg-[#02060d] px-4 py-3 text-white">
                                                    <div className="flex items-center justify-between">
                                                      <span>
                                                        {receiveAmount ||
                                                          "0.00"}
                                                      </span>
                                                      <span className="text-xs uppercase text-white/70">
                                                        {options.secondCurrency}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div>
                                                  <label className="mb-3 block text-sm font-semibold text-white/70">
                                                    {t("selectPaymentMethod")}
                                                  </label>
                                                  <Dropdown
                                                    placeholder={t(
                                                      "choosePayMethod",
                                                    )}
                                                    fluid
                                                    selection
                                                    options={
                                                      options.paymentMethod ===
                                                      "All Payment"
                                                        ? allpayment
                                                        : [
                                                            {
                                                              key: options.paymentMethod,
                                                              text: options.paymentMethod,
                                                              value:
                                                                options.paymentMethod,
                                                            },
                                                          ]
                                                    }
                                                    onChange={(e, { value }) =>
                                                      setselectPayment(value)
                                                    }
                                                    value={selectPayment || ""}
                                                    className="you-pay-select"
                                                  />
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                                  <button
                                                    type="button"
                                                    className="inline-flex justify-center rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-bold text-white transition hover:border-[#c98a11] hover:text-[#c98a11]"
                                                    onClick={handleCancel}
                                                  >
                                                    {t("cancel")}
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={
                                                      orderType === "buy"
                                                        ? confirm_order_buy
                                                        : confirm_order_sell
                                                    }
                                                    className={`inline-flex justify-center rounded-2xl px-5 py-3 text-sm font-bold text-white transition ${
                                                      orderType === "buy"
                                                        ? "bg-[#c98a11] hover:bg-[#d79a1a]"
                                                        : "bg-[#d14b4b] hover:bg-[#df5b5b]"
                                                    }`}
                                                  >
                                                    {orderType === "buy"
                                                      ? t("buy")
                                                      : t("sell")}
                                                  </button>
                                                </div>
                                              </form>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-4 py-10 text-center text-sm text-white/60"
                                >
                                  {t("noRecordsFound")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </DashboardLayout>
  );
};

export default P2P;
