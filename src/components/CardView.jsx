import { useState } from "react";
import { globalData } from "../data/globalData";
import FamilyTreeModal from "./FamilyTreeModal";

const CardView = () => {
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null); // Track which card info is displayed

  // Handle the click to generate the family tree
  const handleGenerateFamilyTree = (family) => {
    setSelectedFamily(family); // Set the selected family to display in the modal
  };

  // Toggle the info section visibility
  const handleInfoClick = (family) => {
    setInfoPopup(infoPopup === family.name ? null : family.name);
    
  };

  return (
    <div className="relative w-full h-full lg:w-2/5 lg:h-[90%] md:w-3/5 md:h-[80%]">
      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 opacity-50 text-white rounded-full z-20 hover:opacity-75"
        onClick={() => document.getElementById("container").scrollBy({ left: -window.innerWidth, behavior: "smooth" })}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
          alt="Scroll Left"
        />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 opacity-50 text-white rounded-full z-20 hover:opacity-75"
        onClick={() => document.getElementById("container").scrollBy({ left: window.innerWidth, behavior: "smooth" })}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
          alt="Scroll Right"
        />
      </button>

      {/* Card Container */}
      <div
        id="container"
        className={`flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide`}
      >
        {globalData.map((item, index) => (
          <div
            key={index}
            className={`relative min-w-full h-full snap-center flex flex-col ${
              infoPopup === item.name ? "overflow-y-scroll" : "overflow-y-hidden"
            }`}
          >
            {/* Image Section */}
            <div className="flex items-center justify-center w-full h-full rounded-lg shadow-lg bg-white relative">
              <img
                src={item.photo_url || "https://via.placeholder.com/150"}
                alt={item.name}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
                <button
                  onClick={() => handleGenerateFamilyTree(item)}
                  className="absolute top-4 left-4 bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-white hover:text-purple-700"
                >
                  Generate Family Tree
                </button>
                <h2 className="text-2xl font-bold ml-5 mb-4 z-20">{item.name}</h2>
                <div className="flex justify-between items-center w-full mb-10">
                  <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                    Pusta no. {item.pusta_number}
                  </div>
                  <button
                    className="pr-4 text-white text-xl"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from propagating to the parent
                      handleInfoClick(item);
                    }}
                  >
                    <img
                      className="w-10 h-10"
                      src="https://img.icons8.com/ios/50/FFFFFF/info-squared.png"
                      alt="info-squared"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            {infoPopup === item.name && (
              <div className="w-full bg-gray-800 text-white p-4 rounded-b-lg shadow-lg z-10">
                <p className="font-bold text-white">Mother&apos;s Name: {item.family_relations.mother}</p>
                <p className="font-bold text-white">Father&apos;s Name: {item.family_relations.father}</p>
                <p className="font-bold text-white">Gender: {item.gender}</p>
                <p className="font-bold text-white">DOB: {item.date_of_birth}</p>
                <p className="font-bold text-white">Living Status: {item.status}</p>
                
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Family Tree Modal */}
      {selectedFamily && (
        <FamilyTreeModal
          familyData={selectedFamily}
          onClose={() => setSelectedFamily(null)}
        />
      )}
    </div>
  );
};

export default CardView;
