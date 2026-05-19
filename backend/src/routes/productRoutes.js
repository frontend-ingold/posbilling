import { Router } from "express";
import {
  bulkAddStock,
  deleteExistingProduct,
  getProductByBarcode,
  listProducts,
  updateExistingProduct
} from "../controllers/productController.js";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.post("/bulk-stock", bulkAddStock);
productRouter.get("/barcode/:barcode", getProductByBarcode);
productRouter.put("/:id", updateExistingProduct);
productRouter.delete("/:id", deleteExistingProduct);
