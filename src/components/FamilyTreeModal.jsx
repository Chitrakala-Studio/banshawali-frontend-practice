import PropTypes from "prop-types";

const FamilyTreeModal = ({ familyData, onClose }) => {
  if (!familyData) return null;

  const {
    name,
    name_in_nepali,
    pusta_number,
    contact_details = {},
    family_relations = {},
    email,
    address,
    phone,
    date_of_birth,
    status,
    profession,
    gender,
    photo_url,
    father_name,
    mother_name,
    profileImage,
  } = familyData;

  const { current_address = {}, social_links = [] } = contact_details;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg relative overflow-y-auto max-h-[90vh] flex">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
        >
          &#x2715;
        </button>

        {/* Image and Details Section */}
        <div className="flex flex-row items-center w-full">
          {/* Image Section */}
          <div className="w-1/3 flex justify-center items-center">
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

          {/* Details Section */}
          <div className="w-2/3 pl-14">
            {/* Header */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{name}</h2>
              <p className="text-sm text-gray-500">{name_in_nepali}</p>
            </div>

            {/* Details Section */}
            <div className="space-y-4 text-sm md:text-base mt-6">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <p>
                <strong>Pusta Number:</strong> {pusta_number || "N/A"}
              </p>
              <p>
                <strong>Profession:</strong> {profession || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {gender || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {date_of_birth || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {status || "N/A"}
              </p>

              {/* Contact Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Contact Details</h3>
                <p>
                  <strong>Email:</strong> {email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>
                  {address || "N/A"}
                </p>
                {social_links.length > 0 && (
                  <p>
                    <strong>Social Links:</strong>{" "}
                    <a
                      href={social_links[0]}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </p>
                )}
              </div>

              {/* Family Relations */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Family Relations</h3>
                <p>
                  <strong>Father:</strong> {father_name || "N/A"}
                </p>
                <p>
                  <strong>Mother:</strong> {mother_name || "N/A"}
                </p>
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
    contact_details: PropTypes.shape({
      email: PropTypes.string,
      phone_numbers: PropTypes.arrayOf(PropTypes.string),
      current_address: PropTypes.shape({
        street: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
      }),
      social_links: PropTypes.arrayOf(PropTypes.string),
    }),
    family_relations: PropTypes.shape({
      father: PropTypes.string,
      mother: PropTypes.string,
    }),
    date_of_birth: PropTypes.string,
    status: PropTypes.string,
    profession: PropTypes.string,
    gender: PropTypes.string,
    photo_url: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FamilyTreeModal;
