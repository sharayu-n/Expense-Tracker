import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import { getExpensesByDateRange, getMonthlySummary } from "../services/api";

const CATEGORY_META = {
  Food:          { icon: "🍽️", color: "#fb923c", cls: "cat-food" },
  Transport:     { icon: "🚗", color: "#38bdf8", cls: "cat-transport" },
  Health:        { icon: "🏥", color: "#34d399", cls: "cat-health" },
  Entertainment: { icon: "🎬", color: "#c084fc", cls: "cat-entertainment" },
  Utilities:     { icon: "⚡", color: "#fbbf24", cls: "cat-utilities" },
};

function SummaryPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-03-01");
  const [summary, setSummary] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [summaryData, expenseData] = await Promise.all([
        getMonthlySummary(startDate, endDate),
        getExpensesByDateRange(startDate, endDate),
      ]);
      setSummary(summaryData.summary || []);
      setExpenses(expenseData.expenses || []);
    } catch (error) {
      setMessage(error.message || "Failed to load summary.");
      setSummary([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const total = summary.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const transactionCount = expenses.length;
    const avg = transactionCount ? total / transactionCount : 0;
    const top = [...summary].sort((a, b) => Number(b.total || 0) - Number(a.total || 0))[0];
    return { total, transactionCount, avg, topCategory: top?.category || "—" };
  }, [summary, expenses]);

  const maxTotal = useMemo(
    () => Math.max(...summary.map((item) => Number(item.total || 0)), 1),
    [summary]
  );

  return (
    <div className="appShell">
      <div className="dashboard">
        <Sidebar />

        <main className="main">
          <div className="mainTop">
            <div className="titleWrap">
              <h1>Category Breakdown</h1>
              <p>Spending grouped by category for the selected range</p>
            </div>
            <div className="actions">
              <button className="btn btnGhost" onClick={() => navigate("/analysis")}>
                🔍 Explain query
              </button>
              <button
                className={`btn btnPrimary ${loading ? "btnLoading" : ""}`}
                onClick={loadData}
              >
                {loading ? "Loading…" : "↓ Fetch data"}
              </button>
            </div>
          </div>

          <section className="kpis">
            <StatCard label="TOTAL" value={`$${stats.total.toFixed(2)}`} subtext="↑ 8% vs Feb" />
            <StatCard
              label="TRANSACTIONS"
              value={String(stats.transactionCount)}
              subtext={`${startDate.slice(5)} – ${endDate.slice(5)}`}
            />
            <StatCard
              label="AVG PER TX"
              value={`$${stats.avg.toFixed(2)}`}
              subtext={`across ${summary.length} categories`}
            />
          </section>

          <div className="filters">
            <span style={{ fontSize: 18 }}>📅</span>
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
                <h2>Spending by category</h2>
                <p>Aggregated totals for the selected period.</p>
              </div>
            </div>

            <div className="summaryList">
              {message ? <div className="notice">{message}</div> : null}

              {summary.length > 0 ? (
                summary.map((item, idx) => {
                  const amount = Number(item.total || 0);
                  const pct = Math.max(4, Math.round((amount / maxTotal) * 100));
                  const meta = CATEGORY_META[item.category] || { icon: "•", color: "#94a3b8", cls: "cat-other" };

                  return (
                    <div
                      className="barRow"
                      key={item.category}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`categoryPill ${meta.cls}`} style={{ fontSize: 11, padding: "3px 9px" }}>
                          {meta.icon} {item.category}
                        </span>
                      </div>
                      <div className="barTrack">
                        <div
                          className="barFill"
                          style={{ width: `${pct}%`, background: meta.color, boxShadow: `0 0 8px ${meta.color}55` }}
                        />
                      </div>
                      <div className="barValue">${amount.toFixed(2)}</div>
                    </div>
                  );
                })
              ) : (
                <div className="emptyState">No summary found for this date range.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default SummaryPage;
