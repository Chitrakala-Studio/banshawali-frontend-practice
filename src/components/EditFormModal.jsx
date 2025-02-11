import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(() => ({
    id: formData.id || null,
    pusta_number: formData.pusta_number || "",
    name: formData.name || "",
    name_in_nepali: formData.name_in_nepali || "",
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
      email: formData.contact?.email || "",
      phone: formData.contact?.phone || "",
      address: formData.contact?.address || "",
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
  const [familyMembers, setFamilyMembers] = useState([]);

  // setFamilyMembers(formData.familyData);
  // // const [familyMembers, setFamilyMembers] = useState([]);

  // useEffect(() => {
  //   setForm(formData);
  // }, [formData]);

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

  // useEffect(() => {
  //   if (formData.id) {
  //     fetchUserDetails();
  //   }
  // }, [formData.id]);

  const fetchFamilyMembers = async () => {
    try {
      const response = await fetch(`https://gautamfamily.org.np/people/`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching family members:", error);
    }
  };

  // useEffect(() => {
  //   fetchFamilyMembers().then((data) => setFamilyMembers(data));
  // }, []);

  const fetchFatherSuggestions = (parentGeneration, query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = familyMembers.filter((member) => {
          const isRightGeneration =
            member.pusta_number === parentGeneration.toString();
          const matchesQuery =
            query.trim() === "" ||
            member.name.toLowerCase().includes(query.toLowerCase());
          return isRightGeneration && matchesQuery;
        });
        resolve(suggestions);
      }, 500);
    });
  };
  useEffect(() => {
    // Update form only if it has changed
    setForm((prevForm) =>
      JSON.stringify(prevForm) !== JSON.stringify(formData) ? formData : prevForm
    );
  
    // Update family members only if new data is available
    if (formData.familyData) {
      setFamilyMembers(formData.familyData);
    }
  
    // Fetch user details only if formData has an ID
    if (formData.id) {
      const fetchUserDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/user/${formData.id}`);
          setForm(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserDetails();
    }
  
    // Fetch family members only if it's not already set
    if (!familyMembers.length) {
      const fetchFamilyMembers = async () => {
        try {
          const response = await fetch(`https://gautamfamily.org.np/people/`);
          const data = await response.json();
          setFamilyMembers(data);
        } catch (error) {
          console.error("Error fetching family members:", error);
        }
      };
  
      fetchFamilyMembers();
    }
  }, [formData, familyMembers.length]);
  
  const fetchMotherSuggestions = (parentGeneration, query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = familyMembers.filter((member) => {
          const isRightGeneration =
            member.pusta_number === parentGeneration.toString();
          const matchesQuery =
            query.trim() === "" ||
            member.name.toLowerCase().includes(query.toLowerCase());
          return isRightGeneration && matchesQuery;
        });
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

  // Use this handler to update the nested contact object
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value,
      },
    }));
  };

  // This handler updates other form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    const parentGeneration = form.pusta_number - 1;

    if (name === "father_name") {
      fetchFatherSuggestions(parentGeneration, value)
        .then((results) => {
          setSuggestions(results);
          setShowSuggestions(true);
        })
        .catch((error) =>
          console.error("Error fetching father suggestions:", error)
        );
    }

    if (name === "mother_name") {
      fetchMotherSuggestions(parentGeneration, value)
        .then((results) => {
          setMotherSuggestions(results);
          setShowMotherSuggestions(true);
        })
        .catch((error) =>
          console.error("Error fetching mother suggestions:", error)
        );
    }
  };

  const translateToNepali = async () => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ne&dt=t&q=${encodeURIComponent(
          form.name
        )}`
      );
      const data = await response.json();

      const translatedText = data[0].map((t) => t[0]).join("");

      setForm((prevForm) => ({
        ...prevForm,
        name_in_nepali: translatedText,
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

    if (loading) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        name_in_nepali: form.name_in_nepali,
        pusta_number: form.pusta_number,
        contact_details: form.contact,
        father_name: form.father_name,
        father_dob: form.father_dob,
        mother_name: form.mother_name, // Use 'mother_name' for clarity
        mother_dob: form.mother_dob, // Added mother's date of birth
        date_of_birth: form.dob,
        status: form.status,
        date_of_death: form.death_date,
        photo: form.profileImage,
        profession: form.profession,
        gender: form.gender,
        same_vamsha_status: form.vansha_status,
      };

      const response = form.id
        ? await axios.put(
            `https://gautamfamily.org.np/people/${form.id}/`,
            payload
          )
        : await axios.post(`https://gautamfamily.org.np/people/`, payload);

      onSave(response.data);
      Swal.fire("Saved!", "Your changes have been saved.", "success");
      onClose();
      window.location.reload();
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
            className="sticky top-2 right-2 text-white font-bold text-2xl hover:text-red-500"
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
          className="space-y-4 flex flex-col h-full w-full items-center"
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
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
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
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your name (in English)"
              />
              <button
                type="button"
                onClick={translateToNepali}
                className="flex items-center text-[#7091E6] p-5"
              >
                <FaArrowDown size={24} />
                <span className="ml-1 text-[#7091E6]">Translate</span>
              </button>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#7091E6]">
                Name (in Nepali)
              </label>
              <input
                type="text"
                name="name_in_nepali"
                value={form.name_in_nepali}
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
                <label className="block text-sm pt-3 font-medium text-[#7091E6]">
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

            <input
              type="text"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              onFocus={() => {
                const parentGeneration = form.pusta_number - 1;
                // Fetch suggestions with an empty query to display all names from the parent generation
                fetchFatherSuggestions(parentGeneration, "")
                  .then((results) => {
                    setSuggestions(results);
                    setShowSuggestions(true);
                  })
                  .catch((error) =>
                    console.error("Error fetching father suggestions:", error)
                  );
              }}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    {suggestion.name}
                    {suggestion.father_dob && `(${suggestion.father_dob})`}
                  </li>
                ))}
              </ul>
            )}

            <input
              type="text"
              name="mother_name"
              value={form.mother_name}
              onChange={handleChange}
              onFocus={() => {
                const parentGeneration = form.pusta_number - 1;
                fetchMotherSuggestions(parentGeneration, "")
                  .then((results) => {
                    setMotherSuggestions(results);
                    setShowMotherSuggestions(true);
                  })
                  .catch((error) =>
                    console.error("Error fetching mother suggestions:", error)
                  );
              }}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    {suggestion.mother_name}{" "}
                    {suggestion.mother_dob && `(${suggestion.mother_dob})`}
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
                value={form.contact?.email || ""}
                onChange={handleContactChange}
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
                value={form.contact?.phone || ""}
                onChange={handleContactChange}
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
                value={form.contact?.address || ""}
                onChange={handleContactChange}
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
              disabled={loading}
              className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditFormModal.propTypes = {
  formData: PropTypes.shape({
    familyData: PropTypes.array,
    id: PropTypes.number,
    name: PropTypes.string,
    name_in_nepali: PropTypes.string,
    gender: PropTypes.string,
    dob: PropTypes.string,
    status: PropTypes.string,
    death_date: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    profession: PropTypes.string,
    contact_details: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditFormModal;
