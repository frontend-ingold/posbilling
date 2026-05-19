import { useMemo, useState } from "react";

const TEMPLATE = `barcode,name,category,price,quantity
8901001002016,Atta 10kg,Groceries,480,50
8901001002023,Toothpaste 150g,Personal Care,95,120`;

const parseRows = (input) => {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return { rows: [], errors: [] };
  }

  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes("barcode") &&
    firstLine.includes("name") &&
    firstLine.includes("category");
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const errors = [];

  const rows = dataLines
    .map((line, index) => {
      const columns = line.split(/,|\t/).map((value) => value.trim());

      if (columns.length < 5) {
        errors.push(`Row ${index + 1}: use barcode, name, category, price, quantity`);
        return null;
      }

      const [barcode, name, category, price, quantity] = columns;

      if (!barcode || !name || !category || !price || !quantity) {
        errors.push(`Row ${index + 1}: all 5 columns are required`);
        return null;
      }

      const numericPrice = Number(price);
      const numericQuantity = Number(quantity);

      if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        errors.push(`Row ${index + 1}: price must be a valid non-negative number`);
        return null;
      }

      if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
        errors.push(`Row ${index + 1}: quantity must be greater than zero`);
        return null;
      }

      return {
        barcode,
        name,
        category,
        price: numericPrice,
        quantity: numericQuantity
      };
    })
    .filter(Boolean);

  return { rows, errors };
};

export const BulkStockUpload = ({ onSubmit, loading, summary }) => {
  const [input, setInput] = useState("");
  const parsed = useMemo(() => parseRows(input), [input]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!parsed.rows.length || parsed.errors.length) {
      return;
    }

    await onSubmit(parsed.rows);
    setInput("");
  };

  return (
    <section className="panel">
      <div className="panel-heading bulk-stock-heading">
        <div>
          <p className="eyebrow">Add Stock</p>
          <h3>Bulk Inventory Upload</h3>
        </div>
        <span className="bulk-stock-badge">Built for 1000+ rows</span>
      </div>

      <form className="bulk-stock-form" onSubmit={handleSubmit}>
        <label className="bulk-stock-label" htmlFor="bulk-stock-input">
          Paste CSV or Excel rows in this order: barcode, name, category, price, quantity
        </label>
        <textarea
          id="bulk-stock-input"
          className="bulk-stock-textarea"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={TEMPLATE}
          spellCheck="false"
        />

        <div className="bulk-stock-meta">
          <span>Valid rows: {parsed.rows.length}</span>
          <span>Errors: {parsed.errors.length}</span>
        </div>

        {parsed.errors.length ? (
          <div className="bulk-stock-errors">
            {parsed.errors.slice(0, 8).map((error) => (
              <p key={error}>{error}</p>
            ))}
            {parsed.errors.length > 8 ? (
              <p>Showing first 8 errors. Fix remaining rows and submit again.</p>
            ) : null}
          </div>
        ) : null}

        {summary ? (
          <div className="bulk-stock-success">
            Added {summary.totalQuantityAdded} units across {summary.created} new and{" "}
            {summary.updated} existing products.
          </div>
        ) : null}

        <div className="action-row">
          <button
            type="submit"
            disabled={!parsed.rows.length || Boolean(parsed.errors.length) || loading}
          >
            {loading ? "Importing Stock..." : "Add Stock Batch"}
          </button>
        </div>
      </form>
    </section>
  );
};
