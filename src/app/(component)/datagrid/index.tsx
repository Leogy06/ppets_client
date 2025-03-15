import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface DataTableProps<T> {
  columns: GridColDef[];
  rows: T[];
  getRowId: (row: T) => number | string;
  pageSize?: number;
  loading: boolean;
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: (rowSelectionModel: number[]) => void;
}

const DataTable = <T,>({
  columns,
  rows,
  getRowId,
  pageSize = 5,
  checkboxSelection = false,
  onRowSelectionModelChange,
  loading = false,
}: DataTableProps<T>) => {
  return (
    <div className="h-[400px] w-full overflow-auto">
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        pageSizeOptions={[5, 10, 20]}
        initialState={{ pagination: { paginationModel: { pageSize } } }}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(rowSelectionModel) =>
          onRowSelectionModelChange?.(rowSelectionModel as number[])
        }
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

          "& .MuiDataGrid-footerContainer": {
            color: "black",
            border: "2px solid #ccc",
          },
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        getRowClassName={
          (params) =>
            params.indexRelativeToCurrentPage % 2 === 0
              ? "bg-gray-100" //light gray for even rows
              : "bg-white" //for odd rows
        }
      />
    </div>
  );
};

export default DataTable;
