import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import Moment from "moment";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import { usePageLeaveConfirm } from "./usePageLeaveConfirm";
import DashboardLayout from "./DashboardLayout";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const MyOrdersTable = () => {
  const { t } = useTranslation();
  const [p2pOrders, setp2pOrders, p2pOrdersref] = useState([]);
  const [p2pcurrentpage, setp2pcurrentpage, p2pcurrentpageref] = useState(1);
  const [p2ptotalpages, setp2pTotalpages, p2ptotalpageref] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editLoader, setEditLoader] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const handleEdit = (item) => {
    setSelectedOrder({
      ...item,
    });
    setEditOpen(true);
  };
  const handleEditClose = () => {
    if (!editLoader) {
      setEditOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDelete = (item) => {
    setDeleteOrder(item);
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    if (!deleteLoader) {
      setDeleteOpen(false);
      setDeleteOrder(null);
    }
  };

  // usePageLeaveConfirm(
  //   "Are you sure you want to leave P2P?",
  //   "/myorders",
  //   true,
  //   [
  //     "/p2p/order/:id",
  //     "/processorders",
  //     "/myhistory",
  //     "/p2p/chat/:id",
  //     "/p2p",
  //     "/p2p/dispute/:id",
  //     "/postad",
  //     "/Paymentmethod",
  //   ],
  // );

  useEffect(() => {
    getp2pOrders(1); // Load first page initially
  }, []);

  const getp2pOrders = async (page = 1) => {
    try {
      var data = {
        apiUrl: apiService.p2pOrders,
        payload: { FilPerpage: 5, FilPage: page },
      };
      var p2p_orders_list = await postMethod(data);
      if (p2p_orders_list.status === true) {
        setp2pOrders(p2p_orders_list.returnObj.Message);
        setp2pTotalpages(p2p_orders_list.returnObj.pages);
        setp2pcurrentpage(page);
      }
    } catch (error) {
      console.error("Error fetching P2P orders:", error);
    }
  };

  const updateP2pOrder = async () => {
    try {
      if (!selectedOrder) return;

      const totalAmount = Number(selectedOrder.totalAmount);
      const price = Number(selectedOrder.price);
      const fromLimit = Number(selectedOrder.fromLimit);
      const toLimit = Number(selectedOrder.toLimit);

      if (
        !Number.isFinite(totalAmount) ||
        totalAmount <= 0 ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(fromLimit) ||
        fromLimit <= 0 ||
        !Number.isFinite(toLimit) ||
        toLimit <= 0
      ) {
        showerrorToast("Please enter valid order values");
        return;
      }
      if (fromLimit > toLimit) {
        showerrorToast(
          "Minimum quantity cannot be greater than maximum quantity",
        );
        return;
      }
      if (toLimit > totalAmount) {
        showerrorToast(
          "Maximum quantity cannot be greater than total quantity",
        );
        return;
      }
      setEditLoader(true);

      const data = {
        apiUrl: apiService.updateP2pOrder,
        payload: {
          orderId: selectedOrder.orderId,
          totalAmount,
          price,
          fromLimit,
          toLimit,
        },
      };

      const resp = await postMethod(data);

      setEditLoader(false);

      if (resp.status === true) {
        showsuccessToast(resp.Message);

        setEditOpen(false);
        setSelectedOrder(null);

        // Refresh current page
        getp2pOrders(p2pcurrentpageref.current);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      setEditLoader(false);
      console.error("Error updating P2P order:", error);
      showerrorToast("Something went wrong");
    }
  };

  const deleteP2pOrder = async () => {
    try {
      if (!deleteOrder) return;
      setDeleteLoader(true);
      const data = {
        apiUrl: apiService.deleteP2pOrder,
        payload: {
          orderId: deleteOrder.orderId,
        },
      };

      const resp = await postMethod(data);
      setDeleteLoader(false);
      if (resp.status === true) {
        showsuccessToast(resp.Message);
        setDeleteOpen(false);
        setDeleteOrder(null);
        // Refresh current page
        getp2pOrders(p2pcurrentpageref.current);
      } else {
        showerrorToast(resp.Message);
      }
    } catch (error) {
      setDeleteLoader(false);
      console.error("Error deleting P2P order:", error);
      showerrorToast("Something went wrong");
    }
  };

  const [orderType, setOrderType] = useState("buy");

  const handlePageChange = (event, page) => {
    getp2pOrders(page);
  };

  let navigate = useNavigate();

  const navpage = async (link) => {
    navigate("/p2p/order/" + link);
  };

  const navchatpage = (link) => {
    navigate(link);
  };

    const showsuccessToast = (message) => {
      toast.dismiss();
      toast.success(message);
    };
  
    const showerrorToast = (message) => {
      toast.dismiss();
      toast.error(message);
    };

  return (
    <>
      <DashboardLayout>
        <section className="asset_section">
          <div className="buy_head">
            <div className="w-full">
              <div className="bg-black rounded-xl p-4">
                <div className="p2p_header_row flex justify-between items-center mb-6">
                  <div>
                    <h2 className="p2p_main_title text-[#BD7F10]">
                      {t("p2pplatform")}
                    </h2>
                    <h3 className="p2p_main_title text-[#ffff]">
                      {t("OrderHistory")}
                    </h3>
                    <span className="p2p_subtitle text-[#BD7F10]">
                      {t("OrderHistorydetals")}
                    </span>
                  </div>
                  {/* <div className="flex space-x-4">
                    <Link
                      to={loginStatus ? "/postad" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      + Post Advertisement
                    </Link>
                    <Link
                      to={loginStatus ? "/Paymentmethod" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      Payment Method
                    </Link>
                    <Link
                      to={loginStatus ? "/processorders" : "/login"}
                      className="post-ad-btn bg-[#BD7F10] text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      {t("orders")}
                    </Link>
                  </div> */}
                </div>

                <div className="p2p_header_row flex justify-between items-center mb-6">
                  <div className="flex rounded-2xl bg-[#060913] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                    {/* <button
                      type="button"
                      onClick={() => navchatpage("/processorders")}
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "sell"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("processOrders")}
                    </button> */}

                    <button
                      type="button"
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "buy"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myOrders")}
                    </button>

                    <button
                      type="button"
                      onClick={() => navchatpage("/myhistory")}
                      className={`flex-1.5 rounded-xl px-6 py-3 text-sm font-extrabold uppercase tracking-[0.22em] transition-all duration-200 ${
                        orderType === "sell"
                          ? "bg-[#c98a11] text-[#1a1a1a] shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]"
                          : "text-[#7f8798] hover:text-white"
                      }`}
                    >
                      {t("myHistory")}
                    </button>
                  </div>
                </div>
                {/* <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[linear-gradient(180deg,#141b2d_0%,#11182a_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"> */}
                <div className="overflow-hidden rounded-[28px] border border-white/5 bg-[#181a20] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="overflow-x-auto">
                    <table className="table-auto w-max min-w-full border-separate border-spacing-0">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("currency")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("dateTime")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("quantity")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("price")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("unit")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("orderType")}
                          </th>
                          <th className="px-4 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("status")}
                          </th>
                          <th className="px-4 py-4 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] newtablehead_chngtheme">
                            {t("Action")}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {p2pOrdersref.current &&
                        p2pOrdersref.current.length > 0 ? (
                          p2pOrdersref.current.map((item, i) => (
                            <tr
                              key={i}
                              onClick={() => navpage(item.orderId)}
                              className="border-t border-white/5 align-middle transition-colors hover:bg-white/[0.02]"
                            >
                              <td className="table-flex">
                                <img
                                  src={item.fromCurrency.Currency_image}
                                  alt=""
                                />
                                <div className="table-opt-name">
                                  <h4 className="opt-name font_14">
                                    {item.fromCurrency.currencyName}
                                  </h4>
                                  <h3 className="opt-sub font_14">
                                    {item.fromCurrency.currencySymbol}
                                  </h3>
                                </div>
                              </td>
                              <td className="opt-percent font_14 table_center_text pad-left-23 text-nowrap">
                                {Moment(item.createdAt).format("lll")}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23">
                                {parseFloat(item.totalAmount).toFixed(4)}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23">
                                {parseFloat(item.price).toFixed(2)}{" "}
                                {item.secondCurrnecy}
                              </td>
                              <td className="opt-term font_14 table_center_text pad-left-23 text-nowrap">
                                {parseFloat(item.fromLimit).toFixed(4)} -{" "}
                                {parseFloat(item.toLimit).toFixed(4)}{" "}
                                {item.firstCurrency}
                              </td>
                              <td
                                className={`opt-term font_14 table_center_text pad-left-23 ${
                                  item.orderType === "buy"
                                    ? "text-green"
                                    : "text-sell-red"
                                }`}
                              >
                                {item.orderType}
                              </td>
                              <td className="opt-btn-flex opt-term table-action pad-left-23 text-center">
                                {item.status == "active" ? (
                                  <span className="text-yellow">
                                    {t("active")}
                                  </span>
                                ) : item.status == "filled" ? (
                                  <span className="text-green">
                                    {t("filled")}
                                  </span>
                                ) : item.status == "partially" ? (
                                  <span className="text-orange">
                                    {t("partially")}
                                  </span>
                                ) : (
                                  <span className="text-red">
                                    {t("cancelled")}
                                  </span>
                                )}
                              </td>
                              <td
                                className="opt-term table-action text-center px-4 py-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {item.status === "active" ? (
                                  <div className="flex items-center justify-center gap-3">
                                    {/* Edit */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(item);
                                      }}
                                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#BD7F10]/10 text-[#BD7F10] hover:bg-[#BD7F10] hover:text-black transition"
                                      title="Edit"
                                    >
                                      <i className="ri-edit-line text-lg"></i>
                                    </button>

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item);
                                      }}
                                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                                      title="Delete"
                                    >
                                      <i className="ri-delete-bin-line text-lg"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-white/40 text-xs">
                                    -
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={8}
                              className="px-4 py-10 text-center text-sm text-white/60"
                            >
                              {/* <div className="empty_data">
                                <div className="empty_data_img">
                                  <img
                                    src={require("../assets/No-data.webp")}
                                    width="100px"
                                  />
                                </div>
                                <div className="no_records_text"> */}
                              {t("noRecordsFound")}
                              {/* </div>
                              </div> */}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {p2pOrdersref.current.length > 0 ? (
                      // <div className="pagination">
                      <div className="flex justify-center mt-6">
                        <Stack spacing={2}>
                          <Pagination
                            count={p2ptotalpageref.current}
                            page={p2pcurrentpageref.current}
                            onChange={handlePageChange}
                            size="small"
                            sx={{
                              "& .MuiPagination-ul": { gap: "6px" },
                              "& .MuiPaginationItem-root": {
                                color: "#fff",
                                borderRadius: "6px",
                                minWidth: "34px",
                                height: "34px",
                              },
                              "& .MuiPaginationItem-root:hover": {
                                backgroundColor: "#BD7F10",
                                color: "#000",
                              },
                              "& .Mui-selected": {
                                backgroundColor: "#BD7F10 !important",
                                color: "#000",
                                fontWeight: "600",
                              },
                              "& .MuiPaginationItem-icon": {
                                color: "inherit",
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
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            open={editOpen}
            onClose={handleEditClose}
            aria-labelledby="edit-p2p-order-modal"
          >
            <Box sx={style} className="modals_support">
              {/* <div className="bg-[#111318] rounded-2xl border border-[#1E2028] p-6 w-[500px] max-w-[95vw] mx-auto mt-[10vh]"> */}
              <div className="support-modal">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-semibold">
                    {t("editp2porder")}
                  </h3>

                  <button
                    type="button"
                    onClick={handleEditClose}
                    disabled={editLoader}
                    className="text-white/60 hover:text-white text-xl"
                  >
                    <i className="fa-regular fa-circle-xmark"></i>
                  </button>
                </div>

                {selectedOrder && (
                  <div className="flex flex-col gap-5">
                    {/* Currency */}
                    <div>
                      <label className="block text-[#B1B5C3] text-sm mb-2">
                        {t("Currency")}
                      </label>

                      <div className="bg-[#23262F] border border-[#353945] rounded-lg h-[50px] flex items-center px-4">
                        <span className="text-white">
                          {selectedOrder.firstCurrency} /{" "}
                          {selectedOrder.secondCurrnecy}
                        </span>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div>
                      <label className="block text-[#B1B5C3] text-sm mb-2">
                        {t("totalquantity")}
                      </label>

                      <input
                        type="number"
                        value={selectedOrder.totalAmount ?? ""}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            totalAmount: e.target.value,
                          }))
                        }
                        className="w-full h-[50px] bg-[#23262F] border border-[#353945] rounded-lg px-4 text-white outline-none focus:border-[#BD7F10]"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-[#B1B5C3] text-sm mb-2">
                        {t("price")}
                      </label>

                      <input
                        type="number"
                        value={selectedOrder.price ?? ""}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className="w-full h-[50px] bg-[#23262F] border border-[#353945] rounded-lg px-4 text-white outline-none focus:border-[#BD7F10]"
                      />
                    </div>

                    {/* From Limit */}
                    <div>
                      <label className="block text-[#B1B5C3] text-sm mb-2">
                        {t("minimumQuantity")}
                      </label>

                      <input
                        type="number"
                        value={selectedOrder.fromLimit ?? ""}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            fromLimit: e.target.value,
                          }))
                        }
                        className="w-full h-[50px] bg-[#23262F] border border-[#353945] rounded-lg px-4 text-white outline-none focus:border-[#BD7F10]"
                      />
                    </div>

                    {/* To Limit */}
                    <div>
                      <label className="block text-[#B1B5C3] text-sm mb-2">
                        {t("maximumQuantity")}
                      </label>

                      <input
                        type="number"
                        value={selectedOrder.toLimit ?? ""}
                        onChange={(e) =>
                          setSelectedOrder((prev) => ({
                            ...prev,
                            toLimit: e.target.value,
                          }))
                        }
                        className="w-full h-[50px] bg-[#23262F] border border-[#353945] rounded-lg px-4 text-white outline-none focus:border-[#BD7F10]"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-3">
                      <button
                        type="button"
                        onClick={handleEditClose}
                        disabled={editLoader}
                        className="px-6 py-3 rounded-lg border border-[#353945] text-[#B1B5C3] hover:text-white"
                      >
                        {t("cancel")}
                      </button>

                      <button
                        type="button"
                        onClick={updateP2pOrder}
                        disabled={editLoader}
                        className="px-6 py-3 rounded-lg bg-[#BD7F10] text-black font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        {editLoader ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Box>
          </Modal>
          <Modal
            open={deleteOpen}
            onClose={handleDeleteClose}
            aria-labelledby="delete-p2p-order-modal"
          >
            <Box sx={style} className="modals_support">
              {/* <div className="bg-[#111318] rounded-2xl border border-[#1E2028] p-6 w-[450px] max-w-[95vw] mx-auto mt-[20vh]"> */}
              <div className="support-modal">
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <i className="ri-delete-bin-line text-red-500 text-3xl"></i>
                  </div>

                  <h3 className="text-white text-xl font-semibold mb-2">
                    {t("deleteorder")}
                  </h3>

                  <p className="text-[#B1B5C3] text-sm mb-6">
                    {t("deleteorderdescr")}
                  </p>

                  {deleteOrder && (
                    <div className="w-full bg-[#23262F] rounded-lg p-4 mb-6 text-left">
                      <div className="flex justify-between mb-2">
                        <span className="text-[#B1B5C3]">{t("orderid")}</span>

                        <span className="text-white">
                          {deleteOrder.orderId}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#B1B5C3]">{t("quantity")}</span>

                        <span className="text-white">
                          {parseFloat(deleteOrder.totalAmount).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleDeleteClose}
                      disabled={deleteLoader}
                      className="px-6 py-3 rounded-lg border border-[#353945] text-[#B1B5C3] hover:text-white"
                    >
                      {t("cancel")}
                    </button>

                    <button
                      type="button"
                      onClick={deleteP2pOrder}
                      disabled={deleteLoader}
                      className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50"
                    >
                      {deleteLoader ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </section>
      </DashboardLayout>
    </>
  );
};

export default MyOrdersTable;
