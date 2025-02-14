import PropTypes from "prop-types";

const FamilyTreeModal = ({ familyData, onClose }) => {
  if (!familyData) return null;

  const {
    name,
    name_in_nepali,
    pusta_number,
    email,
    address,
    phone,
    date_of_birth,
    status,
    profession,
    gender,
    father_name,
    mother_name,
    profileImage,
  } = familyData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
        >
          &#x2715;
        </button>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Left Section: Name and Image */}
          <div className="w-1/3 flex flex-col items-center">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm text-gray-500 mb-2">{name_in_nepali}</p>
            <img
              src={profileImage}
              alt={name}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "0px", // Ensures the image is square
              }}
            />
          </div>

          {/* Right Section: All Other Details */}
          <div className="w-2/3">
            <div className="space-y-4 text-sm md:text-base">
              {/* Personal Information */}
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <strong>Pusta Number:</strong>{" "}
                <span>{pusta_number || "N/A"}</span>
                <strong>Profession:</strong> <span>{profession || "N/A"}</span>
                <strong>Gender:</strong> <span>{gender || "N/A"}</span>
                <strong>Date of Birth:</strong>{" "}
                <span>{date_of_birth || "N/A"}</span>
                <strong>Status:</strong> <span>{status || "N/A"}</span>
              </div>

              {/* Family Relations */}
              <h3 className="text-lg font-semibold mb-2">Family Relations</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <strong>Father:</strong> <span>{father_name || "N/A"}</span>
                <strong>Mother:</strong> <span>{mother_name || "N/A"}</span>
              </div>

              {/* Contact Details */}
              <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <strong>Email:</strong> <span>{email || "N/A"}</span>
                <strong>Phone:</strong> <span>{phone || "N/A"}</span>
                <strong>Address:</strong> <span>{address || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FamilyTreeModal.propTypes = {
  familyData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    name_in_nepali: PropTypes.string,
    pusta_number: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    date_of_birth: PropTypes.string,
    status: PropTypes.string,
    profession: PropTypes.string,
    gender: PropTypes.string,
    father_name: PropTypes.string,
    mother_name: PropTypes.string,
    profileImage: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FamilyTreeModal;
