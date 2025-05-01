import { useState } from "react";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";

const SearchForm = ({ initialCriteria, onSearch, onClose }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const API_URL = import.meta.env.VITE_API_URL; // Use your env variable
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
    // setCriteria((prev) => ({
    //   ...prev,
    //   [name]: type === "checkbox" ? checked : value,
    // }));
    const updatedCriteria = {
      ...criteria,
      [name]: type === "checkbox" ? checked : value,
    };
    setCriteria(updatedCriteria);
    //debouncedSearch(updatedCriteria);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(criteria).toString();
    // Use the API URL from the environment variable
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
        onSearch(data.data);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
    debouncedSearch.flush();
  };

  return (
    <div className="fixed inset-0 bg-[#2E4568] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-[#A6C8A5] rounded-lg shadow-xl p-4 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#2E4568] hover:text-[#E9D4B0]"
        >
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

        <h2 className="text-xl font-bold text-[#2E4568] mb-3 text-center">
          Search User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {/* Row 1: Name & Pusta Number */}
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={criteria.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">
                Pusta Number
              </label>
              <input
                type="text"
                name="pusta_number"
                value={criteria.pusta_number}
                onChange={handleChange}
                placeholder="Enter Pusta Number"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>

            {/* Row 2: Phone & Email */}
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">Phone</label>
              <input
                type="text"
                name="phone_number"
                value={criteria.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={criteria.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>

            {/* Row 3: Father Name & Mother Name */}
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">
                Father Name
              </label>
              <input
                type="text"
                name="father_name"
                value={criteria.father_name}
                onChange={handleChange}
                placeholder="Enter father name"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#2E4568] mb-1">
                Mother Name
              </label>
              <input
                type="text"
                name="mother_name"
                value={criteria.mother_name}
                onChange={handleChange}
                placeholder="Enter mother name"
                className="w-full px-2 py-1 border border-[#AAABAC] rounded focus:outline-none focus:ring-1 focus:ring-[#E9D4B0] bg-[#B9BAC3] text-[#2E4568] text-sm"
              />
            </div>
          </div>

          {/* Bottom row: Toggle switch on left and Search button on right */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-[#2E4568] text-sm">Same Vansha Status</span>
              <label
                htmlFor="same_vamsha_status"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="same_vamsha_status"
                  name="same_vamsha_status"
                  checked={criteria.same_vamsha_status}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 bg-[#B9BAC3] rounded-full peer 
                             peer-focus:outline-none peer-focus:ring-4 
                             peer-focus:ring-[#E9D4B0] dark:bg-[#B9BAC3] 
                             peer-checked:bg-[#2E4568]
                             after:content-[''] after:absolute after:top-0.5 after:left-[2px]
                             after:bg-white after:border-[#AAABAC] after:rounded-full 
                             after:h-5 after:w-5 after:transition-all
                             dark:border-[#AAABAC] peer-checked:after:translate-x-full 
                             peer-checked:after:border-white"
                ></div>
              </label>
            </div>
            <button
              type="submit"
              className="bg-[#E9D4B0] hover:bg-[#D9C4A0] text-[#2E4568] px-4 py-1.5 rounded-md text-sm transition-colors"
            >
              {/* Icon */}
              <FaSearch className="inline-block mr-1 text-[#2E4568]" />
              Search
            </button>
          </div>
        </form>
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
