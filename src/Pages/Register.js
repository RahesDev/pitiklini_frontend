import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStateRef from "react-usestateref";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Pattern from "../assets/svg/Pattern.svg";
import Pattern1 from "../assets/svg/Pattern-1.svg";
import Pattern2 from "../assets/svg/Pattern-2.svg";
import Email from "../assets/svg/email.svg";

export default function RegisterTesting() {
  const { t } = useTranslation();
  useAuth();
  const navigate = useNavigate();
  const createUid = uuidv4();
  const createdUuid = createUid.split("-")[0].toString();

  const initialFormValue = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [, , emailValidateref] = useStateRef(false);
  const [, , passwordValidateref] = useStateRef(false);
  const [, , confirmPasswordValidateref] = useStateRef(false);
  const [Terms, setTerms] = useState(false);
  const [termsValidation, setTermsValidation] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [validationnErr, setvalidationnErr] = useState({});
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState("password");

  const { email, password, confirmPassword } = formValue;

  const handleBackClick = () => {
    navigate(-1);
  };

  const passwordHide = (data) => {
    if (data === "hide") {
      setPasshide(true);
      setinputType("text");
    } else {
      setPasshide(false);
      setinputType("password");
    }
  };

  const passwordHideconf = (data) => {
    if (data === "hide") {
      setPasshideconf(true);
      setinputTypeconf("text");
    } else {
      setPasshideconf(false);
      setinputTypeconf("password");
    }
  };

  const handleEmailChange = (e) => {
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
      emailValidateref.current = true;
    } else if (
      !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(sanitizedValue)
    ) {
      setvalidationnErr((prev) => ({
        ...prev,
        email: t("invalidEmailAddress"),
      }));
      emailValidateref.current = true;
    } else {
      setvalidationnErr((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
      emailValidateref.current = false;
    }
  };

  const handlePasswordChange = (e) => {
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
      passwordValidateref.current = true;
    } else if (value.length < 8 || value.length > 15) {
      setvalidationnErr((prev) => ({
        ...prev,
        password: t("passwordShouldBe1530Char"),
      }));
      passwordValidateref.current = true;
    } else if (!value.match(/[a-z]/g)) {
      setvalidationnErr((prev) => ({
        ...prev,
        password: t("pleaseEnteratleastlowercharacter"),
      }));
      passwordValidateref.current = true;
    } else if (!value.match(/[A-Z]/g)) {
      setvalidationnErr((prev) => ({
        ...prev,
        password: t("pleaseEnteratleastuppercharacter"),
      }));
      passwordValidateref.current = true;
    } else if (!value.match(/[0-9]/g)) {
      setvalidationnErr((prev) => ({
        ...prev,
        password: t("pleaseEnterAtOneDigitChar"),
      }));
      passwordValidateref.current = true;
    } else if (!value.match(/[!@#$%^&*]/g)) {
      setvalidationnErr((prev) => ({
        ...prev,
        password: t("pleaseEnterAtleastOneSpecialChar"),
      }));
      passwordValidateref.current = true;
    } else {
      setvalidationnErr((prev) => {
        const { password, ...rest } = prev;
        return rest;
      });
      passwordValidateref.current = false;
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormValue((prev) => ({
      ...prev,
      confirmPassword: value,
    }));

    if (!value) {
      setvalidationnErr((prev) => ({
        ...prev,
        confirmPassword: t("confirmPasswordIsaRequiredField"),
      }));
      confirmPasswordValidateref.current = true;
    } else if (password && value && password !== value) {
      setvalidationnErr((prev) => ({
        ...prev,
        confirmPassword: t("passwordAndConfirmPassDoesntmatch"),
      }));
      confirmPasswordValidateref.current = true;
    } else {
      setvalidationnErr((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
      confirmPasswordValidateref.current = false;
    }
  };

  const handleTermsChange = (e) => {
    setTerms(e.target.checked);
    setTermsValidation(!e.target.checked);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!Terms) {
      setTermsValidation(true);
      toast.error(t("termsIsARequiredField"));
      return;
    }

    if (
      emailValidateref.current === false &&
      passwordValidateref.current === false &&
      confirmPasswordValidateref.current === false
    ) {
      formValue["UUID"] = createdUuid;
      const data = {
        apiUrl: apiService.signup,
        payload: formValue,
      };
      setbuttonLoader(true);
      try {
        const resp = await postMethod(data);
        setFormValue(initialFormValue);
        setbuttonLoader(false);
        if (resp.status === true) {
          toast.success(resp.Message);
          sessionStorage.setItem("useremail", formValue.email);
          navigate("/verification");
        } else {
          toast.error(resp.Message);
        }
      } catch (error) {
        setbuttonLoader(false);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      toast.error(t("pleaseFixAllErrors"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black font-ibm text-secondary overflow-hidden">
      <Header />

      <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-black">
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

        <div className="relative z-10 w-full flex flex-col items-center py-8 pt-20">
          <div className="relative z-10 w-[460px] max-w-[95vw] bg-[#111318] rounded-2xl px-6 border border-[#1E2028] shadow-xl overflow-hidden py-2">
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

            <div className="flex justify-start mb-8 w-full">
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-amber-600 text-amber-600 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-amber-600/10"
                onClick={handleBackClick}
              >
                <span className="text-lg">◀</span> Back
              </button>
            </div>

            <div className="mx-auto mb-8 flex h-24 w-24 gap-x-4 items-center justify-center">
              <img
                src={require("../assets/Pattern.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
              <img
                src={require("../assets/User Profile Pic.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
              <img
                src={require("../assets/Pattern.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
            </div>

            <h1 className="text-3xl font-bold text-white text-center m-0 mb-2.5 tracking-wider">
              Welcome to{" "}
              <span className="text-amber-600 font-extrabold">PITIKLINI</span>
            </h1>
            <p className="text-sm text-gray-400 text-center m-0 mb-8">
              Please enter your email to sign up
            </p>

            <form className="w-full" onSubmit={handleSignUp}>
              {/* Email Input */}
              <div className="relative mb-5">
                <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none bg-[#111318] px-1">
                  Email
                </span>
                <div
                  className={`flex items-center bg-[#23262F] border-[1.5px] ${validationnErr.email ? "border-red-500" : "border-primary"} rounded-[8px] px-4 h-[56px]`}
                >
                  <img
                    src={Email}
                    alt="email"
                    className="w-[18px] h-[18px] mr-2"
                  />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email address"
                    className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px] placeholder:text-slate-500"
                    maxLength="250"
                    autoComplete="email"
                  />
                </div>
                {validationnErr.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationnErr.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative mb-5">
                <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none bg-[#111318] px-1">
                  Password
                </span>
                <div
                  className={`flex items-center bg-[#23262F] border-[1.5px] ${validationnErr.password ? "border-red-500" : "border-primary"} rounded-[8px] px-4 h-[56px]`}
                >
                  <span className="text-amber-600 text-base mr-2">🔒</span>
                  <input
                    type={inputType}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px] placeholder:text-slate-500"
                    minLength={8}
                    maxLength={15}
                  />
                  <button
                    type="button"
                    className="ml-2 bg-none border-none text-gray-400 text-base cursor-pointer p-0 transition-colors hover:text-amber-600"
                    onClick={() => passwordHide(passHide ? "show" : "hide")}
                  >
                    {passHide ? "👁" : "👁‍🗨"}
                  </button>
                </div>
                {validationnErr.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationnErr.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative mb-5">
                <span className="absolute -top-2 left-4 text-[12px] text-[#D6D8E0] z-10 leading-none bg-[#111318] px-1">
                  Confirm Password
                </span>
                <div
                  className={`flex items-center bg-[#23262F] border-[1.5px] ${validationnErr.confirmPassword ? "border-red-500" : "border-primary"} rounded-[8px] px-4 h-[56px]`}
                >
                  <span className="text-amber-600 text-base mr-2">🔒</span>
                  <input
                    type={inputTypeconf}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm your password"
                    className="bg-transparent outline-none border-none ring-0 focus:ring-0 flex-1 text-white text-[14px] placeholder:text-slate-500"
                    minLength={8}
                    maxLength={15}
                  />
                  <button
                    type="button"
                    className="ml-2 bg-none border-none text-gray-400 text-base cursor-pointer p-0 transition-colors hover:text-amber-600"
                    onClick={() =>
                      passwordHideconf(passHidconf ? "show" : "hide")
                    }
                  >
                    {passHidconf ? "👁" : "👁‍🗨"}
                  </button>
                </div>
                {validationnErr.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationnErr.confirmPassword}
                  </p>
                )}
              </div>

              {/* Referral Code */}
              {/* <div className="mb-5 mt-6">
                <button
                  type="button"
                  className="w-full px-4 py-3.5 bg-slate-700 border border-slate-600 rounded-lg text-amber-600 text-sm font-medium flex items-center justify-between cursor-pointer transition-all hover:border-amber-600 hover:bg-slate-800"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">🎁</span>
                    Enter Referral Code (Optional)
                  </span>
                  <span className="text-xs transition-transform">▼</span>
                </button>
              </div> */}

              {/* Terms Checkbox */}
              <div className="mb-5 mt-6">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Terms}
                    onChange={handleTermsChange}
                    className="w-4.5 h-4.5 min-w-4.5 mt-0.5 cursor-pointer accent-amber-600 rounded"
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    I have read and agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-amber-600 no-underline font-semibold transition-colors hover:text-amber-300 hover:underline"
                    >
                      User Agreement
                    </Link>{" "}
                    &{" "}
                    <Link
                      to="/privacy"
                      className="text-amber-600 no-underline font-semibold transition-colors hover:text-amber-300 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {termsValidation && (
                  <p className="text-red-500 text-xs mt-1.5 mb-0">
                    {t("termsIsARequiredField")}
                  </p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full px-4 py-4 bg-gradient-to-r from-amber-600 to-amber-500 border-none rounded-lg text-slate-900 text-base font-bold cursor-pointer transition-all mt-5 shadow-lg shadow-amber-600/30 hover:shadow-amber-600/40 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={buttonLoader}
              >
                {buttonLoader ? "Loading..." : "→ Sign up"}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400 m-0">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-amber-600 no-underline font-semibold transition-colors hover:text-amber-300 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
