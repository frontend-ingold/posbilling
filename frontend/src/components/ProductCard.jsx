import { useState } from "react";

const getDraftFromProduct = (product) => ({
  barcode: product.barcode,
  name: product.name,
  category: product.category,
  price: `${product.price}`,
  stock: `${product.stock}`
});

export const ProductCard = ({ product, onSave, onDelete, isLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(() => getDraftFromProduct(product));

  const handleChange = ({ target: { name, value } }) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setDraft(getDraftFromProduct(product));
    setIsEditing(false);
  };

  const handleSave = async () => {
    await onSave(product.id, {
      ...draft,
      price: Number(draft.price),
      stock: Number(draft.stock)
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    await onDelete(product.id);
  };

  return (
    <article className="product-card">
      {isEditing ? (
        <div className="product-edit-form">
          <input
            name="category"
            value={draft.category}
            onChange={handleChange}
            placeholder="Category"
            disabled={isLoading}
          />
          <input
            name="name"
            value={draft.name}
            onChange={handleChange}
            placeholder="Product name"
            disabled={isLoading}
          />
          <input
            name="barcode"
            value={draft.barcode}
            onChange={handleChange}
            placeholder="Barcode"
            disabled={isLoading}
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={draft.price}
            onChange={handleChange}
            placeholder="Price"
            disabled={isLoading}
          />
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={draft.stock}
            onChange={handleChange}
            placeholder="Stock"
            disabled={isLoading}
          />
          <div className="product-card-actions">
            <button type="button" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
          <p>Barcode: {product.barcode}</p>
          <p>Price: Rs. {product.price.toFixed(2)}</p>
          <strong>Available: {product.stock}</strong>
          <div className="product-card-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              type="button"
              className="button-danger"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Working..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </article>
  );
};
