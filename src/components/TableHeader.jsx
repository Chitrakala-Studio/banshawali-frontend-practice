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
  isSuperAdmin,
  isTableView,
  toggleView,
  availableId,
  navigate,
  setShowSearchForm,
  filteredData,
  setFilteredData, // Fix: Add setFilteredData prop
  data, // Fix: Add data prop
  setSearchApplied, // NEW: Accept setSearchApplied as a prop
  onBackToTable, // NEW: callback to trigger fetchData(1)
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-2 p-2">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div style={{ display: activeTab === "suggestions" ? "none" : "flex" }}>
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={availableId}
          />
        </div>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end gap-2 w-full sm:w-auto">
        {/* Always show Back to Table in suggestions view, and in other views when (id || searchApplied) is true */}
        {((activeTab === "suggestions") || id || searchApplied) && (
          <button
            onClick={() => {
              setSearchApplied(false);
              if (typeof onBackToTable === "function") {
                onBackToTable();
              } else {
                setFilteredData(data);
              }
              navigate("/");
            }}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
            title={window.innerWidth < 640 ? "Back" : ""}
          >
            <FaArrowLeft size={window.innerWidth < 640 ? 18 : undefined} />
            <span className="hidden sm:inline">Back to Table</span>
          </button>
        )}
        <a
          href="https://gautamfamily.org.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
          title={window.innerWidth < 640 ? "Home" : ""}
        >
          <FaHome size={window.innerWidth < 640 ? 18 : undefined} />
          <span className="hidden sm:inline">Homepage</span>
        </a>

        {activeTab !== "suggestions" && !id && (
          <button
            onClick={() => setShowSearchForm(true)}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
            title={window.innerWidth < 640 ? "Search" : ""}
          >
            <FaSearch size={window.innerWidth < 640 ? 18 : undefined} />
            <span className="hidden sm:inline">Search User</span>
          </button>
        )}

        {isAdmin && (
          <>
            {activeTab !== "suggestions" && !id && (
              <button
                onClick={() => navigate("/suggestions")}
                className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
                data-tooltip-id="tooltip"
                data-tooltip-content="View Suggestions"
                title={window.innerWidth < 640 ? "Suggestions" : ""}
              >
                <Eye size={window.innerWidth < 640 ? 18 : 18} />
                <span className="hidden sm:inline">View Suggestions</span>
              </button>
            )}
          </>
        )}
        {isSuperAdmin && activeTab !== "suggestions" && !id && (
          <>
              <button
                onClick={() => navigate("/add-admin")}
                className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
                title={window.innerWidth < 640 ? "Admin" : ""}
              >
                <FaUserPlus size={window.innerWidth < 640 ? 18 : undefined} />
                <span className="hidden sm:inline">View Admin</span>
              </button>
          </>
        )}

        {activeTab !== "suggestions" && !id && isAdmin && (
          <button
            onClick={() => navigate("/add-new-user")}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
            title={window.innerWidth < 640 ? "Add User" : ""}
          >
            <Plus size={window.innerWidth < 640 ? 18 : 18} />
            <span className="hidden sm:inline">Add New User</span>
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
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
            title={window.innerWidth < 640 ? "Download" : ""}
          >
            <Download size={window.innerWidth < 640 ? 18 : 18} />
            <span className="hidden sm:inline">Download</span>
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
  isSuperAdmin: PropTypes.bool.isRequired,
  isTableView: PropTypes.bool.isRequired,
  toggleView: PropTypes.func.isRequired,
  availableId: PropTypes.string,
  navigate: PropTypes.func.isRequired,
  setShowSearchForm: PropTypes.func.isRequired,
  filteredData: PropTypes.array.isRequired,
  setFilteredData: PropTypes.func.isRequired, // Fix: Add prop type for setFilteredData
  data: PropTypes.array.isRequired, // Fix: Add prop type for data
  setSearchApplied: PropTypes.func.isRequired, // NEW: Add prop type for setSearchApplied
  onBackToTable: PropTypes.func, // NEW: Add prop type for onBackToTable
};

export default TableHeader;
