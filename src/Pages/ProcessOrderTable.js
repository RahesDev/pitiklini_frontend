import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Moment from "moment";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProcessOrderTable = () => {
     const { t } = useTranslation();
  const [notification, Setnotification, notificationref] = useState([]);
  const [notifyCurrentPage, setnotifyCurrentPage, notifyCurrentPageref] =
    useState(1); // Start with page 1
  const [notifytotalpage, Setnotifytotalpage, notifytotalpageref] = useState(0);

  useEffect(() => {
    notify(notifyCurrentPage);
  }, [notifyCurrentPage]);

  const handlePageChange = (event, value) => {
    setnotifyCurrentPage(value);
  };

  const notify = async (page = 1) => {
    var Notification = {
      apiUrl: apiService.getp2pnotification,
      payload: { page, limit: 5 },
    };
    var resp = await postMethod(Notification);
    if (resp.status) {
      Setnotification(resp.data);
      Setnotifytotalpage(Math.ceil(resp.total / 5)); // Set total pages based on the total notifications and the limit
    } else {
      Setnotification([]);
    }
  };

  let navigate = useNavigate();

  const navchatpage = (link) => {
    navigate(link);
  };

  return (
    <>
      <Header />
      <main className="dashboard_main">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <section className="asset_section">
                <div className="row">
                  {/* head */}
                  <div className="p2p-order-head">
                    <Link to="/p2p">
                      <div className="p2p-order-title text-p2p">{t('p2p')}</div>
                    </Link>
                    <div className="p2p-side-arrow">
                      <i className="ri-arrow-right-s-line"></i>
                    </div>
                    <div className="p2p-order-title text-order">{t('orders')}</div>
                  </div>

                  {/* nav tabs */}
                  <div className="mt-4">
                    <ul className="history-lists">
                      <Link
                        to="/processorders"
                        className="history-links active"
                      >
                        {t('processOrders')}
                      </Link>
                      <Link to="/myorders" className="history-links">
                        {t('myOrders')}
                      </Link>
                      <Link to="/myhistory" className="history-links">
                        {t('myHistory')}
                      </Link>
                    </ul>
                  </div>

                  <div className="table-responsive table-cont dash_table_content mt-0 p-0">
                    <table className="table">
                      <thead>
                        <tr className="stake-head process-head">
                          <th className="table_center_text">{t('sNo')}</th>
                          <th className="table_center_text text-nowrap pad-x-20">
                            {t('dateTime')}
                          </th>
                          <th className="table_center_text pad-x-20">From</th>
                          <th className="table_center_text">
                            {t('message')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {notificationref.current &&
                        notificationref.current.length > 0 ? (
                          notificationref.current.map((item, i) => (
                            <tr key={i} onClick={() => navchatpage(item.link)} className="link_text">
                              <td className="table-flex opt-term">{i + 1}</td>
                              <td className="opt-term font_14 table_center_text">
                                {Moment(item.createdAt).format("lll")}
                              </td>
                              <td className="opt-term font_14 table_center_text">
                                {item.from_user_name}
                              </td>
                              <td className="table_center_text text-white">
                                <div className="opt-action-normal">
                                  {item.message}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                          <td colSpan={4} className="text-center py-5">
                            <div className="empty_data">
                              <div className="empty_data_img">
                                <img
                                  src={require("../assets/No-data.webp")}
                                  width="100px"
                                />
                              </div>
                              <div className="no_records_text">
                                {t('noRecordsFound')}
                              </div>
                            </div>
                          </td>
                        </tr>
                        )}
                      </tbody>
                    </table>

                    {/* <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={notifytotalpageref.current}
                          page={notifyCurrentPageref.current}
                          onChange={handlePageChange}
                          size="small"
                          renderItem={(item) => (
                            <PaginationItem
                              slots={{
                                previous: ArrowBackIcon,
                                next: ArrowForwardIcon,
                              }}
                              {...item}
                            />
                          )}
                        />
                      </Stack>
                    </div> */}
                    {notificationref.current.length > 0 ? (
                    <div className="pagination">
                      <Stack spacing={2}>
                        <Pagination
                          count={notifytotalpageref.current}
                          page={notifyCurrentPageref.current}
                          onChange={handlePageChange}
                          size="small"
                          sx={{
                            "& .MuiPaginationItem-root": {
                              color: "#fff", // Default text color for pagination items
                              // backgroundColor: "#2D1E23",
                              // "&:hover": {
                              //   backgroundColor: "#453a1f",
                              //   color: "#ffc630",
                              // },
                            },
                            "& .Mui-selected": {
                              backgroundColor: "#BD7F10 !important", // Background color for selected item
                              color: "#000", // Text color for selected item
                              "&:hover": {
                                backgroundColor: "#BD7F10",
                                color: "#000",
                              },
                            },
                            "& .MuiPaginationItem-ellipsis": {
                              color: "#fff", // Color for ellipsis
                            },
                            "& .MuiPaginationItem-icon": {
                              color: "#fff", // Color for icon (if present)
                            },
                          }}
                          // renderItem={(item) => (
                          //   <PaginationItem
                          //     slots={{
                          //       previous: ArrowBackIcon,
                          //       next: ArrowForwardIcon,
                          //     }}
                          //     {...item}
                          //   />
                          // )}
                        />
                      </Stack>
                    </div>
                    ) : ("")}
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

export default ProcessOrderTable;
