import React, { useEffect, useRef } from "react";
import Header from "./Header";
import "react-phone-input-2/lib/style.css";
import Side_bar from "./Side_bar";
import {
  getMethod,
  postMethod,
  createcheck,
  updatePaymentStatus,
} from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Moment from "moment";
import ICON from "../assets/deposit-imp.png";
import WARNICON from "../assets/icons/withdraw-warn.webp";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(
  // "pk_test_51QeAhuFMARC91de4r6DKi6KzNLIZ2vLG2p9ymEYVLpeIYxpaY4yA9zlFDqSeX7qoCnq8LHENJcpHGf4F1elrO6J400iIk60EOO"
  "pk_test_51RnaEAGbtb4pkuNeCDlH6zQnbn96Ax8kJ8bJtttZOBlvNYjj5TCdwB6qECPVm3ERhkl4JYzlBQIDNLCJTEoxqvhd00q6kdprwm"
); // Publishable Key

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedSessionRef = useRef(false);

  const [siteLoader, setSiteLoader] = useState(true);

  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCurrencyFiat, setallCurrencyFiat, allCurrencyrefFiat] = useState(
    []
  );
  const [allCrypto, setallCrypto, allCryptoref] = useState([]);
  const [currency, setcurrency, currencyref] = useState("");
  const [currencyfiat, setcurrencyfiat, currencyreffiat] = useState("");
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
  const [withdrawstatus, setWithdrawStatus] = useState("");

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
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [amountValidate, setamountValidate] = useState(false);
  const [withAddressValidate, setwithAddress] = useState(false);
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
    getAllcurrencys();
    // getSiteSettingstatus();
    var status = localStorage.getItem("withdraw_status");
    if (status == null) {
      localStorage.setItem("withdraw_status", false);
    }
    if (status == "false") {
      setalertTab("show");
    } else {
      setalertTab("remove");
    }
  }, [0]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get("session_id");

    if (sessionId && !hasProcessedSessionRef.current) {
      updatePaymentStatusnew(sessionId);
      hasProcessedSessionRef.current = true; // Flag as processed
    }
  }, [location.search]);

  const updatePaymentStatusnew = async (sessionId) => {
    try {
      console.log("Session ID:", sessionId); // Debug log

      const data = {
        apiUrl: apiService.updatecheckout,
        sessionId: sessionId,
      };

      const response = await updatePaymentStatus(data);

      if (response.status) {
        showsuccessToast("Payment updated successfully");
        navigate("/checkout");
      } else {
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      navigate("/checkout");
    }
  };

  // Function to handle showing the payment form with data
  const handleShowPaymentForm = async (amount) => {
    //console.log(`Amount: ${amount}, ID: ${id}, Currency: ${currency}`);

    try {
      var data = {
        apiUrl: apiService.createchekout,
        paymentAmount: amount,
        currencySymbol: "EUR",
      };

      var response = await createcheck(data);

      // Check for a valid URL response
      if (response.data.url) {
        const stripe = await stripePromise;

        stripe.redirectToCheckout({ sessionId: response.data.id });
      }
    } catch (error) {
      console.error(
        "Error during payment process:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate(formData);
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
      // for (var i = 0; i < data.length; i++) {
      //   if (data[i].withdrawStatus == "Active") {
      //     var obj = {
      //       value: data[i]._id,
      //       label: "INR",
      //       coinType: data[i].coinType,
      //       key: data[i]._id,
      //       text: "Indian Rupee",
      //       image: { avatar: true, src: "https://res.cloudinary.com/daafoiwvn/image/upload/v1726234507/amckvjzk5cvbpwigeg3o.png" },
      //       erc20token: data[i].erc20token,
      //       bep20token: data[i].bep20token,
      //       trc20token: data[i].trc20token,
      //       rptc20token: data[i].rptc20token,
      //     };
      //     currArrayCrypto.push(obj);
      //   }
      // }

      var obj = {
        // value: data[i]._id,
        label: "INR",
        // coinType: data[i].coinType,
        // key: data[i]._id,
        text: "Indian Rupee",
        image: {
          avatar: true,
          src: "https://res.cloudinary.com/daafoiwvn/image/upload/v1726234507/amckvjzk5cvbpwigeg3o.png",
        },
        // erc20token: data[i].erc20token,
        // bep20token: data[i].bep20token,
        // trc20token: data[i].trc20token,
        // rptc20token: data[i].rptc20token,
      };
      currArrayCrypto.push(obj);

      setallCurrencyFiat(currArrayCrypto);
    }
  };

  const getAllcurrencys = async () => {
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
            label: data[i].currencySymbol,
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

    // setnewCurrency(option.label);
  };
  const onSelect = async (e, option) => {
    console.log(option.label, "option");
    formValue.withAddress = null;
    setwithdrawAddress("");
    console.log(currAddresref.current, "=-=currAddresref=--=-");
    setnet_default(null);
    setwithdrawAddress(null);
    setcur_network("");
    setcurrency(option.label);
    setcurrencyfiat(option.label);
    setcointype(option.coinType);
    setnet_current("");
    getAddress();
    let indexData = allCryptoref.current.findIndex(
      (x) => x._id == option.value
    );
    if (option.label == "USD") {
      showerrorToast("Fiat withdraw is not allowed by the site");
    } else {
      if (indexData != -1) {
        var currencydata = allCryptoref.current[indexData];
        setcurrentcurrency(currencydata);
        setcur_network([]);
        setnet_default("");
        var network_cur = {};
        var network_names = [];
        if (currencydata.currencyType == "2") {
          if (currencydata.erc20token == "1") {
            network_cur = {
              value: "erc20token",
              label: "erc20token",
              text: "ERC20",
              key: "erc20token",
            };
            network_names.push(network_cur);
          }
          if (currencydata.bep20token == "1") {
            network_cur = {
              value: "bep20token",
              label: "bep20token",
              text: "BEP20",
              key: "bep20token",
            };
            network_names.push(network_cur);
          }
          if (currencydata.trc20token == "1") {
            network_cur = {
              value: "trc20token",
              label: "trc20token",
              text: "TRC20",
              key: "trc20token",
            };
            network_names.push(network_cur);
          }

          if (currencydata.rptc20token == "1") {
            network_cur = {
              value: "rptc20token",
              label: "rptc20token",
              text: "RPTC20",
              key: "rptc20token",
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
  };

  const nav_page = async (link) => {
    navigate(link);
  };

  const validate = async (values) => {
    const errors = {};
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

    setvalidationnErr(errors);
    return errors;
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
  const validateFiat_submit = async (values) => {
    const errors = {};
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

  const getwithdrawHistory = async (page) => {
    var data = {
      apiUrl: apiService.payment_history,
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

  const onSelect_network = async (e, option) => {
    setnet_current(option.label);
  };

  const onSelect_address = async (e) => {
    console.log(
      e.target.value,
      "=-=-=-=option=-=-=-=-=option=-=-=-option=-=-="
    );
    setwithdrawAddress(e.target.value);
    formValue.withAddress = e.target.value;
    setwithAddress(false);
  };

  const navigateKyc = async () => {
    navigate("/kyc");
  };

  const withdrawPreview = async () => {
    try {
      console.log(formValue, "=-=-=v=-formValue-=-formValue=-=-vformValue");
      if (
        currentcurrency.currencySymbol == "USD" ||
        currentcurrency.currencySymbol == "INR"
      ) {
        if (bankwire == 1) {
          if (withdrawType == "2") {
            validateFiat_preview(formValue);
            if (formValue.amount != "") {
              if (+formValue.amount > 0) {
                if (+balanceref.current.balance > +formValue.amount) {
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
                    var data = {
                      apiUrl: apiService.send_otp,
                    };
                    setbuttonLoader(true);
                    var resp = await postMethod(data);
                    if (resp.status) {
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
            validate_preview(formValue);
            if (formValue.amount != "" && formValue.withAddress != "") {
              if (+formValue.amount > 0) {
                if (+balanceref.current.balance > +formValue.amount) {
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
                    var data = {
                      apiUrl: apiService.send_otp,
                    };
                    setbuttonLoader(true);
                    var resp = await postMethod(data);
                    if (resp.status) {
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
              if (+balanceref.current.balance > +formValue.amount) {
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
                    otp: formValue.tfa,
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

                setwithdrawAddress("");
              }
            } else {
              showerrorToast("Please give valid withdraw amount!");
              setbuttonLoader(false);
            }
          }
        } else {
          validate_preview(formValue);
          if (formValue.amount != "" && formValue.withAddress != "") {
            if (+formValue.amount > 0) {
              if (+balanceref.current.balance > +formValue.amount) {
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
                    otp: formValue.tfa,
                  };
                  console.log(obj, "=-=-obj=-=-");
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

        if (localStorage.getItem("tfa_status") == 1) {
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
                  amount: formValue.amount,
                  tfaCode: formValue.tfa,
                  currency_symbol: currentcurrency.currencySymbol,
                  currId: currentcurrency._id,
                  withdrawOtp: formValue.withdraw_otp,
                  tfa_status: localStorage.getItem("tfa_status"),
                };
                var data = {
                  apiUrl: apiService.submitfiatWithdraw,
                  payload: obj,
                };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
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
            showerrorToast("Please give all the fields !");
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
                  amount: formValue.amount,
                  tfaCode: formValue.tfa,
                  currency_symbol: currentcurrency.currencySymbol,
                  currId: currentcurrency._id,
                  withdrawOtp: formValue.withdraw_otp,
                  tfa_status: localStorage.getItem("tfa_status"),
                };
                var data = {
                  apiUrl: apiService.submitfiatWithdraw,
                  payload: obj,
                };
                setbuttonLoader(true);
                var resp = await postMethod(data);
                if (resp.status) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
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
            showerrorToast("Please give all the fields !");
          }
        }
      } else {
        validate_submit(formValue);

        if (localStorage.getItem("tfa_status") == 1) {
          if (
            formValue.amount != "" &&
            formValue.withAddress != "" &&
            formValue.tfa != ""
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
                  amount: formValue.amount,
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
                // var data = {
                //   apiUrl: apiService.submitWithdraw,
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
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  //window.location.reload(false);
                } else {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
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
            showerrorToast("Please give all the fields !");
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
                  amount: formValue.amount,
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
                if (resp.status) {
                  showsuccessToast(resp.message);
                  getwithdrawHistory(1);
                  setbuttonLoader(false);
                  setshow_otp(false);
                  formValue.amount = "";
                  setwithdrawAddress("");
                  formValue.tfa = "";
                  formValue.withdraw_otp = "";
                  //window.location.reload(false);
                } else {
                  showerrorToast(resp.message);
                  setbuttonLoader(false);
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
            label: element.currency,
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
                            <div className="p2p_title">{t("fiat_deposit")}</div>
                            <div className="col-lg-7">
                              <div className="deposit mt-5">
                                {/* <div className="form_div">
                                  <div className="sides">
                                    <div className="w-100 rights">
                                      <h6>Select a Currency to Pay</h6>
                                      <Dropdown
                                        placeholder="INR - Indian Rupee"
                                        fluid
                                        className="dep-drops"
                                        selection
                                        // options={allCurrencyrefFiat.current}
                                        onChange={onSelect}
                                        defaultValue={currencyreffiat.current}
                                        isSearchable={true}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="form_div">
                                  <div className="sides">
                                    <div className="w-100 rights">
                                      <h6>Select a Receive Currency</h6>
                                      <Dropdown
                                        placeholder="Select Coin"
                                        fluid
                                        className="dep-drops"
                                        selection
                                        options={allCurrencyref.current}
                                        onChange={onSelect}
                                        defaultValue={currencyref.current}
                                        isSearchable={true}
                                      />
                                    </div>
                                  </div>
                                </div> */}

                                {/* {currentcurrencyref.current.currencyType ==
                                "2" ? (
                                  <div className="form_div">
                                    <div className="sides">
                                      <div className="w-100 rights">
                                        <h6>Choose a Network</h6>
                                        <Dropdown
                                          placeholder="Select an Network"
                                          fluid
                                          className="dep-drops"
                                          selection
                                          options={network_currencyref.current}
                                          onChange={onSelect_network}
                                          defaultValue={net_defaultref.current}
                                          isSearchable={true}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}

                                {withdrawType == "1" ? (
                                  <div className="form_div ">
                                    <h6>Address</h6>
                                    <input
                                      type="text"
                                      placeholder="Enter the address"
                                      fluid
                                      className="dep-drops"
                                      value={withdrawAddressref.current}
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
                                )} */}

                                <div className="form_div mar-bot boder-none ">
                                  <h6>{t("payAmountinINR")}</h6>
                                  <input
                                    type="number"
                                    pattern="[0-9]*"
                                    onKeyDown={(evt) => {
                                      ["e", "E", "+", "-"].includes(evt.key) &&
                                        evt.preventDefault();
                                    }}
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Allow only values greater than or equal to 0
                                      if (value >= 0) {
                                        handleChange(e); // Call your handleChange to update the state
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

                                  {withdrawType == "1" ? (
                                    <>
                                      {localStorage.getItem("tfa_status") ==
                                        0 || 1 ? (
                                        <>
                                          <div className="form_div p-0 mt-4">
                                            <h6>{t("2FAVerificationCode")}</h6>
                                            <input
                                              type="number"
                                              autoComplete="off"
                                              name="tfa"
                                              value={tfa}
                                              placeholder="Enter 2FA Code"
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

                                  {show_otpref.current == true ? (
                                    <>
                                      <div className="form_div p-0 mt-3">
                                        <h6>{t("withdrawOTP")}</h6>
                                        <input
                                          type="number"
                                          autoComplete="off"
                                          placeholder={t("EnterWithdrawOTP")}
                                          name="withdraw_otp"
                                          value={withdraw_otp}
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
                                            }
                                          }}
                                          className="dep-drops"
                                        />
                                        {otpValidate === true && (
                                          <span className="errorcss mt-0">
                                            {validationnErr.withdraw_otp}
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {currentcurrencyref.current ? (
                                    <>
                                      <div className="fees_content mt-4">
                                        <h4>{t("fees")}</h4>
                                        <p>
                                          {
                                            currentcurrencyref.current
                                              .withdrawFee
                                          }{" "}
                                          %
                                        </p>
                                      </div>
                                      <div className="fees_content ">
                                        <h4>{t("availablebalance")}</h4>
                                        <p>
                                          {balanceref.current.balance}{" "}
                                          {currencyref.current}
                                        </p>
                                      </div>
                                      {/* <div className="fees_content ">
                                        <h4>Minimum withdraw</h4>
                                        <p>
                                          {
                                            currentcurrencyref.current
                                              .minWithdrawLimit
                                          }
                                        </p>
                                      </div> */}
                                      {/* <div className="fees_content">
                                        <h4>Maximum withdraw</h4>
                                        <p>
                                          {
                                            currentcurrencyref.current
                                              .maxWithdrawLimit
                                          }
                                        </p>
                                      </div> */}
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  <div className="sumbit_btn">
                                    <button
                                      onClick={() =>
                                        handleShowPaymentForm(amount)
                                      }
                                    >
                                      {/* <img
                                        src={require("../assets/phonepe.png")}
                                        width="80px"
                                      /> */}
                                      {t("pay")}
                                    </button>
                                  </div>

                                  {/* {buttonLoader == false ? (
                                    <div className="sumbit_btn">
                                      {localStorage.getItem("tfa_status") ==
                                      0 ? (
                                        <button
                                          onClick={() => nav_page("/enabletfa")}
                                        >
                                          Enable2FA
                                        </button>
                                      ) : show_otpref.current == true ? (
                                        <button
                                          onClick={() => withdrawSubmit()}
                                        >
                                          Submit
                                        </button>
                                      ) : show_otpref.current == false ? (
                                        <button
                                          onClick={() => withdrawPreview()}
                                        >
                                          Submit
                                        </button>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    <div className="sumbit_btn">
                                      <button>Loading ...</button>
                                    </div>
                                  )} */}
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
                                      <h6>{t("paymentGatewayPhonePe")}</h6>
                                      <p>{t("easilypurchase")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("userAuthentication")}</h6>
                                      <p>{t("ete2FAfor")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("currencyConversionExchange")}</h6>
                                      <p>{t("depositfiat")}</p>
                                    </div>
                                    <div className="imp-notes-content">
                                      <h6>{t("compliancewithKYCandAML")}</h6>
                                      <p>{t("verifyyourKYC")}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="dashboard_table">
                            <div className="staking-flex dash_assets">
                              <h5 className="opt-title">
                                {t("paymentHistory")}
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
                                            <td className="opt-percent font_14 table_center_text pad-left-23">
                                              {item.currency}
                                            </td>
                                            <td className="opt-percent font_14 table_center_text pad-left-23">
                                              {parseFloat(item.amount).toFixed(
                                                2
                                              )}
                                            </td>
                                            <td className="opt-term font_14 table_center_text pad-left-23">
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
                                            <td className="opt-term font_14 table_center_text pad-left-23">
                                              {Moment(item.created_at).format(
                                                "lll"
                                              )}
                                            </td>
                                            <td className="opt-btn-flex table-action pad-left-23 text-green text-center">
                                              {item.status}
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
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="row ">
                            <div className="p2p_title">{t("fiat_deposit")}</div>
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
                                <div className="container">
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
                        </>
                      )}
                    </>
                  ) : (
                    <div className="row ">
                      <div className="p2p_title">{t("withdrawal")}</div>
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
                          <div className="container">
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

export default Checkout;
