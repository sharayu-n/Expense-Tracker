import { useState } from "react";
import { addExpense } from "../../services/api";

const initialForm = {
  amount: "",
  category: "Food",
  date: "2025-03-01",
  description: "",
};

function AddExpenseForm({ onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        description: form.description || null,
      };

      const data = await addExpense(payload);

      setMessage("Expense added successfully.");
      setForm(initialForm);
      onCreated?.(data.expense);
    } catch (error) {
      setMessage(error.message || "Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <h2>Add expense</h2>
          <p>Insert a new row into PostgreSQL and refresh the current view.</p>
        </div>
        <span className="chip chipPurple">INSERT</span>
      </div>

      {message ? <div className="notice">{message}</div> : null}

      <form onSubmit={handleSubmit} className="addForm">
        <div className="formGrid">
          <label className="filterLabel">
            Amount
            <input
              className="dateInput"
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="25.50"
              required
            />
          </label>

          <label className="filterLabel">
            Category
            <select
              className="dateInput"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Utilities</option>
              <option>Entertainment</option>
              <option>Health</option>
            </select>
          </label>

          <label className="filterLabel">
            Date
            <input
              className="dateInput"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>

          <label className="filterLabel">
            Description
            <input
              className="dateInput"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Lunch, Uber, bill, etc."
            />
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add expense"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddExpenseForm;