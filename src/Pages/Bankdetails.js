import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import Header from "./Header";
import { toast } from "react-toastify";
import { Dropdown } from "semantic-ui-react";
import { Bars } from "react-loader-spinner";
import Side_bar from "./Side_bar";
import { env } from "../core/service/envconfig";
import "semantic-ui-css/semantic.min.css";
import AdvertiserTable from "./AdvertiserTable";
import apiService from "../core/service/detail";
import { postMethod, getMethod } from "../core/service/common.api";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";

const P2P = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [imageload, setimageload] = useState(false);

  const [Bankdetails, setBankdetails, Bankdetailsref] = useState({});
  const [Editdata, setEditdata, Editdataref] = useState({});
  const [Editstatus, setEditstatus, Editstatusref] = useState(false);
  const [siteLoader, setSiteLoader] = useState(false);
  const [buttonLoader, setbuttonLoader] = useState(false);
  const [buttonLoaderEdit, setbuttonLoaderEdit] = useState(false);
  const { t } = useTranslation();
           usePageLeaveConfirm(
             "Are you sure you want to leave P2P?",
             "/Paymentmethod",
             true,
             [
               "/p2p/order/:id",
               "/processorders",
               "/p2p/chat/:id",
               "/myorders",
               "/p2p/dispute/:id",
               "/p2p",
               "/postad",
             ]
           );

  const [formData, setFormData, formDataref] = useState({
    name: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifsc: "",
    accountType: "",
    upid: "",
    QRcode: null,
    Paymentmethod_name: "",
    Currency: "",
  });
  const [errors, setErrors] = useState({});

  const [paymentMethod, setpaymentMethod] = useState([]);
  const [fiatCurrencies, setFiatCurrencies] = useState([]);
  const [selectedpaymentMethod, setselectedpaymentMethod] = useState("");
  const [selectedfiat, setselectedfiat] = useState("");
  const [paymentMethods, setpaymentMethods] = useState([]);

  // const paymentMethods = [
  //   {
  //     key: "bankTransfer",
  //     text: (
  //       <div className="d-flex align-items-center fw-200">
  //         <div className="pay-bor bg-bank"></div>
  //         Bank Transfer
  //       </div>
  //     ),
  //     value: "BankTransfer",
  //   },
  // ];

  useEffect(() => {
    Getbankdetails();
    getAllCurrency();
    getallPaymentMethods();
  }, [0]);

  const getAllCurrency = async () => {
    setSiteLoader(true);

    try {
      const data = { apiUrl: apiService.getP2Pcurrency };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data) {

        const fiatArray = resp.data
          .filter((currency) => currency.coinType === "2")
          .map((currency) => ({
            key: currency._id,
            text: currency.currencySymbol,
            value: currency.currencySymbol,
            image: {
              avatar: true,
              src: currency.Currency_image,
            },
          }));
        setFiatCurrencies(fiatArray);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const getallPaymentMethods = async () => {
    setSiteLoader(true);

    try {
      const data = { apiUrl: apiService.get_p2p_payments };
      const resp = await getMethod(data);
      setSiteLoader(false);
      if (resp && resp.data) {
        if(resp.data.length > 0)
        {
          let response = [];
          for(let i=0;i<resp.data.length;i++)
          {
            let obj = { 
            key: resp.data[i]._id,
            text: resp.data[i].payment_name,
            value: resp.data[i].payment_name,
            }
            response.push(obj);
        }
        setpaymentMethod(response);
        setpaymentMethods(response);
      }
     }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const Getbankdetails = async (e) => {
    try {
      setSiteLoader(true);
      var data = {
        apiUrl: apiService.Getbankdetails,
      };

      var resp = await getMethod(data);
      console.log(resp.data, "fiat price -=-=-resp=-=-");
      setSiteLoader(false);

      if (resp.status) {
        setBankdetails(resp.data);
      } else {
        setBankdetails({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMethodChange = (e, { value }) => {
    setSelectedMethod(value);
    setFormVisible(true);
    setErrors({}); // Reset errors when method changes
    setFormData({});
  };

  const sanitizeInput = (value) => {
    return value.trim();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    // const sanitizedValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
    setFormData({ ...formData, [e.target.name]: value });
    validateForm(formDataref.current);
  };

  const handleFileChange = (e) => {
    try {
      setimageload(true);
      const fileExtension = e.name.split(".").at(-1);
      const fileSize = e.size;
      const fileName = e.name;
      if (
        fileExtension != "png" &&
        fileExtension != "webp" &&
        fileExtension != "jpeg"
      ) {
        toast.error(
          "File does not support. You must use .png or .jpg or .jpeg "
        );
      } else if (fileSize > 10000000) {
        toast.error("Please upload a file smaller than 1 MB");
      } else {
        const data = new FormData();
        data.append("file", e);
        data.append("upload_preset", env.upload_preset);
        data.append("cloud_name", env.cloud_name);
        fetch(
          "https://api.cloudinary.com/v1_1/" + env.cloud_name + "/auto/upload",
          { method: "post", body: data }
        )
          .then((resp) => resp.json())
          .then((data) => {
            setFormData({ ...formData, ["QRcode"]: data.secure_url });

            validateForm(formDataref.current);
            setimageload(false);
          })
          .catch((err) => {
            console.log(err);
            setimageload(false);
            toast.error("Please try again later");
          });
      }
    } catch (error) {
      setimageload(false);
      toast.error("Please try again later");
    }
  };

  // const validateForm = (formData) => {
  //   const newErrors = {};

  //   if (!formData.name) {
  //     newErrors.name = t("accountname_required");
  //   } else if (selectedMethod === "IMPS" || selectedMethod === "BankTransfer") {
  //     if (!formData.accountNumber) {
  //       newErrors.accountNumber = t("accnumIsReq");
  //     } 
  //     // else if (!formData.ifsc) {
  //     //   newErrors.ifsc = t("ifscIsReq");
  //     // } 
  //     else if (!formData.bankName) {
  //       newErrors.bankName = t("bankNameIsReq");
  //     } 
  //     // else if (!formData.accountType) {
  //     //   newErrors.accountType = t("accTypeIsRequired");
  //     // } 
  //     // else if (!formData.branch) {
  //     //   newErrors.branch = t("branchIsReq");
  //     // }
  //     else if (!formData.Paymentmethod_name) {
  //       newErrors.Paymentmethod_name = t("Paymentmethod_required");
  //     } 
  //     else if (!formData.Currency) {
  //       newErrors.Currency = t("Currency_required");
  //     }
  //   } else if (selectedMethod === "UPID") {
  //     if (!formData.upid) {
  //       newErrors.upid = t("upiIdisReq");
  //     } else if (formData.upid.length < 3 || formData.upid.length > 50) {
  //       newErrors.upid = t("upiIdMust3char");
  //     } else if (!formData.QRcode) {
  //       newErrors.upidQR = t("qrIsReq");
  //     }
  //   } else if (selectedMethod === "Paytm") {
  //     if (!formData.upid) {
  //       newErrors.upid = t("paytmNoIsReq");
  //     } else if (formData.upid.length < 8 || formData.upid.length > 15) {
  //       newErrors.upid = t("paytmNobt815char");
  //     } else if (!formData.QRcode) {
  //       newErrors.paytmQR = t("qrIsReq");
  //     }
  //   }
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = t("accountname_required");
    }
    else if (!formData.accountNumber) {
      newErrors.accountNumber = t("accnumIsReq");
    }
      else if (!formData.bankName) {
        newErrors.bankName = t("bankNameIsReq");
      }
      else if (!formData.Currency) {
        newErrors.Currency = t("Currency_required");
      }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formDataref.current)) {
      formData.type = selectedMethod;
      // Submit the form
      console.log("Form submitted successfully:", formData);

      var data = {
        apiUrl: apiService.addbankdetails,
        payload: formDataref.current,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      console.log(resp.data, "fiat price -=-=-resp=-=-");
      if (resp.status) {
        toast.success(resp.Message);
        Sentback();
      } else {
        toast.error(resp.Message);
        Sentback();
      }

      Getbankdetails();
    } else {
      const error = await validateForm(formData);
      console.log("Form validation failed", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (validateForm(formDataref.current)) {
      formData.type = selectedMethod;

      console.log("Form submitted successfully:", formData);

      var data = {
        apiUrl: apiService.updateBankdetails,
        payload: formDataref.current,
      };
      setbuttonLoaderEdit(true);
      var resp = await postMethod(data);
      console.log(resp.data, "fiat price -=-=-resp=-=-");
      setbuttonLoaderEdit(false);
      if (resp.status) {
        toast.success(resp.Message);

        Sentback();
      } else {
        toast.error(resp.Message);
        Sentback();
      }
      setEditstatus(false);
      setFormVisible(false);
      setSelectedMethod("");
      setFormData({});
      Getbankdetails();
    } else {
      const error = await validateForm(formData);
      console.log("Form validation failed", error);
    }
  };

  const Sentback = () => {
    setSelectedMethod("");
    setFormVisible(false);
    setFormData({});
    setErrors({});
  };

  const Editpayment = (data) => {
    setSelectedMethod(data.type);
    setFormData({
      name: data.Accout_HolderName,
      accountNumber: data.Account_Number,
      bankName: data.Bank_Name,
      // branch: data.Branch_Name,
      // ifsc: data.IFSC_code,
      // accountType: data.Account_Type,
      // upid: data.Upid_ID,
      // QRcode: data.QRcode,
      _id: data._id,
      Paymentmethod_name: data.Paymentmethod_name,
      Currency: data.Currency
    });
    setselectedpaymentMethod(data.Paymentmethod_name);
    setselectedfiat(data.Currency);

    console.log(selectedMethod, "iiknknkn");
    setEditstatus(true);
    setFormVisible(true);
  };

  const deletePayment = async (data) => {
    setSiteLoader(true);

    var data = {
      apiUrl: apiService.deletbankDetails,
      payload: { _id: data },
    };

    var resp = await postMethod(data);
    console.log(resp.data, "fiat price -=-=-resp=-=-");
    setSiteLoader(false);

    if (resp.status) {
      toast.success(resp.message);
      Getbankdetails();
    } else {
      Getbankdetails();
      toast.error(resp.message);
    }
  };

  const handlepaymentChange = (e, { value }) => {
    setselectedpaymentMethod(value);
    formDataref.current.Paymentmethod_name = value;
  };

  const handlecurrencyChange = (e, { value }) => {
    setselectedfiat(value);
    formDataref.current.Currency = value;
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
            color="#ffc630"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <main className="dashboard_main">
          <div className="container">
            <div className="row">
              {!formVisible ? (
                <div className="col-lg-12">
                  <section className="asset_section">
                    <div className="row">
                      {/* head */}
                      <div className="p2p-pay-wrap p2p-order-head">
                        <Link to="/p2p">
                          <div className="p2p-order-title text-p2p">
                            {t("p2p")}
                          </div>
                        </Link>
                        <div className="p2p-side-arrow">
                          <i className="ri-arrow-right-s-line"></i>
                        </div>
                        <div className="p2p-order-title text-order">
                          {t("payments")}
                        </div>
                      </div>

                      {/* <div className="p2p_title align-items-center">
                        Payment
                      </div> */}

                      <div className="p2p_method_content">
                        <p>{t("paymentmethodonPitiklini")}</p>

                        <div className="pay-coin">
                          <span className="icon-container">
                            <i className="fa-solid fa-plus"></i>
                          </span>
                          <Dropdown
                            inline
                            placeholder={t("addPaymentMethod")}
                            options={paymentMethods}
                            defaultValue={selectedMethod}
                            onChange={handleMethodChange}
                            className="pay-coin payment"
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="mt-5">
                          {Array.isArray(Bankdetails) &&
                          Bankdetails.length > 0 ? (
                            Bankdetails.map((options, index) => (
                              <div className="payments mt-5" key={index}>
                                <div className="payment-head">
                                  <div className="d-flex align-items-center">
                                    {" "}
                                    {options.type === "IMPS" && (
                                      <div className="pay-bor bg-imps"></div>
                                    )}
                                    {options.type === "UPID" && (
                                      <div className="pay-bor bg-upi"></div>
                                    )}
                                    {options.type === "Paytm" && (
                                      <div className="pay-bor bg-paytm"></div>
                                    )}
                                    {options.type === "BankTransfer" && (
                                      <div className="pay-bor bg-bank"></div>
                                    )}
                                    {options.type}
                                  </div>
                                  <div>
                                    <span
                                      onClick={() => Editpayment(options)}
                                      className="cursor-pointer"
                                    >
                                      {t("edit")}
                                    </span>
                                    <span
                                      onClick={() => deletePayment(options._id)}
                                      className="cursor-pointer"
                                    >
                                      {t("delete")}
                                    </span>
                                  </div>
                                </div>

                                <div className="payment-table row">
                                  <div className="col-lg-4">
                                    <div className="label">{t("fullName")}</div>
                                    <div className="content">
                                      {options.Accout_HolderName || "N/A"}
                                    </div>
                                  </div>

                                  {options.type == "UPID" ||
                                  options.type == "Paytm" ? (
                                    <>
                                      <div className="col-lg-4">
                                        <div className="label">
                                          {t("accountNo")}
                                        </div>
                                        <div className="content">
                                          {options.Upid_ID || "N/A"}
                                        </div>
                                      </div>

                                      <div className="col-lg-4">
                                        <div className="label">
                                          {t("QRCODE")}
                                        </div>
                                        <div className="content">
                                          <img
                                            src={options.QRcode}
                                            alt="QR Code"
                                            width="100px"
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    ""
                                  )}

                                  {/* {options.type == "IMPS" ||
                                  options.type == "BankTransfer" ? ( */}
                                    <>
                                      <div className="col-lg-4">
                                        <div className="label">
                                          {t("bankAccountDetails")}
                                        </div>
                                        <div className="content">
                                          {options.Account_Number || "N/A"}
                                        </div>
                                      </div>

                                      {/* <div className="col-lg-4">
                                        <div className="label">
                                          {t("ifscCode")}
                                        </div>
                                        <div className="content">
                                          {options.IFSC_code || "N/A"}
                                        </div>
                                      </div> */}

                                      <div className="col-lg-4">
                                        <div className="label">
                                          {t("account_name")}
                                        </div>
                                        <div className="content">
                                          {options.Accout_HolderName || "N/A"}
                                        </div>
                                      </div>
                                    </>
                                  {/* // ) : (
                                  //   ""
                                  // )} */}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="not-pay-wrapper">
                              {/* No bank details available. */}
                              <img
                                src={require("../assets/not-add-pay.png")}
                                alt="not-pay"
                                className="not-pay"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : (
                <>
                  <div className="col-lg-12">
                    <section className="asset_section">
                      <div className="row mt-5 justify-content-center">
                        <div>
                          <Link onClick={Sentback}>
                            <h6 className="payment-back">
                              {" "}
                              <i class="fa-solid fa-arrow-left-long mr-4"></i>{" "}
                              <span>{t("back")}</span>
                            </h6>
                          </Link>
                        </div>

                        <div className="row justify-content-center pay-cards mt-4">
                          <div className="col-lg-7 ">
                            <form className="p2p-payment-form">
                              <div className="p2p_payment">
                                {/* border-left colors */}
                                {selectedMethod === "IMPS" && (
                                  <div className="pay-bor bg-imps"></div>
                                )}
                                {selectedMethod === "UPID" && (
                                  <div className="pay-bor bg-upi"></div>
                                )}
                                {selectedMethod === "Paytm" && (
                                  <div className="pay-bor bg-paytm"></div>
                                )}
                                {selectedMethod === "BankTransfer" && (
                                  <div className="pay-bor bg-bank"></div>
                                )}

                                {/* select method */}
                                {selectedMethod}
                              </div>

                              <div className="pay-tips">
                                <span>
                                  <img
                                    src={require("../assets/deposit-imp.png")}
                                    alt="tips-icon"
                                    className="pay-tips-icon"
                                  />
                                </span>

                                <div>
                                  <span className="text-yellow">
                                    {t("tips")}
                                  </span>

                                  {selectedMethod === "IMPS" && (
                                    <span className="pay-tips-content">
                                      {t("enteraccountdetails")}
                                    </span>
                                  )}
                                  {selectedMethod === "UPID" && (
                                    <span className="pay-tips-content">
                                      {t("enterUPIID")}
                                    </span>
                                  )}
                                  {selectedMethod === "Paytm" && (
                                    <span className="pay-tips-content">
                                      {t("enterPaytm")}
                                    </span>
                                  )}
                                  {selectedMethod === "BankTransfer" && (
                                    <span className="pay-tips-content">
                                      {t("enterbankaccount")}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* <div className="input-groups">
                                <h6 className="input-label text-white">
                                  {t("name")}
                                </h6>
                                <input
                                  type="text"
                                  name="name"
                                  className="payment-input"
                                  placeholder={t("pleaseEnterYourName")}
                                  maxLength="30"
                                  value={formData.name || ""}
                                  onChange={handleInputChange}
                                />
                                {errors.name && (
                                  <span className="errorcss">
                                    {errors.name}
                                  </span>
                                )}
                              </div> */}

                              {/* {selectedMethod === "IMPS" ||
                              selectedMethod === "BankTransfer" ? ( */}
                                <>
                                    

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("bankAccountDetails")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="accountNumber"
                                      onChange={(e) => {
                                        // Allow only numbers and limit the length to 10 digits
                                        const value = e.target.value;
                                        if (
                                          value.length <= 30 
                                          // && /^[0-9]*$/.test(value)
                                        ) {
                                          handleInputChange(e);
                                        }
                                      }}
                                      onKeyDown={(evt) =>
                                        ["e", "E", "+", "-"].includes(
                                          evt.key
                                        ) && evt.preventDefault()
                                      }
                                      className="payment-input"
                                      placeholder={t("pleaseEnterAccount")}
                                      value={formData.accountNumber || ""}
                                      // onChange={handleInputChange}
                                    />
                                    {errors.accountNumber && (
                                      <span className="errorcss">
                                        {errors.accountNumber}
                                      </span>
                                    )}
                                  </div>

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("account_name")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="name"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterHolderName")}
                                      maxLength="30"
                                      value={formData.name || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.name && (
                                      <span className="errorcss">
                                        {errors.name}
                                      </span>
                                    )}
                                  </div>

                                  {/* ifsc */}
                                  {/* <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("ifscCode")}
                                    </h6>
                                    <input
                                      type="text"
                                      maxLength="30"
                                      name="ifsc"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterIfscCode")}
                                      value={formData.ifsc || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.ifsc && (
                                      <span className="errorcss">
                                        {errors.ifsc}
                                      </span>
                                    )}
                                  </div> */}

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("bankName")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="bankName"
                                      maxLength="30"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterBankName")}
                                      value={formData.bankName || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.bankName && (
                                      <span className="errorcss">
                                        {errors.bankName}
                                      </span>
                                    )}
                                  </div>

                                  {/* <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("Paymentmethod_name")}
                                    </h6> */}
                                    {/* <input
                                      type="text"
                                      name="Paymentmethod_name"
                                      maxLength="30"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterPaymentMethod")}
                                      value={formData.Paymentmethod_name || ""}
                                      onChange={handleInputChange}
                                    /> */}
                                     {/* <Dropdown
                                      inline
                                      placeholder="Select Payment Method"
                                      options={paymentMethod}
                                      defaultValue={selectedpaymentMethod}
                                      onChange={handlepaymentChange}
                                      className="pay-coin payment"
                                    />
                                    {errors.Paymentmethod_name && (
                                      <span className="errorcss">
                                        {errors.Paymentmethod_name}
                                      </span>
                                    )}
                                  </div> */}

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("Currency")}
                                    </h6>
                                    {/* <input
                                      type="text"
                                      name="Currency"
                                      maxLength="30"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterCurrency")}
                                      value={formData.Currency || ""}
                                      onChange={handleInputChange}
                                    /> */}
                                    <Dropdown
                                      inline
                                      placeholder="Select Currency"
                                      options={fiatCurrencies}
                                      value={selectedfiat}
                                      onChange={handlecurrencyChange}
                                      className="pay-coin payment"
                                    />
                                    {errors.Currency && (
                                      <span className="errorcss">
                                        {errors.Currency}
                                      </span>
                                    )}
                                  </div>

                                  {/* <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("accountType")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="accountType"
                                      maxLength={50}
                                      className="payment-input"
                                      placeholder={t("specifyAccountType")}
                                      value={formData.accountType || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.accountType && (
                                      <span className="errorcss">
                                        {errors.accountType}
                                      </span>
                                    )}
                                  </div>

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("accountBranch")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="branch"
                                      maxLength="30"
                                      className="payment-input"
                                      placeholder={t("pleaseEnterAccBranch")}
                                      value={formData.branch || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.branch && (
                                      <span className="errorcss">
                                        {errors.branch}
                                      </span>
                                    )}
                                  </div> */}
                                </>
                              {/* // ) : null} */}

                              {/* {selectedMethod === "UPID" && (
                                <>
                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("UPIID")}
                                    </h6>
                                    <input
                                      type="text"
                                      name="upid"
                                      maxLength={50}
                                      className="payment-input"
                                      placeholder={t("pleaseEnterUPIid")}
                                      value={formData.upid || ""}
                                      onChange={handleInputChange}
                                    />
                                    {errors.upid && (
                                      <span className="errorcss">
                                        {errors.upid}
                                      </span>
                                    )}
                                  </div>

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("paymentQRCode")}
                                    </h6>

                                    <div className="file-input-wrapper">
                                      <input
                                        id="file-input"
                                        type="file"
                                        name="upidQR"
                                        className="payment-input-QR bg-transparent cursor-pointer"
                                        onChange={(e) =>
                                          handleFileChange(e.target.files[0])
                                        }
                                      />
                                      <label
                                        htmlFor="file-input"
                                        className="file-input-label"
                                      >
                                        {imageload ? (
                                          <i class="fa-solid fa-spinner fa-spin"></i>
                                        ) : (
                                          <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                        )}
                                      </label>
                                    </div>

                                    {errors.upidQR && (
                                      <span className="errorcss">
                                        {errors.upidQR}
                                      </span>
                                    )}

                                    {formData.QRcode ? (
                                      <img
                                        src={formData.QRcode}
                                        width="100px"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </>
                              )}

                              {selectedMethod === "Paytm" && (
                                <>
                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {" "}
                                      {t("paytmNo")}
                                    </h6>
                                    <input
                                      type="number"
                                      name="upid"
                                      className="payment-input"
                                      placeholder={t("enterPaytmNum")}
                                      onKeyDown={(evt) =>
                                        ["e", "E", "+", "-"].includes(
                                          evt.key
                                        ) && evt.preventDefault()
                                      }
                                      value={formData.upid || ""}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow only up to 15 digits for Paytm No
                                        if (value.length <= 15) {
                                          setFormData({
                                            ...formData,
                                            upid: value,
                                          });
                                          validateForm(formDataref.current); // Call the validation after setting form data
                                        }
                                      }}
                                      // onChange={handleInputChange}
                                    />
                                    {errors.upid && (
                                      <span className="errorcss">
                                        {errors.upid}
                                      </span>
                                    )}
                                  </div>

                                  <div className="input-groups">
                                    <h6 className="input-label text-white">
                                      {t("paytmQRImage")}
                                    </h6>
                                    <div className="file-input-wrapper">
                                      <input
                                        id="file-input-paytm"
                                        type="file"
                                        name="paytmQR"
                                        className="payment-input-QR bg-transparent cursor-pointer"
                                        onChange={(e) =>
                                          handleFileChange(e.target.files[0])
                                        }
                                      />
                                      <label
                                        htmlFor="file-input-paytm"
                                        className="file-input-label"
                                      >
                                        <i class="fa-solid fa-arrow-up-from-bracket"></i>
                                      </label>
                                    </div>

                                    {errors.paytmQR && (
                                      <span className="errorcss">
                                        {errors.paytmQR}
                                      </span>
                                    )}

                                    {formData.QRcode ? (
                                      <img
                                        src={formData.QRcode}
                                        width="100px"
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </>
                              )} */}

                              <div className="ad-upload">
                                <div className="Submit mt-4">
                                  {Editstatus == false ? (
                                    <>
                                      {buttonLoader == false ? (
                                        <button
                                          type="submit"
                                          onClick={handleSubmit}
                                        >
                                          {t("addPaymentMethod")}
                                        </button>
                                      ) : (
                                        <button type="submit">
                                          {t("loading")}...
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {buttonLoaderEdit == false ? (
                                        <button
                                          type="submit"
                                          onClick={handleEdit}
                                        >
                                          {t("editPaymentMethod")}
                                        </button>
                                      ) : (
                                        <button type="submit">
                                          {t("loading")} ...
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default P2P;
