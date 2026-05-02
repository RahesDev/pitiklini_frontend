import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Pagination } from "swiper/modules";
import Quote from "../assets/svg/quote.svg";
import SideArrow from "../assets/svg/side-arrow.svg";
import XLogo from "../assets/svg/twiter1.svg";

const reviews = [
  {
    text: "The platform is incredibly user-friendly, and since I became a holder, I have seen a significant increase in my assets. It is great to be part of a project where everything works smoothly.",
    name: "sara joan",
    role: "Community Member",
  },
  {
    text: "I have been impressed by the continuous innovation and dedication of the team. As a holder, I feel like I am part of something truly groundbreaking and I cannot wait to see where this project goes next.",
    name: "alex turner",
    role: "Early Investor",
  },
  {
    text: "The overall experience has been smooth, stable, and transparent. Support is quick, the interface is clean, and the trading flow feels straightforward even for new users.",
    name: "maria clark",
    role: "Community Member",
  },
];

const Testimonials = () => {
  return (
    <section className="relative bg-[#0b0f19] py-20 text-white overflow-hidden">
      <img
        src={Quote}
        alt=""
        className="pointer-events-none absolute left-8 top-6 w-14 md:w-20 opacity-80"
      />
      <img
        src={Quote}
        alt=""
        className="pointer-events-none absolute right-8 bottom-8 w-14 md:w-20 rotate-180 opacity-80"
      />

      <div className="text-center mb-12 relative z-10">
        <p className="text-gray-300 text-sm mb-2">● User Reviews</p>
        <p className="text-primary font-family-ibm mb-0 font-extrabold text-[34px] md:text-[44px] leading-tight">
          What our users say
        </p>
      </div>

      <Swiper
        slidesPerView={1.1}
        centeredSlides
        spaceBetween={18}
        loop
        effect="coverflow"
        grabCursor
        coverflowEffect={{
          rotate: 18,
          stretch: 0,
          depth: 140,
          modifier: 1.2,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        breakpoints={{
          640: { slidesPerView: 1.4, spaceBetween: 22 },
          992: { slidesPerView: 2.3, spaceBetween: 28 },
          1280: { slidesPerView: 2.8, spaceBetween: 30 },
        }}
        className="px-4 md:px-8 testimonial-swiper"
      >
        {reviews.map((item, index) => (
          <SwiperSlide key={index}>
            {({ isActive }) => (
              <div
                className={`relative mx-auto max-w-[620px] rounded-3xl p-[1px] transition-all duration-500 ${
                  isActive
                    ? "bg-gradient-to-r from-[#BD7F10] via-[#5D4724] to-[#1E2430] opacity-100 scale-100"
                    : "bg-gradient-to-r from-[#313440] to-[#1A1E29] opacity-45 scale-[0.92] blur-[0.8px]"
                }`}
              >
                <div className="bg-[linear-gradient(170deg,#1C1F2C_0%,#141825_55%,#101320_100%)] rounded-3xl p-6 md:p-8 min-h-[270px] md:min-h-[285px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(189,127,16,0.22),transparent_56%)]" />
                  <div className="relative z-10">
                    <p className="text-[#E5E7EB] text-sm md:text-[15px] leading-relaxed mb-8">
                      {item.text}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black/70 border border-white/10 flex items-center justify-center shrink-0">
                          <img src={XLogo} alt="x logo" className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-semibold mb-0.5 capitalize">
                            {item.name}
                          </h4>
                          <p className="text-gray-400 text-xs mb-0">{item.role}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        aria-label="Open testimonial source"
                        className="w-11 h-11 rounded-full bg-[#353945] border border-white/10 flex items-center justify-center"
                      >
                        <img src={SideArrow} alt="" className="w-9 h-9" />
                      </button>
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute right-0 top-12 h-24 w-[3px] bg-[#BD7F10] rounded-full" />
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .testimonial-swiper .swiper-pagination {
          margin-top: 24px;
          position: relative;
          bottom: 0;
        }
        .testimonial-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #5f6472;
          opacity: 1;
          transition: all 0.25s ease;
        }
        .testimonial-swiper .swiper-pagination-bullet-active {
          width: 24px;
          background: #bd7f10;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
