import React, { useEffect } from "react";
import Header from "./Header";
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
import { useTranslation } from "react-i18next";

function FundTransfer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [allCurrency, setallCurrency, allCurrencyref] = useState([]);
  const [allCrypto, setallCrypto, allCryptoref] = useState([]);
  const [currency, setcurrency, currencyref] = useState("");
  const [cointype, setcointype, cointyperef] = useState("");
  const [balance, setBalance, balanceref] = useState("");
  const [siteStatus, setSiteStatus] = useState("Active");
  const [Loader, setLoader] = useState(false);
  const [siteData, setSiteData] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  useEffect(() => {
    getAllcurrency();
  }, [0]);

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

  const initialFormValue = {
    email: "",
    amount: "",
    tfa: "",
  };

  const [formValue, setFormValue, formValueref] = useState(initialFormValue);
  const [withdrawcurrencyValidate, setwithdrawcurrencyValidate] =
    useState(false);
  const [amountValidate, setamountValidate] = useState(false);
  const [emailValidate, setemailValidate] = useState(false);
  const [tfaValidate, settfaValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const { email, amount, tfa } = formValue;
  const [currentcurrency, setcurrentcurrency, currentcurrencyref] =
    useState("");
  const [network_currency, setcur_network, network_currencyref] = useState([]);

  const onSelect = async (option) => {
    try {
      if (option != "" && option != null && option !== undefined) {
        console.log(option, "option");
        setFormValue(initialFormValue);
        setcurrency(option.text);
        setcointype(option.coinType);
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
            }
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
              setBalance(resp.data);
              console.log(resp.data, "Balanceref");
            } else {
            }
          }
        }
        setwithdrawcurrencyValidate(false);
        validate_preview(formValueref.current);
      } else {
        setcurrentcurrency("");
        setcurrency("");
      }
    } catch (err) {}
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
    if (!values.email) {
      errors.email = t("emailIsRequiredField");
      setemailValidate(true);
    } else if (
      !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = t("invalidEmailAddress");
      setemailValidate(true);
    } else {
      setemailValidate(false);
    }
    if (!values.amount) {
      errors.amount = t("amountrequired");
      setamountValidate(true);
    } else {
      setamountValidate(false);
    }
    if (!values.tfa) {
      errors.tfa = t("2FArequiredfield");
      settfaValidate(true);
    } else {
      settfaValidate(false);
    }

    setvalidationnErr(errors);
    return errors;
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate_preview(formData);
  };

  const fundSubmit = async () => {
    try {
      setbuttonLoader(true);

      const errors = await validate_preview(formValueref.current);
      if (
        withdrawcurrencyValidate ||
        amountValidate ||
        emailValidate ||
        tfaValidate
      ) {
        setbuttonLoader(false);
        return;
      }

      if (
        !currencyref.current ||
        !currentcurrencyref.current ||
        !formValueref.current.amount ||
        !formValueref.current.email ||
        !formValueref.current.tfa
      ) {
        showerrorToast(t("Please fill all required fields"));
        setbuttonLoader(false);
        return;
      }

      const payload = {
        currencySymbol: currencyref.current,
        currencyId: currentcurrencyref.current._id,
        amount: parseFloat(formValueref.current.amount),
        email: formValueref.current.email,
        userToken: formValueref.current.tfa,
      };

      const data = {
        apiUrl: apiService.fundTransfer,
        payload,
      };

      const resp = await postMethod(data);
      setbuttonLoader(false);

      if (resp.status) {
        showsuccessToast(resp.message || t("Fund transferred successfully"));
        setFormValue(initialFormValue);
        setBalance((prev) => prev - payload.amount);
      } else {
        showerrorToast(resp.message || t("Something went wrong"));
      }
    } catch (err) {
      console.log(err);
      showerrorToast(t("Internal Server Error"));
      setbuttonLoader(false);
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
                  <div className="row">
                    <div className="p2p_title">{t("fundtranfer")}</div>
                    <div className="col-lg-7">
                      <div className="balance mt-5 px-1 mb-1">
                        {" "}
                        <span>
                          <b>{t("balance")}</b> :{" "}
                          {balanceref.current.balance
                            ? balanceref.current.balance.toFixed(6)
                            : "0.0"}
                        </span>
                      </div>
                      <div className="deposit mt-2">
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
                                onChange={(e, data) => {
                                  const selectedOption =
                                    allCurrencyref.current.find(
                                      (option) => option.value === data.value
                                    );
                                  onSelect(selectedOption);
                                }}
                                isSearchable={true}
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
                        <div className="form_div mar-bot-nwfndtra boder-none ">
                          <h6>{t("email")}</h6>
                          <input
                            type="text"
                            name="email"
                            value={email}
                            className="dep-drops"
                            maxLength="250"
                            onChange={(e) => {
                              const { value } = e.target;
                              const sanitizedValue = value.replace(/\s/g, "");
                              setFormValue((prev) => ({
                                ...prev,
                                email: sanitizedValue,
                              }));

                              if (!sanitizedValue) {
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  email: t("emailIsRequiredField"),
                                }));
                              } else if (
                                !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
                                  sanitizedValue
                                )
                              ) {
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  email: t("invalidEmailAddress"),
                                }));
                              } else {
                                setvalidationnErr((prev) => {
                                  const { email, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            placeholder={t("pleaseEnterdestEmailAddress")}
                          />
                          {emailValidate == true ? (
                            <span className="errorcss mt-0">
                              {validationnErr.email}{" "}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="form_div mar-bot-nwfndtra boder-none mt-4">
                          <h6>{t("amount")}</h6>
                          <input
                            type="text"
                            pattern="[0-9]*"
                            maxLength={8}
                            onKeyDown={(evt) => {
                              if (
                                !(
                                  (
                                    (evt.key >= "0" && evt.key <= "9") || // Allow number keys
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
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value >= 0) {
                                handleChange(e);
                              }
                            }}
                            onInput={(evt) => {
                              if (evt.target.value.split(".").length > 2) {
                                evt.target.value = evt.target.value.slice(
                                  0,
                                  -1
                                );
                              }
                            }}
                            placeholder={t("Entertheamount")}
                            fluid
                            className="dep-drops"
                          />
                          {amountValidate == true ? (
                            <span className="errorcss mt-0">
                              {validationnErr.amount}{" "}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="form_div mar-bot-nwfndtra boder-none mt-4">
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
                                ["e", "E", "+", "-", "."].includes(e.key) // Prevent non-numeric characters
                              ) {
                                e.preventDefault();
                              }
                            }}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              ); // Allows only numbers
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value >= 0 && value.length <= 6) {
                                const formData = {
                                  ...formValue,
                                  [e.target.name]: value,
                                };
                                setFormValue(formData);
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
                        {buttonLoader == false ? (
                          <div className="sumbit_btn">
                            {sessionStorage.getItem("tfa_status") == 0 ? (
                              <button onClick={() => navigate("/enabletfa")}>
                                {t("Enable2FA")}
                              </button>
                            ) : (
                              <button onClick={() => fundSubmit()}>
                                {t("submit")}
                              </button>
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
                </section>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default FundTransfer;
