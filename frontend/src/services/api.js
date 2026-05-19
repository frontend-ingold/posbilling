const API_BASE_URL = "http://localhost:4000/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.message || "Request failed");
  }

  return response.json();
};

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
};

export const fetchProductByBarcode = async (barcode) => {
  const response = await fetch(`${API_BASE_URL}/products/barcode/${barcode}`);
  return handleResponse(response);
};

export const bulkAddStock = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const updateProduct = async (productId, payload) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE"
  });

  return handleResponse(response);
};

export const fetchInvoices = async () => {
  const response = await fetch(`${API_BASE_URL}/invoices`);
  return handleResponse(response);
};

export const createInvoice = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const updateInvoice = async (invoiceId, payload) => {
  const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};
