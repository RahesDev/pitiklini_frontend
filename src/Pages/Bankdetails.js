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
import DashboardLayout from "./DashboardLayout";
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
          //  usePageLeaveConfirm(
          //    "Are you sure you want to leave P2P?",
          //    "/Paymentmethod",
          //    true,
          //    [
          //      "/p2p/order/:id",
          //      "/processorders",
          //      "/p2p/chat/:id",
          //      "/myorders",
          //      "/p2p/dispute/:id",
          //      "/p2p",
          //      "/postad",
          //    ]
          //  );

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
     <DashboardLayout>
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
       <section className="asset_section">
            <div className="buy_head">
              <div className="w-full">
                <div className="bg-black rounded-xl p-4">
              {!formVisible ? (
                
                 
                  <>

                    

                     

         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
  
  {/* LEFT CONTENT */}
  <div>
    <h1 className="text-2xl md:text-3xl font-semibold text-primary">
      P2P Platform
    </h1>

    <h2 className="text-lg md:text-xl font-medium text-white mt-2">
      Payment Methods
    </h2>

    <p className="text-sm text-primary mt-1">
      {t("paymentmethodonPitiklini")}
    </p>
  </div>

  {/* RIGHT BUTTON */}
  <div className="mt-4 md:mt-0">
    <div className="bg-primary hover:primary/10 transition px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md">
      
      <i className="fa-solid fa-plus text-white"></i>

      <Dropdown
        inline
        placeholder={t("addPaymentMethod")}
        options={paymentMethods}
        defaultValue={selectedMethod}
        onChange={handleMethodChange}
        className="!text-black font-medium"
      />
    </div>
  </div>

</div>

                      <div className="col-lg-12 ">
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
                            <div className="flex justify-center items-center">
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
                    
                 </>
               
              ) : (
                <>
                 
                    <section className="asset_section">
                    
                        <div className=" top-[24px] left-[16px] w-[78px] h-[38px] border border-primary rounded-[8px] flex items-center justify-center gap-[4px] px-[16px] py-[12px] box-border text-[#B1B5C3] hover:text-white transition z-30">
                          <Link onClick={Sentback}>
                           <span className="text-lg text-secondary mr-1">
                  <i className="ri-arrow-left-s-line"></i>
                </span>
                <span className="text-md font-ibm text-secondary">{t("back")}</span>
                          </Link>

                        
            
               
           
           
                        </div>

                       <div className="flex justify-center mt-6">
  <div className="w-full bg-black rounded-2xl p-6 shadow-2xl border border-gray">

    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-primary font-semibold text-2xl flex items-center gap-2">
       
        Add Bank Transfer
      </h2>
      <button onClick={Sentback} className="text-gray-400 hover:text-white">
        ✕
      </button>
    </div>

    <form className="space-y-6">

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Account Name */}
        <div>
          <label className="text-md text-white mb-1 block">
            ACCOUNT NAME
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white "
            placeholder="Enter account name"
          /> 
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label className="text-md text-white mb-1 block">
            BANK NAME
          </label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName || ""}
            onChange={handleInputChange}
            className="w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white"
            placeholder="Enter a Bank name"
          />
          {errors.bankName && (
            <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Account Number */}
        <div>
          <label className=" text-md text-white mb-1 block">
            ACCOUNT NUMBER
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 30) handleInputChange(e);
            }}
            className={`w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white 
              ${errors.accountNumber ? "border-red-500" : "border-gray "}`}
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-xs mt-1">
              {errors.accountNumber}
            </p>
          )}
        </div>

        {/* IFSC (optional UI only) */}
        <div>
          <label className="text-md text-white mb-1 block">
            SWIFT / IFSC CODE
          </label>
          <input
            type="text"
            className="w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white"
            placeholder="Enter routing code"
          />
        </div>
     

      {/* Currency */}
     <div >
  <label className="text-md text-white mb-2 block">
    CURRENCY
  </label>

  <div className="w-full [&_.ui.dropdown]:w-full">
  <Dropdown
  fluid
  selection
  options={fiatCurrencies}
  value={selectedfiat}
  onChange={handlecurrencyChange}
  className="!w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white"
/>
  </div>

  {errors.Currency && (
    <p className="text-red-500 text-xs mt-1">{errors.Currency}</p>
  )}
</div>
<div></div> </div>

      {/* Instructions */}
      <div>
        <label className="text-md text-white mb-1 block">
          INSTRUCTIONS (OPTIONAL)
        </label>
        <textarea
          className="w-full bg-[#181a20] border border-gray shadow-lg rounded-lg px-4 py-4 text-white"
          placeholder="Add specific payment notes for the counterparty..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <button
          type="button"
          onClick={Sentback}
          className="bg-primary text-black font-medium px-6 py-2 rounded-lg"
        >
          Cancel
        </button>

        {Editstatus == false ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-primary text-black font-medium px-6 py-2 rounded-lg"
          >
            {buttonLoader ? "Loading..." : "Save Method"}
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleEdit}
            className="bg-primary text-black font-medium px-6 py-2 rounded-lg"
          >
            {buttonLoaderEdit ? "Loading..." : "Update Method"}
          </button>
        )}
      </div>

    </form>
  </div>
</div>
                  
                    </section>
               
                </>
              )}
            </div>
          </div>
          </div>
          </section>
               )}
             </DashboardLayout>
           </>
  );
};

export default P2P;
