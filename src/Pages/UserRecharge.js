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
  const [amount, setAmount] = useState("");
  const [operatorFetched, setOperatorFetched] = useState(false);

  // ✅ NEW: validation states
  const [operatorError, setOperatorError] = useState(false);
  const [planError, setPlanError] = useState(false);
  const [mobileError, setMobileError] = useState(false);

  // useEffect(() => {
  //   getAllOperators();
  // }, [0]);

  const getAllOperators = async () => {
    try {
      setSiteLoader(true);
      const obj = {
        destination: "7010889149",
      };
      const data = {
        apiUrl: apiService.recharge_operator_list,
        payload: obj
      };
      const resp = await postMethod(data);
      if (resp && resp.status) {
        const ops = resp.data.map((op) => ({
          key: op.code,
          text: op.name,
          value: op.code,
        }));
        setOperatorList(ops);
      } else {
        showerrorToast("Unable to fetch operator list");
      }
      setSiteLoader(false);
    } catch (err) {
      console.log(err);
      setSiteLoader(false);
    }
  };

  const getOperator = async () => {
    if (!mobileNumber || mobileNumber.length < 8) {
      showerrorToast("Enter valid mobile number");
      return;
    }

    setSiteLoader(true);
    const resp = await postMethod({
      apiUrl: apiService.recharge_operator_list,
      payload: { destination: mobileNumber },
    });
    setSiteLoader(false);

    if (resp && resp.status) {
      showsuccessToast("Operator detected successfully");
      const operator = resp.data.operator_code || resp.data.code;
      setSelectedOperator(operator);
      setOperatorFetched(true);
      getPlans(operator);
    } else {
      showerrorToast(resp.message || "Unable to detect operator");
    }
  };

  const getPlans = async (operatorCode) => {
    setSiteLoader(true);
    const resp = await postMethod({
      apiUrl: apiService.recharge_plan_list,
      payload: { operatorCode },
    });
    setSiteLoader(false);

    if (resp && resp.status) {
      const planOpts = resp.data.map((pl) => ({
        key: pl.id,
        text: `${pl.amount} - ${pl.desc}`,
        value: pl.amount,
      }));
      setPlanList(planOpts);
    } else {
      showerrorToast(resp.message || "No plans available");
    }
  };

  const onSelectOperator = async (op) => {
    setSelectedOperator(op.value);
    setOperatorError(false);
    setPlanList([]);
    setSelectedPlan("");

    const data = {
      apiUrl: apiService.recharge_plan_list,
      payload: { operatorCode: op.value },
    };

    const resp = await postMethod(data);
    if (resp && resp.status) {
      const planOpts = resp.data.map((pl) => ({
        key: pl.planId,
        text: `${pl.amount} - ${pl.desc}`,
        value: pl.planId,
      }));
      setPlanList(planOpts);
    } else {
      showerrorToast("No plans available for this operator");
    }
  };

  const handleRecharge = async () => {
    // if (!mobileNumber || !selectedOperator || !selectedPlan) {
    //   showerrorToast("Please fill all fields");
    //   return;
    // }

    //  if (!selectedOperator) {
    //    setOperatorError(true);
    //   //  showerrorToast("Please select an operator");
    //    return;
    //  }

    //  if (!selectedPlan) {
    //    setPlanError(true);
    //   //  showerrorToast("Please select a plan");
    //    return;
    //  }

    //  if (!mobileNumber) {
    //    setMobileError(true);
    //   //  showerrorToast("Please enter a mobile number");
    //    return;
    //  }

    //  if (mobileNumber.length < 8) {
    //    setMobileError(true);
    //   //  showerrorToast("Mobile number must be at least 8 digits");
    //    return;
    //  }

  if (!mobileNumber || mobileNumber.length < 8) {
    setMobileError(true);
    showerrorToast("Please enter valid mobile number");
    return;
  }

  if (!selectedPlan) {
    setPlanError(true);
    showerrorToast("Please select a plan");
    return;
  }

  if (!selectedOperator) {
    showerrorToast("Operator not detected. Please check number again.");
    return;
  }
    const payload = {
      number: mobileNumber,
      operatorCode: selectedOperator,
      amount: selectedPlan,
    };

    const data = {
      apiUrl: apiService.recharge_user,
      payload,
    };

    setSiteLoader(true);
    const resp = await postMethod(data);
    setSiteLoader(false);

    if (resp && resp.status) {
      showsuccessToast("Recharge successful");
      setMobileNumber("");
      setSelectedOperator("");
      setSelectedPlan("");
      setPlanList([]);
      setOperatorFetched(false);
    } else {
      showerrorToast(resp.message || "Recharge failed");
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
                          {/* <div className="sides">
                            <div className="w-100 rights">
                              <h6>{t("Select Operator")}</h6>
                              <Dropdown
                                placeholder="Select Operator"
                                fluid
                                className="dep-drops"
                                selection
                                options={operatorListRef.current}
                                onChange={(e, d) => onSelectOperator(d)}
                              />
                              {operatorError && (
                                <span className="errorcss">
                                  Please select an operator
                                </span>
                              )}
                            </div>
                          </div> */}
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
                              setOperatorFetched(false);
                              setPlanList([]);
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
                        <div className="sumbit_btn">
                          <button onClick={getOperator}>
                            {t("Check Operator")}
                          </button>
                        </div>
                        {operatorFetched && planListRef.current.length > 0 && (
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
                                    options={planListRef.current}
                                    onChange={(e, d) => {
                                      setSelectedPlan(d.value);
                                      setPlanError(false);
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
                        {/* {selectedPlan && (
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
                                  setOperatorFetched(false);
                                  setPlanList([]);
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
                        )} */}
                        {/* <div className="sumbit_btn">
                          <button onClick={() => handleRecharge()}>
                            {t("Proceed Recharge")}
                          </button>
                        </div> */}
                        {planListRef.current.length > 0 && (
                          <div className="sumbit_btn">
                            <button onClick={handleRecharge}>
                              {t("Proceed Recharge")}
                            </button>
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
