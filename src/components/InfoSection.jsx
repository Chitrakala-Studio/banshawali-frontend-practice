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
              {person.name &&
                <p className="text-l text-white mt-1">{person.name_in_nepali}</p>
              }
            </div>

            <div className={person.date_of_birth!==""? "flex items-center ":"flex items-center border-b border-gray-600 pb-3"}>

              {person.gender === "Male" ? (
                <FaMale className="mr-2 text-xl" />
              ) : (
                <FaFemale className="mr-2 text-xl" />
              )}
              {person.gender &&
                < p className="text-l mt-0 text-white">{person.gender}</p>
              }
          </div>
          {person.date_of_birth && (
          <div
            className={`flex items-center ${person.date_of_death ? "border-b border-gray-600 pb-3" : ""
              }`}
          >
            
            <FaBirthdayCake className="mr-2 text-xl" />
            <p className="text-l mt-0 text-white">
              {person.date_of_birth}
            </p>
            
          </div>
          )}
          {person.date_of_death && (
            <div className="flex items-center">
              <FaSkullCrossbones className="mr-2 text-xl" />
              <p className="text-l text-white mt-0">{person.date_of_death}</p>
            </div>
          )}
        </div>
      </div>

      {/* Family Information Box */}
      {(person.father?.name || person.mother?.name || person.grandfather?.name || person.grandmother?.name || person.spouse?.name || person.children?.length > 0) && (
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Family</h3>
          <div className="space-y-3">
            {person.father?.name  && (
              <div
                className={`flex items-center ${person.grandfather?.name || person.mother?.name || person.grandmother?.name || person.spouse?.name || person.children?.length > 0 ? "border-b border-gray-600 pb-3" : ""
                  }`}
              >
                {/* Parents */}
                <FaUser className="mr-2 text-xl" />
                <p className="text-l text-white mt-1">
                  {person.father?.name && person.father.name !== "N/A" && (
                    <>
                      Father:{" "}
                      <Link
                        to={`/${person.father.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.father.name_in_nepali}
                      </Link>
                    </>
                  )}
                  
                </p>
              </div>
            )}
             {person.father?.name  && (
              <div
                className={`flex items-center ${person.grandfather?.name || person.grandmother?.name || person.spouse?.name || person.children?.length > 0 ? "border-b border-gray-600 pb-3" : ""
                  }`}
              >
                {/* Parents */}
                <FaUser className="mr-2 text-xl" />
                <p className="text-l text-white mt-1">
                  {person.mother?.name && person.mother.name !== "N/A" && (
                    <>
                      Mother:{" "}
                      <Link
                        to={`/${person.mother.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.mother.name_in_nepali}
                      </Link>
                    </>
                  )}
                  
                </p>
              </div>
            )}
              
            {/* Grandparents */}
            {(person.grandfather?.name || person.grandmother?.name) && (
              <div className={`flex items-center ${person.spouse?.name || person.children?.length > 0 ? "border-b border-gray-600 pb-3" : ""
                }`}>
                <FaUser className="mr-2 text-xl" />
                <p className="text-l text-white mt-1">
                  {person.grandfather?.name && person.grandfather.name !== "N/A" && (
                    <>
                      GrandFather:{" "}
                      <Link
                        to={`/${person.grandfather.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.grandfather.name_in_nepali}
                      </Link>
                    </>
                  )}
                  {person.grandmother?.name && person.grandmother.name !== "N/A" && (
                    <>
                      GrandMother:{""}
                      <Link
                        to={`/${person.grandmother.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {person.grandmother.name_in_nepali} 
                      </Link>
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Spouse */}
            {person.spouse?.length > 0 && (
              <div className={person.children?.length > 0 ? "border-b border-gray-600 pb-3 flex items-center" : "flex items-center"}>
                
                <FaUser className="mr-2 text-xl" />

                <p className="text-l text-white mt-1">
                  Spouse:{" "}
                  {person.spouse.map((spouse, index) => (
                    <Link
                      key={index}
                      to={`/${spouse.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {spouse.name_in_nepali}
                      {index < person.spouse.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </p>
              </div>
            )}

            {/* Children */}
            {person.children?.length > 0 && (
              <div className="flex items-center">
                <FaUser className="mr-2 text-xl" />
                <p className="text-l text-white mt-1">
                  Children:{" "}
                  {person.children.map((child, index) => (
                    <Link
                      key={index}
                      to={`/${child.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {child.name_in_nepali}
                      {index < person.children.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Information Box */}

      {((person.contact_details?.phone && person.contact_details?.phone !== "") || (person.contact_details?.email && person.contact_details?.email !== "") || (person.contact_details?.address && person.contact_details?.address !== "()")) &&

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-m mb-4">Contact Information</h3>
          <div className="space-y-3">
            {person.contact_details.phone && (
              <div
                className={`flex items-center ${person.contact_details.email || person.contact_details.address
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
                className={`flex items-center ${person.contact_details.address
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
      }

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
    </div >
  );
};

export default InfoSection;