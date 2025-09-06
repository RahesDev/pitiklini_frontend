import React, { useEffect } from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";
import { Dropdown } from "semantic-ui-react";
import useStateRef from "react-usestateref";
import { Button, Form, Icon } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import { useTranslation } from "react-i18next";

const Swap = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [siteLoader, setSiteLoader] = useState(false);
  const [fromTab, setFromTab] = useState([]);
  const [toTab, setToTab] = useState([]);
  const [fromCurrency, setfromCurrency, fromref] = useState("");
  const [toCurrency, settoCurrency, toref] = useState("USDT");
  const [appendFromData, setappendFromData] = useState("");
  const [appendToData, setappendFToData] = useState("");
  const [fromcurrencyImage, setFromcurrencyImage] = useState("");
  const [tocurrencyImage, setTocurrencyImage] = useState("");
  const [swapTab, setswapTab] = useState(false);
  const [fromAmount, setfromAmount, fromAmountref] = useState(0);
  const [toAmount, settoAmount, toAmountref] = useState(0);
  const [minMax, setMinMax] = useState(10);
  const [price, setPrice, priceRef] = useState(0);
  const [estimateFee, setEstimationFee] = useState(0);
  const [totatlAmount, setTotalAmount] = useState(0);
  const [sitekycStatus, setsitekycStatus] = useState("DeActive");
  const [kycStatus, setkycStatus, kycstatusref] = useState(0);
  const [ButtonLoader, setButtonLoader] = useState(false);

  const [allCurrencyFiat, setfromCurrencyRef, fromCurrencyRef] = useState([]);
  const [toCurrencyRefs, setToCurrencyRef, toCurrencyRef] = useState([]);

  const [fromSwap, setfromSwapRef, fromSwapRef] = useState([]);
  const [toSwap, settoSwapRef, toSwapRef] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      getUserbalance();
      getKYCstatus();
      setLoginStatus(true);
      // getSiteSettingstatus();
    } else {
      getCurrenciesDatas();
      setLoginStatus(false);
    }
  }, [0]);

  const getCurrenciesDatas = async () => {
    try {
      var getDatas = {
        apiUrl: apiService.getCurrenciesDatas,
      };
      var resp = await getMethod(getDatas);
      console.log(resp, "---==-resp--=-");
      if (resp.status) {
        setFromTab(resp.data);
        setToTab(resp.data);
        var currArrayCrypto = [];
        //var currArrayFiat = [{value: "all", label: "Select"}];
        var currArrayFiat = [];
        var data = resp.data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].currencySymbol) {
            var obj = {
              value: data[i].currid,
              label: data[i].currencySymbol,
              key: data[i].currencySymbol,
              text: data[i].currencySymbol,
              image: {
                avatar: true,
                src: data[i].image,
              },
            };
            currArrayFiat.push(obj);
            currArrayCrypto.push(obj);
          }
        }
        setToCurrencyRef(currArrayFiat);
        setfromCurrencyRef(currArrayCrypto);
      }
    } catch (error) {}
  };

  const loginNave = async () => {
    navigate("/login");
  };

  const getUserbalance = async () => {
    var data1 = {
      apiUrl: apiService.getUserBalanceSwap,
    };
    var resp = await getMethod(data1);
    console.log(resp, "resp");
    if (resp.status) {
      setFromTab(resp.data);
      setToTab(resp.data);
      var currArrayCrypto = [];
      //var currArrayFiat = [{value: "all", label: "Select"}];
      var currArrayFiat = [];
      var data = resp.data;
      for (var i = 0; i < data.length; i++) {
        if (data[i].currencySymbol) {
          var obj = {
            value: data[i].currid,
            label: data[i].currencySymbol,
            key: data[i].currencySymbol,
            text: data[i].currencySymbol,
            image: {
              avatar: true,
              src: data[i].image,
            },
          };
          currArrayFiat.push(obj);
          currArrayCrypto.push(obj);
        }
      }
      setToCurrencyRef(currArrayFiat);
      setfromCurrencyRef(currArrayCrypto);
    } else {
    }
  };

  const setAmount = async (value, type) => {
    console.log("value", value, "type", type);
    console.log(appendFromData, "appendFromData");
    try {
      if (
        !isNaN(value) ||
        !value ||
        value != undefined ||
        value != null ||
        value == 0
      ) {
        if (appendFromData === "") {
          setErrorMsg("Choose spending currency");
        } else if (appendToData === "") {
          setErrorMsg("Choose receiving currency");
        } else if (value.length > 9) {
          setErrorMsg("Enter a valid amount");
        } else if (value == "00000") {
          setErrorMsg("Enter a valid amount");
        } else if (value > appendFromData.currencyBalance) {
          setErrorMsg("Insufficient balance");
        } else {
          console.log("=====");
          setErrorMsg("");
          type == "fromAmount" ? setfromAmount(value) : settoAmount(value);
          var obj = {
            from: appendFromData.currencySymbol,
            to: appendToData.currencySymbol,
          };
          var data = {
            apiUrl: apiService.currencyConversion,
            payload: obj,
          };
          if (fromCurrency != "" && toCurrency != "") {
            var resp = await postMethod(data);
            if (resp.status) {
              var fee = (+value * +appendFromData.swapFee) / 100;
              console.log("fee===", fee);
              setEstimationFee(fee);
              var total = +value + +fee;
              console.log("total===", total);
              //setTotalAmount(parseFloat(total).toFixed(8));
              setTotalAmount(total);

              setPrice(resp.Message);
              console.log("price===", resp.Message);
              if (type == "fromAmount") {
                var amount = Number(resp.Message) * Number(value);
                console.log("amount===", amount);
                // setfromAmount(parseFloat(value).toFixed(8));
                // settoAmount(parseFloat(amount).toFixed(8));
                // setfromAmount(value);
                settoAmount(amount);
              } else if (type == "toAmount") {
                var amount = Number(value) / Number(resp.Message);
                // setfromAmount(parseFloat(amount).toFixed(8));
                // settoAmount(parseFloat(value).toFixed(8));
                // setfromAmount(amount);
                settoAmount(value);
              }
            }
          } else {
          }
        }
      } else {
        settoAmount(0);
      }
    } catch (error) {}
  };

  const swapAmount = async () => {
    console.log(appendFromData.currencySymbol, appendToData.currencySymbol);
    try {
      if (
        appendFromData.currencySymbol != undefined &&
        appendToData.currencySymbol != undefined
      ) {
        if (appendFromData.currencySymbol != appendToData.currencySymbol) {
          if (+fromAmount > 0 && +toAmount > 0) {
            var obj = {
              from: appendFromData.currencySymbol,
              to: appendToData.currencySymbol,
              from_id: appendFromData.currid,
              to_id: appendToData.currid,
              fromAmount: +fromAmount,
              toAmount: +toAmount,
              fee: +estimateFee,
              withFee: +totatlAmount,
              currentPrice: +priceRef.current,
            };

            console.log(obj, "obj");
            var data = {
              apiUrl: apiService.swapping,
              payload: obj,
            };
            setButtonLoader(true);
            var resp = await postMethod(data);
            setButtonLoader(false);
            if (resp.status) {
              setfromAmount(0);
              settoAmount(0);
              getUserbalance();
              showsuccessToast(resp.Message);
              navigate("/swapHistory");
            } else {
              showerrorToast(resp.Message);
            }
          } else {
            showerrorToast("Please enter amount");
          }
        } else {
          showerrorToast("Same currency should not allow the swapping");
        }
      } else {
        showerrorToast("Please choose the swapping currencies");
      }
    } catch (error) {}
  };

  const swapPrice = async () => {
    try {
      console.log(toref.current);
      console.log(fromref.current);
      var obj = {
        from: fromref.current != undefined ? fromref.current : "BTC",
        to:
          toref.current != undefined ||
          toref.current != null ||
          toref.current != ""
            ? toref.current
            : "USDT",
      };
      console.log("swap===", obj);
      var data = {
        apiUrl: apiService.currencyConversion,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setPrice(resp.Message);
      }
    } catch (error) {}
  };

  const handleOnChange_from = (e, data) => {
    console.log("handleOnChange_from", data);
    setAmount(0, "fromAmount");
    setfromAmount(0);
    settoAmount(0);
    setErrorMsg("");
    setfromSwapRef(data.value);
    var findIndexing = fromTab.findIndex((x) => x.currid == data.value);
    console.log("findIndexing===", findIndexing);
    if (findIndexing != -1) {
      console.log("fromTab[findIndexing]", fromTab[findIndexing]);
      setappendFromData(fromTab[findIndexing]);
      setFromcurrencyImage(fromTab[findIndexing].image);
      setfromCurrency(fromTab[findIndexing].currencySymbol);
      swapPrice();
    }
  };

  const handleOnChange_to = (e, data) => {
    setfromAmount(0);
    settoAmount(0);
    setErrorMsg("");
    console.log("handleOnChange_to", data);
    settoSwapRef(data.value);
    var findIndexingTo = toTab.findIndex((x) => x.currid == data.value);
    console.log("findIndexingTo===", findIndexingTo);
    if (findIndexingTo != -1) {
      settoCurrency(fromTab[findIndexingTo].currencySymbol);
      setappendFToData(fromTab[findIndexingTo]);
      setTocurrencyImage(fromTab[findIndexingTo].image);
      swapPrice();
    }
  };

  const getKYCstatus = async () => {
    var data = {
      apiUrl: apiService.getKYCStatus,
    };
    var getKYC = await getMethod(data);
    console.log(getKYC, "getkyc");
    if (getKYC.status == true) {
      console.log(getKYC.Message.kycstatus, "getkyc");

      setkycStatus(getKYC.Message.kycstatus);
    } else {
      setkycStatus(0);
    }
  };

  // const getSiteSettingstatus = async () => {
  //   var data = {
  //     apiUrl: apiService.getSiteDatas,
  //   };
  //   var response = await getMethod(data);
  //   console.log("getkyc1===", response);
  //   if (response.status) {
  //     console.log(response.data.kycStatus, "==kyc======");
  //     setsitekycStatus(response.data.kycStatus);
  //   } else {
  //     setkycStatus(0);
  //   }
  // };

  const swap = () => {
    // Swap currency data
    const tempCurrency = appendFromData;
    const tempCurrencySymbol = fromCurrency;

    // Update the state with the swapped values
    setappendFromData(appendToData);
    setappendFToData(tempCurrency);
    setfromCurrency(toCurrency);
    settoCurrency(tempCurrencySymbol);

    // Swap amount data
    const tempAmount = fromAmount;
    // setfromAmount(toAmount);
    // settoAmount(tempAmount);

    const value = toAmount ? Number(toAmount).toFixed(8) : "0.00000000";
    // console.log(value, "value-from tempAmount-to", tempAmount);
    setfromAmount(value);
    settoAmount(Number(tempAmount).toFixed(8));

    // Update the Dropdown selected values
    setfromSwapRef(appendToData.currid);
    settoSwapRef(appendFromData.currid);
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
      <section>
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
        <main className="dashboard_main">
          <div className="container-fluid">
            <div className="row swap_main padlef_0_col">
              <div className="padin_lefrig_dash">
                <div className="col-xl-4 col-lg-6 col-md-8 convert_center_box">
                  <div className="convert_card-wrapper border_none">
                    <div className="convert_card swap_pos_relnew">
                      <div className="convert_title mb-4">
                        <h3>{t("convert")}</h3>
                        <Link to="/swapHistory">
                          <i class="bi bi-clock-history swap_new_hisnavic"></i>
                        </Link>
                      </div>
                      <div className="swap_lft_top_newdonee">
                        <div className="foot_frst_newonn">
                          <h4 className="spend_chng">{t("spend")}</h4>
                          <h4 className="spend_chng">
                            {t("balance")}:
                            {!appendFromData ||
                            isNaN(Number(appendFromData.currencyBalance))
                              ? "0.0000"
                              : Number(appendFromData.currencyBalance).toFixed(
                                  8
                                )}
                          </h4>
                        </div>
                        <div className="swap_chng_frst_newdon">
                          {/* <span className="swap-chng-max">MAX</span> */}
                          <div>
                            <input
                              type="text"
                              id="numberInput"
                              min="0"
                              autoComplete="off"
                              maxLength={10}
                              placeholder="0.00"
                              value={fromAmountref.current}
                              // onKeyDown={(evt) =>
                              //   ["e", "E", "+", "-"].includes(evt.key) &&
                              //   evt.preventDefault()
                              // }
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                ); // Allow numbers and dot
                                if (
                                  (e.target.value.match(/\./g) || []).length > 1
                                ) {
                                  e.target.value = e.target.value.slice(0, -1); // Prevent multiple dots
                                }
                              }}
                              onChange={(e) =>
                                setAmount(e.target.value, "fromAmount")
                              }
                              // onChange={(e) => {
                              //   const value = e.target.value;
                              //   const numericValue = value.replace(/[^0-9.]/g, "");
                              //   const parts = numericValue.split(".");
                              //   const digitsOnly = numericValue.replace(".", "");
                              //   if (digitsOnly.length <= 15) {
                              //     setAmount(numericValue, "fromAmount");
                              //   }
                              // }}
                              className="swap_in_val"
                            />
                            {errorMsg === "" ? (
                              ""
                            ) : (
                              <p className="text-red swap_innnew_err">
                                {errorMsg}
                              </p>
                            )}
                          </div>
                          <Dropdown
                            inline
                            placeholder={t("select")}
                            options={fromCurrencyRef.current}
                            value={fromSwapRef.current}
                            onChange={handleOnChange_from}
                          />
                        </div>
                      </div>
                      {/* <div>
                        {errorMsg === "" ? (
                          ""
                        ) : (
                          <p className="text-red">{errorMsg}</p>
                        )}
                      </div> */}
                      <div className="swap_icon">
                        <img
                          src={require("../assets/swap_icon.png")}
                          onClick={swap}
                          className="cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="swap_lft_top_newdonee mt-2">
                        <div className="foot_frst_newonn">
                          <h4 className="spend_chng">{t("receive")} </h4>
                          <h4 className="spend_chng">
                            {t("balance")}:
                            {!appendToData ||
                            isNaN(Number(appendFromData.currencyBalance))
                              ? "0.0000"
                              : Number(appendToData.currencyBalance).toFixed(8)}
                          </h4>
                        </div>

                        <div className="swap_chng_frst_newdon">
                          <input
                            type="number"
                            min="0"
                            placeholder="0.00"
                            // value={toAmountref.current}
                            value={
                              toAmountref.current
                                ? Number(toAmountref.current).toFixed(8) // Ensure 4 decimal places
                                : "0.00" // Default fallback
                            }
                            onChange={(e) =>
                              setAmount(e.target.value, "toAmount")
                            }
                            className="swap_in_val"
                            readOnly
                          />
                          <Dropdown
                            inline
                            placeholder={t("select")}
                            options={toCurrencyRef.current}
                            value={toSwapRef.current}
                            onChange={handleOnChange_to}
                          />
                        </div>
                      </div>
                      <div className="swap_inner_main mt-2">
                        <span className="swap_change_clr">{t("price")}</span>
                        {fromref.current != "" && toref.current != "" ? (
                          <span className="swap_change_clr">
                            1 {fromref.current} ={" "}
                            {Number(priceRef.current).toFixed(8) == 0 ? (
                              <span className="swap_change_num">0</span>
                            ) : (
                              Number(priceRef.current).toFixed(8)
                            )}{" "}
                            {toref.current}{" "}
                          </span>
                        ) : (
                          <span className="swap_change_num">0.0000</span>
                        )}
                      </div>
                      <div className="Convert_btn mt-3">
                        {loginStatus == true ? (
                          <>
                            {ButtonLoader == false ? (
                              <button onClick={swapAmount}>
                                {t("convert")}
                              </button>
                            ) : (
                              <button>{t("loading")} ...</button>
                            )}
                          </>
                        ) : (
                          <button onClick={() => loginNave()}>
                            {t("loginToContinue")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="col-xl-5 col-lg-4 justify-content-center convert_center_box">
                    <div className="convert_card-summary border_none">
                      <span className="summary-swap"> Summary</span>
                      <hr style={{ color: "#eaecef" }} />
                      <div className="swap_fst_rght">
                        <div className="swap_inner_main mt-2">
                          <span className="swap_change_clr">Price</span>
                          {fromref.current != "" && toref.current != "" ? (
                            <span className="swap_change_clr">
                              1 {fromref.current} ={" "}
                              {Number(priceRef.current).toFixed(8) == 0 ? (
                                <span className="swap_change_num">0</span>
                              ) : (
                                Number(priceRef.current).toFixed(8)
                              )}{" "}
                              {toref.current}{" "}
                            </span>
                          ) : (
                            <span className="swap_change_num">0.0000</span>
                          )}
                        </div>
                        <div className="swap_inner_main">
                          <span className="swap_change_clr">Minimum Swap</span>
                          <span className="swap_change_clr">
                            {appendFromData == "" ? (
                              <span className="swap_change_num">0.0000</span>
                            ) : (
                              appendFromData.minSwap
                            )}
                          </span>
                        </div>
                        <div className="swap_inner_main">
                          <span className="swap_change_clr">Maximum Swap</span>
                          <span className="swap_change_num">
                            {appendFromData == "" ? (
                              <span>0.0000</span>
                            ) : (
                              appendFromData.maxSwap
                            )}{" "}
                          </span>
                        </div>
                        <div className="swap_inner_main">
                          <span
                            className="swap_change_clr"
                            style={{ color: "#eaecef" }}
                          >
                            Swap fee ({" "}
                            {appendFromData == ""
                              ? "0.0"
                              : appendFromData.swapFee}{" "}
                            % )
                          </span>
                          <span
                            className="swap_change_clr"
                            style={{ color: "#eaecef" }}
                          >
                            {estimateFee == 0 ? (
                              <span className="swap_change_num">0.0000</span>
                            ) : (
                              Number(estimateFee).toFixed(8)
                            )}{" "}
                          </span>
                        </div>
                        <div className="swap_inner_main">
                          <span
                            className="swap_change_clr"
                            style={{ color: "#eaecef" }}
                          >
                            Total Amount
                          </span>
                          <span
                            className="swap_change_clr"
                            style={{ color: "#eaecef" }}
                          >
                            {" "}
                            {totatlAmount == 0 ? (
                              <span className="swap_change_num">0.0000</span>
                            ) : (
                              Number(totatlAmount).toFixed(4)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Swap;
