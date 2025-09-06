import React, { useEffect, useCallback } from "react";
import useState from "react-usestateref";
import { Button } from "@material-ui/core";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import { socket } from "../context/socket";
import "./Trade.css";
import {
  removeAuthToken,
  getAuthToken,
  getSocketToken,
} from "../core/lib/localStorage";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// import {// toast} from "react-// toastify";
import { env } from "../core/service/envconfig";
import moment from "moment";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import button from "@mui/material/Button";
import { widget } from "../core/lib/chart/charting_library/charting_library.min";
import isEmpty from "../core/lib/isEmpty";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { createTheme, ThemeProvider } from "@mui/material";
import { activeOrderData } from "../utils/mockData";
// import PriceFooter from "./TradePage/PriceFooter";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  const [theme, setTheme] = useState("Dark");
  const [pair, setPair] = useState("BTC_USDT");

  const options = ["one", "two", "three"];
  const [pairlist, setpairlist] = useState([]);
  const [favpairlist, setfavpairlist] = useState([]);

  const [orderbookask, setorderbookask, orderbookaskref] = useState([]);
  const [orderbooksloader, setorderbooksloader, orderbooksloaderref] =
    useState(false);

  const [orderbookbid, setorderbookbid, orderbookbidref] = useState([]);
  const [currentlasprice, setcurrentlasprice] = useState("");
  const [searchInputlist, setsearchInputlist, searchInputlistref] = useState(
    []
  );
  const [chartPair, setchartPair] = useState("BTCUSDT");
  const [curnt_Ordertype_tab, setcurnt_Ordertype_tab, curnt_Ordertype_tabref] =
    useState("Limit");
  const [currentPair, setcurrentPair] = useState("");
  const [fromCurrency, setFromCurrenncy] = useState("");
  const [toCurrency, setToCurrenncy] = useState("");
  const [currentType, setcurrentType, currentTyperef] = useState("buy");
  const [frombalance, setFromBalance, frombalanceref] = useState(0);
  const [tobalance, settobalance, tobalanceref] = useState(0);
  const [maxbuy, setmaxbuy, maxbuyref] = useState(0);
  const [maxsell, setmaxsell, maxsellref] = useState(0);
  const [checkAuth, setcheckAuth] = useState(false);
  const [pairDetails, setpairDetails] = useState("");
  const [Tocurrencies, setTocurrencies, Tocurrenciesref] = useState([
    "USDT",
    // "INR",
    "BTC",
    "EUR",
    "ETH",
    "BNB",
    "XRP",
  ]);

  const [orderbookLoader, setorderbookLoader] = useState(true);
  const [orderbookLoaderbid, setorderbookLoaderbit] = useState(true);
  const [orderbookdivider, setorderbookdivider] = useState(true);
  const [pairLoader, setPairLoader] = useState(false);
  const [sideLoader, setsideLoader] = useState(false);

  const [perpage, setperpage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOrderDatas, setActiveOders] = useState([]);
  const [tradeHistoryData, settradeHistory] = useState([]);
  // const [alltradeHistoryData, setalltradeHistory] = useState([]);
  const [cancelOrders, setcancelOrders] = useState([]);
  const [pairTickerDetails, setpairTickerDetails] = useState("");
  const [marketPrice, setmarketPrice, marketPriceref] = useState(0);
  const [marketTrade, setmarketTrade, marketTraderef] = useState([]);
  const [topmove, settopmove, topmoveref] = useState({});

  const [totalactive, settotalactive] = useState(0);
  const [currentPagecan, setCurrentPagecan] = useState(1);
  const [totalcan, settotalcan] = useState(0);
  const [currentPageHis, setcurrentPageHis] = useState(1);
  const [totalHist, settotalHist] = useState(0);
  const [authentication, setauthentication] = useState(false);
  const [searchpair, setsearchpair] = useState(null);
  const [currentpairs, setcurrentpairs, currentpairsref] = useState(null);
  const [allpairslist, setallpairslist, allpairslistref] = useState([]);
  const [orderloader, setorderloader, orderloaderref] = useState(false);
  const [sellorderloader, setsellorderloader, sellorderloaderref] =
    useState(false);

  const [siteLoader, setSiteLoader, siteLoaderref] = useState(false);
  const [priceLoader, setpriceLoader, priceLoaderref] = useState(false);
  const [fromcurrency, Setfromcurrency, fromcurrencyref] = useState(false);

  const [marketTradeloader, setmarketTradeloader, marketTradeloaderref] =
    useState(false);
  const [sliderValue, setSliderValue, sliderValueref] = useState(0);
  const [sliderValue1, setSliderValue1, sliderValue1ref] = useState(0);
  const [sliderValue2, setSliderValue2, sliderValue2ref] = useState(0);
  const [sliderValue3, setSliderValue3, sliderValue3ref] = useState(0);
  const [sliderValue4, setSliderValue4, sliderValue4ref] = useState(0);
  const [sliderValue5, setSliderValue5, sliderValue5ref] = useState(0);
  const [favpairs, setfavpairs, favpairsref] = useState([]);
  const [ptkstatus, setptkStatus] = useState(0);

  const themeSlider = createTheme({
    components: {
      MuiSlider: {
        styleOverrides: {
          thumb: {
            width: 13,
            height: 13,
            borderRadius: 0,
            border: "2px solid #888B93",
            backgroundColor: "#1E2026",
            transform: "rotate(45deg)",
            transformOrigin: "center",
            marginLeft: -12,
            marginTop: -6,
          },
          track: {
            backgroundColor: "#1E2026",
          },
        },
      },
    },
  });

  function valuetext(value) {
    return `${value}°C`;
  }
  const Fullorderbook = (event, newValue) => {
    setorderbookLoader(true);
    setorderbookLoaderbit(true);
    setorderbookdivider(true);
  };
  const bidorderbook = (event, newValue) => {
    setorderbookLoader(false);
    setorderbookLoaderbit(true);
    setorderbookdivider(false);
  };
  const askorderbook = (event, newValue) => {
    setorderbookLoader(true);
    setorderbookLoaderbit(false);
    setorderbookdivider(false);
  };

  const handleSliderChangeGeneric = (sliderIndex, event, newValue) => {
    console.log(newValue, "newValue");
    console.log(event.target.name, "Slider Name");

    setcurrentType(event.target.name);

    // Reset all sliders to "0" except the current one
    const newSliderValues = ["0", "0", "0", "0", "0", "0"];
    newSliderValues[sliderIndex] = newValue;

    console.log(newSliderValues, "newSliderValues");

    // Set the correct slider state based on index
    setSliderValue(newSliderValues[0]);
    setSliderValue1(newSliderValues[1]);
    setSliderValue2(newSliderValues[2]);
    setSliderValue3(newSliderValues[3]);
    setSliderValue4(newSliderValues[4]);
    setSliderValue5(newSliderValues[5]);

    // Call the appropriate buy_sell_percentage function

    console.log(sliderIndex, "sliderIndex");
    console.log(sliderIndex % 2, "sliderIndex");

    if (sliderIndex % 2 === 0) {
      buy_sell_percentage(newValue);
      buy_sell_percentage1("0");
    } else {
      buy_sell_percentage1(newValue);
      buy_sell_percentage("0");
    }
  };

  // Example of using this function in place of the others
  const handleSliderChange = (event, newValue) =>
    handleSliderChangeGeneric(0, event, newValue);
  const handleSliderChange1 = (event, newValue) =>
    handleSliderChangeGeneric(1, event, newValue);
  const handleSliderChange2 = (event, newValue) =>
    handleSliderChangeGeneric(2, event, newValue);
  const handleSliderChange3 = (event, newValue) =>
    handleSliderChangeGeneric(3, event, newValue);
  const handleSliderChange4 = (event, newValue) =>
    handleSliderChangeGeneric(4, event, newValue);
  const handleSliderChange5 = (event, newValue) =>
    handleSliderChangeGeneric(5, event, newValue);

  const recordPerPage = 5;
  const pageRange = 5;
  const recordPerPagecan = 5;
  const pageRangecan = 5;

  const recordPerPageHist = 5;
  const pageRangeHis = 5;

  const navigate = useNavigate();

  const tvWidget = null;

  useEffect(() => {
    var urls = window.location.href;
    var pair = urls.split("trade/")[1];
    var replace_string = pair.replace("_", "");
    var changelower = replace_string.toLowerCase();

    // console.log(changelower, "changelower");
    if (tvWidget !== null) {
      tvWidget.remove();
      tvWidget = null;
    }
    setorderbooksloader(true);
    check();
    socketinit();
    selectPairbyCurrency("USDT");
    selectfavPair();
  }, [socket]);

  async function check() {
    getmarketdata();

    let mecheck = await getAuthToken();

    var callapi = false;
    if (mecheck != "" && mecheck != undefined && mecheck != null) {
      await setcheckAuth(true);
      callapi = true;
    } else {
      await setcheckAuth(false);
      callapi = false;
    }
    var urls = window.location.href;
    var fetchPair = urls.split("trade/")[1];
    if (fetchPair) {
      setcurrentPair(fetchPair);
      var fromcurr = fetchPair.split("_")[0];
      var toCurr = fetchPair.split("_")[1];
      setFromCurrenncy(fromcurr);
      setToCurrenncy(toCurr);
      getCurrpairDatas(fetchPair);
      fetchTickerPrice(fetchPair);
      getMarketTrades(fetchPair);
      selectPair(fetchPair);

      if (callapi == true) {
        await getUserbalance(fetchPair);
        await getstopLimitOrders(1);
        await getActiveOrders(1, fetchPair);
        await tradeHistory(1);
        await getCancelOrders(1);
        await getfavpair();
      } else {
      }

      setchartPair(fromcurr + toCurr);
      setPair(fromcurr + "_" + toCurr);
      allpairDatas();
    } else {
      navigate("/");
    }
    socket.connect();
    let pair_string = fromcurr + toCurr;
    socket.emit("GetOrderBook", { symbol: pair_string.toLowerCase() });
  }

  const socketinit = async () => {
    // console.log("-0-0-0-0-0-0-0-")
    socket.on("OrderBook", async (response) => {
      var data = await response.data;
      // console.log("orderbook response===",data);
      if (data != null && data != undefined && data != "") {
        if (data.symbol) {
          setorderbookask([]);
          setorderbookbid([]);
          var orderbookbid = [];
          var orderbookask = [];
          orderbookbid = data["bids"].length == 0 ? [] : data["bids"];
          orderbookask = data["asks"].length == 0 ? [] : data["asks"];
          var askcumtotal = 0;
          for (let index = 0; index < orderbookask.length; index++) {
            var element = orderbookask[index];
            var multiply = element[0] * element[1];
            askcumtotal = parseFloat(askcumtotal) + parseFloat(multiply);
            orderbookask[index]["percent"] = (multiply / askcumtotal) * 100;
          }
          var bidcumtotal = 0;
          for (let index = 0; index < orderbookbid.length; index++) {
            var element = orderbookbid[index];
            var multiply = element[0] * element[1];
            bidcumtotal = parseFloat(bidcumtotal) + parseFloat(multiply);
            orderbookbid[index]["percent"] = (multiply / bidcumtotal) * 100;
          }
          setorderbookask(
            orderbookask.sort(function (a, b) {
              return b[0] - a[0];
            })
          );
          setorderbookbid(
            orderbookbid.sort(function (a, b) {
              return b[0] - a[0];
            })
          );
          setorderbooksloader(false);
        }
      }
    });
    socket.on("TickerPrice", async (response) => {
      if (response.data) {
        var tickerdetail = response.data;
        setpairTickerDetails(tickerdetail);
        setmarketPrice(
          tickerdetail.lastprice.lastprice
            ? tickerdetail.lastprice.lastprice
            : 0.0
        );
        setmaxbuy(
          parseFloat(tobalanceref.current) / parseFloat(formValue.price)
        );
        setmaxsell(
          parseFloat(frombalanceref.current) * parseFloat(formValue.price)
        );
        if (curnt_Ordertype_tabref.current == "Stop") {
          if (formValue.price <= 0) {
            // formValue.price = "";
            formValue.price = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
            formValue.sellprice = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
          }
          //formValue.stop_price = "";
        } else if (curnt_Ordertype_tabref.current == "Market") {
          formValue.price = (+marketPriceref.current).toFixed(
            pairDetails?.liq_price_decimal
          )
            ? +marketPriceref.current
            : 0.0;
          formValue.sellprice = (+marketPriceref.current).toFixed(
            pairDetails?.liq_price_decimal
          )
            ? +marketPriceref.current
            : 0.0;
        } else {
          if (priceLoaderref.current == false) {
            formValue.price = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
            formValue.sellprice = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
          }
        }
      }
    });

    socket.on("TradeHistory", async (response) => {
      var tickerdetail = response.data;
      if (tickerdetail !== null) {
        setmarketTrade(tickerdetail);
      } else {
        if (marketTrade.length > 0) {
        }
      }
    });
    socket.on("TOPMOVE", async (response) => {
      var tickerdetail = response.data;
      if (tickerdetail !== null) {
        settopmove(tickerdetail);
      } else {
        settopmove({});
      }
    });
    let token_socket = sessionStorage.getItem("socketToken");
    if (token_socket) {
      let socketToken = token_socket.split('"_')[0];
      console.log("socketToken====", socketToken);
      socket.on("userDetails" + socketToken, async (response) => {
        console.log("socketToken userDetails====", response);
        var urls = window.location.href;
        var fetchPair = urls.split("trade/")[1];
        if (fetchPair) {
          console.log("call history user", fetchPair);
          setcurrentPair(fetchPair);
          getActiveOrders(1, fetchPair);
          getUserbalance(fetchPair);
          tradeHistory(1);
          getCancelOrders(1);
          getMarketTrades(fetchPair);
        }
      });
      socket.on("cancelOrder" + socketToken, async (response) => {
        showsuccessToast(
          "Your order cancelled by admin, Please try again later"
        );
        var urls = window.location.href;
        var fetchPair = urls.split("trade/")[1];
        if (fetchPair) {
          setcurrentPair(fetchPair);
          getActiveOrders(1, fetchPair);
          getUserbalance(fetchPair);
          tradeHistory(1);
          getCancelOrders(1);
        }
      });
    }
    socket.on("close", function () {
      socket.connect();
      setorderbooksloader(true);
      socketinit();
    });
  };

  const [loginStatus, setLoginStatus] = useState(false);
  useEffect(() => {
    let token_check = sessionStorage.getItem("user_token");
    if (token_check) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, []);

  const loginNave = async () => {
    navigate("/login");
  };

  useEffect(() => {
    fetchTheme();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const getLanguageFromURL = () => {
    const regex = new RegExp("[\\?&]lang=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null
      ? null
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const buildchart = (theme, pair) => {
    //console.log("theme ====",theme)
    theme = "dark";
    const widgetOptions = {
      symbol: pair,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        env.apiHost + "chartapi/chart"
      ),
      interval: pair == "USDT_INR" ? "240" : "1",
      container_id: "tv_chart_container",
      library_path: "/charting_library/",
      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      //autosize: true,
      width: "100%",
      height: "520",
      studies_overrides: {},
      loading_screen: { backgroundColor: "#181a20" },
      theme: theme,
      borderRadius: "8px",
      toolbar_bg: "#181a20",
      timezone: "Asia/Kolkata",
      overrides: {
        "paneProperties.background": "#181a20",
        "paneProperties.vertGridProperties.color": "transparent",
        "paneProperties.horzGridProperties.color": "transparent",
      },
    };

    if (theme == "White") {
      delete widgetOptions.toolbar_bg;
      delete widgetOptions.overrides;
    }

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            },
          })
        );
      });
    });
  };

  const fetchTheme = () => {
    var theme = localStorage.getItem("theme");
    if (theme != undefined) {
      if (theme == "light") {
        setTheme("White");
      } else {
        setTheme("Dark");
      }
    } else {
      localStorage.setItem("theme", "dark");
      setTheme("Dark");
    }

    let urls = window.location.href;
    let fetchPair = urls.split("trade/")[1];
    if (fetchPair != null) {
      let themeValue = "Dark";
      if (theme == "light") {
        themeValue = "White";
      } else if (theme == "dark") {
        themeValue = "Dark";
      }
      buildchart(themeValue, fetchPair);
    }
  };

  const selectPair = async (pair) => {
    var replace_string = pair.replace("_", "");
    var changelower = replace_string.toLowerCase();
    socket.emit("GetOrderBook", { symbol: changelower });
    setchartPair(replace_string);
    setPair(pair);
  };

  const Movelogin = () => {
    navigate("/login");
  };

  const getCurrpairDatas = async (pair) => {
    var data = {
      apiUrl: apiService.getCurrpairData,
      payload: { pair: pair },
    };
    var fetchticker = await postMethod(data);
    if (fetchticker) {
      console.log(fetchticker.data);
      setpairDetails(fetchticker.data);
      Setfromcurrency(fetchticker.fromCurr);
    }
  };

  const getmarketdata = async () => {
    var data = {
      apiUrl: apiService.getmarketData,
    };
    var fetchticker = await getMethod(data);
    if (fetchticker.status) {
      setTocurrencies(fetchticker.data);
      console.log(Tocurrenciesref.current, "ojknknkk===============");
    }
  };

  const [selectedmarket, setselectedmarket, selectedmarketref] =
    useState("USDT");

  const [moves, setmoves, movesref] = useState("all");

  const selectPairbyCurrency = async (curr) => {
    setPairLoader(true);
    setselectedmarket(curr);
    setsideLoader(true);
    console.log(curr, "selectPairbyCurrency");
    socket.off("DashTickerPrice");
    socket.emit("GetTickerPrice", "getall");
    var data = {
      apiUrl: apiService.pairbycurrency,
      payload: { currency: curr },
    };

    var pairdetail = await postMethod(data);
    if (pairdetail) {
      socket.on("DashTickerPrice", async (response) => {
        setPairLoader(false);
        setsideLoader(false);
        var tickarr = await response.data;

        // console.log(response.data, "response");
        for (let index = 0; index < pairdetail.data.length; index++) {
          const element = pairdetail.data[index];
          var replace_string = element.pair.replace("_", "");
          var changelower = replace_string.toLowerCase();
          if (tickarr[changelower]) {
            var tickobj = JSON.parse(tickarr[changelower]);
            if (tickarr) {
              if (element.pair == tickobj.pair) {
                pairdetail.data[index]["price_change"] =
                  (await tickobj.change_percent)
                    ? parseFloat(tickobj.change_percent).toFixed(4)
                    : 0.0;
                pairdetail.data[index]["lastprice"] = (await tickobj.lastprice
                  .lastprice)
                  ? tickobj.lastprice.lastprice
                  : 0.0;
              }
            }
          }
        }
      });

      await setsearchInputlist(pairdetail.data);
      if (searchpair != null) {
        setpairlist(
          searchInputlistref.current.filter(function (tag) {
            if (
              tag.liquidity_name
                .toLowerCase()
                .indexOf(searchpair.toLowerCase()) >= 0 ||
              tag.liquidity_name
                .toLowerCase()
                .indexOf(searchpair.toLowerCase()) >= 0
            ) {
              return tag;
            }
          })
        );
      } else {
        await setpairlist(pairdetail.data);
        await setsearchInputlist(pairdetail.data);
        setPairLoader(false);
        setsideLoader(false);
      }
    }
  };

  const selectfavPair = async () => {
    try {
      setPairLoader(true);
      setsideLoader(true);

      // Clear previous socket listeners and fetch ticker price data
      socket.off("DashTickerPrice");
      socket.emit("GetTickerPrice", "getall");

      // Fetch all pairs
      const data = {
        apiUrl: apiService.allpair,
      };
      const pairdetail = await postMethod(data);

      // Fetch favorite pairs
      getfavpair();

      if (pairdetail && pairdetail.data) {
        let favoritePairs = [];

        // Wait for real-time ticker data
        socket.on("DashTickerPrice", async (response) => {
          setPairLoader(false);
          setsideLoader(false);

          const tickarr = await response.data;

          // Filter pairs by favorites
          favoritePairs = pairdetail.data.filter((pair) => {
            // Remove the underscore from pair.pair to match the favpairs format if needed
            const formattedPair = pair.pair.replace("_", "");

            // console.log(pair, favpairsref.current);

            // Check if the formatted pair exists in favpairs
            return (
              favpairsref.current?.includes(pair.pair) ||
              favpairs?.includes(formattedPair)
            );
          });

          // Update favorite pairs with real-time ticker data
          favoritePairs = favoritePairs.map((pair) => {
            const replace_string = pair.pair.replace("_", "");
            const changelower = replace_string.toLowerCase();

            // Update with ticker values if available
            if (tickarr[changelower]) {
              const tickobj = JSON.parse(tickarr[changelower]);

              pair["price_change"] = tickobj.change_percent
                ? parseFloat(tickobj.change_percent).toFixed(4)
                : 0.0;
              pair["lastprice"] = tickobj.lastprice?.lastprice
                ? tickobj.lastprice.lastprice
                : 0.0;
            }

            return pair;
          });

          // Apply search filter if search input is provided
          if (searchpair != null) {
            favoritePairs = favoritePairs.filter((pair) =>
              pair.liquidity_name
                .toLowerCase()
                .includes(searchpair.toLowerCase())
            );
          }

          // Set favorite pairs list to state

          setfavpairlist(favoritePairs);

          // Turn off loaders after data is set
          setPairLoader(false);
          setsideLoader(false);
        });
      } else {
        setPairLoader(false);
        setsideLoader(false);
        console.error("Error fetching pair details");
      }
    } catch (error) {
      console.error("Error in selectfavPair:", error);
      setPairLoader(false);
      setsideLoader(false);
    }
  };

  async function handleInputChange(event) {
    event.preventDefault();

    const sanitizedValue = event.target.value.replace(/\s+/g, "");

    if (sanitizedValue.indexOf("_") > 0) {
      var searchval = sanitizedValue.replace("_", "");
      setcurrentpairs(sanitizedValue);
      pair_change();
      setpairlist(
        allpairslistref.current.filter(function (tag) {
          if (
            tag.liquidity_name.toLowerCase().indexOf(searchval.toLowerCase()) >=
              0 ||
            tag.liquidity_name.toLowerCase().indexOf(searchval.toLowerCase()) >=
              0
          ) {
            return tag;
          }
        })
      );
    } else {
      setsearchpair(sanitizedValue);
      setpairlist(
        searchInputlistref.current.filter(function (tag) {
          if (
            tag.liquidity_name
              .toLowerCase()
              .indexOf(sanitizedValue.toLowerCase()) >= 0 ||
            tag.liquidity_name
              .toLowerCase()
              .indexOf(sanitizedValue.toLowerCase()) >= 0
          ) {
            return tag;
          }
        })
      );
    }
  }

  //------trade forms--------//

  const pairChange = async (pair) => {
    try {
      console.log("call pair", pair);
      setPairLoader(true);
      navigate("/trade/" + pair.pair);
      setcurrentPair(pair.pair);
      getCurrpairDatas(pair.pair);

      var indexPage = pairlist.findIndex((x) => x.pair == pair.pair);

      if (indexPage != -1) {
        var getPair = pairlist[indexPage];
        var fromcurr = getPair.pair.split("_")[0];
        var toCurr = getPair.pair.split("_")[1];
        setFromCurrenncy(fromcurr);
        setToCurrenncy(toCurr);
        if (checkAuth === true) {
          getUserbalance(pair.pair);
          getCancelOrders(1);
          getActiveOrders(1, pair.pair);
        }
        getCurrpairDatas(getPair.pair);
        fetchTickerPrice(getPair.pair);
        getMarketTrades(getPair.pair);
        setPair(getPair.pair);
        setPairLoader(false);
        var themevalue =
          localStorage.getItem("theme") == "light" ? "White" : "Dark";

        buildchart("dark", getPair.pair);

        var replace_string = getPair.pair.replace("_", "");
        var changelower = replace_string.toLowerCase();
        socket.emit("GetOrderBook", { symbol: changelower });
        setchartPair(replace_string);
      }
    } catch (error) {}
  };

  const favpair = async (pair) => {
    try {
      var data = {
        apiUrl: apiService.addfavpairs,
        payload: { pair: pair.pair },
      };
      var fetchticker = await postMethod(data);
      if (fetchticker.status) {
        showsuccessToast(fetchticker.message);
        getfavpair();
        selectfavPair();
      } else {
        showerrorToast(fetchticker.message);
      }
    } catch (error) {}
  };

  const getfavpair = async () => {
    try {
      var data = {
        apiUrl: apiService.getfavpairs,
      };
      var fetchticker = await getMethod(data);
      if (fetchticker.status) {
        setfavpairs(fetchticker.data);
      } else {
        setfavpairs([]);
      }
    } catch (error) {}
  };

  const getUserbalance = async (pair) => {
    var obj = {
      pair: pair,
    };
    var data = {
      apiUrl: apiService.getparUserBalance,
      payload: obj,
    };
    setSiteLoader(true);
    var resp = await postMethod(data);
    setSiteLoader(false);

    if (resp.status) {
      var getFromBalance = resp.data.fromCurrency;
      var getToBalance = resp.data.toCurrency;
      setFromBalance(getFromBalance.totalBalance);
      settobalance(getToBalance.totalBalance);
    } else {
    }
  };

  const pair_change = async () => {
    try {
      if (currentpairsref.current.indexOf("_") > 0) {
        var pairname = currentpairsref.current;
        var indexPage = pairlist.findIndex((x) => x.pair == pairname);
        if (indexPage != -1) {
          setPairLoader(true);
          navigate("/trade/" + pairname);
          setcurrentPair(pairname);
          getCurrpairDatas(pairname);
          var getPair = pairlist[indexPage];
          var fromcurr = getPair.pair.split("_")[0];
          var toCurr = getPair.pair.split("_")[1];
          setFromCurrenncy(fromcurr);
          setToCurrenncy(toCurr);
          if (checkAuth === true) {
            getUserbalance(pair.pair);
            getCancelOrders(1);
            getActiveOrders(1, pair.pair);
          }
          getCurrpairDatas(getPair.pair);
          // fetchTickerPrice(getPair.pair);
          getMarketTrades(getPair.pair);
          setPair(getPair.pair);
          setPairLoader(false);
        }
      }
    } catch (error) {}
  };

  const allpairDatas = async () => {
    var data = {
      apiUrl: apiService.allpairs,
    };
    var allpairs = await getMethod(data);
    if (allpairs) {
      setallpairslist(allpairs.data);
    }
  };

  const initialFormValue = {
    price: "",
    amount: "",
    total: "",
    stop_price: "",
    sellprice: "",
    sellamount: "",
    selltotal: "",
    sellstop_price: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);
  const [loader, setLoader] = useState();

  const {
    price,
    amount,
    total,
    stop_price,
    sellprice,
    sellamount,
    selltotal,
    sellstop_price,
  } = formValue;
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text");
    if (/[eE\+\-]/.test(pasteData)) {
      e.preventDefault();
    }
  };
  const handleKeyDown = (e) => {
    // List of allowed keys (like Backspace, Delete, Tab, Arrow keys, etc.)
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    // If the pressed key is NOT in allowedKeys and matches e, E, +, or -, prevent the input
    if (!allowedKeys.includes(e.key) && /[eE\+\-]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    console.log(name, value, "name, value");

    // Check for invalid characters in input value
    if (/[eE\+\-]/.test(value)) {
      console.log("Invalid input detected");
      return;
    }

    // Shallow clone formData for local manipulation
    let formData = { ...formValue, [name]: value };

    // Perform upfront validations to avoid unnecessary calculations
    const price = parseFloat(formData.price || 0);
    const amount = parseFloat(formData.amount || 0);
    const sellPrice = parseFloat(formData.sellprice || 0);
    const sellAmount = parseFloat(formData.sellamount || 0);

    if (price < 0 || amount < 0 || sellPrice < 0 || sellAmount < 0) {
      if (price < 0 || sellPrice < 0) showerrorToast("Enter valid price");
      if (amount < 0 || sellAmount < 0) showerrorToast("Enter valid amount");
      return;
    }

    let totalPrice = 0;

    // Consolidate logic for calculating total
    if (sellAmount > 0) {
      totalPrice = sellPrice * sellAmount;
      formData.selltotal = totalPrice.toFixed(8);
    } else {
      totalPrice = price * amount;
      formData.total = totalPrice.toFixed(8);
    }

    setFormValue(formData);
  };

  const [active1Tab, setActive1Tab] = useState("currency"); // Default tab: currency

  const handleTabClick = (tabType) => {
    setActive1Tab(tabType);
  };

  const handleChange_total = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    // console.log("total value===", value);

    let formData = { ...formValue, ...{ [name]: value } };
    if (curnt_Ordertype_tabref.current == "Limit") {
      let amount = value / formData.price;
      formData = {
        ...formData,
        ...{ ["total"]: parseFloat(value) },
        ...{ ["amount"]: parseFloat(amount).toFixed(8) },
      };
    } else if (curnt_Ordertype_tabref.current == "Market") {
      let amount = value / +marketPriceref.current;
      formData = {
        ...formData,
        ...{ ["total"]: parseFloat(value) },
        ...{ ["amount"]: parseFloat(amount).toFixed(8) },
      };
    } else {
      let amount = value / formData.price;
      formData = {
        ...formData,
        ...{ ["total"]: parseFloat(value) },
        ...{ ["amount"]: parseFloat(amount).toFixed(8) },
      };
    }

    if (formData.price < 0) {
      showerrorToast("Enter valid price");
    }
    if (formData.amount < 0) {
      showerrorToast("Enter valid amount");
    }
    if (formData.total < 0) {
      showerrorToast("Enter valid total");
    }
    // console.log("formData==", formData);
    setFormValue(formData);
  };

  const orderPlace = async (ordertype, ordertab) => {
    try {
      const { amount, price, stop_price } = formValue;
      const liqAmountDecimal = pairDetails?.liq_amount_decimal;
      const liqPriceDecimal = pairDetails?.liq_price_decimal;

      const isValidAmount = parseFloat(amount) > 0;
      let checkPrice = 0;

      if (ordertype === "Stop") {
        if (!stop_price || isNaN(stop_price)) {
          showerrorToast("Invalid stop limit price");
          return;
        }
      }

      if (ordertype === "Limit" || ordertype === "Stop") {
        checkPrice = parseFloat(price);
      } else if (ordertype === "Market") {
        checkPrice = parseFloat(marketPrice);
      }

      // Validate essential fields
      if (!isValidAmount || checkPrice <= 0 || !total) {
        showerrorToast("Please fill in all fields correctly.");
        return;
      }

      // Prepare orderData object
      let orderData = {
        amount: parseFloat(amount).toFixed(liqAmountDecimal),
        type: ordertab,
        orderType: ordertype,
        fromCurrency,
        toCurrency,
        pair: currentPair,
        stop_price: 0, // Default stop_price
        pair_id: pairDetails._id,
        fromCurr_id: pairDetails.from_symbol_id,
        toCurr_id: pairDetails.to_symbol_id,
      };

      switch (ordertype) {
        case "Limit":
          orderData.price = parseFloat(price).toFixed(liqPriceDecimal);
          orderData.total = parseFloat(total).toFixed(liqPriceDecimal);
          break;

        case "Market":
          const formattedMarketPrice =
            parseFloat(marketPrice).toFixed(liqPriceDecimal);
          orderData.price = formattedMarketPrice;
          orderData.total = (marketPrice * parseFloat(amount)).toFixed(
            liqPriceDecimal
          );
          break;

        case "Stop":
          orderData.price = parseFloat(price).toFixed(liqPriceDecimal);
          orderData.total = (parseFloat(price) * parseFloat(amount)).toFixed(
            liqPriceDecimal
          );
          orderData.stop_price =
            parseFloat(stop_price).toFixed(liqPriceDecimal);
          break;

        default:
          showerrorToast("Invalid order type");
          return;
      }

      console.log(orderData, "orderData");

      const data = {
        apiUrl: apiService.orderPlaceapi,
        payload: orderData,
      };

      setorderloader(true);
      const resp = await postMethod(data);
      setorderloader(false);

      if (resp.status) {
        resetFormValues();
        fetchTickerPrice(currentPair);
        getActiveOrders(1, currentPair);
        getUserbalance(currentPair);
        showsuccessToast(resp.Message);
      } else {
        handleOrderFailure(resp.Message);
      }
    } catch (error) {
      console.log(error, "error ");
      showerrorToast("Something went wrong. Please try again later.");
    }
  };

  const resetFormValues = () => {
    setFormValue(initialFormValue);
    setSliderValue("0");
    setSliderValue1("0");
    setSliderValue2("0");
    setSliderValue3("0");
    setSliderValue4("0");
    setSliderValue5("0");
  };

  // Handle order failure separately for reusability
  const handleOrderFailure = (message) => {
    formValue.amount = "";
    fetchTickerPrice(currentPair);
    formValue.total = "";
    formValue.stop_price = "";
    showerrorToast(message);
  };

  const sellorderPlace = async (ordertype, ordertab) => {
    try {
      const { sellamount, sellprice, sellstop_price } = formValue;
      const liqPriceDecimal = pairDetails?.liq_price_decimal || 2;
      const liqAmountDecimal = pairDetails?.liq_amount_decimal || 2;

      const parsedSellAmount = parseFloat(sellamount);
      const parsedSellPrice = parseFloat(sellprice);
      const parsedSellStopPrice = parseFloat(sellstop_price);

      // Validate form values before proceeding
      if (
        parsedSellAmount <= 0 ||
        (ordertype !== "Market" && parsedSellPrice <= 0) ||
        !selltotal
      ) {
        return showerrorToast("Please fill in all fields correctly.");
      }

      // Stop order requires a valid stop price
      if (
        ordertype === "Stop" &&
        (!sellstop_price || isNaN(parsedSellStopPrice))
      ) {
        return showerrorToast("Invalid stop limit price.");
      }

      // Create order data based on order type
      const orderData = {
        amount: parsedSellAmount.toFixed(liqAmountDecimal),
        price:
          ordertype === "Market"
            ? parseFloat(marketPrice).toFixed(liqPriceDecimal)
            : parseFloat(parsedSellPrice).toFixed(liqPriceDecimal),
        total: (ordertype === "Market"
          ? marketPrice * parsedSellAmount
          : parseFloat(selltotal)
        ).toFixed(liqPriceDecimal),
        stop_price:
          ordertype === "Stop"
            ? parsedSellStopPrice.toFixed(liqPriceDecimal)
            : 0,
        type: ordertab,
        orderType: ordertype,
        fromCurrency,
        toCurrency,
        pair: currentPair,
        pair_id: pairDetails._id,
        fromCurr_id: pairDetails.from_symbol_id,
        toCurr_id: pairDetails.to_symbol_id,
      };

      const data = {
        apiUrl: apiService.orderPlaceapi,
        payload: orderData,
      };

      setsellorderloader(true); // Start loader

      const resp = await postMethod(data); // API call

      setsellorderloader(false); // Stop loader

      // Reset form and slider values regardless of the response
      resetSellFormValues();

      // Handle API response
      if (resp.status) {
        showsuccessToast(resp.Message);
        // Fetch necessary data asynchronously after placing the order
        Promise.all([
          fetchTickerPrice(currentPair),
          getActiveOrders(1, currentPair),
          getUserbalance(currentPair),
        ]);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      console.log("order place error", error);
      setsellorderloader(false); // Ensure the loader stops on error
      showerrorToast("Something went wrong. Please try again later.");
    }
  };

  // Helper function to reset form and slider values
  const resetSellFormValues = () => {
    formValue.sellamount = "";
    formValue.sellprice = "";
    formValue.selltotal = "";
    formValue.sellstop_price = "";

    setSliderValue("0");
    setSliderValue1("0");
    setSliderValue2("0");
    setSliderValue3("0");
    setSliderValue4("0");
    setSliderValue5("0");
  };

  const [activeTab, setActiveTab] = useState("mytrade"); // Default to 'mytrade'
  const [historyactiveTab, sethistoryActiveTab] = useState("openorders"); // Default to 'mytrade'
  const [spottab, setSpotTab] = useState("limit"); // Default to 'mytrade'

  const buy_sell_percentage = (percentage) => {
    console.log(percentage, "hello", curnt_Ordertype_tabref.current);

    // Check if the user is authenticated
    if (!checkAuth) {
      console.log("Login to continue !");
      return;
    }

    // Get references
    const currentType = currentTyperef.current;

    let total = 0;
    let amount = 0;

    if (currentType === "buy") {
      total = (+percentage * +tobalance) / 100;
      amount = total / +formValue.price;

      formValue.amount = amount.toFixed(8); // Use 8 decimals
      formValue.total = +total.toFixed(8);
    } else if (currentType === "sell") {
      total = (+percentage * +frombalance) / 100;
      const tot = total * +formValue.price;

      formValue.amount = total.toFixed(8); // Use 8 decimals
      formValue.total = +tot.toFixed(8);
    }
  };

  const buy_sell_percentage1 = (percentage) => {
    console.log(percentage, "hello1111", currentTyperef.current);

    // Ensure the user is authenticated
    if (!checkAuth) {
      console.log("Login to continue !");
      return;
    }

    // Get necessary values
    const currentType = currentTyperef.current;

    let total = 0;
    let amount = 0;

    if (currentType === "buy") {
      total = (+percentage * +tobalance) / 100;
      amount = total / +formValue.sellprice;

      formValue.sellamount = amount.toFixed(8);
      formValue.selltotal = +total.toFixed(8);

      console.log(formValue.sellamount, "formValue.sellamount");
      console.log(formValue.selltotal, "formValue.selltotal");
    } else if (currentType === "sell") {
      total = (+percentage * +frombalance) / 100;
      const tot = total * +formValue.sellprice;

      formValue.sellamount = total.toFixed(8);
      formValue.selltotal = +tot.toFixed(8);
    }
  };

  const getActiveOrders = async (pages, getpair) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
        pair: getpair,
      };
      var data = {
        apiUrl: apiService.getActiveOrders,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setCurrentPage(resp.current);
        settotalactive(resp.pages);
        setActiveOders(resp.result);
      } else {
      }
    } catch (error) {}
  };

  const getstopLimitOrders = async (pages, getpair) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
        pair: getpair,
      };
      var data = {
        apiUrl: apiService.getStop_limit_Orders,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        // settotalactive(resp.count);
        // console.log(resp.result);
      } else {
      }
    } catch (error) {}
  };

  const tradeHistory = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
        pair: pairDetails.pair,
      };
      var data = {
        apiUrl: apiService.tradeHistory,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setcurrentPageHis(resp.current);
        settradeHistory(resp.result);
        settotalHist(resp.pages);
        setptkStatus(resp.ptk_fee_status);
      } else {
      }
    } catch (error) {}
  };

  const getCancelOrders = async (pages) => {
    try {
      var obj = {
        FilPerpage: perpage,
        FilPage: pages,
        pair: currentPair,
      };
      var data = {
        apiUrl: apiService.getCancelOrders,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setcancelOrders(resp.result);
        settotalcan(resp.pages);
        setCurrentPagecan(resp.current);
      } else {
      }
    } catch (error) {}
  };

  //========FETCH TICKER PRICE ==========//

  const fetchTickerPrice = async (pair) => {
    // console.log("fetchTickerPrice pair===", pair);
    try {
      var data = {
        apiUrl: apiService.fetch_tickers,
        payload: { pair: pair },
      };
      var fetchticker = await postMethod(data);
      if (fetchticker) {
        var data = await fetchticker.data;
        // console.log("fetchTickerPrice data====", data);
        setpairTickerDetails(data);
        setmarketPrice(
          data.lastprice.lastprice ? data.lastprice.lastprice : 0.0
        );

        // console.log(data.lastprice.lastprice, "fetchticket");
        if (curnt_Ordertype_tabref.current == "Stop") {
          if (formValue.price <= 0) {
            // formValue.price = "";
            formValue.price = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
            formValue.sellprice = (+marketPriceref.current).toFixed(
              pairDetails?.liq_price_decimal
            )
              ? +marketPriceref.current
              : 0.0;
          }
        } else if (
          curnt_Ordertype_tabref.current == "Market" ||
          curnt_Ordertype_tabref.current == "Limit"
        ) {
          formValue.price = (+marketPriceref.current).toFixed(
            pairDetails?.liq_price_decimal
          )
            ? +marketPriceref.current
            : 0.0;
          formValue.sellprice = (+marketPriceref.current).toFixed(
            pairDetails?.liq_price_decimal
          )
            ? +marketPriceref.current
            : 0.0;
        }
      }
    } catch (error) {}
  };

  // ================FETCH MARKET =============//

  const getMarketTrades = async (pair) => {
    try {
      var data = {
        apiUrl: apiService.marketTrades,
        payload: { pair: pair },
      };
      // setauthentication(true);
      setmarketTradeloader(true);
      var fetchTradeHisotory = await postMethod(data);
      // setauthentication(false);
      if (fetchTradeHisotory) {
        if (fetchTradeHisotory.status) {
          setmarketTradeloader(false);
          setmarketTrade(fetchTradeHisotory.Message);
        } else {
          setmarketTradeloader(false);
          setmarketTrade([]);
        }
      } else {
      }
    } catch (error) {}
  };
  const activePageChange = (event, pageNumber) => {
    // console.log("pageNumber--->>>",pageNumber);
    setCurrentPage(pageNumber); // call API to get data based on pageNumber
    getActiveOrders(pageNumber, "");
  };

  const cancelPageChange = (event, pageNumber) => {
    setCurrentPagecan(pageNumber); // call API to get data based on pageNumber
    getCancelOrders(pageNumber);
  };

  const orderhistoryactive = (event, pageNumber) => {
    setcurrentPageHis(pageNumber); // call API to get data based on pageNumber
    tradeHistory(pageNumber);
  };

  const orderCancel = async (cancelDatas) => {
    try {
      var obj = {
        _id: cancelDatas._id,
      };
      var data = {
        apiUrl: apiService.cancelOrder,
        payload: obj,
      };
      var fetchTradeHisotory = await postMethod(data);
      if (fetchTradeHisotory) {
        showsuccessToast(
          "Order cancelled successfully, your amount credit to your wallet"
        );
        getActiveOrders(1, currentPair);
        getUserbalance(currentPair);
      } else {
        showerrorToast("Please try again later");
      }
    } catch (error) {
      showerrorToast("Please try again later");
    }
  };

  const callCancelOrder = async () => {
    if (checkAuth === true) {
      getCancelOrders(1);
    }
  };
  const callOrdehistory = async () => {
    if (checkAuth === true) {
      tradeHistory(1);
    }
  };

  const addPrice = async (price) => {
    setpriceLoader(true);
    if (curnt_Ordertype_tabref.current == "Limit") {
      formValue.price = parseFloat(price).toFixed(
        pairDetails?.liq_price_decimal
      );
      formValue.sellprice = parseFloat(price).toFixed(
        pairDetails?.liq_price_decimal
      );
    }
    // console.log(formValue, "-=-=-form value=-=-");
  };

  const renderInput = (label, name, value, currency, onChange) => (
    <div className="form_right">
      <label>{label}</label>
      <div className="input_section">
        <input
          type="number"
          min="0"
          className="form-control"
          placeholder="0.00"
          name={name}
          value={value}
          onChange={onChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />
        <span>{currency}</span>
      </div>
    </div>
  );

  const rendermarketInput = (label, name, value, currency, onChange) => (
    <div className="form_right">
      <label>{label}</label>
      <div className="input_section">
        <input
          type="number"
          min="0"
          className="form-control"
          placeholder="0.00"
          name={name}
          value={value}
          onChange={onChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          disabled
        />
        <span>{currency}</span>
      </div>
    </div>
  );

  const handleBuy = useCallback(() => {
    if (checkAuth) orderPlace("Limit", "buy");
    else Movelogin();
  }, [checkAuth, orderPlace, Movelogin]);

  const handleSell = useCallback(() => {
    if (checkAuth) sellorderPlace("Limit", "sell");
    else Movelogin();
  }, [checkAuth, sellorderPlace, Movelogin]);

  const handlemarketBuy = useCallback(() => {
    if (checkAuth) orderPlace("Market", "buy");
    else Movelogin();
  }, [checkAuth, orderPlace, Movelogin]);

  const handlemarketSell = useCallback(() => {
    if (checkAuth) sellorderPlace("Market", "sell");
    else Movelogin();
  }, [checkAuth, sellorderPlace, Movelogin]);

  const handlestopBuy = useCallback(() => {
    if (checkAuth) orderPlace("Stop", "buy");
    else Movelogin();
  }, [checkAuth, orderPlace, Movelogin]);

  const handlestopSell = useCallback(() => {
    if (checkAuth) sellorderPlace("Stop", "sell");
    else Movelogin();
  }, [checkAuth, sellorderPlace, Movelogin]);

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const showerrorToast = (message) => {
    toast.dismiss();
    toast.error(message);
  };

  const changeOrderTab = (type) => {
    setSpotTab(type);
    formValue.amount = "";
    formValue.sellamount = "";
    formValue.total = "";
    formValue.selltotal = "";
  };

  return (
    <>
      <Header />
      <div className="wholenew_back_clr">
        <div className="container">
          <div className="header">
            <main className="min-height-100vh">
              <div className="trade_page_global">
                <>
                  <div className="subHeader">
                    <div className="inner_sub">
                      <div className="content">
                        <div class="left">
                          <img
                            src={require("../assets/stars.png")}
                            width="20px"
                            height="20px"
                            className="mt-1"
                            alt=""
                          />
                          <div class="layout">
                            <div class="childrenContainer">
                              <div class="css-l36dyj">
                                <div class="css-4cffwv">
                                  <div class="css-4h6mys">
                                    <div
                                      data-bn-type="text"
                                      class="css-1qkv3vk"
                                    >
                                      <h1>
                                        {" "}
                                        {fromCurrency} / {toCurrency}
                                      </h1>
                                    </div>
                                    <div class="css-f4kgqr">
                                      <a
                                        data-bn-type="link"
                                        href="https://www.binance.com/en/price"
                                        target="_blank"
                                        class="css-o1v5sz"
                                        disabled=""
                                      >
                                        {fromcurrencyref.current} {t("price")}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                                <div class="css-10nf7hq">
                                  <span
                                    data-bn-type="text"
                                    class="tag-group-container css-as916g"
                                  >
                                    <div class="tag-text css-4cffwv">
                                      <div
                                        data-bn-type="text"
                                        class="tag css-vurnku"
                                      >
                                        {t("POW")}
                                      </div>
                                      <div
                                        data-bn-type="text"
                                        class="tag-margin css-vurnku"
                                      >
                                        |
                                      </div>
                                      <div
                                        data-bn-type="text"
                                        class="tag css-vurnku"
                                      >
                                        {t("VOL")}
                                      </div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        class="css-omng2l"
                                      >
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M12.288 12l-3.89 3.89 1.768 1.767L15.823 12l-1.768-1.768-3.889-3.889-1.768 1.768 3.89 3.89z"
                                          fill="currentColor"
                                        ></path>
                                      </svg>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="nowPrice">
                              <div
                                class={` ${
                                  pairTickerDetails?.price_change <= 0
                                    ? "price_red"
                                    : "price_green"
                                } showPrice css-13n52y`}
                              >
                                {" "}
                                {isNaN(marketPriceref.current)
                                  ? ""
                                  : parseFloat(marketPriceref.current).toFixed(
                                      pairDetails?.liq_price_decimal
                                    )}
                              </div>
                              <div class="subPrice">
                                {pairDetails.to_symbol}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="right">
                          <div class="tickerListContainer">
                            <div class="tickerList">
                              <div>
                                <div class="tickerItemLabel">
                                  {t("24HChange")}{" "}
                                  <small className="small">
                                    ({pairDetails.to_symbol})
                                  </small>{" "}
                                </div>
                                <div class="tickerPriceText">
                                  <span className="">
                                    <div
                                      className={`tickerPriceText gap-2 d-flex ${
                                        pairTickerDetails?.price_change <= 0
                                          ? "price_red"
                                          : "price_green"
                                      }`}
                                    >
                                      {isNaN(pairTickerDetails?.price_change)
                                        ? ""
                                        : parseFloat(
                                            pairTickerDetails?.price_change
                                          ).toFixed(
                                            pairDetails?.liq_price_decimal
                                          )}
                                      <span
                                        className={
                                          pairTickerDetails?.price_change <= 0
                                            ? "price_red"
                                            : "price_green ml-2"
                                        }
                                      >
                                        {parseFloat(
                                          pairTickerDetails?.change_percent
                                        ).toFixed(2)}{" "}
                                        %
                                      </span>
                                    </div>
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div class="tickerItemLabel">
                                  {t("24high")}{" "}
                                </div>
                                <div class="tickerPriceText">
                                  {" "}
                                  {isNaN(pairTickerDetails?.highprice)
                                    ? ""
                                    : parseFloat(
                                        pairTickerDetails?.highprice
                                      ).toFixed(
                                        pairDetails?.liq_price_decimal
                                      )}{" "}
                                  <small>{pairDetails.to_symbol}</small>
                                </div>
                              </div>
                              <div>
                                <div class="tickerItemLabel">{t("24hLow")}</div>
                                <div class="tickerPriceText">
                                  {" "}
                                  {isNaN(pairTickerDetails?.lowprice)
                                    ? ""
                                    : parseFloat(
                                        pairTickerDetails?.lowprice
                                      ).toFixed(
                                        pairDetails?.liq_price_decimal
                                      )}{" "}
                                  <small>{pairDetails.to_symbol}</small>
                                </div>
                              </div>
                              <div>
                                <div class="tickerItemLabel">
                                  {t("24hVolume")}{" "}
                                  <small>({pairDetails.from_symbol})</small>
                                </div>
                                <div class="tickerPriceText">
                                  {isNaN(pairTickerDetails?.volume)
                                    ? ""
                                    : parseFloat(
                                        pairTickerDetails?.volume
                                      ).toFixed(pairDetails?.liq_price_decimal)}
                                </div>
                              </div>
                              {/* <div>
                              <div class="tickerItemLabel">
                                24h Volume{" "}
                                <small>({pairDetails.to_symbol})</small>
                              </div>
                              <div class="tickerPriceText">
                                {isNaN(pairTickerDetails?.volumeto)
                                  ? ""
                                  : parseFloat(
                                    pairTickerDetails?.volumeto
                                  ).toFixed(pairDetails?.liq_price_decimal)}
                              </div>
                            </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* spot - cross -isolated nav tabs */}
                  <div className="order_form">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <a
                          className="nav-link active"
                          id="home-tab"
                          data-bs-toggle="tab"
                          href="#home"
                          role="tab"
                          aria-controls="home"
                          aria-selected="true"
                        >
                          {t("spot")}
                        </a>
                      </li>
                    </ul>

                    <div className="tab-content tradeform">
                      {/* spot */}
                      <div
                        className="tab-pane fade show active"
                        id="home"
                        role="tabpanel"
                        aria-labelledby="home-tab"
                      >
                        <ul
                          className="nav nav-tabs padd2_orfr"
                          id="myTab"
                          role="tablist"
                        >
                          <li className="">
                            <a
                              className={`spot_nav_tabs cursor-pointer d-inline-block ${
                                spottab === "limit" ? "active" : ""
                              }`}
                              onClick={() => changeOrderTab("limit")}
                            >
                              {t("limit")}
                              <div>
                                <span />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              className={`spot_nav_tabs cursor-pointer d-inline-block ${
                                spottab === "market" ? "active" : ""
                              }`}
                              onClick={() => changeOrderTab("market")}
                            >
                              {t("market")}
                              <div>
                                <span />
                              </div>
                            </a>
                          </li>
                          <li>
                            <a
                              className={`spot_nav_tabs cursor-pointer d-inline-block ${
                                spottab === "stop-limit" ? "active" : ""
                              }`}
                              onClick={() => changeOrderTab("stop-limit")}
                            >
                              {t("Stop-limit")}
                              <div>
                                <span />
                              </div>
                            </a>
                          </li>
                        </ul>

                        <div className="tab-content">
                          <div
                            class={`tab-pane fade in ${
                              spottab === "limit" ? "show active" : ""
                            }`}
                          >
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {renderInput(
                                    "Price",
                                    "price",
                                    price,
                                    toCurrency,
                                    handleChange
                                  )}
                                  {renderInput(
                                    "Amount",
                                    "amount",
                                    amount,
                                    fromCurrency,
                                    handleChange
                                  )}
                                  {checkAuth && (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValueref.current}
                                            step={25}
                                            marks
                                            name="buy"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "total",
                                    total,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(tobalance).toFixed(8)}{" "}
                                        {toCurrency}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p> {t("MaxBuy")}</p>
                                    <p>
                                      <span>
                                        {isNaN(maxbuyref.current)
                                          ? 0
                                          : parseFloat(
                                              maxbuyref.current
                                            ).toFixed(8)}{" "}
                                        {fromCurrency}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="buy_selecu"
                                        onClick={handleBuy}
                                      >
                                        {orderloaderref.current
                                          ? "Loading..."
                                          : "Buy"}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="buy_selecu_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {renderInput(
                                    "Price",
                                    "sellprice",
                                    sellprice,
                                    toCurrency,
                                    handleChange
                                  )}
                                  {renderInput(
                                    "Amount",
                                    "sellamount",
                                    sellamount,
                                    fromCurrency,
                                    handleChange
                                  )}
                                  {checkAuth && (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValue1ref.current}
                                            step={25}
                                            marks
                                            name="sell"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange1}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "selltotal",
                                    selltotal,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(frombalance).toFixed(8)}{" "}
                                        {fromCurrency}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p>{t("MaxSell")} </p>
                                    <p>
                                      <span>
                                        {isNaN(maxsellref.current)
                                          ? 0
                                          : parseFloat(
                                              maxsellref.current
                                            ).toFixed(8)}{" "}
                                        {toCurrency}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="Sell"
                                        onClick={handleSell}
                                      >
                                        {sellorderloaderref.current
                                          ? t("Loading...")
                                          : t("sell")}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="Sell_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class={`tab-pane fade in ${
                              spottab === "market" ? "show active" : ""
                            }`}
                            // } show bor_1 mar-top`}
                          >
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {rendermarketInput(
                                    "Price",
                                    "price",
                                    marketPrice,
                                    toCurrency,
                                    ""
                                  )}
                                  {renderInput(
                                    "Amount",
                                    "amount",
                                    amount,
                                    fromCurrency,
                                    handleChange
                                  )}
                                  {!checkAuth ? (
                                    ""
                                  ) : (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValue2ref.current}
                                            step={25}
                                            marks
                                            name="buy"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange2}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "total",
                                    total,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(tobalance).toFixed(8)}{" "}
                                        {toCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p> {t("MaxBuy")} </p>
                                    <p>
                                      <span>
                                        {" "}
                                        {isNaN(maxbuyref.current)
                                          ? 0
                                          : parseFloat(maxbuy).toFixed(8)}{" "}
                                        {fromCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="buy_selecu"
                                        onClick={handlemarketBuy}
                                      >
                                        {orderloaderref.current
                                          ? t("Loading...")
                                          : t("buy")}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="buy_selecu_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {rendermarketInput(
                                    "Price",
                                    "sellprice",
                                    marketPrice,
                                    toCurrency,
                                    ""
                                  )}
                                  {renderInput(
                                    "Amount",
                                    "sellamount",
                                    sellamount,
                                    fromCurrency,
                                    handleChange
                                  )}

                                  {!checkAuth ? (
                                    ""
                                  ) : (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValue3ref.current}
                                            step={25}
                                            marks
                                            name="sell"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange3}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "selltotal",
                                    selltotal,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(frombalance).toFixed(8)}{" "}
                                        {fromCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p> {t("MaxSell")} </p>
                                    <p>
                                      <span>
                                        {" "}
                                        {isNaN(maxsellref.current)
                                          ? 0
                                          : parseFloat(maxsell).toFixed(8)}{" "}
                                        {toCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="Sell"
                                        onClick={handlemarketSell}
                                      >
                                        {sellorderloaderref.current
                                          ? t("Loading...")
                                          : t("sell")}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="Sell_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class={`tab-pane fade in ${
                              spottab === "stop-limit" ? "show active" : ""
                            }`}
                          >
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {renderInput(
                                    "Price",
                                    "price",
                                    price,
                                    toCurrency,
                                    handleChange
                                  )}
                                  {renderInput(
                                    "Stop Limit",
                                    "stop_price",
                                    stop_price,
                                    toCurrency,
                                    handleChange
                                  )}

                                  {renderInput(
                                    "Amount",
                                    "amount",
                                    amount,
                                    fromCurrency,
                                    handleChange
                                  )}

                                  {!checkAuth ? (
                                    ""
                                  ) : (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValue4ref.current}
                                            step={25}
                                            marks
                                            name="buy"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange4}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "total",
                                    total,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(tobalance).toFixed(8)}{" "}
                                        {toCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p>{t("")} </p>
                                    <p>
                                      <span>
                                        {" "}
                                        {isNaN(maxbuyref.current)
                                          ? 0
                                          : parseFloat(maxbuy).toFixed(8)}{" "}
                                        {fromCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="buy_selecu"
                                        onClick={handlestopBuy}
                                      >
                                        {orderloaderref.current
                                          ? t("Loading...")
                                          : t("buy")}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="buy_selecu_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form_trade">
                                  {renderInput(
                                    "Price",
                                    "sellprice",
                                    sellprice,
                                    toCurrency,
                                    handleChange
                                  )}
                                  {renderInput(
                                    "Stop Limit",
                                    "sellstop_price",
                                    sellstop_price,
                                    toCurrency,
                                    handleChange
                                  )}

                                  {renderInput(
                                    "Amount",
                                    "sellamount",
                                    sellamount,
                                    fromCurrency,
                                    handleChange
                                  )}

                                  {!checkAuth ? (
                                    ""
                                  ) : (
                                    <ThemeProvider theme={themeSlider}>
                                      <div className="slider_spacing">
                                        <Box>
                                          <Slider
                                            value={sliderValue5ref.current}
                                            step={25}
                                            marks
                                            name="sell"
                                            min={0}
                                            max={100}
                                            onChange={handleSliderChange5}
                                            sx={{
                                              "& .MuiSlider-track": {
                                                backgroundColor: "#1E2026",
                                              },
                                              "& .MuiSlider-thumb": {
                                                backgroundColor: "#1E2026",
                                              },
                                            }}
                                          />
                                        </Box>
                                      </div>
                                    </ThemeProvider>
                                  )}
                                  {rendermarketInput(
                                    "Total",
                                    "selltotal",
                                    selltotal,
                                    "",
                                    () => {}
                                  )}

                                  <div className="avali">
                                    <p>{t("Avbl")} </p>
                                    <p>
                                      <span>
                                        {parseFloat(frombalance).toFixed(8)}{" "}
                                        {fromCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="avali">
                                    <p>{t("MaxBuy")} </p>
                                    <p>
                                      <span>
                                        {" "}
                                        {isNaN(maxsellref.current)
                                          ? 0
                                          : parseFloat(maxsell).toFixed(8)}{" "}
                                        {toCurrency}{" "}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="buy_BTN">
                                    {loginStatus == true ? (
                                      <Button
                                        className="Sell"
                                        onClick={handlestopSell}
                                      >
                                        {sellorderloaderref.current
                                          ? t("Loading...")
                                          : t("sell")}
                                      </Button>
                                    ) : (
                                      <Button
                                        className="Sell_beforelog"
                                        onClick={() => loginNave()}
                                      >
                                        {t("Logintocontinue")}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* cross */}
                    </div>
                  </div>
                  <div className="order_book">
                    <div className="d-flex span-div justify-content-between">
                      <span>{t("OrderBook")}</span>
                      <span>
                        <i class="fa-solid fa-ellipsis"></i>
                      </span>
                    </div>
                    <div className="contant_scetion">
                      <div className="orderbook-header ">
                        <div class="orderbook-header-tips current-flex">
                          <div>
                            <button
                              data-bn-type="button"
                              data-testid="defaultModeButton"
                              class=" css-sz6ky9"
                              onClick={Fullorderbook}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="css-3kwgah"
                              >
                                <path d="M4 4h7v7H4V4z" fill="#F6465D"></path>
                                <path d="M4 13h7v7H4v-7z" fill="#0ECB81"></path>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>
                            <button
                              data-bn-type="button"
                              data-testid="buyModeButton"
                              class=" css-1meiumy"
                              onClick={bidorderbook}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="css-3kwgah"
                              >
                                <path d="M4 4h7v16H4V4z" fill="#0ECB81"></path>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>
                            <button
                              data-bn-type="button"
                              data-testid="sellModeButton"
                              class=" css-1meiumy"
                              onClick={askorderbook}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                class="css-3kwgah"
                              >
                                <path d="M4 4h7v16H4V4z" fill="#F6465D"></path>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13 4h7v4h-7V4zm0 6h7v4h-7v-4zm7 6h-7v4h7v-4z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </button>
                          </div>

                          {/* <div className="orderbook-num">
                          <span>0.01</span>{" "}
                          <span>
                            <i class="fa-solid fa-caret-down"></i>
                          </span>
                        </div> */}
                        </div>
                      </div>

                      <div className="market_order">
                        <article>
                          <section class="orderbook-header ml-0 mr-0">
                            <table width="100%">
                              <tr>
                                <th class="price" width="25%">
                                  {t("price")}({pairDetails.to_symbol})
                                </th>
                                <th width="25%">
                                  {t("amount")}({pairDetails.from_symbol})
                                </th>
                                <th width="25%">{t("total")}</th>
                              </tr>
                            </table>
                          </section>

                          {orderbooksloaderref.current == true ? (
                            <i class="fa-solid fa-spinner text-center fa-spin"></i>
                          ) : (
                            <>
                              <section class="side" id="asks">
                                <table width="100%" className="green_content">
                                  {orderbookLoader == false ? (
                                    ""
                                  ) : orderbookaskref.current.length > 0 ? (
                                    orderbookaskref.current.map((ask, i) => {
                                      return (
                                        <tr data-width="70">
                                          <td
                                            width="25%"
                                            style={{ cursor: "pointer" }}
                                            className="price sell priceclick"
                                            onClick={() => addPrice(ask[0])}
                                          >
                                            {ask[0]}
                                          </td>
                                          <td width="25%">{ask[1]}</td>
                                          <td width="25%">{ask[2]}</td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      {" "}
                                      <td colSpan="3" className="text-center">
                                        {" "}
                                        {t("Datanotfound!")}
                                      </td>{" "}
                                    </tr>
                                  )}
                                </table>
                              </section>
                              {orderbookdivider == false ? (
                                ""
                              ) : (
                                <section class="divider">
                                  <div className="current-flex">
                                    <div class="current-price">
                                      {parseFloat(marketPrice).toFixed(
                                        pairDetails?.liq_price_decimal
                                      )}
                                      <span>
                                        <i class="fa-solid fa-arrow-down text-red"></i>
                                      </span>
                                      {/* <span className="current-down-price">
                                      $67,850
                                    </span> */}
                                    </div>
                                    <span className="current-right-arrow">
                                      {" "}
                                      <i class="fa-solid fa-angle-right"></i>
                                    </span>
                                  </div>
                                </section>
                              )}
                              <section class="side bids">
                                <table width="100%">
                                  {orderbookLoaderbid == false ? (
                                    ""
                                  ) : orderbookbidref.current.length > 0 ? (
                                    orderbookbidref.current.map((bid, i) => {
                                      return (
                                        <tr>
                                          <td
                                            style={{ cursor: "pointer" }}
                                            width="25%"
                                            className="red-green price buy priceclick"
                                            onClick={() => addPrice(bid[0])}
                                          >
                                            {bid[0]}
                                          </td>
                                          <td width="25%">{bid[1]}</td>
                                          <td width="25%">{bid[2]}</td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      {" "}
                                      <td colSpan="3" className="text-center">
                                        {" "}
                                        {t("Datanotfound")}
                                      </td>{" "}
                                    </tr>
                                  )}
                                </table>
                              </section>
                            </>
                          )}
                        </article>
                      </div>
                    </div>
                  </div>
                  <div className="chart_trade">
                    <div id="tv_chart_container"></div>
                  </div>
                  <div className="trades pb-0">
                    <div className="">
                      <div className="form_seldect__pair pt-0">
                        <ul class="nav nav-pills mt-3">
                          <li class="active">
                            <a
                              // data-toggle="pill"
                              // href="#mtrade"
                              className={`${
                                activeTab === "mytrade" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("mytrade")}
                            >
                              {t("MarketTrades")}
                            </a>
                          </li>
                          <li>
                            <a
                              className={`${
                                activeTab === "trade" ? "active" : ""
                              }`}
                              onClick={() => setActiveTab("trade")}
                            >
                              {t("MyTrades")}
                            </a>
                          </li>
                        </ul>

                        <div class="tab-content pair_details">
                          <div
                            id="mtrade"
                            class={`tab-pane fade in ${
                              activeTab === "mytrade" ? "show active" : ""
                            } show bor_1 mar-top`}
                          >
                            <div class="fixTableHead mt-2">
                              <table>
                                <thead>
                                  <tr>
                                    <th className="market-trades">
                                      {t("price")} ({pairDetails.to_symbol})
                                    </th>
                                    <th className="text-end market-trades">
                                      {t("amount")} ({pairDetails.from_symbol})
                                    </th>
                                    <th className="text-end market-trades">
                                      {t("Time")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {!checkAuth ? (
                                    <tr>
                                      {" "}
                                      <td colSpan="3">
                                        <Button
                                          className="Butn_header my-4 d-block mx-auto"
                                          onClick={Movelogin}
                                        >
                                          <Link
                                            to="/login"
                                            className="text-black"
                                          >
                                            {t("Logintocontinue")}
                                          </Link>
                                        </Button>{" "}
                                      </td>{" "}
                                    </tr>
                                  ) : marketTraderef.current.length > 0 ? (
                                    marketTraderef.current.map((item, i) => {
                                      return (
                                        <tr className="position_rel_over">
                                          {item.tradeType == "buy" ? (
                                            <td className="market-price-td">
                                              <span className="color-buy">
                                                {" "}
                                                {item.price}{" "}
                                              </span>
                                            </td>
                                          ) : (
                                            <td className="market-price-td">
                                              <span className="red-green">
                                                {" "}
                                                {item.price}{" "}
                                              </span>
                                            </td>
                                          )}
                                          <td className="text-end">
                                            {item.amount}{" "}
                                          </td>
                                          <td className="text-end">
                                            {moment(item.time).format(
                                              "hh:mm:ss"
                                            )}{" "}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="3"
                                        className="text-center mt-4"
                                      >
                                        {t("NoMarketTrades")}
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div
                            id="mytrade"
                            class={`tab-pane ${
                              activeTab === "trade" ? "show active" : ""
                            } fade show bor_1 mar-top`}
                          >
                            <div class="fixTableHead mt-2">
                              <table>
                                <thead>
                                  <tr>
                                    <th>
                                      {" "}
                                      {t("pair")}({pairDetails.to_symbol})
                                    </th>
                                    <th className="text-end">
                                      {t("price")} ({pairDetails.from_symbol})
                                    </th>
                                    <th className="text-end">{t("Time")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {!checkAuth ? (
                                    <tr>
                                      {" "}
                                      <td colSpan="3">
                                        <Button
                                          className="Butn_header my-4 d-block mx-auto"
                                          onClick={Movelogin}
                                        >
                                          <Link
                                            to="/login"
                                            className="text-black"
                                          >
                                            {t("Logintocontinue")}
                                          </Link>
                                        </Button>{" "}
                                      </td>{" "}
                                    </tr>
                                  ) : tradeHistoryData.length > 0 ? (
                                    tradeHistoryData.map((item, i) => {
                                      return (
                                        <tr className="position_rel_over">
                                          {item.type === "buy" ? (
                                            <td>
                                              <span className="color-buy">
                                                {" "}
                                                {item.askPrice
                                                  ? Number(
                                                      item.askPrice
                                                    ).toFixed(2)
                                                  : "0"}{" "}
                                              </span>
                                            </td>
                                          ) : (
                                            <td>
                                              <span className="red-green">
                                                {" "}
                                                {item.askPrice
                                                  ? Number(
                                                      item.askPrice
                                                    ).toFixed(2)
                                                  : "0"}{" "}
                                              </span>
                                            </td>
                                          )}
                                          <td className="text-end">
                                            {item.askAmount
                                              ? Number(item.askAmount).toFixed(
                                                  4
                                                )
                                              : "0"}{" "}
                                          </td>
                                          <td className="text-end">
                                            {moment(item.created_at).isValid()
                                              ? moment(item.created_at).format(
                                                  "hh:mm:ss"
                                                )
                                              : t("Invaliddate")}{" "}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="3"
                                        className="text-center mt-4"
                                      >
                                        {t("NoMarketTrades")}
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

                  {/* search section */}
                  <div className="markets">
                    <div className="form_seldect__pair">
                      <div className="searcj">
                        <i class="ri-search-line"></i>
                        <input
                          type="text"
                          placeholder="Search"
                          onChange={handleInputChange}
                          name="searchpair"
                          minLength={1}
                          maxLength={15}
                          value={searchpair}
                        />
                      </div>
                      <ul className="nav nav-pills">
                        <li>
                          <a onClick={() => handleTabClick("fav")}>
                            <i
                              className={`ri-star-s-fill cursor-pointer ${
                                active1Tab === "fav" ? "text-warning" : ""
                              }`}
                            ></i>
                          </a>
                        </li>

                        {Tocurrenciesref.current?.map((currency, index) => (
                          <li
                            key={index}
                            className={
                              currency === selectedmarketref.current
                                ? "active"
                                : ""
                            }
                          >
                            <a
                              data-toggle="tab"
                              // href={`#currency-${index}`}
                              className={
                                active1Tab != "fav" &&
                                currency == selectedmarketref.current
                                  ? "active"
                                  : ""
                              }
                              onClick={() => {
                                handleTabClick("currency");
                                selectPairbyCurrency(currency); // Handle currency click
                              }}
                            >
                              {currency}
                            </a>
                          </li>
                        ))}
                      </ul>

                      <div class="tab-content pair_details">
                        {active1Tab == "fav" ? (
                          <div
                            id="fav"
                            className="tab-pane fade in active show bor_1 mar-top"
                          >
                            <div class="fixTableHead mt-2">
                              <table>
                                <thead>
                                  <tr>
                                    <th>{t("pair")}</th>
                                    <th className="text-end">{t("price")}</th>
                                    <th className="text-end">{t("Change")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sideLoader == true ? (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        <i className="fa-solid fa-spinner fa-spin text-center tradeicons"></i>
                                      </td>
                                    </tr>
                                  ) : favpairlist && favpairlist.length > 0 ? (
                                    favpairlist.map((obj, i) => {
                                      // Check if the current pair is in the favorite pairs list
                                      const isFavorite = favpairs?.includes(
                                        obj.pair
                                      );

                                      return (
                                        <tr
                                          className={`pair_section ${
                                            obj.pair === pair ? "active" : ""
                                          } curpoint`}
                                          key={i}
                                        >
                                          <td>
                                            <div className="d-flex align-items-center gap-2">
                                              <li className="list-unstyled">
                                                <p
                                                  className="text-decoration-none"
                                                  onClick={() => favpair(obj)}
                                                >
                                                  <i
                                                    className={`ri-star-s-fill cursor-pointer ${
                                                      isFavorite
                                                        ? "text-warning"
                                                        : ""
                                                    }`}
                                                  ></i>{" "}
                                                  {/* Apply yellow color if favorite */}
                                                </p>
                                              </li>
                                              <h2
                                                onClick={() => pairChange(obj)}
                                              >
                                                {obj.from_symbol} /
                                                <small> {obj.to_symbol}</small>
                                              </h2>
                                            </div>
                                          </td>

                                          <td
                                            onClick={() => pairChange(obj)}
                                            className="text-end"
                                          >
                                            <div className="price_symbol">
                                              <small>
                                                <span className="material-symbols-outlined"></span>
                                              </small>
                                              {obj.lastprice == null ||
                                              obj.lastprice === undefined ||
                                              obj.lastprice === "" ? (
                                                0.0
                                              ) : (
                                                <span className="text-white">
                                                  {parseFloat(
                                                    obj.lastprice
                                                  ).toFixed(
                                                    pairDetails?.liq_price_decimal
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          </td>

                                          <td
                                            onClick={() => pairChange(obj)}
                                            className="text-right"
                                          >
                                            {obj.price_change <= 0 ? (
                                              <p>
                                                <i className="bi bi-caret-down-fill"></i>{" "}
                                                <span className="price_red">
                                                  {obj.price_change}%
                                                </span>
                                              </p>
                                            ) : (
                                              <p>
                                                <i className="bi bi-caret-up-fill"></i>{" "}
                                                <span className="price_green">
                                                  {obj.price_change}%
                                                </span>
                                              </p>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan="3">{t("Datanotfound")}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div
                            id="USDT"
                            className="tab-pane fade in active show bor_1 mar-top
                      "
                          >
                            <div class="fixTableHead mt-2">
                              <table>
                                <thead>
                                  <tr>
                                    <th>{t("pair")}</th>
                                    <th className="text-end">{t("price")}</th>
                                    <th className="text-end">{t("change")}</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sideLoader == true ? (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        <i className="fa-solid fa-spinner fa-spin text-center tradeicons"></i>
                                      </td>
                                    </tr>
                                  ) : pairlist && pairlist.length > 0 ? (
                                    pairlist.map((obj, i) => {
                                      // Check if the current pair is in the favorite pairs list
                                      const isFavorite = favpairs?.includes(
                                        obj.pair
                                      );
                                      return (
                                        <tr
                                          className={`pair_section ${
                                            obj.pair === pair ? "active" : ""
                                          } curpoint`}
                                          key={i}
                                        >
                                          <td>
                                            <div className="d-flex align-items-center gap-2">
                                              <li className="list-unstyled">
                                                <p
                                                  className="text-decoration-none"
                                                  onClick={() => favpair(obj)}
                                                >
                                                  <i
                                                    className={`ri-star-s-fill cursor-pointer ${
                                                      isFavorite
                                                        ? "text-warning"
                                                        : ""
                                                    }`}
                                                  ></i>{" "}
                                                  {/* Apply yellow color if favorite */}
                                                </p>
                                              </li>
                                              <h2
                                                onClick={() => pairChange(obj)}
                                              >
                                                {obj.from_symbol} /
                                                <small> {obj.to_symbol}</small>
                                              </h2>
                                            </div>
                                          </td>

                                          <td
                                            onClick={() => pairChange(obj)}
                                            className="text-end"
                                          >
                                            <div className="price_symbol">
                                              <small>
                                                <span className="material-symbols-outlined"></span>
                                              </small>
                                              {obj.lastprice == null ||
                                              obj.lastprice === undefined ||
                                              obj.lastprice === "" ? (
                                                0.0
                                              ) : (
                                                <span className="text-white">
                                                  {parseFloat(
                                                    obj.lastprice
                                                  ).toFixed(
                                                    pairDetails?.liq_price_decimal
                                                  )}
                                                </span>
                                              )}
                                            </div>
                                          </td>

                                          <td
                                            onClick={() => pairChange(obj)}
                                            className="text-right"
                                          >
                                            {obj.price_change <= 0 ? (
                                              <p>
                                                <i className="bi bi-caret-down-fill"></i>{" "}
                                                <span className="price_red">
                                                  {obj.price_change}%
                                                </span>
                                              </p>
                                            ) : (
                                              <p>
                                                <i className="bi bi-caret-up-fill"></i>{" "}
                                                <span className="price_green">
                                                  {obj.price_change}%
                                                </span>
                                              </p>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan="3">{t("Datanotfound")}</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* orders section(open,cancel,history) */}
                  <div className="basictable tradeform">
                    <ul class="nav nav-pills mt-4 d-flex gap-2">
                      <li class="active">
                        <a
                          // data-toggle="tab"
                          // data-target="#OpenOrders"
                          // className="active"

                          className={`cursor-pointer d-inline-block ${
                            historyactiveTab === "openorders" ? "active" : ""
                          }`}
                          onClick={() => sethistoryActiveTab("openorders")}
                        >
                          {t("OpenOrders")}
                          <div>
                            <span />
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          // data-toggle="tab"
                          // href="#OrderHistory"
                          // onClick={callOrdehistory}

                          className={`cursor-pointer d-inline-block ${
                            historyactiveTab === "orderhistory" ? "active" : ""
                          }`}
                          onClick={() => sethistoryActiveTab("orderhistory")}
                        >
                          {t("OrderHistory")}
                          <div>
                            <span />
                          </div>
                        </a>
                      </li>
                      <li>
                        <a
                          // data-toggle="tab"
                          // href="#OrderBook"
                          // onClick={callCancelOrder}

                          className={`cursor-pointer d-inline-block ${
                            historyactiveTab === "cancelorder" ? "active" : ""
                          }`}
                          onClick={() => sethistoryActiveTab("cancelorder")}
                        >
                          {t("CancelOrders")}
                          <div>
                            <span />
                          </div>
                        </a>
                      </li>
                    </ul>
                    <div class="tab-content pair_details pading_oedar marno_neww">
                      {/* ==========ACTIVE OREDERS========== */}
                      <div
                        id="OpenOrders"
                        class={`tab-pane fade in ${
                          historyactiveTab === "openorders" ? "show active" : ""
                        }`}
                      >
                        <div className="table-responsive">
                          <table>
                            <thead>
                              <tr>
                                <th>{t("date")}</th>
                                <th>{t("pair")} </th>
                                <th>{t("price")} </th>
                                <th>{t("side")} </th>
                                <th>{t("orderType")} </th>
                                <th>{t("amount")} </th>
                                <th>{t("total")} </th>
                                <th className="text-end">{t("Action")}/</th>
                              </tr>
                            </thead>

                            {/* for styles, refer mockdata tbody, I've written below*/}
                            <tbody>
                              {activeOrderDatas.length > 0 ? (
                                activeOrderDatas.map((item, i) => {
                                  var dates = moment(item.createddate).format(
                                    "lll"
                                  );

                                  return (
                                    <tr>
                                      <td className="new_td_pad_y">{dates} </td>
                                      <td className="new_td_pad_y">
                                        {item.pairName}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.tradeType == "buy" ? (
                                          <span className="text-green">
                                            {parseFloat(item.price).toFixed(8)}{" "}
                                          </span>
                                        ) : (
                                          <span className="text-red">
                                            {parseFloat(item.price).toFixed(8)}{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {" "}
                                        {item.tradeType}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {" "}
                                        {item.ordertype}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {" "}
                                        {parseFloat(item.filledAmount).toFixed(
                                          8
                                        )}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {parseFloat(
                                          item.filledAmount * item.price
                                        ).toFixed(8)}
                                      </td>
                                      <td className="d-flex justify-content-end bornew_none new_td_pad_y">
                                        <Button
                                          className="btn historybtn"
                                          onClick={() => orderCancel(item)}
                                        >
                                          {t("cancel")}
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  {" "}
                                  {!checkAuth ? (
                                    <td colSpan="8">
                                      <Button
                                        className="Butn_header my-4 d-block mx-auto"
                                        onClick={Movelogin}
                                      >
                                        <Link
                                          to="/login"
                                          className="text-black"
                                        >
                                          {t("Logintocontinue")}
                                        </Link>
                                      </Button>{" "}
                                    </td>
                                  ) : (
                                    <td
                                      colSpan="8"
                                      className="text-center new_open_pt"
                                    >
                                      {" "}
                                      {t("Noopenordersfound!")}
                                    </td>
                                  )}
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {activeOrderDatas && activeOrderDatas.length > 0 ? (
                            <div className="pagination mt-4">
                              <Stack spacing={2}>
                                <Pagination
                                  count={totalactive}
                                  page={currentPage}
                                  onChange={activePageChange}
                                  size="small"
                                  sx={{
                                    "& .MuiPaginationItem-root": {
                                      color: "#fff", // Default text color for pagination items
                                      // backgroundColor: "#2D1E23",
                                      // "&:hover": {
                                      //   backgroundColor: "#453a1f",
                                      //   color: "#ffc630",
                                      // },
                                    },
                                    "& .Mui-selected": {
                                      backgroundColor: "#bd7f10 !important", // Background color for selected item
                                      color: "#000", // Text color for selected item
                                      "&:hover": {
                                        backgroundColor: "#bd7f10",
                                        color: "#000",
                                      },
                                    },
                                    "& .MuiPaginationItem-ellipsis": {
                                      color: "#fff", // Color for ellipsis
                                    },
                                    "& .MuiPaginationItem-icon": {
                                      color: "#fff", // Color for icon (if present)
                                    },
                                  }}
                                  // renderItem={(item) => (
                                  //   <PaginationItem
                                  //     slots={{
                                  //       previous: ArrowBackIcon,
                                  //       next: ArrowForwardIcon,
                                  //     }}
                                  //     {...item}
                                  //   />
                                  // )}
                                />
                              </Stack>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {/* ==========OREDERS HISTORY========== */}
                      <div
                        id="OrderHistory"
                        class={`${
                          historyactiveTab === "orderhistory"
                            ? "show active"
                            : ""
                        } tab-pane fade`}
                      >
                        <div className="table-responsive">
                          <table>
                            <thead>
                              <tr>
                                <th>{t("date")}</th>
                                <th>{t("pair")} </th>
                                <th>{t("Type")} </th>
                                <th>{t("price")} </th>
                                <th>{t("amount")} </th>
                                <th>{t("Fees")} </th>
                                <th>{t("total")} </th>
                              </tr>
                            </thead>

                            <tbody>
                              {tradeHistoryData.length > 0 ? (
                                tradeHistoryData.map((item, i) => {
                                  var datesHis = moment(item.created_at).format(
                                    "lll"
                                  );
                                  return (
                                    <tr>
                                      <td className="new_td_pad_y">
                                        {datesHis}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.pair}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.type}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.type == "buy" ? (
                                          <span className="text-green">
                                            {" "}
                                            {item.askPrice}{" "}
                                          </span>
                                        ) : (
                                          <span className="text-red">
                                            {" "}
                                            {item.askPrice}{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {" "}
                                        {item.askAmount}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.type == "buy" ? (
                                          <span className="text-green">
                                            {" "}
                                            {item.buy_fee}{" "}
                                            {/* {ptkstatus == 1
                                              ? "PTK"
                                              : item.base_currency} */}
                                            {item.fee_currency_buy}
                                          </span>
                                        ) : (
                                          <span className="text-red">
                                            {" "}
                                            {item.sell_fee}{" "}
                                            {/* {ptkstatus == 1
                                              ? "PTK"
                                              : item.quote_currency} */}
                                              {item.fee_currency_sell}
                                          </span>
                                        )}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.total}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  {" "}
                                  {!checkAuth ? (
                                    <td colSpan="6">
                                      <Button
                                        className="Butn_header my-4 d-block mx-auto"
                                        onClick={Movelogin}
                                      >
                                        <Link
                                          to="/login"
                                          className="text-black"
                                        >
                                          {t("Logintocontinue")}
                                        </Link>
                                      </Button>{" "}
                                    </td>
                                  ) : (
                                    <td colSpan="6" className="text-center">
                                      {" "}
                                      {t("NoordershistoryFound")}
                                    </td>
                                  )}{" "}
                                </tr>
                              )}
                            </tbody>
                          </table>

                          {tradeHistoryData && tradeHistoryData.length > 0 ? (
                            <div className="pagination mt-4">
                              <Stack spacing={2}>
                                <Pagination
                                  count={totalHist}
                                  page={currentPageHis}
                                  onChange={orderhistoryactive}
                                  size="small"
                                  sx={{
                                    "& .MuiPaginationItem-root": {
                                      color: "#fff", // Default text color for pagination items
                                      // backgroundColor: "#2D1E23",
                                      // "&:hover": {
                                      //   backgroundColor: "#453a1f",
                                      //   color: "#ffc630",
                                      // },
                                    },
                                    "& .Mui-selected": {
                                      backgroundColor: "#bd7f10 !important", // Background color for selected item
                                      color: "#000", // Text color for selected item
                                      "&:hover": {
                                        backgroundColor: "#bd7f10",
                                        color: "#000",
                                      },
                                    },
                                    "& .MuiPaginationItem-ellipsis": {
                                      color: "#fff", // Color for ellipsis
                                    },
                                    "& .MuiPaginationItem-icon": {
                                      color: "#fff", // Color for icon (if present)
                                    },
                                  }}
                                  // renderItem={(item) => (
                                  //   <PaginationItem
                                  //     slots={{
                                  //       previous: ArrowBackIcon,
                                  //       next: ArrowForwardIcon,
                                  //     }}
                                  //     {...item}
                                  //   />
                                  // )}
                                />
                              </Stack>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {/* ==========OREDERS Book========== */}
                      <div
                        id="OrderBook"
                        class={` ${
                          historyactiveTab === "cancelorder"
                            ? "show active"
                            : ""
                        } tab-pane fade`}
                      >
                        <div className="table-responsive">
                          <table>
                            <thead>
                              <tr>
                                <th>{t("date")}</th>
                                <th>{t("pair")} </th>
                                <th>{t("side")} </th>
                                <th>{t("Type")} </th>
                                <th>{t("price")} </th>
                                <th>{t("amount")} </th>
                                <th>{t("total")} </th>
                              </tr>
                            </thead>
                            <tbody>
                              {cancelOrders.length > 0 ? (
                                cancelOrders.map((item, i) => {
                                  var total =
                                    item.ordertype == "Stop"
                                      ? +item.filledAmount *
                                        +item.stoporderprice
                                      : +item.filledAmount * +item.price;
                                  return (
                                    <tr>
                                      <td className="new_td_pad_y">
                                        {item.createddate}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.pairName}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.tradeType == "buy" ? (
                                          <span className="text-green">
                                            {" "}
                                            {t("buy")}{" "}
                                          </span>
                                        ) : (
                                          <span className="text-red">
                                            {" "}
                                            Sell{" "}
                                          </span>
                                        )}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {item.ordertype}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        <span className="text-green">
                                          {item.ordertype == "Stop"
                                            ? parseFloat(
                                                item.stoporderprice
                                              ).toFixed(8)
                                            : parseFloat(item.price).toFixed(
                                                8
                                              )}{" "}
                                        </span>
                                      </td>
                                      <td className="new_td_pad_y">
                                        {" "}
                                        {item.amount}{" "}
                                      </td>
                                      <td className="new_td_pad_y">
                                        {/* {parseFloat(total).toFixed(pairDetails?.liq_price_decimal)} */}
                                        {parseFloat(total).toFixed(8)}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  {" "}
                                  {!checkAuth ? (
                                    <td colSpan="7">
                                      <Button
                                        className="Butn_header my-4 d-block mx-auto"
                                        onClick={Movelogin}
                                      >
                                        <Link
                                          to="/login"
                                          className="text-black"
                                        >
                                          {t("Logintocontinue")}
                                        </Link>
                                      </Button>{" "}
                                    </td>
                                  ) : (
                                    <td colSpan="7" className="text-center">
                                      {" "}
                                      {t("Nocancelordersfound")}!{" "}
                                    </td>
                                  )}
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {cancelOrders && cancelOrders.length > 0 ? (
                            <div className="pagination mt-4">
                              <Stack spacing={2}>
                                <Pagination
                                  count={totalcan}
                                  page={currentPagecan}
                                  onChange={cancelPageChange}
                                  size="small"
                                  sx={{
                                    "& .MuiPaginationItem-root": {
                                      color: "#fff", // Default text color for pagination items
                                      // backgroundColor: "#2D1E23",
                                      // "&:hover": {
                                      //   backgroundColor: "#453a1f",
                                      //   color: "#ffc630",
                                      // },
                                    },
                                    "& .Mui-selected": {
                                      backgroundColor: "#bd7f10 !important", // Background color for selected item
                                      color: "#000", // Text color for selected item
                                      "&:hover": {
                                        backgroundColor: "#bd7f10",
                                        color: "#000",
                                      },
                                    },
                                    "& .MuiPaginationItem-ellipsis": {
                                      color: "#fff", // Color for ellipsis
                                    },
                                    "& .MuiPaginationItem-icon": {
                                      color: "#fff", // Color for icon (if present)
                                    },
                                  }}
                                  // renderItem={(item) => (
                                  //   <PaginationItem
                                  //     slots={{
                                  //       previous: ArrowBackIcon,
                                  //       next: ArrowForwardIcon,
                                  //     }}
                                  //     {...item}
                                  //   />
                                  // )}
                                />
                              </Stack>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <PriceFooter /> */}
                  <div className="markert_activity">
                    <div class="css-13fs1br">
                      {t("TopMovers")}{" "}
                      <span>
                        <i class="fa-solid fa-angles-down"></i>
                      </span>{" "}
                    </div>

                    <ul class="nav nav-pills">
                      <li onClick={() => setmoves("all")}>
                        <a className={movesref.current == "all" ? "active" : ""}>
                          {t("all")}
                        </a>
                      </li>
                      <li onClick={() => setmoves("high")}>
                        <a className={movesref.current == "high" ? "active" : ""}>
                          {t("NewHigh")}
                        </a>
                      </li>
                      <li onClick={() => setmoves("low")}>
                        <a className={movesref.current == "low" ? "active" : ""}>
                          {t("NewLow")}
                        </a>
                      </li>
                    </ul>

                    {/* <div class="tab-content pair_details pading_tabs_content"> */}
                    <div class="tab-content pair_details">
                      <div
                        id="All"
                        class={`tab-pane new_chn_bugbor fade in ${
                          movesref.current == "all" ||
                          movesref.current == "high"
                            ? "active show"
                            : ""
                        } `}
                      >
                        {topmove ? (
                          topmove?.topMovers?.map((item, i) => {
                            return (
                              <Link
                                to=""
                                target="_blank"
                                className="css-14d05gv"
                              >
                                <div className="css-1pysja1">
                                  <div
                                    data-bn-type="text"
                                    className="css-qt6vj7"
                                  >
                                    <span
                                      data-bn-type="text"
                                      className="css-1iqe90x"
                                    >
                                      {item.pair}
                                    </span>
                                  </div>
                                  <div
                                    data-bn-type="text"
                                    className="css-21cgr0"
                                  >
                                    {moment(new Date()).format("lll")}
                                  </div>
                                </div>
                                <div className="css-m3c6zl">
                                  <div
                                    data-bn-type="text"
                                    className="css-4na7jw"
                                  >
                                    {item.change} %
                                  </div>
                                  <div
                                    data-bn-type="text"
                                    title="New 7day High"
                                    className="css-wk8c7j"
                                  >
                                    {t("Last24hrsHigh")}
                                  </div>
                                </div>
                                <div className="css-vjdxdv">
                                  <div className="css-ao5z3i">
                                    <img
                                      className="css-1qlplmi"
                                      src={require("../assets/greenarrow.png")}
                                      alt=""
                                    />
                                  </div>
                                </div>
                              </Link>
                            );
                          })
                        ) : (
                          <Link to="" target="_blank" class="css-14d05gv">
                            <div class="css-1pysja1">
                              <div data-bn-type="text" class="css-qt6vj7">
                                <span data-bn-type="text" class="css-1iqe90x">
                                  BTC
                                </span>
                                /USDT
                              </div>
                              <div data-bn-type="text" class="css-21cgr0">
                                15:42:01
                              </div>
                            </div>
                            <div class="css-m3c6zl">
                              <div data-bn-type="text" class="css-4na7jw">
                                +11.83%
                              </div>
                              <div
                                data-bn-type="text"
                                title="New 7day High"
                                class="css-wk8c7j"
                              >
                                {t("Last24hrsHigh")}
                              </div>
                            </div>
                            <div class="css-vjdxdv">
                              <div class="css-ao5z3i">
                                <img
                                  className="css-1qlplmi"
                                  src={require("../assets/greenarrow.png")}
                                  alt=""
                                />
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>

                    <div class="tab-content pair_details ">
                      <div
                        id="All"
                        class={`tab-pane new_chn_bugbor fade in ${
                          movesref.current == "low" ? "active show" : ""
                        } `}
                      >
                        {topmove ? (
                          topmove?.lowMovers
                            ?.slice()
                            .reverse()
                            .map((item, i) => {
                              return (
                                <Link
                                  to=""
                                  target="_blank"
                                  className="css-14d05gv"
                                  key={i}
                                >
                                  <div className="css-1pysja1">
                                    <div
                                      data-bn-type="text"
                                      className="css-qt6vj7"
                                    >
                                      <span
                                        data-bn-type="text"
                                        className="css-1iqe90x"
                                      >
                                        {item.pair}
                                      </span>
                                    </div>
                                    <div
                                      data-bn-type="text"
                                      className="css-21cgr0"
                                    >
                                      {moment(new Date()).format("lll")}
                                    </div>
                                  </div>
                                  <div className="css-m3c6zl">
                                    <div
                                      data-bn-type="text"
                                      className="css-4na7jw reds"
                                    >
                                      {item.change} %
                                    </div>
                                    <div
                                      data-bn-type="text"
                                      title="New 7day High"
                                      className="css-wk8c7j"
                                    >
                                      {t("Last24hrsHigh")}
                                    </div>
                                  </div>
                                  <div className="css-vjdxdv">
                                    <div className="css-ao5z3i">
                                      <div>
                                        <img
                                          className="css-1qlplmi"
                                          src={require("../assets/redarrow.png")}
                                          alt=""
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })
                        ) : (
                          <Link to="" target="_blank" class="css-14d05gv">
                            <div class="css-1pysja1">
                              <div data-bn-type="text" class="css-qt6vj7">
                                <span data-bn-type="text" class="css-1iqe90x">
                                  BTC
                                </span>
                                /USDT
                              </div>
                              <div data-bn-type="text" class="css-21cgr0">
                                15:42:01
                              </div>
                            </div>
                            <div class="css-m3c6zl">
                              <div data-bn-type="text" class="css-4na7jw reds">
                                +11.83%
                              </div>
                              <div
                                data-bn-type="text"
                                title="New 7day High"
                                class="css-wk8c7j"
                              >
                                {t("Last24hrsHigh")}
                              </div>
                            </div>
                            <div class="css-vjdxdv">
                              <div class="css-ao5z3i">
                                <div class="">
                                  <img
                                    className="css-1qlplmi"
                                    src={require("../assets/redarrow.png")}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
