import React, { useState, useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setAuthorization } from "../core/service/axios";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";

const TFA = () => {
  const initialFormValue = {
    tfa: "",
  };

   const { t } = useTranslation();
  const [formValue, setFormValue] = useState(initialFormValue);
  const [tfaValidate, settfaValidate] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { tfa } = formValue;
  const { state } = useLocation();
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("user_token");
    const userEmail = sessionStorage.getItem("useremail");
    if (!token) {
      if (!userEmail) {
        navigate("/login");
      }
    } else {
      navigate("/dashboard");
    }
  }, []);

  const formSubmit = async () => {
    validate(formValue);
    if (formValue.tfa !== "") {
      const usermail = sessionStorage.getItem("user_email");
      // const usermail = localStorage.getItem("user_email");
      console.log(usermail, "usermail=====");
      var data = {
        apiUrl: apiService.tfaVerify,
        payload: {
          userToken: tfa,
          userEmail: usermail,
        },
      };

      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      console.log("resp", resp);
      if (resp.status) {
        showsuccessToast(resp.data.message);
        await setAuthorization(resp.data.token);
        sessionStorage.setItem("user_token", resp.data.token);
        sessionStorage.setItem("tfa_status", 1);
        sessionStorage.setItem("socketToken", resp.data.socketToken);
        sessionStorage.setItem("PTKToken", resp.data.PTKToken);
        await login(resp.data.token);
        // localStorage.setItem("user_token", resp.data.token);
        // localStorage.setItem("tfa_status", 1);
        // localStorage.setItem("socketToken", resp.data.socketToken);
        // localStorage.setItem("PTKToken", resp.data.PTKToken);
        navigate("/dashboard");
      } else {
        if (resp.issue == 1) {
          navigate("/login");
          showerrorToast(resp.Message);
        } else {
          showerrorToast(resp.Message);
        }
      }
    } else {
      validate(formValue);
    }
  };
  const validate = async (values) => {
    const errors = {};
    if (!values.tfa) {
      errors.tfa = "2FA code is required!";
      settfaValidate(true);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const navigate_login = () => {
    navigate("/login");
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
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div className="reg_new_backcol">
        <div className="Verification ">
          <div className="container">
            <div>
              <h6 className="padfor_new_top" onClick={navigate_login}>
                {" "}
                <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('login')}
              </h6>
              <div className="row justify-content-center cards">
                <div className="col-lg-4">
                  <span class="heading">{t('two_Factor_Authentication')}</span>
                  <div className="notify">
                    {" "}
                    {t('enter_Authenticator_App')}
                  </div>

                  <div className="input-groups icons">
                    <h6 className="input-label">{t('2FA_Code')}</h6>
                    <input
                      className="input-field"
                      placeholder="Enter the code"
                      type="number"
                      name="tfa"
                      pattern="\S*"
                      onKeyDown={(evt) =>
                        ["e", "E", "+", "-"].includes(evt.key) &&
                        evt.preventDefault()
                      }
                      value={tfa}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 6) {
                          setFormValue({ tfa: value });
                        }
                      }}
                    />
                    {tfaValidate == true ? (
                      <p className="errorcss"> {validationnErr.tfa} </p>
                    ) : (
                      ""
                    )}

                    {/* <span className="textgreen seconds"> 56 s </span> */}
                  </div>

                  <div className="Submit my-4">
                    {buttonLoader == false ? (
                      <button onClick={formSubmit}>{t('submit')}</button>
                    ) : (
                      <button>{t('loading')}...</button>
                    )}
                  </div>

                  {/* <div className="foot">
                    <p>
                      Didn't receive a code? <a>Resend</a>
                    </p>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TFA;
