import { useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Compare from "./components/Compare";
import TableView from "./components/TableView";
import CardView from "./components/CardView";
import FamilyTreeGraph from "./components/FamilyTreeGraph";

const RedirectOnMobile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.innerWidth < 768) {
      navigate("/card");
    }
  }, [navigate]);
  return null;
};

const AppRoutes = () => (
  <>
    <RedirectOnMobile />
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/card/:id" element={<CardView />} />
      <Route path="/compare/:id" element={<Compare />} />
      <Route path="/" element={<TableView />} />
      <Route path="/:id" element={<TableView />} />
      <Route path="/card" element={<CardView />} />
    </Routes>
  </>
);

const App = () => {
  return (
    <Router basename="/Banshali-app">
      <AppRoutes />
    </Router>
  );
};

export default App;
