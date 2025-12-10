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

function UserRecharge() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [siteLoader, setSiteLoader] = useState(false);
  const [operatorList, setOperatorList, operatorListRef] = useState([]);
  const [planList, setPlanList, planListRef] = useState([]);

  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [selectedCoin, setSelectedCoin] = useState("USDT");
  const [convertedAmount, setConvertedAmount] = useState(null);

    const payCurrencies = [
      { key: "USDT", value: "USDT", text: "USDT" },
      { key: "PTK", value: "PTK", text: "PTK" },
    ];

  const [operatorError, setOperatorError] = useState(false);
  const [planError, setPlanError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  const [selectedPlanPrice, setSelectedPlanPrice, selectedPlanPriceref] =
    useState(0);
  const [selectedPlanCurrency, setSelectedPlanCurrency, selectedPlanCurrencyref] =
    useState("");

  const [buttonLoader, setButtonLoader, buttonLoaderref] = useState(false);

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    setSiteLoader(true);

    const resp = await postMethod({
      apiUrl: apiService.recharge_operator_list,
      payload: {},
    });

    // setSiteLoader(false);

    if (resp && resp.status) {
      const ops = resp.data.map((op) => ({
        key: op.code,
        text: op.name,
        value: op.code,
      }));
      setOperatorList(ops);
      setSiteLoader(false);
    } else {
      showerrorToast("Unable to fetch operator list");
      setSiteLoader(false);
    }
  };

  const onSelectOperator = async (op) => {
    setSelectedOperator(op.value);
    setOperatorError(false);
    setSelectedPlan("");
    setPlanList([]);

    // setSiteLoader(true);

    const resp = await postMethod({
      apiUrl: apiService.recharge_plan_list,
      payload: { operatorCode: op.value },
    });

    // setSiteLoader(false);

    if (resp && resp.status) {
      const planOpts = resp.data.map((p) => ({
        // key: p.planId,
        key: p.id,
        // text: `${p.amount} - ${p.desc}`,
        text: p.amount,
        value: p.id,
        cost_amount: p.cost_amount,
        cost_currency: p.cost_currency,
      }));
      setPlanList(planOpts);
    } else {
      showerrorToast("No plans for this operator");
    }
  };

  const convertUSDTtoPTK = async (amountUSDT) => {
    try {
      const resp = await postMethod({
        apiUrl: apiService.getUSDTtoPTK,
        payload: {},
      });

      if (resp.status) {
        const rate = Number(resp.rate); // PTK price of 1 USDT
        const finalPTK = Number(amountUSDT) * rate;
        setConvertedAmount(finalPTK.toFixed(6));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRecharge = async () => {
    // validations
    if (!selectedOperator) {
      setOperatorError(true);
      // showerrorToast("Please select an operator");
      return;
    }

    if (!selectedPlan) {
      setPlanError(true);
      // showerrorToast("Please select a plan");
      return;
    }

    if (!mobileNumber || mobileNumber.length < 8) {
      setMobileError(true);
      // showerrorToast("Enter valid mobile number");
      return;
    }

    const payload = {
      number: mobileNumber,
      operatorCode: selectedOperator,
      planId: selectedPlan,
      selectedCurrency: selectedCoin,
      cost_amount:
        selectedCoin === "USDT"
          ? selectedPlanPriceref.current
          : convertedAmount,
      // cost_amount: selectedPlanPriceref.current,
    };

    // setSiteLoader(true);
    setButtonLoader(true);

    const resp = await postMethod({
      apiUrl: apiService.recharge_user,
      payload,
    });

    

    if (resp && resp.status) {
      showsuccessToast("Recharge Successful");
      setButtonLoader(false);
      setSelectedOperator("");
      setSelectedPlan("");
      setMobileNumber("");
      setPlanList([]);
    } else {
      showerrorToast(resp.message || "Recharge Failed");
      setButtonLoader(false);
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
                    <div className="p2p_title">{t("recharge")}</div>
                    <div className="col-lg-7">
                      <div className="deposit mt-2">
                        <div className="form_div">
                          <div className="sides">
                            <div className="w-100 rights">
                              <h6>{t("Select Operator")}</h6>
                              <Dropdown
                                placeholder="Select Operator"
                                fluid
                                className="dep-drops"
                                selection
                                value={selectedOperator}
                                options={operatorListRef.current}
                                onChange={(e, d) => onSelectOperator(d)}
                              />
                              {operatorError && (
                                <span className="errorcss">
                                  Please select an operator
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {planListRef.current.length > 0 && (
                          <>
                            <div className="form_div">
                              <div className="sides">
                                <div className="w-100 rights">
                                  <h6>{t("Select Plan")}</h6>
                                  <Dropdown
                                    placeholder="Select Plan"
                                    fluid
                                    className="dep-drops"
                                    selection
                                    value={selectedPlan}
                                    options={planListRef.current}
                                    onChange={(e, d) => {
                                      console.log("d.value----", d);
                                      setSelectedPlan(d.value);
                                      setPlanError(false);
                                      const selectedObj = d.options.find(
                                        (x) => x.value === d.value
                                      );

                                      if (selectedObj) {
                                        setSelectedPlanPrice(
                                          selectedObj.cost_amount
                                        );
                                        setSelectedPlanCurrency(
                                          selectedObj.cost_currency
                                        );
                                      }
                                    }}
                                  />
                                  {planError && (
                                    <span className="errorcss">
                                      Please select a plan
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {selectedPlan && (
                          <>
                            <div className="form_div boder-none ">
                              <h6>{t("selectacoin")}</h6>
                              <Dropdown
                                placeholder="Select Pay Currency"
                                fluid
                                className="dep-drops"
                                selection
                                options={payCurrencies}
                                value={selectedCoin}
                                onChange={async (e, d) => {
                                  setSelectedCoin(d.value);

                                  if (d.value === "PTK") {
                                    await convertUSDTtoPTK(
                                      selectedPlanPriceref.current
                                    );
                                  } else {
                                    setConvertedAmount(null);
                                  }
                                }}
                              />
                            </div>
                          </>
                        )}
                        {selectedPlan && (
                          <>
                            <div className="form_div boder-none ">
                              <h6>{t("totalAmount")}</h6>
                              <input
                                type="text"
                                disabled
                                autoComplete="off"
                                // value={`${selectedPlanPriceref.current} ${selectedPlanCurrencyref.current}`}
                                // value={
                                //   selectedPlanPriceref.current &&
                                //   selectedPlanCurrencyref.current
                                //     ? `${selectedPlanPriceref.current} ${selectedPlanCurrencyref.current}`
                                //     : "---"
                                // }
                                value={
                                  selectedCoin === "USDT"
                                    ? `${selectedPlanPriceref.current} USDT`
                                    : convertedAmount
                                    ? `${convertedAmount} PTK`
                                    : "---"
                                }
                                className="dep-drops"
                              />
                            </div>
                          </>
                        )}
                        {selectedPlan && (
                          <>
                            <div className="form_div mar-bot-nwfndtra boder-none ">
                              <h6>{t("Enter Mobile Number")}</h6>
                              <input
                                type="text"
                                pattern="[0-9]*"
                                maxLength={10}
                                onKeyDown={(evt) => {
                                  if (
                                    !(
                                      (evt.key >= "0" && evt.key <= "9") ||
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
                                value={mobileNumber}
                                onChange={(e) => {
                                  setMobileNumber(e.target.value);
                                  setMobileError(false);
                                  // setPlanList([]);
                                }}
                                placeholder="Enter Mobile Number"
                                className="dep-drops"
                              />
                              {mobileError && (
                                <span className="errorcss">
                                  Please enter a valid mobile number
                                </span>
                              )}
                            </div>
                          </>
                        )}
                        {/* <div className="sumbit_btn">
                          <button onClick={() => handleRecharge()}>
                            {t("Proceed Recharge")}
                          </button>
                        </div> */}
                        {selectedPlan && (
                          <div className="sumbit_btn">
                            {buttonLoaderref.current == true ? (
                              <button>{t("loading")}...</button>
                            ) : (
                              <button onClick={handleRecharge}>
                                {t("Proceed Recharge")}
                              </button>
                            )}
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

export default UserRecharge;
