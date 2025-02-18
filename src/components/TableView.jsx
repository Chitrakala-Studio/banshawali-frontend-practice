import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaRegIdCard,
  FaMale,
  FaFemale,
} from "react-icons/fa";
import EditFormModal from "./EditFormModal";
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";
import ToggleView from "./ToggleView";
import SearchForm from "./SearchForm";
import { useNavigate, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import UserProfileModal from "./UserProfileModal";

const TableView = () => {
  const [isAdminLocal, setIsAdminLocal] = useState(false);
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedParentName, setSelectedParentName] = useState(null);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const isModalOpen = isAdding || isEditing || showSearchForm || showInfoPopup;
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
    pusta_number: "",
    phone: "",
    email: "",
    father_name: "",
    mother_name: "",
  });

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
      // Check in param if there is id and fetch data for that id
      const id = window.location.pathname.split("/")[2];
      console.log("ID:", id);
      let response = null;
      if (id) {
        response = await fetch(`${API_URL}/people/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await fetch(`${API_URL}/people/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      }
      const fetchedData = await response.json();
      console.log("Fetched data:", fetchedData);
      setData(fetchedData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
  };

  const calculateAge = (dob, lifestatus) => {
    if (lifestatus && lifestatus.toLowerCase() === "dead") return "Dead";
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
    return age === 0 ? "-" : age;
  };

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    console.log("Selected Row Data:", row);
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

  const finalData = data;

  // IMPORTANT: Use finalData for the visible rows.
  const visibleData = Array.isArray(finalData)
    ? finalData.slice(0, displayCount)
    : [finalData];

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };
  console.log("Visible Data:", visibleData);
  return (
    <div className="table-view transition-all duration-300">
      <div className={isModalOpen ? "blurred" : ""}>
        <ToggleView
          isTableView={isTableView}
          toggleView={() => setIsTableView(!isTableView)}
          availableId={visibleData.length > 0 ? visibleData[0].id : null}
          className=""
        />

        <div className="table-view-filters mt-10 p-4">
          {selectedParentName && (
            <div style={{ width: "100%", textAlign: "left" }}>
              <button
                onClick={() => setSelectedParentName(null)}
                style={{
                  borderRadius: "20px",
                  height: "45px",
                  lineHeight: "30px",
                  padding: "0 20px",
                }}
              >
                Go back
              </button>
            </div>
          )}

          <button
            className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-all shadow-md flex items-center space-x-2"
            onClick={() => setShowSearchForm(true)}
          >
            <FaSearch className="text-white" />
            <span>Search</span>
          </button>

          {isAdminLocal && (
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all shadow-md"
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
          )}
        </div>
        <InfiniteScroll
          dataLength={visibleData.length}
          next={handleLoadMore}
          hasMore={displayCount < finalData.length}
          loader={<h4>Loading more data...</h4>}
          style={{ overflow: "hidden" }}
        >
          <table className="ml-3 w-full">
            <thead className="text-center border-b-2 border-gray-700 bg-gray-100">
              <tr>
                <th className="text-center p-3 font-semibold text-lg">Name</th>
                <th className="text-center p-3 font-semibold text-lg">
                  Pusta Number
                </th>
                <th className="text-center p-3 font-semibold text-lg">
                  Father Name
                </th>
                <th className="text-center p-3 font-semibold text-lg">
                  Mother Name
                </th>
                <th className="text-center p-3 font-semibold text-lg">
                  Gender
                </th>
                <th className="text-center p-3 font-semibold text-lg">Age</th>
                <th className="text-center p-3 font-semibold text-lg">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {visibleData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b-2 border-gray-700 hover:bg-gray-200 transition-all duration-200"
                >
                  <td className="text-center ">
                    <img
                      src={
                        row.photo ||
                        "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    {row.name}
                  </td>
                  <td className="text-center items-center justify-center">
                    {(() => {
                      // If the pusta_number is red then first green  else orange
                      const genColorClass =
                        row.pusta_number % 2 === 0
                          ? {
                              bg: "bg-green-300 text-green-700",
                              label: "Even Generation",
                            }
                          : {
                              bg: "bg-orange-300 text-orange-700",
                              label: "Odd Generation",
                            };

                      return (
                        <div
                          className={`flex items-center justify-center w-3/4 h-6 p-2 rounded-full ${genColorClass.bg}`}
                          title={genColorClass.label}
                        >
                          <span className="w-2 h-2 rounded-full mr-2"></span>
                          {row.pusta_number}
                        </div>
                      );
                    })()}
                  </td>

                  <td className="text-center">
                    {row.father?.name ? (
                      <Link to={`/${row.father.id}`} className="text-blue-500">
                        {row.father.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-center">
                    {row.mother?.name ? (
                      <Link to={`/${row.mother.id}`} className="text-blue-500">
                        {row.mother.name}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </td>
                  {row.gender?.toLowerCase() === "male" ? (
                    <>
                      <td className="flex items-center space-x-2 text-gray-700 text-base justify-center">
                        <FaMale className="text-blue-500 text-lg" />
                        <span className="font-medium">Male</span>
                      </td>
                    </>
                  ) : row.gender?.toLowerCase() === "female" ? (
                    <>
                      <td className="flex items-center space-x-2 text-gray-700 text-base justify-center">
                        <FaFemale className="text-pink-500 text-lg" />
                        <span className="font-medium">Female</span>
                      </td>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                  <td className="text-center">
                    {row.lifestatus.toLowerCase() === "dead" ? (
                      <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                        Dead
                      </span>
                    ) : (
                      calculateAge(row.date_of_birth, row.lifestatus)
                    )}
                  </td>

                  <td className="text-center">
                    <div className="flex space-x-3 items-center justify-center">
                      <button
                        className="icon-button text-gray-500 hover:text-blue-500"
                        title="View Info"
                        onClick={() => handleInfoClick(row)}
                      >
                        <FaInfoCircle />
                      </button>
                      {isAdminLocal && (
                        <>
                          <button
                            className="icon-button text-gray-500 hover:text-green-500"
                            title="Edit"
                            onClick={() => handleEditClick(row)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="icon-button text-gray-500 hover:text-red-500"
                            title="Delete"
                            onClick={() => handleDelete(row)}
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                      <button
                        className="icon-button card-button text-gray-500 hover:text-blue-500"
                        title="View Card"
                        onClick={() => navigate(`/card/${row.id}`)}
                      >
                        <FaRegIdCard />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
      <div className="table-footer">
        {/* <button className="import-button">
          Import <FaCloudDownloadAlt className="import-icon" />
        </button> */}
        <div className="flex items-center justify-between w-full mt-4">
          {/* Pagination controls removed */}
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
        <UserProfileModal
          user={selectedRow}
          onClose={() => setShowInfoPopup(false)}
        />
      )}
    </div>
  );
};

export default TableView;
