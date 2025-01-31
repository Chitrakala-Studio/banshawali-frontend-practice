import { useState, useEffect } from "react";
import { globalData } from "../data/globalData";
import TinderCard from "react-tinder-card";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "./FamilyTreeGraph";
import {
  FaBirthdayCake,
  FaPhone,
  FaArrowUp,
  FaArrowDown,
  FaEnvelope,
  FaUser,
  FaVenusMars,
  FaInfoCircle,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";

const CardView = () => {
  const { id } = useParams();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const index = globalData.findIndex((item) => item.id === parseInt(id));
    if (index === -1) {
      navigate("/table");
      return;
    }
    setCurrentIndex(index);
  }, [id, navigate]);

  const currentPerson = globalData[currentIndex];

  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleView = () => navigate(isTableView ? "/card" : "/table");

  const handleGenerateFamilyTree = () => {
    setSelectedPerson(currentPerson.name);
  };

  const handleInfoClick = () => {
    setInfoPopup(infoPopup === currentPerson.name ? null : currentPerson.name);
  };

  const navigateToCard = (direction) => {
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = globalData.length - 1;
    if (newIndex >= globalData.length) newIndex = 0;
    navigate(`/card/${globalData[newIndex].id}`);
  };

  const handleSwipe = (direction) => {
    if (direction === "left") navigateToCard(1);
    if (direction === "right") navigateToCard(-1);
  };

  const handleCompareClick = () => navigate("/compare");

  if (!currentPerson) return null;

  return (
    <div className="relative w-full h-full lg:w-2/5 lg:h-[90%] md:w-3/5 md:h-[80%]">
      {/* View Toggle Switch */}
      <div className="absolute top-4 right-4 z-50">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isTableView}
              onChange={toggleView}
            />
            <div
              className={`w-12 h-6 rounded-full shadow-inner transition-colors ${
                isTableView ? "bg-blue-700" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                isTableView ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
          <span className="ml-2 text-white">
            {isTableView ? "Table View" : "Card View"}
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div
        className="group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          onClick={() => navigateToCard(-1)}
        >
          <img
            className="w-6 h-6"
            src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
            alt="Scroll Left"
          />
        </button>

        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
          onClick={() => navigateToCard(1)}
        >
          <img
            className="w-6 h-6"
            src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
            alt="Scroll Right"
          />
        </button>
      </div>

      {/* Single Card */}
      <TinderCard
        className={`relative w-full h-full flex flex-col group ${
          infoPopup ? "overflow-y-scroll" : "overflow-y-hidden"
        }`}
        preventSwipe={["up", "down"]}
        onSwipe={handleSwipe}
      >
        <div className="flex items-center justify-center w-full h-full rounded-lg shadow-lg bg-white relative">
          <img
            src={currentPerson.photo_url || "https://via.placeholder.com/150"}
            alt={currentPerson.name}
            className="w-full h-full object-cover select-none"
          />

          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
            <button
              onClick={handleGenerateFamilyTree}
              className="absolute top-4 left-4 bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-white hover:text-purple-700"
            >
              Generate Family Tree
            </button>

            <h2 className="text-2xl font-bold ml-5 mb-4 z-20">
              {currentPerson.name}
            </h2>
            <div className="flex justify-between items-center w-full mb-10">
              <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                Pusta no. {currentPerson.pusta_number}
              </div>
              <button
                className="pr-4 text-white text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInfoClick();
                }}
              >
                {isExpanded ? <FaArrowDown /> : <FaArrowUp />}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        {infoPopup === currentPerson.name && (
          <div className="w-full bg-black/90 text-white p-4 rounded-b-lg shadow-lg z-10 space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaUser className="mr-2 text-xl" />
                  <p className="text-l text-white mt-1">
                    {currentPerson.name || "N/A"}
                  </p>
                </div>
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaVenusMars className="mr-2 text-xl" />
                  <p className="text-l mt-0 text-white">
                    {currentPerson.gender || "N/A"}
                  </p>
                </div>
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaBirthdayCake className="mr-2 text-xl" />
                  <p className="text-l mt-0 text-white">
                    {currentPerson.date_of_birth || "N/A"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaInfoCircle className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {currentPerson.status || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Family Information</h3>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaUser className="mr-2 text-xl" />
                  <p className="text-l text-white mt-1">
                    {currentPerson.family_relations.father || "N/A"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {currentPerson.family_relations.mother || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-m mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaPhone className="mr-2 text-xl" />
                  <p className="text-l text-white mt-1">
                    {currentPerson.phone || "N/A"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {currentPerson.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-m mb-4">
                Professional Information
              </h3>
              <div className="flex items-center">
                <FaBriefcase className="mr-2 text-xl" />
                <p className="text-l text-white mt-0">
                  {currentPerson.profession || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-bold text-m mb-4">Genealogy And Lineage</h3>
              <div className="space-y-3">
                <div className="flex items-center border-b border-gray-600 pb-3">
                  <FaUsers className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {currentPerson.pusta_number || "N/A"}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2 text-xl" />
                  <p className="text-l text-white mt-0">
                    {currentPerson.same_vamsha_status || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </TinderCard>

      {/* Bottom Action Buttons */}
      <div className="w-full flex justify-around my-1 p-4 text-white rounded-lg bg-gray-800">
        <button
          onClick={handleCompareClick}
          className="flex justify-center items-center bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-28 ml-5 z-20"
        >
          Compare
        </button>
        <button
          onClick={handleGenerateFamilyTree}
          className="flex justify-center items-center py-5 px-10 bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-45 ml-5 z-20"
        >
          Generate Family Tree
        </button>
      </div>

      {/* Family Tree Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
            >
              &#x2715;
            </button>
            <FamilyTreeGraph
              selectedPerson={selectedPerson}
              isMobile={window.innerWidth < 764}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardView;
