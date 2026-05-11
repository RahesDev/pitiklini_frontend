import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData3";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import PhoneInput from "react-phone-input-2";
import { Dropdown } from "semantic-ui-react";
import "react-phone-input-2/lib/style.css";
import Side_bar from "./Side_bar";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate, useLocation } from "react-router-dom";
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

  const [siteLoader, setSiteLoader] = useState(false);

  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCrypto, setallCrypto, allCryptoref] = useState([]);
  const [currency, setcurrency, currencyref] = useState("");
  const [cointype, setcointype, cointyperef] = useState("");
  const [balance, setBalance, balanceref] = useState("");
  const [view, setview, viewref] = useState(false);
  const [bankwire, setBankwire] = useState("");
  const [newAddres, setnewAddres] = useState("");
  const [newAddresErr, setnewAddresErr] = useState("");
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [currentcurrency, setcurrentcurrency, currentcurrencyref] =
    useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [withdrawType, setwithdrawType] = useState("");

  const [network_currency, setcur_network, network_currencyref] = useState([]);
  const [network_default, setnet_default, net_defaultref] = useState("");
  const [network_current, setnet_current, network_currentref] = useState("");
  const [show_otp, setshow_otp, show_otpref] = useState(false);
  const [siteData, setSiteData] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const [withdrawstatus, setWithdrawStatus] = useState("Active");

  const [isResendVisible, setIsResendVisible] = useState(false);
  const [resendClick, setResendClick] = useState(false);
  const [counter, setCounter] = useState(120);

  // usePageLeaveConfirm();
  // usePageLeaveConfirm(
  //   "Are you sure you want to leave Withdrawal?",
  //   "/withdraw",
  //   true,
  //   [],
  // );

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendVisible(true);
    }
  }, [counter]);

  const bankdetails = () => {};
  const withdrawAction = async (data) => {
    var obj = {
      withdraw_id: data,
    };
    var data = {
      apiUrl: apiService.confirmWithdraw,
      payload: obj,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      showsuccessToast(resp.message, {
        toastId: "3",
      });
      //window.location.href = "/transaction";
      navigate("/withdraw");
    } else {
      showerrorToast(resp.message, {
        toastId: "3",
      });
      navigate("/withdraw");
    }
  };

  const qry_search = useLocation().search;
  const confirmation = new URLSearchParams(qry_search).get("transaction");
  if (confirmation != "" && confirmation != null) {
    withdrawAction(confirmation);
  }

  const initialFormValue = {
    amount: "",
    withAddress: "",
    tfa: "",
    withdraw_otp: "",
  };

  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const [amountValidate, setamountValidate] = useState(false);
  const [withAddressValidate, setwithAddress] = useState(false);
  const [withdrawcurrencyValidate, setwithdrawcurrencyValidate] =
    useState(false);
  const [
    withdrawnetworkValidate,
    setwithdrawnetworkValidate,
    withdrawnetworkValidateref,
  ] = useState(false);
  const [tfaValidate, settfaValidate] = useState(false);
  const [otpValidate, setotpValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [sitekycStatus, setsitekycStatus, sitekycStatusref] =
    useState("DeActive");
  const [kycStatus, setkycStatus, kycStatusref] = useState(1);

  const [addresshide, setaddresshide, addresshideref] = useState("Deactive");

  const { amount, withAddress, tfa, withdraw_otp } = formValue;

  useEffect(() => {
    getSitedata();
    getKYCstatus();
    getAllcurrency();
    getwithdrawHistory(1);
    getAddress();
    // getSiteSettingstatus();
    // var status = localStorage.getItem("withdraw_status");
    var status = sessionStorage.getItem("withdraw_status");
    if (status == null) {
      // localStorage.setItem("withdraw_status", false);
      sessionStorage.setItem("withdraw_status", false);
    }
    if (status == "false") {
      setalertTab("show");
    } else {
      setalertTab("remove");
    }
  }, [0]);

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate(formData);
    validate_preview(formData);
  };

  const handlekeydown = async (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const caluculateMax = async () => {
    try {
      setFormValue((prevState) => ({
        ...prevState,
        amount: balanceref.current.balance.toFixed(6),
      }));
      console.log(formValue, "formValue");
    } catch (err) {}
  };

  const addresshides = async (e) => {
    if (addresshideref.current == "Deactive") {
      setaddresshide("Active");
    } else {
      setaddresshide("Deactive");
    }
  };

  const getSitedata = async () => {
    try {
      var data = {
        apiUrl: apiService.getSitedata,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setSiteData(resp.data);
        setSiteStatus(resp.data.siteStatus);
        setWithdrawStatus(resp.data.withdrawalStatus);
      }
    } catch (error) {}
  };

  const getAllcurrency = async () => {
    var data = {
      apiUrl: apiService.walletcurrency,
    };
    var resp = await getMethod(data);
    if (resp) {
      var currArrayCrypto = [];
      var data = resp.data;
      setallCrypto(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i].withdrawStatus == "Active") {
          var obj = {
            value: data[i]._id,
            //label: data[i].currencySymbol,
            coinType: data[i].coinType,
            key: data[i]._id,
            searchSymbol: data[i].currencySymbol,
            searchName: data[i].currencyName,
            text: (
              <div className="flex items-center gap-3">
                <img
                  src={data[i].Currency_image}
                  className="w-[30px] h-[30px] rounded-full object-cover"
                  alt="coin"
                />
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-lg tracking-wide">
                    {data[i].currencySymbol}
                  </span>
                  {data[i].currencyName && (
                    <span className="text-[#6c757d] text-[15px]">
                      {data[i].currencyName}
                    </span>
                  )}
                </div>
              </div>
            ),
            erc20token: data[i].erc20token,
            bep20token: data[i].bep20token,
            trc20token: data[i].trc20token,
            rptc20token: data[i].rptc20token,
          };
          currArrayCrypto.push(obj);
        }
      }
      setallCurrency(currArrayCrypto);
    }
  };
  const onSelect1 = async (e, option) => {
    let indexData = allCryptoref.current.findIndex(
      (x) => x._id == option.value,
    );

    var currencydata = allCryptoref.current[indexData];

    console.log(currencydata, "currencydata");
    setnewCurrency(currencydata.currencySymbol);

    // setnewCurrency(option.key);
  };
  const onSelect = async (option) => {
    try {
      if (option != "" && option != null && option !== undefined) {
        console.log(option, "option");
        formValue.withAddress = null;
        setnet_default(null);
        setwithdrawAddress(null);
        setFormValue(initialFormValue);
        setcur_network("");
        setcurrency(option.searchSymbol || option.text);
        setcointype(option.coinType);
        setnet_current("");
        // getAddress();
        console.log(allCryptoref.current, "===");
        console.log(option.value, "===");
        let indexData = allCryptoref.current.findIndex(
          (x) => x._id === option.value,
        );
        console.log(indexData, "===");
        validate_preview(formValueref.current);
        if (option.label == "USD") {
          showerrorToast("Fiat withdraw is not allowed by the site");
        } else {
          if (indexData != -1) {
            var currencydata = allCryptoref.current[indexData];
            console.log(currencydata, "---currencydata---");
            setcurrentcurrency(currencydata);
            // setcurrency(currencydata)
            setcur_network([]);
            setnet_default("");
            var network_cur = {};
            var network_names = [];
            if (currencydata.currencyType == "2") {
              if (currencydata.erc20token == "1") {
                network_cur = {
                  value: "ERC20",
                  //label: "erc20token",
                  text: "ERC20",
                  key: "erc20token",
                };
                network_names.push(network_cur);
              }
              if (currencydata.bep20token == "1") {
                network_cur = {
                  value: "BEP20",
                  //label: "bep20token",
                  text: "BEP20",
                  key: "bep20token",
                };
                network_names.push(network_cur);
              }
              if (currencydata.trc20token == "1") {
                network_cur = {
                  value: "TRC20",
                  //label: "trc20token",
                  text: "TRC20",
                  key: "trc20token",
                };
                network_names.push(network_cur);
              }

              setcur_network(network_names);
              // setnet_default(network_currencyref.current[0].label);
            }
            setwithdrawType(currencydata.coinType);
            // if (currencydata.coinType== "1") {
            var obj = {
              currency: currencydata.currencySymbol,
              currId: option.value,
            };

            console.log(obj, "obj");
            var data = {
              apiUrl: apiService.user_balance,
              payload: obj,
            };

            var resp = await postMethod(data);
            if (resp.status) {
              setview(true);
              setBalance(resp.data);

              console.log(resp.data, "Balanceref");
            } else {
            }
            // } else {
            // }
          }
        }
        setwithdrawcurrencyValidate(false);
        validate_preview(formValueref.current);
      } else {
        setcurrentcurrency("");
        setcurrency("");
      }
    } catch (err) {
      console.log(err, "errrorororo");
    }
  };

  const nav_page = async (link) => {
    navigate(link);
  };

  const validate = async (values) => {
    const errors = {};

    if (
      network_currencyref.current.length > 0 &&
      currentcurrencyref.current.currencyType == "2"
    ) {
      errors.withdrawnetwork = t("Withdrawnetworkrequired");
      setwithdrawnetworkValidate(true);
    } else {
      setwithdrawnetworkValidate(false);
    }

    if (!values.amount) {
      errors.amount = t("amountrequired");
      setamountValidate(true);
    }

    if (!values.withAddress) {
      errors.withAddress = t("destinationrequired");
      setwithAddress(true);
    }

    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    }

    if (!values.withdraw_otp) {
      errors.withdraw_otp = t("withdrawotprequired");
      setotpValidate(true);
    }

    setvalidationnErr(errors);
    return errors;
  };
  const validateFiat = async (values) => {
    const errors = {};
    if (!values.amount) {
      errors.amount = t("amountrequired");
      setamountValidate(true);
    }
    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    }
    if (!values.withdraw_otp) {
      errors.withdraw_otp = t("withdrawotprequired");
      setotpValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const validate_preview = async (values) => {
    const errors = {};
    console.log(currencyref.current, "currencyref.current1");

    if (
      !currencyref.current ||
      currencyref.current == "" ||
      !currentcurrencyref.current ||
      currentcurrencyref.current == "" ||
      currentcurrencyref.current == null ||
      currentcurrencyref.current == undefined
    ) {
      errors.withdrawcurrency = t("Currencyrequiredfield");
      setwithdrawcurrencyValidate(true);
    } else {
      setwithdrawcurrencyValidate(false);
    }

    console.log(
      network_currencyref.current.length,
      "network_currencyref",
      currentcurrencyref.current.currencyType,
    );
    if (
      network_currencyref.current.length > 0 &&
      currentcurrencyref.current.currencyType == "2" &&
      !network_currentref.current
    ) {
      errors.withdrawnetwork = t("Networkrequiredfield");
      setwithdrawnetworkValidate(true);
    } else {
      setwithdrawnetworkValidate(false);
    }

    if (!values.withAddress) {
      errors.withAddress = t("Destinationaddressrequired");
      setwithAddress(true);
    } else {
      setwithAddress(false);
    }

    if (!values.amount) {
      errors.amount = t("amountrequired");
      setamountValidate(true);
    } else {
      setamountValidate(false);
    }

    if (!values.withdraw_otp) {
      errors.withdraw_otp = t("withdrawotprequired");
      setotpValidate(true);
    } else {
      setotpValidate(false);
    }

    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    } else {
      settfaValidate(false);
    }

    setvalidationnErr(errors);
    return errors;
    // console.log(Object.keys(errors).length === 0,"---Object.keys(errors).length === 0--");
    // return Object.keys(errors).length === 0;
  };
  const validateFiat_preview = async (values) => {
    const errors = {};
    if (!values.amount) {
      errors.amount = t("amountrequired");
      setamountValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const validate_submit = async (values) => {
    const errors = {};

    if (!values.withdraw_otp) {
      errors.withdraw_otp = t("withdrawotprequired");
      setotpValidate(true);
    }

    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    }

    setvalidationnErr(errors);
    return Object.keys(errors).length === 0;
  };
  const validateFiat_submit = async (values) => {
    const errors = {};
    if (!values.withdraw_otp) {
      errors.withdraw_otp = t("withdrawotprequired");
      setotpValidate(true);
    }
    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const getwithdrawHistory = async (page) => {
    var data = {
      apiUrl: apiService.withdraw_history,
      payload: { FilPerpage: 5, FilPage: page },
    };
    var withdraw_history_list = await postMethod(data);
    if (withdraw_history_list) {
      setwithdrawHistory(withdraw_history_list.result);
    }
  };

  const getKYCstatus = async () => {
    var data = {
      apiUrl: apiService.getKYCStatus,
    };

    setSiteLoader(true);
    var getKYC = await getMethod(data);
    setSiteLoader(false);

    if (getKYC.status) {
      setkycStatus(getKYC.Message.kycstatus);
      setBankwire(getKYC.bankdatastatus);
    } else {
      // setkycStatus(0);
    }
  };

  const onSelect_network = async (option) => {
    console.log("option---->>>>>>>", option);
    setnet_current(option.value);
    validate_preview(formValueref.current);
  };

  const onSelect_address = async (e) => {
    console.log(
      e.target.value,
      "=-=-=-=option=-=-=-=-=option=-=-=-option=-=-=",
    );
    setwithdrawAddress(e.target.value);
    formValue.withAddress = e.target.value;
    validate_preview(formValueref.current);
    // setwithAddress(false);
  };

  const navigateKyc = async () => {
    navigate("/kyc");
  };

  const withdrawPreview = async () => {
    try {
      console.log(formValue, "=-=-=v=-formValue-=-formValue=-=-vformValue");
      if (
        currentcurrency.currencySymbol == "USD" ||
        currentcurrency.currencySymbol == "INR" ||
        currentcurrency.currencySymbol == "EUR"
      ) {
        if (bankwire == 1) {
          if (withdrawType == "2") {
            validateFiat_preview(formValue);
            if (formValue.amount != "") {
              if (+formValue.amount > 0) {
                if (+balanceref.current.balance >= +formValue.amount) {
                  if (currentcurrency.minWithdrawLimit > formValue.amount) {
                    showerrorToast(
                      "Please enter greater than " +
                        currentcurrency.minWithdrawLimit +
                        " amount",
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount",
                    );
                  } else {
                    const obj = {
                      currency_symbol: currentcurrency.currencySymbol,
                      withdrawalAddress: formValue.withAddress,
                      networkType: network_currentref.current,
                      withdrawalAmount: formValue.amount,
                      // otp: formValue.tfa,
                    };
                    console.log(obj, "=-obj=-");
                    var data = {
                      apiUrl: apiService.fieldValidate,
                      payload: obj,
                    };
                    // var data = {
                    //   apiUrl: apiService.send_otp,
                    // };
                    setbuttonLoader(true);
                    var resp = await postMethod(data);
                    if (resp.status) {
                      setIsResendVisible(false);
                      setCounter(120);
                      showsuccessToast(resp.message);
                      setbuttonLoader(false);
                      setshow_otp(true);
                    } else {
                      showerrorToast(resp.message);
                      setbuttonLoader(false);
                    }
                  }
                } else {
                  showerrorToast("Insufficient Balance!");
                  setbuttonLoader(false);
                }
              } else {
                showerrorToast("Please give valid withdraw amount!");
                setbuttonLoader(false);
              }
            }
          } else {
            validate_preview(formValueref.current);
            if (formValue.amount != "" && formValue.withAddress != "") {
              if (+formValue.amount > 0) {
                if (+balanceref.current.balance >= +formValue.amount) {
                  if (currentcurrency.minWithdrawLimit > formValue.amount) {
                    showerrorToast(
                      "Please enter greater than " +
                        currentcurrency.minWithdrawLimit +
                        " amount",
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount",
                    );
                  } else {
                    const obj = {
                      currency_symbol: currentcurrency.currencySymbol,
                      withdrawalAddress: formValue.withAddress,
                      withdrawalAmount: formValue.amount,
                      networkType: network_currentref.current,
                      // tfa: formValue.tfa,
                    };
                    console.log(obj, "=-obj=-");
                    var data = {
                      apiUrl: apiService.fieldValidate,
                      payload: obj,
                    };
                    // var data = {
                    //   apiUrl: apiService.send_otp,
                    // };
                    setbuttonLoader(true);
                    var resp = await postMethod(data);
                    if (resp.status) {
                      setCounter(120);
                      setIsResendVisible(false);
                      showsuccessToast(resp.message);
                      setbuttonLoader(false);
                      setshow_otp(true);
                    } else {
                      showerrorToast(resp.message);
                      setbuttonLoader(false);
                    }
                  }
                } else {
                  showerrorToast("Insufficient Balance");

                  setbuttonLoader(false);
                }
              } else {
                showerrorToast("Please give valid withdraw amount!");
              }
            }
          }
        } else {
          showerrorToast("Kindly update your Bank details");
          navigate("/bankdetails");
        }
      } else {
        if (withdrawType == "2") {
          validateFiat_preview(formValue);
          if (formValue.amount != "") {
            if (+formValue.amount > 0) {
              if (+balanceref.current.balance >= +formValue.amount) {
                if (currentcurrency.minWithdrawLimit > formValue.amount) {
                  showerrorToast(
                    "Please enter greater than " +
                      currentcurrency.minWithdrawLimit +
                      " amount",
                  );
                } else if (
                  currentcurrency.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      currentcurrency.maxWithdrawLimit +
                      " amount",
                  );
                } else {
                  const obj = {
                    currency_symbol: currentcurrency.currencySymbol,
                    withdrawalAddress: formValue.withAddress,
                    withdrawalAmount: formValue.amount,
                    networkType: network_currentref.current,
                    // otp: formValue.tfa,
                  };
                  console.log(obj, "=-obj=-");
                  var data = {
                    apiUrl: apiService.fieldValidate,
                    payload: obj,
                  };
                  // var data = {
                  //   apiUrl: apiService.send_otp,
                  // };
                  setbuttonLoader(true);
                  var resp = await postMethod(data);
                  if (resp.status == true) {
                    setCounter(120);
                    setIsResendVisible(false);
                    showsuccessToast(resp.message);
                    setbuttonLoader(false);
                    setshow_otp(true);
                  } else {
                    showerrorToast(resp?.errors[0]?.msg);
                    setbuttonLoader(false);
                  }
                }
              } else {
                showerrorToast("Insufficient Balance!");

                setwithdrawAddress("");
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
              setbuttonLoader(false);
            }
          }
        } else {
          validate_preview(formValueref.current);
          // if (!isValid) {
          //   showerrorToast("Please fix the validation errors before proceeding.");
          //   return;
          // }

          if (
            withdrawcurrencyValidate == false &&
            withdrawnetworkValidateref.current == false &&
            withAddressValidate == false &&
            amountValidate == false
            // tfaValidate == false
          ) {
            if (formValue.amount != "" && formValue.withAddress != "") {
              if (+formValue.amount > 0) {
                if (+balanceref.current.balance >= +formValue.amount) {
                  if (currentcurrency.minWithdrawLimit > formValue.amount) {
                    showerrorToast(
                      "Please enter greater than " +
                        currentcurrency.minWithdrawLimit +
                        " amount",
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount",
                    );
                  } else {
                    const obj = {
                      currency_symbol: currentcurrency.currencySymbol,
                      withdrawalAddress: formValue.withAddress,
                      networkType: network_currentref.current,
                      withdrawalAmount: formValue.amount,
                      // otp: formValue.tfa,
                    };
                    // console.log(obj, "=-=-obj=-=-");
                    var data = {
                      apiUrl: apiService.fieldValidate,
                      payload: obj,
                    };
                    // var data = {
                    //   apiUrl: apiService.send_otp,
                    // };
                    setbuttonLoader(true);
                    var resp = await postMethod(data);
                    if (resp.status == true) {
                      setCounter(120);
                      setResendClick(false);
                      setIsResendVisible(false);
                      showsuccessToast(resp.message);
                      setbuttonLoader(false);
                      setshow_otp(true);
                    } else {
                      showerrorToast(resp.message);
                      setbuttonLoader(false);
                    }
                  }
                } else {
                  showerrorToast("Insufficient Balance");

                  setbuttonLoader(false);
                }
              } else {
                showerrorToast("Please give valid withdraw amount!");
              }
            }
          }
        }
      }
    } catch (error) {}
  };

  const handleResend = async () => {
    try {
      // setResendClick(true);
      // withdrawPreview();
      if (withdrawType == "2") {
        validateFiat_preview(formValue);
        if (formValue.amount != "") {
          if (+formValue.amount > 0) {
            if (+balanceref.current.balance >= +formValue.amount) {
              if (currentcurrency.minWithdrawLimit > formValue.amount) {
                showerrorToast(
                  "Please enter greater than " +
                    currentcurrency.minWithdrawLimit +
                    " amount",
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount",
                );
              } else {
                const obj = {
                  currency_symbol: currentcurrency.currencySymbol,
                  withdrawalAddress: formValue.withAddress,
                  withdrawalAmount: formValue.amount,
                  networkType: network_currentref.current,
                  // otp: formValue.tfa,
                };
                console.log(obj, "=-obj=-");
                var data = {
                  apiUrl: apiService.fieldValidate,
                  payload: obj,
                };
                // var data = {
                //   apiUrl: apiService.send_otp,
                // };
                // setbuttonLoader(true);
                setResendClick(true);
                var resp = await postMethod(data);
                if (resp.status == true) {
                  setIsResendVisible(false);
                  setCounter(120);
                  showsuccessToast(resp.message);
                  setbuttonLoader(false);
                  setshow_otp(true);
                } else {
                  showerrorToast(resp?.errors[0]?.msg);
                  setbuttonLoader(false);
                }
              }
            } else {
              showerrorToast("Insufficient Balance!");

              setwithdrawAddress("");
            }
          } else {
            showerrorToast("Please give valid withdraw amount!");
            setbuttonLoader(false);
          }
        }
      } else {
        validate_preview(formValueref.current);
        // if (!isValid) {
        //   showerrorToast("Please fix the validation errors before proceeding.");
        //   return;
        // }

        if (
          withdrawcurrencyValidate == false &&
          withdrawnetworkValidateref.current == false &&
          withAddressValidate == false &&
          amountValidate == false
          // tfaValidate == false
        ) {
          if (formValue.amount != "" && formValue.withAddress != "") {
            if (+formValue.amount > 0) {
              if (+balanceref.current.balance >= +formValue.amount) {
                if (currentcurrency.minWithdrawLimit > formValue.amount) {
                  showerrorToast(
                    "Please enter greater than " +
                      currentcurrency.minWithdrawLimit +
                      " amount",
                  );
                } else if (
                  currentcurrency.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      currentcurrency.maxWithdrawLimit +
                      " amount",
                  );
                } else {
                  const obj = {
                    currency_symbol: currentcurrency.currencySymbol,
                    withdrawalAddress: formValue.withAddress,
                    networkType: network_currentref.current,
                    withdrawalAmount: formValue.amount,
                    // otp: formValue.tfa,
                  };
                  // console.log(obj, "=-=-obj=-=-");
                  var data = {
                    apiUrl: apiService.fieldValidate,
                    payload: obj,
                  };
                  // var data = {
                  //   apiUrl: apiService.send_otp,
                  // };
                  // setbuttonLoader(true);
                  setResendClick(true);
                  var resp = await postMethod(data);
                  if (resp.status == true) {
                    setResendClick(false);
                    setCounter(120);
                    setIsResendVisible(false);
                    showsuccessToast(resp.message);
                    setbuttonLoader(false);
                    setshow_otp(true);
                  } else {
                    showerrorToast(resp.message);
                    setbuttonLoader(false);
                  }
                }
              } else {
                showerrorToast("Insufficient Balance");

                setbuttonLoader(false);
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          }
        }
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

  const withdrawSubmit = async () => {
    try {
      if (withdrawType == "2") {
        validateFiat_submit(formValue);

        if (sessionStorage.getItem("tfa_status") == 1) {
          if (formValue.amount != "" && formValue.tfa != "") {
            if (+formValue.amount > 0) {
              if (currentcurrency.minWithdrawLimit > formValue.amount) {
                showerrorToast(
                  "Please enter greater than " +
                    currentcurrency.minWithdrawLimit +
                    " amount",
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount",
                );
              } else {
                var obj = {
                  currencyId: currentcurrency._id,
                  currency_symbol: currentcurrency.currencySymbol,
                  amount: formValue.amount,
                  otp: formValue.withdraw_otp,
                  tfa: formValue.tfa,
                  networkType: network_currentref.current,
                  withdrawalAddress: formValue.withAddress,
                };
                console.log("submit withdraw params---", obj);
                // return;
                var data = {
                  apiUrl: apiService.withdrawProcess,
                  payload: obj,
                };
                // var obj = {
                //   amount: formValue.amount,
                //   tfaCode: formValue.tfa,
                //   currency_symbol: currentcurrency.currencySymbol,
                //   currId: currentcurrency._id,
                //   withdrawOtp: formValue.withdraw_otp,
                //   tfa_status: localStorage.getItem("tfa_status"),
                // };
                // var data = {
                //   apiUrl: apiService.submitfiatWithdraw,
                //   payload: obj,
                // };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
                  setcurrentcurrency("");
                  setcurrency("");
                  setnet_default("");
                  setcur_network("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  //window.location.reload(false);
                } else {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
                  // formValue.amount = "";
                  // formValue.withAddress = "";
                  // formValue.tfa = "";
                  // formValue.withdraw_otp = "";
                  //window.location.reload(false);
                }
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          } else {
            // showerrorToast("Please give all the fields !");
          }
        } else {
          if (formValue.amount != "") {
            if (+formValue.amount > 0) {
              if (currentcurrency.minWithdrawLimit > formValue.amount) {
                showerrorToast(
                  "Please enter greater than " +
                    currentcurrency.minWithdrawLimit +
                    " amount",
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount",
                );
              } else {
                var obj = {
                  currencyId: currentcurrency._id,
                  currency_symbol: currentcurrency.currencySymbol,
                  amount: formValue.amount,
                  otp: formValue.withdraw_otp,
                  tfa: formValue.tfa,
                  networkType: network_currentref.current,
                  withdrawalAddress: formValue.withAddress,
                };
                console.log("submit withdraw params---", obj);
                // return;
                var data = {
                  apiUrl: apiService.withdrawProcess,
                  payload: obj,
                };
                // var obj = {
                //   amount: formValue.amount,
                //   tfaCode: formValue.tfa,
                //   currency_symbol: currentcurrency.currencySymbol,
                //   currId: currentcurrency._id,
                //   withdrawOtp: formValue.withdraw_otp,
                //   tfa_status: localStorage.getItem("tfa_status"),
                // };
                // var data = {
                //   apiUrl: apiService.submitfiatWithdraw,
                //   payload: obj,
                // };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setcurrentcurrency("");
                  setwithdrawAddress("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  setcurrency("");
                  setnet_default("");
                  setcur_network("");
                  //window.location.reload(false);
                } else {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
                  // formValue.amount = "";
                  // formValue.withAddress = "";
                  // formValue.tfa = "";
                  // formValue.withdraw_otp = "";
                  //window.location.reload(false);
                }
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          } else {
            showerrorToast("Please give all the fields !");
          }
        }
      } else {
        validate_submit(formValue);
        // const isValid = await validate_submit(formValue);
        // if (!isValid) {
        //   showerrorToast("Please fix the validation errors before proceeding.");
        //   return;
        // }

        if (sessionStorage.getItem("tfa_status") == 1) {
          if (
            formValue.amount != "" &&
            formValue.withAddress != "" &&
            formValue.tfa != "" &&
            formValue.withdraw_otp != ""
          ) {
            if (+formValue.amount > 0) {
              if (currentcurrency.minWithdrawLimit > formValue.amount) {
                showerrorToast(
                  "Please enter greater than " +
                    currentcurrency.minWithdrawLimit +
                    " amount",
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount",
                );
              } else {
                var obj = {
                  currencyId: currentcurrency._id,
                  currency_symbol: currentcurrency.currencySymbol,
                  amount: formValue.amount,
                  otp: formValue.withdraw_otp,
                  tfa: formValue.tfa,
                  networkType: network_currentref.current,
                  withdrawalAddress: formValue.withAddress,
                };
                console.log("submit withdraw params---", obj);
                var data = {
                  apiUrl: apiService.withdrawProcess,
                  payload: obj,
                };
                // var obj = {
                //   amount: formValue.amount,
                //   withdraw_address: formValue.withAddress,
                //   tfaCode: formValue.tfa,
                //   currency_symbol: currentcurrency.currencySymbol,
                //   currId: currentcurrency._id,
                //   network: network_currentref.current,
                //   withdrawOtp: formValue.withdraw_otp,
                //   tfa_status: localStorage.getItem("tfa_status"),
                // };
                // var data = {
                //   apiUrl: apiService.submitWithdraw,
                //   payload: obj,
                // };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status == true) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  setcurrency("");
                  setcurrentcurrency("");
                  setnet_default("");
                  setcur_network("");
                  //window.location.reload(false);
                } else if (resp.status == "TransactionCanceled") {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  formValue.withAddress = "";
                  setcurrency("");
                  setcurrentcurrency("");
                  setnet_default("");
                  setcur_network("");
                } else {
                  showerrorToast(resp.message);
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  setbuttonLoader(false);
                  // setshow_otp(false);
                  // formValue.amount = "";
                  // setwithdrawAddress("");
                  // formValue.tfa = "";
                  // formValue.withdraw_otp = "";
                  // setcurrency("");
                  // setcurrentcurrency("")
                  // setnet_default("");
                  // setcur_network("");
                  // formValue.amount = "";
                  // formValue.withAddress = "";
                  // formValue.tfa = "";
                  //window.location.reload(false);
                }
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          } else {
            // showerrorToast("Please give all the fields !");
          }
        } else {
          if (formValue.amount != "" && formValue.withAddress != "") {
            if (+formValue.amount > 0) {
              if (currentcurrency.minWithdrawLimit > formValue.amount) {
                showerrorToast(
                  "Please enter greater than " +
                    currentcurrency.minWithdrawLimit +
                    " amount",
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount",
                );
              } else {
                var obj = {
                  currencyId: currentcurrency._id,
                  currency_symbol: currentcurrency.currencySymbol,
                  amount: formValue.amount,
                  tfa: formValue.tfa,
                  otp: formValue.withdraw_otp,
                  networkType: network_currentref.current,
                  withdrawalAddress: formValue.withAddress,
                };
                console.log("submit withdraw params---", obj);
                // return;
                var data = {
                  apiUrl: apiService.withdrawProcess,
                  payload: obj,
                };
                // var obj = {
                //   amount: formValue.amount,
                //   withdraw_address: formValue.withAddress,
                //   tfaCode: formValue.tfa,
                //   currency_symbol: currentcurrency.currencySymbol,
                //   currId: currentcurrency._id,
                //   network: network_currentref.current,
                //   withdrawOtp: formValue.withdraw_otp,
                //   tfa_status: localStorage.getItem("tfa_status"),
                // };
                // console.log("submit withdraw params---",obj);
                // return;
                // var data = {
                //   apiUrl: apiService.submitWithdraw,
                //   payload: obj,
                // };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status == true) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  setcurrency("");
                  setcurrentcurrency("");
                  setnet_default("");
                  setcur_network("");
                  //window.location.reload(false);
                } else {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
                  // setshow_otp(false);
                  // formValue.amount = "";
                  // setwithdrawAddress("");
                  // formValue.tfa = "";
                  // formValue.withdraw_otp = "";
                  // setcurrency("");
                  // setcurrentcurrency("")
                  // setnet_default("");
                  // setcur_network("");
                  // formValue.amount = "";
                  // formValue.withAddress = "";
                  // formValue.tfa = "";
                  //window.location.reload(false);
                }
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
            }
          }
        }
      }
    } catch (error) {}
  };

  const [newCurrency, setnewCurrency] = useState("");
  const [newCurrencyErr, setnewCurrencyErr] = useState(false);
  const [newNetwork, setnewNetwork] = useState("");
  const [alertTab, setalertTab] = useState("hide");
  const [allAddress, setallAddress, allAddressref] = useState([]);
  const [currAddres, setcurrAddres, currAddresref] = useState([]);
  const [withdrawAddress, setwithdrawAddress, withdrawAddressref] = useState();

  const getAddress = async () => {
    var data = {
      apiUrl: apiService.getAddress,
    };
    var resp = await getMethod(data);
    if (resp.status == true) {
      setallAddress(resp.data);
      var data = [];
      for (let i = 0; i < resp.data.length; i++) {
        const element = resp.data[i];

        if (element.currency) {
          console.log(element, "element");

          var dropData = {
            value: element.address,
            //label: element.currency,
            key: element.currency,
            text: element.address,
          };
          data.push(dropData);
        }
        setcurrAddres(data);
      }
    } else {
      setallAddress([]);
    }
  };
  const Addaddress = async () => {
    if (newAddres == "") {
      setnewAddresErr(true);
    } else if (newCurrency == "") {
      setnewCurrencyErr(true);
      setnewAddresErr(false);
    } else {
      setnewCurrencyErr(false);
      var obj = {
        Address: newAddres,
        currency: newCurrency,
        network: newNetwork,
      };

      console.log(obj, "obj");

      var data = {
        apiUrl: apiService.Addaddress,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status == true) {
        showsuccessToast(resp.message);
        setnewAddres("");
        setaddresshide("Deactive");
        setnewCurrency("");
        setnewNetwork("");
        getAddress();
      } else {
        showerrorToast(resp.message);
      }
    }
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("Address copied");
  };

  const isWithdrawStep1Done = Boolean(currentcurrencyref.current?.currencySymbol || currencyref.current);
  const requiresWithdrawNetwork = currentcurrencyref.current?.currencyType == "2";
  const isWithdrawNetworkDone = !requiresWithdrawNetwork || Boolean(network_currentref.current);
  const isWithdrawAddressDone =
    withdrawType == "1"
      ? Boolean(withdrawAddressref.current && String(withdrawAddressref.current).trim() !== "")
      : true;
  const isWithdrawStep2Done = isWithdrawStep1Done && isWithdrawNetworkDone && isWithdrawAddressDone;
  const isWithdrawStep3Done = Boolean(amount && Number(amount) > 0);
  const withdrawCurrentStep = !isWithdrawStep1Done ? 1 : !isWithdrawStep2Done ? 2 : 3;

  const withdrawSteps = [
    {
      key: "w-select-crypto",
      title: t("Select Crypto"),
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm-2 5v5a2 2 0 002 2h12a2 2 0 002-2V9H2zm2 3h2v2H4v-2z" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom max-w-lg">
            <Dropdown
              placeholder={t("selectacoin")}
              fluid
              className="dep-drops w-full bg-transparent text-white border-0"
              selection
              options={allCurrencyref.current}
              onChange={(e, data) => {
                const selectedOption = allCurrencyref.current.find(
                  (option) => option.value === data.value
                );
                onSelect(selectedOption);
              }}
              search={(options, query) =>
                options.filter((opt) => {
                  const q = query.toLowerCase();
                  return (
                    (opt.searchSymbol && opt.searchSymbol.toLowerCase().includes(q)) ||
                    (opt.searchName && opt.searchName.toLowerCase().includes(q))
                  );
                })}
              disabled={show_otpref.current == true}
            />
          </div>
          {withdrawcurrencyValidate && (
            <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.withdrawcurrency}</span>
          )}
        </>
      ),
    },
    {
      key: "w-select-network",
      title: t("Select Network"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      content: (
        <>
          {show_otpref.current == false && currentcurrencyref.current?.currencyType == "2" && (
            <div className="mb-4 max-w-lg mt-6">
              <label className="text-[13px] text-gray-500 mb-1 block px-1">{t("Network")}</label>
              <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom">
                <Dropdown
                  placeholder={t("Please select a withdrawal network")}
                  fluid
                  className="dep-drops w-full bg-transparent text-white border-0"
                  selection
                  options={network_currencyref.current}
                  onChange={(e, data) => {
                    const selectedOption = network_currencyref.current.find(
                      (option) => option.value === data.value
                    );
                    onSelect_network(selectedOption);
                  }}
                  isSearchable={true}
                  disabled={show_otpref.current == true}
                />
              </div>
              {withdrawnetworkValidateref.current && (
                <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.withdrawnetwork}</span>
              )}
            </div>
          )}

          {withdrawType == "1" && (
            <div className="max-w-lg mt-6">
              <div className="flex justify-between items-end mb-1 px-1">
                <label className="text-[13px] text-gray-500">{t("Address")}</label>
                <div className="text-[13px] text-[#ca9b27] hover:text-[#b58a23] cursor-pointer transition-colors" onClick={addresshides}>
                  {t("Manage Address")}
                </div>
              </div>
              <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center p-1 px-3">
                <input
                  type="text"
                  placeholder={t("Please enter your withdraw address")}
                  className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px]"
                  maxLength={60}
                  onKeyDown={handlekeydown}
                  disabled={show_otpref.current == true}
                  value={withdrawAddressref.current || ""}
                  onChange={onSelect_address}
                />
                {withdrawAddressref.current && (
                  <button
                    className="text-gray-500 hover:text-white p-2"
                    onClick={() => {
                      setwithdrawAddress("");
                      if (withdrawAddressref) withdrawAddressref.current = "";
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {withAddressValidate && (
                <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.withAddress}</span>
              )}
            </div>
          )}
        </>
      ),
    },
    {
      key: "w-copy-or-amount",
      title: t("Copy Wallet Address"),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      content: (
        <div className="max-w-xl">
          <div className="flex justify-between items-end mb-2 mt-4 px-1">
            <label className="text-sm text-gray-500">{t("Amount")}</label>
            <div className="text-sm text-gray-400">
              {t("Available Balance")}:{" "}
              <span className="text-gray-300 font-medium">
                {balanceref.current.balance ? balanceref.current.balance.toFixed(6) : "0"} {currencyref.current}
              </span>
            </div>
          </div>

          <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-2">
            <input
              type="text"
              pattern="[0-9]*"
              maxLength={8}
              onKeyDown={(evt) => {
                if (
                  !(
                    (evt.key >= "0" && evt.key <= "9") ||
                    evt.key === "." ||
                    evt.key === "Backspace" ||
                    evt.key === "Delete" ||
                    evt.key === "ArrowLeft" ||
                    evt.key === "ArrowRight" ||
                    evt.key === "Tab"
                  )
                ) {
                  evt.preventDefault();
                }
              }}
              autoComplete="off"
              name="amount"
              value={amount}
              disabled={show_otpref.current == true}
              onChange={(e) => {
                if (e.target.value >= 0) handleChange(e);
              }}
              onInput={(evt) => {
                if (evt.target.value.split(".").length > 2) evt.target.value = evt.target.value.slice(0, -1);
              }}
              placeholder={`${t("Minimum withdrawal amount")}: ${currentcurrencyref.current?.minWithdrawLimit || "0.01"} ${currencyref.current || ""}`}
              className="bg-transparent border-0 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px] outline-none"
            />
            <span className="text-white font-medium ml-2 h-full items-center flex">{currencyref.current}</span>
          </div>
          {amountValidate && <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.amount}</span>}

          <div className="flex justify-between items-end mb-2 mt-6 px-1">
            <label className="text-sm text-gray-500">{t("Remarks (optional)")}</label>
          </div>
          <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-2">
            <input
              type="text"
              placeholder={t("e.g. Purpose of withdrawal")}
              disabled={show_otpref.current == true}
              className="bg-transparent border-0 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px] outline-none"
            />
          </div>

          {show_otpref.current == true && (
            <div className="mb-4 mt-6">
              <label className="text-sm text-gray-500 mb-1 block px-1">{t("withdrawOTP")}</label>
              <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-1">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder={t("EnterWithdrawOTP")}
                  name="withdraw_otp"
                  value={withdraw_otp}
                  maxLength={4}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 && value.length <= 6) {
                      const formData = { ...formValue, [e.target.name]: value };
                      setFormValue(formData);
                      validate(formData);
                      validate_preview(formData);
                    }
                  }}
                  className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] outline-none"
                />
              </div>
              {otpValidate && <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.withdraw_otp}</span>}
              <div className="text-right text-xs mt-2 px-1">
                <span className="text-gray-400">{t("Didntreceivecode?")} </span>
                {resendClick == false ? (
                  isResendVisible ? (
                    <button onClick={handleResend} className="text-[#f0b90b] hover:text-yellow-400 cursor-pointer">
                      {t("resend")}
                    </button>
                  ) : (
                    <span className="text-[#f0b90b]">{counter}s</span>
                  )
                ) : (
                  <i className="fa-solid fa-circle-notch fa-spin text-[#f0b90b] px-2"></i>
                )}
              </div>
            </div>
          )}

          {show_otpref.current == true && (sessionStorage.getItem("tfa_status") == 0 || sessionStorage.getItem("tfa_status") == 1) && (
            <div className="mb-4 mt-4">
              <label className="text-sm text-gray-500 mb-1 block px-1">{t("2FAVerificationCode")}</label>
              <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-1">
                <input
                  type="text"
                  autoComplete="off"
                  maxLength={6}
                  name="tfa"
                  value={tfa}
                  placeholder={t("Enter2FACode")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) e.preventDefault();
                  }}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value >= 0 && value.length <= 6) {
                      const formData = { ...formValue, [e.target.name]: value };
                      setFormValue(formData);
                      validate(formData);
                      validate_preview(formData);
                    }
                  }}
                  className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] outline-none"
                />
              </div>
              {tfaValidate && <span className="text-red-500 text-sm mt-1 block px-2">{validationnErr.tfa}</span>}
            </div>
          )}

          <div className="mt-14 text-right flex flex-col items-end px-1">
            <div className="text-[22px] font-bold text-white tracking-wide">
              {amount && !isNaN(amount) && currentcurrencyref.current ? (
                parseFloat(amount) - parseFloat(currentcurrencyref.current.withdrawFee || 0) > 0 ? (
                  String(Number((parseFloat(amount) - parseFloat(currentcurrencyref.current.withdrawFee || 0)).toFixed(6))) + " "
                ) : (
                  "0.00 "
                )
              ) : (
                "--"
              )}
              <span>{currencyref.current}</span>
            </div>
            <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-1">
              {t("Fee")}: {currentcurrencyref.current?.withdrawFee || "0"} {currencyref.current}
              <svg className="w-[14px] h-[14px] ml-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="mt-3">
            {buttonLoader == false ? (
              sessionStorage.getItem("tfa_status") == 0 ? (
                <button onClick={() => nav_page("/enabletfa")} className="w-full bg-[#ca9b27] text-white font-semibold py-[14px] rounded-lg hover:bg-[#b58a23] transition-colors">
                  {t("Submit")}
                </button>
              ) : show_otpref.current == true ? (
                <button onClick={() => withdrawSubmit()} className="w-full bg-[#ca9b27] text-white font-semibold py-[14px] rounded-lg hover:bg-[#b58a23] transition-colors">
                  {t("Submit")}
                </button>
              ) : show_otpref.current == false ? (
                <button
                  onClick={() => withdrawPreview()}
                  disabled={
                    !currentcurrencyref.current ||
                    !amount ||
                    isNaN(amount) ||
                    amount <= 0 ||
                    (currentcurrencyref.current?.currencyType == "2" && !network_currentref.current) ||
                    (withdrawType == "1" && (!withdrawAddressref.current || withdrawAddressref.current.trim() === ""))
                  }
                  className={`w-full font-semibold py-[14px] rounded-lg transition-colors ${
                    !currentcurrencyref.current ||
                    !amount ||
                    isNaN(amount) ||
                    amount <= 0 ||
                    (currentcurrencyref.current?.currencyType == "2" && !network_currentref.current) ||
                    (withdrawType == "1" && (!withdrawAddressref.current || withdrawAddressref.current.trim() === ""))
                      ? "bg-[#2b3139] text-[#5e6673] cursor-not-allowed"
                      : "bg-[#ca9b27] text-white hover:bg-[#b58a23]"
                  }`}
                >
                  {t("Submit")}
                </button>
              ) : null
            ) : (
              <button disabled className="w-full bg-[#2b3139] text-[#5e6673] font-semibold py-[14px] rounded-lg flex justify-center items-center gap-2 cursor-not-allowed">
                <i className="fa-solid fa-circle-notch fa-spin"></i> {t("Loading")}...
              </button>
            )}
          </div>

          <div className="mt-4 text-left px-1">
            <p className="text-[13px] text-gray-500">
              {t("24-hour withdrawal limit")}: 0/{currentcurrencyref.current?.maxWithdrawLimit || "0"} {currencyref.current || "BTC"}
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardLayout>
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
          <section className="asset_section">
            <div className="buy_head">
              {withdrawstatus == "Active" ? (
                <>
                  {kycStatusref.current == 1 ? (
                    <>
                      <div className="w-full bg-black p-4 sm:p-6 text-white rounded-xl shadow-lg">
                        {/* Steps Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary text-[#181a20] px-2 py-0.5 rounded text-sm font-bold">
                                1
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Select the Crypto")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Select crypto & network for withdraw")}
                            </p>
                          </div>
                          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-[#181a20] rounded text-sm font-bold">
                                2
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Confirm Address")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Paste the copied withdrawal address.")}
                            </p>
                          </div>
                          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-[#181a20] rounded text-sm font-bold">
                                3
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Transfer Confirmation")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Await blockchain transfer confirmation.")}
                            </p>
                          </div>
                          <div className="bg-[#181a20] border border-gray-800 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-primary px-2 py-0.5 text-[#181a20] rounded text-sm font-bold">
                                4
                              </span>
                              <h3 className="text-primary font-medium text-sm">
                                {t("Successful Withdrawal")}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-400">
                              {t("Blockchain transfer confirmed successfully.")}
                            </p>
                          </div>
                        </div>

                        {/* <div className="flex flex-col lg:flex-row gap-10">
                          <div className="flex-[2]">
                            <div className="relative pl-8 sm:pl-10 border-l-[2px] border-[#2b3139] ml-4 space-y-12 pb-8"> */}
                        {/* Step 1 */}
                        {/* <div className="relative">
                                <div className="absolute -left-[54px] sm:-left-[62px] top-0 bg-primary p-[6px] rounded-md">
                                  <svg
                                    className="w-5 h-5 text-[#181a20]"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zm-2 5v5a2 2 0 002 2h12a2 2 0 002-2V9H2zm2 3h2v2H4v-2z"></path>
                                  </svg>
                                </div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Select Crypto")}
                                </h3>

                                <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom max-w-lg">
                                  <Dropdown
                                    placeholder={t("selectacoin")}
                                    fluid
                                    className="dep-drops w-full bg-transparent text-white border-0"
                                    selection
                                    options={allCurrencyref.current}
                                    onChange={(e, data) => {
                                      const selectedOption =
                                        allCurrencyref.current.find(
                                          (option) =>
                                            option.value === data.value,
                                        );
                                      onSelect(selectedOption);
                                    }}
                                    search={(options, query) => {
                                      return options.filter((opt) => {
                                        const q = query.toLowerCase();
                                        return (
                                          (opt.searchSymbol &&
                                            opt.searchSymbol
                                              .toLowerCase()
                                              .includes(q)) ||
                                          (opt.searchName &&
                                            opt.searchName
                                              .toLowerCase()
                                              .includes(q))
                                        );
                                      });
                                    }}
                                    disabled={show_otpref.current == true}
                                  />
                                </div>
                                {withdrawcurrencyValidate && (
                                  <span className="text-red-500 text-sm mt-1 block px-2">
                                    {validationnErr.withdrawcurrency}
                                  </span>
                                )}
                              </div> */}

                        {/* Step 2 */}
                        {/* <div className="relative">
                                <div className="absolute -left-[54px] sm:-left-[62px] top-0 bg-primary p-[6px] rounded-md z-10">
                                  <svg
                                    className="w-5 h-5 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    ></path>
                                  </svg>
                                </div>
                                <div className="absolute -left-[33px] sm:-left-[41px] top-6 bottom-[-60px] w-[2px] bg-primary z-0"></div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Withdraw To")}
                                </h3>
                                </div> */}

                        <div className="flex flex-col lg:flex-row gap-10">
                          <div className="rounded-2xl bg-black p-4 border border-gray shadow-xl w-7/12  sm:p-5">
                            <VerticalStepper
                              steps={withdrawSteps}
                              currentStep={withdrawCurrentStep}
                              className="ml-2 pb-8"
                            />
                            {/* {show_otpref.current == false &&
                                  currentcurrencyref.current?.currencyType ==
                                    "2" && (
                                    <div className="mb-4 max-w-lg mt-6">
                                      <label className="text-[13px] text-gray-500 mb-1 block px-1">
                                        {t("Network")}
                                      </label>
                                      <div className="bg-[#181a20] border border-gray-800 rounded-lg p-1 withdrawal-dropdown-custom">
                                        <Dropdown
                                          placeholder={t(
                                            "Please select a withdrawal network",
                                          )}
                                          fluid
                                          className="dep-drops w-full bg-transparent text-white border-0"
                                          selection
                                          options={network_currencyref.current}
                                          onChange={(e, data) => {
                                            const selectedOption =
                                              network_currencyref.current.find(
                                                (option) =>
                                                  option.value === data.value,
                                              );
                                            onSelect_network(selectedOption);
                                          }}
                                          isSearchable={true}
                                          disabled={show_otpref.current == true}
                                        />
                                      </div>
                                      {withdrawnetworkValidateref.current && (
                                        <span className="text-red-500 text-sm mt-1 block px-2">
                                          {validationnErr.withdrawnetwork}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                {withdrawType == "1" && (
                                  <div className="max-w-lg mt-6">
                                    <div className="flex justify-between items-end mb-1 px-1">
                                      <label className="text-[13px] text-gray-500">
                                        {t("Address")}
                                      </label>
                                      <div
                                        className="text-[13px] text-primary hover:text-[#b58a23] cursor-pointer transition-colors"
                                        onClick={addresshides}
                                      >
                                        {t("Manage Address")}
                                      </div>
                                    </div>
                                    <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center p-1 px-3">
                                      <input
                                        type="text"
                                        placeholder={t(
                                          "Please enter your withdraw address",
                                        )}
                                        className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px]"
                                        maxLength={60}
                                        onKeyDown={handlekeydown}
                                        disabled={show_otpref.current == true}
                                        value={withdrawAddressref.current || ""}
                                        onChange={onSelect_address}
                                      />
                                      {withdrawAddressref.current && (
                                        <button
                                          className="text-gray-500 hover:text-white p-2"
                                          onClick={() => {
                                            setwithdrawAddress("");
                                            if (withdrawAddressref)
                                              withdrawAddressref.current = "";
                                          }}
                                        >
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
                                              d="M6 18L18 6M6 6l12 12"
                                            ></path>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    {withAddressValidate && (
                                      <span className="text-red-500 text-sm mt-1 block px-2">
                                        {validationnErr.withAddress}
                                      </span>
                                    )}
                                  </div>
                                )} */}
                          </div>

                          {/* Step 3 */}
                          {/* <div className="relative">
                                <div className="absolute -left-[54px] sm:-left-[62px] top-0 bg-primary p-[6px] rounded-md">
                                  <svg
                                    className="w-5 h-5 text-[#181a20]"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="0"
                                  >
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
                                    <path d="M7 12h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2zM7 7h10v3H7z"></path>
                                  </svg>
                                </div>
                                <h3 className="text-white font-medium mb-4 text-lg">
                                  {t("Withdraw Amount")}
                                </h3>

                                <div className="max-w-xl">
                                  <div className="flex justify-between items-end mb-2 mt-4 px-1">
                                    <label className="text-sm text-gray-500">
                                      {t("Amount")}
                                    </label>
                                    <div className="text-sm text-gray-400">
                                      {t("Available Balance")}:{" "}
                                      <span className="text-gray-300 font-medium">
                                        {balanceref.current.balance
                                          ? balanceref.current.balance.toFixed(
                                              6,
                                            )
                                          : "0"}{" "}
                                        {currencyref.current}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-2">
                                    <input
                                      type="text"
                                      pattern="[0-9]*"
                                      maxLength={8}
                                      onKeyDown={(evt) => {
                                        if (
                                          !(
                                            (evt.key >= "0" &&
                                              evt.key <= "9") ||
                                            evt.key === "." ||
                                            evt.key === "Backspace" ||
                                            evt.key === "Delete" ||
                                            evt.key === "ArrowLeft" ||
                                            evt.key === "ArrowRight" ||
                                            evt.key === "Tab"
                                          )
                                        ) {
                                          evt.preventDefault();
                                        }
                                      }}
                                      autoComplete="off"
                                      name="amount"
                                      value={amount}
                                      disabled={show_otpref.current == true}
                                      onChange={(e) => {
                                        if (e.target.value >= 0)
                                          handleChange(e);
                                      }}
                                      onInput={(evt) => {
                                        if (
                                          evt.target.value.split(".").length > 2
                                        )
                                          evt.target.value =
                                            evt.target.value.slice(0, -1);
                                      }}
                                      placeholder={`${t("Minimum withdrawal amount")}: ${currentcurrencyref.current?.minWithdrawLimit || "0.01"} ${currencyref.current || ""}`}
                                      className="bg-transparent border-0 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px] outline-none"
                                    />
                                    <span className="text-white font-medium ml-2 h-full items-center flex">
                                      {currencyref.current}
                                    </span>
                                  </div>
                                  {amountValidate && (
                                    <span className="text-red-500 text-sm mt-1 block px-2">
                                      {validationnErr.amount}
                                    </span>
                                  )}

                                  <div className="flex justify-between items-end mb-2 mt-6 px-1">
                                    <label className="text-sm text-gray-500">
                                      {t("Remarks (optional)")}
                                    </label>
                                  </div>
                                  <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-2">
                                    <input
                                      type="text"
                                      placeholder={t(
                                        "e.g. Purpose of withdrawal",
                                      )}
                                      disabled={show_otpref.current == true}
                                      className="bg-transparent border-0 w-full text-white placeholder-gray-500 focus:outline-none focus:ring-0 py-2 h-[44px] text-[15px] outline-none"
                                    />
                                  </div>

                                  {/* OTP and 2FA Inputs when show_otp is true */}
                          {/* {show_otpref.current == true && (
                                    <div className="mb-4 mt-6">
                                      <label className="text-sm text-gray-500 mb-1 block px-1">
                                        {t("withdrawOTP")}
                                      </label>
                                      <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-1">
                                        <input
                                          type="text"
                                          autoComplete="off"
                                          placeholder={t("EnterWithdrawOTP")}
                                          name="withdraw_otp"
                                          value={withdraw_otp}
                                          maxLength={4}
                                          onInput={(e) => {
                                            e.target.value =
                                              e.target.value.replace(
                                                /[^0-9]/g,
                                                "",
                                              );
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              [
                                                "e",
                                                "E",
                                                "+",
                                                "-",
                                                ".",
                                              ].includes(e.key)
                                            )
                                              e.preventDefault();
                                          }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            if (
                                              value >= 0 &&
                                              value.length <= 6
                                            ) {
                                              const formData = {
                                                ...formValue,
                                                [e.target.name]: value,
                                              };
                                              setFormValue(formData);
                                              validate(formData);
                                              validate_preview(formData);
                                            }
                                          }}
                                          className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] outline-none"
                                        />
                                      </div>
                                      {otpValidate && (
                                        <span className="text-red-500 text-sm mt-1 block px-2">
                                          {validationnErr.withdraw_otp}
                                        </span>
                                      )}
                                      <div className="text-right text-xs mt-2 px-1">
                                        <span className="text-gray-400">
                                          {t("Didntreceivecode?")}{" "}
                                        </span>
                                        {resendClick == false ? (
                                          isResendVisible ? (
                                            <button
                                              onClick={handleResend}
                                              className="text-primary hover:text-yellow-400 cursor-pointer"
                                            >
                                              {t("resend")}
                                            </button>
                                          ) : (
                                            <span className="text-primary">
                                              {counter}s
                                            </span>
                                          )
                                        ) : (
                                          <i className="fa-solid fa-circle-notch fa-spin text-primary px-2"></i>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {show_otpref.current == true &&
                                    (sessionStorage.getItem("tfa_status") ==
                                      0 ||
                                      sessionStorage.getItem("tfa_status") ==
                                        1) && (
                                      <div className="mb-4 mt-4">
                                        <label className="text-sm text-gray-500 mb-1 block px-1">
                                          {t("2FAVerificationCode")}
                                        </label>
                                        <div className="bg-[#181a20] border border-gray-800 rounded-lg flex items-center px-4 py-1 mb-1">
                                          <input
                                            type="text"
                                            autoComplete="off"
                                            maxLength={6}
                                            name="tfa"
                                            value={tfa}
                                            placeholder={t("Enter2FACode")}
                                            onKeyDown={(e) => {
                                              if (
                                                [
                                                  "e",
                                                  "E",
                                                  "+",
                                                  "-",
                                                  ".",
                                                ].includes(e.key)
                                              )
                                                e.preventDefault();
                                            }}
                                            onInput={(e) => {
                                              e.target.value =
                                                e.target.value.replace(
                                                  /[^0-9]/g,
                                                  "",
                                                );
                                            }}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              if (
                                                value >= 0 &&
                                                value.length <= 6
                                              ) {
                                                const formData = {
                                                  ...formValue,
                                                  [e.target.name]: value,
                                                };
                                                setFormValue(formData);
                                                validate(formData);
                                                validate_preview(formData);
                                              }
                                            }}
                                            className="bg-transparent border-0 w-full text-white placeholder-gray-600 focus:outline-none focus:ring-0 py-2 h-[44px] outline-none"
                                          />
                                        </div>
                                        {tfaValidate && (
                                          <span className="text-red-500 text-sm mt-1 block px-2">
                                            {validationnErr.tfa}
                                          </span>
                                        )}
                                      </div>
                                    )} */}

                          {/* Total and Fee */}
                          {/* <div className="mt-14 text-right flex flex-col items-end px-1">
                                    <div className="text-[22px] font-bold text-white tracking-wide">
                                      {amount &&
                                      !isNaN(amount) &&
                                      currentcurrencyref.current
                                        ? parseFloat(amount) -
                                            parseFloat(
                                              currentcurrencyref.current
                                                .withdrawFee || 0,
                                            ) >
                                          0
                                          ? String(
                                              Number(
                                                (
                                                  parseFloat(amount) -
                                                  parseFloat(
                                                    currentcurrencyref.current
                                                      .withdrawFee || 0,
                                                  )
                                                ).toFixed(6),
                                              ),
                                            ) + " "
                                          : "0.00 "
                                        : "--"}
                                      <span>{currencyref.current}</span>
                                    </div>
                                    <div className="text-[13px] text-gray-500 mt-1 flex items-center gap-1">
                                      {t("Fee")}:{" "}
                                      {currentcurrencyref.current
                                        ?.withdrawFee || "0"}{" "}
                                      {currencyref.current}
                                      <svg
                                        className="w-[14px] h-[14px] ml-0.5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                      </svg>
                                    </div>
                                  </div> */}

                          {/* Action Button */}
                          {/* <div className="mt-3">
                                    {buttonLoader == false ? (
                                      sessionStorage.getItem("tfa_status") ==
                                      0 ? (
                                        <button
                                          onClick={() => nav_page("/enabletfa")}
                                          className="w-full bg-primary text-white font-semibold py-[14px] rounded-lg hover:bg-[#b58a23] transition-colors"
                                        >
                                          {t("Submit")}
                                        </button>
                                      ) : show_otpref.current == true ? (
                                        <button
                                          onClick={() => withdrawSubmit()}
                                          className="w-full bg-primary text-white font-semibold py-[14px] rounded-lg hover:bg-[#b58a23] transition-colors"
                                        >
                                          {t("Submit")}
                                        </button>
                                      ) : show_otpref.current == false ? (
                                        <button
                                          onClick={() => withdrawPreview()}
                                          disabled={
                                            !currentcurrencyref.current ||
                                            !amount ||
                                            isNaN(amount) ||
                                            amount <= 0 ||
                                            (currentcurrencyref.current
                                              ?.currencyType == "2" &&
                                              !network_currentref.current) ||
                                            (withdrawType == "1" &&
                                              (!withdrawAddressref.current ||
                                                withdrawAddressref.current.trim() ===
                                                  ""))
                                          }
                                          className={`w-full font-semibold py-[14px] rounded-lg transition-colors ${
                                            !currentcurrencyref.current ||
                                            !amount ||
                                            isNaN(amount) ||
                                            amount <= 0 ||
                                            (currentcurrencyref.current
                                              ?.currencyType == "2" &&
                                              !network_currentref.current) ||
                                            (withdrawType == "1" &&
                                              (!withdrawAddressref.current ||
                                                withdrawAddressref.current.trim() ===
                                                  ""))
                                              ? "bg-[#2b3139] text-[#5e6673] cursor-not-allowed"
                                              : "bg-primary text-white hover:bg-[#b58a23]"
                                          }`}
                                        >
                                          {t("Submit")}
                                        </button>
                                      ) : null
                                    ) : (
                                      <button
                                        disabled
                                        className="w-full bg-[#2b3139] text-[#5e6673] font-semibold py-[14px] rounded-lg flex justify-center items-center gap-2 cursor-not-allowed"
                                      >
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>{" "}
                                        {t("Loading")}...
                                      </button>
                                    )}
                                  </div> */}

                          {/* Bottom limits note */}
                          {/* <div className="mt-4 text-left px-1">
                                    <p className="text-[13px] text-gray-500">
                                      {t("24-hour withdrawal limit")}: 0/
                                      {currentcurrencyref.current
                                        ?.maxWithdrawLimit || "0"}{" "}
                                      {currencyref.current || "BTC"}
                                    </p>
                                  </div> */}

                          {/* </div> */}
                          {/* </div> */}

                          {/* Right column content: Tips & FAQs */}
                          <div className="rounded-2xl bg-black p-4 border border-gray shadow-xl w-5/12  sm:p-5">
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
                            </h3>
                            <div className="flex flex-col gap-6 text-[13px] text-gray-400">
                              <p className="leading-relaxed">
                                For the safety of your funds, our customer
                                support team may contact you by phone to confirm
                                your withdrawal
                              </p>
                              <p className="leading-relaxed">
                                For the safety of your funds, our customer
                                support team may contact you by phone to confirm
                                your withdrawal
                              </p>
                              <p className="leading-relaxed">
                                For the safety of your funds, our customer
                                support team may contact you by phone to confirm
                                your withdrawal
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-6 border-t border-gray-800 pt-6">
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
                                <span className="text-gray-500 text-xs cursor-pointer hover:text-primary transition-colors font-medium">
                                  View more &gt;
                                </span>
                              </div>
                              <div className="flex flex-col gap-5 text-sm text-gray-400">
                                <div className="flex items-start gap-4 cursor-pointer hover:text-gray-200 transition-colors">
                                  <svg
                                    className="w-5 h-5 text-gray-500 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    ></path>
                                  </svg>
                                  <span className="flex-1">
                                    How long do withdrawals take?
                                  </span>
                                </div>
                                <div className="flex items-start gap-4 cursor-pointer hover:text-gray-200 transition-colors">
                                  <svg
                                    className="w-5 h-5 text-gray-500 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    ></path>
                                  </svg>
                                  <span className="flex-1">
                                    Why was my withdrawal rejected?
                                  </span>
                                </div>
                                <div className="flex items-start gap-4 cursor-pointer hover:text-gray-200 transition-colors">
                                  <svg
                                    className="w-5 h-5 text-gray-500 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    ></path>
                                  </svg>
                                  <span className="flex-1">
                                    Can I cancel a withdrawa...
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="dashboard_table">
                          <div className="staking-flex dash_assets">
                            <h5 className="opt-title">{t("RecentWithdraw")}</h5>
                            <Link to="/withdrawHistory">
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
                                    {t("Fees")}
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
                                {withdrawHistory &&
                                withdrawHistory.length > 0 ? (
                                  withdrawHistory.slice(0, 5).map((item, i) => {
                                    return (
                                      <tr>
                                        <td className="opt-percent font_14 pad-left-23">
                                          {item.currency}
                                        </td>
                                        <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                          {parseFloat(item.amount).toFixed(6)}
                                        </td>
                                        <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                          {parseFloat(item.fees).toFixed(6)}
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                          {item.txn_id == "--------" ? (
                                            "--------"
                                          ) : (
                                            <>
                                              {item.txn_id.substring(0, 10)} ...
                                            </>
                                          )}{" "}
                                          <i
                                            class="ri-file-copy-line text-yellow"
                                            onClick={() => copy(item.txn_id)}
                                            style={{ cursor: "pointer" }}
                                          ></i>
                                        </td>
                                        <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                          {Moment(item.created_at).format(
                                            "lll",
                                          )}
                                        </td>
                                        <td className="opt-btn-flex table-action pad-left-23 text-green text-center">
                                          {item.status == "Cancelled" ? (
                                            <span className="text-red">
                                              {t("cancelled")}
                                            </span>
                                          ) : item.status == "Pending" ? (
                                            <span className="text-yellow">
                                              {t("pending")}
                                            </span>
                                          ) : (
                                            <span className="text-green">
                                              {t("completed")}
                                            </span>
                                          )}
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
                                      {/* <div className="empty_data">
                                        <div className="empty_data_img">
                                          <img
                                            src={require("../assets/No-data.webp")}
                                            width="100px"
                                          />
                                        </div>
                                        <div className="no_records_text"> */}
                                          {t("noRecordsFound")}
                                        {/* </div>
                                      </div> */}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                          <div className="flex flex-col lg:flex-row gap-6  ">
                            <div className="w-full lg:w-7/12 ">
                        <div className="p2p_title">{t("withdraw")}</div>
                        <div className="col-lg-7">
                          <div className="deposit mt-5  h-100">
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
                                  <h6>
                                    {t("doublecheckthedestinationaddress")}
                                  </h6>
                                  <p>{t("makesuretheaddress")}</p>
                                </div>
                                <div className="imp-notes-content">
                                  <h6>{t("verifywithdrawaldetails")}</h6>
                                  <p>{t("confirmtheamount")}</p>
                                </div>
                                <div className="imp-notes-content">
                                  <h6>{t("Security")}</h6>
                                  <p>{t("ensurethatyouraccount")}</p>
                                </div>
                                <div className="imp-notes-content">
                                  <h6>{t("networkverification")}</h6>
                                  <p>{t("doublecheckyournetwork")}</p>
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
                  <div className="p2p_title">{t("withdraw")}</div>
                  <div className="col-lg-7">
                    <div className="deposit mt-5 h-100">
                      <div className="dep-kyc">
                        <div className="dep-kyc-head">
                          <img
                            src={WARNICON}
                            alt="warn-icon"
                            className="deposit-imp-icon"
                          />
                          <h6>{t("withdrawalsTemporarilyUnavailable")}</h6>
                        </div>
                        {/* <p>
                            Due to ongoing platform maintenance, withdrawals are
                            currently restricted. We apologize for any
                            inconvenience this may cause. Our team is working
                            diligently to restore full service as soon as
                            possible.
                          </p> */}
                        <p>{siteData.withdrawalMaintenance}</p>
                        <p className="my-3">
                          {/* {withdrawContent} */}
                          {/* <span className="text-yellow">00:00:00</span> */}
                        </p>
                        <div>
                          <img
                            src={require("../assets/withdraw-unavailable.webp")}
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
            </div>{" "}
          </section>
        )}
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
