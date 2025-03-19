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

  // Family members data used for suggestions
  const [familyMembers, setFamilyMembers] = useState([]);
  const [pustaNumber, setPustaNumber] = useState("");
  // const [rightNameSuggestions, setRightNameSuggestions] = useState([]);
  // State for right person's name suggestions
  const [rightNameSuggestions, setRightNameSuggestions] = useState([]);
  const [showRightNameSuggestions, setShowRightNameSuggestions] =
    useState(false);

  // State for right person's father's suggestions
  const [rightFatherSuggestions, setRightFatherSuggestions] = useState([]);
  const [showRightFatherSuggestions, setShowRightFatherSuggestions] =
    useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  // State for right person's mother's suggestions
  const [rightMotherSuggestions, setRightMotherSuggestions] = useState([]);
  const [showRightMotherSuggestions, setShowRightMotherSuggestions] =
    useState(false);

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
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [apiError, setApiError] = useState(""); // For error handling
  const [familyTreeData, setFamilyTreeData] = useState(null); // API response data

  useEffect(() => {
    if (!rightPerson.pusta_number) {
      setRightNameSuggestions([]);
    }
  }, [rightPerson.pusta_number]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const fetchSuggestions = async (
  //   pustaNumber,
  //   setRightNameSuggestions,
  //   rightNameSelectRef,
  //   setRightPerson
  // ) => {
  //   if (!pustaNumber) return;

  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/people/people/familyrelations?pusta_number=${pustaNumber}`,
  //       {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

  //     console.log("API Response:", response.data);

  //     const name_suggestions = response.data.current_pusta_data || [];

  //     if (name_suggestions.length === 0) {
  //       console.warn("No suggestions found for pusta_number:", pustaNumber);
  //     }

  //     // Add delay before updating UI to prevent flickering
  //     setTimeout(() => {
  //       setRightNameSuggestions(name_suggestions);

  //       if (rightNameSelectRef.current) {
  //         const choices = new Choices(rightNameSelectRef.current, {
  //           removeItemButton: true,
  //           shouldSort: false,
  //           searchEnabled: true,
  //         });

  //         choices.clearChoices(); // Remove old choices

  //         choices.setChoices(
  //           name_suggestions.map((sugg) => ({
  //             value: sugg.name,
  //             label: `${sugg.name} - ${sugg.father?.name || ""} | ${
  //               sugg.mother?.name || ""
  //             }`,
  //           })),
  //           "value",
  //           "label",
  //           true
  //         );

  //         rightNameSelectRef.current.addEventListener("change", (event) => {
  //           const selectedPerson = name_suggestions.find(
  //             (sugg) => sugg.name === event.target.value
  //           );
  //           if (selectedPerson) {
  //             setRightPerson((prev) => ({
  //               ...prev,
  //               name: selectedPerson.name,
  //               id: selectedPerson.id,
  //               pusta_number: selectedPerson.pusta_number,
  //               fatherName: selectedPerson.father?.name || "",
  //               motherName: selectedPerson.mother?.name || "",
  //               fatherId: selectedPerson.father?.id || "",
  //               motherId: selectedPerson.mother?.id || "",
  //             }));
  //           }
  //         });
  //       }
  //     }, 500); // Delay for 500ms
  //   } catch (error) {
  //     console.error("Error fetching suggestions:", error);
  //   }
  // };
  const fetchSuggestions = async (pustaNumber) => {
    if (!pustaNumber) return;
    try {
      const response = await axios.get(
        `${API_URL}/people/people/familyrelations?pusta_number=${pustaNumber}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);
      const name_suggestions = response.data.current_pusta_data || [];
      if (name_suggestions.length === 0) {
        console.warn("No suggestions found for pusta_number:", pustaNumber);
      }

      // Add delay before updating UI to prevent flickering
      setTimeout(() => {
        setRightNameSuggestions(name_suggestions);
        if (rightNameSelectRef.current) {
          const choices = new Choices(rightNameSelectRef.current, {
            removeItemButton: true,
            shouldSort: false,
            searchEnabled: true,
          });
          choices.clearChoices(); // Remove old choices
          choices.setChoices(
            name_suggestions.map((sugg) => ({
              value: sugg.name,
              label: `${sugg.name} - ${sugg.father?.name || ""} | ${
                sugg.mother?.name || ""
              }`,
            })),
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
                name: selectedPerson.name,
                id: selectedPerson.id,
                pusta_number: selectedPerson.pusta_number,
                fatherName: selectedPerson.father?.name || "",
                motherName: selectedPerson.mother?.name || "",
                fatherId: selectedPerson.father?.id || "",
                motherId: selectedPerson.mother?.id || "",
              }));
            }
          });
        }
      }, 500);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const debouncedFetch = useCallback(
    debounce((pustaNumber) => {
      fetchSuggestions(pustaNumber);
    }, 3000),
    []
  );
  // if (rightPerson.pusta_number) {
  //   debouncedFetch(rightPerson.pusta_number);
  // }

  // Suggestion function for right person's father's name
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
        console.log("Father's name from database:", fatherName);

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

        console.log("Father suggestions:", suggestions);
        resolve(suggestions);
      }, 500);
    });
  };

  // Suggestion function for right person's mother's name
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
        console.log("Mother's name from database:", motherName);

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

        console.log("Mother suggestions:", suggestions);
        resolve(suggestions);
      }, 500);
    });
  };

  // Fetch left person's data by ID
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
        console.log(fetchedData);
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
  const rightNameSelectRef = useRef(null);

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
      console.log("Missing Information");
      console.log(leftPerson);
      console.log(rightPerson);
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

      console.log(response.data);
      console.log(response.data.message);
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
    <div className="flex min-h-screen bg-gray-100">
      <button
        className="absolute top-4 left-4 bg-purple-700 text-white px-4 py-2 rounded-full"
        onClick={() => {
          isMobile ? navigate(`/card/${id}`) : navigate(`/`);
        }}
      >
        {isMobile ? "Go Back to Card" : "Go Back to Table"}
      </button>

      <div className="flex flex-col items-center px-4 py-6 pt-20 h-full w-full overflow-y-auto">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">
          Compare
        </h1>

        <div className="flex flex-col lg:flex-row lg:justify-center pt-10 lg:space-x-8 space-y-8 lg:space-y-0 w-full max-w-4xl">
          {/* Left Person */}
          <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
            <h1 className="text-3xl font-bold text-center -mt-4">Person 1</h1>

            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Pusta Number
              </label>
              <input
                type="text"
                placeholder="Enter Pusta Number"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
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
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
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
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Father's Name
              </label>
              <input
                type="text"
                placeholder="Enter Father's Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
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
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Mother's Name
              </label>
              <input
                type="text"
                placeholder="Enter Mother's Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
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

          {/* Right Person */}

          <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
            <h1 className="text-3xl font-bold text-center -mt-4">Person 2</h1>

            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Pusta Number
              </label>
              <input
                type="text"
                placeholder="Enter pusta_number"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
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

            <div className="w-full relative">
              <label className="block mb-2 text-sm md:text-base">Name</label>
              {/* className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base" */}
              <select
                ref={rightNameSelectRef}
                id="rightNameSelect"
                className="px-4 py-2  bg-white border rounded w-full text-sm md:text-base"
              >
                <option value="">Select Name</option>
              </select>
              {showRightNameSuggestions && rightNameSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                  {rightNameSuggestions.map((sugg, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setRightPerson((prev) => ({
                          ...prev,
                          name: sugg.name,
                          id: sugg.id, // Store selected person's ID
                          pusta_number: sugg.pusta_number,
                          fatherName: sugg.father?.name || "",
                          motherName: sugg.mother?.name || "",
                          fatherId: sugg.father?.id || "",
                          motherId: sugg.mother?.id || "",
                        }));
                        setShowRightNameSuggestions(false);
                        setRightNameSuggestions([]);

                        // Fetch father's and mother's suggestions based on selected person
                        if (sugg.father?.name) {
                          const parentGeneration = sugg.pusta_number - 1;
                          fetchRightFatherSuggestions(
                            parentGeneration,
                            sugg.father.name,
                            sugg.id
                          )
                            .then((suggestions) => {
                              setRightFatherSuggestions(suggestions);
                              setShowRightFatherSuggestions(true);
                            })
                            .catch((error) =>
                              console.error(
                                "Error fetching father suggestions:",
                                error
                              )
                            );
                        }

                        if (sugg.mother?.name) {
                          const parentGeneration = sugg.pusta_number - 1;
                          fetchRightMotherSuggestions(
                            parentGeneration,
                            sugg.mother.name,
                            sugg.id
                          )
                            .then((suggestions) => {
                              setRightMotherSuggestions(suggestions);
                              setShowRightMotherSuggestions(true);
                            })
                            .catch((error) =>
                              console.error(
                                "Error fetching mother suggestions:",
                                error
                              )
                            );
                        }
                      }}
                    >
                      {sugg.name}{" "}
                      <span className="text-sm text-gray-600">
                        {sugg.father?.name && sugg.mother?.name
                          ? `- ${sugg.father.name} | ${sugg.mother.name}`
                          : sugg.father?.name
                          ? `- ${sugg.father.name}`
                          : sugg.mother?.name
                          ? `- ${sugg.mother.name}`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full relative">
              <label className="block mb-2 text-sm md:text-base">
                Father's Name
              </label>
              <input
                type="text"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.fatherName}
                disabled
                placeholder="Father's Name"
              />
            </div>

            <div className="w-full relative">
              <label className="block mb-2 text-sm md:text-base">
                Mother's Name
              </label>
              <input
                type="text"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.motherName}
                disabled
                placeholder="Mother's Name"
              />
            </div>
          </div>
        </div>

        <div className="text-center w-full max-w-md mt-8 flex flex-col mb-4">
          <button
            className="bg-purple-700 text-white px-6 py-2 md:px-10 md:py-2 rounded-lg text-base md:text-xl mb-4"
            onClick={handleCompare}
            disabled={isLoading}
          >
            {isLoading ? "Comparing..." : "Compare"}
          </button>

          {relationship && (
            <>
              <p className="text-lg font-bold mb-4">{relationship}</p>
              <button
                className="bg-blue-600 text-white px-6 py-2 md:px-10 md:py-2 rounded-lg text-base md:text-xl mb-4"
                onClick={handleCompareAgain}
              >
                Compare Again
              </button>
            </>
          )}

          {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Compare;
