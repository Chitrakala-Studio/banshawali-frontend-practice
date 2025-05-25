import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaHome, FaSearch } from "react-icons/fa";
import { IdCard } from "lucide-react";

// Main component for comparing two persons
const Compare = () => {
  const { id } = useParams(); // Get person ID from URL parameters
  const navigate = useNavigate(); // Navigation function for routing
  const API_URL = import.meta.env.VITE_API_URL; // Base API URL from environment variables

  // State management for various data and UI states
  const [familyMembers, setFamilyMembers] = useState([]); // Store family members data
  const [rightNameSuggestions, setRightNameSuggestions] = useState([]); // Store name suggestions for Person 2
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800); // Detect mobile view
  const [rightFatherSuggestions, setRightFatherSuggestions] = useState([]); // Store father suggestions
  const [rightMotherSuggestions, setRightMotherSuggestions] = useState([]); // Store mother suggestions
  const [leftPerson, setLeftPerson] = useState({
    name: "",
    pusta_number: "",
    fatherName: "",
    motherName: "",
  }); // State for Person 1 data
  const [rightPerson, setRightPerson] = useState({
    name_in_nepali: "",
    pusta_number: "",
    fatherName: "",
    fatherId: "",
    motherName: "",
    motherId: "",
    father: { name: "", name_in_nepali: "" },
    mother: { name: "", name_in_nepali: "" },
  }); // State for Person 2 data with default nested objects
  const [isLeftConfirmed, setIsLeftConfirmed] = useState(true); // Track if Person 1 is confirmed
  const [isRightConfirmed, setIsRightConfirmed] = useState(false); // Track if Person 2 is confirmed
  const [relationship, setRelationship] = useState(""); // Store the comparison result
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [apiError, setApiError] = useState(""); // Store any API errors
  const [searchQuery, setSearchQuery] = useState(""); // Current search query for Person 2
  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of the dropdown

  const searchFieldRef = useRef(null); // Ref to handle clicks outside the search field

  // Handle window resize to update mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch name suggestions for Person 2 based on search query with enhanced formatting and data fetch
  const fetchNameSuggestions = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setRightNameSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      let response = await fetch(`${API_URL}/people/name-search/?name=${encodeURIComponent(trimmedQuery)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        response = await fetch(`${API_URL}/people/?page=1&limit=100`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      // Support both 'results' and 'data' keys
      const people = responseData.results || responseData.data || [];

      // Map the response to suggestions in the required format
      const suggestions = people.map(person => ({
        pusta_number: person.pusta_number || "",
        name: person.name || "",
        father: person.father || "",
        grandfather: person.grandfather || "",
        // For selection, keep the whole object
        raw: person
      }));

      // Remove client-side filtering: always show all backend results
      setRightNameSuggestions(suggestions);
      setShowSuggestions(true);
      if (suggestions.length === 0) {
        setApiError("No results found for the search query.");
      } else {
        setApiError("");
      }
    } catch (error) {
      setApiError("Failed to fetch name suggestions. Please try again.");
      Swal.fire({
        title: "Error",
        text: "Failed to fetch name suggestions.",
        icon: "error",
        confirmButtonText: "Okay",
      });
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search when button is clicked
  const handleSearch = () => {
    fetchNameSuggestions(searchQuery);
  };

  // Trigger search when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchNameSuggestions(searchQuery);
    }
  };

  // Handle selection of a suggestion and update Person 2 data
  const handleSelectSuggestion = (sugg) => {
    setRightPerson({
      name_in_nepali: sugg.name,
      pusta_number: sugg.pusta_number,
      fatherName: sugg.father || "",
      motherName: "",
      fatherId: "",
      motherId: "",
      father: { name: sugg.father || "", name_in_nepali: sugg.father || "" },
      mother: { name: "", name_in_nepali: "" },
      grandfather: { name: sugg.grandfather || "", name_in_nepali: sugg.grandfather || "" },
    });
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside the search field
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchFieldRef.current && !searchFieldRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data for Person 1
  useEffect(() => {
    const fetchLeftPersonData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/people/${id}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const response_data = await response.json();
        const fetchedData = response_data.data[0];
        setLeftPerson(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError("Failed to fetch left person's data. Please try again later.");
        Swal.fire({
          title: "Error",
          text: "There was an issue fetching the left person's data.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeftPersonData();
  }, [id]);

  // Handle comparison of the two persons
  const handleCompare = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });

    if (
      !leftPerson.name ||
      !leftPerson.pusta_number ||
      !rightPerson.name_in_nepali ||
      !rightPerson.pusta_number
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Both Name and pusta_number fields are required for comparison.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    try {
      setIsLoading(true);
      const leftPersonId = leftPerson.id;
      const rightPerson_name = rightPerson.name_in_nepali;
      const rightPerson_pusta_number = rightPerson.pusta_number;
      const rightPerson_fatherName = rightPerson.fatherId;
      const rightPerson_motherName = rightPerson.motherId;
      const rightPerson_grandfatherName = rightPerson.grandfatherID;

      const response = await axios.post(`${API_URL}/people/compare/`, {
        leftPersonId,
        rightPerson_name,
        rightPerson_pusta_number,
        rightPerson_fatherName,
        rightPerson_motherName,
        rightPerson_grandfatherName,
      });

      setRelationship(response.data.message);
    } catch (error) {
      console.error("Error comparing persons:", error);
      setApiError("Failed to compare persons. Please try again.");
      Swal.fire({
        title: "Error",
        text: "Failed to compare persons",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareAgain = () => {
    window.location.reload();
  };

  const handleGenerateFamilyTree = async () => {
    Swal.fire({
      title: "Family Tree being Generated!",
      icon: "success",
      confirmButtonText: "Okay",
    }).then(() => {
      setIsLeftConfirmed(false);
      setIsRightConfirmed(false);
    });
  };

  return (
    <div className="compare-container">
      <style>
        {`
        @media (max-width: 799px) {
          .hide-on-mobile {
            display: none !important;
          }
        }

          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --gold-accent: #F49D37;
            --header-maroon: #800000;
            --neutral-gray: #D1D5DB;
            --secondary-bg: #E9D4B0;
            --secondary-bg-hover: #D9C4A0;
            --background-start: #F8E5C0;
            --background-end:   #CDE8D0;
            --secondary-light: #E9D4B0;  
            --white:           #FFFFFF;
          }

          .flex-center {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .compare-container {
            min-height: 100vh;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            background: radial-gradient(
              circle at top,
              var(--background-start) 30%,
              var(--background-end) 100%
            );
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px;
            justify-content: flex-start;
          }

          .top-bar {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            width: 100%;
            margin-bottom: 16px;
          }

          .top-bar-btn {
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background-color: var(--primary-dark);
            color: var(--secondary-light);
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .top-bar-btn:hover {
            background-color: var(--primary-hover);
            color: var(--white);
            transform: scale(1.05);
          }

          .back-btn {
            position: absolute;
            top: 16px;
            left: 16px;
            background-color: var(--secondary-bg);
            color: var(--primary-text);
            padding: 8px 16px;
            border-radius: 9999px;
            font-family: 'Merriweather', serif;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .back-btn:hover,
          .back-btn:focus {
            background-color: var(--secondary-bg-hover);
            transform: scale(1.05);
            outline: none;
          }

          .title {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 600;
            color: var(--primary-text);
            margin-bottom: 24px;
            text-align: center;
          }

          .cards-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 1200px;
            gap: 24px;
          }

          @media (min-width: 1024px) {
            .cards-container {
              flex-direction: row;
            }
          }

          .person-card {
            flex: 1;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 15px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .card-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--gold-accent);
            text-align: center;
            margin-bottom: 16px;
          }

          .field-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .field {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .search-field {
            position: relative; /* Enable absolute positioning for dropdown */
          }

          .label {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-text);
          }

          .input {
            width: 100%;
            padding: 8px 40px 8px 12px; /* Adjusted padding for search icon */
            background: linear-gradient(to right, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            transition: all 0.3s ease;
            background: #f3f4f6;
          }

          /* Modify input border when dropdown is open to blend with it */
          .input.dropdown-open {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: none; /* Remove bottom border for seamless integration */
          }

          .input:disabled {
            background: #f3f4f6;
            cursor: not-allowed;
          }

          .input:focus {
            outline: none;
            border-color: var(--gold-accent);
            box-shadow: 0 0 0 3px rgba(244, 157, 55, 0.2);
          }

          .search-btn {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            padding: 5px;
            background: transparent;
            box-shadow: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .search-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          /* Style the dropdown to appear as part of the input */
          .suggestions-dropdown {
            position: absolute;
            top: 100%; /* Position immediately below the input */
            left: 0;
            right: 0;
            max-height: 300px; /* Increased height for more suggestions */
            overflow-y: auto; /* Enable scrolling */
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-top: none; /* Remove top border to blend with input */
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Shadow effect */
            z-index: 1000; /* Ensure above other elements */
          }

          .suggestion-item {
            padding: 8px 12px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            cursor: pointer;
            transition: background-color 0.2s ease;
            white-space: nowrap; /* Prevent text wrapping */
            overflow: hidden; /* Hide overflow text */
            text-overflow: ellipsis; /* Add ellipsis for long names */
          }

          .suggestion-item:hover {
            background-color: #f3e8d7;
          }

          .action-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-top: 24px;
            width: 100%;
            max-width: 500px;
            text-align: center;
          }

          .compare-btn,
          .compare-again-btn {
            background-color: var(--primary-dark);
            color: #ffffff;
            padding: 8px 24px;
            border-radius: 6px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .compare-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .compare-btn:hover:not(:disabled),
          .compare-btn:focus:not(:disabled),
          .compare-again-btn:hover,
          .compare-again-btn:focus {
            background-color: var(--primary-hover);
            transform: scale(1.05);
            outline: none;
          }

          .relationship-text {
            font-family: 'Merriweather', serif;
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-text);
            background-color: #f3e8d7;
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .error-text {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            color: var(--header-maroon);
            background-color: #fee2e2;
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <div className="top-bar">
        <button
          className="top-bar-btn flex-center"
          onClick={() => (window.location.href = "https://gautamfamily.org.np/")}
        >
          <FaHome />
          <span>HomePage</span>
        </button>

        <button
          className="top-bar-btn hide-on-mobile flex-center"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          View Table
        </button>

        <button className="top-bar-btn flex-center" onClick={() => navigate(`/card/${id}`)}>
          <IdCard />
          Card View
        </button>
      </div>

      <div className="cards-container">
        <div className="person-card">
          <h2 className="card-title">Person 1</h2>
          <div className="field-container">
            <div className="field">
              <label className="label">Pusta Number</label>
              <input
                type="text"
                placeholder="Enter Pusta Number"
                className="input"
                value={leftPerson.pusta_number}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    pusta_number: e.target.value,
                  }))
                }
                disabled={isLeftConfirmed}
              />
            </div>

            <div className="field">
              <label className="label">Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="input"
                value={leftPerson.name_in_nepali}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                disabled={isLeftConfirmed}
              />
            </div>

            <div className="field">
              <label className="label">Father's Name</label>
              <input
                type="text"
                placeholder="Enter Father's Name"
                className="input"
                value={leftPerson.father?.name_in_nepali || ""}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    fatherName: e.target.value,
                  }))
                }
                disabled={isLeftConfirmed}
              />
            </div>

            <div className="field">
              <label className="label">Mother's Name</label>
              <input
                type="text"
                placeholder="Enter Mother's Name"
                className="input"
                value={leftPerson.mother?.name_in_nepali || ""}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    motherName: e.target.value,
                  }))
                }
                disabled={isLeftConfirmed}
              />
            </div>
          </div>
        </div>

        <div className="person-card">
          <h2 className="card-title">Person 2</h2>
          <div className="field-container">
            <div className="search-field" ref={searchFieldRef}>
              <div className="field">
                <label className="label">Search Name</label>
                <div style={{ position: "relative" }}>
                  {/* Add 'dropdown-open' class when suggestions are visible to integrate dropdown visually */}
                  <input
                    type="text"
                    placeholder="Enter Name to Search"
                    className={`input ${showSuggestions ? "dropdown-open" : ""}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                     disabled={isRightConfirmed || relationship} 
                  />
                  <button
                    className="search-btn"
                    onClick={handleSearch}
                    disabled={isRightConfirmed || !searchQuery.trim()}
                  >
                    <FaSearch className="text-black" />
                  </button>
                  {/* Dropdown integrated into the input field, showing all suggestions with scrolling */}
                  {showSuggestions && rightNameSuggestions.length > 0 && (
                    <div className="suggestions-dropdown">
                      {rightNameSuggestions.map((sugg, idx) => {
                        let display = sugg.pusta_number || "";
                        if (sugg.name) display += ` | ${sugg.name}`;
                        if (sugg.father) display += ` | ${sugg.father}`;
                        // Only add grandfather if present
                        if (sugg.grandfather) display += ` | ${sugg.grandfather}`;
                        return (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onClick={() => handleSelectSuggestion(sugg)}
                          >
                            {display}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Pusta Number</label>
              <input
                type="text"
                className="input"
                value={rightPerson.pusta_number || ""}
                disabled
                placeholder="Pusta Number"
              />
            </div>
            <div className="field">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                value={rightPerson.name_in_nepali || ""}
                disabled
                placeholder="Name"
              />
            </div>
            <div className="field">
              <label className="label">Father's Name</label>
              <input
                type="text"
                className="input"
                value={rightPerson.father?.name_in_nepali || ""}
                disabled
                placeholder="Father's Name"
              />
            </div>

            <div className="field">
              <label className="label">Mother's Name</label>
              <input
                type="text"
                className="input"
                value={rightPerson.mother?.name_in_nepali || ""}
                disabled
                placeholder="Mother's Name"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        {!relationship && (
          <button
            className="compare-btn"
            onClick={handleCompare}
            disabled={isLoading}
            aria-label="Compare"
          >
            {isLoading ? "Comparing..." : "Compare"}
          </button>
        )}

        {relationship && (
          <>
            <p className="relationship-text">{relationship}</p>
            <button
              className="compare-again-btn"
              onClick={handleCompareAgain}
              aria-label="Compare Again"
            >
              Compare Again
            </button>
          </>
        )}

        {apiError && <p className="error-text">{apiError}</p>}
      </div>
    </div>
  );
};

export default Compare;