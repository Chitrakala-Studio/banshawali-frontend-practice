import { useRef, useState, useEffect } from "react";
import { globalData } from "../data/globalData";
import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "./FamilyTreeGraph";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Import icons
import InfoSection from "./InfoSection";
import ToggleView from "./ToggleView";
import FooterButtons from "./FooterButtons";
import NavigationButtons from "./NavigationButtons";

const CardView = () => {
  const { id } = useParams(); // Extract the id from URL params
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null);
  const isMobile = window.innerWidth < 764;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const navigate = useNavigate();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const initialIndex = globalData.findIndex((item) => item.id === parseInt(id));
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    const index = globalData.findIndex((item) => item.id === parseInt(id));
    if (index !== -1) {
      setCurrentIndex(index);
      // Wait for the DOM to render before scrolling
      requestAnimationFrame(() => scrollToCard(index));
    } else {
      navigate("/"); // Redirect if invalid `id`
    }
  }, [id, navigate]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleView = () => {
    setIsTableView(!isTableView);
  };

  const handleFooterGenerate = () => {
    const currentPerson = globalData[currentIndex];
    if (currentPerson) {
      setSelectedPerson(currentPerson.name);
      setIsHorizontal(!isHorizontal);
    }
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
    // Update the URL with the new id
    navigate(`/${globalData[newIndex].id}`); // Assuming the URL pattern is like `/card/:id`
  };

  // Scroll to the next card with circular navigation
  const scrollRight = () => {
    const newIndex =
      currentIndex === globalData.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
    // Update the URL with the new id
    navigate(`/${globalData[newIndex].id}`); // Assuming the URL pattern is like `/card/:id`
  };

  // Scroll to a specific card
  const scrollToCard = (index) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "auto",
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

  return (
    <>
      <ToggleView isTableView={isTableView} toggleView={toggleView} />
      <div className="absolute w-full h-full lg:w-2/5 lg:h-[89%] lg:top-0 md:w-3/5 md:h-[80%] md:top-0">
        {/* Navigation Buttons */}
        <NavigationButtons scrollLeft={scrollLeft} scrollRight={scrollRight} />

        {/* Card Container */}
        <div
          ref={containerRef}
          id="container"
          className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
        >
          <TinderCard
            className={`relative min-w-full h-full snap-center flex flex-col group ${
              infoPopup === globalData[currentIndex].name
                ? "overflow-y-scroll"
                : "overflow-y-hidden"
            }`}
            preventSwipe={["up", "down"]}
            onSwipe={(direction) => handleSwipe(direction)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Section */}
            <div className="flex items-center justify-center w-full h-full rounded-lg shadow-lg bg-white relative">
              <img
                src={
                  globalData[currentIndex].photo ||
                  "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
                }
                alt={globalData[currentIndex].name_in_nepali}
                className="w-full h-full object-cover select-none"
              />

              {/* Buttons Section */}
              <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
                {/* Scroll Left Button */}
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 text-white rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={scrollRight}
                  onTouchEnd={scrollRight}
                >
                  <img
                    className="w-6 h-6"
                    src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
                    alt="Scroll Right"
                  />
                </button>

                {/* Generate Family Tree Button */}

                <h2 className="text-2xl font-bold ml-5 mb-4 z-20">
                  {globalData[currentIndex].name_in_nepali}
                </h2>
                <div className="flex justify-between items-center w-full mb-10">
                  <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                    {globalData[currentIndex].pusta_number}
                  </div>
                  <button
                    className="pr-4 text-white text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInfoClick(globalData[currentIndex]);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handleInfoClick(globalData[currentIndex]);
                    }}
                  >
                    <div onClick={toggleExpand} className="expand-button">
                      {isExpanded ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            {infoPopup === globalData[currentIndex].name && (
              <InfoSection person={globalData[currentIndex]} />
            )}
          </TinderCard>
        </div>
        <FooterButtons onGenerateFamilyTree={handleFooterGenerate} />

        {/* Family Tree Modal */}
        {selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-4xl p-6 rounded-lg relative">
              <button
                onClick={() => {
                  setSelectedPerson(null);
                  setIsHorizontal(false); // Reset orientation
                }}
                onTouchEnd={() => {
                  setSelectedPerson(null);
                  setIsHorizontal(false); // Reset orientation
                }}
                className="absolute top-2 right-2 text-gray-700 font-bold text-lg"
              >
                &#x2715;
              </button>
              <FamilyTreeGraph
                selectedPerson={selectedPerson}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CardView;
