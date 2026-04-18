import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandTop">
          <span className="brandIcon">💸</span>
          Spendly
        </div>
        <div className="brandSub">PostgreSQL expense tracker</div>
      </div>

      <div className="navGroup">
        <NavLink
          to="/expenses"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">📋</span>
          Expenses
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">📊</span>
          Breakdown
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">🔍</span>
          Query Plan
        </NavLink>
      </div>

      <div className="sidebarFooter">
        <span className="dbBadge">
          <span className="statusDot" />
          PostgreSQL
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
