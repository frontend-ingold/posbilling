import {
  createInvoice,
  getInvoices,
  updateInvoice
} from "../services/invoiceService.js";

export const listInvoices = (_req, res) => {
  res.json(getInvoices());
};

export const createNewInvoice = (req, res, next) => {
  try {
    const invoice = createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const updateExistingInvoice = (req, res, next) => {
  try {
    const invoice = updateInvoice(req.params.id, req.body);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};
