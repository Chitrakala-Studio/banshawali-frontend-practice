import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Compare = () => {
  const [leftPerson, setLeftPerson] = useState({
    fullName: "",
    generation: "",
    fatherName: "",
    motherName: "",
  });
  const [rightPerson, setRightPerson] = useState({
    fullName: "",
    generation: "",
    fatherName: "",
    motherName: "",
  });

  const navigate = useNavigate();

  const [isLeftConfirmed, setIsLeftConfirmed] = useState(false);
  const [isRightConfirmed, setIsRightConfirmed] = useState(false);
  const [relationship, setRelationship] = useState("");

  const handleCompare = () => {
    if (
      !leftPerson.fullName ||
      !leftPerson.generation ||
      !rightPerson.fullName ||
      !rightPerson.generation
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Both Name and Generation fields are required for comparison.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }
    setRelationship(`${leftPerson.fullName} and ${rightPerson.fullName}`);
  };

  const handleConfirm = (side) => {
    if (
      (side === "left" && (!leftPerson.fullName || !leftPerson.generation)) ||
      (side === "right" && (!rightPerson.fullName || !rightPerson.generation))
    ) {
      Swal.fire({
        title: "Missing Information",
        text: "Both Name and Generation fields are required for confirmation.",
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

  const handleGenerateFamilyTree = () => {
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
        onClick={() => navigate("/1")}
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
                value={leftPerson.fullName}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                disabled={isLeftConfirmed}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Generation
              </label>
              <input
                type="text"
                placeholder="Enter Generation"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={leftPerson.generation}
                onChange={(e) =>
                  setLeftPerson((prev) => ({
                    ...prev,
                    generation: e.target.value,
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
                value={leftPerson.fatherName}
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
                value={leftPerson.motherName}
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
            <button
              className="bg-purple-700 text-white px-6 py-1 md:px-10 md:py-2 rounded-lg text-base md:text-xl"
              onClick={() => handleConfirm("left")}
              disabled={isLeftConfirmed}
            >
              Confirm
            </button>
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
                value={rightPerson.fullName}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                disabled={isRightConfirmed}
              />
            </div>
            <div className="w-full">
              <label className="block mb-2 text-sm md:text-base">
                Generation
              </label>
              <input
                type="text"
                placeholder="Enter Generation"
                className="px-4 py-2 bg-white border rounded w-full text-sm md:text-base"
                value={rightPerson.generation}
                onChange={(e) =>
                  setRightPerson((prev) => ({
                    ...prev,
                    generation: e.target.value,
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
          >
            Generate Family Tree
          </button>
        </div>
      </div>
    </div>
  );
};

export default Compare;
