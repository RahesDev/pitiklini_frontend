import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useTranslation } from "react-i18next";
const ReturnPolicy = () => {
  const { t } = useTranslation();
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
                  <h5 className="mb-5">{t('ReturnPolicy')}</h5>
                  <h6>{t('EffectiveDate')}</h6>
                  <div>
                    <ol>
                      {/* Introduction */}
                      <li className="policy-sub-heading">{t('introduction')}</li>
                      <p>
                        {t('Welcometopiti')}
                      </p>
                      {/*Scope of Policy*/}
                      <li className="policy-sub-heading">{t('ScopeofPolicy')}</li>
                      <p>{t('ThisReturnPolicy')}</p>
                      <ul>
                        <li>
                          <span className="policy-bold">{t('TradingFees')} </span>
                          {t('Feescharged')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('SubscriptionFees')}:{" "}
                          </span>
                          {t('Feesfor')}
                        </li>
                      </ul>
                      {/* Refunds for Trading Fees*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('RefundsforTrading')}
                      </li>
                      <ul>
                        <li>
                          <span className="policy-bold"> {t('NoRefunds')} </span>
                          {t('Onceaatradeisexecuted')}
                        </li>
                      </ul>
                      {/*Refunds for Subscription Fees*/}
                      <li className="policy-sub-heading">
                        {t('RefundsSubscription')}
                      </li>
                      <ul>
                        <li>
                          <span className="policy-bold">{t('TrialPeriod')} </span>
                          {t('Ifyouaresubscribed')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('Monthly/Annual')}:{" "}
                          </span>
                          {t('Forsubscription')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('MonthlySubscriptions')}:{" "}
                          </span>
                          {t('Youmayrequest')}
                        </li>
                      </ul>{" "}
                      {/*Incorrect Transactions*/}
                      <li className="policy-sub-heading">
                        {t('IncorrectTransactions')}
                      </li>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {t('ErrorResolution')}:{" "}
                          </span>
                          {t('Ifyoubelieve')}
                        </li>
                      </ul>{" "}
                      {/* Cancellation and Refund Requests*/}
                      <li className="policy-sub-heading">
                        {t('Cancellation')}
                      </li>
                      <h6>{t('Torequestorc')}</h6>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {t('ContactCustomerSupport')}{" "}
                          </span>
                          {t('Submitarequest')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('ReviewandProcessing')}{" "}
                          </span>
                          {t('wewillreview')}
                        </li>
                      </ul>{" "}
                      {/*  Account Termination*/}
                      <li className="policy-sub-heading">
                        {t('AccountTermination')}
                      </li>
                      <p>
                        {t('Ifyouchooset')}
                      </p>
                      {/* Changes to the Return Policy*/}
                      <li className="policy-sub-heading">
                        {t('Changes')}
                      </li>
                      <p>
                        {t('Wereserve')}
                      </p>
                      {/*   Contact Information*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('ContactInformation')}
                      </li>{" "}
                      <p>
                        {t('foranyques')}
                      </p>
                      <div>
                        <span className="policy-sub-heading">{t('email_label')}: </span>{" "}
                        <span className="terms-email">
                          {t('pitiklini@gmail.com')}
                        </span>
                      </div>
                      {/* <div className="terms-address">
                        <span className="policy-sub-heading">Address: </span>{" "}
                        <p className="policy-terms-ad">
                        Pitiklini NETWORKING PRIVATE LIMITED. <br /> 45 - A,
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

export default ReturnPolicy;
