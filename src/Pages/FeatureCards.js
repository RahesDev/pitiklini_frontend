import React from "react";
import Shield from "../assets/images/shield.png";
import Chart from "../assets/images/chart.png";
import Coins from "../assets/images/coins.png";
import Book from "../assets/images/book.png";
import Users from "../assets/images/users.png";
import Support from "../assets/images/support.png";
import { useTranslation } from "react-i18next";

const features = [
  {
    title: "feature_title_1",
    desc: "feature_content_1",
    icon: Shield,
  },
  {
    title: "feature_title_2",
    desc: "feature_content_2",
    icon: Chart,
  },
  {
    title: "feature_title_3",
    desc: "feature_content_3",
    icon: Coins,
  },
  {
    title: "feature_title_4",
    desc: "feature_content_4",
    icon: Book,
  },
  {
    title: "feature_title_5",
    desc: "feature_content_5",
    icon: Users,
  },
  {
    title: "feature_title_6",
    desc: "feature_content_6",
    icon: Support,
  },
];

const FeatureCards = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="bg-[#0b0f19] min-h-screen mt-10 p-10">
        <h1 className="text-secondary font-family-ibm mb-10 mt-20 text-center text-[48px] mx-auto max-w-[750px]">
          {t("key_features")}
          <span className={`crypto-span mar-lft text-primary`}>
            {t("pitiklini")}
          </span>
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-[1px] border border-primary via-transparent to-yellow-500/40 hover:scale-105 transition-all duration-300"
            >
              <span className="bg-primary w-[70%] h-1 block mx-auto -mt-0.5"></span>
              {/* Inner Card */}
              <div className="relative rounded-2xl h-full overflow-hidden">
                {/* Top Glow Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-yellow-400 blur-sm"></div>

                {/* Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,200,0,0.15),transparent_60%)]"></div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <img
                    src={item.icon}
                    alt=""
                    className="w-40 h-40 object-contain drop-shadow-[0_0_20px_rgba(255,200,0,0.4)]"
                  />
                </div>

                <div className="bg-black/35 p-5">
                  {/* Title */}
                  <h3 className="text-primary font-semibold text-lg mb-3">
                    {t("feature_title_1")}
                  </h3>

                  {/* Description */}
                  <p className="text-secondary10 text-base leading-relaxed">
                    {t("feature_content_1")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCards;
