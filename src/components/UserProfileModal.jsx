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
import { FaBirthdayCake, FaFemale, FaHeart, FaMale, FaSkullCrossbones, FaUser} from "react-icons/fa";
import { Link } from 'react-router-dom';

const UserProfileModal = ({ user, onClose }) => {
  console.log(user);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal", icon: UserCircle },
    { id: "family", label: "Family", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-3 text-gray-800">
      <p className="flex items-center">
        {user.gender === "Male" ? (
          <FaMale className="w-5 h-5 mr-2" />
        ) : (
          <FaFemale className="w-5 h-5 mr-2" />
        )}
        <span className="font-semibold">Gender:</span> {user.gender}
      </p>
      {/* if user.dateofbirth */}
      {user.dateOfBirth && (
        <p className="flex items-center">
          <FaBirthdayCake className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Date of Birth:</span> {user.dateOfBirth}
        </p>
      )}
      {user.lifestatus && (
        <p className="flex items-center">
          <FaHeart className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Life Status:</span> {user.lifestatus}
        </p>
      )}

      {user.date_of_death && (
        <p className="flex items-center">
          <FaSkullCrossbones className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Date of Death:</span>{" "}
          {user.date_of_death}
        </p>
      )}
      { user.profession && (
        <p className="flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Profession:</span> {user.profession}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => (
    <div className="space-y-3 text-gray-800">
      {user.grandfather.name && (
        <p className="flex items-center">
          <FaMale className="w-5 h-5 mr-2 text-blue-500" />{" "}
          <span className="font-semibold">Grandfather:</span>{" "}
          {user.grandfather.name}
        </p>
      )}
      {user.grandmother.name && (
        <p className="flex items-center">
          <FaFemale className="w-5 h-5 mr-2 text-pink-500" />{" "}
          <span className="font-semibold">Grandmother:</span>{" "}
          {user.grandmother.name}
        </p>
      )}
      {user.father.name && (
        <p className="flex items-center">
          <FaMale className="w-5 h-5 mr-2 text-blue-500" />{" "}
          <span className="font-semibold">Father:</span> 
          <Link to={`/${user.father.id}`} className="text-blue-500 hover:underline">
            {user.father.name}
          </Link>
        </p>
      )}
      {user.mother.name && (
        <p className="flex items-center">
          <FaFemale className="w-5 h-5 mr-2 text-pink-500" />{" "}
          <span className="font-semibold">Mother:</span>
          <Link to={`/${user.mother.id}`} className="text-blue-500 hover:underline">
           {user.mother.name}
          </Link>
        </p>
      )}
      {user.spouse.name && (
        <p className="flex items-center">
          <Fa className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Spouse:</span> 
          <Link to={`/${user.spouse.id}`} className="text-blue-500 hover:underline">
            {user.spouse.name}
          </Link>
        </p>
      )}
      {user.siblings && user.siblings.length > 0 && (
        <div className="mb-3">
          <p className="flex items-center font-semibold">
            <FaUser className="w-5 h-5 mr-2" /> Siblings:
          </p>
          {user.siblings.map((sibling) => (
            <p key={sibling.id} className="flex items-center ml-7">
              <FaUser className="w-4 h-4 mr-2" />
              <Link to={`/${sibling.id}`} className="text-blue-500 hover:underline">
                {sibling.name}
              </Link>
            </p>
          ))}
        </div>
      )}

      {user.children && user.children.length > 0 && (
        <div>
          <p className="flex items-center font-semibold">
            <Users className="w-5 h-5 mr-2" /> Children:
          </p>
          {user.children.map((child) => (
            <p key={child.id} className="flex items-center ml-7">
              <FaUser className="w-4 h-4 mr-2" />
              <Link to={`/${child.id}`} className="text-blue-500 hover:underline">
                {child.name}
              </Link>
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-3 text-gray-800">
      {user.contact.email && (
      <p className="flex items-center">
        <Mail className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Email:</span> {user.contact.email}
      </p>
      )}
      {user.contact.phone && (
      <p className="flex items-center">
        <Phone className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Phone:</span> {user.contact.phone}
      </p>
      )}
      {user.contact.address && (
      <p className="flex items-center">
        <MapPin className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Address:</span> {user.contact.address}
      </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-lg">
        <button
          className="float-right text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <img
            src={user.photo}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 italic">{user.name_in_nepali}</p>
          <p className="text-gray-600 italic">{user.bio}</p>
        </div>
        <div className="flex justify-around mb-6 border-b pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center px-4 py-2 transition ${
                activeTab === id
                  ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(id)}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === "personal" && renderPersonalInfo()}
          {activeTab === "family" && renderFamilyRelations()}
          {activeTab === "contact" && renderContact()}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
