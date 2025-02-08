import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import axios from "axios";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(() => ({
    pusta_number: formData.pusta_number || "",
    username: formData.username || "",
    usernameNepali: "",
    gender: formData.gender || "",
    dob: formData.dob || "",
    status: formData.status || "",
    death_date: formData.death_date || "",
    father_name: formData.father_name || "",
    father_dob: formData.father_dob || "",
    mother_name: formData.mother_name || "",
    mother_dob: formData.mother_dob || "",
    vansha_status: formData.vansha_status || "",
    contact: {
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
    },
    profession: formData.profession || "",
    profileImage: formData.profileImage || "",
  }));

  const [suggestions, setSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMotherSuggestions, setShowMotherSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(formData);
  }, [formData]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/user/${formData.id}`
      );
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.id) {
      fetchUserDetails();
    }
  }, [formData.id]);

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
      }, 500);
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

  const translateToNepali = async () => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${encodeURIComponent(
          form.username
        )}`
      );
      const data = await response.json();

      const translatedText = data[0].map((t) => t[0]).join("");

      setForm((prevForm) => ({
        ...prevForm,
        usernameNepali: translatedText,
      }));
    } catch (error) {
      console.error("Translation error:", error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/people/`, {
        name: form.username,
        name_in_nepali: form.username,
        pusta_number: form.pusta_number,
        contact_details: JSON.stringify(form.contact),
        father_name: form.father_name,
        father_dob: form.father_dob,
        mother: form.mother_name,
        date_of_birth: form.dob,
        status: form.status,
        date_of_death: form.death_date,
        photo: form.profileImage,
        profession: form.profession,
        gender: form.gender,
        same_vamsha_status: form.vansha_status,
      });
      onSave(response.data);
      Swal.fire("Saved!", "Your changes have been saved.", "success");
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to save",
        text: error.response?.data?.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-gray-800 h-[600px] w-[700px] rounded-lg relative flex justify-center items-center overflow-y-scroll overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="sticky top-2 right-2 text-white font-bold text-2xl hover:text-red-500 "
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
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              <label
                htmlFor="profileImage"
                className="cursor-pointer w-full h-full flex items-center justify-center"
              >
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover" // This ensures the image fills the container, maintaining aspect ratio
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
                type="string"
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
                Name (in English)
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
              <button
                type="button"
                onClick={translateToNepali}
                className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Translate to Nepali
              </button>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Name (in Nepali)
              </label>
              <input
                type="text"
                name="usernameNepali"
                value={form.usernameNepali}
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
              <label className="block text-sm pt-3 font-medium text-[#7091E6]">
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
                <label className="block text-sm  pt-3 font-medium text-[#7091E6]">
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
                type="string"
                name="father_name"
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
                type="string"
                name="mother_name"
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
                type="string"
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
    id: PropTypes.number,
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
