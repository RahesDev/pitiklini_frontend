import React from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";
import { t } from "i18next";

const Settings = () => {
  return (
    <>
      <section>
        <Header />
      </section>

      <main className="dashboard_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-2">
              <Side_bar />
            </div>

            <div className="col-lg-10">
              <section className="asset_section">
                <div className="row">
                  <div className="settings">
                    <div className="settings_head">
                      <span className="reward-title">{t("settings")}</span>
                    </div>
                    {/* <div className="setting-lang">
                      <div>
                        <h5 className="set-title">Language</h5>
                        <h6 className="set-content width-50">
                          Your language selection applies to FIDEX emails,
                          in-app notifications and all devices you're logged in
                          to.
                        </h6>
                      </div>
                      <div className="set-english">
                        <span className="set-content">English</span>
                        <span className="set-icon">
                          <i class="fa-solid fa-caret-down"></i>
                        </span>
                      </div>
                    </div> */}
                    {/* <div className="setting-lang">
                      <div>
                        <h5 className="set-title">Currency</h5>
                      </div>
                      <div>
                        <span className="set-content">USD</span>
                        <span className="set-icon">
                          <i class="fa-solid fa-caret-down"></i>
                        </span>
                      </div>
                    </div> */}
                    <div className="setting-lang">
                      <div>
                        <h5 className="set-title">{t("notification")}</h5>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          name=""
                          id="toggle-notify"
                          className="toggle-check"
                        />
                        <label
                          htmlFor="toggle-notify"
                          className="toggle-notification"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Settings;
