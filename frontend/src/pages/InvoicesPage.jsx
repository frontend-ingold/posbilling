import { useNavigate } from "react-router-dom";
import { InvoiceList } from "../components/InvoiceList.jsx";
import { usePos } from "../hooks/usePos.js";

export const InvoicesPage = () => {
  const { invoices, beginInvoiceEdit } = usePos();
  const navigate = useNavigate();

  const handleEditInvoice = (invoiceId) => {
    beginInvoiceEdit(invoiceId);
    navigate("/");
  };

  return <InvoiceList invoices={invoices} onEditInvoice={handleEditInvoice} />;
};
