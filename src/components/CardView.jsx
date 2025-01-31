import { useRef, useState } from "react";
import { globalData } from "../data/globalData";
import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa"; // Import icons

const CardView = () => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current card index
  const isMobile = window.innerWidth < 764;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleView = () => {
    setIsTableView(!isTableView);
    navigate(isTableView ? "/" : "/table");
  };

  // Handle the click to generate the family tree
  const handleGenerateFamilyTree = (person) => {
    setSelectedPerson(person.name);
    setIsHorizontal(!isHorizontal); // Set orientation to horizontal
  };
  
  const handleInfoClick = (family) => {
    setInfoPopup(infoPopup === family.name ? null : family.name);
  };

  // Scroll to the previous card with circular navigation
  const scrollLeft = () => {
    const newIndex =
      currentIndex === 0 ? globalData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  // Scroll to the next card with circular navigation
  const scrollRight = () => {
    const newIndex =
      currentIndex === globalData.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
  };

  // Scroll to a specific card
  const scrollToCard = (index) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
      });
      // Add a visual effect to the container
      containerRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        containerRef.current.classList.remove("animate-pulse");
      }, 300); // Remove the effect after 300ms
    }
  };

  const handleSwipe = (direction, index) => {
    if (direction === "left") {
      scrollRight();
    } else if (direction === "right") {
      scrollLeft();
    }
  };

  // Handle Compare button click
  const handleCompareClick = () => {
    navigate("/compare");
  };

  return (
    <div className="relative w-full h-full lg:w-2/5 lg:h-[90%] md:w-3/5 md:h-[80%]">
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
        {/* Scroll Left Button */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollLeft}
          onTouchEnd={scrollLeft}
        >
          <img
            className="w-6 h-6"
            src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
            alt="Scroll Left"
          />
        </button>

        {/* Scroll Right Button */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 
    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={scrollRight}
          onTouchEnd={scrollRight}
        >
          <img
            className="w-6 h-6"
            src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
            alt="Scroll Right"
          />
        </button>
      </div>

      {/* Card Container */}
      <div
        ref={containerRef}
        id="container"
        className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
      >
        {globalData.map((item, index) => (
          <TinderCard
            key={index}
            className={`relative min-w-full h-full snap-center flex flex-col group ${
              infoPopup === item.name
                ? "overflow-y-scroll"
                : "overflow-y-hidden"
            }`}
            preventSwipe={["up", "down"]}
            onSwipe={(direction) => handleSwipe(direction, index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Section */}
            <div className="flex items-center justify-center w-full h-full rounded-lg shadow-lg bg-white relative">
              <img
                src={item.photo_url || "https://via.placeholder.com/150"}
                alt={item.name}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
                {/* Generate Family Tree Button */}
                <button
                  onClick={() => handleGenerateFamilyTree(item)}
                  onTouchEnd={() => handleGenerateFamilyTree(item)}
                  className="absolute top-4 left-4 bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-white hover:text-purple-700"
                >
                  Generate Family Tree
                </button>

                {/* Compare Button (Visible only in mobile view) */}
                <button
                  onClick={handleCompareClick}
                  onTouchEnd={handleCompareClick}
                  className="absolute top-4 right-4 bg-blue-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-white hover:text-blue-700 lg:hidden"
                >
                  Compare
                </button>

                <h2 className="text-2xl font-bold ml-5 mb-4 z-20">
                  {item.name}
                </h2>
                <div className="flex justify-between items-center w-full mb-10">
                  <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                    Pusta no. {item.pusta_number}
                  </div>
                  <button
                    className="pr-4 text-white text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInfoClick(item);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handleInfoClick(item);
                    }}
                  >
                    <button onClick={toggleExpand} className="expand-button">
                      {isExpanded ? <FaArrowDown /> : <FaArrowUp />}
                    </button>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            {infoPopup === item.name && (
              <div className="w-full bg-black/90 text-white p-4 rounded-b-lg shadow-lg z-10 space-y-4">
                {/* Personal Information Box */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center border-b border-gray-600 pb-3">
                      <FaUser className="mr-2 text-xl" />
                      <p className="text-l text-white mt-1">
                        {item.name || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center border-b border-gray-600 pb-3">
                      <FaVenusMars className="mr-2 text-xl" />
                      <p className="text-l mt-0 text-white">
                        {item.gender || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center border-b border-gray-600 pb-3">
                      <FaBirthdayCake className="mr-2 text-xl" />
                      <p className="text-l mt-0 text-white">
                        {item.date_of_birth || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaInfoCircle className="mr-2 text-xl" />
                      <p className="text-l text-white mt-0">
                        {item.status || "N/A"}
                      </p>
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
                        {item.family_relations.father || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-xl" />
                      <p className="text-l text-white mt-0">
                        {item.family_relations.mother || "N/A"}
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
                      <p className="text-l text-white mt-1">
                        {item.phone_number || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-xl" />
                      <p className="text-l text-white mt-0">
                        {item.email_address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information Box */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-m mb-4">
                    Professional Information
                  </h3>
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-xl" />
                    <p className="text-l text-white mt-0">
                      {item.profession || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Genealogy and Lineage Box */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-bold text-m mb-4">
                    Genealogy And Lineage
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center border-b border-gray-600 pb-3">
                      <FaUsers className="mr-2 text-xl" />
                      <p className="text-l text-white mt-0">
                        {item.pusta_number || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="mr-2 text-xl" />
                      <p className="text-l text-white mt-0">
                        {item.vansha || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TinderCard>
        ))}
      </div>

      <div className="w-full flex justify-around my-1 p-4 text-white rounded-lg bg-gray-800">
        <button
          onClick={handleCompareClick}
          className="flex justify-center items-center bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-28 ml-5 z-20"
        >
          Compare
        </button>
        <button
          onClick={handleGenerateFamilyTree}
          className="flex justify-center items-center bg-purple-700/70 text-white text-base font-normal rounded-full h-10 w-40 ml-5 z-20"
        >
          Generate Family Tree
        </button>
      </div>
      {/* Family Tree Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
            <button
              onClick={() => {
                setSelectedPerson(null);
                setIsHorizontal(false); // Reset orientation
              }}
              className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
            >
              &#x2715;
            </button>
            <FamilyTreeGraph selectedPerson={selectedPerson} isMobile={isMobile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardView;
