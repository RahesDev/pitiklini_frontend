import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useTranslation } from "react-i18next";

const Privacy = () => {
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
                  <h5 className="mb-5">{t('privacyPolicy')}</h5>
                  <h6>{t('effectiveDate')} 31.8.2024</h6>
                  <div>
                    <ol>
                      {/* Introduction */}
                      <li className="policy-sub-heading">{t('introduction')}</li>
                      <p>
                        {t('welcometoPitiklini')}
                      </p>{" "}
                      {/*  Information We Collect */}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('informationWeCollect')}
                      </li>
                      <p>
                        {t('wemaycollect')}
                      </p>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {t('contactInformation')}{" "}
                          </span>
                          {t('nameemail')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('accountInformation')}{" "}
                          </span>
                          {t('usernamepassword')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('financialInformation')}{" "}
                          </span>
                          {t('paymentdetailstransaction')}
                        </li>
                        <li>
                          <span className="policy-bold">{t('usageData')} </span>
                          {t('informationabouthoyou')}
                        </li>
                        <li>
                          <span className="policy-bold">{t('technicalData')} </span>
                          {t('deviceinformationlog')}
                        </li>
                      </ul>{" "}
                      {/* How We Use Your Information */}
                      <li className="policy-sub-heading">
                        {t('howWeUseYourInformation')}
                      </li>
                      <p>
                        {t('weuseyourpersonal')}
                      </p>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('trovidendManageervices')}{" "}
                          </span>
                          {t('toprocesstransactions')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('toImproveOurPlatform')}{" "}
                          </span>
                          {t('toanalyzeusagepatterns')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('toCommunicatewithYou')}{" "}
                          </span>
                          {t('tosendyouupdates')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('toComplywithLegalObligations')}{" "}
                          </span>
                          {t('toadheretoregulatory')}
                        </li>
                      </ul>
                      {/* How We Share Your Information*/}
                      <li className="policy-sub-heading">
                        {t('howWeShareYourInformation')}
                      </li>
                      <p>{t('wemayshareyourpersonal')}</p>
                      <ul>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('serviceProviders')}{" "}
                          </span>
                          {t('thirdpartyvendors')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {" "}
                            {t('regulatoryAuthorities')}{" "}
                          </span>
                          {t('tocomplywithlegal')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('businessTransfers')}{" "}
                          </span>
                          {t('inconnectionwith')}
                        </li>
                        <li>
                          <span className="policy-bold"> {t('affiliates')} </span>
                          {t('companieswithinour')}
                        </li>
                      </ul>
                      {/*Data Security*/}
                      <li className="policy-sub-heading">{t('dataSecurity')}</li>
                      <p>
                       {t('weimplementreasonable')}
                      </p>
                      {/* Your Rights*/}
                      <li className="policy-sub-heading"> {t('yourRights')}</li>
                      <p>
                        {t('dependingonyourjurisdiction')}
                      </p>{" "}
                      <ul>
                        <li>
                          <span className="policy-bold">{t('access')} </span>
                          {t('torequestacopy')}
                        </li>
                        <li>
                          <span className="policy-bold">{t('correction')} </span>
                         {t('torequestcorrection')}
                        </li>
                        <li>
                          <span className="policy-bold">{t('deletion')} </span>
                          {t('torequestthedeletion')}
                        </li>
                        <li>
                          <span className="policy-bold">{t('objection')} </span>
                          {t('toobjecttoorestrict')}
                        </li>
                        <li>
                          <span className="policy-bold">
                            {t('dataPortability')}{" "}
                          </span>
                          {t('torequestacopynew')}
                        </li>
                      </ul>
                      <p>
                        {" "}
                        {t('toexercisetheserights')}
                        [pitiklini@gmail.com].
                      </p>
                      {/*  Cookies and Tracking Technologies*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('cookiesandTracking')}
                      </li>
                      <p>
                        {t('weusecookiesand')}
                      </p>
                      {/*  Children's Privacy*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('childrenPrivacy')}
                      </li>
                      <p>
                        {t('ourPlatform')}
                      </p>
                      {/*  Changes to This Privacy Policy*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('changestoThisPrivacyPolicy')}
                      </li>
                      <p>
                        {t('wemayupdatethis')}
                      </p>{" "}
                      {/*   Contact Information*/}
                      <li className="policy-sub-heading">
                        {" "}
                        {t('sontactInformation')}
                      </li>{" "}
                      <p>
                        {t('fyouhaveanyquestionsor')} :
                      </p>
                      <div>
                        <span className="policy-sub-heading">{t('email_label')}: </span>{" "}
                        <span className="terms-email">
                        pitiklini@gmail.com
                        </span>
                      </div>
                      {/* <div className="terms-address">
                        <span className="policy-sub-heading">Address: </span>{" "}
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

export default Privacy;
