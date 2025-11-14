import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Lightlogo from "../assets/footer_logo.webp";
import Darklogo from "../assets/footer_logo.webp";
import UserIcon from "../assets/account.webp";
import Moment from "moment";
import { socket } from "../context/socket";

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
  mobileMenuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerIcon: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  drawer: {
    width: 300,
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    if (userToken) {
      setloginCheck(true);
      verifyToken();
      getProfile();
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
                <Toolbar className="container-fluid pad-0">
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
                            src={Lightlogo}
                            className="img-fluid"
                            alt="logo"
                          />
                        )}
                      </Link>

                      <div className={`menu_new_typr ${classes.appBarItems}`}>
                        <div class="btn-group more-wrapper">
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
                              {/* <Link
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
                              </Link> */}
                            </div>
                          </ul>
                        </div>

                        <Link
                          to="/market"
                          color="inherit"
                          className="contact_button"
                        >
                          {/* Market */}
                          {t("market")}
                        </Link>

                        {/* {loginCheck ? ( */}
                        <Link
                          to="/swap"
                          color="inherit"
                          className="contact_button"
                        >
                          {t("convert")}
                        </Link>
                        {/* ) : (
                          ""
                        )} */}

                        {/* <Link
                          to="/staking"
                          color="inherit"
                          className="contact_button"
                        >
                          Staking
                        </Link> */}
                        <Link
                          to={isAuthenticated ? "/p2p" : "/login"}
                          color="inherit"
                          className="contact_button"
                        >
                          {t("p2p")}
                        </Link>

                        <Link
                          to="/Checkout"
                          color="inherit"
                          className="contact_button"
                        >
                          {t("fiat_deposit")}
                        </Link>

                        <Link
                          to="/internaltransfer"
                          color="inherit"
                          className="contact_button"
                        >
                          {t("internal_transfer")}
                        </Link>
                        <Link
                          to="/fundtransfer"
                          color="inherit"
                          className="contact_button"
                        >
                          {t("fundtranfer")}
                        </Link>
                        {/* <Link
                          to="/recharge"
                          color="inherit"
                          className="contact_button"
                        >
                          {t("recharge")}
                        </Link> */}

                        {/* <GoogleTranslate />/ */}
                      </div>
                    </div>
                  </Typography>

                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className={` m-0 p-0 ${classes.mobileMenuButton} ${classes.drawerIcon}`}
                  >
                    {/* user profile */}
                    <>
                      <h6
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        className=" head-drops cursor-pointer"
                        onClick={handleClick}
                      >
                        {loginCheck ? (
                          // <img
                          //   src={require("../assets/icons/profile_dark.webp")}
                          //   width="30px"
                          //   className="dark_display_none nav-primary-icons"
                          // />
                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-person-circle"></i>
                          </span>
                        ) : (
                          ""
                        )}
                        {/* <img
                          src={require("../assets/profile_dark.png")}
                          className="dark_profile "
                        /> */}
                      </h6>

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
                                  to="/depositHistory"
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
                    <div className="relative">
                      {/* Trigger dropdown on click */}
                      <Link className="contact_button" onClick={toggleDropdown}>
                        <img
                          src={require("../assets/Globe.png")}
                          width="28px"
                          alt="Globe"
                        />
                      </Link>

                      {/* Dropdown menu */}
                      {isDropdownOpen && (
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
                    </div>
                    {/* <Link className="contact_button nav-primary-icons" to="">
                      <span className="header-profile-wrap dark_display_none nav-primary-icons ">
                        <i class="bi bi-download"></i>
                      </span>
                    </Link> */}

                    {/* notification bell */}
                    {loginCheck ? (
                      <div class="btn-group more-wrapper">
                        <button
                          class="btn btn-secondary btn-lg dropdown-toggle more-select bell-notify  nav-primary-icons"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          onClick={() => handleBellClick()}
                        >
                          {/* <img
                            src={require("../assets/icons/bell.webp")}
                            className="moons"
                            width="30px"
                          /> */}

                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-bell"></i>
                          </span>
                          {hasUnread && <div className="bell-indicator"></div>}
                        </button>

                        <ul class="dropdown-menu notify-dropdown">
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
                    )}

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

                    <MenuIcon className="meus" onClick={handleMobileMenuOpen} />
                  </IconButton>

                  {/* {isAuthenticated ? ""  */}

                  <div className={`menu_new_typr ${classes.appBarItems}`}>
                    {loginCheck ? (
                      ""
                    ) : (
                      <Link to="/login">
                        <button className="head-btn-login">{t("login")}</button>
                      </Link>
                    )}
                    {loginCheck ? (
                      ""
                    ) : (
                      <Link to="/register">
                        <button className="head-btn">{t("register")}</button>
                      </Link>
                    )}
                    {loginCheck ? (
                      <Link to="/deposit" className="head-dep-btn">
                        <button className="head-btn m-0">{t("deposit")}</button>
                      </Link>
                    ) : (
                      ""
                    )}
                    {loginCheck ? (
                      <div class="btn-group more-wrapper">
                        <button
                          class="btn btn-secondary btn-lg dropdown-toggle more-select"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {t("assets")}
                        </button>

                        <ul class="dropdown-menu more-dropdown-newasset">
                          <div className="more-links">
                            <Link to="/assets" className="nav-trade-links">
                              <div className="nav-trade-wrapper">
                                <img
                                  src={require("../assets/icons/overview-assets.webp")}
                                  alt="spot-trade-icon"
                                />
                                <div>
                                  {t("overview")}
                                  <span className="primary-nav-arrow mx-2">
                                    <i class="fa-solid fa-arrow-right"></i>
                                  </span>
                                </div>
                              </div>
                            </Link>
                            <Link to="/spotassets" className="nav-trade-links">
                              <div className="nav-trade-wrapper mt-3">
                                <img
                                  src={require("../assets/icons/spot-assets.webp")}
                                  alt="spot-trade-icon"
                                />
                                <div>
                                  {t("spotAssets")}
                                  <span className="primary-nav-arrow mx-2">
                                    <i class="fa-solid fa-arrow-right"></i>
                                  </span>
                                </div>
                              </div>
                            </Link>
                            <Link
                              to="/fundingassets"
                              className="nav-trade-links"
                            >
                              <div className="nav-trade-wrapper mt-3">
                                <img
                                  src={require("../assets/icons/funding-assets.webp")}
                                  alt="spot-trade-icon"
                                />
                                <div>
                                  {t("fundingAssets")}
                                  <span className="primary-nav-arrow mx-2">
                                    <i class="fa-solid fa-arrow-right"></i>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}

                    <span className="das mx-1">|</span>

                    {/* user profile */}
                    <>
                      <h6
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        className=" head-drops cursor-pointer"
                        onClick={handleClick}
                      >
                        {loginCheck ? (
                          // <img
                          //   src={require("../assets/icons/profile_dark.webp")}
                          //   width="30px"
                          //   className="dark_display_none nav-primary-icons"
                          // />
                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-person-circle"></i>
                          </span>
                        ) : (
                          ""
                        )}
                        {/* <img
                          src={require("../assets/profile_dark.png")}
                          className="dark_profile "
                        /> */}
                      </h6>

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

                    <div className="relative">
                      {/* Trigger dropdown on click */}
                      <Link className="contact_button" onClick={toggleDropdown}>
                        <img
                          src={require("../assets/Globe.png")}
                          width="28px"
                          alt="Globe"
                        />
                      </Link>

                      {/* Dropdown menu */}
                      {isDropdownOpen && (
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
                    </div>
                    {/* download */}
                    {/* <Link
                      className="contact_button  nav-primary-icons margin-lr"
                      to="/"
                    >

                      <span className="header-profile-wrap dark_display_none nav-primary-icons mx-1">
                        <i class="bi bi-download"></i>
                      </span>
                    </Link> */}

                    {/* notification bell */}
                    {loginCheck ? (
                      <div class="btn-group more-wrapper">
                        <button
                          class="btn btn-secondary btn-lg dropdown-toggle more-select bell-notify  nav-primary-icons"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          onClick={() => handleBellClick()}
                        >
                          {/* <img
                            src={require("../assets/icons/bell.webp")}
                            className="moons"
                            width="30px"
                          /> */}

                          <span className="header-profile-wrap dark_display_none nav-primary-icons">
                            <i class="bi bi-bell"></i>
                          </span>
                          {hasUnread && <div className="bell-indicator"></div>}
                        </button>

                        <ul class="dropdown-menu notify-dropdown">
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
                    )}
                  </div>
                </Toolbar>
              </AppBar>

              <Drawer
                anchor="left"
                open={mobileMenuOpen}
                onClose={handleMobileMenuClose}
                className={`mobile-drawer ${classes.drawer}`}
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

                  <div className="menu_statis">
                    <ListItem button className="drawa">
                      <Link to="/trade/BTC_USDT">{t("trade")}</Link>
                    </ListItem>
                    <ListItem button className="drawa">
                      <Link to="/market">{t("market")}</Link>
                    </ListItem>
                    <ListItem button className="drawa ">
                      <Link to="/swap">{t("convert")}</Link>
                    </ListItem>
                    <ListItem button className="drawa">
                      <Link to={isAuthenticated ? "/p2p" : "/login"}>
                        {t("p2p")}
                      </Link>
                    </ListItem>
                    {/* <ListItem button className="drawa">
                      <Link to="/staking">Staking</Link>
                    </ListItem> */}
                    {/* <ListItem button className="drawa">
                      <Link to={isAuthenticated ? "/internaltransfer" : "/login"}>
                        {t("internal_transfer")}
                      </Link>
                    </ListItem> */}
                    {/* <ListItem button className="drawa ">
                      <Link to="/internaltransfer">Internal Transfer</Link>
                    </ListItem> 

                    <ListItem button className="drawa ">
                      <Link to="/refferal">Invite and Earn</Link>
                    </ListItem>

                    <ListItem button className="drawa ">
                      <Link to="/airdroptokens">Airdrop</Link>
                    </ListItem>*/}
                    {!loginCheck ? (
                      <>
                        <ListItem button className="drawa ">
                          <Link to="/login">
                            <button className="head-btn px-4">
                              {t("login")}
                            </button>
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/register">
                            <button className="head-btn">
                              {t("register")}
                            </button>
                          </Link>
                        </ListItem>
                      </>
                    ) : (
                      <>
                        <ListItem button className="drawa ">
                          <Link to="/dashboard">{t("dashboard")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/assets">{t("assets")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/spotassets">{t("spotAssets")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/fundingassets">{t("fundingAssets")}</Link>
                        </ListItem>

                        <ListItem button className="drawa ">
                          <Link to="/security">{t("security")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/kyc">{t("identification")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/Checkout">{t("fiat_deposit")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/withdraw">{t("withdrawal")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/deposit">{t("deposit")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/internaltransfer">
                            {t("internal_transfer")}
                          </Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/fundtransfer">{t("fundtranfer")}</Link>
                        </ListItem>
                        {/* <ListItem button className="drawa ">
                          <Link to="/recharge">{t("recharge")}</Link>
                        </ListItem> */}
                        {/* <ListItem button className="drawa ">
                          <Link to="/rewards">My rewards</Link>
                        </ListItem> */}
                        <ListItem button className="drawa ">
                          <Link to="/loginHistory">{t("histories")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <Link to="/support">{t("support")}</Link>
                        </ListItem>
                        <ListItem button className="drawa ">
                          <div className="bor_rep_lgot">
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
