import React from "react";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import { assetList, walletViewData } from "../utils/mockData";

const WalletViewTable = () => {
  return (
    <div className="table-responsive table-cont">
      <table className="table">
        <thead>
          <tr className="stake-head ">
            <th>Wallet</th>
            <th className="opt-nowrap txt-center pad-left-23 pad-l-100">
              Amount
            </th>
            <th className="opt-nowrap txt-center pad-left-23  pad-l-100">
              Ratio
            </th>
            <th className="opt-btn-flex table-action p-r-25">Action</th>
          </tr>
        </thead>

        <tbody>
          {walletViewData.map((options) => {
            return (
              <tr key={options.id}>
                <td className="table-flex">
                  <img src={require(`../assets/${options.walletImg}`)} alt="" />
                  <div className="table-opt-name">
                    <h4 className="opt-name  font_14">{options.walletTitle}</h4>
                  </div>
                </td>

                <td className="opt-term  font_14 table_center_text pad-left-23 pad-l-100">
                  <div>{options.walletAmount}</div>
                  <div className="txt-lgt ">$0.00</div>
                </td>
                <td className="opt-term  font_14 table_center_text pad-left-23 pad-l-100">
                  {options.ratio}
                </td>
                <td className="opt-btn-flex table-action pad-left-23">
                  <button className="asset-list-btn">Trade</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* <div className="pagination">
        <Stack spacing={2}>
          <Pagination
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
              },
              "& .Mui-selected": {
                backgroundColor: "#ffc630 !important", 
                color: "#000", 
                "&:hover": {
                  backgroundColor: "#ffc630",
                  color: "#000",
                },
              },
              "& .MuiPaginationItem-ellipsis": {
                color: "#fff",
              },
              "& .MuiPaginationItem-icon": {
                color: "#fff", 
              },
            }}
          />
        </Stack>
      </div> */}
    </div>
  );
};

export default WalletViewTable;
