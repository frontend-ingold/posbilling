import { ProductGrid } from "../components/ProductGrid.jsx";
import { usePos } from "../hooks/usePos.js";

export const InventoryPage = () => {
  const {
    products,
    bulkAddInventory,
    editProduct,
    removeProduct,
    productActionLoadingId,
    stockImportLoading,
    stockImportResult
  } = usePos();

  return (
    <ProductGrid
      products={products}
      onBulkAddStock={bulkAddInventory}
      onEditProduct={editProduct}
      onDeleteProduct={removeProduct}
      productActionLoadingId={productActionLoadingId}
      stockImportLoading={stockImportLoading}
      stockImportResult={stockImportResult}
    />
  );
};
