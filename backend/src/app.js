import cors from "cors";
import express from "express";
import morgan from "morgan";
import { invoiceRouter } from "./routes/invoiceRoutes.js";
import { productRouter } from "./routes/productRoutes.js";

export const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRouter);
app.use("/api/invoices", invoiceRouter);

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Internal server error"
  });
});
