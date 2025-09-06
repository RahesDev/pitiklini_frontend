const service = {
  // signup: "users/register",
  emailotpverify: "users/emailotpverify",
  createchekout: "users/create-checkout-session",
  updatecheckout: "users/update-payment-status",
  resendCode: "users/resendCode",
  // signin: "users/login",
  logout: "users/logout",
  getContent: "adminapi/getContent",
  changepswdlink: "users/changepswdlink",
  verifyForgotpasslink: "users/verifyForgotpasslink",
  // resetpassword: "users/forgotpassword",
  profileUpdate: "/user/profileAdd",
  update_profile: "users/update_profile",
  getuserProfile: "users/getUserProfile",
  getUserDetails: "users/getUserDetails",
  getrewardsinfo: "users/getrewardsinfo",
  getKYCreward: "users/getKYCreward",
  getDepositreward: "users/getDepositreward",
  getTradereward: "users/getTradereward",
  getCurrencieslanding: "users/getCurrencieslanding",

  getUserP2PDetailss: "p2p/getUserP2PDetailss",

  UpdateProfile: "users/UpdateProfile",
  forgotemailotp: "users/forgotemailotp",
  forgototpverify: "users/forgototpverify",
  resendemailotp: "users/resendemailotp",

  mobilenumberupdate: "users/mobilenumberupdate",
  emailupdate: "users/emailupdate",
  getnotification: "users/getnotification",
  notifyStateChange: "users/notifyStateChange",
  getp2pnotification: "p2p/getp2pnotification",

  getSessionHisotry: "users/getSessionHisotry",
  getReferralHisotry:"referral/getReferalHistories",
  getKYC: "kyc/getkyc",
  savebankdetails: "users/savebankdetails",
  savekyc: "kyc/savekyc",
  Bankdetails: "users/submit_bankdetails",
  updateBankdetails: "p2p/updateBankdetails",
  p2p_get_order: "p2p/p2p_get_order",


  Getbankdetails: "p2p/Get_bankdetails",
  // defaultBanks:"user/defaultBanks",
  // generateAddress: "address/getUserAddress",
  generateAddress: "address/generateAddress",
  UserwalletBalance: "address/UserwalletBalance",
  submitWithdraw: "withdraw/withdraw_submit",
  withdrawProcess: "withdraw/process",
  confirmWithdraw: "withdraw/withdraw_user_action",
  bankwire: "users/getbankwire",
  fiatdepositSubmit: "withdraw/fiatdeposit_submit",
  createdSupport: "support/create_ticket",
  findedSupport: "support/ticket_list",
  // getP2Pcurrency: "p2p/p2p_currencies",
  p2pOrder: "p2p/postAddOrder",
  p2pGetOrder: "p2p/getAllp2pOrder",
  p2pGetOrderBefore: "p2p/getAllp2pOrderbefore",
  getp2pOrder: "p2p/getp2pOrder",
  getdispute: "p2p/get_dispute",
  updatedispute: "p2p/update_dispute_status",

  p2pchat: "p2p/p2p_chat/",
  adminp2pchat: "adminapi/p2p_chat",


  getp2pchat: "p2p/getp2pchat/",
  getdisputechat: "p2p/get_dispute_chat",

  addbankdetails: "p2p/bankdetails",
  getsocketoken: "p2p/getsocketoken/",
  buyer_confirm: "p2p/buyer_confirm_payment/",
  seller_confirm: "p2p/seller_coin_confirm",
  buyer_cancel: "p2p/buyer_cancel/",
  seller_cancel: "p2p/seller_cancel",
  submitfiatWithdraw: "withdraw/fiatwithdraw_submit",
  p2pOrders: "p2p/myOrders",
  getnotifyOrder: "p2p/getnotifyOrder/",

  antiphishingcode: "users/antiphishingcode",
  verificationOtp: "users/verificationOtp",
  changeAntiPhising: "users/changeAntiPhising",
  antiResendotp: "users/antiResendotp",
  findDetails: "users/findDetails",

  getCurrpairData: "trade/getCurrpairData",
  addfavpairs: "trade/addfavpairs",
  getfavpairs: "trade/getfavpairs",


  getmarketData: "trade/getmarketData",


  getUserTotalbalance: "users/getUserTotalbalance",
  getUserTotalbalanceAll: "users/getUserTotalbalanceAll",
  getUserBalance: "users/getUserBalance",
  getparUserBalance: "trade/getparUserBalance",
  orderPlaceapi: "orderPlaceApi/orderPlace",
  addBank: "/user/addBank",
  getBank: "/user/getBank",
  defaultBanks: "users/defaultBankChoose",
  deletbankDetails: "p2p/deletbankDetails",
  savekyc_address: "/kyc/savekyc_Address",
  userLoginHistory: "/user/getLoginHistory",
  p2pCompareAPI: "p2p/cryptoCompare",
  buy_sell_Express: "p2p/buy_sell_Express_api",
  // changePassword: "users/changePassword",
  // getTfaDetials: "users/",
  changeTfaStatus: "users/changeTfaStatus",
  // tfaVerify: "users/tfa_login",
  // getBalance: "/user/getAllBalances",
  getBalancestake: "staking/getbalance",
  checkwallet: "/checkwallet",
  transactionHistory: "/withdraw/transactionHistory",
  resetPass: "/user/retetPassword",
  forgotepassword: "/user/forgotepassword",
  notifications: "p2p/notifications",
  p2pMyorders: "/p2p/p2pMyorders",
  p2pExpress: "/p2p/p2pExpressOrders",
  getSupportData: "/adminapi/support_category_list",
  terms: "adminapi/terms",
  createSupport: "/user/create_ticket",
  get_Ticket: "/user/get_Ticket",
  updateTickets: "/user/updateTicket",
  viewChat: "/user/viewChat",
  closeTicket: "support/closeTicket",
  pairbycurrency: "adminapi/tradepair/viewbycurrency",
  allpair: "adminapi/tradepair/viewall",
  ticket_close: "adminapi/ticket_close",

  fetch_tickers: "users/fetch_tickers",
  withdraw_history: "withdraw/withdraw_history",
  Tfa_History: "users/Tfa_History",
  deposit_history: "withdraw/get_user_deposit",
  getActiveOrders: "users/getActiveOrders",
  getStop_limit_Orders: "users/getStop_limit_Orders",
  marketTrades: "marketTrades/getMarketTrades",
  tradeHistory: "users/tradeHistory",
  getCancelOrders: "users/getCancelOrders",
  getCurrency: "users/getcurrency",
  // getSiteDatas: "adminapi/get_sitedata",
  getStatkingDetails: "staking/getStatkingDetails",
  getUserBalanceAll: "withdraw/getUserBalanceStaking",
  confirmStaking: "staking/confirmStaking_user",
  getAllstakingHistory: "staking/getAllstakingHistory",
  getFixedstakingHistory: "staking/getFixedstakingHistory",
  getFlexiblestakingHistory: "staking/getFlexiblestakingHistory",
  getStakingTotal: "staking/getStakingTotal",
  claimNowapi: "staking/claimNowapi",
  submitForm: "launchPad/submitForm",
  getAllLaunchpad: "launchPad/getAllLaunchpad",
  getTokenDetails: "launchPad/getTokenDetails",
  launchPadcurrency: "launchPad/launchPadcurrency",

  portfolio_balancestake: "users/portfolio_balancestake",

  getUSDTBalance: "launchPad/getUSDTBalance",
  getOneLaunchpad: "launchPad/getOneLaunchpad",
  getCurrencyConvertion: "launchPad/getCurrencyConvertion",
  tokenPurchase: "launchPad/tokenPurchase",
  lauchPadHistory: "launchPad/lauchPadHistory",
  cancelOrder: "orderCancelApi/cancelOrder",
  claimNowapiFlexible: "staking/claimNowapiFlexible",
  portfolioBalance: "users/portfolio_user_balance",
  transfer_balance: "users/transfer_balance",
  currency_list: "users/currency_list",
  p2p_confirm_order: "p2p/p2p_confirm_order",
  p2p_confirm_sellorder: "p2p/p2p_confirm_sellorder",
  p2p_confirm_check: "p2p/p2p_confirm_check",
  p2pHistory: "p2p/p2p_history",
  getP2Pbalance: "p2p/p2p_balance",
  getKYCDetails: "kyc/getKYCDetails",
  savebank: "kyc/savekyc",
  raise_dispute: "p2p/dispute_order",
  confirmp2porder: "p2p/p2p_check_confirm",
  fetch_price: "p2p/fetch_price",
  getp2pBalance: "p2p/getp2pBalance",
  viewp2pOrder: "p2p/viewp2pOrder/",
  cancelConfirmBuy: "p2p/cancel_confirm_order",
  cancelConfirmSell: "p2p/cancel_confirmorder_sell",
  readNotify: "p2p/read_notify",
  update_p2p: "p2p/update_order",
  buyer_pay_cancel: "p2p/buyer_pay_cancel",
  p2pProcessOrders: "p2p/processOrders",
  contact: "users/contact_us",
  walletcurrency: "withdraw/get_currency_list",
  stripeWallet: "withdraw/api/create-checkout-session",
  findDeposit: "withdraw/findDeposit",
  user_balance: "withdraw/user_balance",
  getStopOrders: "users/getStopOrders",
  getKYCStatus: "users/kycStatus",
  getnotifications: "users/notifications",
  getnotificationsAll: "users/getnotificationsAll",
  updateNotifyRecord: "users/updateNotifyRecord",
  supportCategories: "support/get_support_category",
  signup_mobile: "users/register_mobile",
  mobileotpverify: "users/mobileotpverify",
  resendsmsCode: "users/resendsmsCode",

  signin_mobile: "users/login_mobile",
  changepswdlink_mobile: "users/changepswdlink_mobile",
  resetpassword_mobile: "users/forgotpassword_mobile",
  getUserBalanceSwap: "withdraw/getUserBalanceSwap",
  getCurrenciesDatas: "withdraw/getCurrenciesDatas",
  // currencyConversion: "swap/currencyConversion",
  swapping: "swap/swapping",
  swappingHistory: "swap/swappingHistory",
  getSupportDetails: "support/getSupportDetails",
  addUserSupport: "support/supportList/update",
  // closeTicket: "support/closeTicket",
  generateAddress_network: "address/getUserAddress_network",
  send_otp: "withdraw/send_withdraw_otp",
  fieldValidate: "withdraw/fieldvalidate",

  // getReward: "users/getReward",
  getReward: "referral/getReferal",
  getReferralRewards: "referral/getReferralRewards",
  getbeforedayReward: "users/getbeforedayReward",
  gettodayReward: "users/gettodayReward",
  referralHistory: "users/referralHistory",
  // homeCurrency: "users/homecurrency",
  homeCurrency: "users/get_market_page",
  get_p2p_active_currency: "users/get_p2p_active_currency",
  currencyConversion: "users/currencyConversion",
  // transaction: "users/getTransaction",
  transaction: "users/get_deposit_list",
  Addaddress: "users/Addaddress",
  getAddress: "users/getAddress",
  removeAddress: "users/removeAddress",
  mobile_currency_network: "address/mobile_currency_network",
  earningHistory: "users/earningHistory",
  stakingHistory_fixed: "staking/stakingHistory_fixed",
  stakingHistory_flexible: "staking/stakingHistory_flexible",
  stakingHistory_yield: "staking/stakingHistory_yield",
  yieldcalculation: "staking/yieldcalculation",
  claimNow_yield: "staking/claimNowapi_yield",


  //Home page Wrtten Jothi

  home_currency: "users/home_currency",
  toplosers: "users/toplosers",
  topgainers: "users/topgainer",
  hotPairs: "users/hotPairs",
  newPairs: "users/newPairs",
  test: "users/test",


  addSubscriber: "users/addSubscriber",

  //UnionRamp ---------------------

  onRamp: 'users/onRamp',
  Supportedfiat: 'users/Supportedfiat',
  Supportedcrypto: 'users/Supportedcrypto',
  marketprices: 'users/marketprices',
  buycrypto: 'users/buycrypto',

  //launchpad
  purchaseToken: "launchPad/purchaseToken",
  launchpad_history: "launchPad/launchpad_history",
  claimlaunchtoken: "launchPad/claimlaunchtoken",


  //login
  signup: "onboarding/onboardingUser",
  signin: "onboarding/login",
  getTfaDetials: "onboarding/getQRCode",
  changePassword: "onboarding/changePassword",
  resetpassword: "onboarding/forgotpassword",
  tfaVerify: "onboarding/tfaLogin",

  //kyc
  kycUpload: "kyc/savekyc",
  kycStripe: "kyc/create-verification-session",

  //internal transfer
  walletTransfer: "swap/walletTransfer",

  //P2P Endpoints   
  getP2Pcurrency: "p2p/p2p_currencies",


  // STAKKING NEW CODE
  get_staking_details: "staking/get_staking_details",
  get_stake_profit: "staking/get_stake_profit",

  // Assets 
  balanceOverallBalance: "users/balanceOverallBalance",

  //sitedatas
  getSitedata: "adminapi/getsitesettings",

  //wallet create
  walletAddUpdate: 'users/walletAddUpdate',

  //verfiy token
  verifyToken: "users/verifyToken",

  //Airdrop
  quizSubmit: "users/quizSubmit",
  quizLeaderboard: "users/getLeaderboardData",
  getAirdropStart: "users/getAirdropStart",
  getAirdropSetting: "users/getAirdropSetting",
  getUserStatus: "users/getUserStatus",
  dropEndaction: "users/dropEndaction",
  claimairdropreward: "users/claimairdropreward",
  getAirdropInfo: "users/getAirdropInfo",

  //reward history
  getUserRewards: "users/getRewardHistory",

  //security-Anti
  anti_status_check: "users/Anti_status_check",
  anti_status_change: "users/Anti_status_change",

  transferHistoryUser: "users/transferHistoryUser",
  payment_history: "users/payment_history",
  get_p2p_payments: "p2p/get_p2p_payments",

  fee_settings_change: "users/fee_settings_change",

  payment_methods: "users/payment_methods",
  getnotificationHistory: "users/getnotificationHistory"

};

export default service;
