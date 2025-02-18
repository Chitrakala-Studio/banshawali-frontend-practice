import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Compare from "./components/Compare";
import TableView from "./components/TableView";
import CardView from "./components/CardView";

const App = () => {
  return (
    <Router basename="/Banshali-app">
      <Routes>
        {/* Uncomment these if needed */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="card/:id" element={<AdminDashboard />} />
        <Route path="/compare/:id" element={<Compare />} />
        <Route path="/" element={<TableView />} />
        <Route path="/:id" element={<TableView />} />

        <Route path="/card" element={<CardView />} />
      </Routes>
    </Router>
  );
};

export default App;
