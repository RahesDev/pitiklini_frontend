import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PhoneInput from "react-phone-input-2";
import { Dropdown } from "semantic-ui-react";
import "react-phone-input-2/lib/style.css";
import Side_bar from "./Side_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import HistoryListTable from "./HistoryListTable";
import ICON from "../assets/deposit-imp.png";
import WARNICON from "../assets/icons/withdraw-warn.webp";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCrypto, setallCrypto, allCryptoref] = useState([]);
  const [currency, setcurrency, currencyref] = useState("USDT");
  const [cointype, setcointype, cointyperef] = useState("");
  const [address, setAddress, addressref] = useState();
  const [view, setview, viewref] = useState("");
  const [bankwire, setBankwire] = useState("");
  const [depositHistory, setdepositHistory] = useState([]);
  const [kycStatus, setkycStatus, kycStatusref] = useState(1);
  const [cur_currency, setcur_currency, cur_currencyref] = useState("");
  const [network_currency, setcur_network, network_currencyref] = useState([]);
  const [network_default, setnet_default, net_defaultref] = useState("");
  const [Fullname, Setfullname, Fullnameref] = useState("Tether");
  const [Image, setImage, Imageref] = useState("");
  const [Networks, setNetworks, Networksref] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [refreshStatus, setrefreshStatus] = useState(false);
  const [historyLoader, setHistoryLoader] = useState(false);
  const [siteData, setSiteData] = useState("");
  // const [siteStatus, setSiteStatus] = useState("Deactive");
  const [siteStatus, setSiteStatus] = useState("Active");
  const [Loader, setLoader] = useState(false);
  // usePageLeaveConfirm();
   usePageLeaveConfirm("Are you sure you want to leave Deposit?", "/deposit",true,[]);

  useEffect(() => {
    // getSitedata();
    getAllcurrency();
    getKYCstatus();
    getdepositHistory();
    getTransaction();
  }, [0]);

  console.log(
    addressref.current,
    "--=-=-addressref=-=-=addressref=-=-=-=-addressref"
  );

  const getSitedata = async () => {
    try {
      var data = {
        apiUrl: apiService.getSitedata,
      };
      // setSiteLoader(true);
      var resp = await getMethod(data);
      setLoader(true);
      if (resp.status == true) {
        setSiteData(resp.data);
        setSiteStatus(resp.data.depositStatus);
        // setSiteStatus(resp.data.siteStatus);
        setLoader(false);
      }
    } catch (error) {}
  };

  const [refreshLoader, setrefreshLoader] = useState(false);
  const getTransaction = async () => {
    var data = {
      apiUrl: apiService.transaction,
    };
    // setSiteLoader(true)

    var resp = await getMethod(data);
    // setSiteLoader(false)
    setrefreshStatus(false);

    if (resp.message == true) {
      getdepositHistory();
    }
  };

  const getTransaction2 = async () => {
    getTransaction();
    setrefreshLoader(true);
    setHistoryLoader(true);
    // getdepositHistory();
    // var data = {
    //   apiUrl: apiService.transaction,
    // };
    // var resp = await getMethod(data);
    const timer = setTimeout(() => {
      getdepositHistory();
      // getTransaction();
      // setrefreshLoader(false);
      // setHistoryLoader(false);
    }, 20000);

    // setrefreshLoader(false);
    // if (resp.message == true) {
    //   getdepositHistory();
    //   getTransaction();
    // }
    // return () => clearTimeout(timer);
  };

  const [Balance, setBalance, Balanceref] = useState(0);
  const get_balance = async (data, data2) => {
    console.log(data, data2, ",data");
    var obj = {
      currency: data,
      currId: data2,
    };

    var data = {
      apiUrl: apiService.user_balance,
      payload: obj,
    };

    var resp = await postMethod(data);
    if (resp.status) {
      setBalance(resp.data.balance);
    } else {
    }
  };

  const getAllcurrency = async () => {
    var data = {
      apiUrl: apiService.walletcurrency,
    };
    // setSiteLoader(true);
    var resp = await getMethod(data);
    // setSiteLoader(false);

    if (resp) {
      var currArrayCrypto = [];
      var data = resp.data;
      setallCrypto(data);
      console.log(allCryptoref.current, "allcrypto");
      for (var i = 0; i < data.length; i++) {
        if (data[i].depositStatus == "Active") {
          var obj = {
            value: data[i]._id,
            key: data[i]._id,
            text: data[i].currencySymbol,
            image: { avatar: true, src: data[i].Currency_image },
            label: data[i].currencySymbol,
            erc20token: data[i].erc20token,
            bep20token: data[i].bep20token,
            trc20token: data[i].trc20token,
            rptc20token: data[i].rptc20token,
            coinType: data[i].coinType,
            currencyName: data[i].currencyName,
            imgurl: data[i].Currency_image,
          };
          currArrayCrypto.push(obj);
        }
      }
      console.log("network_currencyref===", currArrayCrypto[0]);
      setallCurrency(currArrayCrypto);
      setcurrency(currArrayCrypto[0].label);
      Setfullname(currArrayCrypto[0].currencyName);
      setImage(currArrayCrypto[0].imgurl);
      setcointype(currArrayCrypto[0].coinType);
      // if (currArrayCrypto[0].coinType == "1") {
      //   onSelect(currArrayCrypto[0]);
      // }
    }
  };

  const getKYCstatus = async () => {
    var data = {
      apiUrl: apiService.getKYCStatus,
    };
    setSiteLoader(true);
    var getKYC = await getMethod(data);
    

    console.log("getkyrefreshc===", getKYC);

    if (getKYC.status) {
      console.log(getKYC.Message.kycstatus, "========");
     
      setkycStatus(getKYC.Message.kycstatus);

    setTimeout(() => {
      setSiteLoader(false);
    }, 2000);
      
    } else {
      // setkycStatus(0);
    }
  };

  const getdepositHistory = async () => {
    var obj = {
      apiUrl: apiService.deposit_history,
      payload: { FilPerpage: 5, FilPage: 1 },
    };
    // setHistoryLoader(true);
    var deposit_history_list = await postMethod(obj);
    // setHistoryLoader(false);
    if (deposit_history_list) {
      setrefreshLoader(false);
      setdepositHistory(deposit_history_list.crypto_deposit);
      setHistoryLoader(false);
    }
  };

  const onSelect = async (e, option) => {
    console.log(option, "-=-onSelecttop");

    const selectedData = setcur_network([]);
    setnet_default("");
    setcurrency(option.label);
    Setfullname(option.currencyName);
    setImage(option.imgurl);
    setcointype(option.coinType);
    let indexData = allCryptoref.current.findIndex(
      (x) => x._id == option.value
    );
    if (indexData != -1) {
      var currencydata = allCryptoref.current[indexData];
      console.log("currencydata===", currencydata);
      setcur_currency(currencydata);

      var network_cur = {};
      var network_names = [];
      if (currencydata.currencyType == "2") {
        if (currencydata.erc20token == "1") {
          network_cur = {
            value: "erc20token",
            label: "ERC20",
            text: "ERC20",
          };
          network_names.push(network_cur);
        }
        if (currencydata.bep20token == "1") {
          network_cur = {
            value: "bep20token",
            label: "BEP20",
            text: "BEP20",
            // image: {
            //   avatar: true,
            //   src: "https://res.cloudinary.com/taikonz-com/image/upload/v1664014615/fd2vqjmjipjxvzt6g2re.png",
            // },
          };
          network_names.push(network_cur);
        }
        if (currencydata.trc20token == "1") {
          network_cur = {
            value: "trc20token",
            label: "TRC20",
            text: "TRC20",
          };
          network_names.push(network_cur);
        }
        setcur_network(network_names);
        console.log("network_currencyref===", network_currencyref.current);
        setnet_default(network_currencyref.current[0].label);
      }
      get_balance(currencydata.currencySymbol, option.value);

      if (currencydata.coinType == "1" && currencydata.currencyType == "1") {
        console.log(currencydata, "=-=--=currencydata=--", currencydata.label);

        var obj = {
          currencySymbol: currencydata.currencySymbol,
          currId: option.value,
          network: "",
        };
        var data = {
          apiUrl: apiService.generateAddress,
          payload: obj,
        };
        setview("load");
        var resp = await postMethod(data);
        console.log(resp, "=-=-=resp-=-=--");
        if (resp.status) {
          setview("view");
          setAddress(resp.data);
          console.log(
            addressref.current,
            "--=-=-addressref=-=-=addressref=-=-=-=-addressref"
          );
        } else {
          //toast.error("Something went wrong, please try again latersv");
        }
      } else {
        var obj = {
          currency: option.label,
        };
        var data = {
          apiUrl: apiService.bankwire,
          payload: obj,
        };

        var resp = await postMethod(data);
        console.log(resp, "=-=-=fiat deposit resp-=-=--");
        if (resp.status) {
          setBankwire(resp.data);
        } else {
          //toast.error("Something went wrong, please try again later");
        }
      }
    }
    //}
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Address copied");
  };

  const onSelect_network = async (e, option) => {
    setNetworks(option.label);
    console.log(option, "-=-onSelect_network");
    if (
      cur_currencyref.current.coinType == "1" &&
      cur_currencyref.current.currencyType == "2"
    ) {
      var obj = {
        currencySymbol: cur_currencyref.current.currencySymbol,
        currId: cur_currencyref.current._id,
        network: option.value,
      };
      console.log("call here 1111", obj);
      var data = {
        apiUrl: apiService.generateAddress,
        payload: obj,
      };
      setview("load");
      var resp = await postMethod(data);
      console.log(resp, "=-=-=resp-=-=--");
      if (resp.status) {
        setview("view");
        setAddress(resp.data);
      } else {
        //toast.error("Something went wrong, please try again later");
      }
    }
  };

  return (
    <>
      <section>
        <Header />
      </section>

      {siteLoader == true && Loader == true ? (
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 padin_lefrig_dash">
                <section className="asset_section">
                  {siteStatus == "Active" ? (
                    <>
                      {kycStatusref.current == 1 ? (
                        <>
                          <div className="row">
                            <div className="p2p_title">{t("deposit")} </div>

                            <div className="col-lg-7">
                              <div className="balance mt-5 px-1 mb-1">
                                {" "}
                                <span>
                                  <b>{t("balance")}</b> :{" "}
                                  {Balanceref.current.toFixed(8)}
                                </span>
                              </div>
                              <div className="deposit">
                                <div className="form_div">
                                  <div className="sides">
                                    <div className="w-100 rights">
                                      <h6>{t("selectacoin")}</h6>
                                      <Dropdown
                                        placeholder={t("selectCoin")}
                                        fluid
                                        className="dep-drops"
                                        selection
                                        options={allCurrencyref.current}
                                        defaultValue={allCurrencyref.current[0]}
                                        onChange={onSelect}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {cur_currencyref.current.currencyType == "2" ? (
                                  <div className="form_div ">
                                    <h6>{t("network")}</h6>
                                    <Dropdown
                                      placeholder={t("network")}
                                      fluid
                                      className="dep-drops"
                                      selection
                                      options={network_currencyref.current}
                                      defaultValue={
                                        network_currencyref.current[0]
                                      }
                                      onChange={onSelect_network}
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}

                                {addressref.current == undefined ? (
                                  ""
                                ) : (
                                  <>
                                    <div className="form_div boder-none ">
                                      <h6>{t("networkAddress")}</h6>
                                      <div className="qr-wrapper">
                                        <img
                                          src={
                                            addressref.current == undefined
                                              ? ""
                                              : addressref.current.qrcode
                                          }
                                          className="d-block mx-auto dep-qr"
                                          alt=""
                                        />
                                        <p className="mt-4">
                                          {t("scantheQRcode")}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="form_div boder-none">
                                      <div className="add_box">
                                        <h6 className="address">
                                          {addressref.current == undefined
                                            ? ""
                                            : addressref.current.address}
                                        </h6>
                                        <i
                                          className="ri-file-copy-line text-yellow cursor-pointer"
                                          onClick={() =>
                                            copy(addressref.current.address)
                                          }
                                        ></i>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-5">
                              <div>
                                <div className="container-lg">
                                  <div className="deposit-imp-notes mt-5">
                                    <div className="imp-notes-title">
                                      <span>
                                        <img
                                          src={ICON}
                                          alt="warn-icon"
                                          className="deposit-imp-icon"
                                        />
                                      </span>
                                      <p>{t("importantNotes")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("doublecheck")}</h6>
                                      <p>{t("ensurethedeposit")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("verifydepositamount")}</h6>
                                      <p>{t("confirmthedeposit")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("security")}</h6>
                                      <p>{t("makesureyouraccount")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("networkcompatibility")}</h6>
                                      <p>{t("ensureyouaredepositing")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="dashboard_table">
                            <div className="staking-flex dash_assets">
                              <div className="Recent_new_add">
                                <h5 className="opt-title">
                                  {t("recentDeposit")}
                                </h5>
                                {refreshLoader == true ? (
                                  <i className="fa-solid fa-arrows-rotate fa-spin-pulse mt-1"></i>
                                ) : (
                                  <i
                                    className="fa-solid fa-arrows-rotate mt-1"
                                    onClick={getTransaction2}
                                  ></i>
                                )}
                              </div>
                              <Link to="/depositHistory">
                                <div className="d-flex gap-2 text-yellow">
                                  {t("viewAll")}{" "}
                                  <i class="fa-solid fa-chevron-right"></i>
                                </div>
                              </Link>
                            </div>

                            <div className="table-responsive table-cont">
                              <table className="table">
                                <thead>
                                  <tr className="stake-head">
                                    <th>{t("currency")}</th>
                                    <th className="opt-nowrap txt-center pad-left-23">
                                      {t("amount")}
                                    </th>
                                    <th className="opt-nowrap txt-center pad-left-23">
                                      {t("transactionId")}
                                    </th>
                                    <th className="opt-nowrap txt-center pad-left-23">
                                      {t("dateTime")}
                                    </th>
                                    <th className="opt-btn-flex table-action text-center">
                                      {t("status")}
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {historyLoader == false ? (
                                    <>
                                      {depositHistory &&
                                      depositHistory.length > 0 ? (
                                        depositHistory
                                          .slice(0, 5)
                                          .map((item, i) => {
                                            return (
                                              <tr>
                                                <td className="opt-percent font_14 pad-left-23">
                                                  {item.currencySymbol}
                                                </td>
                                                <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                                  {parseFloat(
                                                    item.amount
                                                  ).toFixed(4)}
                                                </td>
                                                <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                                  {item.txnid.substring(0, 10)}{" "}
                                                  ...{" "}
                                                  <i
                                                    class="ri-file-copy-line text-yellow"
                                                    onClick={() =>
                                                      copy(item.txnid)
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  ></i>
                                                </td>
                                                <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                                  {Moment(item.date).format(
                                                    "lll"
                                                  )}
                                                </td>
                                                <td className="opt-btn-flex table-action pad-left-23 text-green text-center">
                                                  {t("completed")}
                                                </td>
                                              </tr>
                                            );
                                          })
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={5}
                                            className="text-center py-5"
                                          >
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
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <tr>
                                        <td
                                          colSpan={5}
                                          className="text-center py-5"
                                        >
                                          <div className="empty_data">
                                            <div className="loadercss_deporefresh">
                                              <Bars
                                                height="40"
                                                width="40"
                                                color="#bd7f10"
                                                ariaLabel="bars-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                                visible={true}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="row ">
                            <div className="p2p_title">{t("deposit")} </div>

                            <div className="col-lg-7">
                              <div className="deposit mt-5 h-100">
                                <div className="dep-kyc">
                                  <div className="dep-kyc-head">
                                    <img
                                      src={ICON}
                                      alt="warn-icon"
                                      className="deposit-imp-icon"
                                    />
                                    <h6>{t("KYCVerificationRequired")}</h6>
                                  </div>
                                  <p>{t("completedtheKYCverification")}</p>
                                  <div>
                                    <img
                                      src={require("../assets/BeforeKyc.webp")}
                                      alt="Verify kyc"
                                      className="before_kyc_depo withdraw-p-l-24"
                                    />
                                  </div>
                                  <p className="mt-4">
                                    {t("verifyyouraccount")}
                                  </p>
                                  <div className="withdraw-p-l-24">
                                    <Link to="/kyc">
                                      <button className="action_btn w-100 mb-2">
                                        {t("verify_now")}
                                      </button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-5">
                              <div>
                                <div className="container-lg">
                                  <div className="deposit-imp-notes mt-5">
                                    <div className="imp-notes-title">
                                      <span>
                                        <img
                                          src={ICON}
                                          alt="warn-icon"
                                          className="deposit-imp-icon"
                                        />
                                      </span>
                                      <p>{t("importantNotes")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("doublecheck")}</h6>
                                      <p>{t("ensurethedepositaddress")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("verifydepositamount")}</h6>
                                      <p>{t("confirthedeposit")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("security")}</h6>
                                      <p>{t("makesureyouraccount")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("networkcompatibility")}</h6>
                                      <p>{t("ensureyouaredepositing")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="row ">
                      <div className="p2p_title">{t("deposit")}</div>
                      <div className="col-lg-7">
                        <div className="deposit mt-5 h-100">
                          <div className="dep-kyc">
                            <div className="dep-kyc-head">
                              <img
                                src={WARNICON}
                                alt="warn-icon"
                                className="deposit-imp-icon"
                              />
                              <h6>{t("depositTemporarilyUnavailable")}</h6>
                            </div>
                            {/* <p>
                           Due to ongoing platform maintenance, deposit are currently restricted. We apologize for any inconvenience this may cause. Our team is working diligently to restore full service as soon as possible.
                          </p> */}
                            <p>{siteData.depositMaintenance}</p>
                            <p className="my-3">
                              {t("estimatedTimetoResolution")}{" "}
                              <span className="text-yellow">00:00:00</span>
                            </p>
                            <div>
                              <img
                                src={require("../assets/withdraw-depo-unavail.webp")}
                                alt="Verify kyc"
                                className="before_kyc_depo withdraw-p-l-24"
                              />
                            </div>
                            <p className="mt-4">
                              {t("thankyouforyourpatienceandunderstanding")}
                            </p>
                            <div className="withdraw-p-l-24">
                              <Link to="/dashboard">
                                <button className="action_btn w-100 mb-2">
                                  {t("backToHome")}
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-5">
                        <div>
                          <div className="container-lg">
                            <div className="deposit-imp-notes mt-5">
                              <div className="imp-notes-title">
                                <span>
                                  <img
                                    src={ICON}
                                    alt="warn-icon"
                                    className="deposit-imp-icon"
                                  />
                                </span>
                                <p>{t("importantNotes")}</p>
                              </div>
                              <div className="imp-notes-content">
                                <h6>{t("doublecheckthedestinationaddress")}</h6>
                                <p>{t("makesuretheaddress")}</p>
                              </div>
                              <div className="imp-notes-content">
                                <h6>{t("verifywithdrawaldetails")}</h6>
                                <p>{t("confirmtheamount")}</p>
                              </div>
                              <div className="imp-notes-content">
                                <h6>{t("security")}</h6>
                                <p>{t("ensurethatyouraccount")}</p>
                              </div>
                              <div className="imp-notes-content">
                                <h6>{t("networkverification")}</h6>
                                <p>{t("doublecheckyournetwork")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Dashboard;

