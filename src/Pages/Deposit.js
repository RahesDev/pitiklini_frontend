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
import VerticalStepper from "./VerticalStepper";
import DashboardLayout from "./DashboardLayout";

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
  /** Stepper UI: step 3 stays grey until both are true (network N/A ⇒ set true with crypto). */
  const [selectedCrypto, setSelectedCrypto, selectedCryptoref] = useState(false);
  const [selectedNetwork, setSelectedNetwork, selectedNetworkref] = useState(false);
  const [siteLoader, setSiteLoader] = useState(false);
  const [refreshStatus, setrefreshStatus] = useState(false);
  const [historyLoader, setHistoryLoader] = useState(false);
  const [siteData, setSiteData] = useState("");
  // const [siteStatus, setSiteStatus] = useState("Deactive");
  const [siteStatus, setSiteStatus] = useState("Active");
  const [Loader, setLoader] = useState(false);
  // usePageLeaveConfirm();
  // usePageLeaveConfirm(
  //   "Are you sure you want to leave Deposit?",
  //   "/deposit",
  //   true,
  //   [],
  // );

  useEffect(() => {
    // getSitedata();
    getAllcurrency();
    getKYCstatus();
    getdepositHistory();
    getTransaction();
  }, [0]);

  console.log(
    addressref.current,
    "--=-=-addressref=-=-=addressref=-=-=-=-addressref",
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
            content: (
              <span className="inline-block align-middle ml-1">
                <span className="font-bold text-white text-[15px]">
                  {data[i].currencySymbol}
                </span>
                <span className="text-[#848E9C] font-normal text-[14px] ml-2">
                  {data[i].currencyName}
                </span>
              </span>
            ),
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
    setSelectedCrypto(true);
    setcurrency(option.label);
    Setfullname(option.currencyName);
    setImage(option.imgurl);
    setcointype(option.coinType);
    let indexData = allCryptoref.current.findIndex(
      (x) => x._id == option.value,
    );
    if (indexData != -1) {
      var currencydata = allCryptoref.current[indexData];
      console.log("currencydata===", currencydata);
      setcur_currency(currencydata);

      if (currencydata.currencyType == "2") {
        setSelectedNetwork(false);
      } else {
        setSelectedNetwork(true);
      }

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
            "--=-=-addressref=-=-=addressref=-=-=-=-addressref",
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
    setSelectedNetwork(true);
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

  /** Stepper: step 3 active only when selectedCrypto && selectedNetwork (network auto-satisfied when currencyType !== "2"). */
  const needsNetwork = cur_currency && String(cur_currency.currencyType) === "2";
  const depositCurrentStep = !selectedCrypto
    ? 1
    : needsNetwork && !selectedNetwork
      ? 2
      : 3;
  const depositSteps = [
    {
      key: "select-crypto",
      title: t("Select Crypto"),
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm-2 5v5a2 2 0 002 2h12a2 2 0 002-2V9H2zm2 3h2v2H4v-2z" />
        </svg>
      ),
      content: (
        <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom max-w-xl">
          <Dropdown
            placeholder={t("selectCoin")}
            fluid
            className="dep-drops w-full bg-transparent text-white border-0"
            selection
            options={allCurrencyref.current}
            defaultValue={allCurrencyref.current[0]}
            onChange={onSelect}
          />
        </div>
      ),
    },
    {
      key: "select-network",
      title: t("Select Network"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      content: cur_currencyref.current?.currencyType == "2" ? (
        <div className="max-w-xl mt-6">
          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom">
            <Dropdown
              placeholder={t("Select Network you want to deposit through")}
              fluid
              className="dep-drops w-full bg-transparent text-white border-0"
              selection
              options={network_currencyref.current}
              defaultValue={network_currencyref.current[0]}
              onChange={onSelect_network}
            />
          </div>
          {Networks && (
            <div className="text-[#848E9C] text-[13px] mt-4 flex items-center gap-1">
              <span>{t("Expected Arrival")}:</span>
              <span className="text-[#848E9C]">{t("2min 50sec")} </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-500 text-sm mt-4">{t("Network selection is not available for this currency.")}</div>
      ),
    },
    {
      key: "copy-wallet-address",
      title: t("Copy Wallet Address"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      content: addressref.current == undefined ? (
        <div className="text-gray-500 text-sm mt-4">{t("Select a coin and network above to generate an address.")}</div>
      ) : (
        <div className="max-w-[45rem] mt-4 relative z-10">
          <div className="bg-[#14151a] border border-[#2b3139] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">
            <div className="flex-1 w-full order-2 md:order-1 mt-2 md:mt-0 z-10">
              <h4 className="text-[#f0b90b] text-[15px] font-medium mb-4">
                {Fullname ? `${Fullname}` : `${currency}`}{Networks ? `(${Networks})` : ""} {t("address is published!")}
              </h4>
              <p className="text-[#848E9C] text-[13px] leading-relaxed mb-6 max-w-[28rem]">
                {t("Please use the address below to deposit your cryptocurrency using the")} {Networks ? Networks : currency} {t("network. You can either copy the address or scan the QR code for convenience.")}
              </p>

              <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-[7px] pl-3 flex justify-between items-center transition-colors">
                <div className="truncate pr-4 text-[#D8DDE5] text-[13px]">
                  {addressref.current.address}
                </div>
                <button
                  className="bg-[#f0b90b] hover:bg-[#d8a60a] text-[#181a20] rounded-[4px] px-4 py-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors shrink-0"
                  onClick={() => copy(addressref.current.address)}
                  title="Copy Address"
                >
                  <i className="ri-file-copy-line text-[14px]"></i>
                  {t("copy")}
                </button>
              </div>
            </div>

            <div className="bg-white p-2 rounded-[4px] shrink-0 order-1 md:order-2 z-10 self-start md:mt-1">
              <img
                src={addressref.current.qrcode}
                className="w-[110px] h-[110px] object-contain"
                alt="QR Code"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardLayout>
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
          <section className="asset_section">
            <div className="buy_head">
              {siteStatus == "Active" ? (
                <>
                  {kycStatusref.current == 1 ? (
                    <>
                      <div className="w-full bg-black p-4 sm:p-6 text-white rounded-xl shadow-lg">
                        {/* Steps Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                          <div className="bg-black border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary text-black px-2 py-0.5 rounded text-sm font-bold">
                                1
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Copy the wallet address")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Select crypto, network & copy address.")}
                            </p>
                          </div>
                          <div className="bg-black border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-black rounded text-sm font-bold">
                                2
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Confirm Address")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Paste address on other exchange.")}
                            </p>
                          </div>
                          <div className="bg-black border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-black rounded text-sm font-bold">
                                3
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Transfer Confirmation")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Await blockchain confirmation for transfer.")}
                            </p>
                          </div>
                          <div className="bg-black border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-black rounded text-sm font-bold">
                                4
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Successful Deposit")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Pitikulini will send assets to wallet.")}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-10">
                          <div className="flex-[2]">
                            {/* <div className="relative pl-8 sm:pl-10 border-l-[1px] border-[#8c6b16] ml-4 space-y-12 pb-8">
                              
                              <div className="relative">
                                <div className="absolute -left-[53px] sm:-left-[61px] top-0 bg-primary p-[6px] rounded-md z-10">
                                  <svg
                                    className="w-5 h-5 text-black"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm-2 5v5a2 2 0 002 2h12a2 2 0 002-2V9H2zm2 3h2v2H4v-2z"></path>
                                  </svg>
                                </div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Select Crypto")}
                                </h3>

                                <div className="bg-black border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom max-w-xl">
                                  <Dropdown
                                    placeholder={t("selectCoin")}
                                    fluid
                                    className="dep-drops w-full bg-transparent text-white border-0"
                                    selection
                                    options={allCurrencyref.current}
                                    defaultValue={allCurrencyref.current[0]}
                                    onChange={onSelect}
                                  />
                                </div>
                              </div>
                            </div> */}

                            <div className="flex flex-col lg:flex-row gap-10">
                              {/* <div className="flex-[2]"> */}
                              <div className="rounded-2xl bg-black p-4 border border-gray shadow-xl w-7/12  sm:p-5">
                                <VerticalStepper
                                  steps={depositSteps}
                                  currentStep={depositCurrentStep}
                                  className="ml-0 pb-2"
                                />
                              </div>
                              <div className="rounded-2xl bg-black p-4 border border-gray shadow-xl w-5/12 sm:p-5">
                                <div className="mb-10">
                                  <div className="flex items-center gap-2 mb-6">
                                    <h3 className="text-primary font-medium flex items-center gap-2 mb-6 text-lg">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        ></path>
                                      </svg>
                                      Tips
                                    </h3>{" "}
                                  </div>
                                  <div className="space-y-6 text-[13px] text-[#A0AEC0] border-t border-gray-800 pt-6">
                                    <p className="leading-relaxed">
                                      {t(
                                        "For the safety of your funds, our customer support team may contact you by phone to confirm your withdrawal",
                                      )}
                                    </p>
                                    <p className="leading-relaxed">
                                      {t(
                                        "For the safety of your funds, our customer support team may contact you by phone to confirm your withdrawal",
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-12">
                                  <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-primary font-medium flex items-center gap-2 text-lg">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                      </svg>
                                      FAQs
                                    </h3>
                                    <Link
                                      to="/faq"
                                      className="text-gray-400 text-[13px] flex items-center hover:text-white transition-colors"
                                    >
                                      {t("View more")}
                                      <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5l7 7-7 7"
                                        ></path>
                                      </svg>
                                    </Link>
                                  </div>
                                  <div className="space-y-5 border-t border-gray-800 pt-6">
                                    <Link
                                      to="/faq"
                                      className="flex items-start gap-4 text-[14px] text-[#A0AEC0] hover:text-white transition-colors group"
                                    >
                                      <svg
                                        className="w-5 h-5 mt-0.5 text-gray-500 group-hover:text-gray-300 shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20z"
                                        ></path>
                                      </svg>
                                      <span>
                                        {t("How to deposit on FalconX?")}
                                      </span>
                                    </Link>
                                    <Link
                                      to="/faq"
                                      className="flex items-start gap-4 text-[14px] text-[#A0AEC0] hover:text-white transition-colors group"
                                    >
                                      <svg
                                        className="w-5 h-5 mt-0.5 text-gray-500 group-hover:text-gray-300 shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20z"
                                        ></path>
                                      </svg>
                                      <span>
                                        {t("What is a crypto network?")}
                                      </span>
                                    </Link>
                                    <Link
                                      to="/faq"
                                      className="flex items-start gap-4 text-[14px] text-[#A0AEC0] hover:text-white transition-colors group"
                                    >
                                      <svg
                                        className="w-5 h-5 mt-0.5 text-gray-500 group-hover:text-gray-300 shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20z"
                                        ></path>
                                      </svg>
                                      <span>
                                        {t("What network should I use?")}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              {/* Step 2 */}
                              {/* <div className="relative">
                                <div className="absolute -left-[53px] sm:-left-[61px] top-0 bg-primary p-[6px] rounded-md z-10 transition-colors">
                                  <svg
                                    className="w-5 h-5 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                    ></path>
                                  </svg>
                                </div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Select Network")}
                                </h3>

                                {cur_currencyref.current?.currencyType ==
                                "2" ? (
                                  <div className="max-w-xl mt-6">
                                    <div className="bg-black border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom">
                                      <Dropdown
                                        placeholder={t(
                                          "Select Network you want to deposit through",
                                        )}
                                        fluid
                                        className="dep-drops w-full bg-transparent text-white border-0"
                                        selection
                                        options={network_currencyref.current}
                                        defaultValue={
                                          network_currencyref.current[0]
                                        }
                                        onChange={onSelect_network}
                                      />
                                    </div>
                                    {Networks && (
                                      <div className="text-[#848E9C] text-[13px] mt-4 flex items-center gap-1">
                                        <span>{t("Expected Arrival")}:</span>
                                        <span className="text-[#848E9C]">
                                          {t("2min 50sec")}{" "}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-gray-500 text-sm mt-4">
                                    {t(
                                      "Network selection is not available for this currency.",
                                    )}
                                  </div>
                                )}
                              </div> */}

                              {/* Step 3 */}
                              {/* <div className="relative">
                                <div className="absolute -left-[53px] sm:-left-[61px] top-0 bg-primary p-[6px] rounded-md z-10">
                                  <svg
                                    className="w-5 h-5 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                    ></path>
                                  </svg>
                                </div>
                               
                                <div className="absolute -left-[33px] sm:-left-[41px] top-8 bottom-[-80px] w-[4px] bg-[#1e2329] z-0"></div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Copy Wallet Address")}
                                </h3>

                                {addressref.current == undefined ? (
                                  <div className="text-gray-500 text-sm mt-4">
                                    {t(
                                      "Select a coin and network above to generate an address.",
                                    )}
                                  </div>
                                ) : (
                                  <div className="max-w-[45rem] mt-4 relative z-10">
                                    <div className="bg-[#14151a] border border-[#2b3139] rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">
                                      <div className="flex-1 w-full order-2 md:order-1 mt-2 md:mt-0 z-10">
                                        <h4 className="text-primary text-[15px] font-medium mb-4">
                                          {Fullname
                                            ? `${Fullname}`
                                            : `${currency}`}
                                          {Networks ? `(${Networks})` : ""}{" "}
                                          {t("address is published!")}
                                        </h4>
                                        <p className="text-[#848E9C] text-[13px] leading-relaxed mb-6 max-w-[28rem]">
                                          {t(
                                            "Please use the address below to deposit your cryptocurrency using the",
                                          )}{" "}
                                          {Networks ? Networks : currency}{" "}
                                          {t(
                                            "network. You can either copy the address or scan the QR code for convenience.",
                                          )}
                                        </p>

                                        <div className="bg-[#1e2329] border border-[#2b3139] rounded-lg p-[7px] pl-3 flex justify-between items-center transition-colors">
                                          <div className="truncate pr-4 text-[#D8DDE5] text-[13px]">
                                            {addressref.current.address}
                                          </div>
                                          <button
                                            className="bg-primary hover:bg-[#d8a60a] text-black rounded-[4px] px-4 py-2 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors shrink-0"
                                            onClick={() =>
                                              copy(addressref.current.address)
                                            }
                                            title="Copy Address"
                                          >
                                            <i className="ri-file-copy-line text-[14px]"></i>
                                            {t("copy")}
                                          </button>
                                        </div>
                                      </div>

                                      <div className="bg-white p-2 rounded-[4px] shrink-0 order-1 md:order-2 z-10 self-start md:mt-1">
                                        <img
                                          src={addressref.current.qrcode}
                                          className="w-[110px] h-[110px] object-contain"
                                          alt="QR Code"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div> */}
                              {/* </div> */}
                            </div>

                            {/* Right Side - Tips & FAQs */}
                          </div>
                        </div>

                        {/* Last 4 Deposit Records Section */}
                        <div className="mt-8 mb-10 w-full">
                          <div className="flex justify-between items-center mb-6">
                            <h2 className="text-primary text-xl font-medium">
                              {t("Last 4 Deposit Records")}
                            </h2>
                            <Link to="/depositHistory">
                              <button className="bg-primary hover:bg-[#b58a23] text-black font-medium px-4 py-2 rounded transition-colors text-[13px] tracking-wide">
                                {t("Deposit History")}
                              </button>
                            </Link>
                          </div>

                          <div className="bg-[#1e2329] rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-[#242930] text-primary text-[13px]">
                                    <th className="py-4 px-6 font-medium tracking-wide">
                                      {t("Date/Time")}
                                    </th>
                                    <th className="py-4 px-6 font-medium tracking-wide">
                                      {t("Coin")}
                                    </th>
                                    <th className="py-4 px-6 font-medium tracking-wide">
                                      {t("Amount")}
                                    </th>
                                    <th className="py-4 px-6 font-medium tracking-wide">
                                      {t("Blockchain Record")}
                                    </th>
                                    <th className="py-4 px-6 font-medium tracking-wide">
                                      {t("Remarks")}
                                    </th>
                                    <th className="py-4 px-6 text-center font-medium tracking-wide">
                                      {t("Action")}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="text-sm">
                                  {historyLoader == false ? (
                                    <>
                                      {depositHistory &&
                                      depositHistory.length > 0 ? (
                                        depositHistory
                                          .slice(0, 4)
                                          .map((item, i) => {
                                            return (
                                              <tr
                                                key={i}
                                                className="border-b border-[#2b3139] hover:bg-[#2b3139] transition-colors"
                                              >
                                                <td className="py-4 px-6 text-gray-300">
                                                  {Moment(item.date).format(
                                                    "DD/MM/YY - HH:mm:ss",
                                                  )}
                                                </td>
                                                <td className="py-4 px-6">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-base tracking-wide">
                                                      {item.currencySymbol}
                                                    </span>
                                                    <span className="text-gray-500 text-xs mt-0.5">
                                                      {item.currencySymbol ===
                                                      "USDT"
                                                        ? "Tether"
                                                        : item.currencySymbol ===
                                                            "BTC"
                                                          ? "Bitcoin"
                                                          : item.currencySymbol}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-300">
                                                  {parseFloat(
                                                    item.amount,
                                                  ).toFixed(4)}
                                                </td>
                                                <td className="py-4 px-6 text-gray-300 flex items-center gap-2">
                                                  <i
                                                    className="ri-file-copy-line text-gray-400 hover:text-primary cursor-pointer transition-colors text-lg"
                                                    onClick={() =>
                                                      copy(item.txnid)
                                                    }
                                                    title="Copy TXN Id"
                                                  ></i>
                                                  {item.txnid.substring(0, 15)}
                                                  ...
                                                </td>
                                                <td className="py-4 px-6 text-gray-300">
                                                  -
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                  <Link to="/depositHistory">
                                                    <button className="border border-[#3b4148] text-gray-300 text-[12px] px-3 py-1 rounded hover:text-white hover:border-gray-400 transition-colors bg-transparent w-[60px] h-[28px] leading-none">
                                                      {t("Details")}
                                                    </button>
                                                  </Link>
                                                </td>
                                              </tr>
                                            );
                                          })
                                      ) : (
                                        <tr>
                                          <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-white/60"
                                          >
                                            {/* <div className="flex flex-col items-center justify-center">
                                              <img
                                                src={require("../assets/No-data.webp")}
                                                width="100px"
                                                alt="No data"
                                              />
                                              <div className="text-gray-400 mt-4 text-sm"> */}
                                                {t("noRecordsFound")}
                                              {/* </div>
                                            </div> */}
                                          </td>
                                        </tr>
                                      )}
                                    </>
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan={6}
                                        className="text-center py-10"
                                      >
                                        <div className="flex justify-center">
                                          <Bars
                                            height="40"
                                            width="40"
                                            color="#bd7f10"
                                            ariaLabel="bars-loading"
                                            visible={true}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>{" "}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col lg:flex-row gap-6 ">
                        <div className="w-full lg:w-7/12 ">
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
                                <p className="mt-4">{t("verifyyouraccount")}</p>
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
                        </div>

                        {/* <div className="col-lg-5">
                          <div> */}
                        <div className="w-full lg:w-5/12">
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
                        {/* </div>
                        </div> */}
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
            </div>
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;