import { products as seedProducts } from "../data/products.js";

const cloneProducts = () => seedProducts.map((product) => ({ ...product }));

export const store = {
  products: cloneProducts(),
  invoices: []
};
