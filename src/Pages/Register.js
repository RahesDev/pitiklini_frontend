import React, { useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
export default function Register() {
  const { t } = useTranslation();
  const [isReferralFromUrl, setIsReferralFromUrl] = useState(false);
  // useEffect(() => {
  //   let str = window.location.href;
  //   const letters = str.includes("?");
  //   if (letters) {
  //     console.log(
  //       window.location.href.split("=")[1],
  //       "window.location.href",
  //       letters
  //     );
  //     // setReferalGet(window.location.href.split("=")[1]) ;
  //     let locationData = window.location.href.split("=")[1];
  //     let formData = { ...formValue, ...{ referral_code: locationData } };
  //     setFormValue(formData);
  //     setIsReferralFromUrl(true);
  //   } else {
  //     // console.log("asfasdfasdfasdfasdfsd");
  //   }
  // }, []);

  const { register } = useAuth();
  const initialFormValue = {
    email: "",
    password: "",
    confirmPassword: "",
    // referral_code: "",
  };

  const [validationnErr, setvalidationnErr] = useState("");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [emailValidate, setemailValidate, emailValidateref] = useState(false);
  const [passwordValidate, setpasswordValidate, passwordValidateref] =
    useState(false);
  const [
    confirmPasswordValidate,
    setconfirmPasswordValidate,
    confirmPasswordValidateref,
  ] = useState(false);
  const [isChecked, setIschecked] = useState(false);
  const [Terms, setTerms, Termsref] = useState(false);
  const [termsValidation, setTermsValidation] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState("password");

  const { email, password, confirmPassword, referral_code } = formValue;

  const navigate = useNavigate();
  const createUid = uuidv4();
  const createdUuid = createUid.split("-")[0].toString();

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const sanitizedValue = value.replace(/\s/g, "");
    let formData = { ...formValue, ...{ [name]: sanitizedValue } };
    setFormValue(formData);
    validate(formData);
  };

  const handleTerms = (event) => {
    setIschecked(event.target.checked);
    setTerms(event.target.checked);
    setTermsValidation(!event.target.checked);
  };

  const validate = (values) => {
    let errors = {};
    const username = values.email.split("@")[0];

    if (!values.email) {
      errors.email = t("emailIsRequiredField");
      setemailValidate(true);
    } else if (
      !/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = t("invalidEmailAddress");
      setemailValidate(true);
    } else if (username.length < 3 || username.length > 150) {
      errors.email = t("emailMustBe3-150char");
      setemailValidate(true);
    } else if (!/^[a-zA-Z0-9.]+$/i.test(username)) {
      errors.email = t("only-letter-num-per-are-allowed");
      setemailValidate(true);
    } else if (!/[a-zA-Z]/.test(username)) {
      errors.email = t("emailUsernameContainAtleastOneLetter");
      setemailValidate(true);
    } else {
      setemailValidate(false);
    }

    if (values.password == "") {
      setpasswordValidate(true);
      errors.password = t("passwordIsRequired");
    } else if (values.password.length < 8 || values.password.length > 15) {
      setpasswordValidate(true);
      errors.password = t("passwordShoulNotBelow1530letters");
    } else if (!values.password.match(/[a-z]/g)) {
      setpasswordValidate(true);
      errors.password = t("pleaseEnteratleastlowercharacter");
    } else if (!values.password.match(/[A-Z]/g)) {
      setpasswordValidate(true);
      errors.password = t("pleaseEnteratleastuppercharacter");
    } else if (!values.password.match(/[0-9]/g)) {
      setpasswordValidate(true);
      errors.password = t("pleaseEnterAtOneDigitChar");
    } else if (!values.password.match(/[!@#$%^&*]/g)) {
      setpasswordValidate(true);
      errors.password = t("pleaseEnterAtleastOneSpecialChar");
    } else {
      setpasswordValidate(false);
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = t("confirmPasswordIsaRequiredField");
      setconfirmPasswordValidate(true);
    } else if (
      values.password &&
      values.confirmPassword &&
      values.password !== values.confirmPassword
    ) {
      errors.confirmPassword = t("passwordAndConfirmPassDoesntmatch");
      setconfirmPasswordValidate(true);
    } else {
      setconfirmPasswordValidate(false);
    }

    if (!Terms) {
      errors.terms = t("termsIsARequiredField");
      setTermsValidation(true);
    } else {
      errors.terms = "";
      // setconfirmPasswordValidate(false);
      // setpasswordValidate(false);
      // setemailValidate(false);
      setTermsValidation(false);
    }

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

  const passwordHideconf = (data) => {
    if (data == "hide") {
      setPasshideconf(true);
      setinputTypeconf("text");
    } else {
      setPasshideconf(false);
      setinputTypeconf("password");
    }
  };

  const formSubmit = async (payload) => {
    let errros = validate(formValue);
    formValue["UUID"] = createdUuid;
    console.log(formValue, "=-=-=-formvalue=-=-");
    if (
      emailValidateref.current === false &&
      passwordValidateref.current === false &&
      confirmPasswordValidateref.current === false &&
      Terms == true
    ) {
      console.log(formValue);
      var data = {
        apiUrl: apiService.signup,
        payload: formValue,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setFormValue(initialFormValue);
      setbuttonLoader(false);
      if (resp.status == true) {
        toast.success(resp.Message);
        // localStorage.setItem("useremail", formValue.email);
        sessionStorage.setItem("useremail", formValue.email);
        navigate("/verification");
      } else {
        toast.error(resp.Message);
      }
    } else {
    }
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
            <div className="row reg-container">
              <div className="col-lg-6 left-reg ">
                <div className="reg-left-flex">
                  <div className="reg-left-title">{t("JoinNowandElevate")}</div>
                  <div className="reg-gift">
                    <img
                      src={require("../assets/reg-gift.webp")}
                      alt="gift-icon"
                    />
                  </div>
                  <div className="reg-left-content">{t("Joinnow")}</div>
                </div>
              </div>

              <div className="col-lg-6 right-reg">
                <span class="heading">{t("WelcomeToPitiklini")}</span>

                <div className="input-groups mt-4 mb-3">
                  <h6 className="input-label mb-3">{t("email_label")}</h6>
                  <input
                    type="text"
                    name="email"
                    value={email}
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
                    className="input-field"
                    placeholder={t("pleaseEnterYourEmailAddress")}
                  />
                  {validationnErr && validationnErr.email && (
                    <p className="errorcss">{validationnErr.email}</p>
                  )}
                </div>

                <div className="input-groups icons my-4">
                  <h6 className="input-label mb-3">{t("password_label")}</h6>
                  <div className="flex_input_posion">
                    <input
                      type={inputType}
                      name="password"
                      value={password}
                      minLength={15}
                      maxLength={30}
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
                        } else if (value.length < 15 || value.length > 30) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t("passwordShouldBe1530Char"),
                          }));
                        } else if (!value.match(/[a-z]/g)) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t("please-enter-atleast-one-lower-char"),
                          }));
                        } else if (!value.match(/[A-Z]/g)) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t("please-enter-atleast-one-upper-char"),
                          }));
                        } else if (!value.match(/[0-9]/g)) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t(
                              "please-enter-atleast-one-numeric-char"
                            ),
                          }));
                        } else if (!value.match(/[!@#$%^&*]/g)) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            password: t(
                              "please-enter-atleast-one-special-char"
                            ),
                          }));
                        } else {
                          setvalidationnErr((prev) => {
                            const { password, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className="input-field"
                      placeholder={t("pleaseCreatePassword")}
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
                </div>

                <div className="input-groups icons my-4">
                  <h6 className="input-label mb-3">{t("confirmPassword")}</h6>
                  <div className="flex_input_posion">
                    <input
                      type={inputTypeconf}
                      name="confirmPassword"
                      value={confirmPassword}
                      minLength={15}
                      maxLength={30}
                      // onChange={handleChange}
                      onChange={(e) => {
                        const { value } = e.target;
                        setFormValue((prev) => ({
                          ...prev,
                          confirmPassword: value,
                        }));

                        // Inline validation for confirmPassword
                        if (!value) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            confirmPassword: t("confirmPasswordIsRequired"),
                          }));
                        } else if (value !== password) {
                          setvalidationnErr((prev) => ({
                            ...prev,
                            confirmPassword: t(
                              "passwordAndConfirmPassDoesntmatch"
                            ),
                          }));
                        } else {
                          setvalidationnErr((prev) => {
                            const { confirmPassword, ...rest } = prev;
                            return rest;
                          });
                        }
                      }}
                      className="input-field"
                      placeholder={t("pleaseReenterthePassword")}
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
                  {validationnErr && validationnErr.confirmPassword && (
                    <p className="errorcss">{validationnErr.confirmPassword}</p>
                  )}
                </div>

                {/* <div className="input-groups icons">
                  <h6 className="input-label mb-3">Refferal code</h6>
                  <input
                    type="text"
                    name="referral_code"
                    maxLength={11}
                    value={referral_code}
                    disabled={isReferralFromUrl}
                    // readOnly
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Refferal code ( Optional )"
                  />
                </div> */}

                {/* <div className="terms-new">
                  <div className="terms">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleTerms}
                      id="customCheck"
                      className="checkbox-round"
                    />

                    <label htmlFor="customCheck" className="terms-check">
                      I have read and agree to the
                      <span> Terms </span> and <span> Conditions</span>
                    </label>
                  </div>
                  {termsValidation && (
                    <p className="errorcss">
                      Terms and Conditions are required
                    </p>
                  )}
                </div> */}

                <div className="terms-new">
                  <div className="terms">
                    <div class="checkbox-container">
                      <input
                        id="custom-checkbox"
                        checked={isChecked}
                        // onChange={handleTerms}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIschecked(checked);
                          setTerms(checked);
                          if (!checked) {
                            setTermsValidation(true);
                          } else {
                            setTermsValidation(false);
                          }
                        }}
                        className="input-field regular_checkbox"
                        type="checkbox"
                        placeholder={t("enterReferralId")}
                      />
                      <label htmlFor="custom-checkbox"></label>
                    </div>
                    <label htmlFor="custom-checkbox" className="terms-check">
                      {t("Ihaveread")}
                      <Link to="/terms" className="text-yellow" target="_blank">
                        {" "}
                        {t("TermsConditions")}{" "}
                      </Link>{" "}
                      {t("And")}{" "}
                      <Link
                        to="/privacy"
                        className="text-yellow"
                        target="_blank"
                      >
                        {" "}
                        {t("PrivacyPolicy")}
                      </Link>
                    </label>
                  </div>

                  {termsValidation && (
                    <p className="errorcss">{t("TermsandConditions")}</p>
                  )}
                </div>

                <div className="Submit">
                  {buttonLoader == false ? (
                    <button onClick={formSubmit}>{t("register")}</button>
                  ) : (
                    <button>{t("Loading")} ...</button>
                  )}
                </div>

                <div className="foot">
                  <p>
                    {t("Alreadyregistered")}?
                    <Link to="/login">{t("login")}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
