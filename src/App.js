import "./App.css";
import "./style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from "./Pages/Landing";
import Register from "./Pages/Register";
import Verification from "./Pages/Verification";
import Login from "./Pages/Login";
import TFA from "./Pages/TFA";
import FP from "./Pages/FP";
import Phising from "./Pages/Phising";
import Trade from "./Pages/Trade";
import Changepassword from "./Pages/Changepassword";
import EnableTFA from "./Pages/EnableTFA";
import Dashboard from "./Pages/Dashboard";
import { useTranslation } from "react-i18next";
import i18n from "./translate/i18n";
import Staking from "./Pages/Staking";
import Swap from "./Pages/Swap";
import Security from "./Pages/Security";
import Anti_phishing from "./Pages/Anti_phishing";
import Security_change from "./Pages/Security_change";
import Security_2fa from "./Pages/Security_2fa";
import Kyc from "./Pages/Kyc";
import Buycrypto from "./Pages/Buycrypto";
import Assets from "./Pages/Assets";
import SpotAssets from "./Pages/SpotAsset";
import FundingAssets from "./Pages/FundingAssets";
import DepositHistory from "./Pages/DepositHistory";
import Quick_buy from "./Pages/Quick_buy";
import Deposit from "./Pages/Deposit";
import InactivityHandler from "./Pages/inactivity";

import Refferal from "./Pages/Refferal";

import Vieworder from "./Pages/view-order";

import WithdrawTable from "./Pages/WithdrawTable";
import TradeTable from "./Pages/TradeTable";
import LoginTable from "./Pages/LoginTable";
import ReferralTable from "./Pages/ReferralTable";
import StakingTable from "./Pages/StakingTable";
import OrderHisTable from "./Pages/OrderHisTable";
import Rewards from "./Pages/Rewards";
import Market from "./Pages/Market";
import Settings from "./Pages/Settings";
import Withdrawal from "./Pages/Withdrawal";
import Support from "./Pages/Support";
import InternalTransfer from "./Pages/InternalTransfer";
import Bankdetails from "./Pages/Bankdetails";

import P2P from "./Pages/P2P";
import P2PConvert from "./Pages/P2PConvert";
import Payment from "./Pages/Payment";
import DisputeChat from "./Pages/DisputeChat";

import P2PSell from "./Pages/P2PSell";
import PostAd from "./Pages/PostAd";
import FiatDeposit from "./Pages/FiatDeposit";
import Fiat from "./Pages/Fiat";
import { AuthProvider } from "././Pages/AuthContext";
import { removeAuthToken } from "../src/core/lib/localStorage";
import { useEffect } from "react";
import ProcessOrderTable from "./Pages/ProcessOrderTable";
import MyOrdersTable from "./Pages/MyOrdersTable";
import MyHistoryTable from "./Pages/MyHistoryTable";
import SwapHistoryTable from "./Pages/SwapHistoryTable";
import { getMethod } from "./core/service/common.api";
import apiService from "./core/service/detail";
import useState from "react-usestateref";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";
import Airdrop from "./Pages/Airdrop";
import Checkout from "./Pages/FiatChceckout";
import CancelOrderTable from "./Pages/CancelOrderTable";
import StopOrderTable from "./Pages/StopOrderTable";
import RewardsHistory from "./Pages/RewardsHistory";
import InternalTransferHistory from "./Pages/InternalTransferHistory";

import AirdropTokens from "./Pages/AirdropTokens";
import RefundPolicy from "./Pages/RefundPolicy";
import ReturnPolicy from "./Pages/ReturnPolicy";
import AirdropGame from "./Pages/AirdropGame";

import Tradechart from "./Pages/Tradechart";
import PageNotFound from "./Pages/PageNotFound";
import UnderMaintanence from "./Pages/UnderMaintanence";
import FeeSettings from "./Pages/FeeSettings";
import NotificationHistory from "./Pages/NotificationHistory";
import FundTransfer from "./Pages/FundTransfer";
import UserRecharge from "./Pages/UserRecharge";

function App() {
  const [favIconSite, setFaviconSite, favIconSiteref] = useState("");
  useEffect(() => {
    if (window.AOS) {
      window.AOS.init({
        duration: 1000, // Animation duration
        easing: "ease-in-out", // Easing function
        once: true, // Only animate once
      });
    }
    favIcon();
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

    useEffect(() => {
      const onBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = " ";
      };

      window.addEventListener("beforeunload", onBeforeUnload);
      return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, []);
  
  // useEffect(() => {
  //   // Add fake history entry to block back to Google
  //   window.history.pushState({ blocked: true }, "");

  //   const onPopState = (e) => {
  //     const isBlocked = e.state && e.state.blocked;

  //     if (isBlocked) {
  //       const ok = window.confirm("Are you sure you want to leave Pitiklini?");
  //       if (!ok) {
  //         // push back into app
  //         window.history.pushState({ blocked: true }, "");
  //       } else {
  //         // Allow back — user will go to Google
  //         window.history.back();
  //       }
  //     }
  //   };

  //   window.addEventListener("popstate", onPopState);
  //   return () => window.removeEventListener("popstate", onPopState);
  // }, []);

  useEffect(() => {
    // Save the current internal page in session history
    sessionStorage.setItem("current_internal_path", window.location.pathname);

    const handleClick = (event) => {
      const link = event.target.closest("a[href]");
      if (!link) return;

      const nextURL = link.href;
      const currentHost = window.location.host;
      const nextHost = new URL(nextURL).host;

      // Leaving site → show confirm
      if (nextHost !== currentHost) {
        const ok = window.confirm("Are you sure you want to leave Pitiklini?");
        if (!ok) {
          event.preventDefault();
          return false;
        }
      }
    };

    document.addEventListener("click", handleClick);

    const onPopState = () => {
      const storedPath = sessionStorage.getItem("current_internal_path");
      const now = window.location.pathname;

      // If going OUTSIDE your app (back to Google)
      if (now === storedPath) {
        const ok = window.confirm("Are you sure you want to leave Pitiklini?");
        if (!ok) {
          // Stay inside site
          window.history.pushState(null, "", storedPath);
        }
      } else {
        // update path (important!)
        sessionStorage.setItem("current_internal_path", now);
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const favIcon = async () => {
    try {
      const data = { apiUrl: apiService.getSitedata };
      const resp = await getMethod(data);
      if (resp.status === true) {
        setFaviconSite(resp.data.favicon); // Store favicon URL
        setFavicon(resp.data.favicon); // Dynamically set favicon
      }
    } catch (error) {
      console.error("Failed to fetch favicon:", error);
    }
  };

  const setFavicon = (url) => {
    console.log("Setting favicon with URL:", url);
    // Remove any existing favicon element
    const existingFavicon = document.getElementById("favicon");
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Create new link element for favicon
    const link = document.createElement("link");
    link.id = "favicon";
    link.rel = "icon";
    link.href = url;
    document.head.appendChild(link);
  };

  function RequireAuth({ children }) {
    var data = sessionStorage.getItem("user_token");
    return data ? children : removeAuthToken();
  }

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          {/* 🔥 Force browser to treat page as having data (mobile fix) */}
          <input type="hidden" id="dirty-guard" value="1" />
          <ToastContainer />
          <InactivityHandler />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/trade/:pair" element={<Trade />} />
            <Route path="/tradechart/:pair" element={<Tradechart />} />
            <Route path="/p2p/order/:id" element={<Vieworder />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refundpolicy" element={<RefundPolicy />} />
            <Route path="/returnpolicy" element={<ReturnPolicy />} />
            <Route path="/tfa" element={<TFA />} />
            <Route path="/forgotpassword" element={<FP />} />
            <Route path="/*" element={<PageNotFound />} />
            <Route path="/maintanence" element={<UnderMaintanence />} />
            {/* <Route path="/antiphishing" element={<Phising />} /> */}
            <Route
              path="/antiphishing"
              element={
                <RequireAuth>
                  <Phising />
                </RequireAuth>
              }
            />
            <Route
              path="/changepassword"
              element={
                <RequireAuth>
                  <Changepassword />
                </RequireAuth>
              }
            />
            <Route
              path="/enabletfa"
              element={
                <RequireAuth>
                  {" "}
                  <EnableTFA />
                </RequireAuth>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  {" "}
                  <Dashboard />{" "}
                </RequireAuth>
              }
            />
            {/*   <Route
              path="/staking"
              element={
                // <RequireAuth>
                <Staking />
                // </RequireAuth>
              }
            />
            <Route
              path="/refferal"
              element={
                <RequireAuth>
                  {" "}
                  <Refferal />{" "}
                </RequireAuth>
              }
            /> */}
            <Route
              path="/swap"
              element={
                // <RequireAuth>
                <Swap />
                // </RequireAuth>
              }
            />
            <Route
              path="/security"
              element={
                <RequireAuth>
                  {" "}
                  <Security />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/anti-phishing"
              element={
                <RequireAuth>
                  {" "}
                  <Anti_phishing />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/security_change"
              element={
                <RequireAuth>
                  {" "}
                  <Security_change />{" "}
                </RequireAuth>
              }
            />
            {/* <Route path="/security_2fa" element={<Security_2fa />} /> */}
            <Route
              path="/kyc"
              element={
                <RequireAuth>
                  <Kyc />
                </RequireAuth>
              }
            />
            {/* <Route path="/buycrypto" element={<Buycrypto />} /> */}
            <Route
              path="/assets"
              element={
                <RequireAuth>
                  {" "}
                  <Assets />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/spotassets"
              element={
                <RequireAuth>
                  {" "}
                  <SpotAssets />
                </RequireAuth>
              }
            />
            <Route
              path="/fundingassets"
              element={
                <RequireAuth>
                  {" "}
                  <FundingAssets />
                </RequireAuth>
              }
            />
            <Route
              path="/depositHistory"
              element={
                <RequireAuth>
                  {" "}
                  <DepositHistory />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/withdrawHistory"
              element={
                <RequireAuth>
                  {" "}
                  <WithdrawTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/tradeHistory"
              element={
                <RequireAuth>
                  <TradeTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/loginHistory"
              element={
                <RequireAuth>
                  {" "}
                  <LoginTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/swapHistory"
              element={
                <RequireAuth>
                  {" "}
                  <SwapHistoryTable />{" "}
                </RequireAuth>
              }
            />
            {/* <Route
              path="/referralHistory"
              element={
                <RequireAuth>
                  {" "}
                  <ReferralTable />{" "}
                </RequireAuth>
              }
            /> */}
            {/* <Route
              path="/stakingHistory"
              element={
                <RequireAuth>
                  <StakingTable />{" "}
                </RequireAuth>
              }
            /> */}
            <Route
              path="/orderHistory"
              element={
                <RequireAuth>
                  <OrderHisTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/cancelorderHistory"
              element={
                <RequireAuth>
                  <CancelOrderTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/stoporderHistory"
              element={
                <RequireAuth>
                  <StopOrderTable />{" "}
                </RequireAuth>
              }
            />
            {/* <Route
              path="/rewards"
              element={
                <RequireAuth>
                  <Rewards />{" "}
                </RequireAuth>
              }
            /> */}
            {/* <Route
              path="/rewardsHistory"
              element={
                <RequireAuth>
                  <RewardsHistory />{" "}
                </RequireAuth>
              }
            /> */}
            <Route path="/market" element={<Market />} />
            {/* <Route
              path="/settings"
              element={
                <RequireAuth>
                  {" "}
                  <Settings />{" "}
                </RequireAuth>
              }
            /> */}
            <Route
              path="/withdraw"
              element={
                <RequireAuth>
                  {" "}
                  <Withdrawal />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/deposit"
              element={
                <RequireAuth>
                  {" "}
                  <Deposit />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/fundtransfer"
              element={
                <RequireAuth>
                  {" "}
                  <FundTransfer />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/recharge"
              element={
                <RequireAuth>
                  {" "}
                  <UserRecharge />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/support"
              element={
                <RequireAuth>
                  <Support />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/internaltransfer"
              element={
                <RequireAuth>
                  {" "}
                  <InternalTransfer />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/internaltransferhistory"
              element={
                <RequireAuth>
                  {" "}
                  <InternalTransferHistory />{" "}
                </RequireAuth>
              }
            />
            {/* InternalTransferHistory */}
            <Route
              path="/p2p"
              element={
                // <RequireAuth>
                <P2P />
                // </RequireAuth>
              }
            />
            <Route
              path="/processorders"
              element={
                <RequireAuth>
                  {" "}
                  <ProcessOrderTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/myorders"
              element={
                <RequireAuth>
                  {" "}
                  <MyOrdersTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/myhistory"
              element={
                <RequireAuth>
                  {" "}
                  <MyHistoryTable />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/p2pconvert"
              element={
                <RequireAuth>
                  {" "}
                  <P2PConvert />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/p2p/chat/:id"
              element={
                <RequireAuth>
                  {" "}
                  <Payment />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/p2p/dispute/:id"
              element={
                <RequireAuth>
                  {" "}
                  <DisputeChat />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/sell"
              element={
                <RequireAuth>
                  {" "}
                  <P2PSell />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/postad"
              element={
                <RequireAuth>
                  {" "}
                  <PostAd />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/fiat"
              element={
                <RequireAuth>
                  {" "}
                  <Fiat />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/fiatdeposit"
              element={
                <RequireAuth>
                  {" "}
                  <FiatDeposit />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/Paymentmethod"
              element={
                <RequireAuth>
                  <Bankdetails />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <Checkout />{" "}
                </RequireAuth>
              }
            />
            <Route
              path="/fee-settings"
              element={
                <RequireAuth>
                  <FeeSettings />{" "}
                </RequireAuth>
              }
            />

            <Route
              path="/notificationHistory"
              element={
                <RequireAuth>
                  {" "}
                  <NotificationHistory />{" "}
                </RequireAuth>
              }
            />

            {/* <Route
              path="/airdrop"
              element={
                <RequireAuth>
                  <Airdrop />{" "}
                </RequireAuth>
              }
            />
            <Route path="/airdroptokens" element={<AirdropTokens />} />
            <Route
              path="/airdropgame"
              element={
                <RequireAuth>
                  <AirdropGame />
                </RequireAuth>
              }
            /> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
