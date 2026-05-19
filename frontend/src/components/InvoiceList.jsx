export const InvoiceList = ({ invoices, onEditInvoice }) => {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Invoices</p>
          <h2>Invoice History</h2>
        </div>
      </div>

      {invoices.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{new Date(invoice.createdAt).toLocaleString()}</td>
                  <td>{invoice.items.length}</td>
                  <td>Rs. {invoice.total.toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => onEditInvoice(invoice.id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">No invoices created yet.</p>
      )}
    </section>
  );
};
