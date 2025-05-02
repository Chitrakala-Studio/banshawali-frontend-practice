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

  const [suggestions, setSuggestions] = useState([]);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
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

          const data = Array.isArray(response.data.current_pusta_data)
            ? response.data.current_pusta_data
            : [];

          const validData = data.filter(
            (s) => s && typeof s.id === "number" && s.name
          );

          const fatherData = validData.filter((s) => {
            if (s.gender && typeof s.gender === "string") {
              return s.gender.toLowerCase() === "male";
            }
            const name = (s.name_in_nepali || s.name).toLowerCase();
            return (
              name.endsWith("नाथ") ||
              name.endsWith("प्रसाद") ||
              name.endsWith("कुमार") ||
              !name.endsWith("ा")
            );
          });

          const motherData = validData.filter((s) => {
            if (s.gender && typeof s.gender === "string") {
              return s.gender.toLowerCase() === "female";
            }
            const name = (s.name_in_nepali || s.name).toLowerCase();
            return (
              name.endsWith("ा") ||
              name.endsWith("कुमारी") ||
              name.endsWith("देवी")
            );
          });

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
              label: s.name_in_nepali || s.name,
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
              label: s.name_in_nepali || s.name,
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

          const vanshaStatus = data.same_vamsha_status
            ? String(data.same_vamsha_status) === "true"
              ? "True"
              : "False"
            : formData.vansha_status || "";

          const fatherName =
            data.father_name ||
            data.father?.name_in_nepali ||
            data.father?.name ||
            formData.father_name ||
            "";
          const motherName =
            data.mother_name ||
            data.mother?.name_in_nepali ||
            data.mother?.name ||
            formData.mother_name ||
            "";

          setForm({
            id: data.id || formData.id || null,
            pusta_number: data.pusta_number || formData.pusta_number || "",
            name: data.name || formData.name || "",
            name_in_nepali:
              data.name_in_nepali || formData.name_in_nepali || "",
            gender: data.gender || formData.gender || "",
            dob: data.date_of_birth || formData.dob || "",
            lifestatus: data.lifestatus || formData.lifestatus || "",
            death_date: data.date_of_death || formData.death_date || "",
            father_name: fatherName,
            father_id:
              data.father_id || (data.father?.id ?? formData.father_id) || null,
            mother_name: motherName,
            mother_id:
              data.mother_id || (data.mother?.id ?? formData.mother_id) || null,
            vansha_status: vanshaStatus,
            contact: {
              email:
                data.contact_details?.email || formData.contact?.email || "",
              phone:
                data.contact_details?.phone || formData.contact?.phone || "",
              address:
                data.contact_details?.address ||
                formData.contact?.address ||
                "",
            },
            profession: data.profession || formData.profession || "",
            profileImage: data.photo || formData.profileImage || "",
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
          handleBackendError(
            error,
            "Error fetching user data",
            "Failed to fetch user details. Using provided data."
          );
          setForm({
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
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [formData, API_URL]);

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
    <div className="edit-form-modal">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --gold-accent: #F49D37;
            --header-maroon: #800000;
            --neutral-gray: #D1D5DB;
          }

          .edit-form-modal {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
            backdrop-filter: blur(5px);
          }

          .modal-container {
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border: 2px solid var(--gold-accent);
            height: 600px;
            width: 700px;
            border-radius: 15px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .close-btn {
            position: absolute;
            right: 16px;
            top: 10px;
            color: var(--header-maroon);
            background-color: var(--gold-accent);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            cursor: pointer;
            z-index: 10;
          }

          .close-btn:hover,
          .close-btn:focus {
            background-color: #e68b2a;
            transform: scale(1.05);
            outline: none;
          }

          .close-btn svg {
            width: 24px;
            height: 24px;
            stroke: var(--header-maroon);
          }

          .form-content {
            height:inherit;
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 24px;
            gap: 16px;
          }

          .profile-image-container {
            display: flex;
            justify-content: center;
            margin-top: 16px;
          }

          .profile-image-label {
            cursor: pointer;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border: 2px solid var(--neutral-gray);
            transition: all 0.3s ease;
          }

          .profile-image-label:hover {
            background-color: #d1d5db;
          }

          .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }

          .placeholder-text {
            font-size: 32px;
            color: #6b7280;
          }

          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 600;
            color: var(--gold-accent);
            margin-top: 16px;
            margin-bottom: 8px;
          }

          .form-field {
            width: 100%;
          }

          .label {
            display: block;
            font-family: 'Merriweather', serif;
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-text);
            margin-bottom: 4px;
          }

          .input,
          .select {
            width: 100%;
            padding: 8px 12px;
            background: linear-gradient(to right, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            transition: all 0.3s ease;
          }

          .input:focus,
          .select:focus {
            outline: none;
            border-color: var(--gold-accent);
            box-shadow: 0 0 0 3px rgba(244, 157, 55, 0.2);
          }

          .translate-btn {
            display: flex;
            align-items: center;
            color: var(--gold-accent);
            padding: 8px 0;
            font-family: 'Merriweather', serif;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .translate-btn:hover,
          .translate-btn:focus {
            color: #e68b2a;
            transform: translateY(-1px);
            outline: none;
          }

          .translate-btn svg {
            width: 24px;
            height: 24px;
            margin-right: 4px;
          }

          .suggestions-list {
            position: absolute;
            z-index: 10;
            background: linear-gradient(to right, #fffaf0, #ffffff);
            border: 1px solid var(--neutral-gray);
            border-radius: 6px;
            margin-top: 4px;
            max-height: 160px;
            overflow-y: auto;
            width: 100%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .suggestion-item {
            padding: 8px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .suggestion-item:hover {
            background-color: #f3e8d7;
          }

          .submit-btn {
            margin: 16px 0;
            background-color: var(--header-maroon);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 6px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .submit-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .submit-btn:hover:not(:disabled),
          .submit-btn:focus:not(:disabled) {
            background-color: #9b1c1c;
            transform: scale(1.05);
            outline: none;
          }

          .loading-text {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
          }
        `}
      </style>
      
      <div className="modal-container">
        

        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="form-content">
            <div className="profile-image-container">
              <label htmlFor="profileImage" className="profile-image-label">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Profile"
                    className="profile-image"
                  />
                ) : (
                  <span className="placeholder-text">+</span>
                )}
              </label>
              <input
                type="file"
                id="profileImage"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="form-field">
              <h3 className="section-title">Personal Information</h3>

              <div className="form-field">
                <label className="label">Pusta Number</label>
                <input
                  type="number"
                  name="pusta_number"
                  required
                  value={form.pusta_number}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter Pusta Number"
                />
              </div>

              <div className="form-field">
                <label className="label">Name (in English)</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your name (in English)"
                />
                <button
                  type="button"
                  onClick={translateToNepali}
                  className="translate-btn"
                >
                  <FaArrowDown />
                  <span>Translate</span>
                </button>
              </div>

              <div className="form-field">
                <label className="label">Name (in Nepali)</label>
                <input
                  type="text"
                  name="name_in_nepali"
                  value={form.name_in_nepali}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your name (in Nepali)"
                />
              </div>

              <div className="form-field">
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  required
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-field">
                <label className="label">Date of Birth</label>
                <NepaliDatePicker
                  inputClassName="input"
                  value={form.dob}
                  onChange={handleDateChange}
                  options={{
                    calenderLocale: "ne",
                    valueLocale: "en",
                    placeholder: "Select Date",
                  }}
                />
              </div>

              <div className="form-field">
                <label className="label">Status</label>
                <select
                  name="lifestatus"
                  value={form.lifestatus}
                  required
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Select Status</option>
                  <option value="Alive">Alive</option>
                  <option value="Dead">Dead</option>
                </select>
              </div>

              {form.lifestatus === "Dead" && (
                <div className="form-field">
                  <label className="label">Date of Death</label>
                  <NepaliDatePicker
                    inputClassName="input"
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

            <div className="form-field">
              <h3 className="section-title">Family Information</h3>

              <div className="form-field relative">
                <label className="label">Father Name</label>
                <select
                  ref={fatherInputRef}
                  name="father_name"
                  className="select"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul
                    className="suggestions-list"
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
                        className="suggestion-item"
                      >
                        {suggestion.name_in_nepali || suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-field relative">
                <label className="label">Mother Name</label>
                <select
                  ref={motherInputRef}
                  name="mother_name"
                  className="select"
                />
                {showMotherSuggestions && motherSuggestions.length > 0 && (
                  <ul
                    className="suggestions-list"
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
                        className="suggestion-item"
                      >
                        {suggestion.name_in_nepali || suggestion.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="form-field">
              <h3 className="section-title">Vansha Status</h3>
              <label className="label">Same Vansha</label>
              <select
                name="vansha_status"
                value={form.vansha_status}
                required
                onChange={handleChange}
                className="select"
              >
                <option value="">Select Vansha Status</option>
                <option value="True">Yes</option>
                <option value="False">No</option>
              </select>
            </div>

            <div className="form-field">
              <h3 className="section-title">Contact Information</h3>

              <div className="form-field">
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.contact.email}
                  onChange={handleContactChange}
                  className="input"
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-field">
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.contact.phone}
                  onChange={handleContactChange}
                  className="input"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-field">
                <label className="label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.contact.address}
                  onChange={handleContactChange}
                  className="input"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="form-field">
              <h3 className="section-title">Professional Information</h3>

              <div className="form-field">
                <label className="label">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter profession"
                />
              </div>
            </div>

            <div className="flex justify-center w-full">
              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
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