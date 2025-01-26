import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(formData);
  const [suggestions, setSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMotherSuggestions, setShowMotherSuggestions] = useState(false);

  // Updated familyMembers data with separate father_dob and mother_dob
  const familyMembers = [
    { name: "Ram Bahadur", father_dob: "1970-05-15", mother_dob: "1975-06-25", pusta_number: "2", mother_name: "Sita Devi" },
    { name: "Shyam Lal", father_dob: "1965-11-20", mother_dob: "1970-01-10", pusta_number: "3", mother_name: "Radha Devi" },
    { name: "Hari Krishna", father_dob: "1975-02-10", mother_dob: "1980-04-05", pusta_number: "1", mother_name: "Gita Devi" },
    { name: "Gopal Prasad", father_dob: "1980-08-25", mother_dob: "1985-02-15", pusta_number: "2", mother_name: "Maya Devi" },
  ];

  // Function to fetch father's name suggestions
  const fetchFatherSuggestions = (adjustedPustaNumber, query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = familyMembers.filter(
          (member) =>
            member.pusta_number === adjustedPustaNumber.toString() && 
            member.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(suggestions);
      }, 500); // Simulate API delay
    });
  };

  // Function to fetch mother's name suggestions
  const fetchMotherSuggestions = (adjustedPustaNumber, query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = familyMembers.filter(
          (member) =>
            member.pusta_number === adjustedPustaNumber.toString() &&
            member.mother_name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(suggestions);
      }, 500); // Simulate API delay
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle father name suggestions
    if (name === "father_name" && value.trim()) {
      const adjustedPustaNumber = form.pusta_number - 1;
      fetchSuggestions(adjustedPustaNumber, value);
    } else if (name === "father_name" && !value.trim()) {
      setSuggestions([]);
    }

    // Handle mother name suggestions
    if (name === "mother_name" && value.trim()) {
      const adjustedPustaNumber = form.pusta_number - 1;
      fetchMotherSuggestions(adjustedPustaNumber, value).then((results) => {
        setMotherSuggestions(results);
        setShowMotherSuggestions(true); // Ensure suggestions are shown
      });
    } else if (name === "mother_name" && !value.trim()) {
      setMotherSuggestions([]);
    }
  };

  const fetchSuggestions = async (adjustedPustaNumber, query) => {
    try {
      const results = await fetchFatherSuggestions(adjustedPustaNumber, query); // Pass adjusted number
      setSuggestions(results);
      setShowSuggestions(true); // Show father suggestions
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      father_name: suggestion.name,
      father_dob: suggestion.father_dob, // Set father's DOB
    }));
    setShowSuggestions(false);
  };

  const handleMotherSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      mother_name: suggestion.mother_name,
      mother_dob: suggestion.mother_dob, // Set mother's DOB
    }));
    setShowMotherSuggestions(false); // Hide suggestions after selection
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save these changes?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onSave(form); // Pass updated data back to parent
        Swal.fire("Saved!", "Your changes have been saved.", "success");
        window.location.reload(); // Reload the page
        onClose(); // Close modal
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-white h-[600px] w-[700px] rounded-lg relative flex justify-center items-center overflow-y-scroll overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
        >
          &#x2715;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full w-full items-center ">
          {/* Profile Picture */}
          <div className="flex justify-center mt-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-3xl text-gray-500">+</span>
            </div>
          </div>

          {/* Username */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter username"
            />
          </div>

          {/* Pusta Number */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Pusta Number
            </label>
            <input
              type="text"
              name="pusta_number"
              value={form.pusta_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter pusta number"
            />
          </div>

          {/* Father's Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Father&apos;s Name
            </label>
            <input
              type="text"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter father's name"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-full">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.name} ({suggestion.father_dob})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Mother's Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Mother&apos;s Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={form.mother_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter mother's name"
            />
            {showMotherSuggestions && motherSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-full">
                {motherSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleMotherSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.mother_name} ({suggestion.mother_dob})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Father's DOB */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Father's DOB</label>
            <input
              type="date"
              name="father_dob"
              value={form.father_dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            />
          </div>

          {/* Mother's DOB */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">Mother's DOB</label>
            <input
              type="date"
              name="mother_dob"
              value={form.mother_dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            />
          </div>

          {/* Alive/Dead */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Alive/Dead
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
          </div>

          {/* Profession */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter profession"
            />
          </div>

          {/* Gender */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
            >
              <option value="Alive">Male</option>
              <option value="Dead">Female</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-center w-3/4">
            <button
              type="submit"
              className="bg-green-600 w-full mb-4 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditFormModal.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string,
    pusta_number: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    father_dob: PropTypes.string,
    mother_dob: PropTypes.string,
    status: PropTypes.string,
    profession: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditFormModal;
