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

  if (!user) {
    return null; // Prevent rendering if user is undefined
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
    <div style={{ color: "#2E4568", lineHeight: "1.6" }}>
      <p style={{ color: "#2E4568", display: "flex", alignItems: "center" }}>
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
        {user.gender || "-"}
      </p>
      {user.dateOfBirth && (
        <p style={{ color: "#2E4568", display: "flex", alignItems: "center" }}>
          <FaBirthdayCake
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "7px" }}>Date of Birth</strong>
          {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p style={{ color: "#2E4568", display: "flex", alignItems: "center" }}>
          <FaHeart
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "14px" }}>Status</strong>
          {user.lifestatus}
        </p>
      )}
      {user.date_of_death && (
        <p style={{ color: "#2E4568", display: "flex", alignItems: "center" }}>
          <FaSkullCrossbones
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Date of Death</strong>
          {user.date_of_death}
        </p>
      )}
      {user.profession && (
        <p style={{ color: "#2E4568", display: "flex", alignItems: "center" }}>
          <Briefcase
            style={{ width: "20px", height: "20px", marginRight: "8px" }}
          />
          <strong style={{ marginRight: "4px" }}>Profession</strong>
          {user.profession}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => {
    // Common style objects
    const iconBase = { width: 20, height: 20, marginRight: 8 };
    const maleIconStyle = { ...iconBase, color: "#2E4568" };
    const femaleIconStyle = { ...iconBase, color: "#E9D4B0" };
    const itemStyle = {
      color: "#2E4568",
      display: "flex",
      alignItems: "center",
    };
    const labelStyle = { marginRight: "2rem" };
    const linkStyle = { color: "#2E4568", marginLeft: "4px" };
    const headerStyle = {
      color: "#2E4568",
      display: "flex",
      alignItems: "center",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    };

    return (
      <div style={{ color: "#2E4568", lineHeight: "1.6" }}>
        {/* Grandfather (always male) */}
        {user.grandfather?.name && (
          <p style={itemStyle}>
            <FaMale style={maleIconStyle} />
            <strong style={labelStyle}>Grandfather</strong>
            {user.grandfather.name_in_nepali || user.grandfather.name || "-"}
          </p>
        )}

        {/* Grandmother (always female) */}
        {user.grandmother?.name && (
          <p style={itemStyle}>
            <FaFemale style={femaleIconStyle} />
            <strong style={labelStyle}>Grandmother</strong>
            {user.grandmother.name_in_nepali || user.grandmother.name || "-"}
          </p>
        )}

        {/* Father (always male) */}
        {user.father?.id && (
          <p style={itemStyle}>
            <FaMale style={maleIconStyle} />
            <strong style={labelStyle}>Father</strong>
            <Link to={`/${user.father.id}`} onClick={onClose} style={linkStyle}>
              {user.father.name_in_nepali || user.father.name || "-"}
            </Link>
          </p>
        )}

        {/* Mother (always female) */}
        {user.mother?.id && (
          <p style={itemStyle}>
            <FaFemale style={femaleIconStyle} />
            <strong style={labelStyle}>Mother</strong>
            <Link to={`/${user.mother.id}`} onClick={onClose} style={linkStyle}>
              {user.mother.name_in_nepali || user.mother.name || "-"}
            </Link>
          </p>
        )}

        {/* Spouse */}
        {user.spouse?.length > 0 && (
          <>
            <p style={headerStyle}>
              <Users style={{ ...iconBase, marginRight: 8 }} />
              Spouse
            </p>
            {user.spouse.map((sp) => (
              <p key={sp.id} style={{ ...itemStyle, marginLeft: "4rem" }}>
                {sp.gender === "Female" ? (
                  <FaFemale style={femaleIconStyle} />
                ) : (
                  <FaMale style={maleIconStyle} />
                )}
                <Link to={`/${sp.id}`} onClick={onClose} style={linkStyle}>
                  {sp.name_in_nepali || sp.name || "-"}
                </Link>
              </p>
            ))}
          </>
        )}

        {/* Siblings */}
        {user.siblings?.length > 0 && (
          <>
            <p style={headerStyle}>
              <FaUser style={{ ...iconBase, marginRight: 8 }} />
              Siblings
            </p>
            {user.siblings.map((sib) => {
              const isFemale = String(sib.gender).toLowerCase() === "female";
              return (
                <p key={sib.id} style={{ ...itemStyle, marginLeft: "6.3rem" }}>
                  {isFemale ? (
                    <FaFemale style={femaleIconStyle} />
                  ) : (
                    <FaMale style={maleIconStyle} />
                  )}
                  <Link to={`/${sib.id}`} onClick={onClose} style={linkStyle}>
                    {sib.name_in_nepali || sib.name || "-"}
                  </Link>
                </p>
              );
            })}
          </>
        )}

        {/* Children */}
        {user.children?.length > 0 && (
          <>
            <p style={headerStyle}>
              <Users style={{ ...iconBase, marginRight: 8 }} />
              Children
            </p>
            {user.children.map((child) => {
              const isFemale = String(child.gender).toLowerCase() === "female";
              return (
                <p
                  key={child.id}
                  style={{ ...itemStyle, marginLeft: "6.5rem" }}
                >
                  {isFemale ? (
                    <FaFemale style={femaleIconStyle} />
                  ) : (
                    <FaMale style={maleIconStyle} />
                  )}
                  <Link to={`/${child.id}`} onClick={onClose} style={linkStyle}>
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
      <div style={{ color: "#2E4568", lineHeight: "1.6" }}>
        {contact.email && (
          <p
            style={{ color: "#2E4568", display: "flex", alignItems: "center" }}
          >
            <Mail
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            <strong style={{ marginRight: "4px" }}>Email</strong>
            {contact.email}
          </p>
        )}
        {contact.phone && (
          <p
            style={{ color: "#2E4568", display: "flex", alignItems: "center" }}
          >
            <Phone
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            <strong style={{ marginRight: "4px" }}>Phone</strong>
            {contact.phone}
          </p>
        )}
        {contact.address && (
          <p
            style={{ color: "#2E4568", display: "flex", alignItems: "center" }}
          >
            <MapPin
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            <strong style={{ marginRight: "4px" }}>Address</strong>
            {contact.address}
          </p>
        )}
      </div>
    );
  };

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
          backgroundColor: "#A6C8A5",
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
            color: "#2E4568",
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
              alt={user.name || "Profile"}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "0",
                objectFit: "cover",
                marginRight: "16px",
                border: "2px solid #AAABAC",
              }}
            />
          ) : user.gender === "Male" ? (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
              style={{
                width: "150px",
                height: "150px",
                marginRight: "16px",
                border: "2px solid #AAABAC",
              }}
            />
          ) : (
            <img
              src="https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
              style={{
                width: "150px",
                height: "150px",
                marginRight: "16px",
                border: "2px solid #AAABAC",
              }}
            />
          )}
          <div>
            <h2
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2E4568" }}
            >
              {user.name_in_nepali || user.name || "-"}
            </h2>
            <p
              style={{ color: "#2E4568", fontStyle: "italic", margin: "4px 0" }}
            >
              {user.name || "-"}
            </p>
            {user.bio && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <p
                  style={{
                    color: "#2E4568",
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
                    style={{ width: "16px", height: "16px", color: "#2E4568" }}
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
            padding: "8px 16px",
            backgroundColor: "#B9BAC3",
            borderRadius: "8px",
            borderBottom: "1px solid #AAABAC",
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
                transition: "all 0.3s ease",
                borderBottom: "none",
                color: activeTab === id ? "#2E4568" : "#2E4568",
                fontWeight: activeTab === id ? "bold" : "normal",
                background:
                  activeTab === id
                    ? "linear-gradient(135deg, #E9D4B0 0%, #C7B299 100%)"
                    : "none",
                borderRadius: activeTab === id ? "6px" : "0",
                boxShadow:
                  activeTab === id ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
                cursor: "pointer",
                border: "none",
              }}
              onMouseOver={(e) => {
                if (activeTab !== id) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #B9BAC3 0%, #A6C8A5 100%)";
                  e.currentTarget.style.borderRadius = "6px";
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== id) {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.borderRadius = "0";
                }
              }}
            >
              <Icon
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  color: activeTab === id ? "#2E4568" : "#2E4568",
                }}
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
