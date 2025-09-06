import React, { useEffect } from "react";
import useState from "react-usestateref";
import { env } from "../core/service/envconfig";
import { widget } from "../core/lib/chart/charting_library/charting_library.min";
function Home() {
    const [theme, setTheme] = useState("Dark");

    const tvWidget = null;

    useEffect(() => {
        fetchTheme();
        if (tvWidget !== null) {
            tvWidget.remove();
            tvWidget = null;
        }
    }, []);

    const getLanguageFromURL = () => {
        const regex = new RegExp("[\\?&]lang=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null
            ? null
            : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    const buildchart = (theme, pair) => {
        const widgetOptions = {
            symbol: pair,
            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
                env.apiHost + "chartapi/chart"
            ),
            interval: pair == "USDT_INR" ? "240" : "1",
            container_id: "tv_chart_container",
            library_path: "/charting_library/",
            locale: getLanguageFromURL() || "en",
            disabled_features: ["use_localstorage_for_settings"],
            enabled_features: ["study_templates"],
            charts_storage_url: "",
            charts_storage_api_version: "1.1",
            client_id: "tradingview.com",
            user_id: "public_user_id",
            fullscreen: false,
            //autosize: true,
            width: "100%",
            height: "518",
            studies_overrides: {},
            loading_screen: { backgroundColor: "#17171A" },
            theme: theme,
            toolbar_bg: "#17171A",
            timezone: "Asia/Kolkata",
            overrides: {
                "paneProperties.background": "#17171A",
                "paneProperties.vertGridProperties.color": "transparent",
                "paneProperties.horzGridProperties.color": "transparent",
            },
        };

        if (theme == "White") {
            delete widgetOptions.toolbar_bg;
            delete widgetOptions.overrides;
        }

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute("title", "Click to show a notification popup");
                button.classList.add("apply-common-tooltip");
                button.addEventListener("click", () =>
                    tvWidget.showNoticeDialog({
                        title: "Notification",
                        body: "TradingView Charting Library API works correctly",
                        callback: () => {
                            console.log("Noticed!");
                        },
                    })
                );
            });
        });
    };

    const fetchTheme = () => {
        const url = window.location.href;
        const fetchPair = url.split("tradechart/")[1];
        let symbol = fetchPair;
        let themeValue = "Dark";
        buildchart(themeValue, symbol);
    };

    return (
        <>
            <div className="chart_trade">
                <div id="tv_chart_container"></div>
            </div>
        </>
    );
}
export default Home;
