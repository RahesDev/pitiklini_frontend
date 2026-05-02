import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Box, Modal } from "@material-ui/core";
import Pattern from "../assets/svg/Pattern.svg";
import Pattern1 from "../assets/svg/Pattern-1.svg";
import Pattern2 from "../assets/svg/Pattern-2.svg";
import Patternrow from "../assets/svg/Patternrow.svg";
import Lock from "../assets/svg/lock.svg";
import EmailIcon from "../assets/svg/email.svg";
import Verification from "../assets/svg/verification.svg"
import Tick from "../assets/svg/tick.svg"

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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const handleOpenSuccess = () => setIsSuccessModalOpen(true);
  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    navigate("/login");
  };
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
    // setIsEmailSubmitted(true);
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
    // seractiveStatus(true)
    console.log("Verification code submitted:");
    try {
      if (OTP !== "" && otpErrorref.current == false) {
       
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
          //  handleOpenSuccess();
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
        handleOpenSuccess();
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
    <div className="h-screen flex flex-col bg-black text-secondary overflow-hidden font-ibm">
      <Header />

      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-black py-0">
        {/* Background Patterns */}
        <img
          src={Pattern}
          alt="pattern"
          className="absolute pointer-events-none opacity-[0.3] top-[87px] left-[-119px] w-[683px] h-[385px]"
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

        <div className="relative z-10 w-full flex flex-col items-center pt-4 pb-10">
          <div className="relative z-10 w-[460px] max-w-[95vw] bg-[#111318] rounded-2xl px-6 pb-10 border border-[#1E2028] shadow-xl overflow-hidden font-ibm">
            {/* Radial Gradient Glow Inside Card (Specific Light Layer) */}
            <div className="pointer-events-none absolute top-[-301px] left-[-103px] w-[710px] h-[710px] opacity-70 z-0">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(189,127,16,0.35)_0%,_rgba(13,15,20,0)_70%)]"></div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                if (activeStatus === true) {
                  seractiveStatus(false);
                } else if (isEmailSubmitted === true) {
                  setIsEmailSubmitted(false);
                } else {
                  navigate("/login");
                }
              }}
              className="absolute top-[24px] left-[16px] w-[78px] h-[38px] border border-primary rounded-[8px] flex items-center justify-center gap-[4px] px-[16px] py-[12px] box-border text-[#B1B5C3] hover:text-white transition z-30"
            >
              <span className="text-lg text-secondary">
                <i className="ri-arrow-left-s-line"></i>
              </span>
              <span className="text-sm font-ibm text-secondary">{t("back")}</span>
            </button>

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

            {/* Decorative Logo and Patternrow Overlaid */}
            <div className="relative flex justify-center items-center h-[73.5px] mb-[30px] mt-16 z-20">
              <img
                src={Patternrow}
                alt="pattern-row"
                className="w-[343px] h-[42px] max-w-[90vw]"
              />
              <img
                src={isEmailSubmitted ? Verification : Lock}
                alt="lock"
                className="absolute w-[73.5px] h-[73.5px]"
              />
            </div>

            {/* Welcome Text */}
            <div className="flex flex-col items-center gap-3 text-center mb-8">
              <h1 className="text-[24px] font-bold text-secondary">
                {activeStatus === false ? (
                  !isEmailSubmitted ? (
                    t("forgotPassword")
                  ) : (
                    t("emailVerificationCodeTitle")
                  )
                ) : (
                  t("resetPassword")
                )}
              </h1>
              <p className="text-[14px] text-[#B1B5C3] max-w-[320px]">
                {activeStatus === false ? (
                  !isEmailSubmitted ? (
                    t("enteryouremail")
                  ) : (
                    t("verificationCodeSentMessage")
                  )
                ) : (
                  t("continuetocreateyournewpassword")
                )}
              </p>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6">
              {activeStatus === false ? (
                !isEmailSubmitted ? (
                  <>
                    {/* Email Input Step */}
                    <div className="relative">
                      <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                        {t("email_label")}
                      </span>

                      <div
                        className={`flex items-center bg-[#23262F] border-[1.5px] ${
                          emailValidateref.current === true
                            ? "border-red-500"
                            : "border-primary"
                        } rounded-[8px] px-4 h-[56px]`}
                      >
                        <img
                          src={EmailIcon}
                          alt="email"
                          className="w-[18px] h-[18px] mr-2"
                        />

                        <input
                          type="text"
                          name="email"
                          value={email}
                          maxLength="250"
                          onChange={handleChange}
                          className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                        />
                      </div>

                      {emailValidateref.current === true && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationnErr.email}
                        </p>
                      )}
                    </div>

                    <button
                      disabled={buttonLoader}
                      onClick={handleEmailSubmit}
                      className="w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                    >
                      {buttonLoader ? `${t("loading")}...` : t("submit")}
                    </button>
                  </>
                ) : (
                  <>
                    {/* OTP Verification Step */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex justify-center gap-[12px]">
                        {[...Array(6)].map((_, index) => (
                          <div
                            key={index}
                            className="w-[48px] h-[48px] bg-primary border-[0.84px] border-primary rounded-[8px] flex items-center justify-center"
                          >
                            <input
                              type="text"
                              maxLength="1"
                              className="w-full h-full bg-transparent border-none outline-none text-center text-secondary text-lg font-bold"
                              value={OTP[index] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (/^[0-9]$/.test(val) || val === "") {
                                  let newOTP = OTP.split("");
                                  newOTP[index] = val;
                                  setOTP(newOTP.join(""));
                                  // Auto-focus next input
                                  if (val && index < 5) {
                                    e.target.parentElement.nextSibling.firstChild.focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Backspace" && !OTP[index] && index > 0) {
                                  e.target.parentElement.previousSibling.firstChild.focus();
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {otpErrorref.current === true && (
                        <p className="text-red-500 text-xs text-center">
                          {t("enteravalidOTP")}
                        </p>
                      )}

                      <button
                        disabled={buttonLoader}
                        onClick={handleResetPassword}
                        className="w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                      >
                        {buttonLoader ? `${t("loading")}...` : t("resetPassword")}
                      </button>

                      <div className="text-center text-sm">
                        <p className="text-[#B1B5C3]">
                          {t("Didnt_code")}
                          {resendClick === false ? (
                            <>
                              {isResendVisible ? (
                                <span
                                  onClick={handleResend}
                                  className="cursor-pointer text-primary font-medium hover:underline ml-1"
                                >
                                  {t("resend")}
                                </span>
                              ) : (
                                <span className="text-primary ml-1">
                                  {counter}s
                                </span>
                              )}
                            </>
                          ) : (
                            <i className="ri-loader-4-line animate-spin text-primary px-2"></i>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <>
                  {/* New Password Input */}
                  <div className="relative">
                    <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                      {t("newPassword")}
                    </span>

                    <div
                      className={`flex items-center bg-[#23262F] border-[1.5px] ${
                        validationnErr1.password
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-[8px] px-4 h-[56px]`}
                    >
                      <i className="ri-lock-2-line text-primary mr-2 text-lg"></i>

                      <input
                        type={inputType}
                        name="password"
                        value={password}
                        minLength={8}
                        maxLength={15}
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
                          } else if (value.length < 8 || value.length > 15) {
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
                        className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                      />

                      <div
                        className="cursor-pointer text-[#777E90] z-20 flex items-center justify-center px-2"
                        onClick={() => passwordHide(passHide ? "show" : "hide")}
                      >
                        {passHide ? (
                          <i className="ri-eye-line text-primary"></i>
                        ) : (
                          <i className="ri-eye-off-line text-primary"></i>
                        )}
                      </div>
                    </div>

                    {validationnErr1.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationnErr1.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none">
                      {t("confirmNewPassword")}
                    </span>

                    <div
                      className={`flex items-center bg-[#23262F] border-[1.5px] ${
                        validationnErr1.confirmPassword
                          ? "border-red-500"
                          : "border-primary"
                      } rounded-[8px] px-4 h-[56px]`}
                    >
                      <i className="ri-lock-2-line text-primary mr-2 text-lg"></i>

                      <input
                        type={inputTypeconf}
                        name="confirmPassword"
                        value={confirmPassword}
                        minLength={8}
                        maxLength={15}
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormValue1((prev) => ({
                            ...prev,
                            confirmPassword: value,
                          }));

                          if (!value) {
                            setvalidationnErr1((prev) => ({
                              ...prev,
                              confirmPassword: "Confirm password is required!",
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
                        className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px]"
                      />

                      <div
                        className="cursor-pointer text-[#777E90] z-20 flex items-center justify-center px-2"
                        onClick={() =>
                          passwordHideconf(passHidconf ? "show" : "hide")
                        }
                      >
                        {passHidconf ? (
                          <i className="ri-eye-line text-primary"></i>
                        ) : (
                          <i className="ri-eye-off-line text-primary"></i>
                        )}
                      </div>
                    </div>

                    {validationnErr1.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {validationnErr1.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    disabled={buttonLoader}
                    onClick={formSubmitchange}
                    className="w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {buttonLoader ? `${t("loading")}...` : t("resetPassword")}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalOpen}
        onClose={handleCloseSuccess}
        aria-labelledby="password-changed-modal"
        className="flex items-center justify-center"
      >
        <Box className="outline-none">
          <div className="w-[400px] h-[348px] bg-[#111318] border border-[#1E2028] rounded-[16px] p-[24px] flex flex-col items-center justify-center text-center gap-[40px] font-ibm shadow-2xl relative overflow-hidden">
            {/* Background Glow inside modal */}
            <div className="pointer-events-none absolute top-[-150px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] opacity-40 z-0">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(189,127,16,0.35)_0%,_rgba(13,15,20,0)_70%)]"></div>
            </div>

            {/* Success Icon */}
            <div className="relative z-10">
              <div className="w-[80px] h-[80px] bg-primary/20 rounded-full flex items-center justify-center">
                <img
                          src={Tick}
                          alt="tick"
                          className="w-[80px] h-[80px] "
                        />
              </div>
            </div>

            {/* Text Content */}
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="text-[24px] font-bold text-primary">
                {t("passwordChangedSuccessful")}
              </h2>
              <p className="text-[14px] text-[#B1B5C3] leading-relaxed px-4">
                {t("passwordChangedSubheading")}
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleCloseSuccess}
              className="relative z-10 w-full h-[56px] bg-primary text-secondary rounded-lg text-lg font-medium hover:opacity-90 transition shadow-lg"
            >
              {t("login")}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FP;
