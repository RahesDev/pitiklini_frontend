import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import { rewardTable } from "../utils/mockData";
import { useTranslation } from "react-i18next";

const RewardTable = () => {
    const { t } = useTranslation();
  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head">
            <th> {t('currency')}</th>
            <th className="opt-nowrap txt-center pad-left-23">{t('amount')}</th>
            <th className="opt-nowrap txt-center pad-left-23">  {t('type')}</th>
            <th className="opt-btn-flex table-action ">{t('dateTime')}</th>
          </tr>
        </thead>

        <tbody>
          {rewardTable.map((options) => {
            return (
              <tr key={options.id}>
                <td className="table-flex">
                  <img src={require(`../assets/${options.optImg}`)} alt="" />
                  <div className="table-opt-name">
                    <h4 className="opt-name font_14">{options.optName}</h4>
                    <h3 className="opt-sub font_14">{options.optSub}</h3>
                  </div>
                </td>

                <td className="opt-percent font_14 table_center_text pad-left-23">
                  {options.fiatAccount}
                </td>
                <td className="opt-term font_14 table_center_text pad-left-23">
                  {options.cryptoAccount}
                </td>
                <td className="opt-date opt-btn-flex table-action pad-left-23 text-white">
                  {options.total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <Stack spacing={2}>
          <Pagination
            // count={Math.ceil(total / recordPerPage)}
            // page={currentPage}
            // onChange={handlePageChange}
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
                backgroundColor: "#ffc630 !important", // Background color for selected item
                color: "#000", // Text color for selected item
                "&:hover": {
                  backgroundColor: "#ffc630",
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
    </div>
  );
};

export default RewardTable;
