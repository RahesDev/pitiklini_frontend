import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const FP = () => {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [OTP, setOTP] = useState("");
  const [activeStatus, seractiveStatus] = useState(false);
  const [resendClick, setResendClick] = useState(false);
   const { t } = useTranslation();

  const navigate = useNavigate();

  const initialFormValue = {
    email: "",
  };

  const initialFormValue1 = {
    password: "",
    confirmPassword: "",
  };

  const [emailValidate, setemailValidate, emailValidateref] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [buttonLoader, setbuttonLoader] = useState(false);

  const [passwordValidate, setpasswordValidate, passwordValidateref] =
    useState(false);
  const [formValue1, setFormValue1] = useState(initialFormValue1);
  const [
    confirmPasswordValidate,
    setconfirmPasswordValidate,
    confirmPasswordValidateref,
  ] = useState(false);
  const [validationnErr1, setvalidationnErr1] = useState("");
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState("password");
  const [otpError, setotpError, otpErrorref] = useState(false);

  const { email } = formValue;
  const { password, confirmPassword } = formValue1;

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let formData = { ...formValue, ...{ [name]: sanitizedValue } };
    setFormValue(formData);
    validate(formData);
  };

  const handleChangeOtp = (e) => {
    const value = e.target.value;
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setOTP(value);
      setotpError(value.length < 4); // Set error if less than 4 digits
    }
  };

  const handleChange1 = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let formData1 = { ...formValue1, ...{ [name]: sanitizedValue } };
    setFormValue1(formData1);
    validate1(formData1);
  };

  const validate = async (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is a required field!";
      setemailValidate(true);
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address!";
      setemailValidate(true);
    } else {
      setemailValidate(false);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const validate1 = async (values) => {
    const errors1 = {};

    if (!values.password) {
      errors1.password = "Password is a required field";
      setpasswordValidate(true);
    } else if (values.password.length < 8 || values.password.length > 15) {
      setpasswordValidate(true);
      // errors1.password = "Password should not below 8 above 15 letters !";
      errors1.password = "Password should be between 8-15 characters!";
    } else if (!values.password.match(/[a-z]/g)) {
      setpasswordValidate(true);
      errors1.password = "Please enter at least lower character !";
    } else if (!values.password.match(/[A-Z]/g)) {
      setpasswordValidate(true);
      errors1.password = "Please enter at least upper character !";
    } else if (!values.password.match(/[0-9]/g)) {
      setpasswordValidate(true);
      errors1.password = "Please enter at One digit character !";
    } else if (!values.password.match(/[!@#$%^&*]/g)) {
      setpasswordValidate(true);
      errors1.password = "Please enter at least one special character !";
    } else {
      setpasswordValidate(false);
    }

    if (!values.confirmPassword) {
      errors1.confirmPassword = "Confirm password is a required field";
      setconfirmPasswordValidate(true);
    } else if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors1.confirmPassword = "Password and Confirm password does not match";
      setconfirmPasswordValidate(true);
    } else {
      setconfirmPasswordValidate(false);
    }

    setvalidationnErr1(errors1);
    return errors1;
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

  const passwordHideconf = (data) => {
    if (data == "hide") {
      setPasshideconf(true);
      setinputTypeconf("text");
    } else {
      setPasshideconf(false);
      setinputTypeconf("password");
    }
  };

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else if (counter === 0 && isEmailSubmitted) {
      setIsResendVisible(true);
    }
    return () => clearTimeout(timer);
  }, [counter, isEmailSubmitted]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    validate(formValue);
    try {
      if (formValue.email != "" && emailValidateref.current == false) {
        var obj = {
          email: formValue.email,
        };
        var data = {
          apiUrl: apiService.forgotemailotp,
          payload: obj,
        };
        setbuttonLoader(true);
        var resp = await postMethod(data);
        console.log(resp, "==-=-resp");
        setbuttonLoader(false);
        if (resp.status == true) {
          showsuccessToast(resp.Message);
          setIsEmailSubmitted(true);
          setCounter(120);
          setIsResendVisible(false);
        } else {
          showerrorToast(resp.Message);
        }
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // console.log("Verification code submitted:");
    try {
      if (OTP !== "" && otpErrorref.current == false) {
        // console.log(OTP, "otp-=-=-");
        var obj = {
          emailOtp: OTP,
          email: formValue.email,
        };

        var data = {
          apiUrl: apiService.forgototpverify,
          payload: obj,
        };
        setbuttonLoader(true);
        var resp = await postMethod(data);
        setbuttonLoader(false);
        if (resp.status == true) {
          showsuccessToast(resp.Message);
          seractiveStatus(true);
        } else {
          showerrorToast(resp.Message);
        }
      } else {
        // toast.error("Enter OTP");
        setotpError(true);
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const handleResend = async () => {
    try {
      console.log("----resend comes-----");
      if (formValue.email !== "" && emailValidateref.current == false) {
        var obj = {
          email: formValue.email,
        };
        var data = {
          apiUrl: apiService.resendemailotp,
          payload: obj,
        };
        setOTP("");
        setResendClick(true);
        var resp = await postMethod(data);
        setResendClick(false);

        if (resp.status == true) {
          setCounter(120);
          setIsResendVisible(false);
          showsuccessToast(resp.Message);
        } else {
          showerrorToast(resp.Message);
        }
      }
    } catch (error) {
      setbuttonLoader(false);
    }
  };

  const formSubmitchange = async () => {
    validate1(formValue1);
    if (
      passwordValidateref.current === false &&
      confirmPasswordValidateref.current === false
    ) {
      var obj = {
        password: formValue1.password,
        confimPassword: formValue1.confirmPassword,
        email: formValue.email,
      };

      // console.log(obj, "=-=-=-=-=-=-=-==-=");
      var data = {
        apiUrl: apiService.resetpassword,
        payload: obj,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      setFormValue1(initialFormValue1);
      if (resp.status == true) {
        showsuccessToast(resp.Message);
        navigate("/login");
      } else {
        showerrorToast(resp.Message);
      }
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
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div className="reg_new_backcol">
        <div className="Verification">
          <div className="container">
            <div>
              <Link to="/login">
                <h6 className="padfor_new_top">
                  {" "}
                  <i className="fa-solid fa-arrow-left-long mr-3"></i> {t('login')}
                </h6>
              </Link>

              <div className="row justify-content-center cards">
                <div className="col-lg-4">
                  {activeStatus == false ? (
                    <>
                      <span class="heading">{t('forgotPassword')}</span>
                      {!isEmailSubmitted ? (
                        <div className="notify">
                          {t('enteryouremail')}
                        </div>
                      ) : (
                        <div className="notify">
                          {" "}
                          {t('wehavesent')}{" "}
                        </div>
                      )}

                      <div className="input-groups icons">
                        <h6 className="input-label">{t('email_label')}</h6>
                        <input
                          type="text"
                          name="email"
                          value={email}
                          maxLength="250"
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter the email"
                          disabled={isEmailSubmitted}
                        />
                        {emailValidateref.current == true ? (
                          <p className="errorcss"> {validationnErr.email} </p>
                        ) : (
                          ""
                        )}
                      </div>
                      {isEmailSubmitted && (
                        <div className="input-groups icons">
                          <h6 className="input-label">{t('verificationcode')}</h6>
                          <input
                            type="number"
                            name="OTP"
                            min={1000}
                            max={9999}
                            value={OTP}
                            pattern="\S*"
                            onKeyDown={(evt) =>
                              ["e", "E", "+", "-"].includes(evt.key) &&
                              evt.preventDefault()
                            }
                            onChange={handleChangeOtp}
                            // onChange={(e) => {
                            //   const value = e.target.value;
                            //   if (value.length <= 4) {
                            //     setOTP(value);
                            //   }
                            // }}
                            className="input-field"
                            placeholder="Enter the code"
                          />
                          {otpErrorref.current == true ? (
                            <p className="errorcss">{t('enteravalidOTP')}</p>
                          ) : (
                            ""
                          )}
                        </div>
                      )}

                      <div className="Submit my-4">
                        {!isEmailSubmitted ? (
                          <>
                            {buttonLoader == false ? (
                              <button onClick={handleEmailSubmit}>
                                {t('submit')}
                              </button>
                            ) : (
                              <button>{t('loading')} ...</button>
                            )}
                          </>
                        ) : (
                          <>
                            {buttonLoader == false ? (
                              <button onClick={handleResetPassword}>
                                {t('resetPassword')}
                              </button>
                            ) : (
                              <button>{t('loading')} ...</button>
                            )}
                          </>
                        )}
                      </div>
                      {isEmailSubmitted && (
                        <div className="foot">
                          <p>
                            {t('Didnt_code')}
                            {resendClick == false ? (
                              <>
                                {isResendVisible ? (
                                  <span
                                    onClick={handleResend}
                                    className="cursor-pointer"
                                  >
                                    <a> {t('resend')}</a>
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
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="heading">{t('resetPassword')}</span>

                      <div className="notify">
                        {t('continuetocreateyournewpassword')}
                      </div>
                      <div className="input-groups icons">
                        <h6 className="input-label"> {t('newPassword')}</h6>
                        <div className="flex_input_posion">
                          <input
                            type={inputType}
                            name="password"
                            value={password}
                            minLength={8}
                            maxLength={15}
                            // onChange={handleChange1}
                            onChange={(e) => {
                              const { value } = e.target;
                              setFormValue1((prev) => ({
                                ...prev,
                                password: value,
                              }));

                              if (!value) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password: "Password is required!",
                                }));
                              } else if (
                                value.length < 8 ||
                                value.length > 15
                              ) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password:
                                    "Password should be between 8-15 characters!",
                                }));
                              } else if (!value.match(/[a-z]/g)) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password:
                                    "Please enter at least one lowercase character!",
                                }));
                              } else if (!value.match(/[A-Z]/g)) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password:
                                    "Please enter at least one uppercase character!",
                                }));
                              } else if (!value.match(/[0-9]/g)) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password:
                                    "Please enter at least one numeric character!",
                                }));
                              } else if (!value.match(/[!@#$%^&*]/g)) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  password:
                                    "Please enter at least one special character!",
                                }));
                              } else {
                                setvalidationnErr1((prev) => {
                                  const { password, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="input-field"
                            placeholder="Enter new password"
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
                        {passwordValidate == true ? (
                          <p className="errorcss">
                            {" "}
                            {validationnErr1.password}{" "}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="input-groups icons">
                        <h6 className="input-label">{t('confirmNewPassword')}</h6>
                        <div className="flex_input_posion">
                          <input
                            type={inputTypeconf}
                            name="confirmPassword"
                            value={confirmPassword}
                            minLength={8}
                            maxLength={15}
                            // onChange={handleChange1}
                            onChange={(e) => {
                              const { value } = e.target;
                              setFormValue1((prev) => ({
                                ...prev,
                                confirmPassword: value,
                              }));

                              // Inline validation for confirmPassword
                              if (!value) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  confirmPassword:
                                    "Confirm password is required!",
                                }));
                              } else if (value !== password) {
                                setvalidationnErr1((prev) => ({
                                  ...prev,
                                  confirmPassword:
                                    "Password and Confirm password does not match",
                                }));
                              } else {
                                setvalidationnErr1((prev) => {
                                  const { confirmPassword, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="input-field"
                            placeholder="Re-Enter the password"
                          />
                          {passHidconf == true ? (
                            <i
                              class="fa-regular fa-eye reg_eye"
                              onClick={() => passwordHideconf("show")}
                            ></i>
                          ) : (
                            <i
                              class="fa-regular fa-eye-slash reg_eye"
                              onClick={() => passwordHideconf("hide")}
                            ></i>
                          )}
                        </div>
                        {confirmPasswordValidate == true ? (
                          <p className="errorcss">
                            {" "}
                            {validationnErr1.confirmPassword}{" "}
                          </p>
                        ) : (
                          ""
                        )}
                        {/* <img
                          src={require("../assets/Eye.png")}
                          width="20px"
                          className="eyeicons"
                        /> */}
                      </div>
                      <div className="Submit my-4">
                        {buttonLoader == false ? (
                          <button onClick={formSubmitchange}>
                            {t('resetPassword')}
                          </button>
                        ) : (
                          <button>{t('loading')} ...</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FP;
