import { useState } from "react";
import PropTypes from "prop-types";

const EditFormModal = ({ formData, onClose, onSave }) => {
  const [form, setForm] = useState(formData);
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Create a preview of the selected image
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, profileImage }); // Pass updated data along with the profile image
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 w-[700px] h-[600px] rounded-lg relative flex justify-center items-center overflow-y-scroll shadow-xl">
        {/* Close Button */}
        <div className="fixed top-10 left-55">
          <button
            onClick={onClose}
            className="fixed absolute top-10 right-full text-gray-700 font-bold text-2xl hover:text-red-500 "
          >
            {/* Circle with a cross */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 w-full h-full flex flex-col items-center"
        >
          {/* Profile Picture with Image Upload */}
          <div className="flex justify-center mt-4 relative">
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl text-blue-500 hover:bg-blue-300 transition-all">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>+</span>
                )}
              </div>
              <input
                type="file"
                id="image-upload"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter mother's name"
            />
          </div>

          {/* DOB */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              DOB
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="mt-2 block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="mb-4 bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
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
