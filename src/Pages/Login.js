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
import Pattern from "../assets/svg/Pattern.svg";
import Pattern1 from "../assets/svg/Pattern-1.svg";
import Pattern2 from "../assets/svg/Pattern-2.svg";
import Patternrow from "../assets/svg/Patternrow.svg";
import Logo from "../assets/svg/logo.svg";
import Email from "../assets/svg/email.svg"
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
  const [step, setStep] = useState(1);

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
    <div className="min-h-screen flex flex-col bg-black font-ibm text-secondary overflow-hidden">
      <Header />

      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-black">
        {/* Background Patterns */}
        <img
          src={Pattern}
          alt="pattern"
          className=" absolute pointer-events-none opacity-[0.3] top-[87px] left-[-119px] w-[683px] h-[385px]"
        />
        <img
          src={Pattern1}
          alt="pattern-1"
          className="absolute pointer-events-none opacity-[0.3] top-[389px] left-[757px] w-[683px] h-[385px]"
        />
        <img
          src={Pattern2}
          alt="pattern-2"
          className="absolute pointer-events-none opacity-[0.3] top-[840px] left-[448px] w-[447px] h-[252px] -rotate-90"
        />

        <div className="relative z-10 w-full flex flex-col items-center py-8 pt-20">
          {/* Decorative Logo and Patternrow Overlaid (Above Card for Step 1) */}
          {step === 1 && (
            <div className="relative flex justify-center items-center h-[73.5px] mb-[30px] z-20">
              <img
                src={Patternrow}
                alt="pattern-row"
                className="w-[343px] h-[42px] max-w-[90vw]"
              />
              <img
                src={Logo}
                alt="logo"
                className="absolute w-[73.5px] h-[73.5px]"
              />
            </div>
          )}

          <div className="relative z-10 w-[460px] max-w-[95vw] bg-[#111318] rounded-2xl px-6  border border-[#1E2028] shadow-xl overflow-hidden font-ibm">
            {/* Back Button for Step 2 */}
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="absolute top-[24px] left-[16px] w-[78px] h-[38px] border border-primary rounded-[8px] flex items-center justify-center gap-[4px] px-[16px] py-[12px] box-border text-[#B1B5C3] hover:text-white transition z-30"
              >
                <span className="text-lg text-secondary">
                  <i className="ri-arrow-left-s-line"></i>
                </span>
                <span className="text-sm font-ibm text-secondary">
                  {t("back")}
                </span>
              </button>
            )}

            {/* Radial Gradient Glow Inside Card */}
            <div className="pointer-events-none absolute top-[-301px] left-1/2 -translate-x-1/2 w-[710px] h-[710px] opacity-60 z-0">
              <div className="w-full h-full rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,_rgba(189,127,16,0.24)_0%,_rgba(189,127,16,0)_100%)] blur-[20px]"></div>
            </div>

            {/* Top Gradient Line */}
            <div className="flex justify-center mb-6">
              <div
                className="w-[451px] max-w-full h-[4px] rounded-[21px]"
                style={{
                  background:
                    "linear-gradient(90deg, #191B22 0%, #BD7F10 50%, #191B21 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
              ></div>
            </div>

            {/* Decorative Logo and Patternrow Overlaid (Inside Card for Step 2) */}
            {step === 2 && (
              <div className="relative flex justify-center items-center h-[73.5px] mb-[30px] mt-16 z-20">
                <img
                  src={Patternrow}
                  alt="pattern-row"
                  className="w-[343px] h-[42px] max-w-[90vw]"
                />
                <img
                  src={Email}
                  alt="email"
                  className="absolute w-[73.5px] h-[73.5px]"
                />
              </div>
            )}

            {/* Welcome Text */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <h1 className="text-[24px] font-bold">
                <span className=" text-[#FCFCFD]">Welcome to </span>
                <span className="text-primary">PITIKLINI</span>
              </h1>
              {step === 1 && (
                <p className="text-[14px] text-[#B1B5C3] max-w-[320px]">
                  Please enter your email to login or sign up
                </p>
              )}
              {step === 2 && (
                <p className="text-[14px] text-[#B1B5C3] max-w-[320px]">
                  Please enter your password to login or sign up
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={(e) => e.preventDefault()} action="">
              <div className="flex flex-col gap-6">
                {step === 1 ? (
                  <>
                    {/* Email Input */}
                    <div className="relative">
                      <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                        {t("email_label")}
                      </span>

                      <div
                        className={`flex items-center bg-[#23262F] border-[1.5px] ${
                          validationnErr?.email
                            ? "border-red-500"
                            : "border-primary"
                        } rounded-[8px] px-4 h-[56px]`}
                      >
                        <img
                          src={Email}
                          alt="email"
                          className="w-[18px] h-[18px] mr-2"
                        />

                        <input
                          type="text"
                          name="email"
                          value={email}
                          maxLength="250"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\s/g, "");
                            setFormValue((prev) => ({ ...prev, email: value }));

                            if (!value) {
                              setvalidationnErr((prev) => ({
                                ...prev,
                                email: t("emailIsRequiredField"),
                              }));
                            } else if (
                              !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
                                value,
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
                          className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                        />
                      </div>

                      {validationnErr?.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationnErr.email}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={async () => {
                        const errors = await validate(formValue);
                        if (!errors.email) {
                          setStep(2);
                        }
                      }}
                      className="w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition"
                    >
                      {t("next")}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Email (Read-only for Step 2) */}
                    <div className="relative opacity-60">
                      <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                        {t("email_label")}
                      </span>
                      <div className="flex items-center bg-[#23262F] border-[1.5px] border-[#353945] rounded-[8px] px-4 h-[56px]">
                        <img
                          src={Email}
                          alt="email"
                          className="w-[18px] h-[18px] mr-2"
                        />
                        <input
                          type="text"
                          value={email}
                          disabled
                          className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                      <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                        {t("password_label")}
                      </span>

                      <div
                        className={`flex items-center bg-[#23262F] border-[1.5px] ${
                          validationnErr?.password
                            ? "border-red-500"
                            : "border-primary"
                        } rounded-[8px] px-4 h-[56px]`}
                      >
                        <i className="ri-lock-2-line text-primary mr-2 text-lg"></i>

                        <input
                          type={inputType}
                          name="password"
                          value={password}
                          minLength={6}
                          maxLength={30}
                          onChange={(e) => {
                            const value = e.target.value;
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
                          className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                        />

                        <div
                          className="cursor-pointer text-[#777E90] z-20 flex items-center justify-center px-2"
                          onClick={() =>
                            passwordHide(passHide ? "show" : "hide")
                          }
                        >
                          {passHide ? (
                            <i className="ri-eye-line text-primary"></i>
                          ) : (
                            <i className="ri-eye-off-line text-primary"></i>
                          )}
                        </div>
                      </div>

                      {validationnErr?.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationnErr.password}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to="/forgotpassword"
                        title={t("forgot_password")}
                        className="text-sm text-primary hover:underline"
                      >
                        {t("forgot_password")}
                      </Link>
                    </div>

                    <button
                      disabled={buttonLoader}
                      onClick={handleClick}
                      className="w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {buttonLoader ? `${t("loading")}...` : t("login")}
                    </button>
                  </>
                )}
              </div>
            </form>
            
            {/* Divider */}
            {/* <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[#2A2D36]"></div>
                <span className="text-sm text-[#777E90]">Or continue with</span>
                <div className="flex-1 h-px bg-[#2A2D36]"></div>
              </div> */}

            {/* Social Buttons */}
            {/* <div className="flex justify-between gap-4">
                <button className="flex-1 border border-primary rounded-lg h-[56px] flex items-center justify-center hover:bg-primary/10 transition">
                  <span className="text-primary text-xl">✈</span>
                </button>
                <button className="flex-1 border border-primary rounded-lg h-[56px] flex items-center justify-center hover:bg-primary/10 transition">
                  <span className="text-primary text-xl font-bold">G</span>
                </button>
                <button className="flex-1 border border-primary rounded-lg h-[56px] flex items-center justify-center hover:bg-primary/10 transition">
                  <span className="text-primary text-xl"></span>
                </button>
              </div> */}

            {/* Footer Link */}
            <div className="my-8 text-center text-sm">
              <p className="text-[#B1B5C3]">
                {t("dont_have_account")}{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  {t("register")}
                </Link>
              </p>
            </div>
          </div>

          {/* Verification Modal */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="email-popup-modal-title"
            aria-describedby="email-popup-modal-description"
          >
            <Box>
              <div className="email-popup-card">
                <div className="email-pop-icon">
                  <i className="ri-close-circle-line" onClick={handleClose}></i>
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
                  {verifyLoader === false ? (
                    <button onClick={verify_email}>{t("verify_now")}</button>
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
  );
};

export default Login;
