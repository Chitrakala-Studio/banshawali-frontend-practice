import { useState } from "react";
import {
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { globalData } from "../data/globalData";
import EditFormModal from "./EditFormModal";
import FamilyTreeModal from "./FamilyTreeModal"; // Import FamilyTreeModal
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";

const TableView = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null); // State to manage FamilyTreeModal

  const offset = currentPage * rowsPerPage;
  const currentRows = globalData.slice(offset, offset + rowsPerPage);
  
    const handleDelete = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Red color to indicate danger
        cancelButtonColor: "#3085d6", // Blue color for cancel button
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Delete the item
    
          Swal.fire("Deleted!", "The item has been deleted.", "success");
        }
      });
    };
    
  

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
  };

  const handleInfoClick = (row) => {
    setSelectedFamily(row); // Set the selected family member's data
  };

  const handleSave = (updatedRow) => {
    console.log("Updated Row:", updatedRow);
    setIsEditing(false);
  };

  const handleSaveNew = (newData) => {
    console.log("New Data:", newData);
    globalData.push(newData);
    setIsAdding(false);
  };

  return (
    <div className="table-view">
      <div className="table-view-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <button className="filter-button">Filter</button>
        <button
          className="add-button"
          onClick={() => {
            setIsAdding(true);
          }}
        >
          + Add New
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Generation</th>
            <th>Mother&apos;s Name</th>
            <th>Father&apos;s Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td>
                <img src={row.photo_url} alt="Profile" />
                {row.name}
              </td>
              <td>
                <div
                  className={`flex items-center justify-center w-3/4 h-6 p-2 rounded-full ${
                    row.pusta_number === "1"
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: row.pusta_number === "1" ? "green" : "red" }}
                  ></span>
                  G{row.pusta_number}
                </div>
              </td>
              <td>{row.family_relations?.mother || "Unknown"}</td>
              <td>{row.family_relations?.father || "Unknown"}</td>
              <td>{row.gender}</td>
              <td>{row.date_of_birth}</td>
              <td>
                <button className="icon-button info-button" onClick={() => handleInfoClick(row)}>
                  <FaInfoCircle />
                </button>
                <button className="icon-button edit-button" onClick={() => handleEditClick(row)}>
                  <FaEdit />
                </button>
                <button className="icon-button delete-button" onClick={() => handleDelete(row)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        {/* <button className="import-button">
          Import <FaCloudDownloadAlt className="import-icon" />
        </button> */}
        <div className="paginate-align">
          <div>
            <span>Show </span>
            <select
              className="rows-per-page"
              value={rowsPerPage}
              onChange={(e) => {
                setCurrentPage(0);
                setRowsPerPage(parseInt(e.target.value, 10));
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span> Rows</span>
          </div>

          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={Math.ceil(globalData.length / rowsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditFormModal
          formData={{
            username: selectedRow.name || "",
            pusta_number: selectedRow.pusta_number || "",
            father_name: selectedRow.family_relations?.father || "",
            mother_name: selectedRow.family_relations?.mother || "",
            dob: selectedRow.date_of_birth || "",
            status: selectedRow.status || "Alive",
            profession: selectedRow.profession || "",
            gender: selectedRow.gender || "",
          }}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

      {/* Family Tree Modal */}
      {selectedFamily && (
        <FamilyTreeModal
          familyData={selectedFamily}
          onClose={() => setSelectedFamily(null)}
        />
      )}

      {/* Add New Modal */}
      {isAdding && (
        <EditFormModal
          formData={{
            username: "",
            pusta_number: "",
            father_name: "",
            mother_name: "",
            dob: "",
            status: "Alive",
            profession: "",
            gender: "Male",
          }}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveNew}
        />
      )}
    </div>
  );
};

export default TableView;
