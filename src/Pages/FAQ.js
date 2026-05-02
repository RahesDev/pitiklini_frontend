import React, { useState } from "react";
import Arrow from "../assets/svg/arrow.svg";

const faqData = [
  {
    question: "What is a cryptocurrency exchange?",
    answer:
      "A cryptocurrency exchange is a platform where users can buy, sell, and trade digital currencies securely.",
  },
  {
    question: "How to buy Bitcoin and other cryptocurrencies on PITIKLINI?",
    answer:
      "Create an account, verify your identity, deposit funds, and start buying cryptocurrencies easily.",
  },
  {
    question: "How to trade cryptocurrencies on PITIKLINI?",
    answer:
      "You can trade hundreds of cryptocurrencies on PITIKLINI via Spot markets. Register, verify, deposit crypto, and start trading.",
  },
  {
    question: "Is PITIKLINI a safe cryptocurrency exchange?",
    answer:
      "Yes, PITIKLINI uses advanced security protocols and encryption to keep your assets safe.",
  },
  {
    question: "How to track cryptocurrency prices?",
    answer:
      "Use the market dashboard to monitor real-time prices, charts, and trends.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#0b0f19] text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-secondary10 text-sm mb-2">● FAQ</p>
          <h2 className="text-[40px] font-family-ibm font-bold text-primary mb-3">
            Frequently Asked Question
          </h2>
          <p className="text-secondary10 font-family-ibm max-w-2xl mx-auto">
            Explore the most common questions and detailed answers about our
            platform, services, and security to help guide your journey in the
            crypto world.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border border-secondary/35 rounded-lg overflow-hidden bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent"
              >
                {isOpen && (
                  <div className="bg-primary w-[70%] h-1 block mx-auto -mt-0.5"></div>
                )}
                {/* Question */}
                <button
                  onClick={() => toggle(index)}
                  className={`w-full flex font-family-ibm text-xl justify-between ${isOpen ? "font-bold" : "font-medium"} items-center p-5 text-left`}
                >
                  <span className="text-secondary10 font-medium">
                    {item.question}
                  </span>

                  <img
                    src={Arrow}
                    alt="arrow"
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-yellow-400" : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Golden Active Line */}
                {isOpen && <div className="h-[0.5px] bg-secondary10/20"></div>}

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 text-secondary10 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
