import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import Side_bar from "./Side_bar";
import { useTranslation } from "react-i18next";

const InternalTransfer = () => {
  const { t } = useTranslation();
  const [selectedFromWallet, setSelectedFromWallet, selectedFromWalletref] =
    useState("Spot");
  const [selectedToWallet, setSelectedToWallet, selectedToWalletref] =
    useState("P2P");
  const [siteLoader, setSiteLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [allCurrency, setAllCurrency, allCurrencyRef] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedCurrencyLabel, setSelectedCurrencyLabel] = useState("");
  const [selectedCurrencyBalance, setSelectedCurrencyBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const walletOptions = [
    { key: "spot", text: "Spot", value: "Spot" },
    { key: "p2p", text: "P2P", value: "P2P" },
    // { key: "future", text: "Future", value: "Future" },
  ];

  const filteredToWalletOptions = walletOptions.filter(
    (option) => option.value !== selectedFromWallet
  );

  const filteredFromWalletOptions = walletOptions.filter(
    (option) => option.value !== selectedToWallet
  );

  const handleFromWalletChange = (e, { value }) => {
    setSelectedFromWallet(value);
    setSelectedCurrency("");
    setAmount(0);
    setSelectedCurrencyBalance(0);
    // Reset To wallet if it's the same as the new From selection
    if (value === selectedToWallet) {
      setSelectedToWallet(null);
    }
    setValidationErrors((prev) => ({ ...prev, fromWallet: "" }));
  };

  const handleToWalletChange = (e, { value }) => {
    setSelectedToWallet(value);

    // Reset From wallet if it's the same as the new To selection
    if (value === selectedFromWallet) {
      setSelectedFromWallet(null);
    }
    setValidationErrors((prev) => ({ ...prev, toWallet: "" }));
  };

  // const handleCurrencyChange = (e, { value }) => {
  //   const selectedCurrencyData = allCurrencyRef.current.find(
  //     (currency) => currency.value === value
  //   );
  //   console.log(selectedCurrencyData, "selectedCurrencyData", value);
  //   setSelectedCurrency(value);
  //   setSelectedCurrencyLabel(selectedCurrencyData.label);
  //   selectedFromWalletref.current === "Spot"
  //   ? setSelectedCurrencyBalance(selectedCurrencyData.balanceSpot)
  //   : setSelectedCurrencyBalance(selectedCurrencyData.balanceP2P);
  //   // {
  //   //   selectedFromWalletref.current == "Spot"
  //   //     ? setSelectedCurrencyBalance(selectedCurrencyData.balanceSpot)
  //   //     : selectedFromWalletref.current == "P2P"
  //   //     ? setSelectedCurrencyBalance(selectedCurrencyData.balanceP2P)
  //   //     : setSelectedCurrencyBalance(selectedCurrencyData.balanceFuture);
  //   // }
  //   setAmount(0);
  //   setValidationErrors((prev) => ({ ...prev, currency: "" }));
  //   console.log("Selected currency:", selectedCurrencyData.label);
  // };
  const handleCurrencyChange = (e, { value }) => {
    const selectedCurrencyData = allCurrencyRef.current.find(
      (currency) => currency.value === value
    );

    setSelectedCurrency(value);
    setSelectedCurrencyLabel(selectedCurrencyData.label);

    const balance =
      selectedFromWalletref.current === "Spot"
        ? selectedCurrencyData.balanceSpot
        : selectedCurrencyData.balanceP2P;

    setSelectedCurrencyBalance(balance);
    setAmount(0); // Reset amount
    setValidationErrors((prev) => ({
      ...prev,
      currency: "",
      amount: "",
    }));
  };

  // const handleAmountChange = (e) => {
  //   const inputValue = e.target.value;

  //   if (!/^\d*$/.test(inputValue) || inputValue.length > 15) {
  //     return; // Prevent invalid input or input longer than 15 characters
  //   }

  //   // Limit the input length to 15 digits
  //   // if (inputValue.length > 15) {
  //   //   return; // Prevent any input longer than 15 digits
  //   // }

  //   // If the input is empty, clear the amount and validation error
  //   if (inputValue === "") {
  //     setAmount("");
  //     setValidationErrors((prev) => ({ ...prev, amount: "" }));
  //     return;
  //   }

  //   const enteredAmount = parseFloat(inputValue);

  //   // Update the amount even if validation fails
  //   setAmount(enteredAmount);

  //   if (selectedCurrencyBalance === 0 || !selectedCurrency) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       amount: "Please select a currency first!",
  //     }));
  //   } else if (isNaN(enteredAmount) || enteredAmount <= 0) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       amount: "Please enter a valid amount!",
  //     }));
  //   } else if (enteredAmount > selectedCurrencyBalance) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       amount: "Transfer amount exceeds available balance!",
  //     }));
  //   } else {
  //     setValidationErrors((prev) => ({ ...prev, amount: "" }));
  //   }
  // };

  // const handleAmountChange = (e) => {
  //   const inputValue = e.target.value;

  // // Limit the input length to 15 digits
  // if (inputValue.length > 15) {
  //   return; // Prevent any input longer than 15 digits
  // }

  //   // If the input is empty, clear the amount and validation error
  //   if (inputValue === "") {
  //     setAmount("");
  //     setValidationErrors((prev) => ({ ...prev, amount: "" }));
  //   } else {
  //     const enteredAmount = parseFloat(inputValue);

  //     if (isNaN(enteredAmount) || enteredAmount <= 0) {
  //       setValidationErrors((prev) => ({
  //         ...prev,
  //         amount: "Please enter a valid amount!",
  //       }));
  //     } else if (enteredAmount > selectedCurrencyBalance) {
  //       setValidationErrors((prev) => ({
  //         ...prev,
  //         amount: "Transfer amount exceeds available balance!",
  //       }));
  //     } else {
  //       setValidationErrors((prev) => ({ ...prev, amount: "" }));
  //     }

  //     setAmount(enteredAmount);
  //     // console.log("Entered amount:", enteredAmount);
  //   }
  // };

  const handleAmountChange = (e) => {
    let inputValue = e.target.value;

    // Allow only valid characters: digits and a single decimal point
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return; // Prevent invalid input
    }

    // Prevent multiple leading zeros
    if (inputValue.startsWith("0") && !inputValue.startsWith("0.")) {
      inputValue = inputValue.replace(/^0+/, "0"); // Replace leading zeros with a single zero
    }

    // Enforce maximum length of 15 characters
    if (inputValue.length > 15) {
      return; // Prevent input longer than 15 characters
    }

    // Allow empty input to reset the amount and clear validation errors
    if (inputValue === "") {
      setAmount("");
      setValidationErrors((prev) => ({ ...prev, amount: "" }));
      return;
    }

    // Convert the input value to a number
    const enteredAmount = parseFloat(inputValue);

    // Update the amount even if validation fails
    setAmount(inputValue);

    // Validation rules
    if (selectedCurrencyBalance === 0 || !selectedCurrency) {
      setValidationErrors((prev) => ({
        ...prev,
        amount: t("pleaseSelectCurrencyFirst"),
      }));
    } else if (isNaN(enteredAmount) || enteredAmount <= 0) {
      setValidationErrors((prev) => ({
        ...prev,
        amount: t("pleaseEnterValidAmount"),
      }));
    } else if (enteredAmount > selectedCurrencyBalance) {
      setValidationErrors((prev) => ({
        ...prev,
        amount: t("transferAmountExceedAvailBal"),
      }));
    } else {
      setValidationErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const validate = () => {
    let errors = {};
    if (!selectedFromWallet) {
      errors.fromWallet = t("fromWalletIsReq");
    }
    if (!selectedToWallet) {
      errors.toWallet = t("toWalletIsReq");
    }
    if (!selectedCurrency) {
      errors.currency = t("currencyIsReq");
    }
    if (!amount) {
      errors.amount = t("amountIsReq");
    } else if (isNaN(amount) || amount <= 0) {
      errors.amount = t("pleaseEnteraValidAmount");
    } else if (amount > selectedCurrencyBalance) {
      errors.amount = t("transferAmountExceedAvBal");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate();

  useEffect(() => {
    getCurriencies(1);
  }, []);

  const [perpage, setperpage] = useState(10);
  const [search, setsearch, searchref] = useState("");
  const getCurriencies = async (pages) => {
    try {
      var obj = {
        perpage: perpage,
        page: pages,
        search: searchref.current,
      };
      var data = {
        apiUrl: apiService.getUserTotalbalance,
        payload: obj,
      };
      setSiteLoader(true);
      var resp = await postMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        var currArrayCrypto = [];
        console.log(resp.Message, "=-=-=resp.data=-=-");
        var data = resp.Message;
        for (var i = 0; i < data.length; i++) {
          if (data[i].currencysymbol) {
            var obj = {
              value: data[i].currid,
              label: data[i].currencysymbol,
              key: data[i].currencysymbol,
              text: data[i].currencysymbol,
              balanceSpot: data[i].currencyBalance,
              balanceP2P: data[i].p2p,
              balanceFuture: data[i].future,
              image: {
                avatar: true,
                src: data[i].currencyImage,
              },
            };
            currArrayCrypto.push(obj);
          }
        }
        console.log(currArrayCrypto, "=-=-=currArrayCrypto-=-=");
        setAllCurrency(currArrayCrypto);
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleSwap = () => {
    const fromWallet = selectedFromWallet;
    const toWallet = selectedToWallet;
    setSelectedFromWallet(toWallet);
    setSelectedToWallet(fromWallet);
    // Reset currency and amount on swap
    setSelectedCurrency("");
    setAmount(0);
    setSelectedCurrencyBalance(0);
    setValidationErrors((prev) => ({
      ...prev,
      fromWallet: "",
      toWallet: "",
      currency: "",
      amount: "",
    }));
  };

  const handleSubmit = async () => {
    if (validate()) {
      const payload = {
        fromWallet: selectedFromWallet,
        toWallet: selectedToWallet,
        currency: selectedCurrency,
        amount: amount,
      };
      console.log(payload, "=-=-=-=payload=-=-=-");
      var data = {
        apiUrl: apiService.walletTransfer,
        payload: payload,
      };
      setButtonLoader(true);
      var resp = await postMethod(data);
      setButtonLoader(false);
      if (resp.status == true) {
        toast.success(resp.Message);
        setSelectedFromWallet("Spot");
        setSelectedToWallet("P2P");
        setSelectedCurrency("");
        setSelectedCurrencyLabel("");
        setSelectedCurrencyBalance(0);
        setAmount(0);
        getCurriencies(1);
        setValidationErrors({});
      } else {
        toast.error(resp.Message);
      }
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
          <div className="container-fluid">
            <div className="row swap_main">
              <div className="col-lg-2 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-5 convert_center_box">
                <div className="convert_card-wrapper border_none">
                  <div className="convert_card">
                    <div className="convert_title">
                      <h3>{t("internal_transfer")}</h3>
                      <Link to="/internaltransferhistory">
                        <p className="text_yellow">
                          {t("history")} <i class="ri-arrow-right-s-line"></i>
                        </p>
                      </Link>
                    </div>

                    <div className="transfer-box">
                      <div className="transfer-from">
                        <h5>{t("from")}</h5>
                        <Dropdown
                          fluid
                          selection
                          options={filteredFromWalletOptions}
                          value={selectedFromWallet}
                          onChange={handleFromWalletChange}
                          className="transfer-dropdown bor-dropdown pad-y-9"
                        />
                      </div>
                      {validationErrors.fromWallet && (
                        <p className="errorcss">
                          {validationErrors.fromWallet}
                        </p>
                      )}

                      {/* swap icon */}
                      <div className="int-trans-swap-wrapper">
                        <img
                          src={require("../assets/int-transfer-swap.png")}
                          alt="swap"
                          className="int-transfer-swap cursor-pointer"
                          onClick={handleSwap}
                        />
                      </div>

                      {/* To */}
                      <div className="transfer-to">
                        <h5>{t("to")}</h5>
                        <Dropdown
                          fluid
                          selection
                          options={filteredToWalletOptions}
                          value={selectedToWallet}
                          onChange={handleToWalletChange}
                          className="transfer-dropdown bor-dropdown pad-y-9"
                        />
                      </div>
                      {validationErrors.toWallet && (
                        <p className="errorcss">{validationErrors.toWallet}</p>
                      )}
                    </div>

                    {/* dropdown */}
                    <div className="convert_sub_title mt-24px mb-3">
                      <h3>{t("currency")}</h3>
                    </div>
                    <div>
                      <Dropdown
                        placeholder={t("selectCurrency")}
                        fluid
                        selection
                        options={allCurrencyRef.current}
                        value={selectedCurrency} // Bind the selected value
                        onChange={handleCurrencyChange} // Handle change
                        className="transfer-dropdown pad-y-9 bor-dropdown"
                      />
                    </div>
                    {validationErrors.currency && (
                      <p className="errorcss">{validationErrors.currency}</p>
                    )}

                    <div className="convert_sub_title mt-24px">
                      <h3>{t("amount")}</h3>
                      <span>
                        <span className="int-avail-title">
                          {t("available")}{" "}
                        </span>
                        <span className="int-avail-total">
                          {selectedCurrencyBalance == "" ||
                          selectedCurrencyBalance == null ||
                          selectedCurrencyBalance == undefined
                            ? 0.0
                            : selectedCurrencyBalance.toFixed(2)}
                        </span>
                      </span>
                    </div>
                    <div className="amount-input-wrapper">
                      <input
                        type="number"
                        min="0"
                        placeholder={t("enterAmount")}
                        className="int-amt-input pad-y-9"
                        value={amount}
                        onChange={handleAmountChange}
                        onKeyDown={(evt) =>
                          ["e", "E", "+", "-"].includes(evt.key) &&
                          evt.preventDefault()
                        }
                      />
                      <span className="amount-btc">
                        {selectedCurrencyLabel}
                      </span>
                      {/* <span className="amount-max">MAX</span> */}
                    </div>
                    {validationErrors.amount && (
                      <p className="errorcss">{validationErrors.amount}</p>
                    )}

                    <div className="Convert_btn">
                      {buttonLoader == false ? (
                        <button onClick={handleSubmit}>{t("convert")}</button>
                      ) : (
                        <button>{t("loading")} ...</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default InternalTransfer;
