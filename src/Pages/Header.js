import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Lightlogo from "../assets/footer_logo.webp";
import Darklogo from "../assets/footer_logo.webp";
import UserIcon from "../assets/account.webp";
import Avatar from "../assets/svg/avatar.svg";
import Moment from "moment";
import { socket } from "../context/socket";
import HeaderLogo from "../assets/header_logo.svg";
import GlobalIcon from "../assets/icons/global.svg";
import Asset from "../assets/svg/asset.svg";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@material-ui/core";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import Wallet from "@mui/icons-material/Wallet";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import env from "../core/service/envconfig";
import { setAuthorization } from "../core/service/axios";
import { useAuth } from "./AuthContext";
import { removeAuthorization } from "../core/service/axios";
import { removeAuthToken } from "../core/lib/localStorage";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { toast } from "react-toastify";
import GoogleTranslate from "./GoogleTranslate";
import usa from "../assets/svg/usa.svg";
import spain from "../assets/svg/spain.svg";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  appBarItems: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  profileButton: {
    marginRight: theme.spacing(2),
    display: "block !important",
  },
  drawerIcon: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  mobileMenuButton: {
    marginLeft: theme.spacing(1),
    marginRight: "2px",
    padding: theme.spacing(1),
    color: "#BD7F10",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawer: {
    width: 300,
    backgroundColor: "#17171a",
    color: "#fff",
  },
  mobileMenu: {
    minHeight: "100%",
    width: "300px",
    padding: theme.spacing(0),
    backgroundColor: "#17171a",
    color: "#fff",
  },
}));

const Header = () => {
  useEffect(() => {
    // console.log("header inside comes ->");
    getSitedata();
    // let socket_token = localStorage.getItem("socketToken");
    let socket_token = sessionStorage.getItem("socketToken");
    if (
      socket_token == null ||
      socket_token == undefined ||
      socket_token == ""
    ) {
      return;
    }
    let socketsplit = socket_token?.split("_");
    socket.connect();
    socket.off("socketResponse");
    socket.on("socketResponse" + socketsplit[0], function (res) {
      if (res.Reason == "notify") {
        toast.success(res.Message, {
          toastId: "3",
        });
      } else if (res.Reason == "ordercancel") {
        toast.success(res.Message, {
          toastId: "3",
        });
      }
    });
    let userToken = sessionStorage.getItem("user_token");
    if (userToken) {
      socket.emit("getnotifications");
      // console.log("updatenotifications socketenters -->>");
      socket.on("updatenotifications", async (response) => {
        // console.log("updatenotifications socket -->>",response);
        setnotification(response.data.notification);
        if (response.data.status > 0) {
          setHasUnread(true);
        }
      });
    }
  }, [0]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const [loginCheck, setloginCheck] = useState(false);
  const [profileData, setprofileData] = useState("");
  const [notification, setnotification] = useState("");
  const [hasUnread, setHasUnread] = useState(false);
  const [siteData, setSiteData] = useState("");
  const [loaderSite, setLoaderSite] = useState(true);
  const { t, i18n } = useTranslation();
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const assetRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const languageRef1 = useRef(null);
  const languageRef2 = useRef(null);
  const notifyRef = useRef(null);
  const mobileNotifyRef = useRef(null);

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideLanguage =
        (languageRef1.current && languageRef1.current.contains(event.target)) ||
        (languageRef2.current && languageRef2.current.contains(event.target));

      const isInsideNotify =
        (notifyRef.current && notifyRef.current.contains(event.target)) ||
        (mobileNotifyRef.current &&
          mobileNotifyRef.current.contains(event.target));

      const isInsideAsset =
        assetRef.current && assetRef.current.contains(event.target);

      const isInsideProfile =
        profileRef.current && profileRef.current.contains(event.target);

      if (isProfileOpen && !isInsideProfile) {
        setIsProfileOpen(false);
      }

      if (isDropdownOpen && !isInsideLanguage) {
        setIsDropdownOpen(false);
      }

      if (isNotifyOpen && !isInsideNotify) {
        setIsNotifyOpen(false);
      }

      if (isAssetOpen && !isInsideAsset) {
        setIsAssetOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isNotifyOpen, isAssetOpen, isProfileOpen]);
  const handleLanguageChange = (language) => {
    console.log(language, "language");

    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language ? language : "en"); // Store the language in localStorage
    setIsDropdownOpen(false); // Close the dropdown after language selection
    // window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const changeLanguage = (lng) => {
    // let loc = "http://localhost:3000/";
    // window.location.replace(
    //     loc + "?lng=" +lng
    // );
    i18n.changeLanguage(lng);
  };
  const { isAuthenticated } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const moreClick = (e) => {
    setMoreAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const moreClose = () => {
    setMoreAnchorEl(null);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDrawerHistoryOpen, setIsDrawerHistoryOpen] = useState(false);

  const classes = useStyles();

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    // let userToken = localStorage.getItem("user_token");
    let userToken = sessionStorage.getItem("user_token");
    // if (true) {
    if (userToken) {
      // Forced true for development
      setloginCheck(true);
      if (userToken) {
        verifyToken();
        getProfile();
      }
      // getnotify();
    } else {
      setloginCheck(false);
    }
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getnotify();
  //   }, 5000); // Every 5 seconds

  //   return () => clearInterval(interval);
  // }, []);

  const verifyToken = async () => {
    // console.log("-------Verification calls---------");
    const token = sessionStorage.getItem("user_token");

    if (token) {
      try {
        const datas = {
          apiUrl: apiService.verifyToken, // Endpoint for token verification
          payload: { token },
        };

        const response = await postMethod(datas);

        if (response.status === 401 || response.message === "TokenExpired") {
          handleLogout();
        } else {
          // console.log("Token is valid");
        }
      } catch (error) {
        // console.log("Error in token verification", error);
        handleLogout(); // Handle error in verification process, assuming token might be invalid
      }
    }
  };

  let toastId = null;

  const handleLogout = () => {
    // Display error toast
    if (!toast.isActive(toastId)) {
      toastId = toast.error("Session expired. Please log in again.");
    }

    // Clear sessionStorage and localStorage
    sessionStorage.clear();
    localStorage.clear();

    // Redirect to the login page
    navigate("/login");
  };

  const getSitedata = async () => {
    try {
      var data = {
        apiUrl: apiService.getSitedata,
      };
      setLoaderSite(true);
      var resp = await getMethod(data);
      if (resp.status == true) {
        setSiteData(resp.data);
        setLoaderSite(false);
        // console.log(resp, "=-=-=get site datas =-=-");
      }
    } catch (error) {}
  };

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);

      if (resp.status == true) {
        setprofileData(resp.Message);
      }
    } catch (error) {}
  };

  // const getnotify = async () => {
  //   try {
  //     var data = {
  //       apiUrl: apiService.getnotification,
  //     };
  //     var resp = await postMethod(data);

  //     if (resp.status) {
  //       setnotification(resp.data.data);
  //       // console.log(notification);
  //       // Check if there are unread notifications
  //     const hasUnreadNotifications = resp.data.data.some((n) => n.status === 0);
  //     // console.log("hasUnreadNotifications--->>>>",hasUnreadNotifications);
  //     setHasUnread(hasUnreadNotifications); // Update state
  //     }
  //   } catch (error) {}
  // };

  const handleBellClick = async () => {
    setIsNotifyOpen((prev) => !prev);
    try {
      var data = {
        apiUrl: apiService.notifyStateChange,
      };
      var resp = await postMethod(data);
      if (resp.status) {
        setHasUnread(false); // Remove the bell indicator
      }
    } catch (error) {}
  };

  const obfuscateEmail = (email) => {
    if (!email) return "";
    const [localPart, domainPart] = email.split("@");
    const firstFive = localPart.slice(0, 3);
    return `${firstFive}***@${domainPart}`;
  };

  const [open1, setOpen] = useState(false);

  const navigate = useNavigate();

  const notifyNav = () => {
    navigate("/loginHistory");
  };

  const logout = async () => {
    await removeAuthorization();
    removeAuthToken();
    await setAuthorization("");
    // localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
    socket.off("updatenotifications");
  };

  const copy = async (text) => {
    navigator.clipboard.writeText(text);
    showsuccessToast("UID copied");
  };

  const showsuccessToast = (message) => {
    toast.dismiss();
    toast.success(message);
  };

  return (
    <div>
      <header className="scrolled">
        <div>
          <div className="header_new_mega">
            <div className={`${classes.root} `}>
              <AppBar position="static">
                <Toolbar className="container-fluid min-w-0 px-3 py-2 sm:px-4 sm:py-2 md:px-4">
                  <Typography variant="h6" className={classes.title}>
                    <div className="logo_new_sectio d-flex">
                      <Link
                        to={isAuthenticated ? "/dashboard" : "/"}
                        className="logo-brand"
                      >
                        {/* <img src={Lightlogo} className="img-fluid" alt="logo" /> */}
                        {loaderSite == false ? (
                          <img
                            src={siteData.siteLogo}
                            className="img-fluid"
                            alt="logo"
                          />
                        ) : (
                          <img
                            src={HeaderLogo}
                            className="img-fluid"
                            alt="logo"
                          />
                        )}
                      </Link>

                      <div className={`menu_new_typr ${classes.appBarItems}`}>
                        {/* <div class="btn-group more-wrapper">
                          <button
                            class="btn btn-secondary btn-lg dropdown-toggle more-select"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            {t("trade")}
                          </button>

                          <ul class="dropdown-menu trade-dropdown">
                            <div className="more-links">
                              <a
                                href="/trade/BTC_USDT"
                                className="nav-trade-links "
                              >
                                <div className="nav-trade-wrapper">
                                  <img
                                    src={require("../assets/icons/spot-trade.webp")}
                                    alt="spot-trade-icon"
                                  />
                                  <div>
                                    {t("spot_trade")}{" "}
                                    <span className="primary-nav-arrow mx-2">
                                      <i class="fa-solid fa-arrow-right"></i>
                                    </span>
                                    <p className="mt-2">
                                      {t("trade_instantly")}
                                    </p>
                                  </div>
                                </div>
                              </a>
                               <Link
                                to="/margin"
                                className="nav-trade-links nav-trade-flex margin-cursor"
                              >
                                <div className="nav-trade-wrapper mt-3">
                                  <img
                                    src={require("../assets/icons/margin-trade.webp")}
                                    alt="margin-trade-icon"
                                  />
                                  <div>
                                    Margin Trade{" "}
                                    <span className="trade-soon mx-2">
                                      Soon
                                    </span>
                                    <span className="primary-nav-arrow mx-1">
                                      <i class="fa-solid fa-arrow-right"></i>
                                    </span>
                                    <p className="mt-2">
                                      Leverage your trades on the margin market
                                      with advanced tools.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </ul>
                        </div> */}

                        <a
                          href="/trade/BTC_USDT"
                          color="inherit"
                          className="contact_button px-4 uppercase font-bold"
                        >
                          {/* Market */}
                          {t("spot")}
                        </a>
                        <Link
                          to="/market"
                          color="inherit"
                          className="contact_button px-4 uppercase font-bold"
                        >
                          {/* Market */}
                          {t("market")}
                        </Link>
                        <Link
                          to="/swap"
                          color="inherit"
                          className="contact_button px-4 uppercase font-bold"
                        >
                          {t("convert")}
                        </Link>
                        <Link
                          to={isAuthenticated ? "/p2p" : "/login"}
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("p2p")}
                        </Link>
                        <Link
                          to="/internaltransfer"
                          color="inherit"
                          className="contact_button px-4 uppercase font-bold"
                        >
                          {/* Market */}
                          {t("internal_transfer")}
                        </Link>
                        <Link
                          to="/fundtransfer"
                          color="inherit"
                          className="contact_button px-4 uppercase font-bold"
                        >
                          {/* Market */}
                          {t("fundtranfer")}
                        </Link>

                        {/* {loginCheck ? ( */}
                        {/* <Link
                          to="/swap"
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("convert")}
                        </Link> */}
                        {/* ) : (
                          ""
                        )} */}

                        {/* <Link
                          to="/staking"
                          color="inherit"
                          className="contact_button uppercase font-bold"
                        >
                          Staking
                        </Link> */}

                        {/* <Link
                          to="/Checkout"
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("fiat_deposit")}
                        </Link> */}

                        <Link
                          to="/recharge"
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("recharge")}
                        </Link>
                        {/*  <Link
                          to="/fundtransfer"
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("fundtranfer")}
                        </Link>
                        <Link
                          to="/recharge"
                          color="inherit"
                          className="contact_button  uppercase font-bold"
                        >
                          {t("recharge")}
                        </Link> */}

                        {/* <GoogleTranslate />/ */}
                      </div>
                    </div>
                  </Typography>

                  {/* {isAuthenticated ? ""  */}

                  <div className="ml-auto flex min-w-0 shrink-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:gap-x-2.5 md:gap-3">
                    <div className="relative" ref={languageRef2}>
                      {/* Trigger */}
                      <button
                        onClick={toggleDropdown}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-gray sm:h-10 sm:w-10"
                      >
                        <img
                          src={GlobalIcon}
                          alt="language"
                          className="w-5 h-5"
                        />
                      </button>

                      {/* Dropdown */}
                      {isDropdownOpen && (
                        <div className="absolute right-0 sm:right-0 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 mt-10 w-[90vw] max-w-[220px] rounded-2xl bg-[#18191D] border border-gray shadow-xl p-5 z-50">
                          {/* Title */}
                          <p className="text-primary text-center text-lg font-semibold mb-5 font-ibm">
                            Languages
                          </p>

                          {/* Options */}
                          <div className="flex flex-col gap-3">
                            {/* English */}
                            <button
                              onClick={() => handleLanguageChange("en")}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                i18n.language === "en"
                                  ? "bg-gray text-secondary"
                                  : "text-secondary10 hover:bg-gray"
                              }`}
                            >
                              <img
                                src={usa}
                                alt="USA"
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="font-ibm text-sm">English</span>
                            </button>

                            {/* Spanish */}
                            <button
                              onClick={() => handleLanguageChange("es")}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                                i18n.language === "es"
                                  ? "bg-gray text-secondary"
                                  : "text-secondary10 hover:bg-gray"
                              }`}
                            >
                              <img
                                src={spain}
                                alt="Spain"
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="font-ibm text-sm">Español</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* notification bell */}
                    {loginCheck ? (
                      <div className="relative" ref={mobileNotifyRef}>
                        {/* Bell Button */}
                        <button
                          onClick={() => handleBellClick()}
                          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-gray sm:h-10 sm:w-10"
                        >
                          <span className="text-primary text-lg">
                            <i className="bi bi-bell"></i>
                          </span>

                          {/* Unread Indicator */}
                          {hasUnread && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </button>

                        {/* Dropdown */}
                        {isNotifyOpen && (
                          <div className="absolute right-0 sm:right-0 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 mt-10 w-[90vw] max-w-[320px] rounded-2xl bg-[#18191D] border border-gray shadow-xl p-5 z-50">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-secondary text-sm font-ibm">
                                {notification?.length || 0}{" "}
                                {t("newNotifications")}
                              </p>

                              <button
                                onClick={notifyNav}
                                className="text-primary text-sm font-medium hover:underline"
                              >
                                {t("viewAll")}
                              </button>
                            </div>

                            {/* Notifications List */}
                            <div className="flex flex-col gap-4 max-h-[260px] overflow-y-auto">
                              {notification && notification.length > 0 ? (
                                notification.map((options, i) => (
                                  <Link
                                    key={i}
                                    to={
                                      options.link === ""
                                        ? "/notificationHistory"
                                        : options.link
                                    }
                                    className="flex gap-3 p-2 rounded-lg hover:bg-gray transition"
                                  >
                                    {/* Dot */}
                                    <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>

                                    {/* Content */}
                                    <div>
                                      <p className="text-secondary text-sm font-medium line-clamp-1">
                                        {options.message}
                                      </p>

                                      <p className="text-secondary10 text-[11px] mt-1">
                                        {Moment(options.createdAt).fromNow()}
                                      </p>
                                    </div>
                                  </Link>
                                ))
                              ) : (
                                <p className="text-secondary10 text-sm text-center py-6">
                                  {t("noNotifications")}
                                </p>
                              )}
                            </div>

                            {/* View All Button */}
                            {notification && notification.length > 0 && (
                              <button
                                onClick={notifyNav}
                                className="w-full mt-5 bg-primary text-black py-2.5 rounded-lg font-medium hover:opacity-90 transition"
                              >
                                {t("viewAll")}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}

                     {/* {loginCheck ? (
                      <div className="relative" ref={assetRef}> */}
                        {/* Button */}
                        {/* <button
                          onClick={() => setIsAssetOpen((prev) => !prev)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-gray sm:h-10 sm:w-10"
                        >
                          <img src={Asset} alt="Asset" className="w-5 h-5" />
                        </button> */}

                        {/* Dropdown */}
                        {/* {isAssetOpen && (
                          <div className="absolute right-0 sm:right-0 left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 mt-10 w-[90vw] max-w-[220px] rounded-2xl bg-[#18191D] border border-gray shadow-xl p-4 z-50">
                            <div className="flex flex-col gap-3"> */}
                              {/* <Link to="/assets" className="nav-trade-links">
                                <div className="nav-trade-wrapper flex items-center gap-2">
                                  <img
                                    src={require("../assets/icons/overview-assets.webp")}
                                    alt="overview"
                                  />
                                  <div className="flex justify-between w-full items-center">
                                    {t("overview")}
                                    <i className="bi bi-arrow-right"></i>
                                  </div>
                                </div>
                              </Link> */}

                              {/* <Link
                                to="/spotassets"
                                className="nav-trade-links"
                              >
                                <div className="nav-trade-wrapper flex items-center gap-2">
                                  <img
                                    src={require("../assets/icons/spot-assets.webp")}
                                    alt="spot"
                                  />
                                  <div className="flex justify-between w-full items-center">
                                    {t("spotAssets")}
                                    <i className="bi bi-arrow-right"></i>
                                  </div>
                                </div>
                              </Link>

                              <Link
                                to="/fundingassets"
                                className="nav-trade-links"
                              >
                                <div className="nav-trade-wrapper flex items-center gap-2">
                                  <img
                                    src={require("../assets/icons/funding-assets.webp")}
                                    alt="funding"
                                  />
                                  <div className="flex justify-between w-full items-center">
                                    {t("fundingAssets")}
                                    <i className="bi bi-arrow-right"></i>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null} */}
                    {/* <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className={` m-0 p-0 ${classes.profileButton}`}
                  > */}
                    {/* user profile */}
                    <>
                      {loginCheck ? (
                        <div className="relative" ref={profileRef}>
                          {/* Profile Button */}
                          <div
                            onClick={handleProfileClick}
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#23262F] bg-[#23262F] transition hover:opacity-80 sm:h-11 sm:w-11 md:h-[44px] md:w-[44px]"
                          >
                            <img
                              src={Avatar}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = require("../assets/icons/profile_dark.webp");
                              }}
                            />
                          </div>

                          {/* Dropdown (UNCHANGED CONTENT) */}
                          {isProfileOpen && (
                            <div className="absolute right-2 sm:right-0 mt-10 w-[90vw] sm:w-[300px] max-w-[300px] rounded-2xl bg-[#18191D] border border-gray shadow-xl p-4 z-50">
                              {/* <div className="frame-container"> */}
                              {/* user details */}
                              <div className="user-details">
                                <img
                                  src={UserIcon}
                                  alt="usericon"
                                  className="user-img"
                                />
                                <div className="details">
                                  <span className="details-mail">
                                    {obfuscateEmail(profileData.email)}
                                  </span>
                                  <span className="details-udi">
                                    {t("UID")}:{profileData.uuid}
                                    <i
                                      className="bi bi-copy cursor-pointer"
                                      onClick={() => copy(profileData.uuid)}
                                    ></i>
                                  </span>
                                </div>
                              </div>

                              {/* links */}
                              <ul className="links">
                                <li>
                                  <Link
                                    to="/dashboard"
                                    className="link-content"
                                  >
                                    <span>{t("dashboard")}</span>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>

                                <li>
                                  <Link to="/security" className="link-content">
                                    <div className="header_new_chng">
                                      <span>{t("security")}</span>
                                      <div>
                                        {profileData.tfastatus == 0 &&
                                        profileData.AntiphisingEnabledStatus ==
                                          0 ? (
                                          <p>
                                            <span className="low-clr mx-1">
                                              {t("low")}
                                            </span>
                                            <i className="ri-shield-keyhole-line low-clr"></i>
                                          </p>
                                        ) : profileData.tfastatus == 0 ||
                                          profileData.AntiphisingEnabledStatus ==
                                            0 ? (
                                          <p>
                                            <span className="mid-clr mx-1">
                                              {t("medium")}
                                            </span>
                                            <i className="ri-shield-keyhole-line mid-clr"></i>
                                          </p>
                                        ) : (
                                          <p>
                                            <span className="high-clr mx-1">
                                              {t("high")}
                                            </span>
                                            <i className="ri-shield-keyhole-line high-clr"></i>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>

                                <li>
                                  <Link to="/kyc" className="link-content">
                                    <div className="header_new_chng">
                                      <span>{t("identification")}</span>
                                      <div>
                                        {profileData.kycstatus == 1 ? (
                                          <p>
                                            <span className="high-clr mx-1">
                                              {t("verified")}
                                            </span>
                                            <i className="bi bi-check-circle high-clr"></i>
                                          </p>
                                        ) : (
                                          <p>
                                            <span className="low-clr mx-1">
                                              {t("notverified")}
                                            </span>
                                            <i className="bi bi-x-circle low-clr"></i>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>

                                <li>
                                  <Link to="/withdraw" className="link-content">
                                    <span>{t("withdrawal")}</span>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    to="/depositHistory"
                                    className="link-content"
                                  >
                                    <span>{t("history")}</span>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>

                                <li>
                                  <Link to="/support" className="link-content">
                                    <span>{t("support")}</span>
                                    <span className="text-yellow hover-show">
                                      <i className="bi bi-chevron-right"></i>
                                    </span>
                                  </Link>
                                </li>
                              </ul>

                              {/* logout */}
                              <div
                                className="btn-wrapper security-link cursor-pointer"
                                onClick={logout}
                              >
                                <span className="user-btn">{t("logout")}</span>
                                <img
                                  src={require("../assets/icons/logout.webp")}
                                  alt="logoutimg"
                                  className="logout-img"
                                />
                              </div>
                              {/* </div> */}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </>
                    {/* download */}
                    {/* <div className="relative" ref={languageRef1}> */}
                    {/* Trigger dropdown on click */}
                    {/* <Link className="mr-4" onClick={toggleDropdown}>
                        <img
                          src={require("../assets/Globe.png")}
                          width="28px"
                          alt="Globe"
                        />
                      </Link> */}

                    {/* Dropdown menu */}
                    {/* {isDropdownOpen && (
                        <ul className="globe-lists">
                          <li
                            className="globe-options"
                            onClick={() => handleLanguageChange("en")}
                          >
                            English
                          </li>
                          <li
                            className="globe-options"
                            onClick={() => handleLanguageChange("es")}
                          >
                            Spanish
                          </li>
                        </ul>
                      )}
                    </div> */}
                    {/* <Link className="contact_button nav-primary-icons" to="">
                      <span className="header-profile-wrap dark_display_none nav-primary-icons ">
                        <i class="bi bi-download"></i>
                      </span>
                    </Link> */}

                    {/* notification bell */}
                    {/* {loginCheck ? (
                      <div
                        className={`btn-group more-wrapper${isNotifyOpen ? " show" : ""}`}
                        ref={notifyRef}
                      >
                        <button
                          className="btn btn-secondary btn-lg dropdown-toggle more-select bell-notify  nav-primary-icons"
                          type="button"
                          aria-expanded={isNotifyOpen}
                          onClick={handleBellClick}
                        > */}
                    {/* <img
                            src={require("../assets/icons/bell.webp")}
                            className="moons"
                            width="30px"
                          /> */}
                    {/* 
                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-bell"></i>
                          </span>
                          {hasUnread && <div className="bell-indicator"></div>}
                        </button>

                        <ul
                          className={`dropdown-menu notify-dropdown${isNotifyOpen ? " show" : ""}`}
                        >
                          <div className="notify-contents">
                            <div className="notify-head-wrapper d-flex align-items-center justify-content-between">
                              <h5>{t("notifications")}</h5>
                              <button onClick={notifyNav}>
                                {t("viewAll")}{" "}
                                <i class="ri-arrow-right-s-line"></i>
                              </button>
                            </div>

                            {notification &&
                              notification.map((options, i) => {
                                return (
                                  <div className="notify-container">
                                    <Link
                                      to={
                                        options.link == ""
                                          ? "/notificationHistory"
                                          : options.link
                                      }
                                      className="nav-notify-content "
                                    >
                                      <h6 className="nav-notify">
                                        {" "}
                                        {options.message}{" "}
                                      </h6>

                                      <div className="time-notify">
                                        {Moment(options.createdAt).fromNow()}
                                      </div>
                                    </Link>
                                  </div>
                                );
                              })}
                          </div>
                        </ul>
                      </div>
                    ) : (
                      ""
                    )} */}

                    <>
                      {/* <h6
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        className=" head-drops"
                        onClick={handleClick}
                      >
                        <img
                          src={require("../assets/Globe.png")}
                          className="minimage"
                          width="30px"
                        />
                      </h6> */}

                      {/* <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem>
                          <LogoutIcon />
                          <span className="mx-3 cus">Disconnect</span>{" "}
                        </MenuItem>
                      </Menu> */}
                    </>

                    {/* <MenuIcon
                      className={`meus ${classes.mobileMenuButton}`}
                      onClick={handleMobileMenuOpen}
                    />
                  </IconButton> */}
                    <IconButton
                      edge="start"
                      aria-label="menu"
                      className={`${classes.mobileMenuButton} !ml-0 !mr-0 shrink-0`}
                      style={{ color: "#B87A13" }}
                      onClick={handleMobileMenuOpen}
                    >
                      <MenuIcon />
                    </IconButton>
                  </div>

                  <div
                    className={`flex justify-center rounded-[8px] px-2 ml-4 bg-primary text-black ${classes.appBarItems}`}
                  >
                    {!loginCheck && (
                      <div className="flex items-center gap-2">
                        <Link to="/login">
                          <button className="head-btn-login">
                            {t("login")}
                          </button>
                        </Link>

                        <span className="text-gray-400">/</span>

                        <Link to="/register">
                          <button className="head-btn capitalize">
                            {t("signup")}
                          </button>
                        </Link>
                      </div>
                    )}
                    {/* {loginCheck ? (
                      <Link to="/deposit" className="head-dep-btn">
                        <button className="head-btn m-0">{t("deposit")}</button>
                      </Link>
                    ) : (
                      ""
                    )} */}

                    {/* user profile */}

                    <>
                      {/* <h6
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        className=" head-drops cursor-pointer"
                        onClick={handleClick}
                      >
                        {loginCheck ? (
                          <img
                            src={require("../assets/icons/profile_dark.webp")}
                            width="30px"
                            className="dark_display_none nav-primary-icons"
                          />
                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-person-circle"></i>
                          </span>
                        ) : (
                          ""
                        )}
                        <img
                          src={require("../assets/profile_dark.png")}
                          className="dark_profile "
                        />
                      </h6> */}

                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        className="MuiList-padding"
                      >
                        {loginCheck ? (
                          <div className="frame-container ">
                            {/* user details */}
                            <div className="user-details">
                              <img
                                src={UserIcon}
                                alt="usericon"
                                className="user-img"
                              />
                              <div className="details">
                                <span className="details-mail">
                                  {obfuscateEmail(profileData.email)}
                                </span>
                                <span className="details-udi">
                                  {t("UID")}:{profileData.uuid}{" "}
                                  <i
                                    className="fa-regular fa-copy cursor-pointer"
                                    onClick={() => copy(profileData.uuid)}
                                  ></i>{" "}
                                </span>
                                {/* <img
                                src={logout}
                                alt="logoutimg"
                                className="logout-img"
                              /> */}
                              </div>
                            </div>
                            {/* links */}
                            <ul className="links">
                              <li>
                                <Link to="/dashboard" className="link-content">
                                  <span>{t("dashboard")}</span>{" "}
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/security" className="link-content">
                                  <div className="header_new_chng">
                                    <span>{t("security")}</span>
                                    <div>
                                      {profileData.tfastatus == 0 &&
                                      // profileData.AntiphisingStatus == 0 ? (
                                      profileData.AntiphisingEnabledStatus ==
                                        0 ? (
                                        <p>
                                          <span className="low-clr mx-1 ">
                                            {t("low")}
                                          </span>
                                          <i class="ri-shield-keyhole-line low-clr"></i>
                                        </p>
                                      ) : profileData.tfastatus == 0 ||
                                        // profileData.AntiphisingStatus == 0 ? (
                                        profileData.AntiphisingEnabledStatus ==
                                          0 ? (
                                        <p>
                                          <span className="mid-clr mx-1">
                                            {t("medium")}
                                          </span>
                                          <i class="ri-shield-keyhole-line mid-clr"></i>
                                        </p>
                                      ) : (
                                        <p>
                                          <span className="high-clr mx-1">
                                            {t("high")}
                                          </span>
                                          <i class="ri-shield-keyhole-line high-clr"></i>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/kyc" className="link-content">
                                  <div className="header_new_chng">
                                    <span>{t("identification")}</span>
                                    <div>
                                      {profileData.kycstatus == 1 ? (
                                        // <span className="text-success">
                                        <p>
                                          <span className="high-clr mx-1">
                                            {t("verified")}
                                          </span>
                                          <i class="fa-solid fa-circle-check high-clr"></i>
                                        </p>
                                      ) : (
                                        <p>
                                          <span className="low-clr mx-1">
                                            {t("notverified")}
                                          </span>
                                          <i class="fa-solid fa-circle-xmark low-clr"></i>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/withdraw" className="link-content">
                                  <span>{t("withdrawal")}</span>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                              {/* <li>
                                <Link to="/rewards" className="link-content">
                                  <span>My Rewards</span>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li> */}
                              <li>
                                <Link
                                  to="/loginHistory"
                                  className="link-content"
                                >
                                  <span>{t("history")}</span>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/support" className="link-content">
                                  <span>{t("support")}</span>
                                  <span className="text-yellow hover-show">
                                    <i class="fa-solid fa-chevron-right"></i>
                                  </span>
                                </Link>
                              </li>
                            </ul>
                            {/* logout button */}
                            <div
                              className="btn-wrapper security-link cursor-pointer"
                              onClick={logout}
                            >
                              <span className="user-btn">{t("logout")}</span>
                              <img
                                src={require("../assets/icons/logout.webp")}
                                alt="logoutimg"
                                className="logout-img"
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </Menu>
                    </>

                    {/* download */}
                    {/* <Link
                      className="contact_button  nav-primary-icons margin-lr"
                      to="/"
                    >

                      <span className="header-profile-wrap dark_display_none nav-primary-icons mx-1">
                        <i class="bi bi-download"></i>
                      </span>
                    </Link> */}
                  </div>
                </Toolbar>
              </AppBar>

              <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
                classes={{ paper: classes.drawer }}
              >
                <div className={classes.mobileMenu}>
                  <div className="logo_new_sectio mobile_menu_icon">
                    <Link
                      to={isAuthenticated ? "/dashboard" : "/"}
                      className="logo-brand"
                    >
                      {loaderSite == false ? (
                        <img
                          src={siteData.siteLogo}
                          className="img-fluid m-3"
                          alt="logo"
                        />
                      ) : (
                        <img
                          src={require("../assets/footer_logo.webp")}
                          className="img-fluid m-3"
                          alt="logo"
                        />
                      )}
                    </Link>
                  </div>

                  <div className="menu_statis mobile-sidebar-list">
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/dashboard"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-home-line mobile-sidebar-icon"></i>
                        <span>{t("dashboard")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/trade/BTC_USDT"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-price-tag-3-line mobile-sidebar-icon"></i>
                        <span>{t("spot")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/market"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-bar-chart-line mobile-sidebar-icon"></i>
                        <span>{t("market")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/swap"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-repeat-line mobile-sidebar-icon"></i>
                        <span>{t("convert")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to={isAuthenticated ? "/p2p" : "/login"}
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-hand-coin-line mobile-sidebar-icon"></i>
                        <span>{t("p2p")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to={isAuthenticated ? "/internaltransfer" : "/login"}
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-switch-line mobile-sidebar-icon"></i>
                        <span>{t("internal_transfer")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to={isAuthenticated ? "/fundtransfer" : "/login"}
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-bank-line mobile-sidebar-icon"></i>
                        <span>{t("fundtranfer")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/recharge"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-flashlight-line mobile-sidebar-icon"></i>
                        <span>{t("recharge")}</span>
                      </Link>
                    </ListItem>
                    {/* <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/spotassets"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-wallet-3-line mobile-sidebar-icon"></i>
                        <span>{t("asset")}</span>
                      </Link>
                    </ListItem> */}
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/security"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-shield-check-line mobile-sidebar-icon"></i>
                        <span>{t("security")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/fee-settings"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-settings-3-line mobile-sidebar-icon"></i>
                        <span>{t("feeSettings")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/kyc"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-user-search-line mobile-sidebar-icon"></i>
                        <span>{t("identification")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/withdraw"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-arrow-down-line mobile-sidebar-icon"></i>
                        <span>{t("withdrawal")}</span>
                      </Link>
                    </ListItem>
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/deposit"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-download-2-line mobile-sidebar-icon"></i>
                        <span>{t("deposit")}</span>
                      </Link>
                    </ListItem>
                    <ListItem
                      button
                      className="drawa mobile-sidebar-item"
                      onClick={() => setIsDrawerHistoryOpen((prev) => !prev)}
                    >
                      <div className="mobile-sidebar-link mobile-sidebar-toggle">
                        <i className="ri-history-line mobile-sidebar-icon"></i>
                        <span>{t("history")}</span>
                        <i
                          className={`ri-arrow-${isDrawerHistoryOpen ? "up" : "down"}-s-line ml-auto`}
                          style={{ fontSize: "18px" }}
                        ></i>
                      </div>
                    </ListItem>
                    {isDrawerHistoryOpen && (
                      <div className="mobile-sidebar-sublist">
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/loginHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-login-box-line mobile-sidebar-icon"></i>
                            <span>{t("loginHistory", "Login History")}</span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/depositHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-wallet-line mobile-sidebar-icon"></i>
                            <span>
                              {t("depositHistory", "Deposit History")}
                            </span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/withdrawHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-arrow-down-line mobile-sidebar-icon"></i>
                            <span>
                              {t("withdrawHistory", "Withdraw History")}
                            </span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/internaltransferhistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-switch-line mobile-sidebar-icon"></i>
                            <span>
                              {t(
                                "internal_transfer_history",
                                "Internal Transfer History",
                              )}
                            </span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/swapHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-repeat-line mobile-sidebar-icon"></i>
                            <span>{t("swapHistory", "Swap History")}</span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/orderHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-file-list-line mobile-sidebar-icon"></i>
                            <span>{t("orderHistory", "Order History")}</span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/cancelorderHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-close-circle-line mobile-sidebar-icon"></i>
                            <span>
                              {t("cancelorderHistory", "Cancel Order History")}
                            </span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/tradeHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-line-chart-line mobile-sidebar-icon"></i>
                            <span>{t("tradeHistory", "Trade History")}</span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/NotificationHistory"
                            className="mobile-sidebar-link mobile-sidebar-subitem-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-notification-line mobile-sidebar-icon"></i>
                            <span>
                              {t("notificationHistory", "Notification History")}
                            </span>
                          </Link>
                        </ListItem>
                      </div>
                    )}
                    <ListItem button className="drawa mobile-sidebar-item">
                      <Link
                        to="/support"
                        className="mobile-sidebar-link"
                        onClick={handleMobileMenuClose}
                      >
                        <i className="ri-question-line mobile-sidebar-icon"></i>
                        <span>{t("support")}</span>
                      </Link>
                    </ListItem>
                    {loginCheck ? (
                      <ListItem button className="drawa mobile-sidebar-item">
                        <div
                          className="mobile-sidebar-link"
                          onClick={() => {
                            handleMobileMenuClose();
                            logout();
                          }}
                        >
                          <i className="ri-logout-box-r-line mobile-sidebar-icon"></i>
                          <span>{t("logout")}</span>
                        </div>
                      </ListItem>
                    ) : (
                      <>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/login"
                            className="mobile-sidebar-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-login-box-line mobile-sidebar-icon"></i>
                            <span>{t("login")}</span>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa mobile-sidebar-item">
                          <Link
                            to="/register"
                            className="mobile-sidebar-link"
                            onClick={handleMobileMenuClose}
                          >
                            <i className="ri-user-add-line mobile-sidebar-icon"></i>
                            <span>{t("signup")}</span>
                          </Link>
                        </ListItem>
                      </>
                    )}
                  </div>
                </div>
              </Drawer>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
