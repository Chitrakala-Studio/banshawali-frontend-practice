import React from "react";
import {
  FaUser,
  FaVenusMars,
  FaBirthdayCake,
  FaInfoCircle,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";

const InfoSection = ({ person }) => {
  return (
    <div className="w-full bg-black/90 text-white p-4 rounded-b-lg shadow-lg z-10 space-y-4">
      {/* Personal Information Box */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Personal Information</h3>
        <div className="space-y-3">
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaUser className="mr-2 text-xl" />
            <p className="text-l text-white mt-1">{person.name || "N/A"}</p>
          </div>
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaVenusMars className="mr-2 text-xl" />
            <p className="text-l mt-0 text-white">{person.gender || "N/A"}</p>
          </div>
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaBirthdayCake className="mr-2 text-xl" />
            <p className="text-l mt-0 text-white">
              {person.date_of_birth || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <FaInfoCircle className="mr-2 text-xl" />
            <p className="text-l text-white mt-0">{person.status || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Family Information Box */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Family Information</h3>
        <div className="space-y-3">
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaUser className="mr-2 text-xl" />
            <p className="text-l text-white mt-1">
              {person.family_relations.father || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2 text-xl" />
            <p className="text-l text-white mt-0">
              {person.family_relations.mother || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Box */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-m mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaPhone className="mr-2 text-xl" />
            <p className="text-l text-white mt-1">{person.phone || "N/A"}</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="mr-2 text-xl" />
            <p className="text-l text-white mt-0">{person.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Professional Information Box */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-m mb-4">Professional Information</h3>
        <div className="flex items-center">
          <FaBriefcase className="mr-2 text-xl" />
          <p className="text-l text-white mt-0">{person.profession || "N/A"}</p>
        </div>
      </div>

      {/* Genealogy and Lineage Box */}
      <div className="bg-gray-700 p-4 rounded-lg">
        <h3 className="font-bold text-m mb-4">Genealogy And Lineage</h3>
        <div className="space-y-3">
          <div className="flex items-center border-b border-gray-600 pb-3">
            <FaUsers className="mr-2 text-xl" />
            <p className="text-l text-white mt-0">
              {person.pusta_number || "N/A"}
            </p>
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-2 text-xl" />
            <p className="text-l text-white mt-0">
              {person.same_vamsha_status || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
