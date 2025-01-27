import { useState } from "react";
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

  const [isLeftConfirmed, setIsLeftConfirmed] = useState(false);
  const [isRightConfirmed, setIsRightConfirmed] = useState(false);
  const [relationship, setRelationship] = useState("");

  const handleCompare = () => {
    setRelationship(`${leftPerson.fullName} and ${rightPerson.fullName}`);
  };

  const handleConfirm = (side) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once confirmed, form can't be edited.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then((result) => {
      if (result.isConfirmed) {
        if (side === "left") {
          setIsLeftConfirmed(true);
        } else {
          setIsRightConfirmed(true);
        }
        Swal.fire("Confirmed!", "success");
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
    <div className="flex flex-col items-center px-2 h-full w-full overflow-y-auto">
      <h1 className="text-center text-3xl font-bold mt-4 mb-6">Compare</h1>

      {/* Flex Container for Left and Right Person */}
      <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-8 space-y-8 lg:space-y-0 w-full max-w-4xl">
        {/* Left Person */}
        <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-500">+</span>
          </div>
          <div className="w-full">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="px-4 py-2 bg-white border rounded w-full"
              value={leftPerson.fullName}
              onChange={(e) =>
                setLeftPerson((prev) => ({ ...prev, fullName: e.target.value }))
              }
              disabled={isLeftConfirmed}
            />
          </div>
          <div className="w-full">
            <label className="block mb-2">Generation</label>
            <input
              type="text"
              placeholder="Enter Generation"
              className="px-4 py-2 bg-white border rounded w-full"
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
            <label className="block mb-2">Father's Name</label>
            <input
              type="text"
              placeholder="Enter Father's Name"
              className="px-4 py-2 bg-white border rounded w-full"
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
            <label className="block mb-2">Mother's Name</label>
            <input
              type="text"
              placeholder="Enter Mother's Name"
              className="px-4 py-2 bg-white border rounded w-full"
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
          <button
            className="bg-purple-700 text-white px-10 py-1 rounded-lg text-xl"
            onClick={() => handleConfirm("left")}
            disabled={isLeftConfirmed}
          >
            Confirm
          </button>
        </div>

        {/* Right Person */}
        <div className="flex flex-col items-center space-y-4 w-full lg:w-1/2">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-500">+</span>
          </div>
          <div className="w-full">
            <label className="block mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              className="px-4 py-2 border bg-white rounded w-full"
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
            <label className="block mb-2">Generation</label>
            <input
              type="text"
              placeholder="Enter Generation"
              className="px-4 py-2 bg-white border rounded w-full"
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
            <label className="block mb-2">Father's Name</label>
            <input
              type="text"
              placeholder="Enter Father's Name"
              className="px-4 py-2 bg-white border rounded w-full"
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
            <label className="block mb-2">Mother's Name</label>
            <input
              type="text"
              placeholder="Enter Mother's Name"
              className="px-4 py-2 bg-white border rounded w-full"
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
          <button
            className="bg-purple-700 text-white px-10 py-1 rounded-lg text-xl"
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
          className="bg-purple-700 text-white px-10 py-2 rounded-lg text-xl mb-4"
          onClick={handleCompare}
        >
          Compare
        </button>

        {relationship && <p className="text-lg font-bold">{relationship}</p>}
        <button
          className="bg-green-600 text-white px-10 py-2 rounded mt-4"
          onClick={handleGenerateFamilyTree}
        >
          Generate Family Tree
        </button>
      </div>
    </div>
  );
};

export default Compare;
