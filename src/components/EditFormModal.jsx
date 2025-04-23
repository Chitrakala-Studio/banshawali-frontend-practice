import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { FaArrowDown } from "react-icons/fa";
import axios from "axios";
import Sanscript from "sanscript";
import handleBackendError from "./handleBackendError";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { style } from "d3-selection";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(() => ({
    id: formData.id || null,
    pusta_number: formData.pusta_number || "",
    name: formData.name || "",
    name_in_nepali: formData.name_in_nepali || "",
    gender: formData.gender || "",
    dob: formData.dob || null,
    lifestatus: formData.lifestatus || "",
    death_date: formData.death_date || null,
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
  const fatherInputRef = useRef(null);
  const motherInputRef = useRef(null);
  const fatherChoicesInstance = useRef(null);
  const motherChoicesInstance = useRef(null);
  const [motherSuggestions, setMotherSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMotherSuggestions, setShowMotherSuggestions] = useState(false);
  //const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [date, setDate] = useState("");
  const debounceTimeout = useRef(null);
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dc1gouxxw";
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "banshawali";
  const API_URL = import.meta.env.VITE_API_URL;

  const today = new Date().toISOString().split("T")[0];
  const hideFatherSuggestionsTimeout = useRef(null);
  const hideMotherSuggestionsTimeout = useRef(null);

  // const todayNepali = new NepaliDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).toObject();

  // For father suggestions
  const handleFatherMouseEnter = () => {
    if (hideFatherSuggestionsTimeout.current) {
      clearTimeout(hideFatherSuggestionsTimeout.current);
    }
    setShowSuggestions(true);
  };

  const handleFatherMouseLeave = () => {
    hideFatherSuggestionsTimeout.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 200); // Adjust the delay as needed
  };

  // For mother suggestions
  const handleMotherMouseEnter = () => {
    if (hideMotherSuggestionsTimeout.current) {
      clearTimeout(hideMotherSuggestionsTimeout.current);
    }
    setShowMotherSuggestions(true);
  };

  const handleMotherMouseLeave = () => {
    hideMotherSuggestionsTimeout.current = setTimeout(() => {
      setShowMotherSuggestions(false);
    }, 200); // Adjust the delay as needed
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (form.pusta_number) {
        try {
          const response = await axios.get(
            `${API_URL}/people/people/familyrelations?pusta_number=${form.pusta_number}`,
            { headers: { "Content-Type": "application/json" } }
          );
          setSuggestions(response.data.father_pusta || []);
          setMotherSuggestions(response.data.mother_pusta || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
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
          noResultsText: "Not available",
          placeholder: true,
          placeholderValue: "Select Father",
          searchPlaceholderValue: "Search for a father",
        });
      }

      const choicesData = [
        { value: "", label: "Select Father", disabled: true },
        ...suggestions
          .filter((s) => s && s.id !== undefined)
          .map((s) => ({
            value: s.id.toString(),
            label: s.name,
            selected: s.id === form.father_id,
            customProperties: { id: s.id },
          })),
      ];

      fatherChoicesInstance.current.setChoices(
        choicesData,
        "value",
        "label",
        true
      );

      // Listen for search event to show suggestions
      fatherInputRef.current.addEventListener("search", (event) => {
        const searchTerm = event.detail.value.toLowerCase();
        setShowSuggestions(!!searchTerm);
      });

      // Listen for changes
      fatherInputRef.current.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        const selected = suggestions.find(
          (s) => s.id.toString() === selectedId
        );
        setForm((prev) => ({
          ...prev,
          father_id: selected ? selected.id : null,
          father_name: selected ? selected.name : "",
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
          noResultsText: "Not available",
          placeholder: true,
          placeholderValue: "Select Mother",
          searchPlaceholderValue: "Search for a mother",
        });
      }

      const choicesData = [
        { value: "", label: "Select Mother", disabled: true },
        ...motherSuggestions.map((s) => ({
          value: s.id.toString(),
          label: s.name,
          selected: s.id === form.mother_id,
          customProperties: { id: s.id },
        })),
      ];

      motherChoicesInstance.current.setChoices(
        choicesData,
        "value",
        "label",
        true
      );

      // Listen for search event to show suggestions
      motherInputRef.current.addEventListener("search", (event) => {
        const searchTerm = event.detail.value.toLowerCase();
        setShowMotherSuggestions(!!searchTerm);
      });

      // Listen for changes
      motherInputRef.current.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        const selected = motherSuggestions.find(
          (s) => s.id.toString() === selectedId
        );
        setForm((prev) => ({
          ...prev,
          mother_id: selected ? selected.id : null,
          mother_name: selected ? selected.name : "",
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

  // useEffect(() => {
  //   if (motherInputRef.current) {
  //     const motherChoices = new Choices(motherInputRef.current, {
  //       removeItemButton: true,
  //       shouldSort: false,
  //       searchEnabled: true,
  //       noResultsText: "Not available",
  //       placeholder: true,
  //       placeholderValue: "Select Mother",
  //     });

  //     motherChoices.clearStore();
  //     motherChoices.setChoices(
  //       [
  //         { value: "", label: "Select Mother", disabled: true },
  //         ...motherSuggestions.map((s) => ({
  //           value: s.name,
  //           label: s.name,
  //           selected: s.name === form.mother_name,
  //         })),
  //       ],
  //       "value",
  //       "label",
  //       true
  //     );

  //     return () => motherChoices.destroy();
  //   }
  // }, [motherSuggestions, form.mother_name]);

  // useEffect(() => {
  //   const fetchSuggestions = async () => {
  //     if (form.pusta_number) {
  //       try {
  //         const response = await axios.get(
  //           `${API_URL}/people/people/familyrelations?pusta_number=${form.pusta_number}`,
  //           { headers: { "Content-Type": "application/json" } }
  //         );

  //         setSuggestions(response.data.father_pusta || []);
  //         setMotherSuggestions(response.data.mother_pusta || []);
  //       } catch (error) {
  //         console.error("Error fetching suggestions:", error);
  //       }
  //     }
  //   };

  //   fetchSuggestions();
  // }, [form.pusta_number, API_URL]);

  // useEffect(() => {
  //   if (formData.id) {
  //     setForm((prevForm) => ({
  //       ...prevForm,
  //       father_name: formData.father_name || prevForm.father_name,
  //       mother_name: formData.mother_name || prevForm.mother_name,
  //       father_id: formData.father_id || prevForm.father_id,
  //       mother_id: formData.mother_id || prevForm.mother_id,
  //     }));
  //   }
  // }, [formData]);
  useEffect(() => {
    if (formData.id) {
      // Edit mode: Fetch user details
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
          // Ensure all fields are populated, merging with defaults if needed
          setForm({
            id: data.id || formData.id,
            pusta_number: data.pusta_number || formData.pusta_number || "",
            name: data.name || formData.name || "",
            name_in_nepali:
              data.name_in_nepali || formData.name_in_nepali || "",
            gender: data.gender || formData.gender || "",
            dob: data.date_of_birth || formData.dob || null,
            lifestatus: data.lifestatus || formData.lifestatus || "",
            death_date: data.date_of_death || formData.death_date || null,
            father_name: data.father_name || formData.father_name || "",
            father_id: data.father_id || formData.father_id || null,
            mother_name: data.mother_name || formData.mother_name || "",
            mother_id: data.mother_id || formData.mother_id || null,
            vansha_status:
              data.same_vamsha_status || formData.vansha_status || "",
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
    } else {
      // Create mode: Initialize with defaults or formData
      setForm({
        id: null,
        pusta_number: formData.pusta_number || "",
        name: formData.name || "",
        name_in_nepali: formData.name_in_nepali || "",
        gender: formData.gender || "",
        dob: formData.dob || null,
        lifestatus: formData.lifestatus || "",
        death_date: formData.death_date || null,
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
    }
  }, [formData.id, API_URL]);

  //   // Fetch suggestions when pusta_number changes
  //   const fetchSuggestions = async () => {
  //     if (form.pusta_number) {
  //       try {
  //         const response = await axios.get(
  //           `${API_URL}/people/people/familyrelations?pusta_number=${form.pusta_number}`,
  //           {
  //             method: "GET",
  //             headers: { "Content-Type": "application/json" },
  //           }
  //         );
  //         console.log(response.data);
  //         console.log(response.data.father_pusta);
  //         const fatherSuggestions = response.data.father_pusta;
  //         const motherSuggestions = response.data.mother_pusta;

  //         setSuggestions(fatherSuggestions);
  //         setMotherSuggestions(motherSuggestions);
  //       } catch (error) {
  //         handleBackendError(
  //           error,
  //           "Error fetching suggestions",
  //           "Error fetching suggestions.",
  //           false
  //         );
  //       }
  //     }
  //   };

  //   fetchSuggestions();
  // }, [form.id, form.pusta_number, API_URL]);

  // useEffect(() => {
  //   if (formData.id) {
  //     // Edit mode: Fetch user details
  //     const fetchUserDetails = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.get(
  //           `${API_URL}/people/${formData.id}/`,
  //           {
  //             headers: { "Content-Type": "application/json" },
  //           }
  //         );
  //         const data = response.data;
  //         console.log("Backend Response:", data); // Debug
  //         setForm({
  //           id: data.id || formData.id || null,
  //           pusta_number: data.pusta_number || formData.pusta_number || "",
  //           name: data.name || formData.name || "",
  //           name_in_nepali:
  //             data.name_in_nepali || formData.name_in_nepali || "",
  //           gender: data.gender || formData.gender || "",
  //           dob: data.date_of_birth || data.dob || formData.dob || null,
  //           lifestatus: data.lifestatus || formData.lifestatus || "",
  //           death_date: data.date_of_death || formData.death_date || null,
  //           father_name: data.father_name || formData.father_name || "",
  //           father_id: data.father_id || formData.father_id || null,
  //           mother_name: data.mother_name || formData.mother_name || "",
  //           mother_id: data.mother_id || formData.mother_id || null,
  //           vansha_status:
  //             data.same_vamsha_status || formData.vansha_status || "",
  //           contact: {
  //             email:
  //               data.contact_details?.email ||
  //               data.contact?.email ||
  //               formData.contact?.email ||
  //               "",
  //             phone:
  //               data.contact_details?.phone ||
  //               data.contact?.phone ||
  //               formData.contact?.phone ||
  //               "",
  //             address:
  //               data.contact_details?.address ||
  //               data.contact?.address ||
  //               formData.contact?.address ||
  //               "",
  //           },
  //           profession: data.profession || formData.profession || "",
  //           profileImage:
  //             data.photo || data.profileImage || formData.profileImage || "",
  //         });
  //       } catch (error) {
  //         handleBackendError(
  //           error,
  //           "Error fetching user data",
  //           "Failed to fetch user details."
  //         );
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchUserDetails();
  //   } else {
  //     // Create mode
  //     setForm({
  //       id: null,
  //       pusta_number: formData.pusta_number || "",
  //       name: formData.name || "",
  //       name_in_nepali: formData.name_in_nepali || "",
  //       gender: formData.gender || "",
  //       dob: formData.dob || null,
  //       lifestatus: formData.lifestatus || "",
  //       death_date: formData.death_date || null,
  //       father_name: formData.father_name || "",
  //       father_id: formData.father_id || null,
  //       mother_name: formData.mother_name || "",
  //       mother_id: formData.mother_id || null,
  //       vansha_status: formData.vansha_status || "",
  //       contact: {
  //         email: formData.contact?.email || "",
  //         phone: formData.contact?.phone || "",
  //         address: formData.contact?.address || "",
  //       },
  //       profession: formData.profession || "",
  //       profileImage: formData.profileImage || "",
  //     });
  //   }
  // }, [formData.id, API_URL]);

  useEffect(() => {
    if (formData.id) {
      setForm((prevForm) => ({
        ...prevForm,
        father_name: formData.father_name || prevForm.father_name,
        mother_name: formData.mother_name || prevForm.mother_name,
        father_id: formData.father_id || prevForm.father_id,
        mother_id: formData.mother_id || prevForm.mother_id,
      }));
    }
  }, [formData]);

  // useEffect(() => {
  //   if (fatherInputRef.current && !fatherChoicesInstance.current) {
  //     fatherChoicesInstance.current = new Choices(fatherInputRef.current, {
  //       removeItemButton: true,
  //       shouldSort: false,
  //       searchEnabled: true,
  //       noResultsText: "Not available",
  //       placeholder: true,
  //       placeholderValue: "Select Father",
  //     });
  //   }
  //   return () => {
  //     if (fatherChoicesInstance.current) {
  //       fatherChoicesInstance.current.destroy();
  //       fatherChoicesInstance.current = null;
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   if (motherInputRef.current && !motherChoicesInstance.current) {
  //     motherChoicesInstance.current = new Choices(motherInputRef.current, {
  //       removeItemButton: true,
  //       shouldSort: false,
  //       searchEnabled: true,
  //       noResultsText: "Not available",
  //       placeholder: true,
  //       placeholderValue: "Select Mother",
  //     });
  //   }
  //   return () => {
  //     if (motherChoicesInstance.current) {
  //       motherChoicesInstance.current.destroy();
  //       motherChoicesInstance.current = null;
  //     }
  //   };
  // }, []);

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
          const response = await fetch(`${API_URL}/people/${formData.id}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
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
          const response = await fetch(`${API_URL}/people/people/`);
          const data = await response.json();
          setFamilyMembers(data.data);
        } catch (error) {
          console.error("Error fetching family members:", error);
        }
      };

      fetchFamilyMembers();
    }
  }, [formData, familyMembers.length, API_URL]);

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
      handleBackendError(
        error,
        "Error uploading image",
        "Failed to upload image."
      );
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
  const handleDateChange = (value) => {
    const selectedDate = new Date(value);
    const todayDate = new Date(today);

    if (selectedDate <= todayDate) {
      setForm((prevForm) => ({
        ...prevForm,
        dob: value || "", // Set the selected date for dob
      }));
    } else {
      alert("Please select a date before or on today.");
    }
  };

  // This handler updates other form fields
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((prev) => ({ ...prev, [name]: value }));

  //   if (name === "father_name" || name === "mother_name") {
  //     clearTimeout(debounceTimeout.current);
  //     debounceTimeout.current = setTimeout(() => {
  //       if (name === "father_name") {
  //         setShowSuggestions(true);
  //       } else if (name === "mother_name") {
  //         setShowMotherSuggestions(true);
  //       }
  //     }, 500); // Delay before showing dropdown
  //   }
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const translateToNepali = async () => {
    try {
      const text = form.name.toLowerCase();
      const convertedtext = Sanscript.t(text, "itrans", "devanagari");
      // const converteddate = Sanscript.t(form.dob, "itrans", "devanagari");
      console.log(convertedtext);
      setForm((prevForm) => ({
        ...prevForm,
        name_in_nepali: convertedtext,
      }));
    } catch (error) {
      console.error("Error converting text:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to convert text",
      });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (loading) return;

  //   setLoading(true);
  //   try {
  //     console.log("FORM", form);
  //     const payload = {
  //       name: form.name,
  //       name_in_nepali: form.name_in_nepali,
  //       pusta_number: form.pusta_number,
  //       contact_details: form.contact,
  //       father_name: form.father_id,
  //       mother_name: form.mother_id,
  //       date_of_birth: form.dob || null,
  //       lifestatus: form.lifestatus,
  //       date_of_death: form.death_date || null,
  //       photo: form.profileImage,
  //       profession: form.profession,
  //       gender: form.gender,
  //       same_vamsha_status: form.vansha_status,
  //     };

  //     console.log("Payload:", payload);

  //     const response = form.id
  //       ? await axios.put(`${API_URL}/people/${form.id}/`, payload)
  //       : await axios.post(`${API_URL}/people/people/`, payload);

  //     onSave(response.data);
  //     Swal.fire("Saved!", "Your changes have been saved.", "success");
  //     onClose();
  //     window.location.reload();
  //   } catch (error) {
  //     handleBackendError(error, "Failed to save", "Something went wrong!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validate required fields
    if (!form.name || !form.pusta_number || !form.gender || !form.lifestatus) {
      Swal.fire(
        "Error",
        "Please fill in all required fields: Name, Pusta Number, Gender, Status.",
        "error"
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Form State:", form);
      console.log("NAME:", form.name);
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

      console.log("Payload:", payload);

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
            <h3 className="text-lg font-bold py-3 text-[#f49D37]">
              Personal Information
            </h3>

            <div className="w-full">
              <label className="block text-sm font-medium text-[#f49D37]">
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
                value={form.dob || ""}
                onChange={handleDateChange}
                options={{
                  calenderLocale: "ne", // Nepali Calendar locale
                  valueLocale: "en", // Gregorian date format in English
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
                onChange={(value) => {
                  setForm((prevForm) => ({
                    ...prevForm,
                    dob: value, // Set the selected date for death_date
                  }));
                }}
                className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
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
                      death_date: value, // Set the selected date for death_date
                    }));
                  }}
                  options={{
                    calenderLocale: "ne", // Nepali Calendar locale
                    valueLocale: "en", // Gregorian date format in English
                    minDate: form.dob ? form.dob : "", // Minimum date is set to dob, else blank
                    maxDate: today, // Maximum date is today's date
                  }}
                />
              </div>
            )}
          </div>

          {/* Family Information */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-bold py-3 text-[#f49D37]">
              Family Information
            </h3>
          </div>

          {/* --- FATHER NAME FIELD (Updated) --- */}
          <div className="w-full">
            <label className="block text-sm font-medium text-[#f49D37]">
              Father Name
            </label>
            <div className="relative">
              <select
                ref={fatherInputRef}
                name="father_name"
                className="
        mt-2
        block
        w-full
        px-4
        py-3
        border
        border-gray-300
        rounded-md
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        transition-all
      "
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
                        handleSuggestionClick(suggestion);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}{" "}
                      {suggestion.father?.name && suggestion.mother?.name
                        ? `- ${suggestion.father.name} | ${suggestion.mother.name}`
                        : suggestion.father?.name
                        ? `- ${suggestion.father.name}`
                        : suggestion.mother?.name
                        ? `- ${suggestion.mother.name}`
                        : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* --- MOTHER NAME FIELD (Updated) --- */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-[#f49D37]">
              Mother Name
            </label>
            <div className="relative">
              <select
                ref={motherInputRef}
                name="mother_name"
                className="
        mt-2
        block
        w-full
        px-4
        py-3
        border
        border-gray-300
        rounded-md
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-transparent
        transition-all
      "
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
                        handleMotherSuggestionClick(suggestion);
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.name}{" "}
                      {suggestion.father?.name && suggestion.mother?.name
                        ? `- ${suggestion.father.name} | ${suggestion.mother.name}`
                        : suggestion.father?.name
                        ? `- ${suggestion.father.name}`
                        : suggestion.mother?.name
                        ? `- ${suggestion.mother.name}`
                        : ""}
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
              <option value="True">Yes</option>
              <option value="False">No</option>
            </select>
          </div>

          {/* Contact Information */}
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
                value={form.contact?.email || ""}
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
                type="string"
                name="phone"
                value={form.contact?.phone || ""}
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
                value={form.contact?.address || ""}
                onChange={handleContactChange}
                className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Professional Information */}
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

          {/* Save Button */}
          <div className="flex justify-center w-full mb-8">
            <button
              type="submit"
              //onClick={handleSubmit}
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
