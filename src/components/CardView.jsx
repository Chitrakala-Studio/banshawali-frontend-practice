import { useRef, useState, useEffect } from "react";
import { Circles } from "react-loader-spinner";
import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeGraph from "./FamilyTreeGraph";
import ToggleView from "./ToggleView";
import CardImageSection from "./CardImageSection";
import CardFooterSection from "./CardFooterSection";
import NavigationButtons from "./NavigationButtons";
import FamilyTreeCardButton from "./FamilyTreeCardButton";
import SearchForm from "./SearchForm";
import male from "./male1.png";
import female from "./female1.png";

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
  const [isSearchActive, setIsSearchActive] = useState(false);
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
    if (isSearchActive) return; // skip fetching when viewing search results
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${API_URL}/people/${id}/`;
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const result = await response.json();
        const result_data = result.data;
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
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isSearchActive, navigate]);

  useEffect(() => {
    if (isSearchActive && data.length > 0) {
      navigate(`/card/${data[currentIndex].id}`, { replace: true });
    }
  }, [currentIndex, data, isSearchActive, navigate]);

  const toggleView = () => {
    setIsTableView(!isTableView);
  };

  const handleFooterGenerate = () => {
    const currentPerson = data[currentIndex];
    if (currentPerson) {
      setSelectedPerson(currentPerson.name || currentPerson.name_in_nepali);
      setIsHorizontal(!isHorizontal);
    }
  };

  const handleToggleInfo = (person) => {
    const displayName = person.name || person.name_in_nepali;
    if (infoPopup === displayName) {
      setInfoPopup(null);
      setIsExpanded(false);
    } else {
      setInfoPopup(displayName);
      setIsExpanded(true);
    }
  };

  const handleSearchResults = (results) => {
    if (results) {
      const resultsArray = Array.isArray(results) ? results : [results];
      if (resultsArray.length > 0) {
        setData(resultsArray);
        setCurrentIndex(0);
        setIsSearchActive(true);
      } else {
        setData([]);
      }
    } else {
      setData([]);
    }
    setShowSearchPopup(false);
  };

  const scrollLeft = () => {
    setInfoPopup(false);
    setIsExpanded(false);
    if (isSearchActive) {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    } else {
      navigate(`/card/${previousIndex}`);
    }
  };

  const scrollRight = () => {
    setInfoPopup(false);
    setIsExpanded(false);
    if (isSearchActive) {
      if (currentIndex < data.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      navigate(`/card/${nextIndex}`);
    }
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

  const handleSwipe = (direction) => {
    if (direction === "left") {
      scrollRight();
    } else if (direction === "right") {
      scrollLeft();
    }
  };

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((digit) => nepaliNumerals[digit])
      .join("");
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

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-lg">No results found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-t from-black via-black/60 to-transparent">
        {!isMobile && (
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={id}
          />
        )}
        <div
          className={
            isMobile
              ? "w-[98vw] m-auto rounded-2xl overflow-hidden"
              : "w-[40vw] m-auto rounded-2xl overflow-hidden"
          }
        >
          <TinderCard
            className="relative w-full h-full snap-center flex flex-col group"
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
            <CardImageSection
              person={data[currentIndex]}
              isExpanded={isExpanded}
              onScrollLeft={scrollLeft}
              onScrollRight={scrollRight}
              isHovered={isHovered}
              onSwipe={handleSwipe}
              isMobile={isMobile}
              maleImage={male}
              femaleImage={female}
              convertToNepaliNumerals={convertToNepaliNumerals}
              onToggleInfo={handleToggleInfo}
            />
          </TinderCard>
          <CardFooterSection
            id={id}
            onGenerateFamilyTree={handleFooterGenerate}
            infoPopup={infoPopup}
            isMobile={isMobile}
            onSearchButtonClick={() => setShowSearchPopup(true)}
            isExpanded={isExpanded}
            onToggleInfo={handleToggleInfo}
            convertToNepaliNumerals={convertToNepaliNumerals}
            person={data[currentIndex]}
          />
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
                className="absolute top-2 right-2 text-gray-700 font-bold text-xl"
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
      {showSearchPopup && (
        <SearchForm
          initialCriteria={{
            name: "",
            pusta_number: "",
            phone: "",
            email: "",
            father_name: "",
            mother_name: "",
            same_vamsha_status: true,
          }}
          onSearch={handleSearchResults}
          onClose={() => setShowSearchPopup(false)}
        />
      )}
    </>
  );
};

export default CardView;
