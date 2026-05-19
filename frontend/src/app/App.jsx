import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell.jsx";
import { BillingPage } from "../pages/BillingPage.jsx";
import { InventoryPage } from "../pages/InventoryPage.jsx";
import { InvoicesPage } from "../pages/InvoicesPage.jsx";

export const App = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<BillingPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
