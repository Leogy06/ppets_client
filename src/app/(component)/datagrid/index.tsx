import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataTableProps {
  columns: GridColDef[];
  rows: [];
  pageSize?: number;
  checkboxSelection?: boolean;
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  pageSize = 5,
  checkboxSelection = false,
  loading = false,
}) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 20]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        checkboxSelection={checkboxSelection}
        disableRowSelectionOnClick
        loading={loading}
        sx={{
          // header style
          "& .MuiDataGrid-columnHeaders": {
            background: "#4169e1", // Change this to your desired color
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#375ba5", // **Cell color inside headers**
            color: "white", // Text color for better contrast
            // Optional: add borders between header cells
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold", // Make header text bold
            textTransform: "uppercase",
          },
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
      />
    </div>
  );
};

export default DataTable;
