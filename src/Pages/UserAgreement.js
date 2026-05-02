import Footer from "./Footer";
import Header from "./Header";

const agreementData = [
  {
    title: "IMPORTANT",
    content: `It is your sole responsibility ensure that the computer used for the trade and liquidity of Digital Assets is secure. Due to web page display and safety considerations, it is strongly recommended that Users utilize the latest version of Google Chrome to login to PITIKLINI. Users shall bear the responsibility themselves for the losses or damages suffered as a result thereof.`,
  },
  {
    title: "PROHIBITED COUNTRIES",
    content: `1) You must ensure that you are not resident of Prohibited Countries. Currently, PITIKLINI does not provide Services, nor do we accept registration of Users or trade applications, in the following countries: North Korea, Cuba, Sudan, Syria, Iran, Crimea, Mainland China, Indonesia, Singapore, Venezuela, the United States, the United Kingdom, and Canada (altogether referred to as 'Prohibited Countries'). For the sake of clarification, the Prohibited Countries list is non-exclusive and is subject to change, at any time and from time to time, by PITIKLINI in its absolute sole discretion may decide, taking into account legal and compliance considerations. You understand and acknowledge that if it is determined that you have given false representations of your location or place of residence, we reserve the right to take any appropriate actions in compliance with applicable laws and regulations, including termination of any Account immediately and liquidating any open positions. You undertake to inform PITIKLINI at the earliest possible opportunity if you have become resident in any of the foregoing Prohibited Countries.
`,
  },
  {
    title: "RISK DISCLOSURE",
    content: `2) Notwithstanding our Risk Disclosure Statement available at: https://www.Pitiklini.com/risk to further your understanding of the risks associated with trading in Digital Assets, PITIKLINI hereby reminds you of the following:`,
  },
  {
    subTitle:
      "You must fully understand and assess the risks in digital assets trading before conducting any trading activities or using our services; you must assess your risk tolerance carefully before engaging in digital assets trading.",
  },
  {
    content: `3) Notwithstanding the foregoing, when using our Services, you may face risks regarding policy, regulatory compliance, investment yield, trading, and force majeure, etc, the non-exhaustive details of which are as follows:
    
    (a) POLICY RISK: Users of PITIKLINI may encounter losses due to the amendment of national laws, regulations or macro-policies which may influence the normal trade of Digital Assets.
    
    (b) COMPLIANCE RISK: Users of PITIKLINI may encounter losses if the User's Digital Assets trade violates national laws or regulations.

    (c) INVESTMENT YIELD RISK: the Digital Asset market has its uniqueness: it never closes, with Digital Assets prices fluctuating in a very wide range. Users may encounter losses in the market.

    (d) TRADING RISK: Your successful transfer is dependent on mutual assent of the parties to the transfer and PITIKLINI does not commit to or guarantee any successful transfer.

    (e) FORCE MAJEURE RISK: When natural disasters, war, strikes, cyber attacks and other unpredictable, unavoidable and unformidable situations occur, PITIKLINI may not be able to operate normally and this may result in Users' losses. For the User’s losses caused by force majeure, PITIKLINI will not assume any civil liabilities.

    (f) RISK OF DELISTING: When a Digital Assets project party faces bankruptcy, liquidation and dissolution, or violates national laws & regulations, or under the request of the project party, PITIKLINI will delist such Digital Assets, which may cause losses for Users.

    (g) TECHNICAL RISK: Although the chance of technical fault is remote during the Digital Assets trade, we can not exclude such possibility. If such has happened, the User’s interests may be affected.

    (h) OPERATIONS RISK: Users may face risks due to operational error, such as transfers to wrong accounts, violations in operation regulations, etc.

    (i) RISK OF ACCOUNT BEING FROZEN: User's account may be frozen or forcefully confiscated by judicial institutions in the event of debt fraud or alleged crimes.`,
  },
  {
    title: "Eligibility and Registration",
    content: `4) By registering for an PITIKLINI Account or using or otherwise accessing PITIKLINI Services, you represent and warrant that: (i) as an individual, you are of legal age to form a binding contract under applicable laws; (ii) as an individual, legal person, or other organization, you have full legal capacity and sufficient authorizations to enter into this Agreement; (iii) you have not been previously suspended or removed from using PITIKLINI Platform or related Services; (iv) you do not have an existing PITIKLINI Account; (v) you are not resident, located in or otherwise attempting to access PITIKLINI Platform or PITIKLINI Services from, or otherwise acting on behalf of a person or legal entity that is resident or located in, a Prohibited Country; (vi) if you act as an employee or agent of a legal entity, and enter into these Agreements on their behalf, you represent and warrant that you have all the necessary rights and authorizations to bind such legal entity and to access and use PITIKLINI Platform and PITIKLINI Services on behalf of such legal entity; and (vii) your use of PITIKLINI Platform and PITIKLINI Services will not violate any and all laws and regulations applicable to you or the legal entity on whose behalf you are acting, including but not limited to regulations on anti-money laundering, anti-corruption, and counter-terrorist financing.
    
    5) All Users must apply for an PITIKLINI Account before using PITIKLINI Services. When you register an PITIKLINI Account, you must provide the information identified in this Agreement or otherwise as requested by PITIKLINI, and accept this Agreement, the Privacy Policy, and other PITIKLINI Legal Documents. PITIKLINI may refuse, in its absolute sole discretion, to open an PITIKLINI Account for you. You agree to provide complete and accurate information when opening an PITIKLINI Account, and agree to timely update any information you provide to PITIKLINI to maintain the integrity and accuracy of the information. Each User (including natural person, business or legal entity) may maintain only one main account at any given time. The registration, use, protection and management of such trading accounts are equally governed by the provisions of this Agreement, unless otherwise stated in this Agreement or the Legal Documents.
    
    6) Please note that there are legal requirements in various countries which may restrict the products and services that PITIKLINI can lawfully provide. Accordingly, some products and services and certain functionality within PITIKLINI Platform may not be available or may be restricted in certain jurisdictions or regions or to certain Users. You shall be responsible for informing yourself about and observing any restrictions and/or requirements imposed with respect to the access to and use of PITIKLINI Platform and PITIKLINI Services in each country from which PITIKLINI Platform and PITIKLINI Services are accessed by you or on your behalf. PITIKLINI reserves the right to change, modify or impose additional restrictions with respect to the access to and use of PITIKLINI Platform and/or PITIKLINI Services from time to time at their discretion at any time without prior notification.`,
  },
];

const UserAgreement = () => {
  return (
    <>
      <Header />
      <div className="bg-[#0b0f19] pt-[120px] pb-12 px-10">
        <div className="max-w-full px-[5%] mx-auto bg-[#0f172a]/40 py-10 rounded-2xl">
          {/* Title */}
          <h1 className="text-primary text-4xl font-family-ibm font-semibold mb-2">
            User Agreement
          </h1>
          <p className="text-secondary text-xl font-family-ibm mb-10">
            Last Update: 24 March, 2026
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {agreementData.map((section, index) => (
              <div key={index}>
                {/* Section Header */}
                {section.title && (
                  <div className="relative bg-[#111827] rounded-xl px-4 py-2 flex items-center overflow-hidden">
                    {/* Gradient Glow Line */}
                    <span className="absolute left-0 top-0 h-full w-1.5 bg-primary"></span>
                    <span className="absolute left-1.5 top-0 h-full w-10 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent blur-[8px]"></span>

                    <h2 className="text-primary font-family-ibm text-2xl font-semibold tracking-wider my-3 ml-3">
                      {section.title}
                    </h2>
                  </div>
                )}

                {section.subTitle && (
                  <div className="relative bg-[#111827] rounded-xl px-4 py-2 flex items-center overflow-hidden">
                    <span className="absolute left-1.5 top-0 h-full w-10 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent blur-[8px]"></span>

                    <h2 className="text-primary font-family-ibm text-lg font-semibold tracking-wider my-3 ml-3">
                      {section.subTitle}
                    </h2>
                  </div>
                )}

                {/* Content */}
                {section.content && (
                  <div className="text-secondary mt-10 font-family-ibm text-lg leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserAgreement;
