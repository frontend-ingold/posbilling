import { BarcodeScannerForm } from "../components/BarcodeScannerForm.jsx";
import { BillingCart } from "../components/BillingCart.jsx";
import { ReceiptPanel } from "../components/ReceiptPanel.jsx";
import { usePos } from "../hooks/usePos.js";

export const BillingPage = () => {
  const {
    cartItems,
    latestInvoice,
    editingInvoice,
    loading,
    checkoutLoading,
    error,
    totals,
    addByBarcode,
    updateQuantity,
    removeItem,
    checkout,
    printReceipt,
    beginInvoiceEdit,
    cancelInvoiceEdit
  } = usePos();

  return (
    <div className="page-grid">
      <div className="stack">
        {error ? <div className="error-banner">{error}</div> : null}
        <BarcodeScannerForm onScan={addByBarcode} loading={loading} />
        <BillingCart
          items={cartItems}
          totals={totals}
          editingInvoice={editingInvoice}
          onQuantityChange={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={checkout}
          onCancelEdit={cancelInvoiceEdit}
          checkoutLoading={checkoutLoading}
        />
      </div>
      <ReceiptPanel
        invoice={latestInvoice}
        isEditing={Boolean(editingInvoice)}
        onEdit={() => latestInvoice && beginInvoiceEdit(latestInvoice.id)}
        onPrint={printReceipt}
      />
    </div>
  );
};
