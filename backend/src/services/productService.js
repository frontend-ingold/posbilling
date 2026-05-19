import { store } from "../models/store.js";

export const getAllProducts = () => store.products;

export const findProductById = (productId) => {
  return store.products.find((product) => product.id === productId);
};

export const findProductByBarcode = (barcode) => {
  return store.products.find((product) => product.barcode === barcode);
};

const getNextProductId = () => {
  const highestId = store.products.reduce((maxId, product) => {
    const numericPart = Number.parseInt(product.id.replace("P-", ""), 10);
    return Number.isNaN(numericPart) ? maxId : Math.max(maxId, numericPart);
  }, 1000);

  return `P-${highestId + 1}`;
};

const normalizeText = (value) => `${value ?? ""}`.trim();

const normalizeNumber = (value, fieldName) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    const error = new Error(`${fieldName} must be a valid number`);
    error.status = 400;
    throw error;
  }

  return numericValue;
};

const validateBulkItem = (item, index) => {
  const rowNumber = index + 1;
  const barcode = normalizeText(item.barcode);
  const quantity = normalizeNumber(item.quantity, `Row ${rowNumber}: quantity`);

  if (!barcode) {
    const error = new Error(`Row ${rowNumber}: barcode is required`);
    error.status = 400;
    throw error;
  }

  if (quantity <= 0) {
    const error = new Error(`Row ${rowNumber}: quantity must be greater than zero`);
    error.status = 400;
    throw error;
  }

  const normalizedItem = {
    barcode,
    quantity
  };

  if (item.name !== undefined) {
    normalizedItem.name = normalizeText(item.name);
  }

  if (item.category !== undefined) {
    normalizedItem.category = normalizeText(item.category);
  }

  if (item.price !== undefined && `${item.price}`.trim() !== "") {
    const price = normalizeNumber(item.price, `Row ${rowNumber}: price`);

    if (price < 0) {
      const error = new Error(`Row ${rowNumber}: price cannot be negative`);
      error.status = 400;
      throw error;
    }

    normalizedItem.price = price;
  }

  return normalizedItem;
};

export const ensureStock = (product, quantity) => {
  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  if (quantity <= 0) {
    const error = new Error("Quantity must be greater than zero");
    error.status = 400;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error(`Insufficient stock for ${product.name}`);
    error.status = 400;
    throw error;
  }
};

export const decrementStock = (productId, quantity) => {
  const product = store.products.find((item) => item.id === productId);
  ensureStock(product, quantity);
  product.stock -= quantity;
  return product;
};

export const incrementStock = (productId, quantity) => {
  const product = store.products.find((item) => item.id === productId);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  if (quantity <= 0) {
    const error = new Error("Quantity must be greater than zero");
    error.status = 400;
    throw error;
  }

  product.stock += quantity;
  return product;
};

export const bulkUpsertProducts = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("At least one stock row is required");
    error.status = 400;
    throw error;
  }

  const normalizedItems = items.map(validateBulkItem);
  const summary = {
    created: 0,
    updated: 0,
    totalQuantityAdded: 0
  };

  normalizedItems.forEach((item, index) => {
    const existingProduct = findProductByBarcode(item.barcode);

    if (existingProduct) {
      existingProduct.stock += item.quantity;

      if (item.name) {
        existingProduct.name = item.name;
      }

      if (item.category) {
        existingProduct.category = item.category;
      }

      if (item.price !== undefined) {
        existingProduct.price = item.price;
      }

      summary.updated += 1;
      summary.totalQuantityAdded += item.quantity;
      return;
    }

    if (!item.name || !item.category || item.price === undefined) {
      const error = new Error(
        `Row ${index + 1}: new products require name, category, and price`
      );
      error.status = 400;
      throw error;
    }

    store.products.unshift({
      id: getNextProductId(),
      barcode: item.barcode,
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.quantity
    });

    summary.created += 1;
    summary.totalQuantityAdded += item.quantity;
  });

  return {
    summary,
    products: store.products
  };
};

export const updateProduct = (productId, updates = {}) => {
  const product = findProductById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  const barcode = normalizeText(updates.barcode);
  const name = normalizeText(updates.name);
  const category = normalizeText(updates.category);
  const price = normalizeNumber(updates.price, "Price");
  const stock = normalizeNumber(updates.stock, "Stock");

  if (!barcode || !name || !category) {
    const error = new Error("Barcode, name, and category are required");
    error.status = 400;
    throw error;
  }

  if (price < 0) {
    const error = new Error("Price cannot be negative");
    error.status = 400;
    throw error;
  }

  if (stock < 0) {
    const error = new Error("Stock cannot be negative");
    error.status = 400;
    throw error;
  }

  const barcodeOwner = store.products.find(
    (item) => item.barcode === barcode && item.id !== productId
  );

  if (barcodeOwner) {
    const error = new Error("Barcode already exists for another product");
    error.status = 400;
    throw error;
  }

  Object.assign(product, {
    barcode,
    name,
    category,
    price,
    stock
  });

  return product;
};

export const deleteProduct = (productId) => {
  const productIndex = store.products.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  const productInInvoices = store.invoices.some((invoice) =>
    invoice.items.some((item) => item.productId === productId)
  );

  if (productInInvoices) {
    const error = new Error("Cannot delete a product already used in invoices");
    error.status = 400;
    throw error;
  }

  const [deletedProduct] = store.products.splice(productIndex, 1);
  return deletedProduct;
};
