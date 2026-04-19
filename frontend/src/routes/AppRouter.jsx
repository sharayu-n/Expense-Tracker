import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import ExpensesPage from "../pages/ExpensesPage";
import QueryPlanPage from "../pages/QueryPlanPage";
import SummaryPage from "../pages/SummaryPage";
import ManagePage from "../pages/ManagePage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/analysis" element={<QueryPlanPage />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;