import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Compare = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Family members data used for suggestions
  const [familyMembers, setFamilyMembers] = useState([]);

  // State for right person's name suggestions
  const [rightNameSuggestions, setRightNameSuggestions] = useState([]);
  const [showRightNameSuggestions, setShowRightNameSuggestions] =
    useState(false);

  // State for right person's father's suggestions
  const [rightFatherSuggestions, setRightFatherSuggestions] = useState([]);
  const [showRightFatherSuggestions, setShowRightFatherSuggestions] =
    useState(false);

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
    motherName: "",
  });

  const [isLeftConfirmed, setIsLeftConfirmed] = useState(true);
  const [isRightConfirmed, setIsRightConfirmed] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [apiError, setApiError] = useState(""); // For error handling
  const [familyTreeData, setFamilyTreeData] = useState(null); // API response data

  // Suggestion function for right person's name
  const fetchRightNameSuggestions = (pustaNumber, query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = familyMembers.filter((member) => {
          const matchesPusta = member.pusta_number === pustaNumber;
          const matchesQuery =
            query.trim() === "" ||
            member.name.toLowerCase().includes(query.toLowerCase());
          return matchesPusta && matchesQuery;
        });
        resolve(suggestions);
      }, 500);
    });
  };

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

  // Fetch all family members once
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get(`https://gautamfamily.org.np/people/`);
        setFamilyMembers(response.data);
      } catch (error) {
        console.error("Error fetching family members:", error);
      }
    };

    fetchFamilyMembers();
  }, []);

  // Fetch left person's data by ID
  useEffect(() => {
    const fetchLeftPersonData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://gautamfamily.org.np/people/${id}`
        );
        console.log(response.data);
        setLeftPerson(response.data);
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

    const leftPersonId = leftPerson.id;
    const rightPerson_name = rightPerson.name;
    const rightPerson_pusta_number = rightPerson.pusta_number;
    const rightPerson_fatherName = rightPerson.fatherName;
    const rightPerson_motherName = rightPerson.motherName;

    const response = await axios.post(`https://gautamfamily.org.np/compare/`, {
      leftPersonId,
      rightPerson_name,
      rightPerson_pusta_number,
      rightPerson_fatherName,
      rightPerson_motherName,
    });

    console.log(response.data);
    console.log(response.data.message);
    setRelationship(response.data.message);
  };

  const handleConfirm = (side) => {
    if (
      (side === "left" && (!leftPerson.name || !leftPerson.pusta_number)) ||
      (side === "right" && (!rightPerson.name || !rightPerson.pusta_number))
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Both Name and pusta_number fields are required for confirmation.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Once confirmed, this form can't be edited.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (side === "left") {
          setIsLeftConfirmed(true);
        } else if (side === "right") {
          setIsRightConfirmed(true);
        }
        Swal.fire("Confirmed!", "The information is now locked.", "success");
      }
    });
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
        onClick={() => navigate(`/${id}`)}
      >
        Go Back to Card
      </button>

      <div className="flex flex-col items-center px-4 py-6 h-full w-full overflow-y-auto">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">
          Compare
        </h1>

        <div className="flex flex-col lg:flex-row lg:justify-center pt-10 lg:space-x-8 space-y-8 lg:space-y-0 w-full max-w-4xl">
          {/* Left Person */}
          <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
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
                value={leftPerson.name}
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
                value={leftPerson.father?.name || ""}
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
                value={leftPerson.mother?.name || ""}
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
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Pusta Number
              </label>
              <input
                type="text"
                placeholder="Enter pusta_number"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.pusta_number}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    pusta_number: e.target.value,
                  }))
                }
                disabled={isRightConfirmed}
              />
            </div>

            <div className="w-full relative">
              <label className="block mb-2 text-sm md:text-base">Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setRightPerson((prev) => ({ ...prev, name: value }));
                  if (rightPerson.pusta_number) {
                    fetchRightNameSuggestions(rightPerson.pusta_number, value)
                      .then((suggestions) => {
                        setRightNameSuggestions(suggestions);
                        setShowRightNameSuggestions(true);
                      })
                      .catch((error) =>
                        console.error(
                          "Error fetching right name suggestions:",
                          error
                        )
                      );
                  }
                }}
                onFocus={() => {
                  if (rightPerson.pusta_number) {
                    fetchRightNameSuggestions(
                      rightPerson.pusta_number,
                      rightPerson.name
                    )
                      .then((suggestions) => {
                        setRightNameSuggestions(suggestions);
                        setShowRightNameSuggestions(true);
                      })
                      .catch((error) =>
                        console.error(
                          "Error fetching right name suggestions:",
                          error
                        )
                      );
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowRightNameSuggestions(false), 150);
                }}
                disabled={isRightConfirmed}
              />
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
                          fatherName: sugg.father?.name || "", // Auto-fill father's name
                          motherName: sugg.mother?.name || "", // Auto-fill mother's name
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
                onChange={(e) => {
                  setRightPerson((prev) => ({
                    ...prev,
                    fatherName: e.target.value,
                  }));
                }}
                placeholder="Father's Name"
              />
              {showRightFatherSuggestions &&
                rightFatherSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                    {rightFatherSuggestions.map((sugg, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRightPerson((prev) => ({
                            ...prev,
                            fatherName: sugg.name,
                          }));
                          setShowRightFatherSuggestions(false);
                          setRightFatherSuggestions([]);
                        }}
                      >
                        {sugg.name}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            <div className="w-full relative">
              <label className="block mb-2 text-sm md:text-base">
                Mother's Name
              </label>
              <input
                type="text"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.motherName}
                onChange={(e) => {
                  setRightPerson((prev) => ({
                    ...prev,
                    motherName: e.target.value,
                  }));
                }}
                placeholder="Mother's Name"
              />
              {showRightMotherSuggestions &&
                rightMotherSuggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white border rounded mt-1 max-h-40 overflow-y-auto w-full">
                    {rightMotherSuggestions.map((sugg, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRightPerson((prev) => ({
                            ...prev,
                            motherName: sugg.name,
                          }));
                          setShowRightMotherSuggestions(false);
                          setRightMotherSuggestions([]);
                        }}
                      >
                        {sugg.name}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            <button
              className="bg-purple-700 text-white px-6 py-1 md:px-10 md:py-2 rounded-lg text-base md:text-xl"
              onClick={() => handleConfirm("right")}
              disabled={isRightConfirmed}
            >
              Confirm
            </button>
          </div>
        </div>

        <div className="text-center w-full max-w-md mt-8 flex flex-col mb-4">
          <button
            className="bg-purple-700 text-white px-6 py-2 md:px-10 md:py-2 rounded-lg text-base md:text-xl mb-4"
            onClick={handleCompare}
          >
            Compare
          </button>

          {relationship && (
            <p className="text-lg font-bold mb-4">{relationship}</p>
          )}

          <button
            className="bg-green-600 text-white px-6 py-2 md:px-10 md:py-2 rounded text-base md:text-xl"
            onClick={handleGenerateFamilyTree}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Family Tree"}
          </button>
          {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Compare;
