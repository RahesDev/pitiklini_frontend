import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import Side_bar from "./Side_bar";
import "semantic-ui-css/semantic.min.css";
import AdvertiserSellTable from "./AdvertiserSellTable";
import { useTranslation } from "react-i18next";

const P2PSell = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

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
  const [fromAmount, setfromAmount] = useState(0);
  const [toAmount, settoAmount, toAmountref] = useState(0);
  const [minMax, setMinMax] = useState(10);
  const [price, setPrice, priceRef] = useState(0);
  const [estimateFee, setEstimationFee] = useState(0);
  const [totatlAmount, setTotalAmount] = useState(0);
  const [sessionHistory, setsessionHistory] = useState([]);
  const [totalPage, setTotalpages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sitekycStatus, setsitekycStatus] = useState("DeActive");
  const [kycStatus, setkycStatus, kycstatusref] = useState(0);
  const [ButtonLoader, setButtonLoader] = useState(false);

  const [allCurrencyFiat, setfromCurrencyRef, fromCurrencyRef] = useState([]);
  const [toCurrencyRefs, setToCurrencyRef, toCurrencyRef] = useState([]);

  const [fromSwap, setfromSwapRef, fromSwapRef] = useState([]);
  const [toSwap, settoSwapRef, toSwapRef] = useState([]);

  const recordPerPage = 5;
  const pageRange = 5;

  useEffect(() => {
    // getUserbalance();
    swaphistory();
    getKYCstatus();
    getSiteSettingstatus();
  }, [0]);

  //   const getUserbalance = async () => {
  //     var data1 = {
  //       apiUrl: apiService.getUserBalanceSwap,
  //     };
  //     var resp = await getMethod(data1);
  //     console.log(resp, "resp");
  //     if (resp.status) {
  //       setFromTab(resp.data);
  //       setToTab(resp.data);
  //       var currArrayCrypto = [];
  //       //var currArrayFiat = [{value: "all", label: "Select"}];
  //       var currArrayFiat = [];
  //       var data = resp.data;
  //       for (var i = 0; i < data.length; i++) {
  //         if (data[i].currencySymbol) {
  //           var obj = {
  //             value: data[i].currid,
  //             label: data[i].currencySymbol,
  //             key: data[i].currencySymbol,
  //             text: data[i].currencySymbol,
  //             image: {
  //               avatar: true,
  //               src: data[i].image,
  //             },
  //           };
  //           currArrayFiat.push(obj);
  //           currArrayCrypto.push(obj);
  //         }
  //       }
  //       setToCurrencyRef(currArrayFiat);
  //       setfromCurrencyRef(currArrayCrypto);
  //     } else {
  //     }
  //   };

  const setAmount = async (value, type) => {
    console.log("value", value, "type", type);
    console.log(appendFromData, "appendFromData");
    try {
      if (!isNaN(value)) {
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
              setfromAmount(value);
              settoAmount(amount);
            } else if (type == "toAmount") {
              var amount = Number(value) / Number(resp.Message);
              // setfromAmount(parseFloat(amount).toFixed(8));
              // settoAmount(parseFloat(value).toFixed(8));
              setfromAmount(amount);
              settoAmount(value);
            }
          }
        } else {
        }
      } else {
        type == "fromAmount" ? setfromAmount(0) : settoAmount(0);
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
          if (fromAmount > 0 && toAmount > 0) {
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
              swaphistory(1);
              //   getUserbalance();
              showsuccessToast(resp.Message);
              navigate("/dashboard");
            } else {
              swaphistory(1);
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

  const swaphistory = async (page) => {
    try {
      var payload = {
        perpage: 5,
        page: page,
      };
      var data = {
        apiUrl: apiService.swappingHistory,
        payload: payload,
      };

      var resp = await postMethod(data);
      if (resp.status) {
        setsessionHistory(resp.data.data);
        setTotalpages(resp.data.total);
      }
    } catch (error) {}
  };

  const handlePageChange = (pageNumber) => {
    swaphistory(pageNumber);
    setCurrentPage(pageNumber);
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
    setAmount();
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
    setAmount();
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

  const getSiteSettingstatus = async () => {
    var data = {
      apiUrl: apiService.getSiteDatas,
    };
    var response = await getMethod(data);
    console.log("getkyc1===", response);
    if (response.status) {
      console.log(response.data.kycStatus, "==kyc======");
      setsitekycStatus(response.data.kycStatus);
    } else {
      setkycStatus(0);
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

  useEffect(() => {
    const currArrayCrypto = [
      {
        value: "BNB",
        key: "BNB",
        text: "BNB",
        image: {
          avatar: true,
          src: "https://res.cloudinary.com/taikonz-com/image/upload/v1664014615/fd2vqjmjipjxvzt6g2re.png",
        },
      },
      {
        value: "USDT",
        key: "USDT",
        text: "USDT",
        image: {
          avatar: true,
          src: "https://res.cloudinary.com/taikonz-com/image/upload/v1664014615/b15qia164vomylxkmqfp.png",
        },
      },
    ];
    setfromCurrencyRef(currArrayCrypto);

    const currArrayFiat = [
      {
        value: "INR",
        key: "INR",
        text: "INR",
        image: {
          avatar: true,
          src: "https://res.cloudinary.com/dvlfcoxxp/image/upload/v1721407155/flag-4_bhlflc.webp",
        },
      },
      {
        value: "USD",
        key: "USD",
        text: "USD",
        image: {
          avatar: true,
          src: "https://res.cloudinary.com/dvlfcoxxp/image/upload/v1721407155/flag-4_bhlflc.webp",
        },
      },
    ];
    setToCurrencyRef(currArrayFiat);
  }, [0]);

  return (
    <>
      <section>
        <Header />
      </section>

      <main className="dashboard_main">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2 col-md-0 padlef_0_col">
              <Side_bar />
            </div>

            <div className="col-lg-10 col-md-12 padin_lefrig_dash">
              <section className="asset_section">
                <div className="row">
                  <div className="p2p_title">
                    {t("p2p")}{" "}
                    <div>
                      <span>
                        {" "}
                        <Link to="/postad" className="action_btn">
                          {t("postads")}{" "}
                        </Link>{" "}
                      </span>
                      <span className="post-list-icon">
                        <i class="fa-solid fa-list-ul"></i>
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    {/* filtered buttons */}
                    <div className="filter-btns-wrapper mb-5">
                      {/* buy, sell */}
                      <div className="fil-buy-sell">
                        <span className="fil-sell-buy-btn">{t("buy")}</span>
                        <span className="fil-sell-red">{t("sell")}</span>
                      </div>
                      {/* country dropdown */}
                      <div className="fil-country">
                        <Dropdown
                          className="fil-country"
                          placeholder="INR"
                          fluid
                          selection
                          options={fromCurrencyRef.current}
                          // onChange={(o) =>
                          //   onSelect(o, "fromTab")
                          // }
                          onChange={handleOnChange_from}
                        />
                      </div>
                      {/* coin dropdown */}
                      <div className="fil-coin">
                        <Dropdown
                          className="fil-coin"
                          placeholder="BTC"
                          fluid
                          selection
                          options={fromCurrencyRef.current}
                          // onChange={(o) =>
                          //   onSelect(o, "fromTab")
                          // }
                          onChange={handleOnChange_from}
                        />
                      </div>
                      {/* payment dropdown */}
                      <div className="fil-payment">
                        <Dropdown
                          placeholder={t("allPaymentMethod")}
                          fluid
                          selection
                          options={fromCurrencyRef.current}
                          // onChange={(o) =>
                          //   onSelect(o, "fromTab")
                          // }
                          onChange={handleOnChange_from}
                        />
                      </div>

                      {/* enter amount */}
                      <div className="fil-enter">
                        <input
                          type="text"
                          placeholder={t("enterAmount")}
                          className="fil-amount"
                        />
                        <span className="fil-inr">INR</span>
                        <span className="white-das">|</span>
                        <span className="fil-search">{t("search")}</span>
                      </div>
                    </div>

                    {/* Assets list */}
                    <AdvertiserSellTable />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default P2PSell;
