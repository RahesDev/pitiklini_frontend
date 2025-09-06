import React, { useEffect } from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Bars } from "react-loader-spinner";
import Switch from "react-switch";
import { t } from "i18next";

const FeeSettings = () => {
  useEffect(() => {
    getProfile();
  }, []);

  const [profileData, setprofileData] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setprofileData(resp.Message);
        if(resp.Message.ptk_fee_status == 1)
        {
            setChecked(true);
        }
        sessionStorage.setItem("tfa_status", resp.data.tfastatus);
        // localStorage.setItem("tfa_status", resp.data.tfastatus);
      }
    } catch (error) {}
  };

  const handleChange = async (nextChecked) => {
    setChecked(nextChecked);
    var data = {
      apiUrl: apiService.fee_settings_change,
      payload: checked,
    };
    var resp = await postMethod(data);
    if (resp.status) {
      // console.log(resp,"---resp---");
      showsuccessToast(resp.Message);
      getProfile();
    }
  };



  const obfuscateEmail = (email) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    const firstFive = localPart.slice(0, 5);
    return `${firstFive}***@${domainPart}`;
  };

  const obfuscateMobileNumber = (mobileNumber) => {
    if (!mobileNumber) return "";
    const firstFive = mobileNumber.slice(0, 5);
    const lastOne = mobileNumber.slice(-1);
    return `${firstFive}****${lastOne}`;
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
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
                <div className="dashboard_content border_none">
                  <div className="two_fa_heading">{t("feeSettings")}</div>
                  <div className="security_email_content">
                    <div className="security_email_item">
                      <img
                        src={require("../assets/icons/spot-trade.webp")}
                      />

                      <div className="">
                        <div className="d-flex gap-3 align-items-center">
                          <h3>{t("ptkfeeSettings")}</h3>
                          <div className="mb-2">
                              <Switch
                                checked={checked}
                                onChange={handleChange}
                                onColor="#ffc630" // Color inside the switch when on
                                offColor="#fa5d72" // Color inside the switch when off
                                handleDiameter={14} // Diameter of the switch handle (button)
                                height={19} // Height of the switch
                                width={33} // Width of the switch
                                uncheckedIcon={false} // No icon when off
                                checkedIcon={false} // No icon when on
                                handleStyle={{
                                  boxShadow: "none", // This removes the glow or shadow around the handle
                                  backgroundColor: "white", // Ensure the handle is white
                                }}
                              />
                          </div>
                        </div>
                        <p>{t("ptkFeeEnable")}</p>
                      </div>
                    </div>
                    <div className="secneww_diiv">
                      {profileData.ptk_fee_status == 0 || checked == false ? (
                        <div className="">
                          <p>
                            {" "}
                            <span className="text-lightGrey nowra_txt">
                              <i class="ri-close-circle-fill"></i>{" "}
                              {t("disabled")}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p>
                            {" "}
                            <span className="text-lightGrey nowra_txt">
                              {" "}
                              <i
                                class="ri-checkbox-circle-fill"
                                style={{ color: "#22b477" }}
                              ></i>{" "}
                              {t("enabled")}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="two_fa_heading">Account Management</div>
                <div className="security_email_content">
                  <div className="security_email_item">
                    <img src={require("../assets/delete_icon.png")} />

                    <div className="">
                      <h3>Delete Account</h3>
                      <p>
                        Note: All the related data will be deleted and cannot be
                        recovered after the deletion.
                      </p>
                    </div>
                  </div>

                  <div className="delete_button">
                    <button>Delete</button>
                  </div>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default FeeSettings;
