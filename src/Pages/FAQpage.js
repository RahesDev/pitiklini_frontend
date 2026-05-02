import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  CircleUser,
  ShieldCheck,
  ClipboardCheck,
  LogOut,
  LockKeyhole,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import Help from "../assets/images/faq.svg";
import imgTrading from "../assets/images/trading.svg";
import imgInformation from "../assets/images/information.svg";
import imgFeesLimits from "../assets/images/fees-limits.svg";
import imgSupport from "../assets/images/support.png";
import imgFundsTransfer from "../assets/images/funds-transfer.svg";
import imgAccount from "../assets/images/shield.png";

const faqCategoryTabs = [
  { label: "Trading", image: imgTrading },
  { label: "Information", image: imgInformation },
  { label: "Fees & Limits", image: imgFeesLimits },
  { label: "Support", image: imgSupport },
  { label: "Funds Transfer", image: imgFundsTransfer },
  { label: "Account", image: imgAccount },
];

const faqSidebarItems = [
  { title: "Creating an Account", Icon: CircleUser },
  { title: "Account Verification", Icon: ShieldCheck },
  { title: "Two-Factor", Icon: ClipboardCheck },
  { title: "Account Deactivation", Icon: LogOut },
  { title: "Security Best Practices", Icon: LockKeyhole },
];

const accountFaqAccordionItems = [
  {
    question: "How do I create a new account on your platform?",
    answer:
      "To create a new account, first go to the registration page. Then, enter the required information, including your email, username, and password. After that, a verification email will be sent to your email address to complete the registration process, which you must confirm. Additionally, depending on security requirements, KYC identity verification may also be necessary.",
  },
  {
    question: "What are the requirements to open an account?",
    answer:
      "You need a valid email address, must meet the minimum age requirement for your region, and be able to complete identity verification when requested. Additional documents may be required depending on your jurisdiction.",
  },
  {
    question: "Can I open multiple accounts on your platform?",
    answer:
      "Generally one account per person is allowed. Please review our Terms of Service or contact support if you have a specific need for more than one account.",
  },
  {
    question: "Is there an age restriction for creating an account?",
    answer:
      "Yes. You must be at least the minimum legal age in your country or region (often 18+) to register and use the platform.",
  },
  {
    question: "Do I need to verify my identity to create an account?",
    answer:
      "You can often register with basic details first, but identity verification (KYC) is usually required before you can deposit, withdraw, or access full trading features.",
  },
  {
    question:
      "Why do I need to provide personal information during registration?",
    answer:
      "We collect information to comply with anti-money laundering (AML) and know-your-customer (KYC) regulations, protect your account, and keep the platform safe for all users.",
  },
  {
    question: "What should I do if I don’t receive the verification email?",
    answer:
      "Check your spam or promotions folder, confirm you entered the correct email, wait a few minutes, and use the resend option if available. If it still does not arrive, contact support.",
  },
  {
    question:
      "Can I trade cryptocurrencies immediately after creating an account?",
    answer:
      "You may browse the platform right away, but trading limits often apply until you complete email verification and any required identity verification steps.",
  },
];

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(5);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [faqSearch, setFaqSearch] = useState("");

  return (
    <>
      <Header />
      <div className="bg-[#0B0E11] text-secondary">
        <div className="top-[120px]">
          <img src={Help} alt="" className="mx-auto pt-[120px]" />
          <div className="hero_section_content mt-10 w-full pb-4">
            <h1 className="text-primary text-center text-[48px] font-semibold mx-auto max-w-[750px]">
              Frequently Asked Questions
            </h1>
            <div className="flex w-full gap-4 justify-center mx-auto mt-6">
              <div
                role="search"
                className="flex w-full max-w-[500px] items-center gap-3 rounded-xl border border-[#2a3038] bg-[#1E2329] px-6 py-3 shadow-inner"
              >
                <Search
                  className="h-5 w-5 shrink-0 text-primary pointer-events-none"
                  aria-hidden
                />
                <label htmlFor="faq-search" className="sr-only">
                  Search frequently asked questions
                </label>
                <input
                  id="faq-search"
                  type="search"
                  name="faq-search"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent text-sm text-secondary placeholder:text-primary/55 outline-none border-0 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
        {/* MAIN FAQ CONTAINER */}
        <div className="max-w-[1100px] mx-auto mt-16s rounded-xl p-8 bg-[#0B0E11]">
          {/* Category cards — 3D icons from ../assets/images/ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {faqCategoryTabs.map(({ label, image }, i) => {
              const isActive = activeCategoryIndex === i;
              return (
                <div
                  key={label}
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveCategoryIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveCategoryIndex(i);
                    }
                  }}
                  className={`flex flex-col items-center justify-center gap-3 rounded-2xl px-3 py-5 cursor-pointer transition border border-[#1F1F1F] bg-[#121212] hover:border-primary/35 ${
                    isActive
                      ? "!border-t-[3px] !border-t-primary bg-[#161618] ring-1 ring-primary/20"
                      : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${label} category`}
                    className="h-[72px] w-full max-w-[120px] object-contain pointer-events-none select-none"
                  />
                  <span className="text-white font-semibold text-sm text-center leading-tight">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CONTENT AREA */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* SIDEBAR */}
            <div className="w-full lg:w-[260px] space-y-3 shrink-0">
              {faqSidebarItems.map(({ title, Icon }, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    type="button"
                    key={title}
                    onClick={() => setActiveIndex(i)}
                    className={`w-full flex items-center gap-3.5 text-left px-5 py-3.5 rounded-xl text-sm font-medium transition border
                  ${
                    isActive
                      ? "bg-[#B87A13] text-white border-[#B87A13] shadow-sm hover:bg-[#d89b2b]"
                      : "bg-[#12151c] text-white border-[#2a3038] hover:bg-[#f3c77a] hover:text-black hover:border-[#f3c77a]"
                  }`}
                  >
                    <Icon
                      className="h-[18px] w-[18px] shrink-0 stroke-[2]"
                      aria-hidden
                    />
                    {title}
                  </button>
                );
              })}
            </div>

            {/* FAQ CONTENT — accordion */}
            <div className="flex-1 min-w-0 divide-y divide-[#2a3038] rounded-xl border border-[#2a3038] bg-[#1E2329] overflow-hidden">
              {accountFaqAccordionItems.map(({ question, answer }, i) => {
                const isOpen = openFaqIndex === i;
                const toggle = () =>
                  setOpenFaqIndex((prev) => (prev === i ? null : i));

                return (
                  <div key={question} className="min-w-0">
                    <button
                      type="button"
                      onClick={toggle}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left text-sm hover:bg-[#252b34] transition"
                    >
                      <span className="text-primary font-semibold leading-snug pr-2">
                        {question}
                      </span>
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/50 text-primary pointer-events-none"
                        aria-hidden
                      >
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0">
                        <p className="text-secondary10 text-xs leading-relaxed">
                          {answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQPage;
