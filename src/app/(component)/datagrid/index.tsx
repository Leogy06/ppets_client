import React from "react";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

interface DataTableProps<T> extends Partial<DataGridProps> {
  columns: GridColDef[];
  rows: T[];
  getRowId?: (row: T) => number | string;
  pageSize?: number;
  loading: boolean;
  checkboxSelection?: boolean;
  onRowSelectionModelChange?: (
    rowSelectionModel: GridRowSelectionModel
  ) => void;
  setRowLimit(limit: number): void;
  rowLimit: number;
}

const DataTable = <T,>({
  columns,
  rows,
  getRowId,
  checkboxSelection = false,
  onRowSelectionModelChange,
  loading = false,
  sx = {},
  rowLimit,
  setRowLimit,
}: DataTableProps<T>) => {
  return (
    <div className="h-[400px] w-full overflow-auto">
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode="server"
        rowCount={rows.length}
        paginationModel={{ pageSize: rowLimit, page: 0 }} // Ensure correct pagination model usage
        onPaginationModelChange={(model) => setRowLimit(model.pageSize)} // Use the correct event
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={(rowSelectionModel) =>
          onRowSelectionModelChange?.(rowSelectionModel)
        }
        disableRowSelectionOnClick
        loading={loading}
        sx={{
          // header style
          "& .MuiDataGrid-columnHeaders": {
            background: "#3A7CA5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#3A7CA5",
            color: "white",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-footerContainer": {
            color: "black",
            border: "2px solid #ccc",
          },
          ...sx,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0
            ? "bg-gray-100"
            : "bg-white"
        }
      />
    </div>
  );
};

export default DataTable;
