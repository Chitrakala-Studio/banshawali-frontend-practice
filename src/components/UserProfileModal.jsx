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
  FaUserAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const UserProfileModal = ({ user, onClose }) => {
  console.log(user);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal", icon: UserCircle },
    { id: "family", label: "Family", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const renderPersonalInfo = () => (
    <div style={{ color: "#1F2937", lineHeight: "1.6" }}>
      <p style={{ display: "flex", alignItems: "center" }}>
        {user.gender === "Male" ? (
          <FaMale
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        ) : (
          <FaFemale
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        )}
        <strong style={{ marginRight: "4px" }}>Gender:</strong> {user.gender}
      </p>
      {user.dateOfBirth && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaBirthdayCake
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Date of Birth:</strong>{" "}
          {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaHeart
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Life Status:</strong>{" "}
          {user.lifestatus}
        </p>
      )}
      {user.date_of_death && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaSkullCrossbones
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Date of Death:</strong>{" "}
          {user.date_of_death}
        </p>
      )}
      {user.profession && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <Briefcase
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Profession:</strong>{" "}
          {user.profession}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => (
    <div style={{ color: "#1F2937", lineHeight: "1.6" }}>
      {user.grandfather?.name && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaMale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#3B82F6",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Grandfather:</strong>{" "}
          {user.grandfather.name}
        </p>
      )}
      {user.grandmother?.name && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaFemale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#EC4899",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Grandmother:</strong>{" "}
          {user.grandmother.name}
        </p>
      )}
      {user.father?.name && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaMale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#3B82F6",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Father:</strong>
          <Link
            to={`/${user.father.id}`}
            style={{ color: "#3B82F6", marginLeft: "4px" }}
          >
            {user.father.name}
          </Link>
        </p>
      )}
      {user.mother?.name && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaFemale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#EC4899",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Mother:</strong>
          <Link
            to={`/${user.mother.id}`}
            style={{ color: "#3B82F6", marginLeft: "4px" }}
          >
            {user.mother.name}
          </Link>
        </p>
      )}
      {user.spouse?.name && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <FaUser
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Spouse:</strong>
          <Link
            to={`/${user.spouse.id}`}
            style={{ color: "#3B82F6", marginLeft: "4px" }}
          >
            {user.spouse.name}
          </Link>
        </p>
      )}
      {user.siblings && user.siblings.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <FaUser
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />{" "}
            Siblings:
          </p>
          {user.siblings.map((sibling) => (
            <p
              key={sibling.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "1.75rem",
              }}
            >
              <FaUser
                style={{ width: "16px", height: "16px", marginRight: "4px" }}
              />
              <Link
                to={`/${sibling.id}`}
                style={{ color: "#3B82F6", marginLeft: "4px" }}
              >
                {sibling.name}
              </Link>
            </p>
          ))}
        </div>
      )}
      {user.children && user.children.length > 0 && (
        <div>
          <p
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <Users
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />{" "}
            Children:
          </p>
          {user.children.map((child) => (
            <p
              key={child.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "1.75rem",
              }}
            >
              <FaUser
                style={{ width: "16px", height: "16px", marginRight: "4px" }}
              />
              <Link
                to={`/${child.id}`}
                style={{ color: "#3B82F6", marginLeft: "4px" }}
              >
                {child.name}
              </Link>
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div style={{ color: "#1F2937", lineHeight: "1.6" }}>
      {user.contact_details?.email && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <Mail style={{ width: "20px", height: "20px", marginRight: "8px" }} />
          <strong style={{ marginRight: "4px" }}>Email:</strong>{" "}
          {user.contact_details.email}
        </p>
      )}
      {user.contact_details?.phone && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <Phone
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Phone:</strong>{" "}
          {user.contact_details.phone}
        </p>
      )}
      {user.contact_details?.address && (
        <p style={{ display: "flex", alignItems: "center" }}>
          <MapPin
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Address:</strong>{" "}
          {user.contact_details.address}
        </p>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: "right",
            color: "#4B5563",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X style={{ width: "24px", height: "24px" }} />
        </button>

        {/* Header section with image on the left */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          {user.photo ? (
    <img
      src={user.photo}
      alt={user.name}
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "0", // Square shape
        objectFit: "cover",
        marginRight: "16px",
        border: "2px solid #D1D5DB",
      }}
    />
  ) : user.gender === "Male" ? (
    <img src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
      style={{
        width: "150px",
        height: "150px",
        marginRight: "16px",
        border: "2px solid #D1D5DB",
      }}
    />
  ) : (
    <img src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
      style={{
        width: "150px",
        height: "150px",
        marginRight: "16px",
        border: "2px solid #D1D5DB",
      }}
    />
  )}
          <div>
            <h2
              style={{ fontSize: "24px", fontWeight: "bold", color: "#1F2937" }}
            >
              {user.name}
            </h2>
            <p
              style={{ color: "#4B5563", fontStyle: "italic", margin: "4px 0" }}
            >
              {user.name_in_nepali}
            </p>
            <p style={{ color: "#4B5563", fontStyle: "italic" }}>{user.bio}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "24px",
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "8px",
          }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                transition: "all 0.3s",
                borderBottom: activeTab === id ? "2px solid #3B82F6" : "none",
                color: activeTab === id ? "#3B82F6" : "#4B5563",
                fontWeight: activeTab === id ? "bold" : "normal",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
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
