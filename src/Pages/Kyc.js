import React, { useEffect, useMemo } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData2";
import "react-phone-input-2/lib/style.css";
import Side_bar from "./Side_bar";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import Select, { components } from "react-select";
import countryList from "react-select-country-list";
import { env } from "../core/service/envconfig";
import WARNICON from "../assets/icons/withdraw-warn.webp";
import { useTranslation } from "react-i18next";
import { loadStripe } from '@stripe/stripe-js';

const colourStyles = {
  control: (styles, { isFocused }) => ({
    ...styles,
    fontSize: "16px",
    backgroundColor: "#24252a",
    color: "#eaecef",
    border: isFocused ? "1px solid #BD7F10" : "1px solid #444",
    boxShadow: isFocused ? "0 0 5px rgba(189, 127, 16, 0.5)" : "none",
    // "&:hover": {
    //   border: "1px solid #BD7F10",
    // },
  }),
  option: (styles, { isDisabled, isFocused, isSelected }) => ({
    ...styles,
    fontSize: "16px",
    backgroundColor: isFocused ? "#24252a" : "#181a20",
    color: isFocused ? "#BD7F10" : "#eaecef",
    cursor: isDisabled ? "not-allowed" : "pointer",
    borderBottom: `1px solid ${isFocused ? "#BD7F10" : "#181a20"}`,
  }),
  menu: (styles) => ({
    ...styles,
    border: "1px solid #444",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "transparent",
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    backgroundColor: "#313237",
    color: "#eaecef",
    padding: "10px",
    textAlign: "center",
    margin: "0",
    fontSize: "16px",
  }),
};

const NoOptionsMessage = (props) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div style={{ backgroundColor: "#313237", color: "#fff", margin: "0" }}>
        No options found
      </div>
    </components.NoOptionsMessage>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const [levelFirst, setLevelFirst, levelFirstref] = useState(true);
  const [levelScndstart, setLevelScndstart, levelScndstartref] =
    useState(false);
    const [loading, setLoading] = useState(false);

  const [levelThird, setLevelThird, levelThirdref] = useState(false);
  const [levelFourth, setLevelFourth, levelFourthref] = useState(false);

  const [valididproof, setvalididproof] = useState(0);
  const [idproofLoad, setidproofLoad] = useState(false);
  const [idproof, setidproof, idproofref] = useState("");
  const [idproofname, setidproofname, idproofnameref] = useState("");
  const [validaddressProof, setvalidaddressProof] = useState(0);
  const [addressProofup, setaddressProof, addressProofref] = useState("");
  const [addressproofname, setaddressproofname, addressproofnameref] =
    useState("");
  const [addressProofLoad, setaddressProofLoad] = useState(false);
  const [validSelfieProof, setvalidSelfieProof] = useState(0);
  const [SelfieProofup, setSelfieProof, SelfieProofref] = useState("");
  const [Selfieproofname, setSelfieproofname, Selfieproofnameref] =
    useState("");
  const [SelfieProofLoad, setSelfieProofLoad] = useState(false);
  const [uploadError, setUploadError, uploadErrorref] = useState(false);
  const [selfieError, setSelfieError, selfieErrorref] = useState(false);
  const [getKYCData, setgetKYCData] = useState("");
  const [getKYCDataReject, setgetKYCDataReject] = useState("");

  const initialFormValue = {
    fullname: "",
    dob: "",
    nationality: "",
    residential: "",
    verfiType: "",
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const { fullname, dob, nationality, residential, verfiType } = formValue;

  const [fullNameValidate, setfullNameValidate, fullNameValidateref] =
    useState(false);
  const [DOBValidate, setDOBValidate, DOBValidateref] = useState(false);
  const [nationalityValidate, setnationalityValidate, nationalityValidateref] =
    useState(false);
  const [addressValidate, setaddressValidate, addressValidateref] =
    useState(false);
  const [
    documentTypeValidate,
    setdocumentTypeValidate,
    documentTypeValidateref,
  ] = useState(false);
  const [validationnErr, setvalidationnErr] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [siteLoader, setSiteLoader] = useState(true);
  const options = useMemo(() => countryList().getData(), []);
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const [kycStatus, setkycStatus] = useState("Active");

  const today = new Date().toISOString().split("T")[0];

  const stripePromise = loadStripe('pk_live_51RCmRZCX9Vm8QfmZDqzEYziJsLICEAaA55U1r0Gr7N6ogsz2XdXXb3bdLgPqJlpMNNK3v5jC7oWmxjpgHcNhpHEZ00htcHaKJ2');

  const [stripe, setStripe] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === " " && e.target.selectionStart === 0) {
      e.preventDefault();
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;
    // let formData = { ...formValue, ...{ [name]: e.target.value } };
    // setFormValue(formData);
    // validate(formData);
    setFormValue((prev) => ({ ...prev, [name]: value }));
    if (name === "fullname") {
      if (!value) {
        setfullNameValidate(true);
        setvalidationnErr((prev) => ({
          ...prev,
          fullname: t("fullnameIsReqField"),
        }));
      } else if (!/^[a-zA-Z]/.test(value)) {
        setfullNameValidate(true);
        setvalidationnErr((prev) => ({
          ...prev,
          fullname: t("fullnameMustStartLetter"),
        }));
      } else if (value.length < 3 || value.length > 60) {
        setvalidationnErr((prev) => ({
          ...prev,
          fullname: t("fullnameMust360Char"),
        }));
      } else {
        setfullNameValidate(false);
        setvalidationnErr((prev) => {
          const { fullname, ...rest } = prev;
          return rest;
        });
      }
    } else if (name === "dob") {
      if (!value) {
        setDOBValidate(true);
        setvalidationnErr((prev) => ({
          ...prev,
          dob: t("dateOfBirthIsReq"),
        }));
      } else if (value > today) {
        setDOBValidate(true);
        setvalidationnErr((prev) => ({
          ...prev,
          dob: t("pleaseEnterValidDateBirth"),
        }));
      } else {
        setDOBValidate(false);
        setvalidationnErr((prev) => {
          const { dob, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleTextChange = async (e) => {
    // let addrressData = { ...formValue, residential: e.target.value };
    // setFormValue(addrressData);
    // validate(addrressData);
    const { value } = e.target;
    setFormValue((prev) => ({ ...prev, residential: value }));
    if (!value) {
      setaddressValidate(true);
      setvalidationnErr((prev) => ({
        ...prev,
        residential: t("addressIsReqField"),
      }));
    } else if (value.length < 3) {
      setaddressValidate(true);
      setvalidationnErr((prev) => ({
        ...prev,
        residential: t("min3CharAllowed"),
      }));
    } else if (value.length > 250) {
      setaddressValidate(true);
      setvalidationnErr((prev) => ({
        ...prev,
        residential: t("max250CharAllowed"),
      }));
    } else {
      setaddressValidate(false);
      setvalidationnErr((prev) => {
        const { residential, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleNationalityChange = (selectedNationality) => {
    // const updatedFormValue = {
    //   ...formValue,
    //   nationality: selectedNationality.label,
    // };

    // setFormValue(updatedFormValue);
    // validate(updatedFormValue);
    const nationalityValue = selectedNationality.label;
    setFormValue((prev) => ({ ...prev, nationality: nationalityValue }));
    if (!nationalityValue) {
      setnationalityValidate(true);
      setvalidationnErr((prev) => ({
        ...prev,
        nationality: t("nationalityIsReq"),
      }));
    } else {
      setnationalityValidate(false);
      setvalidationnErr((prev) => {
        const { nationality, ...rest } = prev;
        return rest;
      });
    }
  };
  
  // const startVerification = async () => {
  //   try {
  //     setLoading(true);
  
  //     const response = await postMethod(apiService.kycStripe, {});
  
  //     if (response?.url) {
  //       console.log("Redirecting to verification URL:", response.url);
  //       window.location.href = response.url;
  //       return;
  //     }
  
  //     console.warn("No URL received from the server:", response);
  
  //   } catch (error) {
  //     console.error("Error in verification:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const startVerification = async () => {
    try {
      setLoading(true); 
  
      const data = { apiUrl: apiService.kycStripe };
      const response = await postMethod(data);
      console.log("Response:", response);
      if (response?.url) {
        window.location.href = response.url; 
        return; 
      }

      console.log("Response:", response);
    } catch (error) {
      console.error("Error in verification:", error);
    } finally {
      setLoading(false); 
    }
  };
  

  // const startVerification = async () => {
  //   try {
  //     setLoading(true); 
  
  //     const apiUrl = apiService.kycStripe; 
  //     console.log("API URL:", apiUrl);
  
  //     const response = await postMethod(apiUrl);  
  //     console.log("Response:", response);
  
  //     if (response?.url) {
  //       console.log("Redirecting to Stripe verification page...");
  //       window.location.href = response.url;  
  //       return;
  //     }
  
  //     console.error("Error: No verification URL received from API");
      
  //   } catch (error) {
  //     console.error("Error in verification:", error);
  //   } finally {
  //     setLoading(false);  
  //   }
  // };
  

  const handleDocumentTypeChange = (event) => {
    // const updatedFormValue = {
    //   ...formValue,
    //   verfiType: event.target.value,
    // };
    // setFormValue(updatedFormValue);
    // validate(updatedFormValue);

    const { value } = event.target;
    let errors = { ...validationnErr };

    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      verfiType: value,
    }));

    if (!value) {
      errors.verfiType = t("pleaseSelectanyoneDoc");
      setdocumentTypeValidate(true);
    } else {
      errors.verfiType = "";
      setdocumentTypeValidate(false);
    }

    setvalidationnErr(errors);
    setvalididproof(0);
    setidproof("");
    setidproofname("");
    setvalidaddressProof(0);
    setaddressProof("");
    setaddressproofname("");
    setvalidSelfieProof(0);
    setSelfieProof("");
    setSelfieproofname("");
  };

  const validate = (values) => {
    let errors = {};

    if (levelFirstref.current == true) {
      if (!values.fullname) {
        errors.fullname = t("fullnameIsReq");
        setfullNameValidate(true);
      } else if (!/^[a-zA-Z]/.test(values.fullname)) {
        errors.fullname = t("fullnameMustStartLetter");
        setfullNameValidate(true);
      } else if (values.fullname.length < 3 || values.fullname.length > 60) {
        errors.fullname = t("fullnameMust360Char");
        setfullNameValidate(true);
      } else {
        setfullNameValidate(false);
      }
      // else if (!/^[a-zA-Z0-9_]+$/.test(values.fullname)) {
      //   errors.fullname =
      //     "FullName can only contain letters, numbers, and underscores !";
      //   setfullNameValidate(true);
      // }
      if (values.dob == "") {
        setDOBValidate(true);
        errors.dob = t("dateOfBirthIsReq");
      } else if (values.dob > today) {
        setDOBValidate(true);
        errors.dob = t("pleaseEnterValidDateBirth");
      } else {
        setDOBValidate(false);
      }

      if (values.nationality == "") {
        setnationalityValidate(true);
        errors.nationality = t("nationalityIsReq");
      } else {
        setnationalityValidate(false);
      }

      if (!values.residential) {
        errors.residential = t("addressIsReqField");
        setaddressValidate(true);
      } else if (values.residential?.length < 3) {
        errors.residential = t("min3CharOnlyAllowed");
        setaddressValidate(true);
      } else if (values.residential?.length > 250) {
        errors.residential = t("max250CharOnlyAllowed");
        setaddressValidate(true);
      } else {
        // setfullNameValidate(false);
        // setDOBValidate(false);
        // setnationalityValidate(false);
        setaddressValidate(false);
      }
    }

    if (levelScndstartref.current == true) {
      if (values.verfiType == "") {
        errors.verfiType = t("pleaseSelectanyoneDoc");
        setdocumentTypeValidate(true);
      } else {
        setdocumentTypeValidate(false);
      }
    }

    setvalidationnErr(errors);

    return errors;
  };

  const formSubmit = async (payload) => {
    formValue["selfieDoc"] = SelfieProofref.current;
    if (SelfieProofref.current != "") {
      setSelfieError(false);
      var data = {
        apiUrl: apiService.kycUpload,
        payload: formValue,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      // setFormValue(initialFormValue);
      setbuttonLoader(false);
      if (resp.status == true) {
        showsuccessToast(resp.Message);
        const modal = document.getElementById("exampleModal");
        modal.classList.remove("show");
        modal.style.display = "none";
        document.body.classList.remove("modal-open");
        const backdrop = document.querySelector(".modal-backdrop");
        if (backdrop) backdrop.remove();
        navigate("/dashboard");
        setTimeout(() => {
          window.location.reload();
        }, 80); // Small delay to ensure navigation completes
      } else {
        showerrorToast(resp.Message);
      }
    } else {
      setSelfieError(true);
    }
  };

  const Firstsubmit = async () => {
    let errros = validate(formValue);
    if (
      fullNameValidateref.current === false &&
      DOBValidateref.current === false &&
      nationalityValidateref.current === false &&
      addressValidateref.current === false
    ) {
      setLevelFirst(false);
      setLevelScndstart(true);
    }
  };

  const secondFirstsubmit = async () => {
    let errros = validate(formValue);
    console.log(errros, "errros---");
    console.log(formValue, "=-=-=-=formValue=-=-=-");
    if (documentTypeValidateref.current == false) {
      console.log(formValue, "=-=-=-=formValue=-=-=-");
      setLevelScndstart(false);
      // setLevelScndend(true);
      setLevelThird(true);
    }
  };

  const secondLvlback = async () => {
    console.log("nationality console -->>", nationality);
    setLevelScndstart(false);
    setLevelFirst(true);
  };

  const thirdLvlback = async () => {
    console.log("verfiType console -->>", verfiType);
    setLevelThird(false);
    setLevelScndstart(true);
  };

  const fourthLvlback = async () => {
    setLevelFourth(false);
    setLevelThird(true);
  };

  const imageUpload = (type, val) => {
    try {
      const fileExtension = val.name.split(".").at(-1);
      const fileSize = val.size;
      const fileName = val.name;
      if (
        fileExtension != "png" &&
        fileExtension != "webp" &&
        fileExtension != "jpeg"
      ) {
        showerrorToast(
          "File does not support. You must use .png or .webp or .jpeg "
        );
      } else if (fileSize > 10000000) {
        showerrorToast("Please upload a file smaller than 1 MB");
      } else {
        type == "DocumentFront"
          ? setidproofLoad(true)
          : type == "DocumentBack"
          ? setaddressProofLoad(true)
          : setSelfieProofLoad(true);
        const data = new FormData();
        data.append("file", val);
        data.append("upload_preset", env.upload_preset);
        data.append("cloud_name", env.cloud_name);
        fetch(
          "https://api.cloudinary.com/v1_1/" + env.cloud_name + "/auto/upload",
          { method: "post", body: data }
        )
          .then((resp) => resp.json())
          .then((data) => {
            console.log(type, "type");
            if (type == "DocumentFront") {
              setidproofLoad(false);
              setvalididproof(2);
              if (
                fileExtension == "pdf" ||
                fileExtension == "odt" ||
                fileExtension == "doc"
              ) {
                setvalididproof(1);
              }
              setidproof(data.secure_url);
              setidproofname(val.name);
              setUploadError(false);
            }
            if (type == "DocumentBack") {
              setaddressProofLoad(false);
              setvalidaddressProof(2);
              if (
                fileExtension == "pdf" ||
                fileExtension == "odt" ||
                fileExtension == "doc"
              ) {
                setvalidaddressProof(1);
              }
              setaddressproofname(val.name);
              setaddressProof(data.secure_url);
              setUploadError(false);
            }
            if (type == "selfiePhoto") {
              setSelfieProofLoad(false);
              setvalidSelfieProof(2);
              if (
                fileExtension == "pdf" ||
                fileExtension == "odt" ||
                fileExtension == "doc"
              ) {
                setvalidSelfieProof(1);
              }
              setSelfieproofname(val.name);
              setSelfieProof(data.secure_url);
              setSelfieError(false);
            }
          })
          .catch((err) => {
            console.log(err);
            showerrorToast("Please try again later");
          });
      }
    } catch (error) {
      showerrorToast("Please try again later");
    }
  };

  const thirdSubmit = async () => {
    console.log(formValue, "=-=-=-form------value=-=-");
    formValue["frontDoc"] = idproofref.current;
    formValue["backDoc"] = addressProofref.current;
    if (idproofref.current != "" && addressProofref.current != "") {
      console.log(formValue, "=-=-=-formvalue entryyyyy=-=-");
      setUploadError(false);
      setLevelThird(false);
      setLevelFourth(true);
    } else {
      // console.log("yeah its come");
      setUploadError(true);
    }
  };

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    initializeStripe();
  }, []);

  useEffect(() => {
    getSitedata();
    Kycdata();
  }, []);

  const Kycdata = async () => {
    var data = {
      apiUrl: apiService.getKYC,
    };
    setSiteLoader(true);
    var resp = await getMethod(data);
    setSiteLoader(false);

    if (resp.status) {
      if (resp.status != "") {
        var kycData = resp.datas.userDetails;
        var kycDataReject = resp.datas.kycDetails;
        setgetKYCData(kycData);
        setgetKYCDataReject(kycDataReject);
      }
    }
  };

  const getSitedata = async () => {
    try {
      var data = {
        apiUrl: apiService.getSitedata,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setSiteData(resp.data);
        setSiteStatus(resp.data.siteStatus);
        setkycStatus(resp.data.kycStatus);
      }
    } catch (error) {}
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
              <div className="col-lg-2 col-md-0 padlef_0_col">
                <Side_bar />
              </div>

              <div className="col-lg-10 col-md-12 padin_lefrig_dash">
                <section className="asset_section">
                  {kycStatus == "Active" ? (
                    <>
                      <div className="row">
                        <div className="identification_title">
                          {t("identification")}
                        </div>
                        <div className="col-lg-7">
                          {getKYCData.kycstatus == 3 ? (
                            <div className="reject-box">
                              <span>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                              </span>
                              <span>{t("rejectedreason")}</span>

                              <p className="reject-reason mt-2">
                                {" "}
                                {getKYCDataReject.rejectReson}{" "}
                              </p>
                            </div>
                          ) : getKYCData.kycstatus == 2 ? (
                            <div className="pending-box">
                              <span>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                              </span>
                              <span>{t("yourKYCverification")}</span>

                              {/* <p className="reject-reason mt-2">
                            {" "}
                            {getKYCDataReject.rejectReson}{" "}
                          </p> */}
                            </div>
                          ) : (
                            ""
                          )}

                          {getKYCData.kycstatus == 1 ? (
                            <>
                              <div className="standard_verify_box">
                                <div className="standard_verify_content id-content">
                                  <h3>{t("youraccount")}</h3>
                                  <p className="kyc-cont">
                                    {t("youraccounthabeen")}
                                  </p>
                                </div>
                                <div className="standard_verify_img verify-img-cont">
                                  <img
                                    src={require("../assets/success.webp")}
                                  />
                                </div>
                              </div>
                              <div className="individual_kyc_box">
                                <div className="identification_features">
                                  <div className="individual_title mb-3">
                                    {/* {getKYCData.kycstatus == 1 ? "You're now able to access all features starting today." : "Unlock Exculsive Perks After Verification"} */}
                                  </div>

                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("trading")}
                                    </h3>
                                    <p className="text-green">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("withdrawals")}
                                    </h3>
                                    <p className="text-green">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("cryptoeposit")}
                                    </h3>
                                    <p className="text-green">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("fiat_deposit")}
                                    </h3>
                                    <p className="text-green">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("P2Ptrading")}
                                    </h3>
                                    <p className="text-green">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>

                                  <div className="my-4">
                                    {getKYCData.kycstatus == 2 ? (
                                      <button
                                        disabled
                                        className="action_btn opt-nowrap w-100 disabl"
                                        type="button"
                                      >
                                        {t("pending")}
                                      </button>
                                    ) : getKYCData.kycstatus == 1 ? (
                                      <Link to="/deposit">
                                        <button
                                          className="action_btn opt-nowrap w-100 kyc_depo_nw"
                                          type="button"
                                        >
                                          {t("deposit")}
                                        </button>
                                      </Link>
                                    ) : (
                                      <button
                                        className="action_btn opt-nowrap w-100 "
                                        type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                      >
                                        {t("verify_now")}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="standard_verify_box">
                                <div className="standard_verify_content id-content">
                                  <h3>{t("completeYourIdentity")}</h3>
                                  <p className="kyc-cont">
                                    {t("toensureyouraccount")}
                                  </p>
                                </div>
                                <div className="standard_verify_img verify-img-cont">
                                  <img
                                    src={require("../assets/refer_earn_banner.webp")}
                                  />
                                </div>
                              </div>
                              <div className="individual_kyc_box">
                                <div className="identification_features">
                                  <div className="individual_title mb-3">
                                    {/* {getKYCData.kycstatus == 1 ? "You're now able to access all features starting today." : "Unlock Exculsive Perks After Verification"} */}
                                  </div>

                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("trading")}
                                    </h3>
                                    <p className="text-yellow">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("withdrawals")}
                                    </h3>
                                    <p className="text-yellow">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("cryptoeposit")}
                                    </h3>
                                    <p className="text-yellow">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("fiat_deposit")}
                                    </h3>
                                    <p className="text-yellow">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>
                                  <div className="features-box">
                                    <h3 className="feature-title">
                                      {t("P2Ptrading")}
                                    </h3>
                                    <p className="text-yellow">
                                      <i class="ri-check-line"></i>
                                    </p>
                                  </div>

                                  <div className="my-4">
                                    {getKYCData.kycstatus == 2 ? (
                                      <button
                                        disabled
                                        className="action_btn opt-nowrap w-100 disabl"
                                        type="button"
                                      >
                                        {t("pending")}
                                      </button>
                                    ) : getKYCData.kycstatus == 1 ? (
                                      <Link to="/deposit">
                                        <button
                                          className="action_btn opt-nowrap w-100"
                                          type="button"
                                        >
                                          {t("deposit")}
                                        </button>
                                      </Link>
                                    ) : (
                                      <button
                                        className="action_btn opt-nowrap w-100"
                                        type="button"
                                        disabled={loading} 
                                        onClick={startVerification}
                                      >
                                        {loading ? (
                                          <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                          ></span>
                                        ) : (
                                          t("verify_now")
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* FAQ */}
                        <div className="col-lg-5">
                          <div>
                            <div className="container-lg">
                              <div
                                class="accordion accordion-flush"
                                id="accordionFlushExample"
                              >
                                <div className="faq mt-5">
                                  <h5 className="faq-title">{t("FAQ")}</h5>
                                  <div class="accordion-item font-satoshi">
                                    <h2
                                      class="accordion-header"
                                      id="flush-headingOne"
                                    >
                                      <button
                                        class="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseOne"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseOne"
                                      >
                                        1. {t("whyisKYCverificationrequired")}
                                      </button>
                                    </h2>
                                    <div
                                      id="flush-collapseOne"
                                      class="accordion-collapse collapse"
                                      aria-labelledby="flush-headingOne"
                                      data-bs-parent="#accordionFlushExample"
                                    >
                                      <div class="accordion-body">
                                        {t("KYCverification")}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="accordion-item font-satoshi">
                                    <h2
                                      class="accordion-header"
                                      id="flush-headingTwo"
                                    >
                                      <button
                                        class="accordion-button collapsed max-wrap"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseTwo"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseTwo"
                                      >
                                        2. {t("whatdocuments")}
                                      </button>
                                    </h2>
                                    <div
                                      id="flush-collapseTwo"
                                      class="accordion-collapse collapse"
                                      aria-labelledby="flush-headingTwo"
                                      data-bs-parent="#accordionFlushExample"
                                    >
                                      <div class="accordion-body">
                                        {t("youwillneedto")}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="accordion-item font-satoshi">
                                    <h2
                                      class="accordion-header"
                                      id="flush-headingThree"
                                    >
                                      <button
                                        class="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseThree"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseThree"
                                      >
                                        3. {t("howlongdoes")}
                                      </button>
                                    </h2>
                                    <div
                                      id="flush-collapseThree"
                                      class="accordion-collapse collapse"
                                      aria-labelledby="flush-headingThree"
                                      data-bs-parent="#accordionFlushExample"
                                    >
                                      <div class="accordion-body">
                                        {t("theverificationprocess")}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="accordion-item font-satoshi">
                                    <h2
                                      class="accordion-header"
                                      id="flush-headingFour"
                                    >
                                      <button
                                        class="accordion-button collapsed"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseFour"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseFour"
                                      >
                                        4. {t("ismypersonal")}
                                      </button>
                                    </h2>
                                    <div
                                      id="flush-collapseFour"
                                      class="accordion-collapse collapse"
                                      aria-labelledby="flush-headingFour"
                                      data-bs-parent="#accordionFlushExample"
                                    >
                                      <div class="accordion-body">
                                        {t("yesweuseencryption")}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="accordion-item font-satoshi">
                                    <h2
                                      class="accordion-header"
                                      id="flush-headingFive"
                                    >
                                      <button
                                        class="accordion-button collapsed max-wrap"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseFive"
                                        aria-expanded="false"
                                        aria-controls="flush-collapseFive"
                                      >
                                        5. {t("whatshouldI")}
                                      </button>
                                    </h2>
                                    <div
                                      id="flush-collapseFive"
                                      class="accordion-collapse collapse"
                                      aria-labelledby="flush-headingFive"
                                      data-bs-parent="#accordionFlushExample"
                                    >
                                      <div class="accordion-body">
                                        {t("ifyourverification")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="row">
                      <div className="identification_title">
                        {t("identification")}
                      </div>
                      <div className="col-lg-7">
                        <div className="deposit mt-5 h-100">
                          <div className="dep-kyc">
                            <div className="dep-kyc-head">
                              <img
                                src={WARNICON}
                                alt="warn-icon"
                                className="deposit-imp-icon"
                              />
                              <h6>{t("identificationTemporarily")}</h6>
                            </div>
                            {/* <p>
                            Due to ongoing platform maintenance, withdrawals are
                            currently restricted. We apologize for any
                            inconvenience this may cause. Our team is working
                            diligently to restore full service as soon as
                            possible.
                          </p> */}
                            <p>{siteData.kycMaintenance}</p>
                            <p className="my-3">
                              {/* {withdrawContent} */}
                              {/* <span className="text-yellow">00:00:00</span> */}
                            </p>
                            <div>
                              <img
                                src={require("../assets/kyc-unavail.webp")}
                                alt="Verify kyc"
                                className="before_kyc_depo withdraw-p-l-24"
                              />
                            </div>
                            <p className="mt-4">
                              {t("thankyouforyourpatienceandunderstanding")}
                            </p>
                            <div className="withdraw-p-l-24">
                              <Link to="/dashboard">
                                <button className="action_btn w-100 mb-2">
                                  {t("backToHome")}
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FAQ */}
                      <div className="col-lg-5">
                        <div>
                          <div className="container">
                            <div
                              class="accordion accordion-flush"
                              id="accordionFlushExample"
                            >
                              <div className="faq mt-5">
                                <h5 className="faq-title">{t("FAQ")}</h5>
                                <div class="accordion-item font-satoshi">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingOne"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseOne"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseOne"
                                    >
                                      1. {t("whyisKYCverificationrequired")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseOne"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingOne"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("KYCverification")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item font-satoshi">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingTwo"
                                  >
                                    <button
                                      class="accordion-button collapsed max-wrap"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseTwo"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseTwo"
                                    >
                                      2. {t("whatdocuments")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseTwo"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingTwo"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("youwillneedto")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item font-satoshi">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingThree"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseThree"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseThree"
                                    >
                                      3. {t("howlongdoes")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseThree"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingThree"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("theverificationprocess")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item font-satoshi">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingFour"
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseFour"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseFour"
                                    >
                                      4. {t("ismypersonal")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseFour"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingFour"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("yesweuseencryption")}
                                    </div>
                                  </div>
                                </div>
                                <div class="accordion-item font-satoshi">
                                  <h2
                                    class="accordion-header"
                                    id="flush-headingFive"
                                  >
                                    <button
                                      class="accordion-button collapsed max-wrap"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target="#flush-collapseFive"
                                      aria-expanded="false"
                                      aria-controls="flush-collapseFive"
                                    >
                                      5. {t("whatshouldI")}
                                    </button>
                                  </h2>
                                  <div
                                    id="flush-collapseFive"
                                    class="accordion-collapse collapse"
                                    aria-labelledby="flush-headingFive"
                                    data-bs-parent="#accordionFlushExample"
                                  >
                                    <div class="accordion-body">
                                      {t("ifyourverification")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <div
                  class="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  {levelFirst && (
                    <div class="modal-dialog modal-dialog-centered modal-md">
                      <div class="modal-content">
                        <div class="modal-header lvl-one-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            {t("level1")}{" "}
                            <span className="mar-lft-2">
                              {t("verification")}{" "}
                            </span>
                          </h1>
                          <button
                            type="button"
                            class="btn-close btn-close-custom"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>

                        <div className="modal-not-header">
                          <div className="modal-notify-content">
                            {t("tocompletelevel")}
                          </div>
                        </div>

                        <div className="modal-body personal_verify_body lvl-one-body">
                          <div className="mar-top-12">
                            <div className="first_name">
                              <h4 className="select_id_text">
                                {t("fullName")}
                              </h4>
                              <input
                                type="text"
                                placeholder={t("enterYourFullName")}
                                className="w-100"
                                maxLength={60}
                                name="fullname"
                                value={fullname}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                              />
                            </div>
                            {validationnErr && validationnErr.fullname && (
                              <p className="errorcss">
                                {validationnErr.fullname}
                              </p>
                            )}
                          </div>
                          <div className="id_number">
                            <div className="first_name">
                              <h4 className="select_id_text">{t("DOB")}</h4>
                              <input
                                type="date"
                                name="dob"
                                max={today}
                                value={dob}
                                onChange={handleChange}
                              />
                            </div>
                            {validationnErr && validationnErr.dob && (
                              <p className="errorcss">{validationnErr.dob}</p>
                            )}
                          </div>
                          <div className="id_number">
                            <div className="first_name">
                              <h4 className="select_id_text">
                                {t("nationality")}
                              </h4>
                              <Select
                                options={options}
                                value={options.find(
                                  (option) => option.label === nationality
                                )}
                                onChange={handleNationalityChange}
                                placeholder={t("selectNationality")}
                                className="kyc_nation"
                                styles={colourStyles}
                                components={{ NoOptionsMessage }}
                              />
                            </div>
                            {validationnErr && validationnErr.nationality && (
                              <p className="errorcss">
                                {validationnErr.nationality}
                              </p>
                            )}
                          </div>
                          <div className="id_number">
                            <div className="first_name">
                              <h4 className="select_id_text">
                                {t("residentialAddress")}
                              </h4>
                              <textarea
                                maxLength="250"
                                name="residential"
                                value={residential}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                                placeholder={t("Entertheaddress")}
                                fluid
                                rows="3"
                                className="kyc_address"
                              />
                            </div>
                            {validationnErr && validationnErr.residential && (
                              <p className="errorcss">
                                {validationnErr.residential}
                              </p>
                            )}
                          </div>
                        </div>

                        <div class="modal-footer lvl-one-body">
                          <button
                            className="modal_continue_btn"
                            onClick={Firstsubmit}
                          >
                            {t("next")}
                          </button>
                          <p className="modal_footer_text mar-top-15">
                            {t("thisinformationisused")}
                            <br /> {t("willbekept")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {levelScndstart && (
                    <div class="modal-dialog modal-dialog-centered modal-md">
                      <div class="modal-content">
                        <div class="modal-header lvl-one-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Level - 2{" "}
                            <span className="mar-lft-2">
                              {t("verification")}
                            </span>
                          </h1>
                          <button
                            type="button"
                            class="btn-close btn-close-custom"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-not-header">
                          <div className="modal-notify-content">
                            {t("pleaseselectadocument")}
                          </div>
                        </div>
                        <div className="modal-body lvl-one-body">
                          {/* <div className="country-content">
                                      <h4>Country/Region of Residence</h4>
                                      <PhoneInput
                                        country={"us"}
                                        value={mobile}
                                        onChange={handlePhoneChange}
                                        inputStyle={{ width: "100%" }}
                                      />
                                    </div> */}
                          <h4 className="select_id_text">{t("selecIDType")}</h4>
                          <div className="seleted_id_type">
                            <div className="passport">
                              <img
                                src={require("../assets/passport_icon.png")}
                                alt=""
                              />
                              <p>{t("passport")}</p>
                            </div>

                            <div class="checkbox-container">
                              <input
                                id="custom-passport"
                                className="input-field regular_checkbox"
                                type="radio"
                                name="id-type"
                                value="Passport" // Set the value to 'Passport'
                                onChange={handleDocumentTypeChange}
                                checked={formValue.verfiType === "Passport"}
                              />
                              <label htmlFor="custom-passport"></label>
                            </div>
                          </div>
                          <div className="seleted_id_type">
                            <div className="passport">
                              <img
                                src={require("../assets/passport_icon.png")}
                                alt=""
                              />
                              <p>{t("aadhaarCard")}</p>
                            </div>
                            {/* <div className="check_circle">
                                        <i class="ri-checkbox-circle-fill"></i>
                                      </div> */}
                            <div class="checkbox-container">
                              <input
                                id="custom-aadhar"
                                className="input-field regular_checkbox"
                                type="radio"
                                name="id-type"
                                value="Aadhaar Card" // Set the value to 'Aadhaar Card'
                                onChange={handleDocumentTypeChange}
                                checked={formValue.verfiType === "Aadhaar Card"}
                              />
                              <label htmlFor="custom-aadhar"></label>
                            </div>
                          </div>
                          <div className="seleted_id_type">
                            <div className="passport">
                              <img
                                src={require("../assets/passport_icon.png")}
                                alt=""
                              />
                              <p>{t("drivingLicense")}</p>
                            </div>
                            {/* <div className="check_circle">
                                        <i class="ri-checkbox-circle-fill"></i>
                                      </div> */}
                            <div class="checkbox-container">
                              <input
                                id="custom-license"
                                className="input-field regular_checkbox"
                                type="radio"
                                name="id-type"
                                value="Driving License" // Set the value to 'Driving License'
                                onChange={handleDocumentTypeChange}
                                checked={
                                  formValue.verfiType === "Driving License"
                                }
                              />
                              <label htmlFor="custom-license"></label>
                            </div>
                          </div>
                          {documentTypeValidateref.current == true ? (
                            <p className="errorcss">
                              {validationnErr.verfiType}
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div class="modal-footer lvl-one-body">
                          <div className="d-flex gap-2">
                            <button
                              className="modal_continue_btn"
                              onClick={secondLvlback}
                            >
                              {t("back")}
                            </button>
                            <button
                              className="modal_continue_btn"
                              onClick={secondFirstsubmit}
                            >
                              {t("next")}
                            </button>
                          </div>
                          <p className="modal_footer_text mar-top-15">
                            {t("thisinformationisused")}
                            <br /> {t("willbekept")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {levelThird && (
                    <div class="modal-dialog modal-dialog-centered modal-md">
                      <div class="modal-content">
                        <div class="modal-header lvl-one-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            {t("level3")}{" "}
                            <span className="mar-lft-2">
                              {t("verification")}
                            </span>
                          </h1>
                          <button
                            type="button"
                            class="btn-close btn-close-custom"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-not-header">
                          <div className="modal-note-content">
                            {t("noteOnly")}
                          </div>
                        </div>

                        <div className="modal-body lvl-one-body">
                          <div className="mar-top-9">
                            <div className="first_name">
                              <h4 className="select_id_text">{t("front")}</h4>
                              <div className="upload-container">
                                {idproofLoad == false ? (
                                  valididproof == 0 ? (
                                    <>
                                      <div className="inner_frst_display">
                                        <i class="fa-solid fa-cloud-arrow-up"></i>
                                        <p>{t("uploadfront")}</p>
                                      </div>
                                    </>
                                  ) : valididproof == 1 ? (
                                    <i class="bi bi-file-earmark-bar-graph"></i>
                                  ) : (
                                    <img
                                      src={idproofref.current}
                                      className="up_im_past"
                                      alt="National Id Front"
                                    />
                                  )
                                ) : (
                                  <div className="inner_frst_display">
                                    <i class="fa-solid fa-spinner fa-spin fa-sm"></i>
                                  </div>
                                )}

                                <input
                                  type="file"
                                  name="image"
                                  className="image_upload_kyc"
                                  onChange={(e) =>
                                    imageUpload(
                                      "DocumentFront",
                                      e.target.files[0]
                                    )
                                  }
                                />

                                {idproofnameref.current == "" ? (
                                  ""
                                ) : (
                                  <div className="mt-2">
                                    <input
                                      className="proofs_name w-100"
                                      disabled
                                      value={idproofnameref.current}
                                    ></input>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mar-top-9">
                            <div className="first_name">
                              <h4 className="select_id_text">{t("back")}</h4>
                              <div className="upload-container">
                                {addressProofLoad == false ? (
                                  validaddressProof == 0 ? (
                                    <>
                                      <div className="inner_frst_display">
                                        <i class="fa-solid fa-cloud-arrow-up"></i>
                                        <p>{t("uploadback")}</p>
                                      </div>
                                    </>
                                  ) : validaddressProof == 1 ? (
                                    <i class="bi bi-file-earmark-bar-graph"></i>
                                  ) : (
                                    <img
                                      src={addressProofref.current}
                                      className="up_im_past"
                                      alt="National Id Front"
                                    />
                                  )
                                ) : (
                                  <div className="inner_frst_display">
                                    <i class="fa-solid fa-spinner fa-spin fa-sm"></i>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  name="image"
                                  className="image_upload_kyc"
                                  onChange={(e) =>
                                    imageUpload(
                                      "DocumentBack",
                                      e.target.files[0]
                                    )
                                  }
                                />
                                {addressproofnameref.current == "" ? (
                                  ""
                                ) : (
                                  <div className="mt-2">
                                    <input
                                      className="proofs_name w-100"
                                      disabled
                                      value={addressproofnameref.current}
                                    ></input>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {uploadErrorref.current == true ? (
                            <p className="errorcss">{t("pleaseuploadyour")} </p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div class="modal-footer lvl-one-body">
                          <div className="d-flex gap-2">
                            <button
                              className="modal_continue_btn"
                              onClick={thirdLvlback}
                            >
                              {t("back")}
                            </button>
                            <button
                              className="modal_continue_btn"
                              onClick={thirdSubmit}
                            >
                              {t("next")}
                            </button>
                          </div>
                          <p className="modal_footer_text mar-top-15">
                            {t("thisinformationisused")}
                            <br /> {t("willbekept")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {levelFourth && (
                    <div class="modal-dialog modal-dialog-centered modal-md">
                      <div class="modal-content">
                        <div class="modal-header lvl-one-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            {t("level4")}{" "}
                            <span className="mar-lft-2">
                              {t("verification")}
                            </span>
                          </h1>
                          <button
                            type="button"
                            class="btn-close btn-close-custom"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-not-header">
                          <div className="modal-notify-content">
                            {t("seuploadacle")}
                          </div>
                        </div>
                        <div className="modal-body lvl-one-body">
                          <div className="mar-top-9">
                            <div className="first_name">
                              <h4 className="select_id_text">
                                {t("takeaSelfie")}
                              </h4>
                              <div className="upload-container">
                                {SelfieProofLoad == false ? (
                                  validSelfieProof == 0 ? (
                                    <>
                                      <div className="inner_frst_display">
                                        <i class="fa-solid fa-cloud-arrow-up"></i>
                                        <p>{t("uploadyourphoto")}</p>
                                      </div>
                                    </>
                                  ) : validSelfieProof == 1 ? (
                                    <i class="bi bi-file-earmark-bar-graph"></i>
                                  ) : (
                                    <img
                                      src={SelfieProofref.current}
                                      className="up_im_past"
                                      alt="National Id Front"
                                    />
                                  )
                                ) : (
                                  <div className="inner_frst_display">
                                    <i class="fa-solid fa-spinner fa-spin fa-sm"></i>
                                  </div>
                                )}

                                <input
                                  type="file"
                                  name="image"
                                  className="image_upload_kyc"
                                  onChange={(e) =>
                                    imageUpload(
                                      "selfiePhoto",
                                      e.target.files[0]
                                    )
                                  }
                                />
                                {Selfieproofnameref.current == "" ? (
                                  ""
                                ) : (
                                  <div className="mt-2">
                                    <input
                                      className="proofs_name w-100"
                                      disabled
                                      value={Selfieproofnameref.current}
                                    ></input>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {selfieErrorref.current == true ? (
                            <p className="errorcss">{t("pleaseuploadour")}</p>
                          ) : (
                            ""
                          )}
                        </div>
                        <div class="modal-footer lvl-one-body">
                          <div className="d-flex gap-2">
                            <button
                              className="modal_continue_btn"
                              onClick={fourthLvlback}
                            >
                              {t("back")}
                            </button>
                            <button
                              className="modal_continue_btn"
                              onClick={formSubmit}
                            >
                              {t("submit")}
                            </button>
                          </div>
                          <p className="modal_footer_text mar-top-15">
                            {t("thisinformationisused")}
                            <br /> {t("willbekept")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* -- Modal 3 Id and face verify--  */}
                {/* <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered modal-md">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        ID verification & Face Verification
                      </h1>
                      <button
                        type="button"
                        class="btn-close btn-close-custom"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <h4 className="select_id_text">
                        Choose an upload method
                      </h4>
                      <div className="seleted_id_type">
                        <div className="passport">
                          <img src={require("../assets/mobile_popup_icon.png")} />
                          <p>Continue on mobile</p>
                        </div>
                        <div className="check_circle">
                          <i class="ri-checkbox-circle-fill"></i>
                        </div>
                      </div>
                      <div className="seleted_id_type">
                        <div className="passport">
                          <img src={require("../assets/take_photo_icon.png")} />
                          <p>Take photo using webcame</p>
                        </div>
                        <div className="check_circle">
                          <i class="ri-checkbox-circle-fill"></i>
                        </div>
                      </div>
                      <div className="seleted_id_type">
                        <div className="passport">
                          <img src={require("../assets/upload_file_icon.png")} />
                          <p>Upload file from this device</p>
                        </div>
                        <div className="check_circle">
                          <i class="ri-checkbox-circle-fill"></i>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button className="modal_continue_btn">Continue</button>
                      <p className="modal_footer_text">
                        Your personal information is encrypted.
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Dashboard;
