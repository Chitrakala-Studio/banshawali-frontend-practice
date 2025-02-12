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
} from "react-icons/fa";
import { Link } from "react-router-dom";

const InfoSection = ({ person }) => {
  return (
    <div className="pb-12 bg-black">
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
            <div
              className={`flex items-center ${
                person.date_of_death ? "border-b border-gray-600 pb-3" : ""
              }`}
            >
              <FaBirthdayCake className="mr-2 text-xl" />
              <p className="text-l mt-0 text-white">
                {person.date_of_birth || "N/A"}
              </p>
            </div>
            {person.date_of_death && (
              <div className="flex items-center">
                <FaSkullCrossbones className="mr-2 text-xl" />
                <p className="text-l text-white mt-0">{person.date_of_death}</p>
              </div>
            )}
          </div>
        </div>

        {/* Family Information Box */}
        {(person.father || person.mother) && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Family</h3>
            <div className="space-y-3">
              {person.father && (
                <div
                  className={`flex items-center ${
                    person.mother ? "border-b border-gray-600 pb-3" : ""
                  }`}
                >
                  <FaMale className="mr-2 text-xl" />
                  <p className="text-l text-white mt-1">
                    {person.father.name && person.father.name !== "N/A" ? (
                      <Link
                        to={`/${person.father.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.father.name}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              )}
              {person.mother && (
                <div className="flex items-center">
                  <FaFemale className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {person.mother.name && person.mother.name !== "N/A" ? (
                      <Link
                        to={`/${person.mother.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.mother.name}
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information Box */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-m mb-4">Contact Information</h3>
          <div className="space-y-3">
            {person.contact_details.phone && (
              <div
                className={`flex items-center ${
                  person.contact_details.email || person.contact_details.address
                    ? "border-b border-gray-600 pb-3"
                    : ""
                }`}
              >
                <FaPhone className="mr-2 text-xl" />
                <p className="text-l text-white mt-1">
                  {person.contact_details.phone || "N/A"}
                </p>
              </div>
            )}
            {person.contact_details.email && (
              <div
                className={`flex items-center ${
                  person.contact_details.address
                    ? "border-b border-gray-600 pb-3"
                    : ""
                }`}
              >
                <FaEnvelope className="mr-2 text-xl" />
                <p className="text-l text-white mt-0">
                  {person.contact_details.email || "N/A"}
                </p>
              </div>
            )}
            {person.contact_details.address && (
              <div className="flex items-center">
                <FaAddressCard className="mr-2 text-xl" />
                <p className="text-l text-white mt-0">
                  {person.contact_details.address || "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Professional Information Box */}
        {person.profession && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-m mb-4">Professional Information</h3>
            <div className="flex items-center">
              <FaBriefcase className="mr-2 text-xl" />
              <p className="text-l text-white mt-0">
                {person.profession || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;
