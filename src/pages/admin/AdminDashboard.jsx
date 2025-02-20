import { useState, useEffect } from "react";
//import Sidebar from "../../components/Sidebar";
// import Header from "../../components/Header";
import TableView from "../../components/TableView";
import CardView from "../../components/CardView";
import Compare from "../../components/Compare"; // Import Compare Component
import "./../../assets/styles/AdminDashboard.css";

const AdminDashboard = () => {
  const isMobileInitial = window.innerWidth <= 768;
  const [view, setView] = useState(
    isMobileInitial ? "Card View" : "Table View"
  );
  const [isMobile, setIsMobile] = useState(isMobileInitial);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setView(mobile ? "Card View" : "Table View");
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Uncomment Sidebar if needed */}
      {/* {!isMobile && <Sidebar setView={setView} currentView={view} />} */}
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
