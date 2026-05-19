import { useState } from "react";

export const BarcodeScannerForm = ({ onScan, loading }) => {
  const [barcode, setBarcode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!barcode.trim()) {
      return;
    }

    const currentBarcode = barcode.trim();
    setBarcode("");
    await onScan(currentBarcode);
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Scan Product</p>
          <h2>Barcode Entry</h2>
        </div>
      </div>

      <form className="scanner-form" onSubmit={handleSubmit}>
        <input
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          placeholder="Scan or enter barcode"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </section>
  );
};
