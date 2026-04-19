import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { getQueryPlan } from "../services/api";

function QueryPlanPage() {
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-03-01");
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPlan = async () => {
    setLoading(true);
    setMessage("");
    try {
      const data = await getQueryPlan(startDate, endDate);
      setPlan(data.plan || []);
      if (!(data.plan || []).length) setMessage("No query plan returned.");
    } catch (error) {
      setMessage(error.message || "Failed to fetch query plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appShell">
      <div className="dashboard">
        <Sidebar />

        <main className="main">
          <div className="mainTop">
            <div className="titleWrap">
              <h1>Query Plan</h1>
              <p>Inspect PostgreSQL execution via EXPLAIN ANALYZE</p>
            </div>
            <div className="actions">
              <button
                className={`btn btnPrimary ${loading ? "btnLoading" : ""}`}
                onClick={fetchPlan}
              >
                {loading ? "Analyzing…" : "🔍 Explain query"}
              </button>
            </div>
          </div>

          <section className="panel" style={{ margin: "20px 28px 28px" }}>
            <div className="panelHeader">
              <div>
                <h2>Date range</h2>
                <p>Compare planner behaviour and index usage across ranges.</p>
              </div>
              <span className="chip chipPurple">EXPLAIN ANALYZE</span>
            </div>

            <div className="filters" style={{ borderBottom: "1px solid var(--glass-border)" }}>
              <label className="filterLabel">
                Start
                <input
                  className="dateInput"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <span className="rangeArrow">→</span>
              <label className="filterLabel">
                End
                <input
                  className="dateInput"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
            </div>

            {message ? <div className="notice">{message}</div> : null}

            <div className="planBox">
              {plan.length > 0 ? (
                plan.map((line, index) => (
                  <div
                    className="planLine"
                    key={index}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <span className="planBullet" />
                    <span>{line}</span>
                  </div>
                ))
              ) : (
                <div className="emptyState">Click "Explain query" to view the execution plan.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default QueryPlanPage;
