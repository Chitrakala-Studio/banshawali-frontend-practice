import { useState } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const SearchForm = ({ initialCriteria, onSearch, onClose }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const API_URL = import.meta.env.VITE_API_URL;

  const debouncedSearch = debounce((newCriteria) => {
    const queryParams = new URLSearchParams(newCriteria).toString();
    fetch(`${API_URL}/people/people/search/?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => onSearch(data.data))
      .catch((error) => console.error("Error fetching search results:", error));
  }, 500);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedCriteria = {
      ...criteria,
      [name]: type === "checkbox" ? checked : value,
    };
    setCriteria(updatedCriteria);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(criteria).toString();
    const url = `${API_URL}/people/people/search/?${queryParams}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Search results:", data);
        console.log(Array.isArray(data), data.length === 0);
        if (Array.isArray(data) && data.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Details Found",
            text: "Please try different search criteria.",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setCriteria(initialCriteria); // Clear form only if OK is pressed
            }
          });
        } else {
          onSearch(criteria);
          setCriteria(initialCriteria); // Clear form if results found
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
    debouncedSearch.flush();
  };

  return (
    <div className="search-form-modal">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --secondary-light: #E9D4B0;
            --secondary-lighter: #D9C4A0;
            --neutral-gray: #D1D5DB;
            --gold-accent: #F49D37;
          }

          .search-form-modal {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
            padding: 16px;
            backdrop-filter: blur(5px);
          }

          .modal-content {
            position: relative;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 2px solid var(--gold-accent);
            padding: 24px;
            width: 100%;
            max-width: 480px;
            max-height: 90vh;
            overflow-y: auto;
          }

          .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            color: var(--primary-dark);
            transition: color 0.2s ease;
          }

          .close-btn:hover,
          .close-btn:focus {
            color: var(--primary-hover);
            outline: none;
          }

          .modal-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: bold;
            color: var(--primary-text);
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--neutral-gray);
            padding-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          form {
            max-width: none;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .form-label {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            color: var(--primary-text);
            margin-bottom: 4px;
            display: block;
          }

          .form-input {
            width: 100%;
            padding: 8px 12px;
            background: linear-gradient(to right, #F9FAFB, #FFFFFF);
            border: 1px solid var(--neutral-gray);
            border-radius: 4px;
            font-family: 'Merriweather', serif;
            font-size: 14px;
            color: var(--primary-text);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
          }

          .form-input:focus {
            border-color: var(--secondary-light);
            box-shadow: 0 0 0 2px rgba(233, 212, 176, 0.3);
            outline: none;
          }

          .toggle-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .toggle-label {
            font-family: 'Merriweather', serif;
            font-size: 14px;
            color: var(--primary-text);
          }

          .toggle-switch {
            position: relative;
            width: 44px;
            height: 24px;
            background-color: var(--neutral-gray);
            border-radius: 12px;
            transition: background-color 0.3s ease;
          }

          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: #FFFFFF;
            border-radius: 50%;
            transition: transform 0.3s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          .toggle-switch input:checked + .toggle-slider {
            transform: translateX(20px);
          }

          .toggle-switch input:checked + .toggle-slider::before {
            background-color: var(--primary-dark);
          }

          .toggle-switch input:focus + .toggle-slider {
            box-shadow: 0 0 0 2px rgba(46, 69, 104, 0.3);
          }

          .search-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: var(--secondary-light);
            color: var(--primary-text);
            padding: 8px 16px;
            border-radius: 4px;
            font-family: 'Merriweather', serif;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .search-btn:hover,
          .search-btn:focus {
            background-color: var(--secondary-lighter);
            transform: scale(1.05);
            outline: none;
          }

          .search-btn svg {
            width: 16px;
            height: 16px;
          }
        `}
      </style>

      <div className="search-form-modal">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
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

          <h2 className="modal-title">Search User</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              <div>
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={criteria.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Pusta Number</label>
                <input
                  type="text"
                  name="pusta_number"
                  value={criteria.pusta_number}
                  onChange={handleChange}
                  placeholder="Enter Pusta Number"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone_number"
                  value={criteria.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={criteria.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Father Name</label>
                <input
                  type="text"
                  name="father_name"
                  value={criteria.father_name}
                  onChange={handleChange}
                  placeholder="Enter father name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Mother Name</label>
                <input
                  type="text"
                  name="mother_name"
                  value={criteria.mother_name}
                  onChange={handleChange}
                  placeholder="Enter mother name"
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="toggle-wrapper">
                <span className="toggle-label">Same Vansha Status</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="same_vamsha_status"
                    name="same_vamsha_status"
                    checked={criteria.same_vamsha_status}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <button type="submit" className="search-btn">
                <FaSearch />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SearchForm.propTypes = {
  initialCriteria: PropTypes.shape({
    name: PropTypes.string,
    pusta_number: PropTypes.string,
    phone_number: PropTypes.string,
    email: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    same_vamsha_status: PropTypes.bool,
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SearchForm;