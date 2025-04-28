import { React, useState, useEffect } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaSearch,
  FaMale,
  FaFemale,
  FaSitemap,
} from "react-icons/fa";
import {
  NotebookPen,
  Trash2,
  Info,
  IdCard,
  Lightbulb,
  ArrowLeftRight,
  X as XIcon,
  Upload,
} from "lucide-react";
import EditFormModal from "./EditFormModal";
import "./../assets/styles/TableView.css";
import Swal from "sweetalert2";
import ToggleView from "./ToggleView";
import SearchForm from "./SearchForm";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import UserProfileModal from "./UserProfileModal";
import { useDropzone } from "react-dropzone";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Suggestion from "./Suggestion";
import ClipLoader from "react-spinners/ClipLoader";
import FamilyTreeGraph from "./FamilyTreeGraph";

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
  const [familyTreePerson, setFamilyTreePerson] = useState(null);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
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

  const handleCompare = (row) => {
    navigate(`/compare/${row.id}`);
  };

  const handleFamilyTree = (row) => {
    setFamilyTreePerson(row);
    setShowFamilyTree(true);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        setIsAdminLocal(false);
      }
    } else {
      setIsAdminLocal(false);
    }
    fetchData(1);
  }, [id]);

  const fetchData = async (page = 1) => {
    try {
      console.log(
        "Fetching data for:",
        id ? `person ID ${id}` : `page ${page}`
      );
      let response_data;
      if (id) {
        const response = await fetch(`${API_URL}/people/${id}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Single person response:", result);
        console.log(
          "Fetched person data (raw):",
          JSON.stringify(result.data, null, 2)
        );
        if (!result.data) {
          console.error("No data found for ID:", id);
          setData([]);
          setFilteredData([]);
          setHasMore(false);
          return;
        }
        response_data = Array.isArray(result.data)
          ? result.data
          : [result.data];
        setHasMore(false);
      } else {
        const response = await fetch(`${API_URL}/people/people/?page=${page}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("People list response:", result);
        response_data = result.data || [];
        setHasMore(result.next !== null);
      }

      if (page === 1 || id) {
        setData(response_data);
        setFilteredData(response_data);
      } else {
        setData((prev) => [...prev, ...response_data]);
        setFilteredData((prev) => [...prev, ...response_data]);
      }
      console.log("Visible data after fetch:", response_data);
    } catch (error) {
      console.error("Fetch error:", error);
      setData([]);
      setFilteredData([]);
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
      title: `Submit Suggestion for ${row.name_in_nepali || "Unknown"}`,
      html: `
        <textarea id="suggestion" placeholder="Enter your suggestion" style="
          height: 150px; 
          width: 410px; 
          background-color: #fffaf0; 
          border: 2px solid #F49D37; 
          border-radius: 10px; 
          padding: 10px; 
          font-family: 'Merriweather', serif; 
          font-size: 16px; 
          color: #374151; 
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          resize: none;
        "></textarea>
        <div id="dropzone-container" style="
          border: 2px dashed #F49D37; 
          padding: 15px; 
          text-align: center; 
          cursor: pointer; 
          background-color: #fffaf0; 
          margin-top: 15px; 
          border-radius: 10px; 
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        ">
          <div id="file-picker" style="
            height: 80px; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            color: #0A6C74; 
            font-family: 'Merriweather', serif; 
            font-size: 16px;
          ">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="40px" width="40px" xmlns="http://www.w3.org/2000/svg"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><path d="M7 9l5 -5l5 5"/><path d="M12 4v12"/></svg>
            Drag & drop an image here or click to select
            <input type="file" id="file-input" accept="image/*" style="display: none;">
          </div>
        </div>
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#0A6C74",
      cancelButtonColor: "#F49D37",
      didOpen: () => {
        const dropzoneContainer = document.getElementById("dropzone-container");
        const fileInput = document.getElementById("file-input");
        const filePicker = document.getElementById("file-picker");
        const titleElement = document.querySelector(".swal2-title");
        const popupElement = document.querySelector(".swal2-popup");
        const confirmButton = document.querySelector(".swal2-confirm");
        const cancelButton = document.querySelector(".swal2-cancel");

        // Style the title
        if (titleElement) {
          titleElement.style.fontSize = "24px";
          titleElement.style.color = "#0A6C74";
          titleElement.style.fontFamily = "'Playfair Display', serif";
          titleElement.style.letterSpacing = "1px";
          titleElement.style.fontWeight = "bold";
          titleElement.style.marginBottom = "15px";
          titleElement.style.borderBottom = "2px solid #F49D37";
          titleElement.style.paddingBottom = "10px";
          titleElement.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.1)";
        }

        // Style the popup
        if (popupElement) {
          popupElement.style.background =
            "linear-gradient(to bottom, #fffaf0, #ffffff)";
          popupElement.style.borderRadius = "15px";
          popupElement.style.padding = "25px";
          popupElement.style.border = "2px solid #F49D37";
          popupElement.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
        }

        // Style the confirm button
        if (confirmButton) {
          confirmButton.style.backgroundColor = "#0A6C74";
          confirmButton.style.color = "#F49D37";
          confirmButton.style.borderRadius = "8px";
          confirmButton.style.padding = "10px 20px";
          confirmButton.style.fontFamily = "'Playfair Display', serif";
          confirmButton.style.fontSize = "16px";
          confirmButton.style.transition =
            "background-color 0.2s, transform 0.2s";
          confirmButton.addEventListener("mouseover", () => {
            confirmButton.style.backgroundColor = "#0E8290";
            confirmButton.style.transform = "scale(1.05)";
          });
          confirmButton.addEventListener("mouseout", () => {
            confirmButton.style.backgroundColor = "#0A6C74";
            confirmButton.style.transform = "scale(1)";
          });
        }

        // Style the cancel button
        if (cancelButton) {
          cancelButton.style.backgroundColor = "#F49D37";
          cancelButton.style.color = "#0A6C74";
          cancelButton.style.borderRadius = "8px";
          cancelButton.style.padding = "10px 20px";
          cancelButton.style.fontFamily = "'Playfair Display', serif";
          cancelButton.style.fontSize = "16px";
          cancelButton.style.transition =
            "background-color 0.2s, transform 0.2s";
          cancelButton.addEventListener("mouseover", () => {
            cancelButton.style.backgroundColor = "#e68b2a";
            cancelButton.style.transform = "scale(1.05)";
          });
          cancelButton.addEventListener("mouseout", () => {
            cancelButton.style.backgroundColor = "#F49D37";
            cancelButton.style.transform = "scale(1)";
          });
        }

        // File picker event listeners
        filePicker.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (event) => {
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            dropzoneContainer.innerHTML = `<p style="color: #0A6C74; font-family: 'Merriweather', serif;">${file.name}</p>`;
            dropzoneContainer.file = file;
          }
        });
        dropzoneContainer.addEventListener("dragover", (event) => {
          event.preventDefault();
          dropzoneContainer.style.borderColor = "#800000";
        });
        dropzoneContainer.addEventListener("dragleave", () => {
          dropzoneContainer.style.borderColor = "#F49D37";
        });
        dropzoneContainer.addEventListener("drop", (event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) {
            dropzoneContainer.innerHTML = `<p style="color: #0A6C74; font-family: 'Merriweather', serif;">${file.name}</p>`;
            dropzoneContainer.file = file;
          }
        });
      },
      preConfirm: async () => {
        const suggestion = document.getElementById("suggestion").value;
        const dropzoneContainer = document.getElementById("dropzone-container");
        const file = dropzoneContainer.file;
        let photoUrl = "";
        if (file) {
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
        const payload = {
          suggestion: suggestion,
          suggestion_to: row.id,
          user:
            JSON.parse(localStorage.getItem("user"))?.username || "Anonymous",
          name_in_nepali: row.name_in_nepali || "Unknown",
          ...(photoUrl && { image: photoUrl }),
        };

        try {
          await axios.post(`${API_URL}/people/suggestions/`, payload, {
            headers: { "Content-Type": "application/json" },
          });
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
          confirmButtonColor: "#0A6C74",
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

  const handleGoBack = () => {
    if (id) {
      navigate("/", { replace: true });
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
    return age === 0 ? "-" : convertToNepaliNumerals(age, false);
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
      text: `Do you want to delete ${
        row.name_in_nepali || "this record"
      }? This action cannot be undone.`,
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
            `${row.name_in_nepali || "Record"} has been deleted.`,
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

  const convertToNepaliNumerals = (number, useNepali = true) => {
    if (number == null || isNaN(number)) return "-";
    if (!useNepali) return number.toString();
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((digit) => nepaliNumerals[digit])
      .join("");
  };

  return (
    <div className="table-view transition-all duration-300 relative">
      {/* Override react-tooltip styles globally */}
      <style>
        {`
          .react-tooltip {
            background-color: #fffaf0 !important;
            color: #0A6C74 !important;
            border: 1px solid #F49D37 !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            font-family: 'Playfair Display', serif !important;
            font-size: 14px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }
          .react-tooltip-arrow {
            border-color: #F49D37 !important;
          }
        `}
      </style>

      <div className={isModalOpen ? "blurred" : ""}>
        {/* Top Bar */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-4">
            <ToggleView
              isTableView={isTableView}
              toggleView={() => setIsTableView(!isTableView)}
              availableId={visibleData.length > 0 ? visibleData[0]?.id : null}
            />
          </div>
          <div className="flex gap-4">
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
                 bg-[#0A6C74]
                 hover:bg-[#0E8290]
                 flex items-center space-x-2
               "
              >
                <FaArrowLeft />
                <span>View All Table</span>
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
                bg-[#0A6C74]
                hover:bg-[#0E8290]
                flex items-center space-x-2
              "
              onClick={() => setShowSearchForm(true)}
            >
              <FaSearch />
              <span>Search User</span>
            </button>
            {isAdminLocal && (
              <>
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
                     bg-[#0A6C74]
                     hover:bg-[#0E8290]
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
                     bg-[#0A6C74]
                     hover:bg-[#0E8290]
                   "
                    onClick={() => navigate("/suggestions")}
                  >
                    View Suggestions
                  </button>
                )}
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
                     bg-[#0A6C74]
                     hover:bg-[#0E8290]
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
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "data" && filteredData.length === 0 && (
          <div className="text-center py-4 text-[#800000]">
            {id
              ? `No data found for ID ${id}. The record may not exist or has been deleted.`
              : "No data available. Try adding a new user or searching for existing ones."}
          </div>
        )}
        {!id ? (
          <InfiniteScroll
            dataLength={visibleData.length}
            next={handleLoadMore}
            hasMore={hasMore && visibleData.length >= 15}
            loader={
              <div className="flex justify-center items-center py-6">
                <ClipLoader color="#4B5563" loading={true} size={35} />
              </div>
            }
            style={{ overflow: "hidden" }}
          >
            {activeTab === "data" ? (
              <div className="table-wrapper">
                <table className="ml-3 w-full">
                  <thead className="text-center border-b-2 border-gray-500 bg-gray-100">
                    <tr>
                      <th className="text-center text-[#800000]">नाम</th>
                      <th className="text-center text-[#800000]">
                        पुस्ता नम्बर
                      </th>
                      <th className="text-center text-[#800000]">बाबुको नाम</th>
                      <th className="text-center text-[#800000]">आमाको नाम</th>
                      <th className="text-center text-[#800000]">लिङ्ग</th>
                      <th className="text-center text-[#800000]">उमेर</th>
                      <th className="text-center text-[#800000]">कार्यहरू</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b-2 border-gray-300 hover:bg-gray-200 ${
                          row.gender && row.gender.toLowerCase() === "male"
                            ? "bg-blue-100"
                            : row.gender &&
                              row.gender.toLowerCase() === "female"
                            ? "bg-pink-100"
                            : "bg-gray-50"
                        }`}
                      >
                        <td className="text-center text-[#800000]">
                          <img
                            src={
                              row.photo ||
                              (row.gender && row.gender.toLowerCase() === "male"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                                : row.gender &&
                                  row.gender.toLowerCase() === "female"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
                                : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/defaulticon.png")
                            }
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {row.name_in_nepali || "-"}
                        </td>
                        <td className="text-center items-center justify-center">
                          <div
                            className={`flex items-center justify-center w-2/4 m-auto h-6 p-2 rounded-full ${
                              row.pusta_number && row.pusta_number % 2 === 0
                                ? "bg-[#0A6C74] text-white"
                                : "bg-[#F49D37] text-white"
                            }`}
                          >
                            {convertToNepaliNumerals(row.pusta_number, true)}
                          </div>
                        </td>
                        <td className="text-center">
                          {row.father &&
                          row.father.id &&
                          row.father.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`/${row.father.id}`)}
                            >
                              {row.father.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-[#800000]">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {row.mother &&
                          row.mother.id &&
                          row.mother.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`/${row.mother.id}`)}
                            >
                              {row.mother.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-[#800000]">-</span>
                          )}
                        </td>
                        <td className="flex items-center space-x-2 text-[#800000] text-base justify-center">
                          {row.gender && row.gender.toLowerCase() === "male" ? (
                            <>
                              <FaMale className="text-blue-500 text-lg" />
                              <span className="font-medium">पुरुष</span>
                            </>
                          ) : row.gender &&
                            row.gender.toLowerCase() === "female" ? (
                            <>
                              <FaFemale className="text-pink-500 text-lg" />
                              <span className="font-medium">महिला</span>
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {row.lifestatus &&
                          row.lifestatus.toLowerCase() === "dead" ? (
                            <span
                              className="text-white text-xs font-bold px-2 py-1 rounded"
                              style={{ backgroundColor: "#800000" }}
                            >
                              मृत्यु
                            </span>
                          ) : (
                            <span className="text-[#800000]">
                              {calculateAge(row.date_of_birth, row.lifestatus)}
                            </span>
                          )}
                        </td>
                        <td className="text-center space-x-2">
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Info"
                            className="hover:text-blue-500 transition duration-150"
                            onClick={() => handleInfoClick(row)}
                          >
                            <Info size={18} />
                          </button>
                          {isAdminLocal ? (
                            <>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Edit"
                                className="hover:text-green-500 transition duration-150"
                                onClick={() => handleEditClick(row)}
                              >
                                <NotebookPen size={18} />
                              </button>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Delete"
                                className="hover:text-red-500 transition duration-150"
                                onClick={() => handleDelete(row)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Suggest Edit"
                              className="hover:text-yellow-500 transition duration-150"
                              onClick={() => handleSuggestionClick(row)}
                            >
                              <Lightbulb size={18} />
                            </button>
                          )}
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Card"
                            className="hover:text-indigo-500 transition duration-150"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <IdCard size={18} />
                          </button>
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Compare"
                            className="hover:text-indigo-500 transition duration-150"
                            onClick={() => handleCompare(row)}
                          >
                            <ArrowLeftRight size={18} />
                          </button>

                          {/* Family Tree */}
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Family Tree"
                            className="hover:text-green-500 transition duration-150"
                            onClick={() => handleFamilyTree(row)}
                          >
                            <FaSitemap size={18} />
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
                  <thead className="text-center border-b-2 border-gray-500 bg-gray-100">
                    <tr>
                      <th className="text-center text-[#800000]">नाम</th>
                      <th className="text-center text-[#800000]">
                        पुस्ता नम्बर
                      </th>
                      <th className="text-center text-[#800000]">बाबुको नाम</th>
                      <th className="text-center text-[#800000]">आमाको नाम</th>
                      <th className="text-center text-[#800000]">लिङ्ग</th>
                      <th className="text-center text-[#800000]">उमेर</th>
                      <th className="text-center text-[#800000]">कार्यहरू</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b-2 border-gray-300 hover:bg-gray-200 ${
                          row.gender && row.gender.toLowerCase() === "male"
                            ? "bg-blue-100"
                            : row.gender &&
                              row.gender.toLowerCase() === "female"
                            ? "bg-pink-100"
                            : "bg-gray-50"
                        }`}
                      >
                        <td className="text-center text-[#800000]">
                          <img
                            src={
                              row.photo ||
                              (row.gender && row.gender.toLowerCase() === "male"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                                : row.gender &&
                                  row.gender.toLowerCase() === "female"
                                ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
                                : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/defaulticon.png")
                            }
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {row.name_in_nepali || "-"}
                        </td>
                        <td className="text-center items-center justify-center">
                          <div
                            className={`flex items-center justify-center w-2/4 m-auto h-6 p-2 rounded-full ${
                              row.pusta_number && row.pusta_number % 2 === 0
                                ? "bg-[#0A6C74] text-white"
                                : "bg-[#F49D37] text-white"
                            }`}
                          >
                            {convertToNepaliNumerals(row.pusta_number, false)}
                          </div>
                        </td>
                        <td className="text-center">
                          {row.father &&
                          row.father.id &&
                          row.father.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`/${row.father.id}`)}
                            >
                              {row.father.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-[#800000]">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {row.mother &&
                          row.mother.id &&
                          row.mother.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-blue-600"
                              onClick={() => navigate(`/${row.mother.id}`)}
                            >
                              {row.mother.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-[#800000]">-</span>
                          )}
                        </td>
                        <td className="flex items-center space-x-2 text-[#800000] text-base justify-center">
                          {row.gender && row.gender.toLowerCase() === "male" ? (
                            <>
                              <FaMale className="text-blue-500 text-lg" />
                              <span className="font-medium">पुरुष</span>
                            </>
                          ) : row.gender &&
                            row.gender.toLowerCase() === "female" ? (
                            <>
                              <FaFemale className="text-pink-500 text-lg" />
                              <span className="font-medium">महिला</span>
                            </>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {row.lifestatus &&
                          row.lifestatus.toLowerCase() === "dead" ? (
                            <span
                              className="text-white text-xs font-bold px-2 py-1 rounded"
                              style={{ backgroundColor: "#800000" }}
                            >
                              मृत्यु
                            </span>
                          ) : (
                            <span className="text-[#800000]">
                              {calculateAge(row.date_of_birth, row.lifestatus)}
                            </span>
                          )}
                        </td>
                        <td className="text-center space-x-2">
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Info"
                            className="hover:text-blue-500 transition duration-150"
                            onClick={() => handleInfoClick(row)}
                          >
                            <Info size={18} />
                          </button>
                          {isAdminLocal ? (
                            <>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Edit"
                                className="hover:text-green-500 transition duration-150"
                                onClick={() => handleEditClick(row)}
                              >
                                <NotebookPen size={18} />
                              </button>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Delete"
                                className="hover:text-red-500 transition duration-150"
                                onClick={() => handleDelete(row)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Suggest Edit"
                              onClick={() => handleSuggestionClick(row)}
                            >
                              <Lightbulb size={18} color="#000" />
                            </button>
                          )}
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Card"
                            className="hover:text-indigo-500 transition duration-150"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <IdCard size={18} />
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
            id: selectedRow?.id || "",
            profileImage: selectedRow?.photo || "",
            name: selectedRow?.name || "",
            name_in_nepali: selectedRow?.name_in_nepali || "",
            pusta_number: selectedRow?.pusta_number || "",
            father_name: selectedRow?.father?.name || "",
            mother_name: selectedRow?.mother?.name || "",
            father_id: selectedRow?.father?.id || "",
            mother_id: selectedRow?.mother?.id || "",
            dob: selectedRow?.date_of_birth || "",
            lifestatus: selectedRow?.lifestatus || "Alive",
            death_date: selectedRow?.date_of_death || "",
            profession: selectedRow?.profession || "",
            gender: selectedRow?.gender || "",
            contact: {
              email: selectedRow?.contact_details?.email || "",
              phone: selectedRow?.contact_details?.phone || "",
              address: selectedRow?.contact_details?.address || "",
            },
            vansha_status: selectedRow?.same_vamsha_status ? "True" : "False",
          }}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

      {showFamilyTree && familyTreePerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90vw] h-[90vh] overflow-auto relative">
            <FamilyTreeGraph
              id={String(familyTreePerson.id)}
              selectedPerson={
                familyTreePerson.name_in_nepali || familyTreePerson.name
              }
              isMobile={isMobile}
              closePopup={() => setShowFamilyTree(false)}
            />
          </div>
        </div>
      )}

      {showInfoPopup && (
        <UserProfileModal
          user={{ ...selectedRow, contact: selectedRow?.contact_details }}
          onClose={() => setShowInfoPopup(false)}
        />
      )}
      <ReactTooltip id="tooltip" place="top" effect="solid" />
    </div>
  );
};

export default TableView;
