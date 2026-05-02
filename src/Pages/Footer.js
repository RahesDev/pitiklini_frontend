import React from "react";
import Facebook from "../assets/svg/facebook.svg";
import Twitter from "../assets/svg/twitter.svg";
import Instagram from "../assets/svg/insta.svg";
import Linkedin from "../assets/svg/linkedin.svg";
import logo from "../assets/svg/logo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#18191D59] text-gray-400 pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-6 gap-10 mb-10">
          {/* Logo + Social */}
          <div className="flex flex-col text-center justify-center items-center">
            <div className="mb-4">
              <img src={logo} alt="" />
            </div>

            <p className="text-sm my-5 text-secondary10 mb-10">
              Trade smarter, Grow faster
            </p>

            <div className="flex gap-4 text-primary">
              <img src={Facebook} alt="" />
              <img src={Twitter} alt="" />
              <img src={Instagram} alt="" />
              <img src={Linkedin} alt="" />
            </div>
          </div>
          <div></div>
          {/* Explore */}
          {/* <div>
            <h3 className="text-primary font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-secondary10 text-sm">
              <li className="hover:text-white cursor-pointer">Markets</li>
              <li className="hover:text-white cursor-pointer">Spot</li>
              <li className="hover:text-white cursor-pointer">Join FalconX</li>
            </ul>
          </div> */}

          {/* Blog */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Blog</h3>
            <ul className="space-y-2 text-secondary10 text-sm">
              <li className="hover:text-white cursor-pointer">Articles</li>
              <li className="hover:text-white cursor-pointer">Videos</li>
              <li className="hover:text-white cursor-pointer">Podcasts</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-primary font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-secondary10 text-sm">
              <li className="hover:text-white cursor-pointer">
                Customer Support
              </li>
              <li className="hover:text-white cursor-pointer">Tickets</li>
              <Link to="/faq-page">
                <li className="text-secondary10 mt-[7px] hover:text-white cursor-pointer">
                  FAQs
                </li>
              </Link>
            </ul>
          </div>

          {/* About + Legal */}
          <div>
            <h3 className="text-primary font-semibold mb-4">About us</h3>
            <ul className="space-y-2 text-secondary10 text-sm mb-4">
              <li className="hover:text-white cursor-pointer">About FalconX</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-secondary10 text-sm">
              <Link to="/privacy-policy">
                <li className="text-secondary10 hover:text-white cursor-pointer">
                  Privacy Policy
                </li>
              </Link>
              <Link to="/user-agreement">
                <li className="text-secondary10 mt-[7px] hover:text-white cursor-pointer">
                  User Agreement
                </li>
              </Link>
              <li className="hover:text-white cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom */}
        <div className="text-center text-secondary10 text-sm text-gray-500">
          © 2026 <span className="text-primary">PITIKLINI</span>. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

// import React, { useEffect } from "react";
// import { getMethod, postMethod } from "../core/service/common.api";
// import apiService from "../core/service/detail";
// import { Link, useNavigate } from "react-router-dom";
// import useState from "react-usestateref";
// import { useTranslation } from "react-i18next";

// const Footer = () => {
//   const [siteLoader, setSiteLoader] = useState(false);
//   const [siteData, setSiteData] = useState("");
//   const [siteStatus, setSiteStatus] = useState("");
//   const { t } = useTranslation();
//   const [loginCheck, setloginCheck] = useState(false);

//   useEffect(() => {
//     getSitedata();
//   }, []);

//    useEffect(() => {
//       let userToken = sessionStorage.getItem("user_token");
//       if (userToken) {
//         setloginCheck(true);
//       } else {
//         setloginCheck(false);
//       }
//     }, []);

//   const getSitedata = async () => {
//     try {
//       var data = {
//         apiUrl: apiService.getSitedata,
//       };
//       setSiteLoader(true);
//       var resp = await getMethod(data);
//       setSiteLoader(false);
//       if (resp.status == true) {
//         setSiteData(resp.data);
//         setSiteStatus(resp.data.siteStatus);
//         console.log(resp, "=-=-=get site datas =-=-", resp.data.depositStatus);
//       }
//     } catch (error) {}
//   };

//   return (
//     <footer className="footer_content_section">
//       <div className="container">
//         <div className="row footer-row">
//           <div className="col-lg-5">
//             <div className="footer_content">
//               {/* <img src={require("../assets/footer_logo.webp")} /> */}
//               <img src={siteData.siteLogo} />
//               {/* <p>
//                 Our platform offers advanced tools, secure transactions, and
//                 seamless access to global markets. Join us and take your trading
//                 to the next level.
//               </p> */}
//               <p>{siteData.footerContent}</p>
//               <div></div>
//             </div>
//           </div>

//           <div className="col-lg-7 services_content">
//             <div className="services">
//               <h3>{t("products")}</h3>
//               <li>
//                 <Link to="/trade/BTC_USDT">{t("trade")}</Link>
//               </li>
//               <li>
//                 <Link to={loginCheck ? "/p2p" : "/login"}>{t("p2p")}</Link>
//               </li>
//               <li>
//                 <Link to="/swap">{t("swap")}</Link>
//               </li>
//             </div>

//             <div className="services">
//               <h3>{t("about_us")}</h3>
//               <li>
//                 <a href="/terms" target="_blank">
//                   {t("terms_and_conditions")}
//                 </a>
//               </li>
//               <li>
//                 <a href="/privacy" target="_blank">
//                   {t("privacy_policy")}
//                 </a>
//               </li>{" "}
//               {/* <li>
//                 <a href="/refundpolicy" target="_blank">
//                   Refund Policy
//                 </a>
//               </li>
//               <li>
//                 <a href="/returnpolicy" target="_blank">
//                   Return Policy
//                 </a>
//               </li> */}
//             </div>

//             <div className="services">
//               <h3>{t("support")} </h3>
//               <li>
//                 <Link to="/support" href="">
//                   {t("support_center")}
//                 </Link>
//               </li>
//               {/* <li>
//                 <Link to="">Contact Us</Link>
//               </li>
//               <li>
//                 <Link to="">24/7 Chat Support</Link>
//               </li> */}
//             </div>
//             {/* <div className="services">
//               <h3>Business</h3>
//               <li>
//                 <Link to="">Token Listing</Link>
//               </li>
//             </div> */}
//           </div>
//           <div className="social-links">
//             <div className="social-community">
//               <h6>{t("community")}</h6>
//               <div className="right-social-links">
//                 <a
//                   href={siteData.telegram}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/telegram.webp")}
//                     alt="telegram"
//                   />
//                 </a>
//                 <a
//                   href={`mailto:${siteData.email}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/gmail.webp")}
//                     alt="gmail"
//                   />
//                 </a>
//                 <a
//                   href={siteData.instagram}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/instagram.webp")}
//                     alt="instagram"
//                   />
//                 </a>
//                 {/* <a
//                   href={siteData.coinMarketCap}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/coinmarket.webp")}
//                     alt="coinmarket"
//                   />
//                 </a> */}
//                 <a
//                   href={siteData.youtube}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/youtube.webp")}
//                     alt="youtube"
//                   />
//                 </a>
//                 {/* <a
//                   href={siteData.reddit}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/reddit.webp")}
//                     alt="reddit"
//                   />
//                 </a>
//                 <a
//                   href={siteData.linkedIn}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/linkedin.webp")}
//                     alt="linkedin"
//                   />
//                 </a>
//                 <a
//                   href={siteData.coinGecko}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <img
//                     src={require("../assets/icons/coingeckgo.webp")}
//                     alt="coindeck"
//                   />
//                 </a> */}
//               </div>
//             </div>

//             <div>
//               {" "}
//               <span className="terms-email">
//                 {t("contact_us")} {siteData.email}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="copyrights">
//         &copy; {siteData.copyrightText}
//         {/* 2025 Pitiklini Crypt. All Rights Reserved. */}
//       </div>
//     </footer>
//   );
// };

// export default Footer;
