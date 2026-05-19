import { useMemo, useState } from "react";
import { BulkStockUpload } from "./BulkStockUpload.jsx";
import { ProductCard } from "./ProductCard.jsx";

export const ProductGrid = ({
  products,
  onBulkAddStock,
  onEditProduct,
  onDeleteProduct,
  productActionLoadingId,
  stockImportLoading,
  stockImportResult
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.barcode.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" && product.stock > 0 && product.stock <= 20) ||
        (stockFilter === "out" && product.stock === 0) ||
        (stockFilter === "available" && product.stock > 20);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [categoryFilter, products, searchTerm, stockFilter]);

  return (
    <div className="inventory-layout">
      <BulkStockUpload
        onSubmit={onBulkAddStock}
        loading={stockImportLoading}
        summary={stockImportResult}
      />

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Stock Overview</h2>
          </div>
          <p className="muted inventory-summary">
            {products.length} products currently available
          </p>
        </div>

        <div className="inventory-toolbar">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, barcode, or category"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
          >
            <option value="all">All stock</option>
            <option value="available">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <p className="inventory-results">
          Showing {filteredProducts.length} of {products.length} products
        </p>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSave={onEditProduct}
              onDelete={onDeleteProduct}
              isLoading={productActionLoadingId === product.id}
            />
          ))}
        </div>

        {!filteredProducts.length ? (
          <p className="empty-state">No products match the current search or filters.</p>
        ) : null}
      </section>
    </div>
  );
};
