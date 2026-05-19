import {
  bulkUpsertProducts,
  deleteProduct,
  findProductByBarcode,
  getAllProducts,
  updateProduct
} from "../services/productService.js";

export const listProducts = (_req, res) => {
  res.json(getAllProducts());
};

export const getProductByBarcode = (req, res, next) => {
  try {
    const product = findProductByBarcode(req.params.barcode);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const bulkAddStock = (req, res, next) => {
  try {
    const result = bulkUpsertProducts(req.body.items);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

export const updateExistingProduct = (req, res, next) => {
  try {
    const product = updateProduct(req.params.id, req.body);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteExistingProduct = (req, res, next) => {
  try {
    const product = deleteProduct(req.params.id);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
};
