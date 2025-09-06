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

  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>

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
        <div>
          <div className="Verification">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="mt-5">
                    <h6>
                      <Link to="/p2p" className="text-white">
                        <i className="fa-solid fa-arrow-left-long mr-3"></i>{" "}
                        {t('back')}
                      </Link>
                    </h6>

                    <div className="row justify-content-center">
                      <div className="col-lg-7 post-ad-card mt-4">
                        <div className="post-ad-title">{t('postAd')}</div>

                        <form>
                          <div
                            className="nav nav-tabs nav_bottom_line"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className="nav-link nav-das active"
                              id="nav-buy-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-buy"
                              type="button"
                              role="tab"
                              aria-controls="nav-buy"
                              aria-selected="true"
                            >
                              {t('iwantobuy')}
                            </button>
                            <button
                              className="nav-link nav-das"
                              id="sell-profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#sell-profile"
                              type="button"
                              role="tab"
                              aria-controls="nav-profile"
                              aria-selected="false"
                            >
                              {t('iwanttosell')}
                            </button>
                          </div>

                          <div className="tab-content" id="nav-tabContent">
                            {/* Buy Tab Content */}
                            <div
                              className="tab-pane fade show active"
                              id="nav-buy"
                              role="tabpanel"
                              aria-labelledby="nav-buy-tab"
                              tabindex="0"
                            >
                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('cryptoCurrency')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="Please Select The Crypto"
                                  options={cryptoCurrencies}
                                  value={formData.cryptoCurrency}
                                  onChange={(e, { value }) => {
                                    setFormData((prevData) => {
                                      const updatedData = {
                                        ...prevData,
                                        cryptoCurrency: value,
                                      };
                                      validateForm(updatedData);
                                      return updatedData;
                                    });
                                  }}
                                  className="ad-input-field"
                                />
                                {errors.cryptoCurrency && (
                                  <p className="errorcss">
                                    {errors.cryptoCurrency}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('fiatCurrency')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="Please Select The Fiat"
                                  options={fiatCurrencies}
                                  value={formData.fiatCurrency}
                                  onChange={(e, { value }) => {
                                    setFormData((prevData) => {
                                      const updatedData = {
                                        ...prevData,
                                        fiatCurrency: value,
                                      };
                                      validateForm(updatedData);
                                      return updatedData;
                                    });
                                  }}
                                  className="ad-input-field"
                                />
                                {errors.fiatCurrency && (
                                  <p className="errorcss">
                                    {errors.fiatCurrency}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('quantity')}
                                </h6>
                                <input
                                  type="number"
                                  name="quantity"
                                  value={formData.quantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Quantity"
                                />

                                {errors.quantity && (
                                  <p className="errorcss">{errors.quantity}</p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('minimumQuantity')}
                                </h6>
                                <input
                                  type="number"
                                  name="minQuantity"
                                  value={formData.minQuantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Minimum Quantity"
                                />
                                {errors.minQuantity && (
                                  <p className="errorcss">
                                    {errors.minQuantity}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('maximumQuantity')}
                                </h6>
                                <input
                                  type="number"
                                  name="maxQuantity"
                                  value={formData.maxQuantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Maximum Quantity"
                                />
                                {errors.maxQuantity && (
                                  <p className="errorcss">
                                    {errors.maxQuantity}
                                  </p>
                                )}
                                {errors.quantityRange && (
                                  <p className="errorcss">
                                    {errors.quantityRange}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">{t('price')}</h6>
                                <input
                                  type="number"
                                  name="price"
                                  value={formData.price}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 20 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 20
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Price"
                                />
                                {errors.price && (
                                  <p className="errorcss">{errors.price}</p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('lowestOrderPrice')}
                                </h6>
                                <input
                                  readOnly
                                  type="number"
                                  name="lowestOrderPrice"
                                  value={formData.lowestOrderPrice}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 20 &&
                                      /^[0-9]*$/.test(value)
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Lowest Order Price"
                                />
                              </div>

                              {/* <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  Preferred Payment
                                </h6>
                                <select
                                  className="ad-input-field prefer-select"
                                  name="preferredPayment"
                                  value={formData.preferredPayment}
                                  onChange={handleChange}
                                >
                                  <option value="All Payment">
                                    All Payment
                                  </option>
                                  <option value="IMPS">IMPS</option>
                                  <option value="UPID">UPI</option>
                                  <option value="Paytm">PAYTM</option>
                                  <option value="BankTransfer">
                                    Account Transfer
                                  </option>
                                </select>
                              </div> */}

                              {/*FIXME:  Test All PAYMENTS*/}

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('preferredPayment')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="Select Payment Method"
                                  options={paymentMethods}
                                  value={formData.preferredPayment}
                                  onChange={(e, { value }) =>
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      preferredPayment: value,
                                    }))
                                  }
                                  className="ad-input-field"
                                />
                              </div>

                              {/* <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  Payment Time
                                </h6>
                                <select
                                  className="ad-input-field prefer-select"
                                  name="paymentTime"
                                  value={formData.paymentTime}
                                  onChange={handleChange}
                                >
                                  <option value="15 Minutes">15 Minutes</option>
                                  <option value="30 Minutes">30 Minutes</option>
                                  <option value="45 Minutes">45 Minutes</option>
                                  <option value="60 Minutes">60 Minutes</option>
                                  <option value="90 Minutes">
                                    90 Minutes Hour
                                  </option>
                                </select>
                              </div> */}

                              {/*FIXME:  TEST PAYMENT TIME */}

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('paymentTime')}
                                </h6>

                                <Dropdown
                                  inline
                                  placeholder="All Payment"
                                  options={paymentTime}
                                  value={formData.paymentTime}
                                  onChange={(e, { value }) =>
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      paymentTime: value,
                                    }))
                                  }
                                  className="ad-input-field"
                                />
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('requirements')}
                                </h6>
                                <textarea
                                  name="requirements"
                                  value={formData.requirements}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 500
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  className="ad-input-field"
                                  placeholder="Enter Your Requirements"
                                  rows="10"
                                />
                              </div>


                              <div className="mt-4 mb-1">
                                <div className="terms">
                                  <div className="checkbox-container">
                                    <input
                                      id="custom-checkbox"
                                      type="checkbox"
                                      name="termsAccepted"
                                      checked={formData.termsAccepted}
                                      onChange={handleChange}
                                      className="input-field regular_checkbox"
                                    />
                                    <label htmlFor="custom-checkbox"></label>
                                  </div>
                                  <label
                                    htmlFor="custom-checkbox"
                                    className="terms-check "
                                  >
                                    {t('ihavereadandagretothe')}
                                    <Link to="/terms" className="text-yellow">
                                      {" "}
                                      {t('termsConditions')}{" "}
                                    </Link>{" "}
                                    {t('and')}{" "}
                                    <Link to="/privacy" className="text-yellow">
                                      {" "}
                                      {t('privacyPolicy')}
                                    </Link>
                                  </label>
                                </div>
                              </div>

                              {errors.termsAccepted && (
                                <p className="errorcss">
                                  {errors.termsAccepted}
                                </p>
                              )}

                              {/* <div className="terms">
                                <div class="input-groups terms-checkbox">
                                  <input
                                    id="custom-checkbox"
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="custom-checkbox"></label>
                                </div>
                                <p className="terms-check">
                                  I have read and agree to the
                                  <span> Terms</span> and{" "}
                                  <span>Conditions</span>
                                </p>
                                {errors.termsAccepted && (
                                  <p className="errorcss">
                                    {errors.termsAccepted}
                                  </p>
                                )}
                              </div> */}

                              <div className="Submit mt-3">
                                <button
                                  type="submit"
                                  onClick={(e) => handleSubmit(e, "buy")}
                                >
                                  {t('postAd')}
                                </button>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="sell-profile"
                              role="tabpanel"
                              aria-labelledby="sell-profile-tab"
                              tabindex="0"
                            >
                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('cryptoCurrency')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="Please Select The Crypto"
                                  options={cryptoCurrencies}
                                  value={formData.cryptoCurrency}
                                  onChange={(e, { value }) => {
                                    setFormData((prevData) => {
                                      const updatedData = {
                                        ...prevData,
                                        cryptoCurrency: value,
                                      };
                                      validateForm(updatedData);
                                      return updatedData;
                                    });
                                  }}
                                  className="ad-input-field"
                                />
                                {errors.cryptoCurrency && (
                                  <p className="errorcss">
                                    {errors.cryptoCurrency}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('fiatCurrency')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="Please Select The Fiat"
                                  options={fiatCurrencies}
                                  value={formData.fiatCurrency}
                                  onChange={(e, { value }) => {
                                    setFormData((prevData) => {
                                      const updatedData = {
                                        ...prevData,
                                        fiatCurrency: value,
                                      };
                                      validateForm(updatedData);
                                      return updatedData;
                                    });
                                  }}
                                  className="ad-input-field"
                                />
                                {errors.fiatCurrency && (
                                  <p className="errorcss">
                                    {errors.fiatCurrency}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('quantity')}
                                </h6>
                                <input
                                  type="text"
                                  name="quantity"
                                  value={formData.quantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*\.?[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Quantity"
                                />
                                {errors.quantity && (
                                  <p className="errorcss">{errors.quantity}</p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('minimumQuantity')}
                                </h6>
                                <input
                                  type="number"
                                  name="minQuantity"
                                  value={formData.minQuantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Minimum Quantity"
                                />
                                {errors.minQuantity && (
                                  <p className="errorcss">
                                    {errors.minQuantity}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('maximumQuantity')}
                                </h6>
                                <input
                                  type="number"
                                  name="maxQuantity"
                                  value={formData.maxQuantity}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 10 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 10
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Maximum Quantity"
                                />
                                {errors.maxQuantity && (
                                  <p className="errorcss">
                                    {errors.maxQuantity}
                                  </p>
                                )}
                                {errors.quantityRange && (
                                  <p className="errorcss">
                                    {errors.quantityRange}
                                  </p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">{t('price')}</h6>
                                <input
                                  type="number"
                                  name="price"
                                  value={formData.price}
                                  // onChange={(e) => {
                                  //   // Allow only numbers and limit the length to 10 digits
                                  //   const value = e.target.value;
                                  //   if (
                                  //     value.length <= 20 &&
                                  //     /^[0-9]*$/.test(value)
                                  //   ) {
                                  //     handleChange(e);
                                  //   }
                                  // }}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 20
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Price"
                                />
                                {errors.price && (
                                  <p className="errorcss">{errors.price}</p>
                                )}
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('highestOrderPrice')}
                                </h6>
                                <input
                                  readOnly
                                  type="text"
                                  name="higeshOrderPrice"
                                  value={formData.higeshOrderPrice}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 20 &&
                                      /^[0-9]*$/.test(value)
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  onKeyDown={(evt) =>
                                    ["e", "E", "+", "-"].includes(evt.key) &&
                                    evt.preventDefault()
                                  }
                                  className="ad-input-field"
                                  placeholder="Enter the Highest Order Price"
                                />
                              </div>

                              {/* <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  Preferred Payment
                                </h6>
                                <select
                                  className="ad-input-field prefer-select"
                                  name="preferredPayment"
                                  value={formData.preferredPayment}
                                  onChange={handleChange}
                                >
                                  <option value="All Payment">
                                    All Payment
                                  </option>
                                  <option value="IMPS">IMPS</option>
                                  <option value="UPID">UPI</option>
                                  <option value="Paytm">PAYTM</option>
                                  <option value="BankTransfer">
                                    Account Transfer
                                  </option>
                                </select>
                              </div> */}

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('preferredPayment')}
                                </h6>
                                <Dropdown
                                  inline
                                  placeholder="All Payment"
                                  options={paymentMethods}
                                  value={formData.preferredPayment}
                                  onChange={(e, { value }) =>
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      preferredPayment: value,
                                    }))
                                  }
                                  className="ad-input-field"
                                />
                              </div>

                              {/* <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  Payment Time
                                </h6>
                                <select
                                  className="ad-input-field prefer-select"
                                  name="paymentTime"
                                  value={formData.paymentTime}
                                  onChange={handleChange}
                                >
                                  <option value="15">15 Minutes</option>
                                  <option value="30">30 Minutes</option>
                                  <option value="45">45 Minutes</option>
                                  <option value="60">60 Minutes</option>
                                  <option value="90">90 Minutes Hour</option>
                                </select>
                              </div> */}

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('paymentTime')}
                                </h6>

                                <Dropdown
                                  inline
                                  placeholder="All Payment"
                                  options={paymentTime}
                                  value={formData.paymentTime}
                                  onChange={(e, { value }) =>
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      paymentTime: value,
                                    }))
                                  }
                                  className="ad-input-field"
                                />
                              </div>

                              <div className="input-groups">
                                <h6 className="input-label ad-title">
                                  {t('requirements')}
                                </h6>
                                <textarea
                                  name="requirements"
                                  value={formData.requirements}
                                  onChange={(e) => {
                                    // Allow only numbers and limit the length to 10 digits
                                    const value = e.target.value;
                                    if (
                                      value.length <= 500
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  className="ad-input-field"
                                  placeholder="Enter Your Requirements"
                                  rows="10"
                                />
                              </div>

                              <div className="my-4">
                                <div className="terms">
                                  <div className="checkbox-container">
                                    <input
                                      id="custom-checkbox"
                                      type="checkbox"
                                      name="termsAccepted"
                                      checked={formData.termsAccepted}
                                      onChange={handleChange}
                                      className="input-field regular_checkbox"
                                    />
                                    <label htmlFor="custom-checkbox"></label>
                                  </div>
                                  <label
                                    htmlFor="custom-checkbox"
                                    className="terms-check "
                                  >
                                    {t('ihavereadandagretothe')}
                                    <Link to="/terms" className="text-yellow">
                                      {" "}
                                      {t('termsConditions')}{" "}
                                    </Link>{" "}
                                    {t('and')}{" "}
                                    <Link to="/privacy" className="text-yellow">
                                      {" "}
                                      {t('privacyPolicy')}
                                    </Link>
                                  </label>
                                </div>
                              </div>

                              {errors.termsAccepted && (
                                <p className="errorcss">
                                  {errors.termsAccepted}
                                </p>
                              )}

                              {/* <div className="terms">
                                <div class="input-groups terms-checkbox">
                                  <input
                                    id="custom-checkbox"
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="custom-checkbox"></label>
                                </div>
                                <p className="terms-check">
                                  I have read and agree to the
                                  <span> Terms</span> and{" "}
                                  <span>Conditions</span>
                                </p>
                                {errors.termsAccepted && (
                                  <p className="errorcss">
                                    {errors.termsAccepted}
                                  </p>
                                )}
                              </div> */}

                              <div className="Submit">
                                <button
                                  type="submit"
                                  onClick={(e) => handleSubmit(e, "sell")}
                                >
                                  {t('postAd')}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
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

export default PostAd;
