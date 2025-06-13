import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaArrowDown, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import axiosInstance from "./axiosInstance";
import Sanscript from "sanscript";

const AddRelationModal = ({ person, onClose, onSave, API_URL }) => {
  const [formData, setFormData] = useState({
    spouseName: "",
    spouseNameInNepali: "",
    spouseGender: person.gender?.toLowerCase() === "female" ? "Male" : "Female",
  });
  const [loading, setLoading] = useState(false);

  const normalizeUrl = (url) => url.replace(/\/+$/, ""); // Remove trailing slashes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const translateToNepali = async () => {
    try {
      const text = formData.spouseName.toLowerCase();
      const convertedText = Sanscript.t(text, "itrans", "devanagari");
      setFormData((prev) => ({
        ...prev,
        spouseNameInNepali: convertedText,
      }));
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to translate name to Nepali.",
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.spouseName || !formData.spouseGender) {
      Swal.fire({
        title: "Error!",
        text: "Please provide spouse name and gender.",
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
      return;
    }

    if (!person.id) {
      console.error("Person ID is undefined:", person);
      Swal.fire({
        title: "Error!",
        text: "Person ID is missing. Please try again or contact support.",
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
      return;
    }

    if (!API_URL) {
      console.error("API_URL is undefined or empty");
      Swal.fire({
        title: "Error!",
        text: "API URL is missing. Please check the application configuration.",
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
      return;
    }

    setLoading(true);
    try {
      const normalizedApiUrl = normalizeUrl(API_URL);
      console.log("Person data:", person);
      console.log("API_URL:", normalizedApiUrl);
      console.log("POST URL:", `${normalizedApiUrl}/add-spouse/`);

      const payload = {
        person_id: person.id,
        name: formData.spouseName,
        gender: formData.spouseGender,
        name_in_nepali: formData.spouseNameInNepali || formData.spouseName,
      };

      console.log("Creating spouse with payload:", payload);

      const response = await axiosInstance.post(
        `${normalizedApiUrl}/add-spouse/`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Spouse creation response:", response.data);

      Swal.fire({
        title: "Success!",
        text: response.data.message || "Spouse added successfully.",
        icon: "success",
        confirmButtonColor: "#2E4568",
      });

      onSave();
      onClose();
    } catch (error) {
      console.error("Error adding spouse:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to add spouse. Please try again.";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-relation-modal">
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

          .add-relation-modal {
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
            height: 500px;
            width: 600px;
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
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 24px;
            gap: 16px;
          }

          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 600;
            color: var(--gold-accent);
            margin-bottom: 8px;
            text-align: center;
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

          .button-container {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 16px;
          }

          .submit-btn,
          .cancel-btn {
            padding: 8px 16px;
            border-radius: 6px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .submit-btn {
            background-color: var(--header-maroon);
            color: #ffffff;
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

          .cancel-btn {
            background-color: #e5e7eb;
            color: var(--primary-text);
          }

          .cancel-btn:hover:not(:disabled),
          .cancel-btn:focus:not(:disabled) {
            background-color: #d1d5db;
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

      <div className="add-relation-modal">
        <div className="modal-container">
          {loading ? (
           
            <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-3xl text-[#F49D37]" />
            </div>
            
           
          ) : (
            <form onSubmit={handleSubmit} className="form-content">
              <h3 className="section-title">
                Add Spouse for {person.name_in_nepali || person.name}
              </h3>

              <div className="form-field">
                <label className="label">
                  Spouse Name (English) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter spouse name"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={translateToNepali}
                  className="translate-btn"
                  disabled={loading || !formData.spouseName}
                >
                  <FaArrowDown />
                  <span>Translate</span>
                </button>
              </div>

              <div className="form-field">
                <label className="label">Spouse Name (Nepali)</label>
                <input
                  type="text"
                  name="spouseNameInNepali"
                  value={formData.spouseNameInNepali}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter spouse name in Nepali"
                  disabled={loading}
                />
              </div>

              <div className="form-field">
                <label className="label">
                  Spouse Gender <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="spouseGender"
                  value={formData.spouseGender}
                  onChange={handleChange}
                  className="select"
                  required
                  disabled={loading}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="button-container">
                <button
                  type="button"
                  onClick={onClose}
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
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
    </div>
  );
};

AddRelationModal.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    name_in_nepali: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  API_URL: PropTypes.string.isRequired,
};

export default AddRelationModal;
