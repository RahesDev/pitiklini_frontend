import React, { useEffect } from "react";
import useState from "react-usestateref";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { setAuthorization } from "../core/service/axios";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
import { Box, Modal } from "@material-ui/core";

const Login = () => {
  const { login } = useAuth();

  const initialFormValue = {
    email: "",
    password: "",
  };

  const navigate = useNavigate();

  const [emailValidate, setemailValidate, emailValidateref] = useState(false);
  const [passwordValidate, setpasswordValidate, passwordValidateref] =
    useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const { t } = useTranslation();
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [buttonLoader, setbuttonLoader] = useState(false);

  const { email, password } = formValue;

  useEffect(() => {
    // var token = localStorage.getItem("user_token");
    var token = sessionStorage.getItem("user_token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let formData = { ...formValue, ...{ [name]: sanitizedValue } };
    setFormValue(formData);
    validate(formData);
  };

  const validate = async (values) => {
    const errors = {};

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

    if (values.password == "") {
      setpasswordValidate(true);
      errors.password = t("passwordIsRequired");
    } else {
      // setemailValidate(false);
      setpasswordValidate(false);
    }
    //  else if (values.password.length < 15 || values.password.length > 30) {
    //   setpasswordValidate(true);
    //   errors.password = "Password should not below 15 above 30 letters !";
    // }
    // else if (!values.password.match(/[a-z]/g)) {
    //   setpasswordValidate(true);
    //   errors.password = "Please enter at least lower character !";
    // } else if (!values.password.match(/[A-Z]/g)) {
    //   setpasswordValidate(true);
    //   errors.password = "Please enter at least upper character !";
    // } else if (!values.password.match(/[0-9]/g)) {
    //   setpasswordValidate(true);
    //   errors.password = "Please enter at One digit character !";
    // } else if (!values.password.match(/[!@#$%^&*]/g)) {
    //   setpasswordValidate(true);
    //   errors.password = "Please enter at least one special character !";
    // } else {
    //   setemailValidate(false);
    //   setpasswordValidate(false);
    // }

    setvalidationnErr(errors);
    return errors;
  };

  const passwordHide = (data) => {
    if (data == "hide") {
      setPasshide(true);
      setinputType("text");
    } else {
      setPasshide(false);
      setinputType("password");
    }
  };

  const handleClick = async () => {
    try {
      validate(formValue);
      if (
        emailValidateref.current === false &&
        passwordValidateref.current === false
      ) {
        setbuttonLoader(true);
        sessionStorage.setItem("useremail", formValue.email);
        var data = {
          apiUrl: apiService.signin,
          payload: formValue,
        };
        var resp = await postMethod(data);
        setbuttonLoader(false);
        if (resp.status === true) {
          showsuccessToast(resp.Message);
          if (resp.data.tfa == 0) {
            await setAuthorization(resp.data.token);
            sessionStorage.setItem("user_token", resp.data.token);
            sessionStorage.setItem("tfa_status", resp.data.tfa);
            sessionStorage.setItem("socketToken", resp.data.socketToken);
            sessionStorage.setItem("PTKToken", resp.data.PTKToken);
            await login(resp.data.token);
            // localStorage.setItem("user_token", resp.data.token);
            // localStorage.setItem("tfa_status", resp.data.tfa);
            // localStorage.setItem("socketToken", resp.data.socketToken);
            // localStorage.setItem("PTKToken", resp.data.PTKToken);
            navigate("/dashboard");
            // window.location.reload();
          } else {
            sessionStorage.setItem("user_email", formValue.email);
            // localStorage.setItem("user_email", formValue.email);
            navigate("/tfa");
          }
          formValue.email = "";
          formValue.password = "";
        } else {
          if (
            resp.Message ==
            "Your account is not activated. Please verify to continue"
          ) {
            handleOpen();
            setbuttonLoader(false);
          } else {
            formValue.password = "";
            setbuttonLoader(false);
            showerrorToast(resp.Message);
          }
        }
      } else {
        validate(formValue);
      }
    } catch (err) {
      console.log(err, "=======login submit error=====");
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [verifyLoader, setverifyLoader] = useState(false);

  const verify_email = async () => {
    try {
      var obj = {
        email: sessionStorage.getItem("useremail"),
      };
      var data = {
        apiUrl: apiService.resendCode,
        payload: obj,
      };
      setverifyLoader(true);
      var resp = await postMethod(data);
      setverifyLoader(false);
      if (resp.status) {
        showsuccessToast(resp.Message);
        navigate("/verification");
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {}
  };

  return (
    <>
      <main className="fidex_landing_main">
        <section>
          <Header />
        </section>
      </main>

      <div className="reg_new_backcol">
        <div className="register">
          <div className="container">
            <div className="row login-container">
              <div className="col-lg-6 left-reg ">
                <div className="reg-left-flex">
                  <div className="log-left-title">{t("secure_access")}</div>
                  <div className="log-gift">
                    <img
                      src={require("../assets/login-mobile.webp")}
                      alt="gift-icon"
                    />
                  </div>
                  <div className="reg-left-content">{t("login_message")}</div>
                </div>
              </div>
              <div className="col-lg-6 right-reg">
                <span class="heading">{t("welcome_back")}</span>
                {/* <div class="head-log">Log In with your Email</div> */}
                <form onSubmit={(e) => e.preventDefault()} action="">
                  <div className="input-groups  mt-4">
                    <h6 className="input-label mb-3">{t("email_label")}</h6>
                    <input
                      type="text"
                      name="email"
                      value={email}
                      maxLength="250"
                      // onChange={handleChange}
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
                      className="input-field"
                      placeholder={t("pleaseEnterYourEmailAddress")}
                    />
                    {validationnErr && validationnErr.email && (
                      <p className="errorcss">{validationnErr.email}</p>
                    )}
                  </div>

                  <div className="input-groups icons mt-4">
                    <h6 className="input-label mb-3">{t("password_label")}</h6>

                    <input
                      type={inputType}
                      name="password"
                      value={password}
                      // minLength={15}
                      minLength={6}
                      maxLength={30}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const { value } = e.target;
                        setFormValue((prev) => ({
                          ...prev,
                          password: value,
                        }));

                        if (!value) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t("passwordIsRequired"),
                          }));
                        } else {
                          setvalidationnErr((prev) => {
                            const { password, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className="input-field"
                      placeholder={t("pleaseEnterYourPassword")}
                    />

                    {passHide == true ? (
                      <i
                        class="fa-regular fa-eye reg_eye"
                        onClick={() => passwordHide("show")}
                      ></i>
                    ) : (
                      <i
                        class="fa-regular fa-eye-slash reg_eye"
                        onClick={() => passwordHide("hide")}
                      ></i>
                    )}
                  </div>
                  {validationnErr && validationnErr.password && (
                    <p className="errorcss">{validationnErr.password}</p>
                  )}
                  {/* show error message */}

                  <div className="terms my-4">
                    <p>
                      <Link to="/forgotpassword">{t("forgot_password")}</Link>
                    </p>
                  </div>
                  {buttonLoader === true ? (
                    <div className="Submit">
                      <button>{t("loading")}...</button>
                    </div>
                  ) : (
                    <div className="Submit">
                      <button onClick={handleClick}>{t("login")}</button>
                    </div>
                  )}
                </form>
                <div className="foot">
                  <p>
                    {t("dont_have_account")}{" "}
                    <Link to="/register">{t("register")}</Link>
                  </p>
                </div>
              </div>
              {/* <div className="Submit">
                <button onClick={handleOpen}>Login</button>
              </div> */}

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="email-popup-modal-title"
                aria-describedby="email-popup-modal-description"
              >
                <Box>
                  <div className="email-popup-card">
                    <div className="email-pop-icon">
                      <i
                        class="fa-regular fa-circle-xmark"
                        onClick={handleClose}
                      ></i>
                    </div>
                    <div className="email-pop-img">
                      <img
                        src={require("../assets/icons/email-pop.webp")}
                        alt="email-icon"
                      />
                    </div>
                    <h3>{t("email_verification_required")}</h3>
                    <p>{t("verify_email_message")}</p>
                    <div className="Submit">
                      {verifyLoader == false ? (
                        <button onClick={verify_email}>
                          {t("verify_now")}
                        </button>
                      ) : (
                        <button>{t("loading")} ...</button>
                      )}
                    </div>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
