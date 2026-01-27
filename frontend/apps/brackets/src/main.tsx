import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule])

createRoot(document.getElementById("root")!).render(
  <ReactFlowProvider>
    <StrictMode>
      <App />
    </StrictMode> 
  </ReactFlowProvider>
);
