import React from "react";
import PropTypes from "prop-types";
import { FaArrowLeft, FaSearch, FaHome, FaUserPlus } from "react-icons/fa";
import { Eye, Plus, Download , Contact, LucideGitCompareArrows} from "lucide-react";
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
  setFilteredData,
  data,
  setSearchApplied,
  onBackToTable,
  genealogyType,
  showGenealogy
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-4 gap-2 p-2">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div style={{ display: (activeTab === "suggestions" || activeTab === "request-contact" || genealogyType === "ancestor" || genealogyType === "descendant") ? "none" : "flex" }}>
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={availableId}
          />
        </div>
      </div>
      <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end gap-2 w-full sm:w-auto">
        {/* Always show Back to Table in suggestions view, and in other views when (id || searchApplied) is true, or in genealogy mode */}
        {((activeTab === "suggestions") || id || searchApplied || activeTab === "request-contact" || (genealogyType === "ancestor" || genealogyType === "descendant")) && (
          <button
            onClick={() => { window.location.replace("/"); }} // Always reset at root with reload
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
            title={window.innerWidth < 640 ? "Back" : ""}
          >
            <FaArrowLeft size={window.innerWidth < 640 ? 18 : undefined} />
            <span className="hidden sm:inline">Back to Table</span>
          </button>
        )}
        {/* Home button */}
        <a
          href="https://gautamfamily.org.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
          title={window.innerWidth < 640 ? "Home" : ""}
        >
          <FaHome size={window.innerWidth < 640 ? 18 : undefined} />
          <span className="hidden sm:inline">Homepage</span>
        </a>
        {/* Hide Search button whenever Back to Table is visible (i.e., in genealogy or special views) */}
        {!( (activeTab === "suggestions") || id || searchApplied || activeTab === "request-contact" || (genealogyType === "ancestor" || genealogyType === "descendant") ) && (
          <button
            onClick={() => setShowSearchForm(true)}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
            title={window.innerWidth < 640 ? "Search" : ""}
          >
            <FaSearch size={window.innerWidth < 640 ? 18 : undefined} />
            <span className="hidden sm:inline">Search User</span>
          </button>
        )}
        {/* Admin and other action buttons (unchanged) */}
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
        {activeTab !== "request-contact" && !id && isAdmin && (
          <button
            onClick={() => navigate("/request-contact")}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:gap-0"
            title={window.innerWidth < 640 ? "Contact Requests" : ""}
          >
            <Contact size={window.innerWidth < 640 ? 18 : 18 } />
            <span className="hidden sm:inline">Contact Requests</span>
          </button>
        )}
        {isSuperAdmin && activeTab !== "suggestions" && !id && (
          <button
            onClick={() => navigate("/add-admin")}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
            title={window.innerWidth < 640 ? "Admin" : ""}
          >
            <FaUserPlus size={window.innerWidth < 640 ? 18 : undefined} />
            <span className="hidden sm:inline">View Admin</span>
          </button>
        )}
        {activeTab !== "suggestions" && activeTab !== "request-contact" && !id && isAdmin && (
          <button
            onClick={() => navigate("/add-new-user")}
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
            title={window.innerWidth < 640 ? "Add User" : ""}
          >
            <Plus size={window.innerWidth < 640 ? 18 : 18} />
            <span className="hidden sm:inline">Add New User</span>
          </button>
        )}
        {/* Compare button always visible */}
        <button
          onClick={() => navigate("/compare")}
          className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
          title={window.innerWidth < 640 ? "Compare" : ""}
        >
          <LucideGitCompareArrows size={window.innerWidth < 640 ? 18 : 18} />
          <span className="hidden sm:inline">Compare</span>
        </button>
        {/* Download button only if viewing ancestors, descendants, or a specific person (id) */}
        {((genealogyType === "ancestor" || genealogyType === "descendant") || (id && activeTab !== "suggestions" && activeTab !== "request-contact")) && (
          <button
            onClick={async () => {
              try {
                const API_URL = import.meta.env.VITE_API_URL;
                let downloadUrl = "";
                if (genealogyType === "ancestor" && filteredData[0]?.id) {
                  downloadUrl = `${API_URL}/genealogy/${filteredData[0].id}/ancestors/?type=download`;
                } else if (genealogyType === "descendant" && filteredData[0]?.id) {
                  downloadUrl = `${API_URL}/genealogy/${filteredData[0].id}/descendants/?type=download`;
                } else if (id) {
                  downloadUrl = `${API_URL}/${id}/?type=download`;
                }
                if (!downloadUrl) return;
                const response = await fetch(downloadUrl, {
                  method: "GET",
                  headers: {
                    "Content-Type":
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  },
                });
                if (!response.ok) throw new Error("Failed to download file");
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${filteredData[0]?.name_in_nepali || filteredData[0]?.name || id || "genealogy"}_वंशज.xlsx`;
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
            className="top-bar-btn flex-center w-[48px] h-[48px] sm:w-auto sm:h-auto sm:px-3 sm:py-2 sm:text-sm text-xs max-[639px]:!w-[48px] max-[639px]:!h-[48px] max-[639px]:!p-0 max-[639px]:!gap-0"
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
  setFilteredData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  setSearchApplied: PropTypes.func.isRequired,
  onBackToTable: PropTypes.func,
  genealogyType: PropTypes.string,
  showGenealogy: PropTypes.bool
};

export default TableHeader;
