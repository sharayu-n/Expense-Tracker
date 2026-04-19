import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import {
  addExpense,
  deleteExpense,
  getExpensesByDateRange,
  updateExpense,
} from "../services/api";

const categoryOptions = ["Food", "Transport", "Utilities", "Entertainment", "Health"];

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

const emptyNewExpense = {
  amount: "",
  category: "Food",
  date: "2025-03-01",
  description: "",
};

function ManagePage() {
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-03-31");
  const [expenses, setExpenses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [newExpense, setNewExpense] = useState(emptyNewExpense);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const selectedExpense = useMemo(
    () => expenses.find((e) => String(e.id) === String(selectedId)) || null,
    [expenses, selectedId]
  );

  const loadExpenses = async () => {
    setLoading(true);
    setMessage("");

    try {
      const data = await getExpensesByDateRange(startDate, endDate);
      const rows = data.expenses || [];
      setExpenses(rows);

      if (rows.length === 0) {
        setMessage("No expenses found for this date range.");
        setSelectedId("");
        setEditForm(null);
      } else if (!selectedId || !rows.some((r) => String(r.id) === String(selectedId))) {
        setSelectedId(String(rows[0].id));
      }
    } catch (error) {
      setMessage(error.message || "Failed to load expenses.");
      setExpenses([]);
      setSelectedId("");
      setEditForm(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedExpense) {
      setEditForm({
        amount: selectedExpense.amount,
        category: selectedExpense.category,
        date: selectedExpense.date,
        description: selectedExpense.description || "",
      });
    } else {
      setEditForm(null);
    }
  }, [selectedExpense]);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const createNewExpense = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");

    try {
      await addExpense({
        amount: Number(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        description: newExpense.description || null,
      });

      setMessage("Expense added successfully.");
      setNewExpense(emptyNewExpense);
      await loadExpenses();
    } catch (error) {
      setMessage(error.message || "Failed to add expense.");
    } finally {
      setCreating(false);
    }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedExpense || !editForm) return;

    setSaving(true);
    setMessage("");

    try {
      await updateExpense(selectedExpense.id, {
        amount: Number(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        description: editForm.description || null,
      });

      setMessage("Expense updated successfully.");
      await loadExpenses();
    } catch (error) {
      setMessage(error.message || "Failed to update expense.");
    } finally {
      setSaving(false);
    }
  };

  const removeExpense = async (id) => {
    const ok = window.confirm(`Delete expense #${id}?`);
    if (!ok) return;

    setMessage("");
    try {
      await deleteExpense(id);
      setMessage("Expense deleted successfully.");

      if (String(selectedId) === String(id)) {
        setSelectedId("");
        setEditForm(null);
      }

      await loadExpenses();
    } catch (error) {
      setMessage(error.message || "Failed to delete expense.");
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
              <h1>Manage expenses</h1>
              <p>Add, update, and delete rows in PostgreSQL.</p>
            </div>

            <div className="actions">
              <button
                className={`btn btnPrimary ${loading ? "btnLoading" : ""}`}
                onClick={loadExpenses}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <section className="kpis">
            <StatCard
              label="TOTAL SPENT"
              value={formatMoney(total)}
              subtext={`${expenses.length} rows`}
            />
            <StatCard
              label="SELECTED"
              value={selectedExpense ? `#${selectedExpense.id}` : "—"}
              subtext="edit/delete target"
            />
          </section>

          <section className="panel">
            <div className="panelHeader">
              <div>
                <h2>Add expense</h2>
                <p>Insert a new row into the heap and update the B-tree index.</p>
              </div>
              <span className="chip chipPurple">INSERT</span>
            </div>

            {message ? <div className="notice">{message}</div> : null}

            <form onSubmit={createNewExpense} className="addForm">
              <div className="formGrid">
                <label className="filterLabel">
                  Amount
                  <input
                    className="dateInput"
                    type="number"
                    step="0.01"
                    name="amount"
                    value={newExpense.amount}
                    onChange={handleNewChange}
                    required
                  />
                </label>

                <label className="filterLabel">
                  Category
                  <select
                    className="dateInput"
                    name="category"
                    value={newExpense.category}
                    onChange={handleNewChange}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="filterLabel">
                  Date
                  <input
                    className="dateInput"
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleNewChange}
                    required
                  />
                </label>

                <label className="filterLabel">
                  Description
                  <input
                    className="dateInput"
                    type="text"
                    name="description"
                    value={newExpense.description}
                    onChange={handleNewChange}
                    placeholder="Lunch, Uber, bill..."
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
                <button className="btn btnPrimary" type="submit" disabled={creating}>
                  {creating ? "Saving..." : "Add expense"}
                </button>
              </div>
            </form>
          </section>


          {editForm && selectedExpense ? (
            <section className="panel">
              <div className="panelHeader">
                <div>
                  <h2>Edit selected expense</h2>
                  <p>Updating a row creates a new visible version under MVCC.</p>
                </div>
                <span className="chip chipPurple">EDIT #{selectedExpense.id}</span>
              </div>

              <form onSubmit={saveEdit} className="addForm">
                <div className="formGrid">
                  <label className="filterLabel">
                    Amount
                    <input
                      className="dateInput"
                      type="number"
                      step="0.01"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <label className="filterLabel">
                    Category
                    <select
                      className="dateInput"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="filterLabel">
                    Date
                    <input
                      className="dateInput"
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      required
                    />
                  </label>

                  <label className="filterLabel">
                    Description
                    <input
                      className="dateInput"
                      type="text"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                    />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
                  <button className="btn" type="button" onClick={() => setEditForm(null)}>
                    Clear
                  </button>
                  <button className="btn btnPrimary" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => removeExpense(selectedExpense.id)}
                  >
                    Delete
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="panel">
            <div className="panelHeader">
              <div>
                <h2>Edit / delete expense</h2>
                <p>Select a row from the table below to update or delete it.</p>
              </div>
              <span className="chip">UPDATE / DELETE</span>
            </div>

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

              <button className="btn" type="button" onClick={loadExpenses}>
                Load range
              </button>
            </div>

            <div
              className="tableHead"
              style={{ gridTemplateColumns: "1.5fr 140px 120px 120px 180px" }}
            >
              <span>DESCRIPTION</span>
              <span>CATEGORY</span>
              <span>DATE</span>
              <span>AMOUNT</span>
              <span>ACTIONS</span>
            </div>

            <div className="tableBody">
              {expenses.length > 0 ? (
                expenses.map((expense) => {
                  const cat = normalize(expense.category);
                  const colors = categoryColors[cat] || { bg: "#E5E7EB", fg: "#374151" };

                  return (
                    <div
                      className={`tableRow ${
                        String(selectedId) === String(expense.id) ? "selectedRow" : ""
                      }`}
                      key={expense.id}
                      style={{
                        gridTemplateColumns: "1.5fr 140px 120px 120px 180px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSelectedId(String(expense.id))}
                    >
                      <div>
                        <div className="descText">{expense.description || "—"}</div>
                        <div className="subText">Expense #{expense.id}</div>
                      </div>

                      <div>
                        <span className="categoryPill" style={{ background: colors.bg, color: colors.fg }}>
                          {cat}
                        </span>
                      </div>

                      <div className="subText">{expense.date}</div>

                      <div className="amountText">{formatMoney(expense.amount)}</div>

                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          className="btn"
                          type="button"
                          style={{ padding: "10px 14px", fontSize: 14 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(String(expense.id));
                            setEditForm({
                              amount: expense.amount,
                              category: expense.category,
                              date: expense.date,
                              description: expense.description || "",
                            });
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn"
                          type="button"
                          style={{ padding: "10px 14px", fontSize: 14 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExpense(expense.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="emptyState">No rows loaded yet.</div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default ManagePage;