import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";
import Sanscript from "sanscript";
import handleBackendError from "./handleBackendError";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(() => ({
    id: formData.id || null,
    pusta_number: formData.pusta_number || "",
    name: formData.name || "",
    name_in_nepali: formData.name_in_nepali || "",
    gender: formData.gender || "",
    dob: formData.dob || "",
    lifestatus: formData.lifestatus || "",
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

  const [suggestions, setSuggestions] = useState([]); // Father suggestions
  const [motherSuggestions, setMotherSuggestions] = useState([]); // Mother suggestions
  const fatherInputRef = useRef(null);
  const motherInputRef = useRef(null);
  const fatherChoicesInstance = useRef(null);
  const motherChoicesInstance = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMotherSuggestions, setShowMotherSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dc1gouxxw";
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "banshawali";
  const API_URL = import.meta.env.VITE_API_URL;

  const today = new Date().toISOString().split("T")[0];
  const hideFatherSuggestionsTimeout = useRef(null);
  const hideMotherSuggestionsTimeout = useRef(null);

  // Handle mouse events for father suggestions
  const handleFatherMouseEnter = () => {
    if (hideFatherSuggestionsTimeout.current) {
      clearTimeout(hideFatherSuggestionsTimeout.current);
    }
    setShowSuggestions(true);
  };

  const handleFatherMouseLeave = () => {
    hideFatherSuggestionsTimeout.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle mouse events for mother suggestions
  const handleMotherMouseEnter = () => {
    if (hideMotherSuggestionsTimeout.current) {
      clearTimeout(hideMotherSuggestionsTimeout.current);
    }
    setShowMotherSuggestions(true);
  };

  const handleMotherMouseLeave = () => {
    hideMotherSuggestionsTimeout.current = setTimeout(() => {
      setShowMotherSuggestions(false);
    }, 200);
  };

  // Fetch suggestions for father (males) and mother (females) from previous pusta
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (
        form.pusta_number &&
        !isNaN(form.pusta_number) &&
        form.pusta_number > 1
      ) {
        const prevPusta = parseInt(form.pusta_number, 10) - 1;
        try {
          const response = await axios.get(
            `${API_URL}/people/people/familyrelations?pusta_number=${prevPusta}`,
            { headers: { "Content-Type": "application/json" } }
          );

          // Log response for debugging
          console.log("Family Relations Response:", response.data);

          // Normalize response data
          const data = Array.isArray(response.data.current_pusta_data)
            ? response.data.current_pusta_data
            : [];

          // Log invalid entries (missing id or name)
          const invalidEntries = data.filter(
            (s) => !s || typeof s.id !== "number" || !s.name
          );
          if (invalidEntries.length > 0) {
            console.warn(
              `Found ${invalidEntries.length} invalid entries in current_pusta_data:`,
              invalidEntries
            );
          }

          // Filter valid entries
          const validData = data.filter(
            (s) => s && typeof s.id === "number" && s.name
          );

          // Log entries with missing gender
          const missingGenderEntries = validData.filter(
            (s) => s.gender === undefined || s.gender === null
          );
          if (missingGenderEntries.length > 0) {
            console.warn(
              `Found ${missingGenderEntries.length} entries with missing gender:`,
              missingGenderEntries
            );
          }

          // Infer gender based on name patterns
          const fatherData = validData.filter((s) => {
            if (s.gender && typeof s.gender === "string") {
              return s.gender.toLowerCase() === "male";
            }
            // Heuristic: Male names often end in 'नाथ', 'प्रसाद', 'कुमार', or consonants
            const name = (s.name_in_nepali || s.name).toLowerCase();
            const isLikelyMale =
              name.endsWith("नाथ") ||
              name.endsWith("प्रसाद") ||
              name.endsWith("कुमार") ||
              !name.endsWith("ा");
            if (!isLikelyMale) {
              console.warn(`Assuming non-male for father:`, s);
            }
            return isLikelyMale;
          });

          const motherData = validData.filter((s) => {
            if (s.gender && typeof s.gender === "string") {
              return s.gender.toLowerCase() === "female";
            }
            // Heuristic: Female names often end in 'ा', 'कुमारी', 'देवी'
            const name = (s.name_in_nepali || s.name).toLowerCase();
            const isLikelyFemale =
              name.endsWith("ा") ||
              name.endsWith("कुमारी") ||
              name.endsWith("देवी");
            if (!isLikelyFemale) {
              console.warn(`Assuming non-female for mother:`, s);
            }
            return isLikelyFemale;
          });

          console.log("Filtered Father Data:", fatherData);
          console.log("Filtered Mother Data:", motherData);

          setSuggestions(fatherData);
          setMotherSuggestions(motherData);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setMotherSuggestions([]);
          Swal.fire("Error", "Failed to fetch family members.", "error");
        }
      } else {
        setSuggestions([]);
        setMotherSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [form.pusta_number, API_URL]);

  // Initialize Choices.js for father dropdown
  useEffect(() => {
    if (fatherInputRef.current) {
      if (!fatherChoicesInstance.current) {
        fatherChoicesInstance.current = new Choices(fatherInputRef.current, {
          removeItemButton: true,
          shouldSort: false,
          searchEnabled: true,
          noResultsText: "No males found in previous generation",
          placeholder: true,
          placeholderValue: "Select Father",
          searchPlaceholderValue: "Search for a father",
          searchFields: ["label", "customProperties.name_in_nepali"],
        });
      }

      const choicesData = [
        { value: "", label: "Select Father", disabled: true },
        ...(suggestions.length > 0
          ? suggestions.map((s) => ({
              value: s.id.toString(),
              label: s.name_in_nepali || s.name, // Show only person's name
              selected: s.id === form.father_id,
              customProperties: {
                id: s.id,
                name_in_nepali: s.name_in_nepali || "",
              },
            }))
          : []),
      ];

      fatherChoicesInstance.current.setChoices(
        choicesData,
        "value",
        "label",
        true
      );

      fatherInputRef.current.addEventListener("search", (event) => {
        const searchTerm = event.detail.value.toLowerCase();
        setShowSuggestions(!!searchTerm);
      });

      fatherInputRef.current.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        const selected = suggestions.find(
          (s) => s.id.toString() === selectedId
        );
        setForm((prev) => ({
          ...prev,
          father_id: selected ? selected.id : null,
          father_name: selected ? selected.name_in_nepali || selected.name : "",
        }));
        setShowSuggestions(false);
      });

      return () => {
        if (fatherChoicesInstance.current) {
          fatherChoicesInstance.current.destroy();
          fatherChoicesInstance.current = null;
        }
      };
    }
  }, [suggestions, form.father_id]);

  // Initialize Choices.js for mother dropdown
  useEffect(() => {
    if (motherInputRef.current) {
      if (!motherChoicesInstance.current) {
        motherChoicesInstance.current = new Choices(motherInputRef.current, {
          removeItemButton: true,
          shouldSort: false,
          searchEnabled: true,
          noResultsText: "No females found in previous generation",
          placeholder: true,
          placeholderValue: "Select Mother",
          searchPlaceholderValue: "Search for a mother",
          searchFields: ["label", "customProperties.name_in_nepali"],
        });
      }

      const choicesData = [
        { value: "", label: "Select Mother", disabled: true },
        ...(motherSuggestions.length > 0
          ? motherSuggestions.map((s) => ({
              value: s.id.toString(),
              label: s.name_in_nepali || s.name, // Show only person's name
              selected: s.id === form.mother_id,
              customProperties: {
                id: s.id,
                name_in_nepali: s.name_in_nepali || "",
              },
            }))
          : []),
      ];

      motherChoicesInstance.current.setChoices(
        choicesData,
        "value",
        "label",
        true
      );

      motherInputRef.current.addEventListener("search", (event) => {
        const searchTerm = event.detail.value.toLowerCase();
        setShowMotherSuggestions(!!searchTerm);
      });

      motherInputRef.current.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        const selected = motherSuggestions.find(
          (s) => s.id.toString() === selectedId
        );
        setForm((prev) => ({
          ...prev,
          mother_id: selected ? selected.id : null,
          mother_name: selected ? selected.name_in_nepali || selected.name : "",
        }));
        setShowMotherSuggestions(false);
      });

      return () => {
        if (motherChoicesInstance.current) {
          motherChoicesInstance.current.destroy();
          motherChoicesInstance.current = null;
        }
      };
    }
  }, [motherSuggestions, form.mother_id]);

  // Fetch user details for edit mode
  useEffect(() => {
    if (formData.id) {
      const fetchUserDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `${API_URL}/people/${formData.id}/`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const data = response.data;
          setForm({
            id: data.id || null,
            pusta_number: data.pusta_number || "",
            name: data.name || "",
            name_in_nepali: data.name_in_nepali || "",
            gender: data.gender || "",
            dob: data.date_of_birth || "",
            lifestatus: data.lifestatus || "",
            death_date: data.date_of_death || "",
            father_name: data.father_name || "",
            father_id: data.father_id || null,
            mother_name: data.mother_name || "",
            mother_id: data.mother_id || null,
            vansha_status: data.same_vamsha_status || "",
            contact: {
              email: data.contact_details?.email || "",
              phone: data.contact_details?.phone || "",
              address: data.contact_details?.address || "",
            },
            profession: data.profession || "",
            profileImage: data.photo || "",
          });
        } catch (error) {
          handleBackendError(
            error,
            "Error fetching user data",
            "Failed to fetch user details."
          );
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [formData.id, API_URL]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setForm((prevForm) => ({
      ...prevForm,
      profileImage: previewUrl,
    }));

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );
      const cloudinaryUrl = response.data.secure_url;
      setForm((prevForm) => ({
        ...prevForm,
        profileImage: cloudinaryUrl,
      }));
    } catch (error) {
      handleBackendError(
        error,
        "Error uploading image",
        "Failed to upload image."
      );
    }
  };

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

  const handleDateChange = (value) => {
    const selectedDate = new Date(value);
    const todayDate = new Date(today);

    if (selectedDate <= todayDate) {
      setForm((prevForm) => ({
        ...prevForm,
        dob: value || "",
      }));
    } else {
      Swal.fire("Error", "Please select a date before or on today.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const translateToNepali = async () => {
    try {
      const text = form.name.toLowerCase();
      const convertedtext = Sanscript.t(text, "itrans", "devanagari");
      setForm((prevForm) => ({
        ...prevForm,
        name_in_nepali: convertedtext,
      }));
    } catch (error) {
      Swal.fire("Error", "Failed to convert text", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name || !form.pusta_number || !form.gender || !form.lifestatus) {
      Swal.fire(
        "Error",
        "Please fill in all required fields: Name, Pusta Number, Gender, Status.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name || "",
        name_in_nepali: form.name_in_nepali || "",
        pusta_number: form.pusta_number || "",
        contact_details: {
          email: form.contact?.email || "",
          phone: form.contact?.phone || "",
          address: form.contact?.address || "",
        },
        father_id: form.father_id || null,
        mother_id: form.mother_id || null,
        date_of_birth: form.dob || null,
        lifestatus: form.lifestatus || "",
        date_of_death: form.death_date || null,
        photo: form.profileImage || "",
        profession: form.profession || "",
        gender: form.gender || "",
        same_vamsha_status: form.vansha_status || "",
      };

      const response = form.id
        ? await axios.put(`${API_URL}/people/${form.id}/`, payload)
        : await axios.post(`${API_URL}/people/people/`, payload);

      onSave(response.data);
      Swal.fire("Saved!", "Your changes have been saved.", "success");
      onClose();
    } catch (error) {
      handleBackendError(error, "Failed to save", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-[#14632f] h-[600px] w-[700px] rounded-lg relative flex justify-center items-center overflow-y-scroll overflow-hidden">
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="sticky top-2 right-2 text-white font-bold text-2xl hover:text-red-500"
          >
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

          <div className="w-full">
            <h3 className="text-lg font-bold py-3 text-[#f49D37]">
              Personal Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
                Pusta Number
              </label>
              <input
                type="number"
                name="pusta_number"
                required
                value={form.pusta_number}
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter Pusta Number"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
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
                className="flex items-center text-[#f49D37] p-5"
              >
                <FaArrowDown size={24} />
                <span className="ml-1 text-[#f49D37]">Translate</span>
              </button>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
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
              <label className="block text-sm font-medium text-[#f49D37]">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                required
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm pt-3 font-medium text-[#f49D37]">
                Date of Birth
              </label>
              <NepaliDatePicker
                inputClassName="form-control"
                value={form.dob}
                onChange={handleDateChange}
                options={{
                  calenderLocale: "ne",
                  valueLocale: "en",
                  placeholder: "Select Date",
                }}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
                Status
              </label>
              <select
                name="lifestatus"
                value={form.lifestatus}
                required
                onChange={handleChange}
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select Status</option>
                <option value="Alive">Alive</option>
                <option value="Dead">Dead</option>
              </select>
            </div>

            {form.lifestatus === "Dead" && (
              <div className="w-full">
                <label className="block text-sm pt-3 font-medium text-[#f49D37]">
                  Date of Death
                </label>
                <NepaliDatePicker
                  inputClassName="form-control"
                  value={form.death_date}
                  onChange={(value) => {
                    setForm((prevForm) => ({
                      ...prevForm,
                      death_date: value || "",
                    }));
                  }}
                  options={{
                    calenderLocale: "ne",
                    valueLocale: "en",
                    minDate: form.dob || "",
                    maxDate: today,
                  }}
                />
              </div>
            )}
          </div>

          <div className="w-full mt-4">
            <h3 className="text-lg font-bold py-3 text-[#f49D37]">
              Family Information
            </h3>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#f49D37]">
              Father Name
            </label>
            <div className="relative">
              <select
                ref={fatherInputRef}
                name="father_name"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul
                  className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-full"
                  onMouseEnter={handleFatherMouseEnter}
                  onMouseLeave={handleFatherMouseLeave}
                >
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setForm((prev) => ({
                          ...prev,
                          father_name:
                            suggestion.name_in_nepali || suggestion.name,
                          father_id: suggestion.id,
                        }));
                        setShowSuggestions(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name_in_nepali || suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-[#f49D37]">
              Mother Name
            </label>
            <div className="relative">
              <select
                ref={motherInputRef}
                name="mother_name"
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {showMotherSuggestions && motherSuggestions.length > 0 && (
                <ul
                  className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto w-full"
                  onMouseEnter={handleMotherMouseEnter}
                  onMouseLeave={handleMotherMouseLeave}
                >
                  {motherSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setForm((prev) => ({
                          ...prev,
                          mother_name:
                            suggestion.name_in_nepali || suggestion.name,
                          mother_id: suggestion.id,
                        }));
                        setShowMotherSuggestions(false);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name_in_nepali || suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-lg font-semibold py-3 text-[#f49D37]">
              Vansha Status
            </h3>
            <label className="block text-sm font-medium text-[#f49D37]">
              Same Vansha
            </label>
            <select
              name="vansha_status"
              value={form.vansha_status}
              required
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Select Vansha Status</option>
              <option value="True">Yes</option>
              <option value="False">No</option>
            </select>
          </div>

          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold py-3 text-[#f49D37]">
              Contact Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.contact.email}
                onChange={handleContactChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter email address"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.contact.phone}
                onChange={handleContactChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter phone number"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.contact.address}
                onChange={handleContactChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold py-3 text-[#f49D37]">
              Professional Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
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

          <div className="flex justify-center w-full mb-8">
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 mb-4 bg-[#800000] text-white px-4 py-2 rounded-md ${
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
    lifestatus: PropTypes.string,
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
