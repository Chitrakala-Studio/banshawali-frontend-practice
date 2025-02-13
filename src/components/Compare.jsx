import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Compare = () => {
  const { id } = useParams();

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

  const navigate = useNavigate();

  const [isLeftConfirmed, setIsLeftConfirmed] = useState(true);
  const [isRightConfirmed, setIsRightConfirmed] = useState(false);
  const [relationship, setRelationship] = useState("");

  const [isLoading, setIsLoading] = useState(false); // For loading state
  const [apiError, setApiError] = useState(""); // For error handling
  const [familyTreeData, setFamilyTreeData] = useState(null); // API response data

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

    // Compare the two persons and set the relationship
    // Call the API to compare the two persons
    const leftPersonId = leftPerson.id;
    const rightPerson_name = rightPerson.name;
    const rightPerson_pusta_number = rightPerson.pusta_number;
    const rightPerson_fatherName = rightPerson.fatherName;
    const rightPerson_motherName = rightPerson.motherName;

    // Replace with your API endpoint for comparing the two persons
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
          setIsLeftConfirmed(true); // Disable left side
        } else if (side === "right") {
          setIsRightConfirmed(true); // Disable right side
        }
        Swal.fire("Confirmed!", "The information is now locked.", "success");
      }
    });
  };
  useEffect(() => {
    const fetchLeftPersonData = async () => {
      setIsLoading(true);
      try {
        // Replace with your API endpoint for fetching the person's details
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

  const handleGenerateFamilyTree = async () => {
    //   setIsLoading(true); // Set loading to true when the button is clicked
    //   setApiError("");
    //   try {
    //     // Make an API call to generate the family tree (example URL)
    //     const response = await axios.get(`https://api.example.com/persons/${id}`);
    //       setLeftPerson(response.data);
    //   }
    //     setFamilyTreeData(response.data);

    Swal.fire({
      title: "Family Tree being Generated!",
      icon: "success",
      confirmButtonText: "Okay",
    }).then(() => {
      setIsLeftConfirmed(false);
      setIsRightConfirmed(false);
    });
  };
  // } catch (error) {
  //   // Handle error
  //   console.error("Error response:", error.response);  // This will help you debug the API error
  //   setApiError("Failed to generate family tree. Please try again later.");
  //   Swal.fire({
  //     title: "Error",
  //     text: "There was an issue generating the family tree. Please try again.",
  //     icon: "error",
  //     confirmButtonText: "Okay",
  //   });
  // } finally {
  //   setIsLoading(false); // Set loading to false after the request completes
  // }

  // };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <button
        className="absolute top-4 left-4 bg-purple-700 text-white px-4 py-2 rounded-full"
        onClick={() => navigate(`/${id}`)}
      >
        Go Back to Card
      </button>

      <div className="flex flex-col items-center px-4 py-6 h-full w-full overflow-y-auto">
        {/* Heading */}
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">
          Compare
        </h1>

        {/* Flex Container for Left and Right Person */}
        <div className="flex flex-col lg:flex-row lg:justify-center pt-10 lg:space-x-8 space-y-8 lg:space-y-0 w-full max-w-4xl">
          {/* Left Person */}
          <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
            {/* Input Fields */}
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

            {/* Confirm Button */}
            {/* <button
              className="bg-purple-700 text-white px-6 py-1 md:px-10 md:py-2 rounded-lg text-base md:text-xl"
              onClick={() => handleConfirm("left")}
              disabled={isLeftConfirmed}
            >
              Confirm
            </button> */}
          </div>

          {/* Right Person */}
          <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
            {/* Input Fields */}
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.name}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                disabled={isRightConfirmed}
              />
            </div>
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
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Father's Name
              </label>
              <input
                type="text"
                placeholder="Enter Father's Name"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.fatherName}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    fatherName: e.target.value,
                  }))
                }
                disabled={isRightConfirmed}
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
                value={rightPerson.motherName}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    motherName: e.target.value,
                  }))
                }
                disabled={isRightConfirmed}
              />
            </div>

            {/* Confirm Button */}
            <button
              className="bg-purple-700 text-white px-6 py-1 md:px-10 md:py-2 rounded-lg text-base md:text-xl"
              onClick={() => handleConfirm("right")}
              disabled={isRightConfirmed}
            >
              Confirm
            </button>
          </div>
        </div>

        {/* Relationship Result */}
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
          {/* Display Family Tree if available
          {familyTreeData && (
            <div className="mt-6">
              <h2 className="text-xl font-bold">Generated Family Tree</h2>
              <pre>{JSON.stringify(familyTreeData, null, 2)}</pre>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Compare;
