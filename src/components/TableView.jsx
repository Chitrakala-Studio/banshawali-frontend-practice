import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import {
  FaArrowLeft,
  FaSearch,
  FaMale,
  FaFemale,
  FaSitemap,
  FaHome,
  FaUserPlus,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import {
  NotebookPen,
  Trash2,
  Info,
  IdCard,
  Lightbulb,
  ArrowLeftRight,
  X as XIcon,
  Baby,
  Eye,
  Plus,
  Download,
} from "lucide-react";
import EditFormModal from "./EditFormModal";
import AddRelationModal from "./AddRelationModal";
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
import ContactRequest from "./ContactRequests";
import ClipLoader from "react-spinners/ClipLoader";
import FamilyTreeGraph from "./FamilyTreeGraph";
import TableHeader from "./TableHeader"; // Import the new component
import male1 from "./male1.png";
import female1 from "./female1.png";

const TableView = () => {
  const { id } = useParams();
  const [searchApplied, setSearchApplied] = useState(false);
  const [isAdminLocal, setIsAdminLocal] = useState(false);
  const [isSuperAdminLocal, setIsSuperAdminLocal] = useState(false);
  const [isTableView, setIsTableView] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("data");
  const [familyTreePerson, setFamilyTreePerson] = useState(null);
  const [showFamilyTree, setShowFamilyTree] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
   const [isrequestContact, setIsRequestContact] = useState([]);
  const [showAddRelationModal, setShowAddRelationModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [childFormData, setChildFormData] = useState(null);
  const isModalOpen =
    isAdding || isEditing || isAddingChild || showSearchForm || showInfoPopup;
  const [lastSearchCriteria, setLastSearchCriteria] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

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

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("Running consolidated useEffect for initial setup");

    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setIsAdminLocal(user && user.token && (user.role === "admin" || user.role === "superadmin"));
      setIsSuperAdminLocal(user && user.token && user.role === "superadmin");
    } else {
      setIsAdminLocal(false);
      setIsSuperAdminLocal(false);
    }

    if (location.pathname === "/suggestions") {
      console.log("Path is /suggestions, setting activeTab to suggestions");
      setActiveTab("suggestions");
      fetchSuggestions();
    } else if (location.pathname === "/request-contact") {
      console.log("Path is /request-contact, setting activeTab to request-contact");
      setActiveTab("request-contact");
      fetchContactRequests();
    } else if (location.pathname === "/add-new-user") {
      setActiveTab("data");
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
    } else {
      console.log("Path is not /suggestions, setting activeTab to data");
      setActiveTab("data");
      fetchData(1);
    }
  }, [location.pathname, id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async (page = 1) => {
    setLoading(true);
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
          setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_URL}/people/suggestions/`);
      console.log("Fetched suggestions:", response.data);
      const suggestionArray = response.data.data;
      setSuggestions(suggestionArray);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_URL}/people/contact-requests/`);
      console.log("Fetched contact requests:", response.data);
      const requestArray = response.data.data;
      setIsRequestContact(requestArray);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      setIsRequestContact([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = (e, id, suggestion, image) => {
    e.stopPropagation();
    updateSuggestionStatus(id, "Approved", suggestion, image);
  };

  const handleReject = (e, id, suggestion, image) => {
    e.stopPropagation();
    updateSuggestionStatus(id, "Rejected", suggestion, image);
  };

  const handleAddChildClick = async (row) => {
    console.log("Adding child for row:", row);
    // Only include direct spouses (not all relatives)
    const spouses = Array.isArray(row.spouse) ? row.spouse : [];
    // Filter out any spouse objects that are not direct spouses (should not include parents, grandparents, etc.)
    // Assuming each spouse object has at least an id and name
    
    
    const spouseOptions = spouses.map((sp) => ({
      id: sp.id,
      name: sp.name_in_nepali || sp.name,
    }));


    let fatherData = { id: null, name: "" };
    let motherData = { id: null, name: "" };

    if (row.gender && row.gender.toLowerCase() === "male") {
      fatherData = { id: row.id, name: row.name_in_nepali || row.name };
      // For a male, let user select mother from spouseOptions (only direct spouses)
    } else if (row.gender && row.gender.toLowerCase() === "female") {
      motherData = { id: row.id, name: row.name_in_nepali || row.name };
      // For a female, let user select father from spouseOptions (only direct spouses)
    }

    setChildFormData({
      pusta_number: row.pusta_number ? (parseInt(row.pusta_number, 10) + 1).toString() : "",
      father_id: fatherData.id,
      father_name: fatherData.name,
      mother_id: motherData.id,
      mother_name: motherData.name,
      spouseOptions: spouseOptions, // Only direct spouses
    });

    setIsAddingChild(true);
  };

  const handleFamilyTree = (row) => {
    setFamilyTreePerson(row);
    setShowFamilyTree(true);
  };

  const handleSuggestionClick = (row) => {
    console.log("Suggestion Clicked:", row);
    Swal.fire({
      title: `Submit Suggestion for ${row.name_in_nepali || "Unknown"}`,
      html: `
          <div class="swal-suggestion-by-section">
            <label class="swal-label">Name <span style="color:red">*</span></label>
            <input id="suggestion-by-name" class="swal-input" placeholder="Your Name" required>
            <label class="swal-label">Email</label>
            <input id="suggestion-by-email" class="swal-input" placeholder="Your Email">
            <label class="swal-label">Phone <span style="color:red">*</span></label>
            <input id="suggestion-by-phone" class="swal-input" placeholder="Your Phone" required>
          </div>
          <textarea id="suggestion" placeholder="Enter your suggestion" class="swal-textarea"></textarea>
          <div id="dropzone-container" class="swal-dropzone">
            <div id="file-picker" class="swal-file-picker">
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
      confirmButtonColor: "#2E4568",
      cancelButtonColor: "#E9D4B0",
      didOpen: () => {
        const dropzoneContainer = document.getElementById("dropzone-container");
        const fileInput = document.getElementById("file-input");
        const filePicker = document.getElementById("file-picker");
        const titleElement = document.querySelector(".swal2-title");
        const popupElement = document.querySelector(".swal2-popup");
        const confirmButton = document.querySelector(".swal2-confirm");
        const cancelButton = document.querySelector(".swal2-cancel");

        if (titleElement) {
          titleElement.classList.add("swal-title");
        }

        if (popupElement) {
          popupElement.classList.add("swal-popup");
        }

        if (confirmButton) {
          confirmButton.classList.add("swal-confirm-btn");
          confirmButton.addEventListener("mouseover", () => {
            confirmButton.style.backgroundColor = "#4A6A9D";
            confirmButton.style.transform = "scale(1.05)";
          });
          confirmButton.addEventListener("mouseout", () => {
            confirmButton.style.backgroundColor = "#2E4568";
            confirmButton.style.transform = "scale(1)";
          });
        }

        if (cancelButton) {
          cancelButton.classList.add("swal-cancel-btn");
          cancelButton.addEventListener("mouseover", () => {
            cancelButton.style.backgroundColor = "#D9C4A0";
            cancelButton.style.transform = "scale(1.05)";
          });
          cancelButton.addEventListener("mouseout", () => {
            cancelButton.style.backgroundColor = "#E9D4B0";
            confirmButton.style.transform = "scale(1)";
          });
        }

        filePicker.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (event) => {
          if (event.target.files.length > 0) {
            const file = event.target.files[0];
            dropzoneContainer.innerHTML = `<p class="swal-file-name">${file.name}</p>`;
            dropzoneContainer.file = file;
          }
        });
        dropzoneContainer.addEventListener("dragover", (event) => {
          event.preventDefault();
          dropzoneContainer.style.borderColor = "#2E4568";
        });
        dropzoneContainer.addEventListener("dragleave", () => {
          dropzoneContainer.style.borderColor = "#E9D4B0";
        });
        dropzoneContainer.addEventListener("drop", (event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) {
            dropzoneContainer.innerHTML = `<p class="swal-file-name">${file.name}</p>`;
            dropzoneContainer.file = file;
          }
        });
      },
      preConfirm: async () => {
        const name = document.getElementById("suggestion-by-name").value.trim();
        const email = document
          .getElementById("suggestion-by-email")
          .value.trim();
        const phone = document
          .getElementById("suggestion-by-phone")
          .value.trim();
        const suggestion = document.getElementById("suggestion").value;
        const dropzoneContainer = document.getElementById("dropzone-container");
        const file = dropzoneContainer.file;

        if (!name || !phone) {
          Swal.showValidationMessage("Name and Phone are required.");
          return false;
        }

        let s3Url = "";
        if (file) {
          // S3 upload logic using presigned URL
          try {
            // 1. Request a presigned URL from the backend
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await axiosInstance.post(`${API_URL}/people/people/upload-to-s3/`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });

            s3Url = uploadRes.data.url || uploadRes.data.Location || uploadRes.data.path || '';
          } catch (error) {
            Swal.showValidationMessage(`S3 upload failed: ${error}`);
          }
        }
        const payload = {
          suggestion: suggestion,
          suggestion_to: row.id,
          suggestion_by_name: name,
          suggestion_by_email: email,
          suggestion_by_phone: phone,
          ...(s3Url && { image: s3Url }),
        };

        try {
          await axiosInstance.post(`${API_URL}/people/suggestions/`, payload, {
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
          confirmButtonColor: "#2E4568",
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
      setLastSearchCriteria(null);
      setCurrentPage(1);
      return;
    }
    setLoading(true); // Set loading immediately after modal closes
    setSearchApplied(true);
    setShowSearchForm(false);
    setLastSearchCriteria(criteria);
    setCurrentPage(1);
    fetchSearchResults(criteria, 1, true);
  };

  const fetchSearchResults = async (criteria, page = 1, replace = false) => {
    setLoading(true);
    try {
      const paramsObj = {};
      Object.entries(criteria).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          typeof value !== "object"
        ) {
          paramsObj[key] = value;
        }
      });
      paramsObj.page = page;
      const params = new URLSearchParams(paramsObj).toString();
      const response = await fetch(
        `${API_URL}/people/people/search/?${params}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Search failed");
      const result = await response.json();
      const results = Array.isArray(result.data) ? result.data : [];
      setFilteredData((prev) => (replace ? results : [...prev, ...results]));
      setHasMore(result.next !== null);
    } catch (error) {
      setFilteredData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
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
    // Map father/mother info from row to expected formData fields
    setSelectedRow({
      ...row,
      father_id: row.father_id || row.father?.id || null,
      father_name: row.father_name || row.father?.name_in_nepali || row.father?.name || "",
      mother_id: row.mother_id || row.mother?.id || null,
      mother_name: row.mother_name || row.mother?.name_in_nepali || row.mother?.name || "",
    });
    setIsEditing(true);
  };

  const updateSuggestionStatus = async (id, newStatus, suggestion, image) => {
    try {
      const payload = { status: newStatus, suggestion, image, id };
      await axiosInstance.put(`${API_URL}/people/suggestions/${id}/`, payload, {
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

  const updateContactRequestStatus = async (id, newStatus, contactRequest) => {
    try {
      const payload = { status: newStatus, contactRequest, id };
      await axiosInstance.put(`${API_URL}/people/contact-requests/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setIsRequestContact((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? { ...request, status: newStatus }
            : request
        )
      );
      Swal.fire({
        title: `${newStatus}!`,
        text: `Contact request status updated to ${newStatus}.`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating contact request status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update contact request status.",
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
    setScrollPosition(window.scrollY);
    setShowInfoPopup(true);
  };

  const handleCompare = (row) => {
    navigate(`/compare/${row.id}`);
  };

  const handleSave = async (updatedRow) => {
    fetchData(1);
    setIsEditing(false);
  };

  const handleSaveNew = async (newData) => {
    try {
      await axiosInstance.post(`${API_URL}/people/`, newData);
      fetchData(1);
      setIsAdding(false);
      setIsAddingChild(false);
    } catch (error) {
      console.error("Error adding data:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to add data.",
        icon: "error",
      });
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
      confirmButtonColor: "#E9D4B0",
      cancelButtonColor: "#AAABAC",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`${API_URL}/people/${row.id}/`);
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

  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpandRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const finalData = filteredData;
  const visibleData = finalData;

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (searchApplied && lastSearchCriteria) {
      fetchSearchResults(lastSearchCriteria, nextPage, false);
    } else {
      fetchData(nextPage);
    }
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
      <style>
        {`
          :root {
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --secondary-light: #E9D4B0;
            --secondary-lighter: #D9C4A0;
            --accent-male: #4A6A9D;
            --accent-female: #D4A5A5;
            --accent-other: #B9BAC3;
            --neutral-gray: #B9BAC3;
            --neutral-light-gray: #E0E0E0;
            --background-start: #F8E5C0;
            --background-end: #CDE8D0;
            --row-bg: #F7F7F7;
            --row-alt-bg: #FFFFFF;
            --white: #FFFFFF;
            --popup-start: #A6C8A5;
            --popup-end: #B9BAC3;
            --dead-bg: #EF4444;
            --dead-text: #FFFFFF;
          }

          .table-view {
            background: radial-gradient(circle at top, var(--background-start) 30%, var(--background-end) 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .table-wrapper table {
            width: 100%;
            border-collapse: collapse;
            background: var(--white);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }

          .table-wrapper thead {
            background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            color: var(--primary-dark);
            text-align: center;
            font-family: 'Playfair Display', serif;
          }

          .table-wrapper th, .table-wrapper td {
            padding: 12px 16px;
            text-align: center;
            vertical-align: middle;
            font-family: 'Merriweather', serif;
          }

          .table-wrapper tbody tr:nth-child(even) {
            background-color: var(--row-bg);
          }

          .table-wrapper tbody tr:nth-child(odd) {
            background-color: var(--row-alt-bg);
          }

          .table-wrapper tbody tr:hover {
            background-color: var(--neutral-light-gray);
            transition: background-color 0.3s ease;
          }

          .name-cell.male {
            border-left: 8px solid var(--accent-male);
          }
          .name-cell.female {
            border-left: 8px solid var(--accent-female);
          }
          .name-cell.other {
            border-left: 8px solid var(--accent-other);
          }

          .name-cell {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-left: 16px;
          }

          .text-primary {
            color: var(--primary-dark);
          }

          .text-secondary {
            color: var(--neutral-gray);
          }

          .bg-pusta-even {
            background-color: var(--primary-dark);
            color: var(--white);
          }

          .bg-pusta-odd {
            background-color: var(--secondary-light);
            color: var(--primary-dark);
          }

          .bg-status-dead {
            background-color: var(--dead-bg);
            color: var(--dead-text);
          }

          .action-btn {
            color: var(--primary-dark);
          }

          .action-btn:hover {
            color: var(--primary-hover);
            transition: color 0.15s ease;
          }

          .top-bar-btn {
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: var(--secondary-light);
            background-color: var(--primary-dark);
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .top-bar-btn:hover {
            background-color: var(--primary-hover);
            color: var(--white);
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .flex-center {
            padding-left: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .pusta-number {
            width: 40px;
            height: 24px;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }

          .no-data {
            text-align: center;
            padding: 16px;
            color: var(--neutral-gray);
            font-family: 'Merriweather', serif;
          }

          .loading-row {
            height: 60px;
          }

          .react-tooltip {
            background-color: var(--primary-dark) !important;
            color: var(--white) !important;
            border: 1px solid var(--secondary-light) !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            font-family: 'Merriweather', serif !important;
            font-size: 12px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }

          .react-tooltip-arrow {
            border-color: var(--secondary-light) !important;
          }
          
          .swal-suggestion-by-section {
            margin-bottom: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .swal-label {
            text-align: left;
            font-family: 'Merriweather', serif;
            font-size: 15px;
            color: var(--primary-dark);
            margin-bottom: 2px;
          }
          .swal-input {
            padding: 8px 10px;
            border-radius: 10px;
            background-color: var(--popup-start);
            color: var(--primary-dark);
            border: 1.5px solid var(--secondary-light);
            font-size: 16px;
            font-family: 'Merriweather', serif;
            margin-bottom: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .swal-textarea {
            height: 150px;
            width: 100%;
            max-width: 410px;
            background-color: var(--popup-start);
            border: 2px solid var(--secondary-light);
            border-radius: 10px;
            padding: 10px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-dark);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            resize: none;
          }

          .swal-dropzone {
            border: 2px dashed var(--secondary-light);
            padding: 15px;
            text-align: center;
            cursor: pointer;
            background-color: var(--popup-start);
            margin-top: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .swal-file-picker {
            height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--primary-dark);
            font-family: 'Merriweather', serif;
            font-size: 16px;
          }

          .swal-file-name {
            color: var(--primary-dark);
            font-family: 'Merriweather', serif;
          }

          .swal-title {
            font-size: 24px;
            color: var(--primary-dark);
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid var(--secondary-light);
            padding-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .swal-popup {
            background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            border-radius: 15px;
            padding: 25px;
            border: 2px solid var(--secondary-light);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .swal-confirm-btn, .swal-cancel-btn {
            border-radius: 8px;
            padding: 10px 20px;
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            transition: background-color 0.2s, transform 0.2s;
          }

          .swal-confirm-btn {
            background-color: var(--primary-dark);
            color: var(--secondary-light);
          }

          .swal-cancel-btn {
            background-color: var(--secondary-light);
            color: var(--primary-dark);
          }

          .mobile-list-view {
            margin-top: 12px;
          }
          .mobile-list-item {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 2px 8px rgba(44, 62, 80, 0.10);
            margin-bottom: 18px;
            padding: 0;
            overflow: hidden;
            transition: box-shadow 0.2s;
            position: relative;
          }
          .mobile-list-header {
            display: flex;
            align-items: flex-start;
            padding: 16px 16px 0 16px;
          }
          .mobile-list-avatar-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 16px;
          }
          .mobile-list-avatar {
            width: 54px;
            height: 54px;
            border-radius: 50%;
            object-fit: cover;
            background: #f2f2f2;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 4px;
          }
          .mobile-list-names-block {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 0;
          }
          .mobile-list-name-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 2px;
          }
          .mobile-list-name {
            font-weight: 600;
            font-size: 1.08rem;
            color: #222;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .mobile-list-pusta {
            font-size: 0.98rem;
            color: #6b6b6b;
            font-weight: 400;
            margin-left: 10px;
            white-space: nowrap;
          }
          .mobile-list-father-row {
            font-size: 0.98rem;
            color: #6b6b6b;
            font-weight: 400;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .mobile-list-expand-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #2E4568;
            margin-left: 8px;
            cursor: pointer;
            outline: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s;
          }
          .mobile-list-expand-btn:active {
            background: #e9e9e9;
          }
          .mobile-list-divider {
            border: none;
            border-top: 1px solid #ececec;
            margin: 0;
          }
          .mobile-list-details {
            background: #fff;
            font-size: 1.01rem;
            padding: 0;
          }
          .mobile-list-details-row {
            padding: 12px 16px 12px 16px;
            font-weight: 500;
            color: #222;
            display: flex;
            align-items: center;
          }
          .mobile-list-details-row span {
            font-weight: 400;
            color: #444;
            margin-left: 4px;
          }
          .mobile-list-actions {
            display: flex;
            justify-content: flex-start;
            gap: 16px;
            margin: 0;
            padding: 12px 16px 12px 16px;
            flex-wrap: wrap;
          }
          .mobile-list-action-btn {
            background: none;
            border: none;
            color: #2E4568;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 6px;
            transition: background 0.15s;
          }
          .mobile-list-action-btn:active {
            background: #e9e9e9;
          }

          @media only screen and (max-width: 640px) {
  .top-bar-btn {
    /* much tighter padding */
    padding: 4px 8px !important;
    /* smaller text */
    font-size: 12px !important;
  }
  /* if you want icon-only buttons on the smallest screens: */
  .top-bar-btn span {
    display: none !important;
  }
  .top-bar-btn svg {
    /* center the icon perfectly */
    margin: 0 !important;
  }
}

          /* ensure the table always shows and scrolls on mobile */
.table-wrapper {
  overflow-x: auto;             /* allow horizontal scrolling */
  -webkit-overflow-scrolling: touch;
}

/* make your table take the full width, but allow a minimum width so columns don’t collapse */
.table-wrapper table {
  width: 100%;
  min-width: 600px;             /* adjust to your number of columns */
}

/* remove any existing “display: none” on small screens */
@media (max-width: 799px) {
  .table-wrapper {
    display: block !important;
  }
}
        `}
      </style>

      <div className={isModalOpen ? "blurred" : ""}>
        <TableHeader
          activeTab={activeTab}
          id={id}
          searchApplied={searchApplied}
          isAdmin={isAdminLocal}
          isSuperAdmin={isSuperAdminLocal}
          isTableView={isTableView}
          toggleView={() => setIsTableView(!isTableView)}
          availableId={visibleData.length > 0 ? visibleData[0]?.id : null}
          navigate={navigate}
          setShowSearchForm={setShowSearchForm}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          data={data}
          setSearchApplied={setSearchApplied}
          onBackToTable={() => fetchData(1)} // NEW: pass callback for refetch
        />

        {activeTab === "data" &&
          (isMobile ? (
            <div className="mobile-list-container">
              <style>{`
      .mobile-list-container {
        padding: 0 8px;
      }
      .mobile-list-item {
        background: #fff;
        border-radius: 14px;
        box-shadow: 0 2px 8px rgba(44, 62, 80, 0.10);
        margin-bottom: 18px;
        padding: 0;
        overflow: hidden;
        transition: box-shadow 0.2s;
        position: relative;
      }
      .mobile-list-header {
        display: flex;
        align-items: flex-start;
        padding: 16px 16px 0 16px;
      }
      .mobile-list-avatar-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;
      }
      .mobile-list-avatar {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        object-fit: cover;
        background: #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        margin-bottom: 4px;
      }
      .mobile-list-names-block {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
      }
      .mobile-list-name-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 2px;
      }
      .mobile-list-name {
        font-weight: 600;
        font-size: 1.08rem;
        color: #222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mobile-list-pusta {
        font-size: 0.98rem;
        color: #6b6b6b;
        font-weight: 400;
        margin-left: 10px;
        white-space: nowrap;
      }
      .mobile-list-father-row {
        font-size: 0.98rem;
        color: #6b6b6b;
        font-weight: 400;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mobile-list-expand-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #2E4568;
        margin-left: 8px;
        cursor: pointer;
        outline: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
      }
      .mobile-list-expand-btn:active {
        background: #e9e9e9;
      }
      .mobile-list-divider {
        border: none;
        border-top: 1px solid #ececec;
        margin: 0;
      }
      .mobile-list-details {
        background: #fff;
        font-size: 1.01rem;
        padding: 0;
      }
      .mobile-list-details-row {
        padding: 12px 16px 12px 16px;
        font-weight: 500;
        color: #222;
        display: flex;
        align-items: center;
      }
      .mobile-list-details-row span {
        font-weight: 400;
        color: #444;
        margin-left: 4px;
      }
      .mobile-list-actions {
        display: flex;
        justify-content: flex-start;
        gap: 16px;
        margin: 0;
        padding: 12px 16px 12px 16px;
        flex-wrap: wrap;
      }
      .mobile-list-action-btn {
        background: none;
        border: none;
        color: #2E4568;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 6px;
        transition: background 0.15s;
      }
      .mobile-list-action-btn:active {
        background: #e9e9e9;
      }
    `}</style>
              {visibleData.map((row, idx) => (
                <div className="mobile-list-item" key={row.id}>
                  <div className="mobile-list-header">
                    <div className="mobile-list-avatar-block">
                      <div className="mobile-list-avatar">
                        <img
                          src={
                            row.photo && typeof row.photo === "string" && row.photo.startsWith("http")
                              ? row.photo
                              : row.gender?.toLowerCase() === "male"
                              ? male1
                              : row.gender?.toLowerCase() === "female"
                              ? female1
                              : male1
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mobile-list-names-block">
                      <div className="mobile-list-name-row">
                        <div className="mobile-list-name">
                          {row.name_in_nepali || row.name}
                        </div>
                        <div style={{ flex: 1 }} />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <div
                            className="mobile-list-pusta"
                            style={{
                              fontWeight: 500,
                              color: "#2E4568",
                              fontSize: "1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 400,
                                color: "#444",
                                marginRight: 1,
                              }}
                            >
                              पु. न:
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "#2E4568",
                                fontSize: "1.1rem",
                                marginRight: 2,
                              }}
                            >
                              {convertToNepaliNumerals(
                                row.pusta_number,
                                true
                              ) || "-"}
                            </span>
                          </div>
                          <button
                            className="mobile-list-expand-btn"
                            aria-label={
                              expandedRows[idx] ? "Collapse" : "Expand"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandRow(idx);
                            }}
                          >
                            {expandedRows[idx] ? (
                              <span>−</span>
                            ) : (
                              <span>+</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {expandedRows[idx] && (
                    <>
                      <hr className="mobile-list-divider" />
                      <div className="mobile-list-details">
                        <div className="mobile-list-details-row">
                          <b>बाबुको नाम: </b>
                          {row.father?.id &&
                          (row.father.name_in_nepali || row.father.name) ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.father.id}`)}
                            >
                              {row.father.name_in_nepali || row.father.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </div>
                      </div>

                      <hr className="mobile-list-divider" />
                      <div className="mobile-list-details">
                        <div className="mobile-list-details-row">
                          <b>आमाको नाम:</b>{" "}
                          {row.mother?.id &&
                          (row.mother.name_in_nepali || row.mother.name) ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.mother.id}`)}
                            >
                              {row.mother.name_in_nepali || row.mother.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </div>
                        <hr className="mobile-list-divider" />
                        <div className="mobile-list-details-row">
                          <b>हजुरबुबाको नाम:</b>{" "}
                          {row.grandfather?.id &&
                          (row.grandfather.name_in_nepali ||
                            row.grandfather.name) ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.grandfather.id}`)}
                            >
                              {row.grandfather.name_in_nepali ||
                                row.grandfather.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </div>
                        <hr className="mobile-list-divider" />
                        <div className="mobile-list-details-row">
                          <b>बाजेको नाम:</b>{" "}
                          {row.great_grandfather?.id &&
                          (row.great_grandfather.name_in_nepali ||
                            row.great_grandfather.name) ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                navigate(`/${row.great_grandfather.id}`)
                              }
                            >
                              {row.great_grandfather.name_in_nepali ||
                                row.great_grandfather.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </div>
                      </div>
                      <hr className="mobile-list-divider" />
                      <div
                        className="mobile-list-actions"
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          marginTop: 0,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Info"
                            className="action-btn"
                            onClick={() => handleInfoClick(row)}
                          >
                            <Info size={20} />
                          </button>
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Compare"
                            className="action-btn"
                            onClick={() => handleCompare(row)}
                          >
                            <ArrowLeftRight size={20} />
                          </button>
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Family Tree"
                            className="action-btn"
                            onClick={() => handleFamilyTree(row)}
                          >
                            <FaSitemap size={20} />
                          </button>
                          {isAdminLocal ? (
                            <>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Edit"
                                className="action-btn"
                                onClick={() => handleEditClick(row)}
                              >
                                <NotebookPen size={20} />
                              </button>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Delete"
                                className="action-btn"
                                onClick={() => handleDelete(row)}
                              >
                                <Trash2 size={20} />
                              </button>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Add Child"
                                className="action-btn"
                                onClick={() => handleAddChildClick(row)}
                              >
                                <Baby size={20} />
                              </button>
                            </>
                          ) : (
                            <button
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Suggest Edit"
                              className="action-btn"
                              onClick={() => handleSuggestionClick(row)}
                            >
                              <Lightbulb size={20} />
                            </button>
                          )}
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Card"
                            className="action-btn"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <IdCard size={20} />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="table-wrapper overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>नाम</th>
                    <th>पुस्ता नम्बर</th>
                    <th>बाबुको नाम</th>
                    <th>आमाको नाम</th>
                    <th>हजुरबुबाको नाम</th>
                    <th>बाजेको नाम </th>
                    <th>कार्यहरू</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && filteredData.length === 0 ? (
                    <tr className="loading-row">
                      <td colSpan={7}>
                        <div className="flex-center" style={{ minHeight: 60 }}>
                          <ClipLoader
                            color="var(--neutral-gray)"
                            loading={true}
                            size={35}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="no-data">
                        {id
                          ? `No data found for ID ${id}. The record may not exist or has been deleted.`
                          : "No data available. Try adding a new user or searching for existing ones."}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr key={index}>
                        <td
                          className={`name-cell text-primary ${
                            row.gender?.toLowerCase() === "male"
                              ? "male"
                              : row.gender?.toLowerCase() === "female"
                              ? "female"
                              : "other"
                          }`}
                        >
                          <img
                            src={
                              row.photo && typeof row.photo === "string" && row.photo.startsWith("http")
                                ? row.photo
                                : row.gender?.toLowerCase() === "male"
                                ? male1
                                : row.gender?.toLowerCase() === "female"
                                ? female1
                                : male1
                            }
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span>{row.name_in_nepali || "-"}</span>
                        </td>
                        <td className="text-center">
                          <div
                            className={`pusta-number ${
                              row.pusta_number && row.pusta_number % 2 === 0
                                ? "bg-pusta-even"
                                : "bg-pusta-odd"
                            }`}
                          >
                            {convertToNepaliNumerals(row.pusta_number, true)}
                          </div>
                        </td>
                        <td>
                          {row.father?.id && row.father.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.father.id}`)}
                            >
                              {row.father.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                        <td>
                          {row.mother?.id &&
                          (row.mother.name_in_nepali || row.mother.name) ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.mother.id}`)}
                            >
                              {row.mother.name_in_nepali || row.mother.name}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                        <td>
                          {row.grandfather?.id &&
                          row.grandfather.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() => navigate(`/${row.grandfather.id}`)}
                            >
                              {row.grandfather.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                        <td>
                          {row.great_grandfather?.id &&
                          row.great_grandfather.name_in_nepali ? (
                            <span
                              className="cursor-pointer text-primary"
                              onClick={() =>
                                navigate(`/${row.great_grandfather.id}`)
                              }
                            >
                              {row.great_grandfather.name_in_nepali}
                            </span>
                          ) : (
                            <span className="text-secondary">-</span>
                          )}
                        </td>
                        <td className="flex-center space-x-2">
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Info"
                            className="action-btn"
                            onClick={() => handleInfoClick(row)}
                          >
                            <Info size={18} />
                          </button>
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Compare"
                            className="action-btn"
                            onClick={() => handleCompare(row)}
                          >
                            <ArrowLeftRight size={18} />
                          </button>
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="Family Tree"
                            className="action-btn"
                            onClick={() => handleFamilyTree(row)}
                          >
                            <FaSitemap size={18} />
                          </button>
                          {isAdminLocal ? (
                            <>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Edit"
                                className="action-btn"
                                onClick={() => handleEditClick(row)}
                              >
                                <NotebookPen size={18} />
                              </button>
                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Delete"
                                className="action-btn"
                                onClick={() => handleDelete(row)}
                              >
                                <Trash2 size={18} />
                              </button>

                              <button
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Add Child"
                                className="action-btn"
                                onClick={() => handleAddChildClick(row)}
                              >
                                <Baby size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              data-tooltip-id="tooltip"
                              data-tooltip-content="Suggest Edit"
                              className="action-btn"
                              onClick={() => handleSuggestionClick(row)}
                            >
                              <Lightbulb size={18} />
                            </button>
                          )}
                          <button
                            data-tooltip-id="tooltip"
                            data-tooltip-content="View Card"
                            className="action-btn"
                            onClick={() => navigate(`/card/${row.id}`)}
                          >
                            <IdCard size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}

        {!id ? (
          <InfiniteScroll
            dataLength={visibleData.length}
            next={handleLoadMore}
            hasMore={hasMore && visibleData.length >= 15}
            loader={
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <ClipLoader color="var(--neutral-gray)" loading={true} size={32} />
              </div>
            }
            style={{ overflow: "hidden" }}
          >
            {activeTab === "suggestions" && <Suggestion />}
            {activeTab === "request-contact" && <ContactRequest />}
          </InfiniteScroll>
        ) : (
          <>
            {activeTab === "suggestions" && <Suggestion />}
            {activeTab === "request-contact" && <ContactRequest />}
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
          onClose={() => {
            setIsAdding(false);
            navigate("/"); // Navigate back to table view after closing
          }}
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
            father_name: selectedRow?.father?.name_in_nepali || "",
            mother_name: selectedRow?.mother?.name_in_nepali || "",
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
            spouses: Array.isArray(selectedRow?.spouse)
              ? selectedRow.spouse.map((s) => ({
                  id: s.id,
                  name: s.name_in_nepali || s.name,
                }))
              : [{ id: null, name: "" }],
            spouseOptions: data,
          }}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}

      {isAddingChild && childFormData && (
        <EditFormModal
          formData={childFormData}
          onClose={() => {
            setIsAddingChild(false);
            setChildFormData(null);
          }}
          onSave={handleSaveNew}
        />
      )}

      {showFamilyTree && familyTreePerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          
            <FamilyTreeGraph
              id={String(familyTreePerson.id)}
              selectedPerson={
                familyTreePerson.name_in_nepali || familyTreePerson.name
              }
              isMobile={isMobile}
              closePopup={() => setShowFamilyTree(false)}
            />
          </div>
      )}

      {showInfoPopup && (
        <UserProfileModal
          user={{ ...selectedRow, contact: selectedRow?.contact_details }}
          onClose={() => {
            setShowInfoPopup(false);
            setTimeout(() => {
              window.scrollTo({ top: scrollPosition, behavior: 'auto' });
            }, 0);
          }}
        />
      )}
      {showAddRelationModal && selectedPerson && (
        <AddRelationModal
          person={selectedPerson}
          onClose={() => {
            setShowAddRelationModal(false);
            setSelectedPerson(null);
          }}
          onSave={() => fetchData(1)}
          API_URL={API_URL}
        />
      )}
      <ReactTooltip id="tooltip" place="top" effect="solid" />

      {/* Overlay loading spinner and blur for initial load or after search, but not for infinite scroll */}
      {loading && (filteredData.length === 0 || searchApplied) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <svg
              style={{ animation: "spin 1s linear infinite" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              width="60"
              height="60"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="#F49D37"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="#2E4568"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <div
              style={{
                marginTop: 16,
                color: "#2E4568",
                fontFamily: "Merriweather, serif",
                fontSize: 18,
              }}
            >
              Loading...
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;
