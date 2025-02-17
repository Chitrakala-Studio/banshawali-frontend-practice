import { useState } from "react";
import PropTypes from "prop-types";

const SearchForm = ({ initialCriteria, onSearch, onClose }) => {
  const [criteria, setCriteria] = useState(initialCriteria);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(criteria);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-800 rounded-lg shadow-xl p-4 w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-500"
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

        <h2 className="text-xl font-bold text-blue-400 mb-3 text-center">
          Search
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Right-aligned grid with minimal spacing */}
          <div className="ml-auto grid grid-cols-2 gap-x-4 gap-y-2">
            {/* Row 1: Name & Pusta Number */}
            <div>
              <label className="block text-xs text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={criteria.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">
                Pusta Number
              </label>
              <input
                type="text"
                name="pustaNumber"
                value={criteria.pustaNumber}
                onChange={handleChange}
                placeholder="Enter Pusta Number"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>

            {/* Row 2: Phone & Email */}
            <div>
              <label className="block text-xs text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={criteria.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={criteria.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>

            {/* Row 3: Father Name & Mother Name */}
            <div>
              <label className="block text-xs text-gray-300 mb-1">
                Father Name
              </label>
              <input
                type="text"
                name="father_name"
                value={criteria.father_name}
                onChange={handleChange}
                placeholder="Enter father name"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-300 mb-1">
                Mother Name
              </label>
              <input
                type="text"
                name="mother_name"
                value={criteria.mother_name}
                onChange={handleChange}
                placeholder="Enter mother name"
                className="w-full px-2 py-1 border border-gray-600 rounded 
                           focus:outline-none focus:ring-1 focus:ring-blue-500 
                           bg-gray-700 text-white text-sm"
              />
            </div>
          </div>

          {/* Centered Search Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 
                         rounded-md text-sm transition-colors"
            >
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
    pustaNumber: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SearchForm;
