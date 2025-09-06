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

import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  InstapaperIcon,
  InstapaperShareButton,
} from "react-share";

const Staking = () => {
  const { t } = useTranslation();
  const [refferalLink, setrefferalLink] = useState("");
  const [refferalCode, setrefferalCode] = useState("");
  const [refferHistoty, setRefferHistoty] = useState("");
  const [totalPage, setTotalPages] = useState("");
  const [totalRewards, setTotalRewards] = useState("");
  const [totalQualReferral, setTotalQualReferral] = useState("");
  const [totalRefferal, setTotalRefferal] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);

  useEffect(() => {
    getProfile();
    getReward();
    getRewardRewards();
  }, []);

  const title = "Welcome to Fidex";
  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status) {
        var referral_link =
          env.SITE_URL + "register?invite=" + resp.Message.referralCode;
        console.log(referral_link, "=-=-=-=-referral_link=-=-");
        var code = resp.Message.referralCode;
        setrefferalLink(referral_link);
        setrefferalCode(code);
        console.log(refferalCode, "reffernce", refferalLink);
      } else {
      }
    } catch (error) { }
  };

  const copy = (content) => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(content);
      showsuccessToast("Referral detail copied successfully");
    } else {
      showerrorToast("Link not copied, please try after sometimes!");
    }
  };

  const getReward = async () => {
    var get = {
      apiUrl: apiService.getReward,
    };
    setSiteLoader(true);
    var response = await getMethod(get);
    setSiteLoader(false);
    console.log(response, "response");
    setTotalRefferal(response.data.totalCount);
    setTotalQualReferral(response.data.qualCount);
    setRefferHistoty(response.data.history);
    setTotalRewards(response.data.reward);
  };

  const getRewardRewards = async () => {
    var get = {
      apiUrl: apiService.getReferralRewards,
    };
    setSiteLoader(true);
    var response = await getMethod(get);
    setSiteLoader(false);
    console.log(response, "response");
    if (response.status) {
      getReward();
    }
  };

  const recordPerPage = 5;
  const pageRange = 5;

  const handlePageChange = (event, pageNumber) => {
    // referralHistory(pageNumber);
    setCurrentPage(pageNumber);
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
        <div>
          <div className="referral-hero">
            <div className="container">
              <div className="row refeferal_section">
                <div className="col-lg-8">
                  <div className="refeferal_section_content">
                    <h2 className="stake-title">
                      {t('get')} <span className="crypto-span">{t('reward')}</span>{t('forEvery')}{" "}
                      <br /> {t('FriendYouInvite')}
                    </h2>
                    <h6 className="stake-msg">
                      {t('SpreadthewordandearnrewardswithPitikliniCrypt')}
                    </h6>
                  </div>
                </div>

                <div className="col-lg-4 mar-top-3">
                  <div className="staking-rewards-box">
                    <div className="staking-flex">
                      <h4 className="referral-invite-title">
                        {t('InviteUsingthis')}
                      </h4>
                    </div>
                    <div className="refferal_code">
                      <h4>{t('RefferalCode')}</h4>
                      <div className="">
                        <input
                          type="text"
                          value={refferalCode == undefined ? "" : refferalCode}
                          readOnly
                        />
                        <i
                          class="ri-file-copy-line cursor-pointer"
                          onClick={() => copy(refferalCode)}
                        ></i>
                      </div>
                    </div>
                    <div className="refferal_code">
                      <h4>{t('ReferralLink')}</h4>
                      <div className="">
                        <input
                          type="text"
                          value={refferalLink == undefined ? "" : refferalLink}
                          readOnly
                        />
                        <i
                          class="ri-file-copy-line cursor-pointer"
                          onClick={() => copy(refferalLink)}
                        ></i>
                      </div>
                    </div>
                    <div className="ref_new_main mt-5">
                      <div className="ref_new_social cursor-pointer">
                        <FacebookShareButton url={refferalLink} title={title}>
                          <FacebookIcon size={30} round />
                        </FacebookShareButton>
                      </div>
                      <div className="ref_new_social cursor-pointer">
                        <TwitterShareButton url={refferalLink} title={title}>
                          <TwitterIcon size={30} round />
                        </TwitterShareButton>
                      </div>
                      <div className="ref_new_social cursor-pointer">
                        <LinkedinShareButton
                          url={"https://beleaftechnologies.com/"}
                        >
                          <LinkedinIcon size={30} round />
                        </LinkedinShareButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="my-refferal-eraning-section">
            <div className="container-lg">
              <div className="my-refferal-eraning">
                <h2 className="my-refferal-eraning-title ">
                  {t('MyReferralandEarnings')}
                </h2>
                <div className="row my-referral-row">
                  <div className="col-lg-4">
                    <div className="referral_content_box">
                      <div className="referral_content_text">
                        <img src={require("../assets/person_icon.png")} />
                        <p>{t('TotalNo.ofFriendsInvites')}</p>
                      </div>
                      <h4>
                        {totalRefferal != null &&
                          totalRefferal != undefined &&
                          totalRefferal != ""
                          ? totalRefferal
                          : 0}
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="referral_content_box">
                      <div className="referral_content_text">
                        <img src={require("../assets/person_icon.png")} />
                        <p>{t('No.ofQualifiedInvites')}</p>
                      </div>
                      <h4>
                        {totalQualReferral != null &&
                          totalQualReferral != undefined &&
                          totalQualReferral != ""
                          ? totalQualReferral
                          : 0}
                      </h4>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="referral_content_box">
                      <div className="referral_content_text">
                        <img src={require("../assets/gift_icon.png")} />
                        <p>{t('TotalRewards')}</p>
                      </div>
                      <h4>
                        {totalRewards != null &&
                          totalRewards != undefined &&
                          totalRewards != ""
                          ? parseFloat(totalRewards).toFixed(4)
                          : 0.0}{" "}
                        {t('ptk')}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* staking options */}
          <div>
            <div className="container-lg">
              <div className="staking-flex">
                <h5 className="opt-title">{t('RefferalHistory')}</h5>
                <Link to="/referralHistory">
                  <div className="ref_view_main">
                    <span className="invite_text">{t('viewAll')}</span>
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
                    <tr className="stake-head">
                      <th className="table_center_text">{t('sNo')}</th>
                      <th className="table_center_text">{t('uid')}</th>
                      <th className="table_center_text">{t('username')}</th>
                      <th className="opt-btn-flex table-action table_center_text">{t('dateTime')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {refferHistoty.length > 0 ? (
                      refferHistoty.slice(0, 5).map((item, i) => {
                        return (
                          <tr key={i}>
                            <td className="opt-term font_14 table_center_text">
                              {i + 1}
                            </td>
                            <td className="opt-term font_14 table_center_text">
                              {item.uuid}
                            </td>
                            <td className="opt-term font_14 table_center_text">
                              {item.displayname}
                            </td>
                            <td className="opt-term font_14 table_center_text table_center_text">
                              {moment(item.createdDate).format("lll")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-5">
                          <div className="empty_data">
                            <div className="empty_data_img">
                              <img
                                src={require("../assets/No-data.webp")}
                                width="100px"
                              />
                            </div>
                            <div className="no_records_text">
                              {t('noRecordsFound')}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staking;
