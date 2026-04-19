import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import AddExpenseForm from "../components/dashboard/AddExpenseForm";
import { getExpensesByDateRange } from "../services/api";

const categoryColors = {
  Utilities: { bg: "#f3e0c2", fg: "#8a5a00" },
  Food: { bg: "#d9f5ec", fg: "#0f6b52" },
  Health: { bg: "#fde3db", fg: "#a83a14" },
  Transport: { bg: "#dbeafe", fg: "#1d4ed8" },
  Entertainment: { bg: "#e9e5ff", fg: "#4c3fd4" },
};

const normalize = (cat = "") =>
  cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function ExpensesPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-03-31");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchExpenses = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getExpensesByDateRange(startDate, endDate);
      const rows = data.expenses || [];
      setExpenses(rows);

      if (rows.length === 0) {
        setMessage("No expenses found for this date range.");
      }
    } catch (error) {
      setMessage(error.message || "Failed to fetch expenses.");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const total = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="appShell">
      <div className="dashboard">
        <Sidebar />

        <main className="main">
          <div className="mainTop">
            <div className="titleWrap">
              <h1>Expenses</h1>
              <p>Filter expenses by date range and inspect PostgreSQL results.</p>
            </div>

            <div className="actions">
              <button className="btn btnGhost" onClick={() => navigate("/analysis")}>
                ⓘ Explain query
              </button>
              <button
                className={`btn btnPrimary ${loading ? "btnLoading" : ""}`}
                onClick={fetchExpenses}
              >
                {loading ? "Loading..." : "↓ Fetch expenses"}
              </button>
            </div>
          </div>

          <section className="kpis">
            <StatCard
              label="TOTAL SPENT"
              value={formatMoney(total)}
              subtext={`${expenses.length} transactions`}
            />
            <StatCard
              label="TRANSACTIONS"
              value={String(expenses.length)}
              subtext={`${startDate.slice(5)} – ${endDate.slice(5)}`}
            />
            <StatCard
              label="TOP CATEGORY"
              value={
                [...expenses].reduce((acc, item) => {
                  acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
                  return acc;
                }, {})
                  ? Object.entries(
                      expenses.reduce((acc, item) => {
                        acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
                        return acc;
                      }, {})
                    ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                  : "—"
              }
              subtext="highest total in range"
            />
          </section>



          <div className="filters">
            <span className="filterLabel">📅</span>

            <input
              className="dateInput"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <span className="rangeArrow">→</span>

            <input
              className="dateInput"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div style={{ flex: 1 }} />

            <span className="chip">{expenses.length} results</span>
          </div>

          <section className="panel">
            <div className="panelHeader">
              <div>
                <h2>Expense list</h2>
                <p>Rows returned by PostgreSQL for the selected date range.</p>
              </div>
              <span className="chip">PostgreSQL query</span>
            </div>

            {message ? <div className="notice">{message}</div> : null}

            <div className="tableHead">
              <span>DESCRIPTION</span>
              <span>CATEGORY</span>
              <span>DATE</span>
              <span>AMOUNT</span>
            </div>

            <div className="tableBody">
              {expenses.length > 0 ? (
                expenses.map((expense, index) => {
                  const cat = normalize(expense.category);
                  const colors = categoryColors[cat] || { bg: "#E5E7EB", fg: "#374151" };

                  return (
                    <div className="tableRow" key={expense.id ?? index}>
                      <div>
                        <div className="descText">{expense.description || "—"}</div>
                        <div className="subText">Expense #{expense.id ?? index + 1}</div>
                      </div>

                      <div>
                        <span
                          className="categoryPill"
                          style={{ background: colors.bg, color: colors.fg }}
                        >
                          {cat}
                        </span>
                      </div>

                      <div className="subText">{expense.date}</div>

                      <div className="amountText">{formatMoney(expense.amount)}</div>
                    </div>
                  );
                })
              ) : (
                <div className="emptyState">Click “Fetch expenses” to load data.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default ExpensesPage;