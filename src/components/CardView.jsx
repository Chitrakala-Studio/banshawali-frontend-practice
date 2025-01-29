import { useRef, useState } from "react";
import { globalData } from "../data/globalData";
import FamilyTreeGraph from "./FamilyTreeGraph";
import TinderCard from "react-tinder-card";
const CardView = () => {
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null); // Track which card info is displayed

  // Handle the click to generate the family tree
  const handleGenerateFamilyTree = (person) => {
    setSelectedPerson(person.name); // Set the selected person's name to display in the graph
  };

  // Toggle the info section visibility
  const handleInfoClick = (person) => {
    setInfoPopup(infoPopup === person.name ? null : person.name);
  };

  // Scroll to the previous card
  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Scroll to the next card
  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full h-full lg:w-2/5 lg:h-[90%] md:w-3/5 md:h-[80%]">
      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 opacity-50 text-white rounded-full z-20 hover:opacity-75"
        onClick={scrollLeft}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
          alt="Scroll Left"
        />
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 opacity-50 text-white rounded-full z-20 hover:opacity-75"
        onClick={scrollRight}
      >
        <img
          className="w-6 h-6"
          src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
          alt="Scroll Right"
        />
      </button>

      {/* Card Container */}
      <div
        ref={containerRef}
        id="container"
        className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
      >
        {globalData.map((item, index) => (
          <TinderCard
            key={index}
            className={`relative min-w-full h-full snap-center flex flex-col ${
              infoPopup === item.name
                ? "overflow-y-scroll"
                : "overflow-y-hidden"
            }`}
            preventSwipe={["up", "down"]}
            onSwipe={(direction) => handleSwipe(direction, index)} // Add swipe handler
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
                <p className="font-bold text-white">
                  Mother&apos;s Name: {item.family_relations.mother}
                </p>
                <p className="font-bold text-white">
                  Father&apos;s Name: {item.family_relations.father}
                </p>
                <p className="font-bold text-white">Gender: {item.gender}</p>
                <p className="font-bold text-white">DOB: {item.date_of_birth}</p>
                <p className="font-bold text-white">Living Status: {item.status}</p>
              </div>
            )}
          </TinderCard>
        ))}
      </div>

      {/* Family Tree Graph */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
            <button
              onClick={() => setSelectedPerson(null)}
              className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
            >
              &#x2715;
            </button>
            <FamilyTreeGraph selectedPerson={selectedPerson} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CardView;