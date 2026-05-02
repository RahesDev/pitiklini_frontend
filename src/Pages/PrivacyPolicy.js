import Footer from "./Footer";
import Header from "./Header";

const policyData = [
  {
    title: "INTRODUCTION",
    content: `Thank you for visiting PITIKLINI Trading Platform (“PITIKLINI”). By visiting, accessing, or using PITIKLINI and associated application program interface or mobile applications (“Site”), you consent to the policies and practices of our privacy policy (the “Privacy Policy”), PLEASE READ THIS PRIVACY POLICY CAREFULLY. This Privacy Policy explains how PITIKLINI uses your Personal Data (defined below) as we provide you with access and utility through our digital asset trading platform via software, API (application program interface), technologies, products and/or functionalities (“Service”). In the course of providing you our Service, to abide by the laws in the jurisdictions that we operate, and to improve our services, we need to collect and maintain personal information about you. As a rule, we never disclose any personal information about our customers to any non-affiliated third parties, except as described below. We may update this Privacy Policy at any time and from time to time by posting the amended version on this site.`,
  },
  {
    title: "DATA WE COLLECT",
    content: `PITIKLINI collects, processes, and stores Personal Data collected from you via your use of the Service or where you have given your consent. This Personal Data may include:.

- Virtual Identity: PITIKLINI Account/ Password, PITIKLINI Nickname.

- Financial Information: Bank account information, payment card primary account number (PAN), account assets, transaction history, trading data, and/or tax identification.

- Transaction Information: Information about the transactions you make on the Platform, such as the name of the recipient, your name, the amount, and/or timestamp.

- Message Content: Feedback, Email, SMS, App Rating, Comments.

- Application Activity: Browsers and tap records, search history, installed apps, running apps, crash logs, user-generated content, favorites, mouse movement, scroll position, key events, and touch events.

- Device Information: Carrier, brand, software version, model name, manufacturer, system language, OS version, locale, fingerprint, Build ID, baseband version, SIM country, SIM serial number, battery status, network, OAID, IMEI, GUID, MAC address, Android ID, SSID, Advertising ID and gyroscope/accelerometer data.

- Correspondence: Survey responses, information provided to our support team or user research team.

- Audio, electronic, visual and similar information, such as call and video recordings.

- Biometric data about yourself, including facial recognition data, fingerprint data, or other biometric data that may be used as a method of authentication on the Device used to access the Platform.

We may collect information you provide during the PITIKLINI onboarding process, which may be a completed, incomplete, or abandoned process. Offering services to residents in certain jurisdictions, we collect, store, and process your personal information in accordance with the provisions of your local data protection laws such as General Data Protection Regulation (GDPR) and Data Protection Act.

In addition, in order to stay in compliance to applicable Anti-Money Laundering laws and regulations, we may collect the following Personal Information:

Individual customers:

- Email address

- Mobile phone number

- Full legal name (including former name, and names in local language)

- Nationality

- Passport number, or any government issued ID number

- Date of birth (“DOB”)

- Proof of identity (e.g. passport, driver's license, or government-issued ID)

- Residential address

- Proof of residency`,
  },
  {
    title:
      "ACCESS, CORRECTION, DELETION AND OTHER RIGHTS RELATING TO YOUR PERSONAL DATA",
    content: `Subject to applicable law, as outlined below, you have a number of rights in relation to your privacy and the protection of your Personal Data. You have the right to request access to, correct, and delete your Personal Data, and to ask for data portability. You may also object to our processing of your Personal Data or ask that we restrict the processing of your Personal Data in certain instances. In addition, when you consent to our processing of your Personal Data for a specified purpose, you may withdraw your consent at any time. If you want to exercise any of your rights outlined below, please contact our Data Protection Officer by email via: dataprotect@Pitiklini.com. These rights may be limited in some situations - for example, where we are required by applicable laws or AML compliance practices to process your Personal Data.

- Right to access: you have the right to obtain confirmation that your Personal Data are processed and to obtain a copy of it as well as certain information related to its processing;.

- Right to rectify: you can request the rectification of your Personal Data which are inaccurate, and also add to it. You can also change your Personal Data in your Account at any time.

- Right to delete: you can, in some cases, have your Personal Data deleted;

- Right to object: you can object, for reasons relating to your particular situation, to the processing of your Personal Data. For instance, you have the right to object where we rely on legitimate interest or where we process your Personal Data for direct marketing purposes;

- Right to restrict processing: You have the right, in certain cases, to temporarily restrict the processing of your Personal Data by us, provided there are valid grounds for doing so. We may continue to process your Personal Data if it is necessary for the defense of legal claims, or for any other reasons permitted by applicable law;

- Right to portability: in some cases, you can ask to receive your Personal Data which you have provided to us in a structured, commonly used and machine-readable format, or, when this is possible, that we communicate your Personal Data on your behalf directly to another data controller;

- Right to withdraw your consent: for processing requiring your consent, you have the right to withdraw your consent at any time. Exercising this right does not affect the lawfulness of the processing based on the consent given before the withdrawal of the latter.

Exercising of your rights above may impact the form and substance of the Services we provide to you, and in some circumstances, such exercise may mean that we will not be able to continue providing the Services to you, and we may need to terminate the contract you have with us.

We may charge you a reasonable fee for the handling and processing of your requests to access your personal data. If we choose to charge a fee, we will provide you with a written estimate of the fee that we will be charging. Please note that we are not required to respond to or deal with your request for access unless you have agreed to pay the fee.`,
  },
];

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="bg-[#0b0f19] pt-[120px] pb-12 px-10">
        <div className="max-w-full px-[5%] mx-auto bg-[#0f172a]/40 py-10 rounded-2xl">
          {/* Title */}
          <h1 className="text-primary text-4xl font-family-ibm font-semibold mb-2">
            Privacy Policy
          </h1>
          <p className="text-secondary text-xl font-family-ibm mb-10">
            Last Update: 24 March, 2026
          </p>

          {/* Sections */}
          <div className="space-y-8">
            {policyData.map((section, index) => (
              <div key={index}>
                {/* Section Header */}
                <div className="relative bg-[#111827] rounded-xl px-4 py-2 flex items-center overflow-hidden">
                  {/* Gradient Glow Line */}
                  <span className="absolute left-0 top-0 h-full w-1.5 bg-primary"></span>
                  <span className="absolute left-1.5 top-0 h-full w-10 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent blur-[8px]"></span>

                  <h2 className="text-primary font-family-ibm text-2xl font-semibold tracking-wider my-3 ml-3">
                    {section.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="text-secondary mt-10 font-family-ibm text-lg leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
