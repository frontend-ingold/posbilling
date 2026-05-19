export const calculateLineTotal = (price, quantity) =>
  Number((price * quantity).toFixed(2));

export const calculateTotals = (items) => {
  const subtotal = Number(
    items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
  );
  const tax = Number((subtotal * 0.05).toFixed(2));

  return {
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2))
  };
};

export const createInvoiceNumber = (invoiceCount) =>
  `INV-${String(invoiceCount + 1).padStart(4, "0")}`;
