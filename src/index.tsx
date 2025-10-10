import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DashboardLineAnd } from "./screens/DashboardLineAnd";
import { AuthProvider } from "./lib/auth";
import { SelectionProvider } from "./lib/selection";
// Ensure Tailwind CSS is loaded so utility classes apply
import "../tailwind.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SelectionProvider>
          <DashboardLineAnd />
        </SelectionProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
