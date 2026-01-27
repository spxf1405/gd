import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";

export function FeeTable() {
  const [rowData, setRowData] = useState([
    {
      id: 1,
      nationality: "VN",
      name: "Nguyễn Văn A",
      fee: "500.000",
      paid: true,
    },
    {
      id: 2,
      nationality: "JP",
      name: "Sato Ken",
      fee: "500.000",
      paid: false,
    },
    {
      id: 3,
      nationality: "KR",
      name: "Kim Min Soo",
      fee: "",
      paid: false,
    },
  ]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "STT",
        valueGetter: (params: any) => params.node.rowIndex + 1,
        maxWidth: 80,
      },
      {
        field: "nationality",
        headerName: "Quốc tịch",
        maxWidth: 120,
      },
      {
        field: "name",
        headerName: "Tên",
        minWidth: 180,
      },
      {
        field: "fee",
        headerName: "Lệ phí",
        cellRenderer: (params: any) => (
          <input
            value={params.value || ""}
            onChange={(e) =>
              params.node.setDataValue("fee", e.target.value)
            }
            placeholder="Nhập lệ phí"
            className="
              w-full
              px-3 py-2
              text-sm
              rounded-md
              border border-blue-500/40
              focus:border-blue-500/70
              outline-none
              bg-transparent
            "
          />
        ),
      },
      {
        field: "paid",
        headerName: "Đã đóng lệ phí",
        maxWidth: 160,
        cellRenderer: (params: any) => (
          <span
            className={`font-semibold ${
              params.value ? "text-green-500" : "text-gray-400"
            }`}
          >
            {params.value ? "Đã đóng" : "Chưa đóng"}
          </span>
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      resizable: true,
      sortable: true,
    }),
    []
  );

  return (
    <div className="ag-theme-quartz-dark">
      <AgGridReact
        domLayout="autoHeight"
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
      />
    </div>
  );
}
