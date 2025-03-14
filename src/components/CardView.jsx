import { useRef, useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "./FamilyTreeGraph";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import InfoSection from "./InfoSection";
import ToggleView from "./ToggleView";
import FooterButtons from "./FooterButtons";
import NavigationButtons from "./NavigationButtons";
import FamilyTreeCardButton from "./FamilyTreeCardButton";
import SearchForm from "./SearchForm";
import male from "./male.png";
import female from "./female.png";

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextIndex, setNextIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${API_URL}/people/${id}/`;
        console.log("Fetching URL:", url);
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const result = await response.json();
        const result_data = result.data;
        console.log(result_data);

        setData(result_data);
        setPreviousIndex(result.previous);
        setNextIndex(result.next);
        setLoading(false);

        if (result_data.length > 0) {
          setCurrentIndex(0);
        } else {
          navigate(`/`);
        }
      } catch (error) {
        setError(typeof id);
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

  const handleSearchResults = (results) => {
    if (results && results.length > 0) {
      setData(results);
      setCurrentIndex(0);
    } else {
      setData([]);
    }
    setShowSearchPopup(false);
  };

  const scrollLeft = () => {
    const newIndex = previousIndex;
    setInfoPopup(false);
    setIsExpanded(false);
    navigate(`/card/${previousIndex}`);
  };

  const scrollRight = () => {
    const newIndex = nextIndex;
    setInfoPopup(false);
    setIsExpanded(false);
    navigate(`/card/${nextIndex}`);
  };

  const scrollToCard = (index) => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.clientWidth;
      containerRef.current.scrollTo({
        left: cardWidth * index,
        behavior: "auto",
      });
      containerRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        containerRef.current.classList.remove("animate-pulse");
      }, 300);
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
    return <div>Error: {error}</div>;
  }

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((digit) => nepaliNumerals[digit])
      .join("");
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

        {isMobile && (
          <div className="fixed top-2 left-0 right-0 z-20 flex justify-center">
            <FooterButtons
              id={id}
              onGenerateFamilyTree={handleFooterGenerate}
              infoPopup={infoPopup}
              isMobile={isMobile}
              onSearchButtonClick={() => setShowSearchPopup(true)}
            />
          </div>
        )}
        <div
          className={
            isMobile
              ? "w-[98vw] h-[98vh] m-auto rounded-2xl overflow-auto"
              : "w-[40vw] h-[98vh] m-auto rounded-2xl overflow-auto"
          }
        >
          <div
            className={
              isMobile
                ? "w-[98vw] h-[96vh] m-auto rounded-2xl overflow-hidden"
                : "w-[40vw] h-[96vh] m-auto rounded-2xl overflow-hidden"
            }
          >
            <div
              ref={containerRef}
              id="container"
              className={
                isMobile
                  ? "flex flex-col w-full h-[100vh] rounded-2xl overflow-x-scroll my-auto snap-x snap-mandatory scrollbar-hide"
                  : "flex flex-col w-full h-[98vh] rounded-2xl overflow-x-scroll my-auto snap-x snap-mandatory scrollbar-hide"
              }
            >
              {infoPopup === data[currentIndex].name ? (
                <div className="relative min-w-full h-full snap-center flex flex-col overflow-y-scroll">
                  <div className="flex items-center justify-center w-full h-[100%] rounded-lg shadow-lg bg-white relative">
                    <img
                      src={
                        data[currentIndex].photo ||
                        (data[currentIndex].gender === "Male"
                          ? male
                          : data[currentIndex].gender === "Female"
                          ? "https://img.freepik.com/free-vector/woman-with-long-black-hair_90220-2937.jpg"
                          : "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg")
                      }
                      alt={data[currentIndex].name_in_nepali}
                      className="w-full h-[90%] object-cover select-none"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
                      <h2 className="text-2xl font-bold ml-5 mb-6 z-20">
                        {data[currentIndex].name_in_nepali}
                      </h2>
                      <div
                        className={
                          isMobile
                            ? "flex justify-between items-center w-full mb-12 relative -top-3"
                            : "flex justify-between items-center w-full mb-8 relative -top-3"
                        }
                      >
                        <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                          {convertToNepaliNumerals(
                            data[currentIndex].pusta_number
                          )}
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
                  <InfoSection person={data[currentIndex]} />
                </div>
              ) : (
                <TinderCard
                  className={`relative min-w-full h-full snap-center flex flex-col group ${
                    infoPopup === data[currentIndex].name
                      ? "overflow-y-scroll"
                      : "overflow-y-hidden"
                  }`}
                  preventSwipe={
                    infoPopup === data[currentIndex].name
                      ? ["left", "right", "up", "down"]
                      : ["up", "down"]
                  }
                  style={
                    infoPopup === data[currentIndex].name
                      ? { touchAction: "pan-y" }
                      : {}
                  }
                  onSwipe={(direction) => handleSwipe(direction)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className={
                      !infoPopup
                        ? "flex items-center justify-center w-[100%] h-[100%] rounded-lg shadow-lg bg-white relative"
                        : "flex items-center justify-center w-[100%] h-[100vh] object-scale-down rounded-lg shadow-lg bg-white relative"
                    }
                  >
                    <img
                      src={
                        data[currentIndex].photo ||
                        (data[currentIndex].gender === "Male"
                          ? male
                          : data[currentIndex].gender === "Female"
                          ? female
                          : "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg")
                      }
                      alt={data[currentIndex].name_in_nepali}
                      className={
                        !infoPopup
                          ? "w-full h-[95%] object-cover select-none"
                          : "w-full h-[90%] object-cover select-none"
                      }
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end items-start p-4 bg-gradient-to-t from-black/90 via-black/20 to-transparent text-white text-left z-10">
                      <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={scrollLeft}
                        onTouchEnd={scrollLeft}
                      >
                        <img
                          className="w-6 h-6"
                          src="https://img.icons8.com/?size=100&id=1806&format=png&color=000000"
                          alt="Scroll Left"
                        />
                      </button>
                      <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-50 p-2 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={scrollRight}
                        onTouchEnd={scrollRight}
                      >
                        <img
                          className="w-6 h-6"
                          src="https://img.icons8.com/?size=100&id=61&format=png&color=000000"
                          alt="Scroll Right"
                        />
                      </button>
                      <h2 className="text-2xl font-bold ml-5 mb-6 z-20">
                        {data[currentIndex].name_in_nepali}
                      </h2>
                      <div
                        className={
                          isMobile
                            ? "flex justify-between items-center w-full mb-12 relative -top-3"
                            : "flex justify-between items-center w-full mb-8 relative -top-3"
                        }
                      >
                        <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 ml-5 z-20">
                          {convertToNepaliNumerals(
                            data[currentIndex].pusta_number
                          )}
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
                  {infoPopup === data[currentIndex].name && (
                    <InfoSection person={data[currentIndex]} />
                  )}
                </TinderCard>
              )}

              {/* Updated Footer */}
              <div
                className={
                  isMobile
                    ? "footer w-full bg-white z-20 ml-1"
                    : "footer w-full bg-white z-20"
                }
              >
                {!isMobile && (
                  <div className="footer w-full bg-white z-20">
                    <FooterButtons
                      id={id}
                      onGenerateFamilyTree={handleFooterGenerate}
                      infoPopup={infoPopup}
                      isMobile={isMobile}
                      onSearchButtonClick={() => setShowSearchPopup(true)}
                    />
                  </div>
                )}
              </div>
            </div>

            {selectedPerson && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-11/12 max-w-5xl p-6 rounded-lg relative">
                  <button
                    onClick={() => {
                      setSelectedPerson(null);
                      setIsHorizontal(false);
                    }}
                    onTouchEnd={() => {
                      setSelectedPerson(null);
                      setIsHorizontal(false);
                    }}
                    className="absolute top-10 right-2 text-gray-700 font-bold text-lg"
                  >
                    ✕
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
      {showSearchPopup && (
        <SearchForm
          initialCriteria={{
            name: "",
            pusta_number: "",
            phone_number: "",
            email: "",
            father_name: "",
            mother_name: "",
            same_vamsha_status: false,
          }}
          onSearch={handleSearchResults}
          onClose={() => setShowSearchPopup(false)}
        />
      )}
    </>
  );
};

export default CardView;
