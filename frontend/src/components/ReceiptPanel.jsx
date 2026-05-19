export const ReceiptPanel = ({ invoice, isEditing, onEdit, onPrint }) => {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Receipt</p>
          <h2>Latest Invoice</h2>
        </div>
        <div className="action-row">
          <button
            type="button"
            className="button-secondary"
            onClick={onEdit}
            disabled={!invoice || isEditing}
          >
            {isEditing ? "Editing Invoice" : "Edit Invoice"}
          </button>
          <button type="button" onClick={onPrint} disabled={!invoice}>
            Print Receipt
          </button>
        </div>
      </div>

      {invoice ? (
        <div id="receipt-content" className="receipt">
          <div className="receipt-header">
            <h3>{invoice.invoiceNumber}</h3>
            <p>{new Date(invoice.updatedAt || invoice.createdAt).toLocaleString()}</p>
            <p>Cashier: {invoice.cashier}</p>
          </div>

          <div className="receipt-lines">
            {invoice.items.map((item) => (
              <div key={item.barcode} className="receipt-line">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <strong>Rs. {item.lineTotal.toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="receipt-total">
            <span>Total</span>
            <strong>Rs. {invoice.total.toFixed(2)}</strong>
          </div>
        </div>
      ) : (
        <p className="empty-state">Generate an invoice to preview the receipt.</p>
      )}
    </section>
  );
};
