import { AgGridReact } from "ag-grid-react";
import { useMemo, useState } from "react";

export function SettingBrackets() {
  const [rowData, setRowData] = useState([
    {
      round: "Vòng 1 (1/128) – Last 256",
      bracket: "Thắng (Winner)",
      bestOf: "7",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Vòng 2 (1/64) – Last 128",
      bracket: "Thắng (Winner)",
      bestOf: "9",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Vòng 3 (1/32) – Last 64",
      bracket: "Thắng (Winner)",
      bestOf: "9",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Vòng 4 (1/16) – Last 32",
      bracket: "Thắng (Winner)",
      bestOf: "11",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Vòng 5 (1/8) – Last 16",
      bracket: "Thắng (Winner)",
      bestOf: "11",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Tứ kết (1/4) – Quarter Final",
      bracket: "Thắng (Winner)",
      bestOf: "13",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Bán kết (1/2) – Semi Final",
      bracket: "Thắng (Winner)",
      bestOf: "15",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
    {
      round: "Chung kết (1/1) – Final",
      bracket: "Thắng (Winner)",
      bestOf: "17",
      rule: "10 bi - WPA - Breakbox - Thắng phá"
    },
  ]);

  const columnDefs = useMemo(
    () => [
      {
        field: "round",
        headerName: "Vòng đấu",
        maxWidth: 260,
        sortable: true,
        filter: true,
      },
      {
        field: "bracket",
        headerName: "Nhánh",
        maxWidth: 180,
        cellStyle: (params: any) => ({
          color: params.value?.toLowerCase().includes("thắng")
            ? "#22c55e"
            : "#ef4444",
        }),
      },
      {
        field: "rule",
        headerName: "Thể thức",
        cellRenderer: (params: any) => (
          <input
            value={params.value}
            onChange={(e) => params.node.setDataValue("bestOf", e.target.value)}
            className="
              w-full
              px-3 py-2
              my-1
              text-sm
              rounded-md
              border border-accent-blue/40
              focus:border-accent-blue/60
              outline-none
              transition-colors
            "
          />
        ),
      },
      {
        field: "bestOf",
        headerName: "Chạm",
        maxWidth: 80,
        autoHeight: true,
        cellRenderer: (params: any) => (
          <input
            value={params.value}
            onChange={(e) => params.node.setDataValue("bestOf", e.target.value)}
            className="
              w-full
              px-3 py-2
              my-1
              text-sm
              rounded-md
              border border-accent-blue/40
              focus:border-accent-blue/60
              outline-none
              transition-colors
            "
          />
        ),
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      flex: 1,
      minWidth: 120,
      resizable: true,
      sortable: true,
    }),
    []
  );

  return (
    <div className="ag-theme-quartz-dark ">
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
