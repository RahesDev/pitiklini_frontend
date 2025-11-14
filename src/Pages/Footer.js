import React, { useEffect } from "react";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import useState from "react-usestateref";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [siteLoader, setSiteLoader] = useState(false);
  const [siteData, setSiteData] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const { t } = useTranslation();
  const [loginCheck, setloginCheck] = useState(false);

  useEffect(() => {
    getSitedata();
  }, []);

   useEffect(() => {
      let userToken = sessionStorage.getItem("user_token");
      if (userToken) {
        setloginCheck(true);
      } else {
        setloginCheck(false);
      }
    }, []);

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
        console.log(resp, "=-=-=get site datas =-=-", resp.data.depositStatus);
      }
    } catch (error) {}
  };

  return (
    <footer className="footer_content_section">
      <div className="container">
        <div className="row footer-row">
          <div className="col-lg-5">
            <div className="footer_content">
              {/* <img src={require("../assets/footer_logo.webp")} /> */}
              <img src={siteData.siteLogo} />
              {/* <p>
                Our platform offers advanced tools, secure transactions, and
                seamless access to global markets. Join us and take your trading
                to the next level.
              </p> */}
              <p>{siteData.footerContent}</p>
              <div></div>
            </div>
          </div>

          <div className="col-lg-7 services_content">
            <div className="services">
              <h3>{t("products")}</h3>
              <li>
                <Link to="/trade/BTC_USDT">{t("trade")}</Link>
              </li>
              <li>
                <Link to={loginCheck ? "/p2p" : "/login"}>{t("p2p")}</Link>
              </li>
              <li>
                <Link to="/swap">{t("swap")}</Link>
              </li>
            </div>

            <div className="services">
              <h3>{t("about_us")}</h3>
              <li>
                <a href="/terms" target="_blank">
                  {t("terms_and_conditions")}
                </a>
              </li>
              <li>
                <a href="/privacy" target="_blank">
                  {t("privacy_policy")}
                </a>
              </li>{" "}
              {/* <li>
                <a href="/refundpolicy" target="_blank">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/returnpolicy" target="_blank">
                  Return Policy
                </a>
              </li> */}
            </div>

            <div className="services">
              <h3>{t("support")} </h3>
              <li>
                <Link to="/support" href="">
                  {t("support_center")}
                </Link>
              </li>
              {/* <li>
                <Link to="">Contact Us</Link>
              </li>
              <li>
                <Link to="">24/7 Chat Support</Link>
              </li> */}
            </div>
            {/* <div className="services">
              <h3>Business</h3>
              <li>
                <Link to="">Token Listing</Link>
              </li>
            </div> */}
          </div>
          <div className="social-links">
            <div className="social-community">
              <h6>{t("community")}</h6>
              <div className="right-social-links">
                <a
                  href={siteData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/telegram.webp")}
                    alt="telegram"
                  />
                </a>
                <a
                  href={`mailto:${siteData.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/gmail.webp")}
                    alt="gmail"
                  />
                </a>
                <a
                  href={siteData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/instagram.webp")}
                    alt="instagram"
                  />
                </a>
                {/* <a
                  href={siteData.coinMarketCap}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/coinmarket.webp")}
                    alt="coinmarket"
                  />
                </a> */}
                <a
                  href={siteData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/youtube.webp")}
                    alt="youtube"
                  />
                </a>
                {/* <a
                  href={siteData.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/reddit.webp")}
                    alt="reddit"
                  />
                </a>
                <a
                  href={siteData.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/linkedin.webp")}
                    alt="linkedin"
                  />
                </a>
                <a
                  href={siteData.coinGecko}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={require("../assets/icons/coingeckgo.webp")}
                    alt="coindeck"
                  />
                </a> */}
              </div>
            </div>

            <div>
              {" "}
              <span className="terms-email">
                {t("contact_us")} {siteData.email}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="copyrights">
        &copy; {siteData.copyrightText}
        {/* 2025 Pitiklini Crypt. All Rights Reserved. */}
      </div>
    </footer>
  );
};

export default Footer;
