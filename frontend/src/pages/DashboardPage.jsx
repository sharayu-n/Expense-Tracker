import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";

function DashboardPage() {
  return (
    <div className="appShell">
      <div className="dashboard">
        <Sidebar />

        <main className="main">
          <div className="mainTop">
            <div className="titleWrap">
              <h1>Expenses</h1>
              <p>March 2025 · 6 transactions</p>
            </div>
            <div className="actions">
              <button className="btn btnGhost">🔍 Explain query</button>
              <button className="btn btnPrimary">↓ Fetch expenses</button>
            </div>
          </div>

          <section className="kpis">
            <StatCard label="TOTAL" value="$313.29" subtext="↑ 8% vs Feb" />
            <StatCard label="TRANSACTIONS" value="6" subtext="Mar 1 – 31" />
            <StatCard label="AVG PER TX" value="$52.22" subtext="across 5 cats" />
          </section>

          <div className="filters">
            <span style={{ fontSize: 18 }}>📅</span>
            <input className="dateInput" type="date" value="2025-03-01" readOnly />
            <span className="rangeArrow">→</span>
            <input className="dateInput" type="date" value="2025-03-31" readOnly />
            <div style={{ flex: 1 }} />
            <span className="chip">6 results</span>
          </div>

          <section className="panel">
            <div className="tableHead">
              <span>DESCRIPTION</span>
              <span>CATEGORY</span>
              <span>DATE</span>
              <span style={{ textAlign: "right" }}>AMOUNT</span>
            </div>

            <div className="tableBody">
              {[
                { desc: "Whole Foods", cat: "Food", catCls: "cat-food", icon: "🍽️", date: "Mar 02", amount: "$64.50" },
                { desc: "Uber rides", cat: "Transport", catCls: "cat-transport", icon: "🚗", date: "Mar 05", amount: "$24.00" },
                { desc: "Dinner at Nobu", cat: "Food", catCls: "cat-food", icon: "🍽️", date: "Mar 09", amount: "$38.80" },
                { desc: "Electricity", cat: "Utilities", catCls: "cat-utilities", icon: "⚡", date: "Mar 14", amount: "$112.00" },
                { desc: "Netflix", cat: "Entertainment", catCls: "cat-entertainment", icon: "🎬", date: "Mar 21", amount: "$18.99" },
                { desc: "Gym membership", cat: "Health", catCls: "cat-health", icon: "🏥", date: "Mar 28", amount: "$55.00" },
              ].map((row, i) => (
                <div className="tableRow" key={i}>
                  <div>
                    <div className="descText">{row.desc}</div>
                    <div className="subText">Expense #{i + 1}</div>
                  </div>
                  <div>
                    <span className={`categoryPill ${row.catCls}`}>
                      {row.icon} {row.cat}
                    </span>
                  </div>
                  <div className="subText" style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                    {row.date}
                  </div>
                  <div className="amountText">{row.amount}</div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
