import { Router } from "express";
import {
  createNewInvoice,
  listInvoices,
  updateExistingInvoice
} from "../controllers/invoiceController.js";

export const invoiceRouter = Router();

invoiceRouter.get("/", listInvoices);
invoiceRouter.post("/", createNewInvoice);
invoiceRouter.put("/:id", updateExistingInvoice);
