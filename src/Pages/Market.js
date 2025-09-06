import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Side_bar from "./Side_bar";
import AssetListTable from "./AssetListTable";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import { socket } from "../context/socket";
import { useTranslation } from "react-i18next";

const Market = () => {
    const { t } = useTranslation();
  const [currencylistData, setcurrencylistData] = useState([]);
  const [currencyCount, setcurrencyCount] = useState(0);
  const [siteLoader, setSiteLoader] = useState(false);

  const [pairData, setPairData,pairDataref] = useState([]);
  const [marketPairs, setmarketPairs,marketPairsref] = useState([]);

  useEffect(() => {
    gethomeCurrency();
    socket.connect();
  }, []);

  const navtradepage = async (symbol) => {
    //window.location.href = `trade/${symbol}_USDT`;
    window.open(`trade/${symbol}_USDT`, "_blank");
  };

  // const gethomeCurrency = async () => {
  //   var data = {
  //     apiUrl: apiService.homeCurrency,
  //   };
  //   setSiteLoader(true);
  //   var resp = await getMethod(data);
  //   console.log(resp);
  //   setSiteLoader(false);

  //   if (resp.status) {
  //     setcurrencylistData(resp.Message);
  //   } else {
  //   }
  // };

  const gethomeCurrency = async () => {
    var data = {
      apiUrl: apiService.homeCurrency,
    };
    setSiteLoader(true);
    var resp = await getMethod(data);
    console.log(resp);
    if (resp.success) {
      setSiteLoader(false);
      setcurrencylistData(resp.data);
      socket.off("DashTickerPrice");
      socket.emit("GetTickerPrice_market", "getall");
      socket.on("DashTickerPrice_market", async (response) => {
        console.log("market tickers-----",response.data);
          let market_response = [];
          if (response.data.length > 0) {
            setPairData(response.data);
            let currencyData = resp.data;
            if(currencyData.length > 0)
            {
              //console.log("call currency",currencyData.length)
              if(pairDataref.current.length > 0)
              {
                for(let pair of pairDataref.current)
                {
                  console.log("call pair",pair)
                  let baseAsset = pair.pair.split("_")[0];
                  let quoteAsset = pair.pair.split("_")[1];
                 // console.log("baseAsset",baseAsset)
                  let currency_match = currencyData.filter(resp => resp.currencySymbol == baseAsset);
                  //console.log("currency_match",currency_match)
                  if(currency_match.length > 0)
                  {
                    let obj = {
                      price: pair.lastprice.lastprice,
                      volume: pair.volume,
                      change_percent: pair.change_percent,
                      currency_image: currency_match[0].Currency_image,
                      currencyName: currency_match[0].currencyName,
                      pair: pair.pair,
                      baseAsset: baseAsset,
                      quoteAsset: quoteAsset
                    }
                    market_response.push(obj);
                  }
                }
                 console.log("market_response",market_response);
                setmarketPairs(market_response);
              }
            }
            
          }
      });
      
    } else {
    }
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
            color="#bd7f10"
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
              {/* <div className="col-lg-2">
              <Side_bar />
            </div> */}

              <div className="col-lg-12">
                <section className="identification_section">
                  <div className="row mar-left-30">
                    <div className="buy_head">
                      <div className="buy-rewards">
                        <span className="reward-title">{t('market')}</span>
                      </div>
                      <ul className="history-lists mt-4">
                        <Link className="history-links active">{t('spot')}</Link>
                      </ul>

                      <div className="market-token-wrapper">
                        <h5>{t('topTokensby')}</h5>
                        <p>
                          {t('getacomprehensive')}
                        </p>
                        {/* <button className="market-show-btn">
                        Show More{" "}
                        <span className="market-down">
                          <i class="fa-solid fa-angle-down"></i>
                        </span>
                      </button> */}
                      </div>
                      <div className="table-responsive table-cont">
                        <table className="table">
                          <thead>
                            <tr className="stake-head-newchang">
                              <th>{t('name')}</th>
                              <th className="opt-nowrap pad-left-23">
                                {" "}
                                {t('price')} (USD)
                              </th>
                              <th className="opt-btn-flex table-action market_trade_new">
                                {" "}
                                <span>{t('trade')}</span>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {/* {currencylistData && currencylistData.length > 0 ? (
                              currencylistData.map((obj, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="table-flex">
                                      <img src={obj.Currency_image} alt="" />
                                      <div className="market_curr">
                                        <h4 className="opt-name font_14 left-5">
                                          {obj.currencyName}
                                        </h4>
                                        <h3 className="opt-sub font_14">
                                          {" "}
                                          {obj.currencySymbol}
                                        </h3>
                                      </div>
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23">
                                      {obj.marketprice <= 0 ? (
                                        <td className="text-danger">
                                          {obj.currencySymbol == "SHIB" ? (
                                            <span className="">
                                              {parseFloat(
                                                obj.estimatedValueInUSDT
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="">
                                              {parseFloat(
                                                obj.estimatedValueInUSDT
                                              ).toFixed(2)}
                                            </span>
                                          )}
                                        </td>
                                      ) : (
                                        <td className="text-success">
                                          {obj.currencySymbol == "SHIB" ? (
                                            <span className="">
                                              {parseFloat(
                                                obj.estimatedValueInUSDT
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="">
                                              {parseFloat(
                                                obj.estimatedValueInUSDT
                                              ).toFixed(2)}
                                            </span>
                                          )}
                                        </td>
                                      )}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-green">
                                      <span
                                        className="deposit_top_button"
                                        onClick={() =>
                                          navtradepage(obj.currencySymbol)
                                        }
                                      >
                                        <button className="action_btn">
                                          Trade
                                        </button>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                      />
                                    </div>
                                    <div className="no_records_text">
                                      No Records Found
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )} */}

                          {marketPairsref.current && marketPairsref.current.length > 0 ? (
                              marketPairsref.current.map((obj, i) => {
                                
                                return (
                                  obj.quoteAsset == "USDT" ? (
                                  <tr key={i}>
                                    <td className="table-flex">
                                      <img src={obj.currency_image} alt="" />
                                      <div className="market_curr">
                                        <h4 className="opt-name font_14 left-5">
                                          {obj.currencyName}
                                        </h4>
                                        <h3 className="opt-sub font_14">
                                          {" "}
                                          {obj.baseAsset}
                                        </h3>
                                      </div>
                                    </td>

                                    <td className="opt-percent font_14 table_center_text pad-left-23">
                                      {obj.change_percent < 0 ? (
                                        <td className="text-danger">
                                          {obj.baseAsset == "SHIB" ? (
                                            <span className="">
                                              {parseFloat(
                                                obj.price
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="">
                                              {parseFloat(
                                                obj.price
                                              ).toFixed(2)}
                                            </span>
                                          )}
                                        </td>
                                      ) : (
                                        <td className="text-success">
                                          {obj.baseAsset == "SHIB" ? (
                                            <span className="">
                                              {parseFloat(
                                                obj.price
                                              ).toFixed(8)}
                                            </span>
                                          ) : (
                                            <span className="">
                                              {parseFloat(
                                                obj.price
                                              ).toFixed(2)}
                                            </span>
                                          )}
                                        </td>
                                      )}
                                    </td>
                                    <td className="opt-btn-flex table-action pad-left-23 text-green">
                                      <span
                                        className="deposit_top_button"
                                        onClick={() =>
                                          navtradepage(obj.baseAsset)
                                        }
                                      >
                                        <button className="action_btn">
                                          Trade
                                        </button>
                                        {/* Trade */}
                                      </span>
                                    </td>
                                  </tr>
                                  ) : ("")
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={3} className="text-center py-5">
                                  <div className="empty_data">
                                    <div className="empty_data_img">
                                      <img
                                        src={require("../assets/No-data.webp")}
                                        width="100px"
                                      />
                                    </div>
                                    <div className="no_records_text">
                                      {t('noRecordsFound')}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
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

export default Market;
