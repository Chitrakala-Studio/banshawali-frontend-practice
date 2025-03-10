import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaCloudUploadAlt,
  FaFileAlt,
  FaDownload,
  FaArrowLeft,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaRegIdCard,
  FaMale,
  FaLightbulb,
  FaFemale,
  FaClock,
} from "react-icons/fa";
import EditFormModal from "./EditFormModal";
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";
import ToggleView from "./ToggleView";
import SearchForm from "./SearchForm";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import UserProfileModal from "./UserProfileModal";
import { useDropzone } from "react-dropzone";
import Suggestion from "./Suggestion";

const TableView = () => {
  const { id } = useParams();
  const [searchApplied, setSearchApplied] = useState(false);
  const [isAdminLocal, setIsAdminLocal] = useState(false);
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("data");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
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
    same_vamsha_status: true,
  });

  const handleAccept = (e, id, suggestion, image) => {
    e.stopPropagation();
    updateSuggestionStatus(id, "Approved", suggestion, image);
  };

  const handleReject = (e, id, suggestion, image) => {
    e.stopPropagation();
    updateSuggestionStatus(id, "Rejected", suggestion, image);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [id]);

  useEffect(() => {
    if (location.pathname === "/suggestions") {
      setActiveTab("suggestions");
      fetchSuggestions();
    } else {
      setActiveTab("data");
      fetchData(1);
    }
  }, [location.pathname, id]);

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
    fetchData(1);
  }, [navigate, id]);

  const fetchData = async (page) => {
    try {
      if (!hasMore) return;
      let response = null;

      if (id) {
        response = await fetch(`${API_URL}/people/${id}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await fetch(`${API_URL}/people/people/?page=${page}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      }

      const response_data = await response.json();
      const fetchedData = response_data.data;
      console.log("Fetched data:", fetchedData);

      if (page === 1) {
        setData(fetchedData);
        setFilteredData(fetchedData);
      } else {
        setData((prevData) => [...prevData, ...fetchedData]);
        setFilteredData((prevData) => [...prevData, ...fetchedData]);
      }
      setHasMore(fetchedData.next !== null);
    } catch (error) {
      console.error("Fetch error:", error);
      setHasMore(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(`${API_URL}/people/suggestions/`);
      console.log("Fetched suggestions:", response.data);
      const suggestionArray = response.data.data;
      setSuggestions(suggestionArray);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setHasMore(false);
    }
  };

  const handleSuggestionClick = (row) => {
    console.log("Suggestion Clicked:", row);
    Swal.fire({
      title: `Submit Suggestion for ${row.name_in_nepali}`,
      html: `
       <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet" crossorigin="anonymous">
       <textarea id="suggestion" class="swal2-input" placeholder="Enter your suggestion" style="height: 150px; width:410px;"></textarea>
       <div id="dropzone-container" class="dropzone border-dashed border-2 p-2 text-center cursor-pointer bg-white mt-3">
         <div id="file-picker" style="height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
           <p><i class="fa fa-cloud-upload-alt" style="font-size:40px"></i></p>
           Drag & drop an image here or click to select 
           <input type="file" id="file-input" accept="image/*" style="display: none;">
         </div>
       </div>
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      didOpen: () => {
        const dropzoneContainer = document.getElementById("dropzone-container");
        const fileInput = document.getElementById("file-input");
        const filePicker = document.getElementById("file-picker");
        const titleElement = document.querySelector(".swal2-title");
        if (titleElement) {
          titleElement.style.fontSize = "24px";
          titleElement.style.color = "antiquewhite";
          titleElement.style.fontFamily = "Times New Roman, sans-serif";
          titleElement.style.letterSpacing = "1px";
          titleElement.style.fontWeight = "bold";
          titleElement.style.marginBottom = "15px";
          titleElement.style.borderBottom = "2px solid #eaeaea";
          titleElement.style.paddingBottom = "10px";
        }
        const popupElement = document.querySelector(".swal2-popup");
        if (popupElement) {
          popupElement.style.backgroundColor = "#0b1d2e";
          popupElement.style.borderRadius = "10px";
          popupElement.style.padding = "20px";
          popupElement.style.border = "2px solid #0b1d2e";
        }
        filePicker.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (event) => {
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            dropzoneContainer.innerHTML = `<p>${file.name}</p>`;
            dropzoneContainer.file = file; // Store file for later use
          }
        });
        dropzoneContainer.addEventListener("dragover", (event) => {
          event.preventDefault();
          dropzoneContainer.style.borderColor = "blue";
        });
        dropzoneContainer.addEventListener("dragleave", () => {
          dropzoneContainer.style.borderColor = "gray";
        });
        dropzoneContainer.addEventListener("drop", (event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) {
            dropzoneContainer.innerHTML = `<p>${file.name}</p>`;
            dropzoneContainer.file = file; // Store file for later use
          }
        });
      },
      preConfirm: async () => {
        const suggestion = document.getElementById("suggestion").value;
        const dropzoneContainer = document.getElementById("dropzone-container");
        const file = dropzoneContainer.file;
        let photoUrl = "";
        if (file) {
          // Cloudinary Upload Setup
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
          const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
          const uploadData = new FormData();
          uploadData.append("file", file);
          uploadData.append("upload_preset", uploadPreset);
          try {
            const response = await axios.post(cloudUrl, uploadData);
            photoUrl = response.data.secure_url;
          } catch (error) {
            Swal.showValidationMessage(`Cloudinary upload failed: ${error}`);
          }
        }
        // API Payload
        const payload = {
          personId: row.id,
          suggestion: suggestion,
          user:
            JSON.parse(localStorage.getItem("user"))?.username || "Anonymous",
          ...(photoUrl && { image: photoUrl }),
        };
        try {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/people/suggestions/`,
            payload,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          return suggestion;
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
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

  const handleSearch = (criteria) => {
    const hasAnyCriteria = Object.values(criteria).some(
      (val) => val !== "" && val !== false
    );
    if (!hasAnyCriteria) {
      setFilteredData(data);
      setSearchApplied(false);
      setShowSearchForm(false);
      return;
    }
    setFilteredData(criteria);
    setSearchApplied(true);
    setShowSearchForm(false);
  };

  // Renamed handleGoBack to now be used for "View All Table"
  const handleGoBack = () => {
    if (id) {
      navigate("/");
    } else if (searchApplied) {
      setFilteredData(data);
      setSearchApplied(false);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditing(true);
  };

  const updateSuggestionStatus = async (id, newStatus, suggestion, image) => {
    try {
      const payload = { status: newStatus, suggestion, image, id };
      await axios.put(`${API_URL}/people/suggestions/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((suggestion) =>
          suggestion.id === id
            ? { ...suggestion, status: newStatus }
            : suggestion
        )
      );
      Swal.fire({
        title: `${newStatus}!`,
        text: `Suggestion status updated to ${newStatus}.`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating suggestion status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update suggestion status.",
        icon: "error",
      });
    }
  };

  const calculateAge = (dob, lifestatus) => {
    if (lifestatus && lifestatus.toLowerCase() === "dead") return "मृत्यु";
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
    return age === 0 ? "-" : convertToNepaliNumerals(age);
  };

  const handleRowClick = (suggestion) => {
    Swal.fire({
      title: "Suggestion Details",
      html: `
        <div style="text-align: left;">
          <p><strong>Suggestion:</strong> ${suggestion.suggestion}</p>
          ${
            suggestion.image
              ? `<img src="${suggestion.image}" alt="Suggestion" style="max-width: 400px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;" />`
              : "No Image"
          }
        </div>
      `,
      showCloseButton: true,
      showCancelButton: false,
    });
  };

  const handleInfoClick = (row) => {
    setSelectedRow(row);
    console.log("Selected Row Data:", row);
    setShowInfoPopup(true);
  };

  const handleSave = async (updatedRow) => {
    try {
      await axios.put(`${API_URL}/data/${updatedRow.id}`, updatedRow);
      fetchData(1);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleSaveNew = async (newData) => {
    try {
      await axios.post(`${API_URL}/people/`, newData);
      fetchData(1);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${row.name_in_nepali}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/people/${row.id}/`);
          fetchData(1);
          Swal.fire(
            "Deleted!",
            `${row.name_in_nepali} has been deleted.`,
            "success"
          );
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire("Error!", "Failed to delete record.", "error");
        }
      }
    });
  };

  const finalData = filteredData;
  const visibleData = finalData;

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchData(nextPage);
  };

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((digit) => nepaliNumerals[digit])
      .join("");
  };

  console.log("Visible Data:", filteredData);

  return (
    <div className="table-view transition-all duration-300 relative">
      <div className={isModalOpen ? "blurred" : ""}>
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-4">
            <ToggleView
              isTableView={isTableView}
              toggleView={() => setIsTableView(!isTableView)}
              availableId={visibleData.length > 0 ? visibleData[0].id : null}
            />
          </div>
          {isAdminLocal && (
            <div className="flex gap-4">
              {/* View Table */}
              {activeTab !== "data" && (
                <button
                  className="
                 px-4 py-2
                 rounded-md
                 shadow-md
                 text-white
                 focus:outline-none
                 transition-all
                 hover:scale-110
                 hover:shadow-lg
                 bg-indigo-600
                 hover:bg-indigo-700
               "
                  onClick={() => navigate("/")}
                >
                  View Table
                </button>
              )}
              {activeTab !== "suggestions" && (
                <button
                  className="
                   px-4 py-2
                   rounded-md
                   shadow-md
                   text-white
                   focus:outline-none
                   transition-all
                   hover:scale-110
                   hover:shadow-lg
                   bg-purple-600
                   hover:bg-purple-700
                 "
                  onClick={() => navigate("/suggestions")}
                >
                  View Suggestions
                </button>
              )}
              <button
                className="
          px-4 py-2
          rounded-md
          shadow-md
          text-white
          focus:outline-none
          transition-all
          hover:scale-110
          hover:shadow-lg
          bg-blue-600
          hover:bg-blue-700
          flex items-center space-x-2
        "
                onClick={() => setShowSearchForm(true)}
              >
                <FaSearch />
                <span>Search User</span>
              </button>
              {activeTab === "data" && (
                <button
                  className="
                  px-4 py-2
                  rounded-md
                  shadow-md
                  text-white
                  focus:outline-none
                  transition-all
                  hover:scale-110
                  hover:shadow-lg
                  bg-green-600
                  hover:bg-green-700
                  flex items-center space-x-2
                "
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
                  <span>+ Add New User</span>
                </button>
              )}
              {/* Conditionally show "View All Table" button when (id || searchApplied) is true */}
              {(id || searchApplied) && (
                <button
                  onClick={handleGoBack}
                  className="
                 px-4 py-2
                 rounded-md
                 shadow-md
                 text-white
                 focus:outline-none
                 transition-all
                 hover:scale-110
                 hover:shadow-lg
                 bg-gray-600
                 hover:bg-gray-700
                 flex items-center space-x-2
               "
                >
                  <FaArrowLeft />
                  <span>View All Table</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        {!id ? (
          <InfiniteScroll
            dataLength={visibleData.length}
            next={handleLoadMore}
            hasMore={hasMore && visibleData.length >= 15}
            loader={
              visibleData.length >= 15 ? (
                <div className="flex justify-center items-center h-screen">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
              ) : null
            }
            style={{ overflow: "hidden" }}
          >
            {activeTab === "data" ? (
              <div className="table-wrapper">
                <table className="ml-3 w-full">
                  <thead className="text-center border-b-2 border-gray-700 bg-gray-100">
                    <tr>
                      <th className="text-center">नाम</th>
                      <th className="text-center">पुस्ता नम्बर</th>
                      <th className="text-center">बाबुको नाम</th>
                      <th className="text-center">आमाको नाम</th>
                      <th className="text-center">लिङ्ग</th>
                      <th className="text-center">उमेर</th>
                      <th className="text-center">कार्यहरू</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className="border-b-2 border-gray-700 hover:bg-gray-200"
                      >
                        <td className="text-center">
                        <img
                            src={
                              row.photo ||
                              (row.gender === "Male"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                                : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg")
                            }
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {row.name_in_nepali}
                        </td>
                        <td className="text-center items-center justify-center">
                          {(() => {
                            const genColorClass =
                              row.pusta_number % 2 === 0
                                ? { bg: "bg-green-300 text-green-700" }
                                : { bg: "bg-orange-300 text-orange-700" };
                            return (
                              <div
                                className={`flex items-center justify-center w-2/4 m-auto h-6 p-2 rounded-full ${genColorClass.bg}`}
                              >
                                {convertToNepaliNumerals(row.pusta_number)}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="text-center">
                          {row.father ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`/${row.father.id}`)}
                            >
                              {row.father.name_in_nepali}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="text-center">
                          {row.mother ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`//${row.mother.id}`)}
                            >
                              {row.mothername_in_nepali}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="flex items-center space-x-2 text-gray-700 text-base justify-center">
                          {row.gender?.toLowerCase() === "male" ? (
                            <>
                              <FaMale className="text-blue-500 text-lg" />
                              <span className="font-medium">पुरुष</span>
                            </>
                          ) : row.gender?.toLowerCase() === "female" ? (
                            <>
                              <FaFemale className="text-pink-500 text-lg" />
                              <span className="font-medium">महिला</span>
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {row.lifestatus.toLowerCase() === "dead" ? (
                            <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                              मृत्यु
                            </span>
                          ) : (
                            calculateAge(row.date_of_birth, row.lifestatus)
                          )}
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleInfoClick(row)}>
                            <FaInfoCircle />
                          </button>
                          {isAdminLocal ? (
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
                              onClick={() => handleSuggestionClick(row)}
                            >
                              <FaLightbulb />
                            </button>
                          )}
                          <button
                            className="icon-button card-button text-gray-500 hover:text-blue-500"
                            title="View Card"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <FaRegIdCard />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Suggestion />
            )}
          </InfiniteScroll>
        ) : (
          <>
            {activeTab === "data" ? (
              <div className="table-wrapper">
                <table className="ml-3 w-full">
                  <thead className="text-center bg-gray-100">
                    <tr>
                    <th className="text-center">नाम</th>
                      <th className="text-center">पुस्ता नम्बर</th>
                      <th className="text-center">बाबुको नाम</th>
                      <th className="text-center">आमाको नाम</th>
                      <th className="text-center">लिङ्ग</th>
                      <th className="text-center">उमेर</th>
                      <th className="text-center">कार्यहरू</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-200">
                        <td className="text-center">
                          <img
                            src={
                              row.photo ||
                              (row.gender === "Male"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                                : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg")
                            }
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {row.name_in_nepali}
                        </td>
                        <td className="text-center items-center justify-center">
                          {(() => {
                            const genColorClass =
                              row.pusta_number % 2 === 0
                                ? {
                                    bg: "bg-green-300 text-green-700",
                                  }
                                : {
                                    bg: "bg-orange-300 text-orange-700",
                                  };
                            return (
                              <div
                                className={`flex items-center justify-center w-2/4 m-auto h-6 p-2 rounded-full ${genColorClass.bg}`}
                                title={genColorClass.label}
                              >
                                {convertToNepaliNumerals(row.pusta_number)}
                              </div>
                            );
                          })()}
                        </td>
                        <td className="text-center">
                          {row.father?.name_in_nepali || ""}
                        </td>
                        <td className="text-center">
                          {row.mother?.name_in_nepali || ""}
                        </td>
                        <td className="flex items-center py-12 space-x-2 text-gray-700 text-base justify-center">
                          {row.gender?.toLowerCase() === "male" ? (
                            <>
                              <FaMale className="text-blue-500 text-lg" />
                              <span className="font-medium">पुरुष</span>
                            </>
                          ) : row.gender?.toLowerCase() === "female" ? (
                            <>
                              <FaFemale className="text-pink-500 text-lg" />
                              <span className="font-medium">महिला</span>
                            </>
                          ) : (
                            <span></span>
                          )}
                        </td>
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
                          <button onClick={() => handleInfoClick(row)}>
                            <FaInfoCircle />
                          </button>
                          {isAdminLocal ? (
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
                            className="icon-button card-button text-gray-500 hover:text-blue-500"
                            title="View Card"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <FaRegIdCard />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Suggestion />
            )}
          </>
        )}
      </div>

      {showSearchForm && (
        <SearchForm
          initialCriteria={searchCriteria}
          onSearch={handleSearch}
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
            father_id: selectedRow.father?.id || "",
            mother_id: selectedRow.mother?.id || "",
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
            vansha_status: selectedRow.same_vamsha_status ? "True" : "False",
          }}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

      {showInfoPopup && (
        <UserProfileModal
          user={{ ...selectedRow, contact: selectedRow.contact_details }}
          onClose={() => setShowInfoPopup(false)}
        />
      )}
    </div>
  );
};

export default TableView;
