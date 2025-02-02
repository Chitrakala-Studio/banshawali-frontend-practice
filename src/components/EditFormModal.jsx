import { useState } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(formData);
  const [suggestions, setSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMotherSuggestions, setShowMotherSuggestions] = useState(false);
  const [errors, setErrors] = useState({});

  const familyMembers = [
    {
      name: "Ram Bahadur",
      father_dob: "1970-05-15",
      mother_dob: "1975-06-25",
      pusta_number: "2",
      mother_name: "Sita Devi",
    },
    {
      name: "Shyam Lal",
      father_dob: "1965-11-20",
      mother_dob: "1970-01-10",
      pusta_number: "3",
      mother_name: "Radha Devi",
    },
    {
      name: "Hari Krishna",
      father_dob: "1975-02-10",
      mother_dob: "1980-04-05",
      pusta_number: "1",
      mother_name: "Gita Devi",
    },
    {
      name: "Gopal Prasad",
      father_dob: "1980-08-25",
      mother_dob: "1985-02-15",
      pusta_number: "2",
      mother_name: "Maya Devi",
    },
  ];

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
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a preview URL
      setForm((prevForm) => ({
        ...prevForm,
        profileImage: imageUrl, // Store the URL in form state
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "father_name" && value.trim()) {
      const adjustedPustaNumber = form.pusta_number - 1;
      fetchSuggestions(adjustedPustaNumber, value);
    } else if (name === "father_name" && !value.trim()) {
      setSuggestions([]);
    }

    if (name === "mother_name" && value.trim()) {
      const adjustedPustaNumber = form.pusta_number - 1;
      fetchMotherSuggestions(adjustedPustaNumber, value).then((results) => {
        setMotherSuggestions(results);
        setShowMotherSuggestions(true);
      });
    } else if (name === "mother_name" && !value.trim()) {
      setMotherSuggestions([]);
    }
  };

  const fetchSuggestions = async (adjustedPustaNumber, query) => {
    try {
      const results = await fetchFatherSuggestions(adjustedPustaNumber, query);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      father_name: suggestion.name,
      father_dob: suggestion.father_dob,
    }));
    setShowSuggestions(false);
  };

  const handleMotherSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      mother_name: suggestion.mother_name,
      mother_dob: suggestion.mother_dob,
    }));
    setShowMotherSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = [
      "pusta_number",
      "username",
      "gender",
      "dob",
      "status",
      "father_name",
      "mother_name",
      "vansha_status",
    ];

    requiredFields.forEach((field) => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = true;
      }
    });
    if (form.status === "Dead" && !form.death_date) {
      newErrors.death_date = true;
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill all required fields",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

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
      <div className="bg-gray-800 h-[600px] w-[700px] rounded-lg relative flex justify-center items-center overflow-y-scroll overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="sticky top-2 right-2 text-gray-700 font-bold text-2xl hover:text-red-500 "
          >
            {/* Circle with a cross */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="white"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 flex flex-col h-full w-full items-center "
        >
          {/* Profile Picture */}
          <div className="flex justify-center mt-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <label htmlFor="profileImage" className="cursor-pointer">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-3xl text-gray-500">+</span>
                )}
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="w-full">
            <h3 className="text-lg font-bold py-3 text-[#7091E6]">
              Personal Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Pusta Number
              </label>
              <input
                type="number"
                name="pusta_number"
                required
                value={form.pusta_number}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your Pusta Number"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Name
              </label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name (in English)"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Name
              </label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name (in Nepali)"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                required
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                required
                value={form.dob}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                required
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
              </select>
            </div>

            {form.status === "Dead" && (
              <div className="w-full">
                <label className="block text-sm font-medium text-[#7091E6]">
                  Date of Death
                </label>
                <input
                  type="date"
                  name="death_date"
                  value={form.death_date}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
            )}
          </div>

          {/* Family Information */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-bold py-3 text-[#7091E6]">
              Family Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Father's Name
              </label>
              <input
                type="text"
                name="father_name"
                required
                value={form.father_name}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter father's name"
              />
            </div>

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

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Mother's Name
              </label>
              <input
                type="text"
                name="mother_name"
                required
                value={form.mother_name}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter mother's name"
              />
            </div>

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
          <div className="w-full">
            <h3 className="text-lg font-semibold py-3 text-[#7091E6]">
              Vansha Status
            </h3>
            <label className="block text-sm font-medium text-[#7091E6]">
              Same Vansha
            </label>
            <select
              name="vansha_status"
              value={form.vansha_status}
              required
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Contact Information */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold py-3 text-[#7091E6]">
              Contact Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter email address"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold py-3 text-[#7091E6]">
              Professional Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Profession
              </label>
              <input
                type="text"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter profession"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="mb-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
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
    gender: PropTypes.string,
    dob: PropTypes.string,
    status: PropTypes.string,
    death_date: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    profession: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditFormModal;
