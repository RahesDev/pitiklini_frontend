import React, { useRef, useEffect } from "react";
import useState from "react-usestateref";
import Footer from "./Footer";
import Header from "./Header";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import useInView from "../hooks/useInView";
import { useTranslation } from "react-i18next";
import { getMethod, postMethod } from "../core/service/common.api";
import apiService from "../core/service/detail";
import { Link, useNavigate } from "react-router-dom";
import { gsap, Elastic, Power1 } from "gsap";
import Marquee from "react-marquee-slider";

export default function Landing() {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 200,
    autoplayspeed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const cardtwoSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 200,
    autoplaySpeed: 3000,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const cardthreeSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 200,
    autoplayspeed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const swiperCards = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 425,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const [colorChanged, setColorChanged] = useState(false);
  const [siteData, setSiteData] = useState("");
  const [siteStatus, setSiteStatus] = useState("");
  const [siteLoader, setSiteLoader] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getSitedata();
    getCurencies();
    const timer = setTimeout(() => {
      setColorChanged(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getSitedata = async () => {
    try {
      var data = {
        apiUrl: apiService.getSitedata,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setSiteData(resp.data);
        setSiteStatus(resp.data.siteStatus);
        console.log(resp, "=-=-=get site datas =-=-", resp.data.depositStatus);
      }
    } catch (error) {}
  };

  const getCurencies = async () => {
    try {
      var data = {
        apiUrl: apiService.getCurrencieslanding,
      };
      setSiteLoader(true);
      var resp = await getMethod(data);
      setSiteLoader(false);
      if (resp.status == true) {
        setCurrencies(resp.data);
      }
    } catch (error) {}
  };

  const duplicatedCurrencies = [...currencies, ...currencies];

  const [velocity, setVelocity] = useState(50);

  useEffect(() => {
    const updateVelocity = () => {
      setVelocity(window.innerWidth <= 768 ? 14 : 50);
    };

    updateVelocity();
    window.addEventListener("resize", updateVelocity);
    return () => window.removeEventListener("resize", updateVelocity);
  }, []);

  const [sectionRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [advanceTradeRef, advanceTradeInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [availableRef, availableRefInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [keepRef, keepRefInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [secureRef, secureRefInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const vsOpts = {
      slides: document.querySelectorAll(".v-slide"),
      list: document.querySelector(".v-slides"),
      duration: 12, // Increase duration for slower speed
      lineHeight: 50,
    };

    const vSlide = gsap.timeline({
      paused: true,
    });

    vsOpts.slides.forEach((slide, i) => {
      if (i === vsOpts.slides.length - 1) {
        // For the last slide, apply a fade-out effect
        vSlide.to(
          slide,
          vsOpts.duration / vsOpts.slides.length,
          {
            opacity: 0, // Fade out
            ease: Power1.easeInOut,
          },
          `+=${vsOpts.duration / vsOpts.slides.length}` // Delay for smooth transition
        );
      } else {
        // Normal slide-up effect for all other slides
        vSlide.to(vsOpts.list, vsOpts.duration / vsOpts.slides.length, {
          y: (i + 1) * -1 * vsOpts.lineHeight,
          ease: Elastic.easeOut.config(1, 0.4),
        });
      }
    });

    vSlide.play();
  }, []);

  useEffect(() => {
    const updateAOSAttributes = () => {
      const tradeBg = document.querySelector(".trade-bg");
      const tradeBgMob = document.querySelector(".trade-bg-mob");

      // if (window.innerWidth > 768) {
      //   tradeBg.setAttribute("data-aos", "fade-left");
      //   tradeBgMob.setAttribute("data-aos", "fade-right");
      // } else {
      //   tradeBg.removeAttribute("data-aos");
      //   tradeBgMob.removeAttribute("data-aos");
      // }

      // Refresh AOS to apply changes
      window.AOS.refresh();
    };

    // Initial attribute update
    updateAOSAttributes();

    // Listen for window resize events
    window.addEventListener("resize", updateAOSAttributes);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", updateAOSAttributes);
    };
  }, []);

  const [isLastSlide, setIsLastSlide] = useState(false);

  const textsettings = {
    dots: false,
    speed: 500,
    autoplaySpeed: 1500,
    infinite: true, // Keep infinite looping
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true,
    verticalSwiping: true,
    beforeChange: function (currentSlide, nextSlide) {
      // Assuming there are 3 slides and index is zero-based
      if (nextSlide === 2) {
        // Next slide is the last one
        setIsLastSlide(true);
      } else {
        setIsLastSlide(false); // Reset on other slides
      }
    },
  };

  const [loginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    let checkLogin = sessionStorage.getItem("user_token");
    console.log(checkLogin, "-----checkLogin----");
    if (checkLogin) {
      setLoginCheck(true);
    }
  }, []);

  const navigate = useNavigate();

  const tradeNav = () => {
    // {loginCheck ?
    navigate("/trade/BTC_USDT");
    // : navigate("/login") }
  };

  return (
    <>
      <main className="fidex_landing_main">
        <section>
          <Header />
        </section>

        {/* hero */}
        <section className="fidex_hero_section">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 " data-aos="fade-right">
                <div className="hero_section_content ">
                  <h1>
                    {t("start_trading")}
                    <span
                      className={`crypto-span mar-lft  ${
                        colorChanged
                          ? "text-animate-inview text-animate"
                          : "text-animate"
                      }`}
                    >
                      {t("pitiklini")}
                    </span>
                  </h1>
                  <p>{t("seamless_crypto_trading")}</p>
                  <Link
                    to={loginCheck ? "/dashboard" : "/register"}
                    className="get_started_btn"
                  >
                    {t("get_started_now")}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 flex-end " data-aos="fade-left">
                <div className="hero_section_banner">
                  {/* <img src={require("../assets/gif/mobile.gif")} /> */}
                  <img src={require("../assets/new_hero.webp")} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section>
        <div className="morque_new_run">
        <div className="marquee-container">
        <Marquee
              className="marquee-outer"
              velocity={velocity}
              direction="rtl"
              resetAfterTries={200}
            >
              <div className="mar_new_inn">
                <img
                  src={require("../assets/btc.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Bitcoin
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/eth.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Ethereum
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/xrp.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Ripple
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/bnb.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  BNB
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/usdt.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Tether
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/tron.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Tron
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/btc.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Bitcoin
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/eth.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Ethereum
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/xrp.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Ripple
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/bnb.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  BNB
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/usdt.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Tether
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/tron.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Tron
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/xrp.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  Ripple
                </span>
              </div>
              <div className="mar_new_inn">
                <img
                  src={require("../assets/bnb.png")}
                  alt=""
                  className="marquee-img"
                />
                <span className="mar_inn_span">
                  BNB
                </span>
              </div>
            </Marquee>
            </div>
            <div className="fade-newmarq fade-left"></div>
            <div className="fade-newmarq fade-right"></div>
            </div>
        </section> */}

        <section>
          <div className="morque_new_run">
            <div className="marquee-container">
              {currencies.length > 0 && (
                <Marquee
                  className="marquee-outer"
                  velocity={velocity}
                  direction="rtl"
                  resetAfterTries={200}
                >
                  {duplicatedCurrencies.map((currency, index) => (
                    <div className="mar_new_inn" key={index}>
                      <img
                        src={currency.Currency_image} // Use the image URL from the API
                        alt={currency.Currency_image}
                        className="marquee-img"
                      />
                      <span className="mar_inn_span">
                        {t(currency.currencyName)}
                      </span>
                    </div>
                  ))}
                </Marquee>
              )}
            </div>
            <div className="fade-newmarq fade-left"></div>
            <div className="fade-newmarq fade-right"></div>
          </div>
        </section>

        <section className="feature_hero">
          <div className="container">
            <div className="feature_top">
              <span className="feature_head">{t("powerful_features")}</span>
              <span className="feature_subhead">{t("empowering_success")}</span>
            </div>
            <div className="row mt-3 h-100 g-4 ">
              <div className="col-lg-4  col-md-6">
                <div className="feature_card h-100 ">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-first.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">
                      {t("instant_trades")}
                    </span>
                    <span className="fetaure_inn_subhead">
                      {t("execute_transactions")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4  col-md-6">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-second.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">
                      {t("advanced_security")}
                    </span>
                    <span className="fetaure_inn_subhead">
                      {t("protect_funds")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4  col-md-6">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-third.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">{t("low_fees")}</span>
                    <span className="fetaure_inn_subhead">
                      {t("maximize_profits")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-fourth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">
                      {t("wide_asset_range")}
                    </span>
                    <span className="fetaure_inn_subhead">
                      {t("diversify_portfolio")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-fifth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">{t("support_247")}</span>
                    <span className="fetaure_inn_subhead">
                      {t("round_the_clock_assistance")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-sixth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">
                      {t("user_friendly_interface")}
                    </span>
                    <span className="fetaure_inn_subhead">
                      {t("smooth_navigation")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row mt-4 h-100 ">
              <div className="col-lg-4">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-fourth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">WIDE ASSET RANGE</span>
                    <span className="fetaure_inn_subhead">
                      Trade a diverse selection of cryptocurrencies to diversify
                      your portfolio.
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-fifth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">24/7 SUPPORT</span>
                    <span className="fetaure_inn_subhead">
                      Get round-the-clock assistance, ensuring you have help
                      whenever you need it, no matter the time zone.
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ">
                <div className="feature_card h-100">
                  <div className="feature_card_img">
                    <img
                      src={require("../assets/feature-sixth.webp")}
                      alt="Instant Trades"
                    />
                  </div>
                  <div className="feature_inn_main">
                    <span className="fetaure_inn_head">
                      USER-FRIENDLY INTERFACE
                    </span>
                    <span className="fetaure_inn_subhead">
                      Enjoy a smooth, intuitive platform designed for easy
                      navigation and seamless trading.
                    </span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </section>

        <section ref={advanceTradeRef} className="advance_trade_section">
          <div className="container">
            <div className="advance_newchang_title" data-aos="fade-up">
              <p>{t("simple_steps_to_start")} </p>

              <p className="advance_subcontent_newchang my-3">
                {t("seamless_journey")}
              </p>
            </div>

            {/* <div className="row adv_new_row" data-aos="fade-up"> */}
            <div className="row adv_new_row">
              <div className="col-lg-4">
                <div className="adv_card_main">
                  <div className="adv_abs_img">
                    <img
                      src={require("../assets/advance-first.webp")}
                      alt="signup"
                    />
                  </div>
                  <div className="adv_inn_main">
                    <span className="fetaure_inn_head">{t("sign_up")}</span>
                    <span className="adv_inn_subhead">
                      {t("create_account")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ">
                <div className="adv_card_main">
                  <div className="adv_abs_img">
                    <img
                      src={require("../assets/advance-second.webp")}
                      alt="signup"
                    />
                  </div>
                  <div className="adv_inn_main">
                    <span className="fetaure_inn_head">
                      {t("deposit_funds")}
                    </span>
                    <span className="adv_inn_subhead">
                      {t("add_crypto_or_fiat")}{" "}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ">
                <div className="adv_card_main">
                  <div className="adv_abs_img">
                    <img
                      src={require("../assets/advance-third.webp")}
                      alt="signup"
                    />
                  </div>
                  <div className="adv_inn_main">
                    <span className="fetaure_inn_head">
                      {t("start_trading_now")}
                    </span>
                    <span className="adv_inn_subhead">
                      {t("explore_markets")}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="down_new_main">
          <div className="container">
            <div className="row down_new_man">
              <div className="col-xl-4 col-lg-5  text-center">
                <div className="down_new_left">
                  <img
                    src={require("../assets/download-left-one.webp")}
                    // className="down_left_img"
                    alt="Download"
                  />
                  <span className="down_our_mob">{t("ourMobileApp")}</span>
                </div>
              </div>
              <div className="col-xl-8 col-lg-7">
                <div className="down_new_right">
                  <div className="down_new_right_intop">
                    <span className="down_in_head">
                      {t("take_trading_anywhere")}
                      <br /> {t("with_pitiklini")}
                    </span>
                    <div className="down_in_submain">
                      <div className="down_qr_main">
                        <img
                          src={require("../assets/down_qr.webp")}
                          alt="qr"
                          className="down_qr_img"
                        />
                      </div>
                      <div className="down_inrigh">
                        <span className="advance_subcontent_newchang">
                          {t("scan_to_download")}
                        </span>
                        <span className="down_ios_and">
                          {t("ios_and_android")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="down_right_bot">
                    <div className="down_bott_man">
                      <img
                        src={require("../assets/apple.webp")}
                        alt="IOS"
                        className="apple_down"
                      />
                      <span className="down_on_sp">
                        {t("download_on_app_store")} <br />
                        <span className="down_on_sp_dark">APP STORE</span>
                      </span>
                    </div>
                    <div className="down_bott_man">
                      <img
                        src={require("../assets/playstore.webp")}
                        alt="IOS"
                        className="apple_down"
                      />
                      <span className="down_on_sp">
                        {t("download_on_app_store")} <br />
                        <span className="down_on_sp_dark">PLAY STORE</span>
                      </span>
                    </div>
                    <div className="down_bott_man">
                      <img
                        src={require("../assets/android.webp")}
                        alt="IOS"
                        className="apple_down"
                      />
                      <span className="down_on_sp">
                        {t("download_apk")} <br />
                        <span className="down_on_sp_dark">APK</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={secureRef} className="ready_hero_section">
          <div className="container">
            <div className="text-center">
              <div className="ready_main">
                <span className="ready_span_head">{t("ready_to_start")}</span>
                <Link
                  to={loginCheck ? "/dashboard" : "/register"}
                  className="get_started_btn_ready"
                >
                  {t("get_start_now")}
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* footer */}
        <section className="footer_section">
          <Footer />
        </section>
      </main>
    </>
  );
}
