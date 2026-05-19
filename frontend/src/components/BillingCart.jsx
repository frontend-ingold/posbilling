export const BillingCart = ({
  items,
  totals,
  editingInvoice,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onCancelEdit,
  checkoutLoading
}) => {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Cart</p>
          <h2>{editingInvoice ? `Edit ${editingInvoice.invoiceNumber}` : "Current Cart"}</h2>
        </div>
        <div className="action-row">
          {editingInvoice ? (
            <button
              type="button"
              className="button-secondary"
              onClick={onCancelEdit}
              disabled={checkoutLoading}
            >
              Cancel Edit
            </button>
          ) : null}
          <button type="button" onClick={onCheckout} disabled={!items.length || checkoutLoading}>
            {checkoutLoading ? "Processing..." : editingInvoice ? "Update Invoice" : "Checkout"}
          </button>
        </div>
      </div>

      {items.length ? (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.barcode}>
                    <td>{item.name}</td>
                    <td>{item.barcode}</td>
                    <td>Rs. {item.price.toFixed(2)}</td>
                    <td>
                      <input
                        className="qty-input"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          onQuantityChange(item.barcode, Number(event.target.value))
                        }
                      />
                    </td>
                    <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="button-ghost"
                        onClick={() => onRemoveItem(item.barcode)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals">
            <div>
              <span>Subtotal</span>
              <strong>Rs. {totals.subtotal.toFixed(2)}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>Rs. {totals.tax.toFixed(2)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>Rs. {totals.total.toFixed(2)}</strong>
            </div>
          </div>
        </>
      ) : (
        <p className="empty-state">
          {editingInvoice
            ? "This invoice has no items. Add products or cancel edit."
            : "Scan products to add them to the cart."}
        </p>
      )}
    </section>
  );
};
