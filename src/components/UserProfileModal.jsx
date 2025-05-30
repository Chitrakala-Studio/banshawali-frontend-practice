import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Heart,
  Users,
  Globe,
  UserCircle,
} from "lucide-react";
import {
  FaBirthdayCake,
  FaFemale,
  FaHeart,
  FaMale,
  FaSkullCrossbones,
  FaUser,
  FaCopy,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const GenderIcon = ({ gender, label }) => {
  const iconBase = { width: 20, height: 20, marginRight: 8 };
  const maleIconStyle = { ...iconBase, color: "#2E4568" };
  const femaleIconStyle = { ...iconBase, color: "#E9D4B0" };
  const normalizedGender = gender ? String(gender).toLowerCase() : "";

  // Debugging: Log gender value
  console.log(
    `GenderIcon: gender=${gender}, normalized=${normalizedGender}, label=${label}`
  );

  if (normalizedGender === "female") {
    return <FaFemale style={femaleIconStyle} aria-label="Female" />;
  }
  if (normalizedGender === "male") {
    return <FaMale style={maleIconStyle} aria-label="Male" />;
  }
  return <FaUser style={iconBase} aria-label="Unknown gender" />;
};

const UserProfileModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("personal");

  if (!user) {
    return null;
  }

  // Debugging: Log user data
  console.log("UserProfileModal: user data", user);

  const handleCopy = () => {
    if (user.bio) {
      navigator.clipboard
        .writeText(user.bio)
        .then(() => {
            toast.success("Bio copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy text");
        });
    }
  };

  const handleCopySiblings = () => {
    if (user.bio_siblings) {
      navigator.clipboard
        .writeText(user.bio_siblings)
        .then(() => {
          toast.success("Bio of Siblings copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy text");
        });
    }
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: UserCircle },
    { id: "family", label: "Family", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
  ];


  const renderPersonalInfo = () => (
    <div className="info-section">
      <p className="info-item">
        <GenderIcon gender={user.gender} label="User Gender" />
        <strong>Gender : </strong>
        {user.gender || "-"}
      </p>
      {user.dateOfBirth && (
        <p className="info-item">
          <FaBirthdayCake className="info-icon" />
          <strong>Date of Birth : </strong>
          {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p className="info-item">
          <FaHeart className="info-icon" />
          <strong>Status : </strong>
          {user.lifestatus}
        </p>
      )}
      {user.date_of_death && (
        <p className="info-item">
          <FaSkullCrossbones className="info-icon" />
          <strong>Date of Death : </strong>
          {user.date_of_death}
        </p>
      )}
      {user.profession && (
        <p className="info-item">
          <Briefcase className="info-icon" />
          <strong>Profession : </strong>
          {user.profession}
        </p>
      )}
      {/* JOB: Designation, Company, Location */}
      {(user.designation || user.company || user.location) && (
        <p className="info-item">
          <FaUser className="info-icon" />
          <strong>Job : </strong>
          {user.designation && <span>{user.designation}</span>}
          {user.designation && (user.company || user.location) && <span>, </span>}
          {user.company && <span>{user.company}</span>}
          {user.company && user.location && <span>, </span>}
          {user.location && <span>{user.location}</span>}
        </p>
      )}
      {user.blood && (
        <p className="info-item">
          <FaHeart className="info-icon" style={{ color: '#F49D37' }} />
          <strong>Blood Group : </strong>
          {user.blood}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => (
    <div className="info-section">
      {user.great_grandfather?.name && (
        <p className="info-item">
          <GenderIcon gender="male" label="Great Grandfather" />
          <strong className="family-label">Great Grandfather : </strong>
          {user.great_grandfather.id ? (
            <Link
              to={`/${user.great_grandfather.id}`}
              onClick={onClose}
              className="info-link"
            >
              {user.great_grandfather.name_in_nepali ||
                user.great_grandfather.name ||
                "-"}
            </Link>
          ) : (
            <span>
              {user.great_grandfather.name_in_nepali ||
                user.great_grandfather.name ||
                "-"}
            </span>
          )}
        </p>
      )}
        
      {user.grandfather?.name && (
        <p className="info-item">
          <GenderIcon gender="male" label="Grandfather" />
          <strong className="family-label">Grandfather : </strong>
          {user.grandfather.id ? (
            <Link
              to={`/${user.grandfather.id}`}
              onClick={onClose}
              className="info-link"
            >
              {user.grandfather.name_in_nepali || user.grandfather.name || "-"}
            </Link>
          ) : (
            <span>
              {user.grandfather.name_in_nepali || user.grandfather.name || "-"}
            </span>
          )}
        </p>
      )}

      {user.grandmother?.name && (
        <p className="info-item">
          <GenderIcon gender="female" label="Grandmother" />
          <strong className="family-label">Grandmother : </strong>
          {user.grandmother.id ? (
            <Link
              to={`/${user.grandmother.id}`}
              onClick={onClose}
              className="info-link"
            >
              {user.grandmother.name_in_nepali || user.grandmother.name || "-"}
            </Link>
          ) : (
            <span>
              {user.grandmother.name_in_nepali || user.grandmother.name || "-"}
            </span>
          )}
        </p>
      )}

      {user.father?.id && (
        <p className="info-item">
          <GenderIcon gender="male" label="Father" />
          <strong className="family-label">Father : </strong>
          <Link
            to={`/${user.father.id}`}
            onClick={onClose}
            className="info-link"
          >
            {user.father.name_in_nepali || user.father.name || "-"}
          </Link>
        </p>
      )}

      {user.mother?.id && (
        <p className="info-item">
          <GenderIcon gender="female" label="Mother" />
          <strong className="family-label">Mother : </strong>
          <Link
            to={`/${user.mother.id}`}
            onClick={onClose}
            className="info-link"
          >
            {user.mother.name_in_nepali || user.mother.name || "-"}
          </Link>
        </p>
      )}

      {user.spouse?.length > 0 && (
        <>
          <p className="info-header">
            <Users style={{ width: 20, height: 20, marginRight: 8 }} />
            Spouse
          </p>
          {user.spouse.map((sp) => (
            <p key={sp.id} className="info-item nested">
              <GenderIcon
                gender={sp.gender}
                label={`Spouse ${sp.name || sp.id}`}
              />
              <Link to={`/${sp.id}`} onClick={onClose} className="info-link">
                {sp.name_in_nepali || sp.name || "-"}
              </Link>
            </p>
          ))}
        </>
      )}

      {user.siblings?.length > 0 && (
        <>
          <p className="info-header">
            <FaUser style={{ width: 20, height: 20, marginRight: 8 }} />
            Siblings
          </p>
          {user.siblings.map((sib) => (
            <p key={sib.id} className="info-item nested">
              <GenderIcon
                gender={sib.gender}
                label={`Sibling ${sib.name || sib.id}`}
              />
              <Link to={`/${sib.id}`} onClick={onClose} className="info-link">
                {sib.name_in_nepali || sib.name || "-"}
              </Link>
              {Array.isArray(sib.spouses) && sib.spouses.length > 0 && (
                <>
                  {" - "}
                  {sib.spouses
                    .map(
                      (sp) =>
                        sp.name_in_nepali || sp.name || "-"
                    )
                    .join(" / ")}
                </>
              )}
            </p>
          ))}
        </>
      )}

      {user.children?.length > 0 && (
        <>
          <p className="info-header">
            <Users style={{ width: 20, height: 20, marginRight: 8 }} />
            Children
          </p>
          {user.children.map((child) => (
            <p key={child.id} className="info-item nested">
              <GenderIcon
                gender={child.gender}
                label={`Child ${child.name || child.id}`}
              />
              <Link to={`/${child.id}`} onClick={onClose} className="info-link">
                {child.name_in_nepali || child.name || "-"}
              </Link>
              {Array.isArray(child.spouses) && child.spouses.length > 0 && (
                <>
                  {" - "}
                  {child.spouses
                    .map(
                      (sp) =>
                        sp.name_in_nepali || sp.name || "-"
                    )
                    .join(" / ")}
                </>
              )}
            </p>
          ))}
        </>
      )}
    </div>
  );

  const renderContact = () => {
    const contact = user.contact_details || {};
    return (
      <div className="info-section">
        {contact.email && (
          <p className="info-item">
            <Mail className="info-icon" />
            <strong>Email : </strong>
            {contact.email}
          </p>
        )}
        {contact.phone && (
          <p className="info-item">
            <Phone className="info-icon" />
            <strong>Phone : </strong>
            {contact.phone}
          </p>
        )}
        {contact.address && (
          <p className="info-item">
            <MapPin className="info-icon" />
            <strong>Address : </strong>
            {contact.address}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="user-profile-modal">
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

          .user-profile-modal {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
            backdrop-filter: blur(5px);
          }

          .modal-container {
            position: relative;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
            border: 2px solid var(--gold-accent);
            padding: 24px;
            border-radius: 15px;
            max-width: 520px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
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
          }

          .header-section {
            display: flex;
            flex-direction: row;
            align-items: stretch;
            gap: 16px;
            margin-bottom: 16px;
          }

          .header-image-container {
            flex: 0 0 40%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .profile-image {
            width: 100%;
            // height: 180px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid var(--neutral-gray);
            background: #f3e8d7;
          }

          .header-content {
            flex: 0 0 60%;
            text-align: left;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .name {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--primary-text);
            margin-bottom: 4px;
          }

          .sub-name {
            text-align: left;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            font-style: italic;
            color: var(--secondary-text);
            margin-bottom: 4px;
          }


          .bio-container {
            position: relative;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
          }

          .bio {
            width: 100%;
            margin: 0;
            padding-right: 36px; /* Ensures text doesn't go under the icon */
            box-sizing: border-box;
          }

          .bio.justify-text {
            text-align: justify;
          }

          .copy-btn {
            background: none;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .copy-btn:hover,
          .copy-btn:focus {
            transform: scale(1.05);
            outline: none;
          }

          .copy-btn svg {
            width: 16px;
            height: 16px;
            color: var(--primary-text);
          }

          .bio-copy-fixed {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            transition: none; /* Remove animation to prevent movement */
            padding: 4px;
            z-index: 1;
          }

          .tabs-container {
            display: flex;
            justify-content: space-around;
            margin-bottom: 24px;
            padding: 8px 16px;
            background-color: #f3e8d7;
            border-radius: 8px;
            border-bottom: 1px solid var(--neutral-gray);
          }

          .tab-btn {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            background: none;
            border: none;
            border-radius: 6px;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .tab-btn.active {
            font-weight: 600;
            background: linear-gradient(135deg, #e9d4b0 0%, #c7b299 100%);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .tab-btn:hover:not(.active),
          .tab-btn:focus:not(.active) {
            background: linear-gradient(135deg, #f3e8d7 0%, #e5d9c5 100%);
            border-radius: 6px;
            outline: none;
          }

          .tab-btn svg {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            color: var(--primary-text);
          }

          .info-section {
            color: var(--primary-text);
            line-height: 1.6;
          }

          .info-item {
            display: flex;
            align-items: center;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            margin-bottom: 8px;
          }

          .info-item strong {
            margin-right: 8px;
          }

          .info-item.nested {
            margin-left: 40px;
          }

          .info-header {
            display: flex;
            align-items: center;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            font-weight: 600;
            color: var(--primary-text);
            margin-bottom: 8px;
          }

          .info-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            color: var(--primary-text);
          }

          .female-icon {
            color: #e9d4b0;
          }

          .family-label {
            margin-right: 32px;
          }

          .info-link {
            color: var(--primary-dark);
            margin-left: 4px;
            transition: all 0.3s ease;
          }

          .info-link:hover,
          .info-link:focus {
            color: var(--primary-hover);
            outline: none;
          }

           /* Responsive: stack columns on small screens */
          @media (max-width: 600px) {
            .header-section {
              gap: 8px;
            }
            .header-image-container,
            .header-content {
              flex: 1 1 100%;
              width: 100%;
            }
            .profile-image {
              width: 100%;
              height: 140px;
            }

            ..bio{
              padding-right: 0; /* Remove right padding on small screens */
            }

            .tab-btn {
              padding: 4px 8px;
            }
          }
        `}
      </style>

      <div className="modal-container">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X />
        </button>

        <div className="header-section">
          <div class="header-image-container">
            {user.photo ? (
              <img
                src={user.photo}
                alt={user.name || "Profile"}
                className="profile-image"
                style={{ width: "100%", height: "auto" }}
              />
            ) : user.gender && String(user.gender).toLowerCase() === "male" ? (
              <img
                src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                alt="Male profile"
                className="profile-image"
                style={{ width: "100%", height: "auto" }}
              />
            ) : (
              <img
                src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.jpg"
                alt="Female profile"
                className="profile-image"
                style={{ width: "100%", height: "auto" }}
              />
            )}
          </div>
          <div className="header-content">
            <h2 className="name">{user.name_in_nepali || user.name || "-"}</h2>
            <p className="sub-name">{user.name || "-"}</p>
            {/* Main bio with copy icon */}
            {user.bio && (
              <div className="bio-container">
                <p className="bio justify-text">{user.bio}</p>
                <button
                  onClick={handleCopy}
                  className="copy-btn bio-copy-fixed"
                  title="Copy bio"
                  style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                  <FaCopy />
                </button>
              </div>
            )}
            {/* Sibling bio */}
            {Array.isArray(user.bio_siblings) && user.bio_siblings.length > 0 && user.bio_siblings[0].trim() && (

              <>
                <hr style={{ margin: "8px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
                <div className="bio-container">
                  <p className="bio justify-text" style={{ marginRight: "36px" }}>{user.bio_siblings}</p>
                  <button
                    onClick={handleCopySiblings}
                    className="copy-btn bio-copy-fixed"
                    title="Copy bio of Siblings"
                    style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                  >
                    <FaCopy />
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>

        <div className="tabs-container">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`tab-btn ${activeTab === id ? "active" : ""}`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "family" && renderFamilyRelations()}
          {activeTab === "contact" && renderContact()}
        </div>
      </div>
    </div>
  );
};

UserProfileModal.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    name_in_nepali: PropTypes.string,
    gender: PropTypes.string,
    photo: PropTypes.string,
    bio: PropTypes.string,
    dateOfBirth: PropTypes.string,
    lifestatus: PropTypes.string,
    date_of_death: PropTypes.string,
    profession: PropTypes.string,
    contact_details: PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
    }),
    grandfather: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      name_in_nepali: PropTypes.string,
    }),
    grandmother: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      name_in_nepali: PropTypes.string,
    }),
    father: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      name_in_nepali: PropTypes.string,
    }),
    mother: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      name_in_nepali: PropTypes.string,
    }),
    spouse: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        name_in_nepali: PropTypes.string,
        gender: PropTypes.string,
      })
    ),
    siblings: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        name_in_nepali: PropTypes.string,
        gender: PropTypes.string,
      })
    ),
    children: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        name_in_nepali: PropTypes.string,
        gender: PropTypes.string,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
};

export default UserProfileModal;
