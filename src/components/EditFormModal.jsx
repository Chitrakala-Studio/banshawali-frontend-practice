import { useState } from "react";
import PropTypes from "prop-types";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form); // Pass updated data back to parent
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-white h-[600px] w-[700px]   rounded-lg relative  flex justify-center items-center overflow-y-scroll overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
        >
          &#x2715;
        </button>

        <form onSubmit={handleSubmit} className="space-y-4  flex flex-col h-full w-full items-center ">
          {/* Profile Picture */}
          <div className="flex justify-center mt-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-3xl text-gray-500">+</span>
            </div>
          </div>

          {/* Username */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter username"
            />
          </div>

          {/* Pusta Number */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Pusta Number
            </label>
            <input
              type="text"
              name="pusta_number"
              value={form.pusta_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter pusta number"
            />
          </div>

          {/* Father's Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Father&apos;s Name
            </label>
            <input
              type="text"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter father's name"
            />
          </div>

          {/* Mother's Name */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Mother&apos;s Name
            </label>
            <input
              type="text"
              name="mother_name"
              value={form.mother_name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter mother's name"
            />
          </div>

          {/* DOB */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">DOB</label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
            />
          </div>

          {/* Alive/Dead */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Alive/Dead
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
            >
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
          </div>

          {/* Profession */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
              placeholder="Enter profession"
            />
          </div>

          {/* Gender */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm"
            >
              <option value="Alive">Male</option>
              <option value="Dead">Female</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-center w-3/4">
            <button
              type="submit"
              className="bg-green-600 w-full mb-4 text-white px-6 py-2 rounded-md shadow-sm hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditFormModal.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string,
    pusta_number: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    dob: PropTypes.string,
    status: PropTypes.string,
    profession: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EditFormModal;
