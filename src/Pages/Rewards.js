import React, { useEffect } from "react";
import Header from "./Header";
import { stakeOpt } from "../utils/mockData3";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import moment from "moment";
import { env } from "../core/service/envconfig";
import { useTranslation } from "react-i18next";


const Staking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [refferHistoty, setRefferHistoty] = useState("");


  const [Rewardpage, setRewardpage, Rewardpageref] = useState("");
  const [airStatus, setAirStatus, airStatusref] = useState(0);


  const [siteLoader, setSiteLoader] = useState(false);
  const [profileData, setprofileData] = useState("");
  const [buttonLoader, setbuttonLoader] = useState(false);

  useEffect(() => {
    getProfile();
    getKycStatus();
    // getAirdropInfo();
  }, []);

  const title = "Welcome to Fidex";
  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getrewardsinfo,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        setRewardpage(resp.data);
        console.log(Rewardpageref.current, "resp");
      } else {
        setRewardpage("");
      }
    } catch (error) { }
  };

  // const getAirdropInfo = async () => {
  //   try {
  //     var data = {
  //       apiUrl: apiService.getAirdropInfo,
  //     };
  //     setSiteLoader(true);
  //     var resp = await getMethod(data);
  //     setSiteLoader(false);
  //     if (resp.status) {
  //       setAirStatus(resp.data);
  //       console.log(airStatusref.current, "resp---air");
  //     } else {
  //       setRewardpage("");
  //     }
  //   } catch (error) { }
  // }


  const claimKYC = async () => {
    try {
      var data = {
        apiUrl: apiService.getKYCreward,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        showsuccessToast(resp.message);
        getProfile();
      } else {
        showerrorToast(resp.message);
      }
    } catch (error) { }
  };

  const claimDEPOSIT = async () => {
    try {
      var data = {
        apiUrl: apiService.getDepositreward,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        showsuccessToast(resp.message);
        getProfile();
      } else {
        showerrorToast(resp.message);
      }
    } catch (error) { }
  };

  const claimTRADE = async () => {
    try {
      var data = {
        apiUrl: apiService.getTradereward,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        showsuccessToast(resp.message);
        getProfile();

      } else {
        showerrorToast(resp.message);
      }
    } catch (error) { }
  };

  const getKycStatus = async () => {
    try {
      var data = {
        apiUrl: apiService.getKYC,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setprofileData(resp.datas.userDetails);
      }
    } catch (error) { }
  };

  const claimAirdrop = async () => {
    try {
      var data = {
        apiUrl: apiService.claimairdropreward,
      };
      setbuttonLoader(true);
      var resp = await postMethod(data);
      setbuttonLoader(false);
      if (resp.status) {
        // console.log(resp,"----resp----");
        showsuccessToast(resp.message);
        getProfile();
      } else {
        showerrorToast(resp.message);
      }
    } catch (error) {
    }
  }

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
      <Header />
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
        <div className="">
          <div className="referral-hero referral-hero1">
            <div className="container">
              <div className="row refeferal_section">
                <div className="col-lg-7">
                  <div className="refeferal_section_content referral-hero2">
                    <h2 className="stake-title">
                      {t('UnlockRewards')} <span className="prim">{t('boost')}</span>  <br />
                      {t('YourCrypto')}
                    </h2>
                    <h6 className="stake-msg">
                      {t('Earnexclusive')}
                    </h6>
                  </div>
                </div>

                <div className="col-lg-5 mar-top-3">
                  <img src={require("../assets/Rewards.png")} width="100%" />
                </div>
              </div>
            </div>
          </div>

          <section className="my-refferal-eraning-section">
            <div className="container">
              <div className="my-refferal-eraning">
                <h2 className="my-refferal-eraning-title">{t('ClaimYour')}</h2>
                <div className="row">
                  <div className="col-lg-12 my-4">
                    <div className="rewards_card">
                      <div>
                        <h5>{t('ClaimYour')}</h5>
                        <p>{t('Yourrewards')}</p>
                      </div>
                      <div>
                        {buttonLoader == false ? (
                          <>
                            {profileData.kycstatus == 1 ? (
                              <>
                                {Rewardpageref.current.userAirdropStatus == 0 ? (
                                  <button className="airstatus_dis">{t('Norewards')}</button>
                                ) : (
                                  <button onClick={claimAirdrop} >{t('ClaimNow')}</button>
                                )}
                              </>
                            ) : (
                              <button onClick={() => navigate("/kyc")}>{t('CompleteKYC')}</button>
                            )}
                          </>
                        ) : (
                          <button>{t('Loading')}...</button>
                        )}


                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-refferal-eraning">
                <h2 className="my-refferal-eraning-title">{t('NewUserTasks')}</h2>
                <div className="row">
                  {Rewardpageref.current?.activeRewards?.depositRewardActive ||
                    Rewardpageref.current?.activeRewards?.kycRewardActive ||
                    Rewardpageref.current?.activeRewards?.tradeRewardActive ? (
                    <>
                      {/* KYC Reward */}
                      {Rewardpageref.current?.activeRewards?.kycRewardActive && (
                        <div className="col-lg-12 my-4">
                          <div className="rewards_card">
                            <div>
                              <h5>{t('VerifyYour')}</h5>
                              <p>{t('completeyourKYC')} {Rewardpageref.current?.kycAmount} {Rewardpageref.current?.kycCurrency}. {t('ensureyouraccount')}</p>
                            </div>
                            <div>{
                              Rewardpageref.current?.userKYCStatus == 1 ? (
                                <button onClick={claimKYC} >{t('claimNow')}</button>
                              ) : Rewardpageref.current?.userKYCStatus == 2 ? (
                                <button >{t('claimed')}</button>
                              ) : (
                                <button onClick={() => navigate("/kyc")}>{t('CompleteKYC')}</button>
                              )}

                            </div>
                          </div>
                        </div>
                      )}

                      {/* Deposit Reward */}
                      {Rewardpageref.current?.activeRewards?.depositRewardActive && (
                        <div className="col-lg-12 my-4">
                          <div className="rewards_card">
                            <div>
                              <h5>{t('boostYouralance')}</h5>
                              <p>{t('depositatleast')} {Rewardpageref.current?.minDeposit} {t('uSDTandclaim')} {Rewardpageref.current?.depositAmount} {Rewardpageref.current?.depositCurrency}. {t('perfecttime')}</p>
                            </div>
                            <div>
                              {
                                Rewardpageref.current?.userDepositStatus == 1 ? (
                                  <button onClick={claimDEPOSIT} >{t('claimNow')}</button>
                                ) : Rewardpageref.current?.userDepositStatus == 2 ? (
                                  <button >{t('claimed')}</button>
                                ) : (
                                  <button onClick={() => navigate("/deposit")}>{t('depositNow')}</button>
                                )
                              }

                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trade Reward */}
                      {Rewardpageref.current?.activeRewards?.tradeRewardActive && (
                        <div className="col-lg-12 my-4">
                          <div className="rewards_card">
                            <div>
                              <h5>{t('makeYourFirst')}</h5>
                              <p>{t('yourfirsttrade')} {Rewardpageref.current?.tradeAmount} {Rewardpageref.current?.tradeCurrency}. {t('tradingandenjoy')}</p>
                            </div>
                            <div>
                              {
                                Rewardpageref.current?.userTradeStatus == 1 ? (
                                  <button onClick={claimTRADE} >Claim Now</button>
                                ) : Rewardpageref.current?.userTradeStatus == 2 ? (
                                  <button >{t('claimed')}</button>
                                ) : (
                                  <button onClick={() => navigate("/trade/BTC_USDT")}>{t('tradeNow')}</button>
                                )
                              }

                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty_data">
                      <div className="empty_data_img">
                        <img
                          src={require("../assets/No-data.webp")}
                          width="100px"
                          className="d-block mx-auto"
                          alt="No data"
                        />
                      </div>
                      <div className="no_records_text text-center">
                        {t('noTasksFound')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* staking options */}
          {/* <div>
            <div className="container">
              <div className="staking-flex">
                <h5 className="opt-title">Reward History</h5>
                <Link to="/referralHistory">
                  <div className="ref_view_main">
                    <span className="invite_text">View All</span>
                    <i
                      class="ri-arrow-right-s-line"
                      style={{ color: "#ffc630" }}
                    ></i>
                  </div>
                </Link>
              </div>

              <div className="table-responsive table-cont dash_table_content">
                <table className="table ">
                  <thead>
                    <tr className="stake-head font-satoshi">

                      <th className="table_center_text">S.No</th>
                      <th className="table_center_text">Username</th>
                      <th className="table_center_text">Date & Time</th>
                    </tr>
                  </thead>

                  <tbody>

                    {refferHistoty.length > 0 ? (
                      refferHistoty.slice(0, 5).map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className="opt-term font-satoshi font_14 table_center_text">
                              {i + 1}
                            </td>
                            <td className="opt-term font-satoshi font_14 table_center_text">
                              {item.displayname}
                            </td>
                            <td className="opt-term font-satoshi font_14 table_center_text">
                              {moment(item.createdDate).format("lll")}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-5">
                          <div className="empty_data">
                            <div className="empty_data_img">
                              <img
                                src={require("../assets/No-data.webp")}
                                width="100px"
                              />
                            </div>
                            <div className="no_records_text">
                              No Records Found
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </>
  );
};

export default Staking;
