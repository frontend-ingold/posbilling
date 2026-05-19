import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Billing" },
  { to: "/inventory", label: "Stock" },
  { to: "/invoices", label: "Invoices" }
];

export const AppShell = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-mark" aria-hidden="true">
            <div className="brand-mark-icon">
              <span>P</span>
            </div>
            <div>
              <p className="brand-mark-name">PrimeCart</p>
              <p className="brand-mark-tagline">Retail billing suite</p>
            </div>
          </div>
          <p className="eyebrow">POS</p>
          <h1>Shop Billing System</h1>
          <p className="muted">
            Scan items, generate invoices, update stock, and print receipts.
          </p>
        </div>

        <nav className="nav-list">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link nav-link-active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};
