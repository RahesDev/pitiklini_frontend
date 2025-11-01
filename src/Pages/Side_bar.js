import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header";
import { t } from "i18next";

const Site_bar = () => {
  const [activeLink, setActiveLink] = useState("");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    setActiveLink(path);
  }, [location]);

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
      ].includes(activeLink)
        ? "active-link"
        : "";
    }
    return activeLink === path ? "active-link" : "";
  };

  return (
    <div>
      <div className="col-lg-2">
        <div className="dashboard_pages_list">
          <Link
            to="/dashboard"
            className={`dashboard_title ${isActive("dashboard")}`}
          >
            <img
              src={require("../assets/icons/dashboard_icon.webp")}
              alt="Dashboard"
            />
            <h3>{t("dashboard")}</h3>
          </Link>

          <Link
            to="/security"
            className={`dashboard_title ${isActive("security")}`}
          >
            <img
              src={require("../assets/icons/security.webp")}
              alt="Security"
            />
            <h3>{t("security")}</h3>
          </Link>

          <Link
            to="/fee-settings"
            className={`dashboard_title ${isActive("fee-settings")}`}
          >
            <img
              src={require("../assets/icons/security.webp")}
              alt="Fee Settings"
            />
            <h3>{t("feeSettings")}</h3>
          </Link>

          <Link to="/kyc" className={`dashboard_title ${isActive("kyc")}`}>
            <img
              src={require("../assets/icons/Identification.webp")}
              alt="Identification"
            />
            <h3>{t("identification")}</h3>
          </Link>

          <Link
            to="/Checkout"
            className={`dashboard_title ${isActive("Checkout")}`}
          >
            <img
              src={require("../assets/icons/deposit_icon.webp")}
              alt="Fiat Deposit"
            />
            <h3>{t("fiat_deposit")}</h3>
          </Link>
          <Link
            to="/withdraw"
            className={`dashboard_title ${isActive("withdraw")}`}
          >
            <img
              src={require("../assets/icons/withdraw_icon.webp")}
              alt="Withdrawal"
            />
            <h3>{t("withdrawal")}</h3>
          </Link>

          <Link
            to="/deposit"
            className={`dashboard_title ${isActive("deposit")}`}
          >
            <img
              src={require("../assets/icons/deposit_icon.png")}
              alt="Deposit"
            />
            <h3>{t("deposit")}</h3>
          </Link>
          {/* <Link
            to="/fundtransfer"
            className={`dashboard_title ${isActive("fundtransfer")}`}
          >
            <img
              src={require("../assets/icons/deposit_icon.png")}
              alt="Deposit"
            />
            <h3>{t("fundtranfer")}</h3>
          </Link> */}

          {/* <Link
            to="/rewards"
            className={`dashboard_title ${isActive("rewards")}`}
          >
            <img
              src={require("../assets/icons/my_reward_icon.webp")}
              alt="My Rewards"
            />
            <h3>My Rewards</h3>
          </Link> */}

          <Link
            to="/loginHistory"
            className={`dashboard_title ${isActive("history")}`}
          >
            <img
              src={require("../assets/icons/history_icon.webp")}
              alt="History"
            />
            <h3>{t("history")}</h3>
          </Link>

          <Link
            to="/support"
            className={`dashboard_title ${isActive("support")}`}
          >
            <img src={require("../assets/icons/support.webp")} alt="support" />
            <h3>{t("support")}</h3>
          </Link>

          {/* <Link to="/settings" className={`dashboard_title ${isActive('settings')}`}>
            <img src={require("../assets/Settings_icon.png")} alt="Settings" />
            <h3>Settings</h3>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Site_bar;
