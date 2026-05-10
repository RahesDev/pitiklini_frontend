import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Pattern from "../assets/svg/Pattern.svg";
import Pattern1 from "../assets/svg/Pattern-1.svg";
import Pattern2 from "../assets/svg/Pattern-2.svg";

export default function VerificationTesting() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [OTP, setOTP] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [counter, setCounter] = useState(28);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const [otpError, setotpError] = useState(false);
  const [resendClick, setResendClick] = useState(false);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
    setIsResendVisible(true);
  }, [counter]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setOTP(value);
      setotpError(value.length !== 4);
    }
  };

  const submit = async () => {
    if (OTP.length !== 4) {
      setotpError(true);
      return;
    }

    try {
      const payload = {
        emailOtp: OTP,
        email: sessionStorage.getItem("useremail"),
      };

      const data = {
        apiUrl: apiService.emailotpverify,
        payload,
      };

      setbuttonLoader(true);
      const resp = await postMethod(data);
      setbuttonLoader(false);

      if (resp.status === true) {
        toast.dismiss();
        toast.success(resp.Message);
        navigate("/login");
      } else {
        toast.dismiss();
        toast.error(resp.Message);
      }
    } catch (error) {
      setbuttonLoader(false);
      toast.dismiss();
      toast.error(t("somethingWentWrong") || "Something went wrong. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      setResendClick(true);
      const payload = {
        email: sessionStorage.getItem("useremail"),
      };
      const data = {
        apiUrl: apiService.resendCode,
        payload,
      };
      const resp = await postMethod(data);
      setResendClick(false);

      if (resp.status) {
        setCounter(28);
        setIsResendVisible(false);
        toast.dismiss();
        toast.success(resp.Message);
      } else {
        toast.dismiss();
        toast.error(resp.Message);
      }
    } catch (error) {
      setResendClick(false);
      toast.dismiss();
      toast.error(t("somethingWentWrong") || "Something went wrong. Please try again.");
    }
  };

  const focusOtpInput = () => {
    inputRef.current?.focus();
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

        <div className="relative z-10 w-full flex flex-col items-center py-8 pt-20 px-4">
          <div className="relative z-10 w-[560px] max-w-[100%] overflow-hidden rounded-[32px] border border-[#1E2028] bg-[#111318] px-8 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="absolute left-6 top-6">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-[#c79926] bg-[#111318]/80 px-4 py-2 text-sm font-medium text-white transition hover:border-[#e0b347]"
              >
                <i className="fa-solid fa-arrow-left-long text-base text-white"></i>
                {t("back") || "Back"}
              </Link>
            </div>

            <div className="mx-auto mb-8 h-1.5 w-[260px] rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-fuchsia-500" />

            <div className="mx-auto mb-8 flex h-24 w-24 gap-x-4 items-center justify-center">
              <img
                src={require("../assets/Pattern.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
              <img
                src={require("../assets/otp_verification_icon.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
              <img
                src={require("../assets/Pattern.png")}
                alt="pitiklini-icon"
                className="w-20 h-20 object-contain drop-shadow-lg shadow-amber-600/30 mx-auto"
              />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-semibold uppercase tracking-[0.02em] text-[#d6a333] sm:text-4xl">
                {t("emailVerificationCode") || "Email Verification Code"}
              </h1>
              <p className="mx-auto mt-4 max-w-[460px] text-base leading-7 text-slate-300 sm:text-lg">
                {t("verificationDescription") ||
                  "We've sent a 6-digit confirmation code to your email. Please enter the code in the box below to verify your account creation request."}
              </p>
            </div>

            <div className="mt-10">
              <div
                className="relative mx-auto flex max-w-[520px] cursor-text items-center justify-center gap-3 rounded-[24px] bg-[#171a22] px-4 py-6"
                onClick={focusOtpInput}
              >
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]*"
                  value={OTP}
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0"
                  aria-label={t("enterOTP") || "Enter OTP"}
                />
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex h-16 w-16 items-center justify-center rounded-3xl border text-2xl font-semibold transition ${
                      OTP[idx]
                        ? "border-[#d19c24] bg-[#d19c24] text-black"
                        : "border-[#2b3140] bg-[#1b1f2a] text-[#7b8091]"
                    }`}
                  >
                    {OTP[idx] || ""}
                  </div>
                ))}
              </div>

              {otpError && (
                <p className="mt-4 text-center text-sm text-rose-400">
                  {t("enteravalidOTP") || "Please enter the 4-digit code."}
                </p>
              )}
            </div>

            <div className="mt-10">
              <button
                onClick={submit}
                className="inline-flex h-14 w-full items-center justify-center rounded-3xl bg-[#1e212c] border border-[#2a2e3d] text-lg font-semibold text-white transition hover:bg-[#282d3c]"
              >
                {buttonLoader
                  ? `${t("loading") || "Loading"}...`
                  : t("confirm") || "Confirm"}
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-[#d6a333] sm:flex-row">
              <span>{t("Didnt_code") || "Didn't receive the code?"}</span>
              <div className="flex items-center gap-3">
                {resendClick ? (
                  <span className="inline-flex items-center gap-2 text-yellow-300">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    {t("resending") || "Resending"}
                  </span>
                ) : (
                  <>
                    <span className="font-semibold">
                      00:{String(counter).padStart(2, "0")}
                    </span>
                    {isResendVisible ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-yellow-300 underline transition hover:text-yellow-200"
                      >
                        {t("resend") || "Resend"}
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
