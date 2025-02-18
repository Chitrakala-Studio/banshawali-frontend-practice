import { useRef, useState, useEffect } from "react";

import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "./FamilyTreeGraph";
import { FaArrowUp, FaArrowDown } from "react-icons/fa"; // Import icons
import InfoSection from "./InfoSection";
import ToggleView from "./ToggleView";
import FooterButtons from "./FooterButtons";
import NavigationButtons from "./NavigationButtons";
import FamilyTreeCardButton from "./FamilyTreeCardButton"; // Import FamilyTreeCardButton

const CardView = () => {
  const { id } = useParams(); // Extract the id from URL params
  const containerRef = useRef(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const navigate = useNavigate();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [data, setData] = useState([]); // State for API data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [isMobile, setIsMobile] = useState(window.innerWidth < 764);

  const initialIndex = data.findIndex((item) => item.id === parseInt(id));
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex !== -1 ? initialIndex : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 764);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Simulating an API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch("https://gautamfamily.org.np/people/");
        const result = await response.json();

        setData(result); // Set the fetched data
        setLoading(false);

        // Check if the id exists in the fetched data
        const index = result.findIndex((item) => item.id === parseInt(id));
        if (index !== -1) {
          setCurrentIndex(index);
          requestAnimationFrame(() => scrollToCard(index));
        } else {
          navigate("/"); // Redirect if invalid `id`
        }
      } catch (error) {
        setError(error.message); // Set error if API call fails
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const toggleView = () => {
    setIsTableView(!isTableView);
  };

  const handleFooterGenerate = () => {
    const currentPerson = data[currentIndex];

    if (currentPerson) {
      setSelectedPerson(currentPerson.name);
      setIsHorizontal(!isHorizontal);
    }
  };

  const handleToggleInfo = (family) => {
    if (infoPopup === family.name) {
      setInfoPopup(null);
      setIsExpanded(false);
    } else {
      setInfoPopup(family.name);
      setIsExpanded(true);
    }
  };
  // Scroll to the previous card with circular navigation
  const scrollLeft = () => {
    const newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
    setInfoPopup(false);
    setIsExpanded(false);
    // Update the URL with the new id
    navigate(`/card/${data[newIndex].id}`); // Assuming the URL pattern is like `/card/:id`
  };

  // Scroll to the next card with circular navigation
  const scrollRight = () => {
    const newIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    scrollToCard(newIndex);
    setInfoPopup(false);
    setIsExpanded(false);
    // Update the URL with the new id
    navigate(`/card/${data[newIndex].id}`); // Assuming the URL pattern is like `/card/:id`
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
  if (loading) {
    return <div>Loading...</div>; // Show loading while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if the API call fails
  }

  return (
    <>
      <ToggleView
        isTableView={isTableView}
        toggleView={toggleView}
        availableId={data[currentIndex]?.id}
      />

      <div className="absolute w-full h-full my-auto rounded-2xl lg:w-2/5 lg:h-[97%] lg:top-0 md:w-3/5 md:h-[90%] md:top-0 overflow-hidden">
        {/* Navigation Buttons */}
        {/* <NavigationButtons scrollLeft={scrollLeft} scrollRight={scrollRight} /> */}

        {/* Card Container */}
        <div
          ref={containerRef}
          id="container"
          className="flex flex-col w-full h-full rounded-2xl overflow-x-scroll  mt-2 snap-x snap-mandatory scrollbar-hide"
        >
          <TinderCard
            className={`relative min-w-full h-full snap-center flex flex-col group ${
              infoPopup === data[currentIndex].name
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
                  data[currentIndex].photo ||
                  "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
                }
                alt={data[currentIndex].name_in_nepali}
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

                {/* Generate Family Tree Button
                  <FamilyTreeCardButton
                    onClick={() =>
                      handleGenerateFamilyTree(data[currentIndex])
                    }
                    onTouchEnd={() =>
                      handleGenerateFamilyTree(data[currentIndex])
                    }
                  /> */}

                <h2 className="text-2xl font-bold ml-5 mb-4 z-20">
                  {data[currentIndex].name_in_nepali}
                </h2>
                <div className="flex justify-between items-center w-full mb-10">
                  <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                    {data[currentIndex].pusta_number}
                  </div>
                  <button
                    className="pr-4 text-white text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleInfo(data[currentIndex]);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      handleToggleInfo(data[currentIndex]);
                    }}
                  >
                    <div className="expand-button">
                      {isExpanded ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            {infoPopup === data[currentIndex].name && (
              <InfoSection person={data[currentIndex]} />
            )}
          </TinderCard>

          <div className="footer mt-0 sticky bottom-0 left-0 w-full bg-white z-20">
            <FooterButtons
              id={id}
              onGenerateFamilyTree={handleFooterGenerate}
              infoPopup={infoPopup}
            />
          </div>
        </div>

        {/* Family Tree Modal */}
        {selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w- max-w-4xl p-6 rounded-lg relative">
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
                id={id}
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