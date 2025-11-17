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
     usePageLeaveConfirm(
       "Are you sure you want to leave Withdrawal?",
       "/withdraw",
       true,
       []
     );

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
            text: data[i].currencySymbol,
            image: { avatar: true, src: data[i].Currency_image },
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
      (x) => x._id == option.value
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
        setcurrency(option.text);
        setcointype(option.coinType);
        setnet_current("");
        // getAddress();
        console.log(allCryptoref.current, "===");
        console.log(option.value, "===");
        let indexData = allCryptoref.current.findIndex(
          (x) => x._id === option.value
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
      currentcurrencyref.current.currencyType
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
      "=-=-=-=option=-=-=-=-=option=-=-=-option=-=-="
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
                        " amount"
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount"
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
                        " amount"
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount"
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
                      " amount"
                  );
                } else if (
                  currentcurrency.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      currentcurrency.maxWithdrawLimit +
                      " amount"
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
                        " amount"
                    );
                  } else if (
                    currentcurrency.maxWithdrawLimit < formValue.amount
                  ) {
                    showerrorToast(
                      "Please enter less than " +
                        currentcurrency.maxWithdrawLimit +
                        " amount"
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
                    " amount"
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount"
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
                      " amount"
                  );
                } else if (
                  currentcurrency.maxWithdrawLimit < formValue.amount
                ) {
                  showerrorToast(
                    "Please enter less than " +
                      currentcurrency.maxWithdrawLimit +
                      " amount"
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
                    " amount"
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount"
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
                    " amount"
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount"
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
                    " amount"
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount"
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
                    " amount"
                );
              } else if (currentcurrency.maxWithdrawLimit < formValue.amount) {
                showerrorToast(
                  "Please enter less than " +
                    currentcurrency.maxWithdrawLimit +
                    " amount"
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
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-2 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 padin_lefrig_dash">
                <section className="asset_section">
                  {withdrawstatus == "Active" ? (
                    <>
                      {kycStatusref.current == 1 ? (
                        <>
                          <div className="row">
                            <div className="p2p_title">{t("withdraw")}</div>
                            <div className="col-lg-7">
                              <div className="deposit mt-5">
                                <div className="form_div">
                                  <div className="sides">
                                    <div className="w-100 rights">
                                      <h6>{t("selectacoin")}</h6>
                                      <Dropdown
                                        placeholder={t("selectacoin")}
                                        fluid
                                        className="dep-drops"
                                        selection
                                        options={allCurrencyref.current}
                                        // onChange={onSelect}
                                        onChange={(e, data) => {
                                          const selectedOption =
                                            allCurrencyref.current.find(
                                              (option) =>
                                                option.value === data.value
                                            );
                                          onSelect(selectedOption);
                                        }}
                                        // defaultValue={currencyref.current==""  || currencyref.current==null || currencyref.current==undefined ?"":currencyref.current}
                                        isSearchable={true}
                                        disabled={show_otpref.current == true}
                                      />
                                      {withdrawcurrencyValidate == true ? (
                                        <span className="errorcss">
                                          {" "}
                                          {validationnErr.withdrawcurrency}{" "}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {show_otpref.current == false &&
                                currentcurrencyref.current.currencyType ==
                                  "2" ? (
                                  <div className="form_div">
                                    <div className="sides">
                                      <div className="w-100 rights">
                                        <h6>{t("Chooseanetwork")}</h6>
                                        <Dropdown
                                          placeholder={t("SelectanNetwork")}
                                          fluid
                                          className="dep-drops"
                                          selection
                                          options={network_currencyref.current}
                                          onChange={(e, data) => {
                                            const selectedOption =
                                              network_currencyref.current.find(
                                                (option) =>
                                                  option.value === data.value
                                              );
                                            onSelect_network(selectedOption);
                                          }}
                                          // onChange={onSelect_network}
                                          // defaultValue={net_defaultref.current}
                                          isSearchable={true}
                                          disabled={show_otpref.current == true}
                                        />
                                        {withdrawnetworkValidateref.current ==
                                        true ? (
                                          <span className="errorcss ">
                                            {" "}
                                            {
                                              validationnErr.withdrawnetwork
                                            }{" "}
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {withdrawType == "1" ? (
                                  <div className="form_div ">
                                    <h6>{t("address")}</h6>
                                    <input
                                      type="text"
                                      placeholder={t("Entertheaddress")}
                                      fluid
                                      maxLength={60}
                                      onKeyDown={handlekeydown}
                                      disabled={show_otpref.current == true}
                                      className="dep-drops"
                                      value={
                                        withdrawAddressref.current == "" ||
                                        withdrawAddressref.current == null ||
                                        withdrawAddressref.current == undefined
                                          ? ""
                                          : withdrawAddressref.current
                                      }
                                      onChange={onSelect_address}
                                    />
                                    {withAddressValidate == true ? (
                                      <span className="errorcss mt-0">
                                        {" "}
                                        {validationnErr.withAddress}{" "}
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                ) : (
                                  ""
                                )}

                                <div className="form_div mar-bot boder-none ">
                                  <h6>{t("amount")}</h6>
                                  <input
                                    type="text"
                                    pattern="[0-9]*"
                                    maxLength={8}
                                    onKeyDown={(evt) => {
                                      // Prevent non-numeric characters and symbols
                                      if (
                                        !(
                                          (
                                            (evt.key >= "0" &&
                                              evt.key <= "9") || // Allow number keys
                                            evt.key === "." || // Allow decimal point
                                            evt.key === "Backspace" || // Allow backspace
                                            evt.key === "Delete" || // Allow delete
                                            evt.key === "ArrowLeft" || // Allow left arrow key
                                            evt.key === "ArrowRight" || // Allow right arrow key
                                            evt.key === "Tab"
                                          ) // Allow tab key
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
                                      const value = e.target.value;
                                      // Allow only values greater than or equal to 0
                                      if (value >= 0) {
                                        handleChange(e); // Call your handleChange to update the state
                                      }
                                    }}
                                    onInput={(evt) => {
                                      // Prevent more than one decimal point
                                      if (
                                        evt.target.value.split(".").length > 2
                                      ) {
                                        evt.target.value =
                                          evt.target.value.slice(0, -1);
                                      }
                                    }}
                                    placeholder={t("Entertheamount")}
                                    fluid
                                    className="dep-drops"
                                  />

                                  {amountValidate == true ? (
                                    <span className="errorcss mt-0">
                                      {" "}
                                      {validationnErr.amount}{" "}
                                    </span>
                                  ) : (
                                    ""
                                  )}

                                  {show_otpref.current == true ? (
                                    <>
                                      <div className="form_div p-0 mt-3">
                                        <h6>{t("withdrawOTP")}</h6>
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
                                                ""
                                              ); // Allows only numbers
                                          }}
                                          onKeyDown={(e) => {
                                            if (
                                              [
                                                "e",
                                                "E",
                                                "+",
                                                "-",
                                                ".",
                                              ].includes(e.key) // Prevent non-numeric characters
                                            ) {
                                              e.preventDefault();
                                            }
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
                                              validate(formData); // Calling your validate function with updated form data
                                              validate_preview(formData);
                                            }
                                          }}
                                          className="dep-drops"
                                        />
                                        {otpValidate === true && (
                                          <span className="errorcss mt-0">
                                            {validationnErr.withdraw_otp}
                                          </span>
                                        )}
                                        <span className="text-end text-white w-100 px-1">
                                          {t("Didntreceivecode?")}
                                          <a>
                                            {resendClick == false ? (
                                              <>
                                                {isResendVisible ? (
                                                  <span
                                                    onClick={handleResend}
                                                    className="cursor-pointer"
                                                  >
                                                    <a className="text-yellow">
                                                      {" "}
                                                      {t("resend")}
                                                    </a>
                                                  </span>
                                                ) : (
                                                  <span className="text-yellow">
                                                    {" "}
                                                    {counter}s
                                                  </span>
                                                )}
                                              </>
                                            ) : (
                                              <i class="fa-solid fa-circle-notch fa-spin text-yellow px-2"></i>
                                            )}
                                          </a>
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {/* {withdrawType == "1" ? ( */}
                                  {show_otpref.current == true ? (
                                    <>
                                      {sessionStorage.getItem("tfa_status") ==
                                        0 || 1 ? (
                                        <>
                                          <div className="form_div p-0 mt-4">
                                            <h6>{t("2FAVerificationCode")}</h6>
                                            <input
                                              type="text"
                                              autoComplete="off"
                                              maxLength={6}
                                              name="tfa"
                                              autocomplete="off"
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
                                                  ].includes(e.key) // Prevent non-numeric characters
                                                ) {
                                                  e.preventDefault();
                                                }
                                              }}
                                              onInput={(e) => {
                                                e.target.value =
                                                  e.target.value.replace(
                                                    /[^0-9]/g,
                                                    ""
                                                  ); // Allows only numbers
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
                                                  validate(formData); // Calling your validate function with updated form data
                                                  validate_preview(formData);
                                                }
                                              }}
                                              className="dep-drops"
                                            />
                                            {tfaValidate === true && (
                                              <span className="errorcss mt-0">
                                                {validationnErr.tfa}
                                              </span>
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {currentcurrencyref.current ? (
                                    <>
                                      {/* {currentcurrencyref.current.currencySymbol == "USDT" ? (
                                      <div className="fees_content mt-4">
                                        <h4>{t("Fees")}</h4>
                                        <p>
                                          {currentcurrencyref.current
                                            .withdrawFee_usdt
                                            ? currentcurrencyref.current
                                                .withdrawFee_usdt
                                            : "0.0"}{" "}
                                             {currencyref.current}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="fees_content mt-4">
                                        <h4>{t("Fees")}</h4>
                                        <p>
                                          {currentcurrencyref.current
                                            .withdrawFee
                                            ? currentcurrencyref.current
                                                .withdrawFee
                                            : "0.0"}{" "}
                                          %
                                        </p>
                                      </div>
                                    )} */}

                                      <div className="fees_content mt-4">
                                        <h4>{t("Fees")}</h4>
                                        <p>
                                          {currentcurrencyref.current
                                            .withdrawFee
                                            ? currentcurrencyref.current
                                                .withdrawFee
                                            : "0.0"}{" "}
                                        </p>
                                      </div>

                                      <div className="fees_content ">
                                        <h4>{t("availablebalance")}</h4>
                                        <p>
                                          {balanceref.current.balance
                                            ? balanceref.current.balance.toFixed(
                                                6
                                              )
                                            : "0.0"}{" "}
                                          {currencyref.current}
                                        </p>
                                      </div>
                                      <div className="fees_content ">
                                        <h4>{t("Minimumwithdraw")}</h4>
                                        <p>
                                          {currentcurrencyref.current
                                            .minWithdrawLimit
                                            ? currentcurrencyref.current
                                                .minWithdrawLimit
                                            : "0.0"}{" "}
                                          {currencyref.current}
                                        </p>
                                      </div>
                                      <div className="fees_content">
                                        <h4>{t("Maximumwithdraw")}</h4>
                                        <p>
                                          {currentcurrencyref.current
                                            .maxWithdrawLimit
                                            ? currentcurrencyref.current
                                                .maxWithdrawLimit
                                            : "0.0"}{" "}
                                          {currencyref.current}
                                        </p>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {buttonLoader == false ? (
                                    <div className="sumbit_btn">
                                      {sessionStorage.getItem("tfa_status") ==
                                      0 ? (
                                        <button
                                          onClick={() => nav_page("/enabletfa")}
                                        >
                                          {t("Enable2FA")}
                                        </button>
                                      ) : show_otpref.current == true ? (
                                        <button
                                          onClick={() => withdrawSubmit()}
                                        >
                                          {t("submit")}
                                        </button>
                                      ) : show_otpref.current == false ? (
                                        <button
                                          onClick={() => withdrawPreview()}
                                        >
                                          {t("next")}
                                        </button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    <div className="sumbit_btn">
                                      <button> {t("Loading")}...</button>
                                    </div>
                                  )}
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
                          <div className="dashboard_table">
                            <div className="staking-flex dash_assets">
                              <h5 className="opt-title">
                                {t("RecentWithdraw")}
                              </h5>
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
                                    withdrawHistory
                                      .slice(0, 5)
                                      .map((item, i) => {
                                        return (
                                          <tr>
                                            <td className="opt-percent font_14 pad-left-23">
                                              {item.currency}
                                            </td>
                                            <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                              {parseFloat(item.amount).toFixed(
                                                6
                                              )}
                                            </td>
                                            <td className="opt-percent font_14 table_center_text pad-left-23 nowra_txt">
                                              {parseFloat(item.fees).toFixed(6)}
                                            </td>
                                            <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                              {item.txn_id == "--------" ? (
                                                "--------"
                                              ) : (
                                                <>
                                                  {item.txn_id.substring(0, 10)}{" "}
                                                  ...
                                                </>
                                              )}{" "}
                                              <i
                                                class="ri-file-copy-line text-yellow"
                                                onClick={() =>
                                                  copy(item.txn_id)
                                                }
                                                style={{ cursor: "pointer" }}
                                              ></i>
                                            </td>
                                            <td className="opt-term font_14 table_center_text pad-left-23 nowra_txt">
                                              {Moment(item.created_at).format(
                                                "lll"
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
                                        colSpan={5}
                                        className="text-center py-5"
                                      >
                                        <div className="empty_data">
                                          <div className="empty_data_img">
                                            <img
                                              src={require("../assets/No-data.webp")}
                                              width="100px"
                                            />
                                          </div>
                                          <div className="no_records_text">
                                            {t("noRecordsFound")}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="row ">
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
                              </div>
                            </div>
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
