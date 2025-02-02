import { useState } from "react";
import {
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudDownloadAlt,
  FaLightbulb,
  FaRegIdCard,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { globalData } from "../data/globalData";
import EditFormModal from "./EditFormModal";
import CardViewPopup from "./CardViewPopup";
import FamilyTreeModal from "./FamilyTreeModal";
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";
import ToggleView from "./ToggleView";
import { useNavigate } from "react-router-dom";

const TableView = ({ isAdmin = true }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    generation: "",
    fatherName: "",
    motherName: "",
  });

  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    pusta_number: "",
    father_name: "",
    mother_name: "",
    dob: "",
    status: "Alive",
    profession: "",
    gender: "Male",
  });

  const offset = currentPage * rowsPerPage;
  const currentRows = globalData.slice(offset, offset + rowsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
  };

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    setShowInfoPopup(true);
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

  const applyFilter = () => {
    console.log("Filters Applied:", filterData);
    setIsFilterOpen(false);
  };

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleted row:", row);
        Swal.fire("Deleted!", `${row.name} has been deleted.`, "success");
      }
    });
  };

  const handleSuggestionClick = () => {
    Swal.fire({
      title: "Submit Suggestion",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      preConfirm: (suggestion) => {
        // Handle the suggestion submission here
        console.log("Suggestion:", suggestion);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Suggestion Submitted!",
          text: "Your suggestion has been submitted successfully.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="table-view h-full ml-0 lg:ml-64 transition-all duration-300">
      <ToggleView
        isTableView={isTableView}
        toggleView={() => setIsTableView(!isTableView)}
      />
      <div className="table-view-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="relative">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filter
          </button>

          {isFilterOpen && (
            <div
              className="absolute w-64 p-4 bg-white border border-gray-300 rounded-md shadow-md z-10"
              style={{
                top: "50%",
                left:
                  window.innerWidth -
                    (document.querySelector(".table-view")?.offsetWidth || 0) <
                  300
                    ? "auto"
                    : "0",
                right:
                  window.innerWidth -
                    (document.querySelector(".table-view")?.offsetWidth || 0) <
                  300
                    ? "0"
                    : "auto",
              }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Filter
              </h3>
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Generation
                </label>
                <input
                  type="text"
                  className="w-full bg-white px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter generation"
                  value={filterData.generation}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      generation: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter father's name"
                  value={filterData.fatherName}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      fatherName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Mother's Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white px-3 py-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter mother's name"
                  value={filterData.motherName}
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      motherName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={applyFilter}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="add-button"
          onClick={() => {
            setFormData({
              username: "",
              pusta_number: "",
              father_name: "",
              mother_name: "",
              dob: "",
              status: "Alive",
              profession: "",
              gender: "Male",
            });
            setIsAdding(true);
          }}
        >
          + Add New
        </button>
      </div>
      <table
        className="ml-3
      "
      >
        <thead className="text-center">
          <tr>
            <th>Name</th>
            <th>Generation</th>
            <th>Mother&apos;s name</th>
            <th>Father&apos;s name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center" >
          {currentRows.map((row, index) => (
            <tr key={index}>
              <td>
                <img src={row.photo_url || "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" } alt="Profile" />
                {row.name}
              </td>
              <td>
                {row.pusta_number % 2 === 1 ? ( // Check if the generation number is odd
                  <div className="flex items-center justify-center w-3/4 h-6 p-2 rounded-full bg-green-200 text-green-700">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: "green" }}
                    ></span>
                    G{row.pusta_number}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-3/4 h-6 p-2 rounded-full bg-red-200 text-red-700">
                    <span
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: "red" }}
                    ></span>
                    G{row.pusta_number}
                  </div>
                )}
              </td>
              <td>{row.mother ? row.mother.name : "-"}</td>
              <td>{row.father ? row.father.name : "-"}</td>
              <td>{row.gender}</td>
              <td>{row.date_of_birth}</td>
              <td>
                <button
                  className="icon-button info-button"
                  onClick={() => handleInfoClick(row)}
                >
                  <FaInfoCircle />
                </button>
                {isAdmin ? (
                  <>
                    <button
                      className="icon-button edit-button"
                      onClick={() => handleEditClick(row)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-button delete-button"
                      onClick={() => handleDelete(row)}
                    >
                      <FaTrash />
                    </button>
                  </>
                ) : (
                  <button
                    className="icon-button suggestion-button"
                    onClick={handleSuggestionClick}
                  >
                    <FaLightbulb />
                  </button>
                )}
                <button
                  className="icon-button card-button"
                  onClick={() => navigate(`/${row.id}`)}
                >
                  <FaRegIdCard />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <button className="import-button">
          Import <FaCloudDownloadAlt className="import-icon" />
        </button>
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex items-center space-x-2">
            <span>Show </span>
            <select
              className="border bg-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rowsPerPage}
              onChange={(e) => {
                setCurrentPage(0);
                setRowsPerPage(parseInt(e.target.value, 10));
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <span> Rows</span>
          </div>

          <ReactPaginate
            previousLabel={
              <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                {"<"}
              </button>
            }
            nextLabel={
              <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
                {">"}
              </button>
            }
            breakLabel={"..."}
            pageCount={Math.ceil(globalData.length / rowsPerPage)}
            onPageChange={handlePageChange}
            containerClassName={"flex items-center space-x-2"}
            activeClassName={
              "bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer"
            }
          />
        </div>
      </div>

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

      {showInfoPopup && (
        <FamilyTreeModal
          familyData={selectedRow}
          onClose={() => setShowInfoPopup(false)}
        />
      )}

      {isAdding && (
        <EditFormModal
          formData={formData}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveNew}
        />
      )}
    </div>
  );
};

export default TableView;
