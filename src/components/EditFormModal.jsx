import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";
import qs from "qs";
import Sanscript from "sanscript";

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
    father_id: formData.father_id || null,
    mother_name: formData.mother_name || "",
    mother_id: formData.mother_id || null,
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

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dc1gouxxw";
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "banshawali";

  
  const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
      // Fetch suggestions when pusta_number changes
      const fetchSuggestions = async () => {
        if (form.pusta_number) {
          try {
            const response = await axios.get(
              `https://gautamfamily.org.np/people/familyrelations?pusta_number=${form.pusta_number}`
            );
            console.log(response.data);
            console.log(response.data.father_pusta);
            const fatherSuggestions = response.data.father_pusta;
            const motherSuggestions = response.data.mother_pusta;
  
            setSuggestions(fatherSuggestions);
            setMotherSuggestions(motherSuggestions);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
          }
        }
      };
  
      fetchSuggestions();
    }, [form.id, form.pusta_number]);

  const handleSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      father_name: suggestion.name,
      father_id: suggestion.id,
    }));
    setShowSuggestions(false);
  };

  const handleMotherSuggestionClick = (suggestion) => {
    setForm((prev) => ({
      ...prev,
      mother_name: suggestion.name,
      mother_id: suggestion.id,
    }));
    setShowMotherSuggestions(false);
  };


  useEffect(() => {
    // Update form only if it has changed
    setForm((prevForm) =>
      JSON.stringify(prevForm) !== JSON.stringify(formData)
        ? formData
        : prevForm
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
          const response = await axios.get(
            `https://gautamfamily.org.np/people/${formData.id}`
          );
          const data = response.data;
          // Transform the data: assign contact_details to contact
          const transformedData = {
            ...data,
            contact: data.contact_details || {
              email: "",
              phone: "",
              address: "",
            },
          };
          setForm(transformedData);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. (Optional) Local preview
    const previewUrl = URL.createObjectURL(file);
    setForm((prevForm) => ({
      ...prevForm,
      profileImage: previewUrl,
    }));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);

    console.log("Uploading with preset:", preset);
    console.log("Using cloud name:", cloudName);

    try {
      // 3. Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );
      console.log("Cloudinary response:", response.data);
      // 4. Replace preview URL with the Cloudinary URL
      const cloudinaryUrl = response.data.secure_url;
      setForm((prevForm) => ({
        ...prevForm,
        profileImage: cloudinaryUrl,
      }));
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
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
      setForm((prev) => ({
        ...prev,
        father_id: null,
      }));
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
      setForm((prev) => ({
        ...prev,
        mother_id: null,
      }));
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
      const text = form.name.toLowerCase();
      const convertedtext = Sanscript.t(text, "itrans", "devanagari");
      console.log(convertedtext);
      setForm((prevForm) => ({
        ...prevForm,
        name_in_nepali: convertedtext,
      }));
    } catch (error) {
      console.error("Error converting text:", error);
      // Optionally display an error message to the user
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to convert text",
      });
    }
}

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
        father_name: form.father_id ? form.father_id : form.father_name,
        mother_name: form.mother_id ? form.mother_id : form.mother_name,
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
                max={today}
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
                  min={form.dob}
                  max={today}
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
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 200);
              }}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter father's name"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-8/12"
                style={{ left: "10%" }} // optional: adjust position to center relative to input if needed
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.name}
                    {suggestion.father && `- ${suggestion.father}`}
                    {suggestion.father?.father && ` - ${suggestion.father.father_dob} `}
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
                setShowMotherSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowMotherSuggestions(false);
                }, 200);
              }}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter mother's name"
            />

            {showMotherSuggestions && motherSuggestions.length > 0 && (
              <ul
                className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-8/12"
                style={{ left: "4%" }} // adjust as needed
              >
                {motherSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleMotherSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion.name}
                    {suggestion.father && `- ${suggestion.father}`}
                    {suggestion.father?.father && ` - ${suggestion.father.father_dob} `}
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
              <option value="True">Yes</option>
              <option value="False">No</option>
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
          <div className="flex justify-center w-full mb-4">
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
    contact: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditFormModal;
