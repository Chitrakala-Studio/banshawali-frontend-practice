import { useState, useEffect } from "react";
//import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
import TableView from "../../components/TableView";
import CardView from "../../components/CardView";
import Compare from "../../components/Compare"; // Import Compare Component
import "./../../assets/styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [view, setView] = useState("Card View"); // Default view
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if screen is mobile

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setView("Card View");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="admin-dashboard">
      {/*  {!isMobile && (
        <Sidebar setView={setView} currentView={view} /> // Pass props to Sidebar
      )} */}
      <div className="admin-dashboard-content overflow-y-scroll overflow-hidden">
        {/* <Header view={view} setView={setView} /> */}
        <div
          className={`dashboard-view ${
            view === "Card View" ? "card-view-centered" : ""
          }`}
        >
          {view === "Table View" && <TableView />}
          {view === "Card View" && <CardView />}
          {view === "Compare View" && <Compare />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
