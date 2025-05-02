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

const UserProfileModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("personal");

  if (!user) {
    return null;
  }

  const handleCopy = () => {
    if (user.bio) {
      navigator.clipboard
        .writeText(user.bio)
        .then(() => {
          alert("Bio copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
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
        {user.gender === "Male" ? (
          <FaMale className="info-icon" />
        ) : (
          <FaFemale className="info-icon female-icon" />
        )}
        <strong>Gender</strong>
        {user.gender || "-"}
      </p>
      {user.dateOfBirth && (
        <p className="info-item">
          <FaBirthdayCake className="info-icon" />
          <strong>Date of Birth</strong>
          {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p className="info-item">
          <FaHeart className="info-icon" />
          <strong>Status</strong>
          {user.lifestatus}
        </p>
      )}
      {user.date_of_death && (
        <p className="info-item">
          <FaSkullCrossbones className="info-icon" />
          <strong>Date of Death</strong>
          {user.date_of_death}
        </p>
      )}
      {user.profession && (
        <p className="info-item">
          <Briefcase className="info-icon" />
          <strong>Profession</strong>
          {user.profession}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => {
    const iconBase = { width: 20, height: 20, marginRight: 8 };
    const maleIconStyle = { ...iconBase, color: "#2E4568" };
    const femaleIconStyle = { ...iconBase, color: "#E9D4B0" };

    return (
      <div className="info-section">
        {user.grandfather?.name && (
          <p className="info-item">
            <FaMale style={maleIconStyle} />
            <strong className="family-label">Grandfather</strong>
            {user.grandfather.name_in_nepali || user.grandfather.name || "-"}
          </p>
        )}

        {user.grandmother?.name && (
          <p className="info-item">
            <FaFemale style={femaleIconStyle} />
            <strong className="family-label">Grandmother</strong>
            {user.grandmother.name_in_nepali || user.grandmother.name || "-"}
          </p>
        )}

        {user.father?.id && (
          <p className="info-item">
            <FaMale style={maleIconStyle} />
            <strong className="family-label">Father</strong>
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
            <FaFemale style={femaleIconStyle} />
            <strong className="family-label">Mother</strong>
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
                {sp.gender === "Female" ? (
                  <FaFemale style={femaleIconStyle} />
                ) : (
                  <FaMale style={maleIconStyle} />
                )}
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
            {user.siblings.map((sib) => {
              const isFemale = String(sib.gender).toLowerCase() === "female";
              return (
                <p key={sib.id} className="info-item nested">
                  {isFemale ? (
                    <FaFemale style={femaleIconStyle} />
                  ) : (
                    <FaMale style={maleIconStyle} />
                  )}
                  <Link to={`/${sib.id}`} onClick={onClose} className="info-link">
                    {sib.name_in_nepali || sib.name || "-"}
                  </Link>
                </p>
              );
            })}
          </>
        )}

        {user.children?.length > 0 && (
          <>
            <p className="info-header">
              <Users style={{ width: 20, height: 20, marginRight: 8 }} />
              Children
            </p>
            {user.children.map((child) => {
              const isFemale = String(child.gender).toLowerCase() === "female";
              return (
                <p key={child.id} className="info-item nested">
                  {isFemale ? (
                    <FaFemale style={femaleIconStyle} />
                  ) : (
                    <FaMale style={maleIconStyle} />
                  )}
                  <Link
                    to={`/${child.id}`}
                    onClick={onClose}
                    className="info-link"
                  >
                    {child.name_in_nepali || child.name || "-"}
                  </Link>
                </p>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderContact = () => {
    const contact = user.contact_details || {};
    return (
      <div className="info-section">
        {contact.email && (
          <p className="info-item">
            <Mail className="info-icon" />
            <strong>Email</strong>
            {contact.email}
          </p>
        )}
        {contact.phone && (
          <p className="info-item">
            <Phone className="info-icon" />
            <strong>Phone</strong>
            {contact.phone}
          </p>
        )}
        {contact.address && (
          <p className="info-item">
            <MapPin className="info-icon" />
            <strong>Address</strong>
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
            float: right;
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
            align-items: center;
            margin-bottom: 24px;
            gap: 16px;
          }

          .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 0;
            object-fit: cover;
            border: 2px solid var(--neutral-gray);
          }

          .header-content {
            flex: 1;
          }

          .name {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            color: var(--primary-text);
            margin-bottom: 4px;
          }

          .sub-name {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            font-style: italic;
            color: var(--secondary-text);
            margin-bottom: 4px;
          }

          .bio-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .bio {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            font-style: italic;
            color: var(--secondary-text);
            margin: 0;
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
            font-weight: 500;
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
        `}
      </style>

      <div className="modal-container">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <X />
        </button>

        <div className="header-section">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name || "Profile"}
              className="profile-image"
            />
          ) : user.gender === "Male" ? (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
              className="profile-image"
            />
          ) : (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
              className="profile-image"
            />
          )}
          <div className="header-content">
            <h2 className="name">
              {user.name_in_nepali || user.name || "-"}
            </h2>
            <p className="sub-name">{user.name || "-"}</p>
            {user.bio && (
              <div className="bio-container">
                <p className="bio">{user.bio}</p>
                <button
                  onClick={handleCopy}
                  className="copy-btn"
                  title="Copy bio"
                >
                  <FaCopy />
                </button>
              </div>
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

export default UserProfileModal;