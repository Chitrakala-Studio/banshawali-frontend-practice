import { useRef, useState, useEffect } from "react";
import { Circles } from 'react-loader-spinner';

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
  const { id } = useParams();
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
  const [nextIndex, setNextIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
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

        const url = `${API_URL}/people/${id}/`;
        console.log("Fetching URL:", url);
        const response = await fetch(url , 
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        const result = await response.json();
        const result_data = result.data;
        console.log(result_data)

        setData(result_data); // Set the fetched data
        setPreviousIndex(result.previous);
        setNextIndex(result.next);
        setLoading(false);

        // Check if the id exists in the fetched data
        if (result_data.length > 0) {
          // index of the current person is 0 since data of just that person is provided
          setCurrentIndex(0);
        } else {
          // If the id doesn't exist, navigate to the first item
          navigate(`/`); 
        }
      } catch (error) {
        // setError(error.toString()); // Set error if API call fails
        setError(typeof(id));
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
    const newIndex = previousIndex;
    setInfoPopup(false);
    setIsExpanded(false);
    // Update the URL with the new id
    navigate(`/card/${previousIndex}`); // Assuming the URL pattern is like `/card/:id`
  };

  // Scroll to the next card with circular navigation
  const scrollRight = () => {
    const newIndex = nextIndex;
    setInfoPopup(false);
    setIsExpanded(false);
    // Update the URL with the new id
    navigate(`/card/${nextIndex}`); // Assuming the URL pattern is like `/card/:id`
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
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-t from-black via-black/60 to-transparent">
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error if the API call fails
  }

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return number.toString().split('').map(digit => nepaliNumerals[digit]).join('');
  };

  return (
    <>
      <div className="flex flex-col lg:w-screen lg:h-screen scroll-m-0 bg-gradient-to-t from-black via-black/60 to-transparent">
        {!isMobile && (
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={id}
          />
        )}

        <div className={isMobile? " w-[98vw]  h-[98vh] m-auto rounded-2xl overflow-auto ": "w-[40vw] h-[98vh] m-auto rounded-2xl overflow-auto"}>
          <div className={ isMobile?" w-[98vw] h-[96vh] m-auto rounded-2xl overflow-hidden ":" w-[40vw] h-[96vh] m-auto rounded-2xl overflow-hidden"}>
            {/* Navigation Buttons */}
            {/* <NavigationButtons scrollLeft={scrollLeft} scrollRight={scrollRight} /> */}

            {/* Card Container */}
            <div
              ref={containerRef}
              id="container"
              className={
                isMobile
                  ? "flex flex-col w-full h-[95vh]  rounded-2xl overflow-x-scroll my-auto snap-x snap-mandatory scrollbar-hide"
                  : "flex flex-col w-full h-[98vh]  rounded-2xl overflow-x-scroll my-auto snap-x snap-mandatory scrollbar-hide"
              }
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
                <div
                  className={
                    !infoPopup
                      ? "flex items-center justify-center w-[100%] h-[100%]  rounded-lg shadow-lg bg-white relative"
                      : "flex items-center justify-center w-[100%] h-[78vh]  object-scale-down rounded-lg shadow-lg bg-white relative"
                  }
                >
                  <img
                    src={
                      data[currentIndex].photo ||
                      "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg"
                    }
                    alt={data[currentIndex].name_in_nepali}
                    className={
                      !infoPopup
                        ? "w-full h-[99.8%]  object-cover select-none"
                        : "w-full h-[78vh] object-cover select-none"
                    }
                   
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

                    <h2 className="text-2xl font-bold ml-5 mb-6 z-20">
                      {data[currentIndex].name_in_nepali}
                    </h2>
                    <div
                      className={
                        isMobile
                          ? "flex justify-between items-center w-full mb-12"
                          : "flex justify-between items-center w-full mb-8"
                      }
                    >
                      <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5  z-20">
                        {/* {data[currentIndex].pusta_number} */}
                        {convertToNepaliNumerals(data[currentIndex].pusta_number)}
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
                        <div className="expand-button ">
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

              <div
                className={
                  isMobile
                    ? "footer sticky mt-4  ml-1 bottom-0 left-0 w-full bg-white z-20"
                    : "footer sticky bottom-0 left-0 w-full bg-white z-20"
                }
              >
                <FooterButtons
                  id={id}
                  onGenerateFamilyTree={handleFooterGenerate}
                  infoPopup={infoPopup}
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* Family Tree Modal */}
            {selectedPerson && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-11/12 max-w-5xl p-6 rounded-lg relative">
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
        </div>
      </div>
    </>
  );
};

export default CardView;
