import debounce from "lodash.debounce";
import axios from "axios";
import Choices from "choices.js";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "choices.js/public/assets/styles/choices.css";

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [familyMembers, setFamilyMembers] = useState([]);
  const [rightNameSuggestions, setRightNameSuggestions] = useState([]);
  const choicesInstanceRef = useRef(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  const [rightFatherSuggestions, setRightFatherSuggestions] = useState([]);
  const [rightMotherSuggestions, setRightMotherSuggestions] = useState([]);

  const [leftPerson, setLeftPerson] = useState({
    name: "",
    pusta_number: "",
    fatherName: "",
    motherName: "",
  });
  const [rightPerson, setRightPerson] = useState({
    name: "",
    pusta_number: "",
    fatherName: "",
    fatherId: "",
    motherName: "",
    motherId: "",
  });

  const [isLeftConfirmed, setIsLeftConfirmed] = useState(true);
  const [isRightConfirmed, setIsRightConfirmed] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [familyTreeData, setFamilyTreeData] = useState(null);

  const rightNameSelectRef = useRef(null);

  useEffect(() => {
    if (rightNameSelectRef.current && !choicesInstanceRef.current) {
      choicesInstanceRef.current = new Choices(rightNameSelectRef.current, {
        removeItemButton: true,
        shouldSort: false,
        searchEnabled: true,
        searchFields: ["customProperties.english", "label"],
        maxItemCount: 50,
      });
    }
    return () => {
      if (choicesInstanceRef.current) {
        choicesInstanceRef.current.destroy();
        choicesInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!rightPerson.pusta_number) {
      setRightNameSuggestions([]);
      if (choicesInstanceRef.current) {
        choicesInstanceRef.current.clearChoices();
        choicesInstanceRef.current.setChoices(
          [{ value: "", label: "Select Name" }],
          "value",
          "label",
          true
        );
      }
    }
  }, [rightPerson.pusta_number]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSuggestions = async (pustaNumber) => {
    if (!pustaNumber) return;
    try {
      const response = await axios.get(
        `${API_URL}/people/people/familyrelations?pusta_number=${pustaNumber}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      const name_suggestions = response.data.current_pusta_data || [];
      setRightNameSuggestions(name_suggestions);
      if (rightNameSelectRef.current && choicesInstanceRef.current) {
        choicesInstanceRef.current.clearChoices();
        choicesInstanceRef.current.setChoices(
          name_suggestions.length > 0
            ? name_suggestions.map((sugg) => ({
                value: sugg.name,
                label: `${sugg.name_in_nepali || sugg.name} - ${
                  sugg.father?.name_in_nepali || sugg.father?.name || ""
                } | ${sugg.mother?.name_in_nepali || sugg.mother?.name || ""}`,
                customProperties: { english: sugg.name },
              }))
            : [{ value: "", label: "Select Name" }],
          "value",
          "label",
          true
        );
        rightNameSelectRef.current.addEventListener("change", (event) => {
          const selectedPerson = name_suggestions.find(
            (sugg) => sugg.name === event.target.value
          );
          if (selectedPerson) {
            setRightPerson((prev) => ({
              ...prev,
              name: selectedPerson.name_in_nepali || selectedPerson.name,
              id: selectedPerson.id,
              pusta_number: selectedPerson.pusta_number,
              fatherName:
                selectedPerson.father?.name_in_nepali ||
                selectedPerson.father?.name ||
                "",
              motherName:
                selectedPerson.mother?.name_in_nepali ||
                selectedPerson.mother?.name ||
                "",
              fatherId: selectedPerson.father?.id || "",
              motherId: selectedPerson.mother?.id || "",
            }));
          }
        });
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((pustaNumber) => {
      fetchSuggestions(pustaNumber);
    }, 500),
    []
  );

  const fetchRightFatherSuggestions = (parentGeneration, query, personId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const person = familyMembers.find((member) => member.id === personId);
        if (!person) {
          console.log("Person not found in familyMembers");
          resolve([]);
          return;
        }

        const fatherName = person.father?.name || "";
        const suggestions = familyMembers.filter((member) => {
          const isRightGeneration =
            member.pusta_number === parentGeneration.toString();
          const matchesQuery =
            query.trim() === "" ||
            member.name.toLowerCase().includes(query.toLowerCase());
          const isMale =
            member.gender && member.gender.toLowerCase() === "male";
          const matchesFatherName = member.name === fatherName;
          return (
            isRightGeneration && matchesQuery && isMale && matchesFatherName
          );
        });

        resolve(suggestions);
      }, 500);
    });
  };

  const fetchRightMotherSuggestions = (parentGeneration, query, personId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const person = familyMembers.find((member) => member.id === personId);
        if (!person) {
          console.log("Person not found in familyMembers");
          resolve([]);
          return;
        }

        const motherName = person.mother?.name || "";
        const suggestions = familyMembers.filter((member) => {
          const isRightGeneration =
            member.pusta_number === parentGeneration.toString();
          const matchesQuery =
            query.trim() === "" ||
            member.name.toLowerCase().includes(query.toLowerCase());
          const isFemale =
            member.gender && member.gender.toLowerCase() === "female";
          const matchesMotherName = member.name === motherName;
          return (
            isRightGeneration && matchesQuery && isFemale && matchesMotherName
          );
        });

        resolve(suggestions);
      }, 500);
    });
  };

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
        setApiError(
          "Failed to fetch left person's data. Please try again later."
        );
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

  const handleCompare = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });

    if (
      !leftPerson.name ||
      !leftPerson.pusta_number ||
      !rightPerson.name ||
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
      const rightPerson_name = rightPerson.name;
      const rightPerson_pusta_number = rightPerson.pusta_number;
      const rightPerson_fatherName = rightPerson.fatherId;
      const rightPerson_motherName = rightPerson.motherId;

      const response = await axios.post(`${API_URL}/people/compare/`, {
        leftPersonId,
        rightPerson_name,
        rightPerson_pusta_number,
        rightPerson_fatherName,
        rightPerson_motherName,
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
          }

          .compare-container {
            min-height: 100vh;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px;
            justify-content: center;
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

          .label {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-text);
          }

          .input,
          .select {
            width: 100%;
            padding: 8px 12px;
            background: linear-gradient(to right, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            transition: all 0.3s ease;
          }

          .input:disabled,
          .select:disabled {
            background: #f3f4f6;
            cursor: not-allowed;
          }

          .input:focus,
          .select:focus {
            outline: none;
            border-color: var(--gold-accent);
            box-shadow: 0 0 0 3px rgba(244, 157, 55, 0.2);
          }

          .choices__inner {
            width: 100%;
            background: linear-gradient(to right, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            padding: 8px 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
          }

          .choices__list--dropdown {
            max-height: 200px;
            overflow-y: auto;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .choices__list--dropdown .choices__item {
            padding: 8px 12px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            transition: background-color 0.2s ease;
          }

          .choices__list--dropdown .choices__item:hover {
            background-color: #f3e8d7;
          }

          .choices__input {
            border: none !important;
            outline: none !important;
            padding: 4px 8px;
            color: var(--primary-text);
            font-family: 'Merriweather', serif;
            font-size: 16px;
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

      <button
        className="back-btn"
        onClick={() => {
          isMobile ? navigate(`/card/${id}`) : navigate(`/`);
        }}
        aria-label={isMobile ? "Go Back to Card" : "Go Back to Table"}
      >
        {isMobile ? "Go Back to Card" : "Go Back to Table"}
      </button>

      <div className="cards-container">
        {/* Left Person Card */}
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

        {/* Right Person Card */}
        <div className="person-card">
          <h2 className="card-title">Person 2</h2>
          <div className="field-container">
            <div className="field">
              <label className="label">Pusta Number</label>
              <input
                type="text"
                placeholder="Enter Pusta Number"
                className="input"
                value={rightPerson.pusta_number || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setRightPerson((prev) => ({
                    ...prev,
                    pusta_number: value,
                    name: "",
                    fatherName: "",
                    motherName: "",
                    fatherId: "",
                    motherId: "",
                  }));
                  debouncedFetch(value);
                }}
                onBlur={() => {
                  debouncedFetch.flush();
                }}
                disabled={isRightConfirmed}
              />
            </div>

            <div className="field">
              <label className="label">Name</label>
              <select
                ref={rightNameSelectRef}
                id="rightNameSelect"
                className="select"
              >
                <option value="">Select Name</option>
              </select>
            </div>

            <div className="field">
              <label className="label">Father's Name</label>
              <input
                type="text"
                className="input"
                value={rightPerson.fatherName}
                disabled
                placeholder="Father's Name"
              />
            </div>

            <div className="field">
              <label className="label">Mother's Name</label>
              <input
                type="text"
                className="input"
                value={rightPerson.motherName}
                disabled
                placeholder="Mother's Name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons and Result */}
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