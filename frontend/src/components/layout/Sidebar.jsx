import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandTop">
          <span className="statusDot" />
          Spendwise
        </div>
        <div className="brandSub">PostgreSQL tracker</div>
      </div>

      <div className="navGroup">
        <NavLink
          to="/expenses"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">≡</span>
          Expenses
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">▤</span>
          Breakdown
        </NavLink>

        <NavLink
          to="/manage"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">✎</span>
          Manage
        </NavLink>

        <NavLink
          to="/analysis"
          className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
        >
          <span className="navIcon">⚡</span>
          Query plan
        </NavLink>
      </div>

      <div className="sidebarFooter">
        <span className="dbBadge">PostgreSQL</span>
      </div>
    </aside>
  );
}

export default Sidebar;