import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import { Bars } from "react-loader-spinner";
import axios from "axios";
import { Dropdown } from "semantic-ui-react";
import apiService from "../core/service/detail";
import { postMethod, getMethod } from "../core/service/common.api";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";
import DashboardLayout from "./DashboardLayout";
const PostAd = () => {
    const { t } = useTranslation();
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);
  const [allcryptoCurrencies, setallCryptoCurrencies] = useState([]);
  const [siteLoader, setSiteLoader] = useState(false);

  const [fiatCurrencies, setFiatCurrencies] = useState([]);

  const [highprice, sethighprice, highpriceref] = useState(0);
  const [lowprice, setlowprice, lowpriceref] = useState(0);
  const [paymentMethods,setpaymentMethods] = useState([]);

  let navigate = useNavigate();
        //  usePageLeaveConfirm(
        //    "Are you sure you want to leave P2P?",
        //    "/postad",
        //    true,
        //    [
        //      "/p2p/order/:id",
        //      "/processorders",
        //      "/p2p/chat/:id",
        //      "/myorders",
        //      "/p2p/dispute/:id",
        //      "/p2p",
        //      "/Paymentmethod",
        //    ]
        //  );

  const [formData, setFormData, formDataref] = useState({
    cryptoCurrency: "",
    fiatCurrency: "",
    quantity: "",
    minQuantity: "",
    maxQuantity: "",
    price: "",
    lowestOrderPrice: "",
    higeshOrderPrice: "",
    preferredPayment: "All Payment",
    testPrefPayment: "All Payment", //Test all payments
    paymentTime: "15 Minutes",
    testPaymentTime: "15 Minutes", //Test Payment time
    termsAccepted: false,
    requirements:""
  });

  const [errors, setErrors] = useState({});

  // const paymentMethods = [
  //   // {
  //   //   key: "allpayment",
  //   //   text: (
  //   //     <div className="d-flex align-items-center fw-300">
  //   //       {/* <div className="pay-bor bg-imps"></div> */}
  //   //       ALL PAYMENT
  //   //     </div>
  //   //   ),
  //   //   value: "All Payment",
  //   // },
  //   // {
  //   //   key: "imps",
  //   //   text: (
  //   //     <div className="d-flex align-items-center fw-300">
  //   //       {/* <div className="pay-bor bg-imps"></div> */}
  //   //       IMPS
  //   //     </div>
  //   //   ),
  //   //   value: "IMPS",
  //   // },
  //   // {
  //   //   key: "upid",
  //   //   text: (
  //   //     <div className="d-flex align-items-center fw-300">
  //   //       {/* <div className="pay-bor bg-upi"></div> */}
  //   //       UPID
  //   //     </div>
  //   //   ),
  //   //   value: "UPID",
  //   // },
  //   // {
  //   //   key: "paytm",
  //   //   text: (
  //   //     <div className="d-flex align-items-center fw-300">
  //   //       {/* <div className="pay-bor bg-paytm"></div> */}
  //   //       Paytm
  //   //     </div>
  //   //   ),
  //   //   value: "Paytm",
  //   // },
  //   {
  //     key: "bankTransfer",
  //     text: (
  //       <div className="d-flex align-items-center fw-300">
  //         {/* <div className="pay-bor bg-bank"></div> */}
  //         Bank Transfer
  //       </div>
  //     ),
  //     value: "BankTransfer",
  //   },
  // ];

  const paymentTime = [
    {
      key: "15minutes",
      text: <div className="d-flex align-items-center fw-300">15 Minutes</div>,
      value: "15 Minutes",
    },
    {
      key: "30minutes",
      text: <div className="d-flex align-items-center fw-300">30 Minutes</div>,
      value: "30 Minutes",
    },
    {
      key: "45minutes",
      text: <div className="d-flex align-items-center fw-300">45 Minutes</div>,
      value: "45 Minutes",
    },
    {
      key: "60minutes",
      text: <div className="d-flex align-items-center fw-300">60 Minutes</div>,
      value: "60 Minutes",
    },
    {
      key: "90minutes",
      text: <div className="d-flex align-items-center fw-300">90 Minutes</div>,
      value: "90 Minutes",
    },
  ];

  useEffect(() => {
    getCurrencies();
    getallPaymentMethods();
  }, []);

  const getCurrencies = async () => {
    try {
      setSiteLoader(true);
      const data = {
        apiUrl: apiService.getP2Pcurrency,
        // payload : {fromCurrency : "USD"}
      };

      const response = await getMethod(data);
      setSiteLoader(false);

      if (response.status) {
        setallCryptoCurrencies(response.data);

        const cryptos = response.data
          .filter((currency) => currency.coinType === "1")
          .map((currency) => ({
            value: currency.currencySymbol,
            text: currency.currencyName,
            image: {
              avatar: true,
              src: currency.Currency_image,
            },
          }));

        const fiat = response.data
          .filter((currency) => currency.coinType === "2")
          .map((currency) => ({
            value: currency.currencySymbol,
            text: currency.currencyName,
            image: {
              avatar: true,
              src: currency.Currency_image,
            },
          }));
        setCryptoCurrencies(cryptos);
        setFiatCurrencies(fiat);
      } else {
        setCryptoCurrencies([]);
        setFiatCurrencies([]);
      }
    } catch (err) {
      console.error("Error fetching currencies:", err);
    }
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
        setpaymentMethods(response);
      }
     }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      // [name]: type === "checkbox" ? checked : value.trim(),
      [name]: type === "checkbox" ? checked : value,
    }));

    validateForm(formDataref.current);
  };


  const handleChange_req = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    validateForm(formDataref.current);
  };
  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.cryptoCurrency) {
      newErrors.cryptoCurrency = "Please select a cryptocurrency.";
    } else if (!formData.fiatCurrency) {
      newErrors.fiatCurrency = "Please select a fiat currency.";
    } else if (!formData.quantity) {
      newErrors.quantity = "Quantity is required.";
    } else if (!formData.minQuantity) {
      newErrors.minQuantity = "Minimum quantity is required.";
    } else if (
      formData.minQuantity &&
      formData.quantity &&
      Number(formData.minQuantity) > Number(formData.quantity)
    ) {
      newErrors.minQuantity =
        "Minimum quantity must be less than or equal to quantity.";
    } else if (
      formData.minQuantity &&
      formData.maxQuantity &&
      Number(formData.minQuantity) > Number(formData.maxQuantity)
    ) {
      newErrors.quantityRange =
        "Minimum quantity must be less than or equal to maximum quantity.";
    } else if (!formData.maxQuantity) {
      newErrors.maxQuantity = "Maximum quantity is required.";
    } else if (
      formData.maxQuantity &&
      formData.quantity &&
      Number(formData.maxQuantity) > Number(formData.quantity)
    ) {
      newErrors.maxQuantity =
        "Maximum quantity must be less than or equal to quantity.";
    } else if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (!formData.lowestOrderPrice) {
      newErrors.lowestOrderPrice = "Lowest order price is required.";
    } else if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e, type) => {
    console.log("Form submitted:", formData); //

    console.log(type, "type");
    e.preventDefault();
    // return;

    formData["orderType"] = type;
    formData["firstCurrency"] = formDataref.current.cryptoCurrency;

    if (validateForm(formDataref.current)) {
      console.log("Form submitted:", formData);
      // return;
      setSiteLoader(true);
      var data = {
        apiUrl: apiService.p2pOrder,
        payload: formDataref.current,
      };

      var resp = await postMethod(data);
      setSiteLoader(false);

      console.log(resp, "resp");

      if (resp.status) {
        toast.success(resp.Message);
        navigate("/myorders");
        setFormData({});
      } else {
        console.log("error response====", resp);
        if (resp.bank) {
          toast.error(resp.Message);
          navigate("/Paymentmethod");
          setFormData({});
        } else {
          // navigate("/p2p");
          setFormData({});
          toast.error(resp.Message);
        }
      }

      // Here you can send the form data to your API
    }
  };

  const [exchangeRate, setExchangeRate, exchangeRateref] = useState(0); // New state for exchange rate

  const fetchExchangeRate = async (cryptoCurrency, fiatCurrency) => {
    try {
      const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptoCurrency}&tsyms=${fiatCurrency}&api_key=93e3c5b6fe23291d2114acf508c57635e90100074cf42266f20cd231e5f8e854`;
      const response = await axios.get(apiUrl);

      if (response.data) {
        const pricevalue = response.data[cryptoCurrency][fiatCurrency];
        setExchangeRate(pricevalue);

        setFormData((prevData) => ({
          ...prevData,
          lowestOrderPrice: pricevalue,
          higeshOrderPrice: pricevalue,
          price: pricevalue,
        }));

        console.log(pricevalue);
      } else {
        setExchangeRate(null);
      }
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
      setExchangeRate(null);
    }
  };

  // useEffect(() => {
  //   if (formData.cryptoCurrency && formData.fiatCurrency) {
  //     fetchExchangeRate(formData.cryptoCurrency, formData.fiatCurrency);

  //     const cryptos = allcryptoCurrencies.filter(
  //       (currency) => currency.currencySymbol === formData.cryptoCurrency
  //     );
  //     const Fiat = allcryptoCurrencies.filter(
  //       (currency) => currency.currencySymbol === formData.fiatCurrency
  //     );

  //     // Check if cryptos[0] and Fiat[0] exist before accessing _id
  //     formData["fromcurrency"] = cryptos.length > 0 ? cryptos[0]._id : "";
  //     formData["tocurrency"] = Fiat.length > 0 ? Fiat[0]._id : "";
  //     fiat_price();
  //   }
  // }, [formData.cryptoCurrency, formData.fiatCurrency]);

  // const fiat_price = async () => {
  //   var payload = {
  //     fromCurrency: formData.cryptoCurrency,
  //     toCurrency: formData.fiatCurrency,
  //   };

  //   var data = {
  //     apiUrl: apiService.fetch_price,
  //     payload: payload,
  //   };

  //   var resp = await postMethod(data);
  //   console.log(resp.data, "fiat price -=-=-resp=-=-");

  //   formData.lowestOrderPrice = resp.data.lowprice
  //     ? resp.data.lowprice
  //     : formDataref.current.price;
  //   formData.higeshOrderPrice = resp.data.highprice
  //     ? resp.data.highprice
  //     : formDataref.current.price;

  //   if (resp) {
  //     // sethighprice(high);
  //     // setlowprice(low);
  //   }
  // };

    useEffect(() => {
    if (formData.cryptoCurrency && formData.fiatCurrency) {

      fiat_price(formData.cryptoCurrency, formData.fiatCurrency);
      
      const cryptos = allcryptoCurrencies.filter(
        (currency) => currency.currencySymbol === formData.cryptoCurrency
      );
      const Fiat = allcryptoCurrencies.filter(
        (currency) => currency.currencySymbol === formData.fiatCurrency
      );

      // Check if cryptos[0] and Fiat[0] exist before accessing _id
      formData["fromcurrency"] = cryptos.length > 0 ? cryptos[0]._id : "";
      formData["tocurrency"] = Fiat.length > 0 ? Fiat[0]._id : "";
    }
  }, [formData.cryptoCurrency, formData.fiatCurrency]);

    const fiat_price = async (crypto, fiat) => {
    var payload = {
      fromCurrency: crypto,
      toCurrency: fiat,
    };

    var data = {
      apiUrl: apiService.fetch_price,
      payload: payload,
    };

    var resp = await postMethod(data);

    if (resp.status) {
      setFormData((prevData) => ({
        ...prevData,
        lowestOrderPrice: resp.data.lowprice
          ? resp.data.lowprice
          : resp.data.price,
        higeshOrderPrice: resp.data.highprice
          ? resp.data.highprice
          : resp.data.price,
        price: resp.data.price,
      }));
    }
  };

  const tradeType = formDataref.current.orderType || "buy";
  const updateTradeType = (type) => {
    setFormData((prev) => ({ ...prev, orderType: type }));
  };

  return (
    <>
      <DashboardLayout>
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
          // <section className="asset_section bg-[#0f1117] py-6 pt-6 lg:pt-20 ">
          <section className="asset_section bg-[#0f1117]">
            <div className="mx-auto max-w-[1160px] pt-0 lg:pt-6 px-2 md:px-4">
              <h2 className="text-2xl font-semibold text-[#B87A13]">
                P2P Platform
              </h2>
              <h3 className="mt-2 text-2xl font-semibold text-[#e7ecf6]">
                Post Advertisement
              </h3>
              <p className="mt-2 text-sm text-[#8f96a7]">
                Create a new buy or sell order for the P2P marketplace.
                Configure your pricing strategy and payment parameters below.
              </p>

              <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
                <form className="space-y-4">
                  <article className="rounded-xl border border-[#242b3a] bg-[#151b27] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#dbe2ef]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#B87A13]/20 text-xs text-[#B87A13]">
                        1
                      </span>
                      Pricing & Asset
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Trade Type
                        </label>
                        <div className="rounded-lg border border-[#2a3038] bg-[#0c111a] p-1">
                          <button
                            type="button"
                            onClick={() => updateTradeType("buy")}
                            className={`h-9 w-1/2 rounded-md text-xs font-semibold transition ${tradeType === "buy" ? "bg-[#B87A13] text-[#11161f]" : "text-[#c7cedd]"}`}
                          >
                            BUY
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTradeType("sell")}
                            className={`h-9 w-1/2 rounded-md text-xs font-semibold transition ${tradeType === "sell" ? "bg-[#B87A13] text-[#11161f]" : "text-[#c7cedd]"}`}
                          >
                            SELL
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Asset Selection
                        </label>
                        <select
                          value={formData.cryptoCurrency}
                          onChange={(e) => {
                            const updatedData = {
                              ...formData,
                              cryptoCurrency: e.target.value,
                            };

                            setFormData(updatedData);
                            validateForm(updatedData);
                          }}
                          className="h-11 w-full rounded-lg border border-[#2a3038] bg-[#0c111a] px-3 text-sm text-[#e5eaf4] outline-none focus:border-[#B87A13]"
                        >
                          <option value="">Select Crypto</option>
                          {cryptoCurrencies.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.value} ({c.text})
                            </option>
                          ))}
                        </select>
                        {errors.cryptoCurrency && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.cryptoCurrency}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Fiat Currency
                        </label>

                        <select
                          value={formData.fiatCurrency}
                          onChange={(e) => {
                            const updatedData = {
                              ...formData,
                              fiatCurrency: e.target.value,
                            };

                            setFormData(updatedData);
                            validateForm(updatedData);
                          }}
                          className="h-11 w-full rounded-lg border border-[#2a3038] bg-[#0c111a] px-3 text-sm text-[#e5eaf4]"
                        >
                          <option value="">Select Fiat</option>

                          {fiatCurrencies.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.text}
                            </option>
                          ))}
                        </select>

                        {errors.fiatCurrency && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.fiatCurrency}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-[#2a3038] bg-[#0c111a] p-3">
                        <p className="text-[11px] uppercase text-[#7f8799]">
                          Pricing Type
                        </p>
                        <button
                          type="button"
                          className="mt-2 h-9 rounded-md border border-[#B87A13] px-4 text-xs font-semibold text-[#B87A13]"
                        >
                          Fixed
                        </button>
                        <p className="mt-1 text-[11px] text-[#7f8799]">
                          Stays constant
                        </p>
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Your Price
                        </label>
                        <div className="flex h-11 items-center rounded-lg border border-[#2a3038] bg-[#0c111a] px-3">
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            // onChange={handleChange}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value.length <= 20) {
                                handleChange(e);
                              }
                            }}
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            className="w-full bg-transparent text-sm text-[#e7ecf6] outline-none"
                          />
                          {/* {errors.price && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.price}
                            </p>
                          )} */}
                          <span className="text-[11px] text-[#8a92a5]">
                            {formData.fiatCurrency}
                          </span>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.price}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between rounded-lg bg-[#0c111a] px-3 py-2 text-[11px]">
                          <div className="text-[#8c94a6]">
                            Market Avg{" "}
                            <span className="ml-2 text-[#d4dbea]">
                              {tradeType === "buy"
                                ? formData.lowestOrderPrice || "0"
                                : formData.higeshOrderPrice || "0"}
                            </span>
                          </div>
                          <div className="text-[#8c94a6]">
                            Your Price{" "}
                            <span className="ml-2 text-[#B87A13]">
                              {formData.price || "1.015"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>

                  <article className="rounded-xl border border-[#242b3a] bg-[#151b27] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#dbe2ef]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#B87A13]/20 text-xs text-[#B87A13]">
                        2
                      </span>
                      Inventory & Limits
                    </h4>
                    <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                      Total Inventory
                    </label>
                    <div className="flex h-11 items-center rounded-lg border border-[#2a3038] bg-[#0c111a] px-3">
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        // onChange={handleChange}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value.length <= 10) {
                            handleChange(e);
                          }
                        }}
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                        className="w-full bg-transparent text-sm text-[#e7ecf6] outline-none"
                      />
                      {/* <span className="text-[11px] text-[#B87A13]">MAX USDT</span> */}
                    </div>
                    {errors.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.quantity}
                      </p>
                    )}
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Order Minimum
                        </label>
                        <div className="flex h-11 items-center rounded-lg border border-[#2a3038] bg-[#0c111a] px-3">
                          <input
                            type="number"
                            name="minQuantity"
                            value={formData.minQuantity}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value.length <= 10) {
                                handleChange(e);
                              }
                            }}
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            className="w-full bg-transparent text-sm text-[#e7ecf6] outline-none"
                          />

                          {/* <span className="text-[11px] text-[#8a92a5]">
                            USD
                          </span> */}
                        </div>
                        {errors.minQuantity && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.minQuantity}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Order Maximum
                        </label>
                        <div className="flex h-11 items-center rounded-lg border border-[#2a3038] bg-[#0c111a] px-3">
                          <input
                            type="number"
                            name="maxQuantity"
                            value={formData.maxQuantity}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value.length <= 10) {
                                handleChange(e);
                              }
                            }}
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            className="w-full bg-transparent text-sm text-[#e7ecf6] outline-none"
                          />

                          {/* <span className="text-[11px] text-[#8a92a5]">
                            USD
                          </span> */}
                        </div>
                        {errors.maxQuantity && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.maxQuantity}
                          </p>
                        )}

                        {errors.quantityRange && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.quantityRange}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>

                  <article className="rounded-xl border border-[#242b3a] bg-[#151b27] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                    <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#dbe2ef]">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#B87A13]/20 text-xs text-[#B87A13]">
                        3
                      </span>
                      Payment & Logic
                    </h4>
                    <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                      Payment Methods
                    </label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {/* {paymentMethods.slice(0, 2).map((p) => ( */}
                      {paymentMethods.map((p) => (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() =>
                            setFormData((prevData) => ({
                              ...prevData,
                              preferredPayment: p.value,
                            }))
                          }
                          className={`h-10 rounded-lg border text-xs font-medium transition ${formData.preferredPayment === p.value ? "border-[#B87A13] bg-[#1d202b] text-[#f0c76a]" : "border-[#2a3038] bg-[#0c111a] text-[#c7cedd]"}`}
                        >
                          {p.text}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => navigate("/Paymentmethod")}
                        className="h-10 rounded-lg border border-[#2a3038] bg-[#0c111a] text-xs font-medium text-[#B87A13]"
                      >
                        ADD METHOD
                      </button>
                      {errors.preferredPayment && (
                        <p className="text-red-500 text-xs mt-2">
                          {errors.preferredPayment}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Payment Window
                        </label>
                        <select
                          value={formData.paymentTime}
                          onChange={(e) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              paymentTime: e.target.value,
                            }))
                          }
                          className="h-11 w-full rounded-lg border border-[#2a3038] bg-[#0c111a] px-3 text-sm text-[#e5eaf4] outline-none focus:border-[#B87A13]"
                        >
                          {paymentTime.map((pt) => (
                            <option key={pt.value} value={pt.value}>
                              {pt.value}
                            </option>
                          ))}
                        </select>
                        {errors.paymentTime && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.paymentTime}
                          </p>
                        )}
                      </div>
                      {/* <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                          Auto Reply (Optional)
                        </label>
                        <input
                          className="h-11 w-full rounded-lg border border-[#2a3038] bg-[#0c111a] px-3 text-sm text-[#e5eaf4] outline-none focus:border-[#B87A13]"
                          placeholder="I'm online, send proof after transfer..."
                        />
                      </div> */}
                    </div>
                    <div className="mt-4">
                      <label className="mb-2 block text-[11px] uppercase tracking-wide text-[#7f8799]">
                        Terms of Trade
                      </label>
                      <textarea
                        name="requirements"
                        value={formData.requirements}
                        // onChange={handleChange_req}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value.length <= 500) {
                            handleChange(e);
                          }
                        }}
                        rows={3}
                        className="w-full rounded-lg border border-[#2a3038] bg-[#0c111a] px-3 py-3 text-sm text-[#e5eaf4] outline-none focus:border-[#B87A13]"
                        placeholder="Be specific about your verification requirements..."
                      />
                      {errors.requirements && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.requirements}
                        </p>
                      )}
                    </div>
                  </article>
                </form>

                <aside className="space-y-4">
                  <article className="rounded-xl border border-[#242b3a] bg-[#151b27] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-wider text-[#7f8799]">
                        Live Ad Preview
                      </p>
                      <span className="rounded bg-[#B87A13]/15 px-2 py-1 text-[10px] font-semibold text-[#B87A13]">
                        PREVIEW
                      </span>
                    </div>
                    <div className="text-4xl font-semibold text-[#f4f7ff]">
                      {formData.price || "0"}
                    </div>
                    <p className="text-xs text-[#8b93a6]">
                      {" "}
                      {formData.fiatCurrency}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[#B87A13]">
                        {tradeType} {formData.cryptoCurrency}
                      </span>
                      <span className="text-[#9ba4b6]">
                        Limits {formData.minQuantity || "0"} -{" "}
                        {formData.maxQuantity || "0"} USD
                      </span>
                    </div>
                    {/* <div className="mt-4 border-t border-[#2a3038] pt-4">
                      <p className="text-sm font-semibold text-[#e6ebf5]">
                        Alex_Institutional
                      </p>
                      <p className="text-xs text-[#8f97aa]">
                        240 Trades • 99.83% Completion
                      </p>
                    </div> */}
                  </article>

                  {/* <article className="rounded-xl border border-[#242b3a] bg-[#151b27] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
                    <p className="text-[11px] uppercase tracking-wider text-[#7f8799]">
                      Merchant Requirements
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[#d5dcea]">
                      <li className="flex items-center gap-2">
                        <span className="text-[#B87A13]">■</span> Registered for
                        30+ days
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#B87A13]">■</span> Hold &gt; 0.01
                        BTC in Wallet
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-[#B87A13]">■</span> Completed
                        Identity Verification
                      </li>
                    </ul>
                  </article> */}

                  <div className="rounded-xl border border-[#2a3038] bg-[#151b27] p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1"
                      />

                      <label className="text-sm text-[#c7cedd]">
                        I have read and agree to the
                        <Link to="/terms" className="text-[#B87A13] ml-1">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-[#B87A13]">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    {errors.termsAccepted && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.termsAccepted}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleSubmit(e, tradeType)}
                    className="h-12 w-full rounded-xl bg-[#B87A13] text-sm font-semibold text-[#10151f] transition hover:bg-[#cd942f]"
                  >
                    POST ADVERTISEMENT
                  </button>
                  {/* <button
                    type="button"
                    className="h-11 w-full rounded-xl border border-[#2a3038] bg-[#131a26] text-xs font-semibold tracking-wide text-[#9ba4b6]"
                  >
                    SAVE AS DRAFT
                  </button> */}

                  {/* <article className="rounded-xl border border-[#2a3038] bg-[#141a24] p-4 text-xs text-[#8f97aa]">
                    Ads are subject to a 0.1% platform fee upon successful trade
                    completion. Ensure your wallet has sufficient liquidity
                    before posting.
                  </article> */}
                </aside>
              </div>
            </div>
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default PostAd;
