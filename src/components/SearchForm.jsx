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
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-gray-800 h-[500px] w-[500px] rounded-lg relative flex flex-col p-5 overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={onClose}
            className="text-white font-bold text-2xl hover:text-red-500"
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

        <h2 className="text-2xl font-bold text-[#7091E6] mb-5">Search</h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={criteria.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Pusta Number:
            </label>
            <input
              type="text"
              name="pustaNumber"
              value={criteria.pustaNumber}
              onChange={handleChange}
              placeholder="Enter Pusta Number"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={criteria.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={criteria.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Father Name
            </label>
            <input
              type="text"
              name="father_name"
              value={criteria.father_name}
              onChange={handleChange}
              placeholder="Enter father name"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-[#7091E6]">
              Mother Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={criteria.mother_name}
              onChange={handleChange}
              placeholder="Enter mother name"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
  }).isRequired,
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SearchForm;
