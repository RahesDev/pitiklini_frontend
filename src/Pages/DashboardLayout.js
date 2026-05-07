import React from "react";
import Header from "./Header";
import Side_bar from "./Side_bar";

const DashboardLayout = ({ children }) => (
  <>
    <section>
      <Header />
    </section>
    <main className="dashboard_main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 padlef_0_col">
            <Side_bar />
          </div>
          <div className="col-lg-10 padin_lefrig_dash">{children}</div>
        </div>
      </div>
    </main>
  </>
);

export default React.memo(DashboardLayout);
