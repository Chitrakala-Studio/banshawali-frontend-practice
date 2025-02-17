import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaCloudDownloadAlt,
  FaLightbulb,
  FaRegIdCard,
  FaMale,
  FaFemale,
} from "react-icons/fa";
//import ReactPaginate from "react-paginate";
import EditFormModal from "./EditFormModal";
//import CardViewPopup from "./CardViewPopup";
import FamilyTreeModal from "./FamilyTreeModal";
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";
import ToggleView from "./ToggleView";
import SearchForm from "./SearchForm";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const TableView = () => {
  const [isAdminLocal, setIsAdminLocal] = useState(false);
  // const [currentPage, setCurrentPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(7);
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [formData, setFormData] = useState({
    username: "",
    pusta_number: "",
    father_name: "",
    mother_name: "",
    dob: "",
    lifestatus: "Alive",
    profession: "",
    gender: "Male",
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    pustaNumber: "",
    phone: "",
    email: "",
    father_name: "",
    mother_name: "",
  });
  const [showSearchForm, setShowSearchForm] = useState(false);
  const API_URL = "https://gautamfamily.org.np";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        setIsAdminLocal(user.role === "admin");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://gautamfamily.org.np/people/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Fetched data:", data);
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const sortedData = [...data].sort((a, b) => Number(a.id) - Number(b.id));
  const availableId = sortedData.length > 0 ? sortedData[0].id : null;

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
  };
  const calculateAge = (dob, lifestatus) => {
    if (lifestatus && lifestatus.toLowerCase() === "Dead") return "Dead";
    if (!dob) return "-";
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "-";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age === 0) return "-";
    return age;
  };

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    console.log("Selected Row Data:", row); // Debugging line
    setShowInfoPopup(true);
  };
  const handleSave = async (updatedRow) => {
    try {
      await axios.put(`${API_URL}/data/${updatedRow.id}`, updatedRow);
      fetchData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleSaveNew = async (newData) => {
    try {
      await axios.post(`${API_URL}/people/`, newData);
      fetchData();
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/people/${row.id}/`);
          fetchData();
          Swal.fire("Deleted!", `${row.name} has been deleted.`, "success");
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire("Error!", "Failed to delete record.", "error");
        }
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

  const fetchAllData = async () => {
    try {
      const response = await fetch(`${API_URL}/people/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const allData = await response.json();
      setData(allData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const filteredData = data.filter((row) => {
    const { name, pustaNumber, phone, email, father_name, mother_name } =
      searchCriteria;
    let matches = true;
    if (name) {
      matches = matches && row.name.toLowerCase().includes(name.toLowerCase());
    }
    if (pustaNumber) {
      matches = matches && row.pusta_number.toString().includes(pustaNumber);
    }
    if (phone) {
      matches =
        matches &&
        row.contact_details?.phone &&
        row.contact_details.phone.includes(phone);
    }
    if (email) {
      matches =
        matches &&
        row.contact_details?.email &&
        row.contact_details.email.toLowerCase().includes(email.toLowerCase());
    }
    if (father_name) {
      matches =
        matches &&
        row.father?.name &&
        row.father.name.toLowerCase().includes(father_name.toLowerCase());
    }
    if (mother_name) {
      matches =
        matches &&
        row.mother?.name &&
        row.mother.name.toLowerCase().includes(mother_name.toLowerCase());
    }

    return matches;
  });

  const visibleData = filteredData.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  return (
    <div className="table-view transition-all duration-300">
      <ToggleView
        isTableView={isTableView}
        toggleView={() => setIsTableView(!isTableView)}
        availableId={visibleData.length > 0 ? visibleData[0].id : null}
        className=""
      />

      <div className="table-view-filters mt-10 p-4">
        <button
          className="search-button"
          style={{
            borderRadius: "50px",
            height: "45px",
            lineHeight: "30px",
            padding: "0 20px",
          }}
          onClick={() => setShowSearchForm(true)}
        >
          Search
        </button>
        {/* if not is Admin then no button to add  */}
        {isAdminLocal ? (
          <button
            className="add-button"
            style={{
              borderRadius: "50px",
              height: "45px",
              lineHeight: "30px",
              padding: "0 20px",
            }}
            onClick={() => {
              setFormData({
                username: "",
                pusta_number: "",
                father_name: "",
                mother_name: "",
                dob: "",
                lifestatus: "Alive",
                profession: "",
                gender: "Male",
              });
              setIsAdding(true);
            }}
          >
            + Add New
          </button>
        ) : null}
      </div>
      <InfiniteScroll
        dataLength={visibleData.length}
        next={handleLoadMore}
        hasMore={displayCount < filteredData.length}
        loader={<h4>Loading more data...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>All data has been loaded</b>
          </p>
        }
      >
        <table
          className="ml-3
      "
        >
          <thead className="text-center">
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Generation</th>
              <th className="text-center">Father Name</th>
              <th className="text-center">Mother Name</th>
              <th className="text-center">Gender</th>
              <th className="text-center">Age</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {visibleData.map((row, index) => (
              <tr key={index}>
                <td className="text-center">
                  <img
                    src={
                      row.photo ||
                      "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
                    }
                    alt="Profile"
                  />
                  {row.name}
                </td>
                <td className="text-center">
                  {(() => {
                    const parsedPustaNumber = parseInt(
                      row.pusta_number.replace(/\D/g, ""),
                      10
                    );
                    return parsedPustaNumber % 2 === 1 ? (
                      <div className="flex items-center justify-center w-3/4 h-6 p-2 rounded-full bg-green-200 text-green-700">
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "green" }}
                        ></span>
                        {row.pusta_number}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-3/4 h-6 p-2 rounded-full bg-red-200 text-red-700">
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: "red" }}
                        ></span>
                        {row.pusta_number}
                      </div>
                    );
                  })()}
                </td>

                <td className="text-center">{row.father?.name || "-"}</td>
                <td className="text-center">{row.mother?.name || "-"}</td>
                <td className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {row.gender?.toLowerCase() === "male" ? (
                      <>
                        <FaMale style={{ color: "blue", fontSize: "1.5rem" }} />
                        <span>Male</span>
                      </>
                    ) : row.gender?.toLowerCase() === "female" ? (
                      <>
                        <FaFemale
                          style={{ color: "pink", fontSize: "1.5rem" }}
                        />
                        <span>Female</span>
                      </>
                    ) : (
                      <span>{row.gender}</span>
                    )}
                  </div>
                </td>

                <td className="text-center">
                  {calculateAge(row.date_of_birth, row.lifestatus)}
                </td>

                <td className="text-center">
                  <button
                    className="icon-button info-button"
                    onClick={() => handleInfoClick(row)}
                  >
                    <FaInfoCircle />
                  </button>
                  {
                    isAdminLocal ? (
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
                    ) : null
                    // ) : (
                    //   <button
                    //     className="icon-button suggestion-button"
                    //     onClick={handleSuggestionClick}
                    //   >
                    //     <FaLightbulb />
                    //   </button>
                    // )
                  }
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
      </InfiniteScroll>
      <div className="table-footer">
        {/* <button className="import-button">
          Import <FaCloudDownloadAlt className="import-icon" />
        </button> */}
        <div className="flex items-center justify-between w-full mt-4">
          {/* <div className="flex items-center space-x-2">
            <span>Show </span>
            <select
              className="border bg-white rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rowsPerPage}
              onChange={(e) => {
                setCurrentPage(0);
                setRowsPerPage(parseInt(e.target.value, 10));
              }}
            >
              <option value={7}>7</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={15}>15</option>
            </select>
            <span> Rows</span>
          </div> */}

          {/* <ReactPaginate
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
            pageCount={Math.ceil(filteredData.length / rowsPerPage)} // Updated here
            onPageChange={handlePageChange}
            containerClassName={"flex items-center space-x-2"}
            activeClassName={
              "bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer"
            }
          /> */}
        </div>
      </div>

      {showSearchForm && (
        <SearchForm
          initialCriteria={searchCriteria}
          onSearch={(criteria) => {
            setSearchCriteria(criteria);
            setShowSearchForm(false);
          }}
          onClose={() => setShowSearchForm(false)}
        />
      )}

      {isAdding && (
        <EditFormModal
          formData={formData}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveNew}
        />
      )}

      {isEditing && (
        <EditFormModal
          formData={{
            id: selectedRow.id || "",
            profileImage: selectedRow.photo || "",
            name: selectedRow.name || "",
            name_in_nepali: selectedRow.name_in_nepali || "",
            pusta_number: selectedRow.pusta_number || "",
            father_name: selectedRow.father?.name || "",
            mother_name: selectedRow.mother?.name || "",
            dob: selectedRow.date_of_birth || "",
            lifestatus: selectedRow.lifestatus || "Alive",
            death_date: selectedRow.date_of_death || "",
            profession: selectedRow.profession || "",
            gender: selectedRow.gender || "",
            contact: {
              email: selectedRow.contact_details?.email || "",
              phone: selectedRow.contact_details?.phone || "",
              address: selectedRow.contact_details?.address || "",
            },
            vansha_status: selectedRow.vansha ? "True" : "False",
          }}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

      {showInfoPopup && (
        <FamilyTreeModal
          familyData={{
            id: selectedRow.id || "",
            profileImage: selectedRow.photo || "",
            name: selectedRow.name || "",
            name_in_nepali: selectedRow.name_in_nepali || "",
            pusta_number: selectedRow.pusta_number || "",
            father_name: selectedRow.father?.name || "",
            mother_name: selectedRow.mother?.name || "",
            date_of_birth: selectedRow.date_of_birth || "",
            lifestatus: selectedRow.lifestatus || "Alive",
            profession: selectedRow.profession || "",
            gender: selectedRow.gender || "",
            email: selectedRow.contact_details?.email || "",
            phone: selectedRow.contact_details?.phone || "",
            address: selectedRow.contact_details?.address || "",
          }}
          onClose={() => setShowInfoPopup(false)}
        />
      )}
    </div>
  );
};

export default TableView;
