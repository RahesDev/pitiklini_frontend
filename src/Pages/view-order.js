import Header from "./Header";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import useState from "react-usestateref";
import apiService from "../core/service/detail";
import { getMethod, postMethod } from "../core/service/common.api";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Payment = () => {
  const { t } = useTranslation();

  const [selectedCurrency, setSelectedCurrency, selectedCurrencyref] = useState(
    {}
  );
  const [orderType, setorderType, orderTyperef] = useState("");
  const [profileDatas, setprofileData, profileDatasref] = useState("");
  const [UserID, setUserID, UserIDref] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const url = window.location.href;
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/");
    const orderId = pathSegments[pathSegments.length - 1];
    // const token = localStorage.getItem("PTKToken");
    const token = sessionStorage.getItem("PTKToken");
    const PTK = token.split("_")[1];
    setUserID(PTK);
    getAllp2pOrders(orderId);
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status) {
        setprofileData(resp.data);
      }
    } catch (error) {}
  };

  const getAllp2pOrders = async (arg) => {
    try {
      const data = {
        apiUrl: apiService.p2p_get_order,
        payload: {
          orderId: arg,
        },
      };
      const resp = await postMethod(data);
      if (resp.status) {
        setSelectedCurrency(resp.Message);
        if (resp.Message.ordertype == "Buy") {
          setorderType("Sell");
        } else {
          setorderType("Buy");
        }
      }
    } catch (error) {
    }
  };

  const buyer_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: "cancelled",
      };
      var data = {
        apiUrl: apiService.buyer_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        navigate("/p2p");
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  const seller_cancel = async (status) => {
    try {
      var obj = {
        orderId: window.location.href.split("/").pop(),
        status: "cancelled",
      };
      var data = {
        apiUrl: apiService.seller_cancel,
        payload: obj,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        toast.success(resp.Message);
        navigate("/p2p");
      } else {
        toast.error(resp.Message);
      }
    } catch (error) {}
  };

  return (
    <>
      <section className="Non_fixed_nav">
        <Header />
      </section>{" "}
      <div>
        <div className="Verification">
          <div className="container">
            <div>
              <h6>
                {" "}
                <Link className="text-white" to="/p2p">
                  <i class="fa-solid fa-arrow-left-long mr-3"></i> {t('back')}
                </Link>
              </h6>
              <div className="row justify-content-center view-p2p">
                <div className="col-lg-6">
                  <div className="secion1">
                    <h4>
                      {selectedCurrency.ordertype}{" "}
                      {selectedCurrency.currency_symbol}
                    </h4>

                    <div className="pricetag">
                      <span>{t('price')}</span>
                      <h6>{selectedCurrency.price}</h6>
                    </div>

                    <div className="pricetag">
                      <span>{t('amount')}</span>
                      <h6>{selectedCurrency.quantity}</h6>
                    </div>
                  </div>

                  {orderTyperef.current == "Sell" &&
                  UserIDref.current == selectedCurrencyref.current.user_id &&
                  selectedCurrencyref.current.status != "filled" &&
                  selectedCurrencyref.current.status != "cancelled" ? (
                    <button
                      type="button"
                      className="proceed-btn txt-center d-block w-100"
                      onClick={seller_cancel}
                    >
                      {t('cancel')}
                    </button>
                  ) : (
                    ""
                  )}

                  {orderTyperef.current == "Buy" &&
                  UserIDref.current == selectedCurrencyref.current.user_id &&
                  selectedCurrencyref.current.status != "filled" &&
                  selectedCurrencyref.current.status != "cancelled" ? (
                    <button
                      type="button"
                      className="proceed-btn txt-center d-block w-100"
                      onClick={buyer_cancel}
                    >
                      {t('cancel')}
                    </button>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-lg-6">
                  <div className="user-view-right">
                    <div className="header-section">
                      {/* <img src={require(`../assets/j.png`)} width="40px" /> */}
                      <div className="p2p_namefrst_change align-items-center">
                        {/* <span>{selectedCurrency.displayname.charAt(0)}</span> */}
                        <span>{selectedCurrency?.displayname ? selectedCurrency.displayname[0] : ""}</span>
                      </div>
                      <div className="d-flex flex-column align-items-start gap-2">
                        <span className="name">
                          {selectedCurrency.displayname}
                        </span>
                        <span className="volume">
                          {selectedCurrency.orders_count} {t("Volume")} |{" "}
                          {selectedCurrency.rating} % {t('transactionrate')}
                        </span>
                      </div>
                    </div>

                    <div class="view-right-content">
                      <div class="Frame-14876">
                        <span className="price">{t('price')}</span>
                        <span className="inr">{selectedCurrency.price}</span>
                      </div>
                      <div class="Frame-14876">
                        <span className="price">{t('amount')}</span>
                        <span className="inr">
                          {" "}
                          {selectedCurrency.quantity}
                        </span>
                      </div>
                      <div class="Frame-14876">
                        <span className="price">{t("limit")}</span>
                        <span className="inr">
                          {" "}
                          {`${selectedCurrency.fromLimit} ${selectedCurrency.firstCurrency} - ${selectedCurrency.toLimit} ${selectedCurrency.firstCurrency}`}
                        </span>
                      </div>
                      <div class="Frame-14876">
                        <span className="price">{t("PaymentMethods")} </span>
                        <span className="inr">
                          {selectedCurrency &&
                            selectedCurrency?.payment_method?.map(
                              (method, index) => <span>{method}</span>
                            )}
                        </span>
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
  );
};

export default Payment;
