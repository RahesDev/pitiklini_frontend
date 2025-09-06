import React from "react";
import Header from "./Header";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { t } from "i18next";

const Anti = () => {
  const navigate = useNavigate();

  const initialFormValue = {
    oldpassword: "",
    password: "",
    confirmPassword: "",
  };
  const [formValue, setFormValue] = useState(initialFormValue);

  const { oldpassword, password, confirmPassword } = formValue;
  const [passwordValidate, setpasswordValidate, passwordValidateref] =
    useState(false);
  const [
    confirmPasswordValidate,
    setconfirmPasswordValidate,
    confirmPasswordValidateref,
  ] = useState(false);
  const [oldpassvalidate, setoldpassvalidate, oldpassvalidateref] =
    useState(false);
  const [passHide, setPasshide] = useState(false);
  const [inputType, setinputType] = useState("password");
  const [passHidconf, setPasshideconf] = useState(false);
  const [inputTypeconf, setinputTypeconf] = useState("password");
  const [passHidnew, setPasshidenew] = useState(false);
  const [inputTypenew, setinputTypenew] = useState("password");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");

  const validate = async (values) => {
    const errors = {};
    if (values.oldpassword == "") {
      errors.oldpassword = "Old password is required";
      setoldpassvalidate(true);
    } else {
      setoldpassvalidate(false);
    }

    if (values.password == "") {
      setpasswordValidate(true);
      errors.password = "Password is required";
    } else if (values.password.length < 8 || values.password.length > 15) {
      setpasswordValidate(true);
      errors.password = "New password should be between 8-15 characters!";
    } else if (!values.password.match(/[a-z]/g)) {
      setpasswordValidate(true);
      errors.password = "Please enter at least one lowercase character";
    } else if (!values.password.match(/[A-Z]/g)) {
      setpasswordValidate(true);
      errors.password = "Please enter at least one uppercase character!";
    } else if (!values.password.match(/[0-9]/g)) {
      setpasswordValidate(true);
      errors.password = "Please enter at least one numeric character!";
    } else if (!values.password.match(/[!@#$%^&*]/g)) {
      setpasswordValidate(true);
      errors.password = "Please enter at least one special character!";
    } else if (values.password == values.oldpassword) {
      errors.password = "Old password and New password should not be same";
      setpasswordValidate(true);
    } else {
      setpasswordValidate(false);
    }

    if (values.confirmPassword == "") {
      errors.confirmPassword = "Confirm password is required";
      setconfirmPasswordValidate(true);
    } else if (values.confirmPassword != values.password) {
      setconfirmPasswordValidate(true);
      errors.confirmPassword = "Password and confirm password does not match";
    } else {
      setconfirmPasswordValidate(false);
    }
    setvalidationnErr(errors);
    return errors;
  };

  const [buttonStatus, setButtonstatus] = useState(false);
  const [siteLoader, setSiteLoader] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
    validate(formData);
    if (
      confirmPasswordValidateref.current == false &&
      passwordValidateref.current == false &&
      oldpassvalidateref.current == false
    ) {
      setButtonstatus(true);
    } else {
      setButtonstatus(false);
    }
  };

  const formSubmit = async () => {
    validate(formValue);
    console.log(formValue, "formValue");
    if (
      confirmPasswordValidateref.current == false &&
      passwordValidateref.current == false &&
      oldpassvalidateref.current == false
    ) {
      var obj = {
        oldPass: formValue.oldpassword,
        password: formValue.password,
        cpass: formValue.confirmPassword,
      };

      var data = {
        apiUrl: apiService.changePassword,
        payload: obj,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      // localStorage.setItem("useremail", resp.email);
      sessionStorage.setItem("useremail", resp.email);
      setbuttonLoader(false);
      if (resp.status == true) {
        showsuccessToast(resp.Message);
        // localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
        // window.location.reload(true);
      } else {
        showerrorToast(resp.Message);
      }
    }
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

  const passwordHidenewP = (data) => {
    if (data == "hide") {
      setPasshidenew(true);
      setinputTypenew("text");
    } else {
      setPasshidenew(false);
      setinputTypenew("password");
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
        <main className="anti_phishing_main">
          <div className="reg_new_backcol">
            <div className="Verification ">
              <div className="container">
                <div>
                  <Link to="/security">
                    <h6 className="padfor_new_top">
                      {" "}
                      <i class="fa-solid fa-arrow-left-long mr-3"></i>{" "}
                      {t("security")}
                    </h6>
                  </Link>
                  <div className="row justify-content-center cards">
                    <div className="col-lg-4">
                      <span class="heading">{t("Change login Password")}</span>

                      <div className="input-groups icons mt-4">
                        <h6 className="input-label">{t("Old Password")}</h6>
                        <div className="flex_input_posion mb-2">
                          <input
                            type={inputType}
                            name="oldpassword"
                            minLength={15}
                            maxLength={30}
                            value={oldpassword}
                            //  onChange={handleChange}
                            onChange={(e) => {
                              const { value } = e.target;
                              const sanitizedValue = value.replace(/\s/g, "");
                              setFormValue((prev) => ({
                                ...prev,
                                oldpassword: sanitizedValue,
                              }));

                              if (!sanitizedValue) {
                                setoldpassvalidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  oldpassword: t("Old password is required"),
                                }));
                              } else {
                                setoldpassvalidate(false);
                                setvalidationnErr((prev) => {
                                  const { oldpassword, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="input-field"
                            placeholder={t("Enter your old Password")}
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
                        {oldpassvalidate == true ? (
                          <small className="errorcss">
                            {validationnErr.oldpassword}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="input-groups icons">
                        <h6 className="input-label">{t("newPassword")}</h6>
                        <div className="flex_input_posion mb-2">
                          <input
                            type={inputTypenew}
                            name="password"
                            minLength={15}
                            maxLength={30}
                            value={password}
                            //  onChange={handleChange}
                            onChange={(e) => {
                              console.log("password enters --->>> ****");
                              const { value } = e.target;
                              setFormValue((prev) => ({
                                ...prev,
                                password: value,
                              }));

                              if (!value) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t("Password is required"),
                                }));
                              } else if (
                                value.length < 15 ||
                                value.length > 30
                              ) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t(
                                    "new-password-should-be-bt-15-30"
                                  ),
                                }));
                              } else if (!value.match(/[a-z]/g)) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t(
                                    "please-enter-atleast-one-lower-char"
                                  ),
                                }));
                              } else if (!value.match(/[A-Z]/g)) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password:
                                    "please-enter-atleast-one-upper-char",
                                }));
                              } else if (!value.match(/[0-9]/g)) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t(
                                    "please-enter-atleast-one-numeric-char"
                                  ),
                                }));
                              } else if (!value.match(/[!@#$%^&*]/g)) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t(
                                    "please-enter-atleast-one-special-char"
                                  ),
                                }));
                              } else if (value == formValue.oldpassword) {
                                setpasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  password: t(
                                    "old-new-password-should-not-same"
                                  ),
                                }));
                              } else {
                                setpasswordValidate(false);
                                setvalidationnErr((prev) => {
                                  const { password, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="input-field"
                            placeholder={t("enter-your-new-password")}
                          />
                          {passHidnew == true ? (
                            <i
                              class="fa-regular fa-eye reg_eye"
                              onClick={() => passwordHidenewP("show")}
                            ></i>
                          ) : (
                            <i
                              class="fa-regular fa-eye-slash reg_eye"
                              onClick={() => passwordHidenewP("hide")}
                            ></i>
                          )}
                        </div>
                        {passwordValidate == true ? (
                          <small className="errorcss">
                            {" "}
                            {validationnErr.password}{" "}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="input-groups icons">
                        <h6 className="input-label">{t("confirmPassword")}</h6>
                        <div className="flex_input_posion mb-2">
                          <input
                            type={inputTypeconf}
                            name="confirmPassword"
                            maxLength={30}
                            value={confirmPassword}
                            // onChange={handleChange}
                            onChange={(e) => {
                              const { value } = e.target;
                              setFormValue((prev) => ({
                                ...prev,
                                confirmPassword: value,
                              }));

                              // Inline validation for confirmPassword
                              if (!value) {
                                setconfirmPasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  confirmPassword: t(
                                    "confirmPasswordIsRequired"
                                  ),
                                }));
                              } else if (value !== password) {
                                setconfirmPasswordValidate(true);
                                setvalidationnErr((prev) => ({
                                  ...prev,
                                  confirmPassword: t(
                                    "passwordConfirmPasswordNotMatch"
                                  ),
                                }));
                              } else {
                                setconfirmPasswordValidate(false);
                                setvalidationnErr((prev) => {
                                  const { confirmPassword, ...rest } = prev;
                                  return rest;
                                });
                              }
                            }}
                            className="input-field"
                            placeholder={t("reenterYourNewPassword")}
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
                          <small className="errorcss">
                            {" "}
                            {validationnErr.confirmPassword}{" "}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="Submit my-4">
                        {buttonLoader == false ? (
                          <button onClick={formSubmit}>{t("confirm")}</button>
                        ) : (
                          <button>{t("loading")} ...</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Anti;
