import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Compare from "./components/Compare";
import TableView from "./components/TableView";

const App = () => {
  return (
    <Router basename="/Banshali-app">
      <Routes>
        {/* <Route path="/" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} /> */}

        <Route path="/" element={<AdminDashboard />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/table" element={<TableView />} />
      </Routes>
    </Router>
  );
};

export default App;
