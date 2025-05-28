import React from "react";
import PropTypes from "prop-types";
import { FaArrowLeft, FaSearch, FaHome, FaUserPlus } from "react-icons/fa";
import { Eye, Plus, Download } from "lucide-react";
import ToggleView from "./ToggleView";

const TableHeader = ({
  activeTab,
  id,
  searchApplied,
  isAdmin,
  isTableView,
  toggleView,
  availableId,
  navigate,
  setShowSearchForm,
  filteredData,
}) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full mb-4 gap-2">
      <div className="flex items-center gap-4">
        <div style={{ display: activeTab === "suggestions" ? "none" : "flex" }}>
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={availableId}
          />
        </div>
      </div>
      <div className="flex gap-4">
        {activeTab !== "data" && (
          <button
            onClick={() => navigate("/")}
            className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
          >
            <FaArrowLeft />
            <span>Back to Table</span>
          </button>
        )}
        {(id || searchApplied) && (
          <button
            onClick={() => {
              if (id) {
                navigate("/", { replace: true });
              } else if (searchApplied) {
                // Reset search state is handled in TableView's handleGoBack
                navigate("/");
              }
            }}
            className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
          >
            <FaArrowLeft />
            <span>Back to Table</span>
          </button>
        )}
        <button className="hidden sm:flex top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm">
          <FaHome />
          <a href="https://gautamfamily.org.np/">Homepage</a>
        </button>

        {activeTab !== "suggestions" && !id && (
          <button
            onClick={() => setShowSearchForm(true)}
            className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
          >
            <FaSearch />
            <span>Search User</span>
          </button>
        )}

        {isAdmin && (
          <>
            {activeTab !== "suggestions" && !id && (
              <button
                onClick={() => navigate("/suggestions")}
                className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
                data-tooltip-id="tooltip"
                data-tooltip-content="View Suggestions"
              >
                <Eye size={18} />
                <span>View Suggestions</span>
              </button>
            )}
            {activeTab !== "suggestions" && !id && (
              <button
                onClick={() => navigate("/add-admin")}
                className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
              >
                <FaUserPlus />
                <span>View Admin</span>
              </button>
            )}
          </>
        )}

        {activeTab !== "suggestions" && !id && isAdmin && (
          <button
            onClick={() => {
              // This triggers the Add New User modal, handled in TableView
              navigate("/add-new-user");
            }}
            className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
          >
            <Plus size={18} />
            <span>Add New User</span>
          </button>
        )}

        {activeTab !== "suggestions" && id && (
          <button
            onClick={async () => {
              try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(
                  `${API_URL}/people/${id}/?type=download`,
                  {
                    method: "GET",
                    headers: {
                      "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    },
                  }
                );
                if (!response.ok) throw new Error("Failed to download file");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${
                  filteredData[0]?.name_in_nepali || filteredData[0]?.name || id
                }_वंशज.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                const Swal = require("sweetalert2");
                Swal.fire({
                  title: "Error!",
                  text: "Failed to download file.",
                  icon: "error",
                });
              }
            }}
            className="top-bar-btn flex-center px-3 py-2 text-xs sm:px-6 sm:py-2 sm:text-sm"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
};

TableHeader.propTypes = {
  activeTab: PropTypes.string.isRequired,
  id: PropTypes.string,
  searchApplied: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isTableView: PropTypes.bool.isRequired,
  toggleView: PropTypes.func.isRequired,
  availableId: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  setShowSearchForm: PropTypes.func.isRequired,
  filteredData: PropTypes.array.isRequired,
};

export default TableHeader;
