import { useState, useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Compare from "./components/Compare";
import TableView from "./components/TableView";
import CardView from "./components/CardView";
// import FamilyTreeGraph from "./components/FamilyTreeGraph";

const RedirectOnMobile = ({ setIsMobile }) => {
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Run once on mount to set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  return null; // Nothing to render, this is just for side-effects
};

const AppRoutes = ({ isMobile }) => (
  <>
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/card/:id" element={<CardView />} />
      <Route path="/compare/:id" element={<Compare />} />
      {isMobile ? (
        <Route path="/" element={<Navigate to="/card/1" />} />
      ) : (
        <Route path="/" element={<TableView />} />
      )}
      <Route path="/:id" element={<TableView />} />
      <Route path="/card" element={<Navigate to="/card/1" />} />
    </Routes>
  </>
);

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 764);

  return (
    <Router basename="/Banshali-app/">
      <RedirectOnMobile setIsMobile={setIsMobile} />
      <AppRoutes isMobile={isMobile} />
    </Router>
  );
};

export default App;