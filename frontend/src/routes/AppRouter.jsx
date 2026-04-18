import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensesPage";
import QueryPlanPage from "../pages/QueryPlanPage";
import SummaryPage from "../pages/SummaryPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/analysis" element={<QueryPlanPage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;