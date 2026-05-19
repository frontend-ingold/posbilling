import { randomUUID } from "crypto";
import { store } from "../models/store.js";
import {
  decrementStock,
  ensureStock,
  findProductByBarcode,
  incrementStock
} from "./productService.js";
import {
  calculateLineTotal,
  calculateTotals,
  createInvoiceNumber
} from "../utils/invoice.js";

export const getInvoices = () => store.invoices;

export const getInvoiceById = (invoiceId) => {
  return store.invoices.find((invoice) => invoice.id === invoiceId);
};

const buildNormalizedItems = (items) => {
  if (!items.length) {
    const error = new Error("Cart is empty");
    error.status = 400;
    throw error;
  }

  return items.map(({ barcode, quantity }) => {
    const product = findProductByBarcode(barcode);
    ensureStock(product, quantity);

    return {
      productId: product.id,
      barcode: product.barcode,
      name: product.name,
      price: product.price,
      quantity,
      lineTotal: calculateLineTotal(product.price, quantity)
    };
  });
};

export const createInvoice = ({ cashier = "Counter 1", items = [] }) => {
  const normalizedItems = buildNormalizedItems(items);

  normalizedItems.forEach((item) => {
    decrementStock(item.productId, item.quantity);
  });

  const totals = calculateTotals(normalizedItems);
  const invoice = {
    id: randomUUID(),
    invoiceNumber: createInvoiceNumber(store.invoices.length),
    cashier,
    items: normalizedItems,
    ...totals,
    createdAt: new Date().toISOString()
  };

  store.invoices.unshift(invoice);
  return invoice;
};

export const updateInvoice = (invoiceId, { cashier, items = [] }) => {
  const existingInvoice = getInvoiceById(invoiceId);

  if (!existingInvoice) {
    const error = new Error("Invoice not found");
    error.status = 404;
    throw error;
  }

  existingInvoice.items.forEach((item) => {
    incrementStock(item.productId, item.quantity);
  });

  try {
    const normalizedItems = buildNormalizedItems(items);

    normalizedItems.forEach((item) => {
      decrementStock(item.productId, item.quantity);
    });

    const totals = calculateTotals(normalizedItems);

    Object.assign(existingInvoice, {
      cashier: cashier || existingInvoice.cashier,
      items: normalizedItems,
      ...totals,
      updatedAt: new Date().toISOString()
    });

    return existingInvoice;
  } catch (error) {
    existingInvoice.items.forEach((item) => {
      decrementStock(item.productId, item.quantity);
    });
    throw error;
  }
};
