import { createContext, useContext, useEffect, useState } from "react";
import {
  bulkAddStock as saveBulkStock,
  createInvoice,
  deleteProduct as removeProductRequest,
  fetchInvoices,
  fetchProductByBarcode,
  fetchProducts,
  updateInvoice as saveInvoiceChanges,
  updateProduct as saveProductChanges
} from "../services/api.js";

const PosContext = createContext(null);

const getTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  return {
    subtotal,
    tax,
    total: Number((subtotal + tax).toFixed(2))
  };
};

export const PosProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [latestInvoice, setLatestInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stockImportLoading, setStockImportLoading] = useState(false);
  const [stockImportResult, setStockImportResult] = useState(null);
  const [productActionLoadingId, setProductActionLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsResponse, invoicesResponse] = await Promise.all([
          fetchProducts(),
          fetchInvoices()
        ]);

        setProducts(productsResponse);
        setInvoices(invoicesResponse);
      } catch (loadError) {
        setError(loadError.message);
      }
    };

    loadInitialData();
  }, []);

  const addByBarcode = async (barcode) => {
    setLoading(true);
    setError("");

    try {
      const product = await fetchProductByBarcode(barcode);

      setCartItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.barcode === barcode);

        if (existingItem) {
          return currentItems.map((item) =>
            item.barcode === barcode
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...currentItems, { ...product, quantity: 1 }];
      });
    } catch (scanError) {
      setError(scanError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (barcode, quantity) => {
    if (quantity < 1) {
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.barcode === barcode ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (barcode) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.barcode !== barcode)
    );
  };

  const checkout = async () => {
    setCheckoutLoading(true);
    setError("");

    try {
      const payload = {
        cashier: "Main Counter",
        items: cartItems.map((item) => ({
          barcode: item.barcode,
          quantity: item.quantity
        }))
      };
      const invoice = editingInvoice
        ? await saveInvoiceChanges(editingInvoice.id, payload)
        : await createInvoice(payload);

      setLatestInvoice(invoice);
      setInvoices((currentInvoices) =>
        editingInvoice
          ? currentInvoices.map((item) =>
              item.id === editingInvoice.id ? invoice : item
            )
          : [invoice, ...currentInvoices]
      );
      setCartItems([]);
      setEditingInvoice(null);
      setProducts(await fetchProducts());
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const printReceipt = () => {
    if (!latestInvoice) {
      return;
    }

    window.print();
  };

  const beginInvoiceEdit = (invoiceId) => {
    const invoice = invoices.find((item) => item.id === invoiceId);

    if (!invoice) {
      setError("Invoice not found");
      return;
    }

    setEditingInvoice(invoice);
    setLatestInvoice(invoice);
    setCartItems(
      invoice.items.map((item) => ({
        id: item.productId,
        barcode: item.barcode,
        name: item.name,
        price: item.price,
        stock: 0,
        quantity: item.quantity
      }))
    );
    setError("");
  };

  const cancelInvoiceEdit = () => {
    setEditingInvoice(null);
    setCartItems([]);
    setError("");
  };

  const bulkAddInventory = async (items) => {
    setStockImportLoading(true);
    setError("");
    setStockImportResult(null);

    try {
      const response = await saveBulkStock({ items });
      setProducts(response.products);
      setStockImportResult(response.summary);
    } catch (stockError) {
      setError(stockError.message);
      throw stockError;
    } finally {
      setStockImportLoading(false);
    }
  };

  const editProduct = async (productId, payload) => {
    setProductActionLoadingId(productId);
    setError("");

    try {
      const updatedProduct = await saveProductChanges(productId, payload);
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
    } catch (productError) {
      setError(productError.message);
      throw productError;
    } finally {
      setProductActionLoadingId(null);
    }
  };

  const removeProduct = async (productId) => {
    setProductActionLoadingId(productId);
    setError("");

    try {
      await removeProductRequest(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId)
      );
    } catch (productError) {
      setError(productError.message);
      throw productError;
    } finally {
      setProductActionLoadingId(null);
    }
  };

  return (
    <PosContext.Provider
      value={{
        products,
        invoices,
        cartItems,
        latestInvoice,
        editingInvoice,
        loading,
        checkoutLoading,
        stockImportLoading,
        stockImportResult,
        productActionLoadingId,
        error,
        totals: getTotals(cartItems),
        addByBarcode,
        updateQuantity,
        removeItem,
        checkout,
        printReceipt,
        beginInvoiceEdit,
        cancelInvoiceEdit,
        bulkAddInventory,
        editProduct,
        removeProduct
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);
