import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Tooltip } from "@mui/material";
import { getMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { removeAuthToken } from "../core/lib/localStorage";
import Avatar from "../assets/svg/avatar.svg";

const Side_bar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [profileData, setprofileData] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true",
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActiveLink(path || "dashboard");
    getProfile();

    const historyLinks = [
      "loginHistory",
      "depositHistory",
      "withdrawHistory",
      "internaltransferhistory",
      "swapHistory",
      "orderHistory",
      "cancelorderHistory",
      "tradeHistory",
      "NotificationHistory",
    ];

    if (historyLinks.includes(path)) setIsHistoryOpen(true);
  }, [location]);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", newState);
  };

  const getProfile = async () => {
    try {
      var data = {
        apiUrl: apiService.getUserDetails,
      };
      var resp = await getMethod(data);
      if (resp.status === true) {
        setprofileData(resp.Message);
      }
    } catch (error) {
      console.error("Failed to fetch profile in Side_bar", error);
    }
  };

  const isActive = (path) => {
    if (path === "history") {
      return [
        "loginHistory",
        "depositHistory",
        "withdrawHistory",
        "internaltransferhistory",
        "swapHistory",
        "orderHistory",
        "cancelorderHistory",
        "tradeHistory",
        "NotificationHistory",
      ].includes(activeLink);
    }
    return activeLink === path;
  };

  const handleLogout = () => {
    removeAuthToken();
    sessionStorage.clear();
    navigate("/login");
  };

  const menuClass = (path) =>
    `group relative flex items-center gap-3 p-4 h-[56px] rounded-lg transition-all duration-200 ${
      isActive(path)
        ? "bg-[#1C1E24] text-white border-l-4 border-primary shadow-lg"
        : "text-primary hover:bg-[#1C1E24]"
    } ${isCollapsed ? "justify-center px-4" : "justify-start pl-6"} hover:z-[100]`;

  const submenuLinkClass = (active) =>
    `group relative flex items-center p-2 rounded-lg transition-all duration-200 ${
      active
        ? "text-white font-medium bg-[#23262F]"
        : "text-primary hover:text-white"
    } ${isCollapsed ? "justify-center px-4 scale-90 opacity-80 hover:opacity-100" : "pl-12"} hover:z-[100]`;

  // Custom styling for MUI tooltips to match the theme
  const tooltipProps = {
    componentsProps: {
      tooltip: {
        sx: {
          bgcolor: "#1C1E24",
          color: "#BD7F10",
          border: "1px solid #BD7F10",
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: "IBM Plex Sans",
          padding: "8px 14px",
          borderRadius: "8px",
          "& .MuiTooltip-arrow": {
            color: "#1C1E24",
            "&::before": {
              border: "1px solid #BD7F10",
              backgroundColor: "#1C1E24",
            },
          },
        },
      },
    },
  };

  return (
    <div
      className={`relative h-full bg-[#18191D] rounded-[16px] flex flex-col shadow-2xl z-20 transition-all duration-300 ${
        isCollapsed ? "w-[86px]" : "w-[250px]"
      }`}
    >
      {/* Toggle Arrow - Positioned outside to avoid clipping */}
      <div
        onClick={toggleSidebar}
        className={`absolute w-6 h-10 bg-[#353945] rounded-[6px] flex items-center justify-center cursor-pointer z-[1001] shadow-md transition-all duration-300 ${
          isCollapsed ? "left-[74px] top-[26px]" : "left-[238px] top-[26px]"
        }`}
      >
        <i
          className={`text-[#777E90] text-lg ${isCollapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"}`}
        ></i>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 pb-10 flex flex-col">
        {/* 🔝 Top Container - Profile */}
        <div
          className={`flex flex-col gap-6 mx-auto flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "w-full items-center" : "w-[212px]"
          }`}
        >
          <div className="relative flex items-center gap-3 py-2 w-full">
            <div className="w-[56px] h-[56px] rounded-full border-2 border-[#23262F] overflow-hidden flex items-center justify-center bg-[#23262F] flex-shrink-0">
              <img
                src={Avatar}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = require("../assets/icons/profile_dark.webp");
                }}
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-1 text-[12px] text-primary font-ibm">
                  <span className="opacity-100">{t("hey")}</span>
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                </div>
                <div className="text-[14px] text-[#D6D8E0] font-medium font-ibm truncate">
                  {profileData.displayname || "User Name"}
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="border-t border-[#353945] w-full"></div>
          )}
        </div>

        {/* Sidebar Pages */}
        <div
          className={`my-4 flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "w-full" : "w-[212px] mx-auto"
          }`}
        >
          <div
            className={`flex flex-col gap-1 ${isCollapsed ? "items-center" : ""}`}
          >
            {/* Dashboard */}
            <Tooltip
              title={isCollapsed ? t("dashboard") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/dashboard" className={menuClass("dashboard")}>
                <i className="ri-home-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">{t("dashboard")}</span>
                )}
              </Link>
            </Tooltip>

            {/* Asset */}
            {/* <Tooltip title={isCollapsed ? "Asset" : ""} placement="right" arrow {...tooltipProps}> */}
            {/* <Link to="/asset" className={menuClass("asset")}> */}
            {/* <Link to="/spotassets" className={menuClass("asset")}>
                <i className="ri-wallet-3-line text-[24px]"></i>
                {!isCollapsed && <span className="text-[16px] font-ibm">Asset</span>}
              </Link>
            </Tooltip> */}

            {/* Security */}
            <Tooltip
              title={isCollapsed ? t("security") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/security" className={menuClass("security")}>
                <i className="ri-shield-check-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">{t("security")}</span>
                )}
              </Link>
            </Tooltip>

            {/* Fee Setting */}
            <Tooltip
              title={isCollapsed ? t("feeSettings") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/fee-settings" className={menuClass("fee-settings")}>
                <i className="ri-settings-3-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">
                    {t("feeSettings")}
                  </span>
                )}
              </Link>
            </Tooltip>

            {/* Identification */}
            <Tooltip
              title={isCollapsed ? t("identification") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/kyc" className={menuClass("kyc")}>
                <i className="ri-user-search-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">
                    {t("identification")}
                  </span>
                )}
              </Link>
            </Tooltip>

            {/* Deposit */}
            <Tooltip
              title={isCollapsed ? t("deposit") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/deposit" className={menuClass("deposit")}>
                <i className="ri-download-2-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">{t("deposit")}</span>
                )}
              </Link>
            </Tooltip>

            {/* Withdrawal */}
            <Tooltip
              title={isCollapsed ? t("withdrawal") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/withdraw" className={menuClass("withdraw")}>
                <i className="ri-upload-2-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">
                    {t("withdrawal")}
                  </span>
                )}
              </Link>
            </Tooltip>

            {/* Fiat Deposit */}
            <Tooltip
              title={isCollapsed ? t("fiat_deposit") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/Checkout" className={menuClass("Checkout")}>
                <i className="ri-bank-card-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">
                    {t("fiat_deposit")}
                  </span>
                )}
              </Link>
            </Tooltip>

            {/* History Dropdown */}
            <div className="flex flex-col w-full">
              <Tooltip
                title={isCollapsed ? t("history") : ""}
                placement="right"
                arrow
                {...tooltipProps}
              >
                <div
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className={menuClass("history")}
                >
                  <div
                    className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <i className="ri-history-line text-[24px]"></i>
                    {!isCollapsed && (
                      <span className="text-[16px] font-ibm">
                        {t("history")}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <i
                      className={`ml-auto ri-arrow-${isHistoryOpen ? "up" : "down"}-s-line text-[#777E90]`}
                    ></i>
                  )}
                  {isCollapsed && isHistoryOpen && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(189,127,16,0.8)]"></div>
                  )}
                </div>
              </Tooltip>

              {isHistoryOpen && (
                <div
                  className={`flex flex-col gap-1 mt-1 pb-2 transition-all duration-300 ${isCollapsed ? "items-center bg-[#1C1E24]/30 rounded-lg py-2 mx-2" : ""}`}
                >
                  <Tooltip
                    title={isCollapsed ? t("login") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/loginHistory"
                      className={submenuLinkClass(
                        activeLink === "loginHistory",
                      )}
                    >
                      <i className="ri-login-box-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("login")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("trade") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/tradeHistory"
                      className={submenuLinkClass(
                        activeLink === "tradeHistory",
                      )}
                    >
                      <i className="ri-line-chart-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("trade")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("deposit") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/depositHistory"
                      className={submenuLinkClass(
                        activeLink === "depositHistory",
                      )}
                    >
                      <i className="ri-wallet-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("deposit")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("withdraw") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/withdrawHistory"
                      className={submenuLinkClass(
                        activeLink === "withdrawHistory",
                      )}
                    >
                      <i className="ri-bank-card-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("withdraw")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("internal_transfer") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/internaltransferhistory"
                      className={submenuLinkClass(
                        activeLink === "internaltransferhistory",
                      )}
                    >
                      <i className="ri-exchange-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("internal_transfer")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("convert") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/swapHistory"
                      className={submenuLinkClass(activeLink === "swapHistory")}
                    >
                      <i className="ri-arrow-left-right-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("convert")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("openOrder") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/orderHistory"
                      className={submenuLinkClass(
                        activeLink === "orderHistory",
                      )}
                    >
                      <i className="ri-file-list-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("openOrder")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("closeOrder") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/cancelorderHistory"
                      className={submenuLinkClass(
                        activeLink === "cancelorderHistory",
                      )}
                    >
                      <i className="ri-close-circle-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("closeOrder")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <Tooltip
                    title={isCollapsed ? t("notification") : ""}
                    placement="right"
                    arrow
                    {...tooltipProps}
                  >
                    <Link
                      to="/NotificationHistory"
                      className={submenuLinkClass(
                        activeLink === "NotificationHistory",
                      )}
                    >
                      <i className="ri-notification-line text-[20px] flex-shrink-0"></i>
                      {!isCollapsed && (
                        <span className="text-[14px] font-ibm ml-3">
                          {t("notification")}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                </div>
              )}
            </div>

            {/* Support */}
            <Tooltip
              title={isCollapsed ? t("support") : ""}
              placement="right"
              arrow
              {...tooltipProps}
            >
              <Link to="/support" className={menuClass("support")}>
                <i className="ri-customer-service-2-line text-[24px]"></i>
                {!isCollapsed && (
                  <span className="text-[16px] font-ibm">{t("support")}</span>
                )}
              </Link>
            </Tooltip>
          </div>
        </div>

        {/* 底部 Container - Fixed height portion */}
        <div
          className={`flex flex-col gap-6 mx-auto pb-4 flex-shrink-0 pt-4 border-t border-[#353945] mt-auto transition-all duration-300 ${
            isCollapsed ? "w-full items-center" : "w-[212px]"
          }`}
        >
          {/* Quick Access */}
          <div
            className={`flex flex-col gap-3 w-full ${isCollapsed ? "items-center" : ""}`}
          >
            {!isCollapsed && (
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-[#777E90] font-ibm">
                  {t("quickAccess")}
                </span>
                <i className="ri-edit-line text-[16px] text-[#777E90] cursor-pointer"></i>
              </div>
            )}
            <div
              className={`bg-[#1C1E24] rounded-lg p-4 flex items-center transition-all duration-300 ${
                isCollapsed ? "flex-col gap-4 px-2" : "justify-between px-4"
              }`}
            >
              <Tooltip
                title={isCollapsed ? t("notification") : ""}
                placement="right"
                arrow
                {...tooltipProps}
              >
                <Link to="/NotificationHistory" className="group relative">
                  <i className="ri-notification-3-line text-primary text-[20px]"></i>
                </Link>
              </Tooltip>
              <Tooltip
                title={isCollapsed ? t("security") : ""}
                placement="right"
                arrow
                {...tooltipProps}
              >
                <Link to="/security" className="group relative">
                  <i className="ri-shield-check-line text-primary text-[20px]"></i>
                </Link>
              </Tooltip>
              <Tooltip
                title={isCollapsed ? t("dashboard") : ""}
                placement="right"
                arrow
                {...tooltipProps}
              >
                <Link to="/dashboard" className="group relative">
                  <i className="ri-user-line text-primary text-[20px]"></i>
                </Link>
              </Tooltip>
              <Tooltip
                title={isCollapsed ? t("support") : ""}
                placement="right"
                arrow
                {...tooltipProps}
              >
                <Link to="/support" className="group relative">
                  <i className="ri-book-read-line text-primary text-[20px]"></i>
                </Link>
              </Tooltip>
            </div>
          </div>

          {/* Log Out */}
          <Tooltip
            title={isCollapsed ? t("logout") : ""}
            placement="right"
            arrow
            {...tooltipProps}
          >
            <div
              onClick={handleLogout}
              className={`group relative flex items-center justify-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-all duration-200 ${
                isCollapsed ? "flex-col" : "justify-start pl-6"
              }`}
            >
              <i className="ri-logout-box-r-line text-[20px]"></i>
              {!isCollapsed && (
                <span className="text-[14px] font-ibm font-normal">
                  {t("logout")}
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
export default Side_bar;
