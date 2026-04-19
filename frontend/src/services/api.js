const API_BASE = "http://127.0.0.1:8000";

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export async function getExpensesByDateRange(startDate, endDate) {
  const response = await fetch(
    `${API_BASE}/expenses/date-range?start_date=${startDate}&end_date=${endDate}`
  );
  return handleResponse(response);
}

export async function getMonthlySummary(startDate, endDate) {
  const response = await fetch(
    `${API_BASE}/expenses/monthly-summary?start_date=${startDate}&end_date=${endDate}`
  );
  return handleResponse(response);
}

export async function getQueryPlan(startDate, endDate) {
  const response = await fetch(
    `${API_BASE}/expenses/explain?start_date=${startDate}&end_date=${endDate}`
  );
  return handleResponse(response);
}

export async function addExpense(expense) {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return handleResponse(response);
}

export async function updateExpense(id, expense) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  });
  return handleResponse(response);
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}