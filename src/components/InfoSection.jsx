import React from "react";
import {
  FaUser,
  FaVenusMars,
  FaBirthdayCake,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaFemale,
  FaMale,
  FaAddressCard,
  FaSkullCrossbones,
  FaHeart,
} from "react-icons/fa";
import { Users, LucideBookUser } from "lucide-react";
import { Link } from "react-router-dom";

const InfoSection = ({ person }) => {
  return (
    <div className="info-section">
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

          .info-section {
            padding: 0 0 80px 0; /* ensure enough space for footer on all devices */
            width: 100%;
            box-sizing: border-box;
          }

          .info-container {
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 12px 0 24px 0;
          }

          .info-box {
            background-color: #fffaf0;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid var(--neutral-gray);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          
          }

          .box-title {
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 600;
            color: var(--gold-accent);
            margin-bottom: 12px;
          }

          .info-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .info-item {
            display: flex;
            align-items: center;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            padding-bottom: 12px;
            border-bottom: 1px solid var(--neutral-gray);
          }

          .info-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .info-icon {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            color: var(--primary-text);
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

          .no-margin{
            margin-top:0px;
          }
          .space-spouse{ 
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: 28,
                      width: "100%",
                      gap: "6px", // Add space between each spouse
                    }
      
            
  @media (max-width: 799px) {
    .info-section {
      padding-bottom: 55px;
    }

  }

  @media (min-width: 800px) {
    .info-section {
      padding-bottom: 110px; /* extra gap for desktop/tablet footer */
    }
  }
        `}
      </style>

      <div className="info-container">
        {/* Personal Information Box */}
        <div className="info-box">
          <h3 className="box-title">Personal Information</h3>
          <div className="info-list">
        
            <div className="info-item">
              <FaUser className="info-icon" />
              {person.name && (
                <p className="no-margin">{person.name_in_nepali}</p>
              )}
            </div>

            <div className="info-item">
              {person.gender === "Male" ? (
                <FaMale className="info-icon" />
              ) : (
                <FaFemale className="info-icon" />
              )}
              {person.gender && <p className="no-margin">{person.gender}</p>}
            </div>

            {person.book_id && (
              <div className="info-item">
                <LucideBookUser className="info-icon" />
                <span>{person.book_id}</span>
              </div>
            )}

            {person.date_of_birth && (
              <div className="info-item">
                <FaBirthdayCake className="info-icon" />
                <p>{person.date_of_birth}</p>
              </div>
            )}

            {person.date_of_death && (
              <div className="info-item">
                <FaSkullCrossbones className="info-icon" />
                <p>{person.date_of_death}</p>
              </div>
            )}

            {person.blood && (
              <div className="info-item">
                <FaHeart className="info-icon" style={{ color: '#F49D37' }} />
                <p className="no-margin">Blood Group: {person.blood}</p>
              </div>
            )}
            
          </div>
        </div>

        {/* Family Information Box */}
        {(person.father?.name ||
          person.mother?.name ||
          person.grandfather?.name ||
          person.grandmother?.name ||
          person.spouse?.length > 0 ||
          person.children?.length > 0) && (
          <div className="info-box">
            <h3 className="box-title">Family</h3>
            <div className="info-list">
              {person.father?.name && (
                <div className="info-item">
                  <FaMale className="info-icon" />
                  <p className="no-margin">
                    Father:{" "}
                    <Link to={`/${person.father.id}`} className="info-link">
                      {person.father.name_in_nepali}
                    </Link>
                  </p>
                </div>
              )}

              {person.mother?.name && (
                <div className="info-item">
                  <FaFemale className="info-icon" />
                  <p className="no-margin">
                    Mother:{" "}
                    <Link to={`/${person.mother.id}`} className="info-link">
                      {person.mother.name_in_nepali}
                    </Link>
                  </p>
                </div>
              )}

              {person.grandfather?.name &&
                person.grandfather.name !== "N/A" && (
                  <div className="info-item">
                    <FaMale className="info-icon" />
                    <p className="no-margin">
                      GrandFather:{" "}
                      <Link
                        to={`/${person.grandfather.id}`}
                        className="info-link"
                      >
                        {person.grandfather.name_in_nepali}
                      </Link>
                    </p>
                  </div>
                )}

              {person.grandmother?.name &&
                person.grandmother.name !== "N/A" && (
                  <div className="info-item">
                    <FaFemale className="info-icon" />
                    <p className="no-margin">
                      GrandMother:{" "}
                      <Link
                        to={`/${person.grandmother.id}`}
                        className="info-link"
                      >
                        {person.grandmother.name_in_nepali}
                      </Link>
                    </p>
                  </div>
                )}

              {person.spouse?.length > 0 && (
                <div
                  className="info-item"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "12px", // Add space after spouse section
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUser className="info-icon" />
                    <span style={{ fontWeight: 500, marginLeft: 4 }}>
                      Spouse
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: 28,
                      width: "100%",
                      gap: "6px", // Add space between each spouse
                    }}
                  >
                    {person.spouse.map((spouse, index) => (
                      <span
                        key={spouse.id || index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {spouse.gender === "Female" ? (
                          <FaFemale
                            className="info-icon"
                            style={{ marginRight: 4 }}
                          />
                        ) : (
                          <FaMale
                            className="info-icon"
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Link to={`/${spouse.id}`} className="info-link">
                          {spouse.name_in_nepali}
                        </Link>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {person.children?.length > 0 && (
                <div
                  className="info-item"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginBottom: "12px", // Add space after children section
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUser className="info-icon" />
                    <span style={{ fontWeight: 500, marginLeft: 4 }}>
                      Children
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: 28,
                      width: "100%",
                      gap: "6px", // Add space between each child
                    }}
                  >
                    {person.children.map((child, index) => (
                      <span
                        key={child.id || index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {child.gender === "Female" ? (
                          <FaFemale
                            className="info-icon"
                            style={{ marginRight: 4 }}
                          />
                        ) : (
                          <FaMale
                            className="info-icon"
                            style={{ marginRight: 4 }}
                          />
                        )}
                        <Link to={`/${child.id}`} className="info-link">
                          {child.name_in_nepali}
                        </Link>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information Box */}
        {((person.contact_details?.phone &&
          person.contact_details?.phone !== "") ||
          (person.contact_details?.email &&
            person.contact_details?.email !== "") ||
          (person.contact_details?.address &&
            person.contact_details?.address !== "()")) && (
          <div className="info-box">
            <h3 className="box-title">Contact Information</h3>
            <div className="info-list">
              {person.contact_details.phone && (
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <p className="no-margin">
                    {person.contact_details.phone || "N/A"}
                  </p>
                </div>
              )}
              {person.contact_details.email && (
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <p className="no-margin">
                    {person.contact_details.email || "N/A"}
                  </p>
                </div>
              )}
              {person.contact_details.address && (
                <div className="info-item">
                  <FaAddressCard className="info-icon" />
                  <p className="no-margin">
                    {person.contact_details.address || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Professional Information Box */}
        {(person.profession || person.designation || person.company || person.location) && (
          <div className="info-box">
            <h3 className="box-title">Professional Information</h3>
            <div className="info-list">
              {person.profession && (
                <div className="info-item">
                  <FaBriefcase className="info-icon" />
                  <p>{person.profession || "N/A"}</p>
                </div>
              )}
              {(person.designation || person.company || person.location) && (
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <span style={{ fontWeight: 500 }}>Job:   </span>
                  {person.designation && <span>{person.designation}</span>}
                  {person.designation && (person.company || person.location) && <span>, </span>}
                  {person.company && <span>{person.company}</span>}
                  {person.company && person.location && <span>, </span>}
                  {person.location && <span>{person.location}</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;
