import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { t } from "i18next";

const Terms = () => {
  return (
    <>
      <main className="fidex_landing_main">
        <section>
          <Header />
        </section>
        <section className="fidex_hero_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="terms-container">
                  <h5 className="mb-5">{t("TermsandConditions")}</h5>
                  <h6>{t("EffectiveDate")}: 31.8.2024</h6>
                  <div>
                    <ol>
                      {/* Introduction */}
                      <li className="policy-sub-heading"></li>
                      <p>{t("welcome")}</p>
                      {/* definition */}
                      <li className="policy-sub-heading">{t("Definitions")}</li>
                      <ul>
                        <li>
                          <span className="policy-bold"> {t("User")}: </span>
                          {t("entity")}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t("Services")} ;{" "}
                          </span>
                          {t("financial")}
                        </li>
                        <li>
                          <span className="policy-bold"> {t("Account")}: </span>
                          {t("personaccount")}
                        </li>
                      </ul>
                      {/* user eligibility */}
                      <li className="policy-sub-heading">
                        {t("UserEligibility")}
                      </li>
                      <p>{t("legal-capable")}</p>
                      {/*  Account Registration*/}{" "}
                      <li className="policy-sub-heading">
                        {t("AccountRegistration")}
                      </li>
                      <p>{t("lgconten1")}</p>
                      {/*   Use of the Platform*/}{" "}
                      <li className="policy-sub-heading">
                        {t("UseofthePlatform")}
                      </li>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {t("AuthorizedUse")}:{" "}
                          </span>
                          {t("lgcontent2")}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t("ProhibitedActivities")} :{" "}
                          </span>
                          {t("lgcontent3")}
                        </li>
                      </ul>
                      {/* Trading and Transactions*/}{" "}
                      <li className="policy-sub-heading">
                        {t("TradinandTransactions")}
                      </li>{" "}
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {t("ExecutionTrades")}:{" "}
                          </span>
                          {t("lg4")}
                        </li>
                        <li>
                          <span className="policy-bold">{t("Fees")}: </span>
                          {t("lg45")}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t("NoGuaranteeReturns")}:{" "}
                          </span>
                          {t("lg6")}
                        </li>
                      </ul>{" "}
                      {/*  Risk Disclosure*/}{" "}
                      <li className="policy-sub-heading">{t("Risk Disclosure")}</li>{" "}
                      <p>{t("lg7")}</p>
                      {/*  Privacy and Data Protection*/}{" "}
                      <li className="policy-sub-heading">
                        {t("PrivacyProtection")}
                      </li>{" "}
                      <p>{t("lg8")}</p>
                      {/*  Intellectual Property */}
                      <li className="policy-sub-heading">
                        {t("Intellectual Property")}
                      </li>{" "}
                      <p>{t("lg9")}</p>
                      {/*  Limitation of Liability*/}
                      <li className="policy-sub-heading">
                        {t("LimitationofLiability")}
                      </li>{" "}
                      <p>{t("lg10")}</p>
                      {/*  Indemnification*/}
                      <li className="policy-sub-heading">
                        {t("Indemnification")}
                      </li>{" "}
                      <p>{t("lg11")}</p>
                      {/*   Amendments*/}
                      <li className="policy-sub-heading">{t("Amendments")}</li>{" "}
                      <p>{t("lg12")}</p>
                      {/*   Termination*/}
                      <li className="policy-sub-heading">{t("Termination")}</li>{" "}
                      <p>{t("lg13")}</p>
                      {/*   Governing Law*/}
                      <li className="policy-sub-heading">{t("GoverningLaw")}</li>{" "}
                      <p>{t("lg14")}</p>
                      {/*    Dispute Resolution*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t("DisputeResolution")}
                      </li>{" "}
                      <p>{t("lg15")}</p>
                      {/*   Contact Information*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t("ContactInformation")}
                      </li>{" "}
                      <p>{t("lg16")}</p>
                      <div>
                        <span className="policy-sub-heading">{t("Email")} : </span>{" "}
                        <span className="terms-email">
                          {t("pitiklini@gmail.com")}
                        </span>
                      </div>
                      {/* <div className="terms-address">
                        <span className="policy-sub-heading">Address : </span>{" "}
                        <p className="policy-terms-ad">
                        PITIKLINI NETWORKING PRIVATE LIMITED. <br /> 45 - A,
                          Main Road, Arunachalapuram, <br /> Vickramasingapuram,{" "}
                          <br />
                          Ambasamudram, Tirunelveli- 627425, <br /> Tamil Nadu –
                          India.
                        </p>
                      </div> */}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="footer_section">
          <Footer />
        </section>
      </main>
    </>
  );
};

export default Terms;
