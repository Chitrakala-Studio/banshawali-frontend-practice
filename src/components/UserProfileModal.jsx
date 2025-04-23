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
  console.log(user);
  const [activeTab, setActiveTab] = useState("personal");

  const handleCopy = () => {
    navigator.clipboard
      .writeText(user.bio)
      .then(() => {
        alert("Bio copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: UserCircle },
    { id: "family", label: "Family", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const renderPersonalInfo = () => (
    <div style={{ color: "#f49D37", lineHeight: "1.6" }}>
      <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
        {user.gender === "Male" ? (
          <FaMale
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        ) : (
          <FaFemale
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
        )}
        <strong style={{ marginRight: "7px" }}>Gender</strong>
        {user.gender}
      </p>
      {user.dateOfBirth && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaBirthdayCake
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "7px" }}>Date of Birth</strong>
          {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaHeart
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "14px" }}>Status</strong>
          {user.lifestatus}
        </p>
      )}
      {user.date_of_death && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaSkullCrossbones
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Date of Death</strong>
          {user.date_of_death}
        </p>
      )}
      {user.profession && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <Briefcase
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Profession</strong>
          {user.profession}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => (
    <div style={{ color: "#f49D37", lineHeight: "1.6" }}>
      {user.grandfather?.name && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaMale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#3B82F6",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Grandfather</strong>
          {user.grandfather.name_in_nepali}
        </p>
      )}
      {user.grandmother?.name && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaFemale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#EC4899",
            }}
          />
          <strong style={{ marginRight: "4px" }}>Grandmother</strong>
          {user.grandmother.name_in_nepali}
        </p>
      )}
      {user.father?.name && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaMale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#3B82F6",
            }}
          />
          <strong style={{ marginRight: "2.5rem" }}>Father</strong>
          <Link
            to={`/${user.father.id}`}
            onClick={onClose}
            style={{ color: "#3B82F6", marginLeft: "4px" }}
          >
            {user.father.name_in_nepali}
          </Link>
        </p>
      )}
      {user.mother?.name && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <FaFemale
            style={{
              width: "20px",
              height: "20px",
              marginRight: "8px",
              color: "#EC4899",
            }}
          />
          <strong style={{ marginRight: "2.5rem" }}>Mother</strong>
          <Link
            to={`/${user.mother.id}`}
            onClick={onClose}
            style={{ color: "#3B82F6", marginLeft: "4px" }}
          >
            {user.mother.name_in_nepali}
          </Link>
        </p>
      )}
      {user.spouse && user.spouse.length > 0 && (
        <div>
          <p
            style={{
              color: "#ffff",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <Users
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />{" "}
            Spouse
          </p>
          {user.spouse.map((spouse) => (
            <p
              key={spouse.id}
              style={{
                color: "#ffff",
                display: "flex",
                alignItems: "center",
                marginLeft: "4rem",
              }}
            >
              <FaUser
                style={{ width: "16px", height: "16px", marginRight: "4px" }}
              />
              <Link
                to={`/${spouse.id}`}
                onClick={onClose}
                style={{ color: "#3B82F6", marginLeft: "4px" }}
              >
                {spouse.name_in_nepali}
              </Link>
            </p>
          ))}
        </div>
      )}
      {user.siblings && user.siblings.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              color: "#ffff",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <FaUser
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />{" "}
            Siblings
          </p>
          {user.siblings.map((sibling) => (
            <p
              key={sibling.id}
              style={{
                color: "#ffff",
                display: "flex",
                alignItems: "center",
                marginLeft: "6.3rem",
              }}
            >
              <FaUser
                style={{ width: "16px", height: "16px", marginRight: "4px" }}
              />
              <Link
                to={`/${sibling.id}`}
                onClick={onClose}
                style={{ color: "#3B82F6", marginLeft: "4px" }}
              >
                {sibling.name_in_nepali}
              </Link>
            </p>
          ))}
        </div>
      )}
      {user.children && user.children.length > 0 && (
        <div>
          <p
            style={{
              color: "#ffff",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <Users
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />{" "}
            Children
          </p>
          {user.children.map((child) => (
            <p
              key={child.id}
              style={{
                color: "#ffff",
                display: "flex",
                alignItems: "center",
                marginLeft: "6.5rem",
              }}
            >
              <FaUser
                style={{ width: "16px", height: "16px", marginRight: "4px" }}
              />
              <Link
                to={`/${child.id}`}
                onClick={onClose}
                style={{ color: "#3B82F6", marginLeft: "4px" }}
              >
                {child.name_in_nepali}
              </Link>
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div style={{ color: "#f49D37", lineHeight: "1.6" }}>
      {user.contact_details?.email && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <Mail style={{ width: "20px", height: "20px", marginRight: "8px" }} />
          <strong style={{ marginRight: "4px" }}>Email</strong>{" "}
          {user.contact_details.email}
        </p>
      )}
      {user.contact_details?.phone && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <Phone
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Phone</strong>{" "}
          {user.contact_details.phone}
        </p>
      )}
      {user.contact_details?.address && (
        <p style={{ color: "#ffff", display: "flex", alignItems: "center" }}>
          <MapPin
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Address</strong>{" "}
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
          backgroundColor: "#14632f",
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
            color: "#ffff",
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
                borderRadius: "0",
                objectFit: "cover",
                marginRight: "16px",
                border: "2px solid #D1D5DB",
              }}
            />
          ) : user.gender === "Male" ? (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
              style={{
                width: "150px",
                height: "150px",
                marginRight: "16px",
                border: "2px solid #D1D5DB",
              }}
            />
          ) : (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
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
              style={{ fontSize: "24px", fontWeight: "bold", color: "#800000" }}
            >
              {user.name_in_nepali}
            </h2>
            <p style={{ color: "#ffff", fontStyle: "italic", margin: "4px 0" }}>
              {user.name}
            </p>
            {user.bio && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  style={{
                    color: "#ffff",
                    fontStyle: "italic",
                    margin: "4px 0",
                  }}
                >
                  {user.bio}
                </p>
                <button
                  onClick={handleCopy}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "8px",
                  }}
                  title="Copy bio"
                >
                  <FaCopy
                    style={{ width: "16px", height: "16px", color: "#3B82F6" }}
                  />
                </button>
              </div>
            )}
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
                borderBottom: activeTab === id ? "2px solid #f49D37" : "none",
                color: activeTab === id ? "#f49D37" : "#ffff",
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
