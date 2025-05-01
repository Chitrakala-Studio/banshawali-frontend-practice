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
    <div className="min-h-screen bg-[#B9BAC3] bg-gradient-to-b from-[#B9BAC3] to-[#A6C8A5] flex items-center justify-center px-4 py-6">
      <style>
        {`
          .choices__inner {
            min-width: 100%;
            white-space: nowrap;
            background-color: #A6C8A5;
            border: 1px solid #AAABAC;
            border-radius: 8px;
            padding: 8px;
          }
          .choices__list--dropdown {
            max-height: 200px;
            overflow-y: auto;
            scroll-behavior: smooth;
            background-color: #A6C8A5;
            border: 1px solid #AAABAC;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .choices__list--dropdown .choices__item {
            white-space: nowrap;
            overflow-x: auto;
            transition: background-color 0.2s ease;
            padding: 8px 12px;
            color: #2E4568;
          }
          .choices__list--dropdown .choices__item:hover {
            background-color: #E9D4B0;
          }
          .choices__input {
            border: none !important;
            outline: none !important;
            padding: 4px 8px;
            color: #2E4568;
          }
        `}
      </style>

      {/* Back Button */}
      <button
        className="absolute top-4 left-4 bg-[#E9D4B0] text-[#2E4568] px-4 py-2 rounded-full hover:bg-[#D9C4A0] transition-colors duration-300 shadow-md"
        onClick={() => {
          isMobile ? navigate(`/card/${id}`) : navigate(`/`);
        }}
      >
        {isMobile ? "Go Back to Card" : "Go Back to Table"}
      </button>

      <div className="w-full max-w-5xl flex flex-col items-center pt-16 pb-8">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#2E4568] mb-8">
          Compare Family Members
        </h1>

        {/* Person Cards */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0 w-full">
          {/* Left Person Card */}
          <div className="w-full lg:w-1/2 bg-[#A6C8A5] rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#2E4568] text-center mb-6">
              Person 1
            </h2>
            <div className="space-y-4">
              {/* Pusta Number */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Pusta Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Pusta Number"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
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

              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
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

              {/* Father's Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Father's Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Father's Name"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
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

              {/* Mother's Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Mother's Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Mother's Name"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
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
          <div className="w-full lg:w-1/2 bg-[#A6C8A5] rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#2E4568] text-center mb-6">
              Person 2
            </h2>
            <div className="space-y-4">
              {/* Pusta Number */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Pusta Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Pusta Number"
                  className="w-full bg-[#B9BAC3] px-4 py-2 border border-[#AAABAC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
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

              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Name
                </label>
                <select
                  ref={rightNameSelectRef}
                  id="rightNameSelect"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E4568] text-sm md:text-base text-[#2E4568]"
                >
                  <option value="">Select Name</option>
                </select>
              </div>

              {/* Father's Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Father's Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg text-sm md:text-base text-[#2E4568]"
                  value={rightPerson.fatherName}
                  disabled
                  placeholder="Father's Name"
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label className="block mb-1 text-sm font-medium text-[#2E4568]">
                  Mother's Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-[#AAABAC] bg-[#B9BAC3] rounded-lg text-sm md:text-base text-[#2E4568]"
                  value={rightPerson.motherName}
                  disabled
                  placeholder="Mother's Name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons and Result */}
        <div className="text-center w-full max-w-md mt-8 flex flex-col items-center">
          {!relationship && (
            <button
              className="bg-[#E9D4B0] text-[#2E4568] px-8 py-3 rounded-lg text-base md:text-lg font-medium hover:bg-[#D9C4A0] transition-colors duration-300 shadow-md"
              onClick={handleCompare}
              disabled={isLoading}
            >
              {isLoading ? "Comparing..." : "Compare"}
            </button>
          )}

          {relationship && (
            <>
              <p className="text-lg font-semibold text-[#2E4568] mb-4 bg-[#A6C8A5] px-4 py-2 rounded-lg shadow">
                {relationship}
              </p>
              <button
                className="bg-[#E9D4B0] text-[#2E4568] px-8 py-3 rounded-lg text-base md:text-lg font-medium hover:bg-[#D9C4A0] transition-colors duration-300 shadow-md"
                onClick={handleCompareAgain}
              >
                Compare Again
              </button>
            </>
          )}

          {apiError && (
            <p className="text-[#2E4568] text-sm mt-4 bg-[#E9D4B0] px-4 py-2 rounded-lg shadow">
              {apiError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
