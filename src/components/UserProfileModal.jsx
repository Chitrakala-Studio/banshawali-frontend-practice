import React, { useState } from "react";
import {
  X,
  User,
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
        <Briefcase className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Profession:</span> {user.profession}
      </p>
      <p className="flex items-center">
        <Globe className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Gender:</span> {user.gender}
      </p>
      <p className="flex items-center">
        <Calendar className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Date of Birth:</span> {user.dateOfBirth}
      </p>
      <p className="flex items-center">
        <Heart className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Status:</span> {user.status}
      </p>
      {user.dateOfDeath && (
        <p className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />{" "}
          <span className="font-semibold">Date of Death:</span>{" "}
          {user.dateOfDeath}
        </p>
      )}
    </div>
  );

  const renderFamilyRelations = () => (
    <div className="space-y-3 text-gray-800">
      <p className="font-semibold">Father:</p> {user.father}
      <p className="font-semibold">Mother:</p> {user.mother}
      <p className="font-semibold">Spouse:</p> {user.spouse}
      <p className="font-semibold">Children:</p> {user.children.join(", ")}
      <p className="font-semibold">Grandfather:</p> {user.grandfather}
      <p className="font-semibold">Grandmother:</p> {user.grandmother}
      <p className="font-semibold">Cousins:</p> {user.cousins.join(", ")}
    </div>
  );

  const renderContact = () => (
    <div className="space-y-3 text-gray-800">
      <p className="flex items-center">
        <Mail className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="flex items-center">
        <Phone className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Phone:</span> {user.phone}
      </p>
      <p className="flex items-center">
        <MapPin className="w-5 h-5 mr-2" />{" "}
        <span className="font-semibold">Address:</span> {user.address}
      </p>
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
