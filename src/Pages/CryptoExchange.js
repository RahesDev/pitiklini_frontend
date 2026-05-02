import Shield from "../assets/images/shield.png";
import Trust from "../assets/images/trust.png";
import Asset from "../assets/images/asset.png";
import Secure from "../assets/images/secure.png";
import { useTranslation } from "react-i18next";

const crypto = [
  {
    title: "crypto_exchange_1",
    desc: "crypto_content_1",
    icon: Trust,
  },
  {
    title: "crypto_exchange_2",
    desc: "crypto_content_2",
    icon: Shield,
  },
  {
    title: "crypto_exchange_3",
    desc: "crypto_content_3",
    icon: Asset,
  },
  {
    title: "crypto_exchange_4",
    desc: "crypto_content_4",
    icon: Secure,
  },
];

const CryptoExchange = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-20">
        <div className="flex flex-col h-full justify-center self-center">
          <p className="text-primary font-family-ibm mb-0 font-extrabold text-[40px]">
            {t("trusted_crypto_exchange")}
          </p>
          <p className="text-secondary text-[20px] mt-7 mb-8 font-family-ibm">
            {t("experience_peace")}{" "}
          </p>
          <p className="text-primary rounded-[8px] w-fit text-base font-family-ibm border border-primary px-4 py-4">
            {t("read_more")}{" "}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {crypto.map((item, i) => (
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
                    {t("crypto_exchange_1")}
                  </h3>

                  {/* Description */}
                  <p className="text-secondary10 text-base leading-relaxed">
                    {t("crypto_content_1")}
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

export default CryptoExchange;
