import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FamilyTreeModal from "./FamilyTreeModal";
import TinderCard from "react-tinder-card";
import FamilyTreeGraph from "./FamilyTreeGraph";
import ToggleView from "./ToggleView";
import CardImageSection from "./CardImageSection";
import CardFooterSection from "./CardFooterSection";
import SearchForm from "./SearchForm";
import male from "./male1.png";
import female from "./female1.png";
import { FaHome, FaSpinner } from "react-icons/fa";

const CardView = () => {
  const { id } = useParams();
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const MAX_CARD_ID = 4000;

  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch card data and navigate to a random card on initial load
  useEffect(() => {
    if (isSearchActive) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let cardId = id;

        // On initial load, if id is "1", navigate to a random card
        if (parseInt(id) === 1) {
          cardId = Math.floor(Math.random() * MAX_CARD_ID) + 1;
          navigate(`/card/${cardId}`, { replace: true });
        }

        const response = await fetch(`${API_URL}/people/${cardId}/`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const result_data = Array.isArray(result.data) ? result.data : [];
        setData(result_data);
        setLoading(false);
        if (result_data.length > 0) {
          setCurrentIndex(0);
        } else {
          navigate(`/`);
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isSearchActive, navigate]);

  // Update URL when currentIndex changes during search
  useEffect(() => {
    if (isSearchActive && data.length > 0 && data[currentIndex]?.id) {
      navigate(`/card/${data[currentIndex].id}`, { replace: true });
    }
  }, [currentIndex, data, isSearchActive, navigate]);

  const toggleView = () => setIsTableView(!isTableView);

  const handleFooterGenerate = () => {
    const currentPerson = data[currentIndex];
    if (currentPerson) {
      setSelectedPerson(currentPerson.name_in_nepali || currentPerson.name);
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
    setInfoPopup(null);
    setIsExpanded(false);

    if (isSearchActive) {
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentIndex(randomIndex);
      }
      return;
    }

    // Navigate to a completely random card ID
    const randomId = Math.floor(Math.random() * MAX_CARD_ID) + 1;
    navigate(`/card/${randomId}`);
  };

  const scrollRight = () => {
    setInfoPopup(null);
    setIsExpanded(false);

    if (isSearchActive) {
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentIndex(randomIndex);
      }
      return;
    }

    // Navigate to a completely random card ID
    const randomId = Math.floor(Math.random() * MAX_CARD_ID) + 1;
    navigate(`/card/${randomId}`);
  };

  const handleSwipe = (direction) => {
    if (direction === "left") scrollRight();
    else if (direction === "right") scrollLeft();
  };

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((d) => nepaliNumerals[d])
      .join("");
  };

  if (loading)
    return (
      <div className="loading-container">
        <style>
          {`
            :root {
              --primary-text: #1F2937;
              --secondary-text: #6B7280;
              --gold-accent: #F49D37;
              --header-maroon: #800000;
              --neutral-gray: #D1D5DB;
            }

            .loading-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: linear-gradient(to bottom, #fffaf0, #ffffff);
            }
          `}
        </style>
        <FaSpinner className="animate-spin text-5xl text-[#F49D37]" />
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <style>
          {`
            :root {
              --primary-text: #1F2937;
              --secondary-text: #6B7280;
              --gold-accent: #F49D37;
              --header-maroon: #800000;
              --neutral-gray: #D1D5DB;
            }

            .error-container {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: linear-gradient(to bottom, #fffaf0, #ffffff);
              color: var(--primary-text);
              font-family: 'Merriweather', serif;
              font-size: 18px;
            }
          `}
        </style>
        Error: {error.message || error.toString()}
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="no-results-container">
        <style>
          {`
            :root {
              --primary-text: #1F2937;
              --secondary-text: #6B7280;
              --gold-accent: #F49D37;
              --header-maroon: #800000;
              --neutral-gray: #D1D5DB;
            }

            .no-results-container {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: linear-gradient(to bottom, #fffaf0, #ffffff);
              color: var(--primary-text);
              font-family: 'Merriweather', serif;
              font-size: 18px;
            }
          `}
        </style>
        No results found.
      </div>
    );

  const currentPerson = data[currentIndex];
  const isInfoOpen =
    isExpanded &&
    infoPopup === (currentPerson?.name || currentPerson?.name_in_nepali);

  return (
    <>
      <div className="card-view-container">
        <style>
          {`
            :root {
              --primary-text: #1F2937;
              --secondary-text: #6B7280;
              --gold-accent: #F49D37;
              --header-maroon: #800000;
              --neutral-gray: #D1D5DB;
              --background-start: #F8E5C0;
              --background-end: #CDE8D0;
              --primary-dark: #2E4568;
              --primary-hover: #4A6A9D;
              --secondary-light: #E9D4B0;
              --secondary-lighter: #D9C4A0;
              --white: #FFFFFF;
            }

            .card-view-container {
              padding: 0;
              display: flex;
              flex-direction: column;
              background: radial-gradient(circle at top, var(--background-start) 30%, var(--background-end) 100%);
            }

            .card-container {
              width: 100vw;
              height: calc(100vh - 60px);
              margin: 0;
              border-radius: 0;
              overflow: hidden;
              box-shadow: none;
              background-color: #fff;
              display: flex;
              flex-direction: column;
            }

            .card-wrapper {
              position: relative;
              width: 100%;
              flex-grow: 1;
              scroll-snap-align: center;
              display: flex;
              flex-direction: column;
            }

            .family-tree-modal {
              position: fixed;
              inset: 0;
              background-color: rgba(251, 247, 247, 0.6);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 50;
              backdrop-filter: blur(5px);
            }

            .family-tree-content {
              background: linear-gradient(to bottom, #fffaf0, #ffffff);
              width: 95%;
              max-height: 80vh;
              padding: 12px;
              border-radius: 15px;
              border: 2px solid var(--gold-accent);
              position: relative;
              overflow: auto;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .top-bar-wrapper {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10px 20px;
            }

            .top-bar-btn {
              padding: 8px 16px;
              border-radius: 6px;
              color: var(--secondary-light);
              background-color: var(--primary-dark);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              font-family: 'Playfair Display', serif;
              font-size: 14px;
              transition: all 0.3s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }

            .top-bar-btn:hover {
              background-color: var(--primary-hover);
              color: var(--white);
              transform: scale(1.05);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .home-icon-container {
              display: flex;
              justify-content: flex-start;
              padding: 10px;
              background-color: var(--primary-text);
              border-radius: 50%;
              padding: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .home-icon {
              font-size: 24px;
              color: var(--gold-accent);
              transition: all 0.3s ease;
              background-color: transparent;
            }

            .home-icon:hover {
              color: var(--primary-hover);
              transform: scale(1.1);
            }

            .flex-center {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            @media (min-width: 800px) {
              .card-view-container {
                padding: 20px;
                height: 100vh;
                padding-bottom: 4rem;
              }

              .card-container {
                width: 40vw;
                height: auto;
                margin: -20px auto 3rem;
                border-radius: 15px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                background-color: #fff;
              }

              .home-icon-container {
                display: none;
              }

              .family-tree-content {
                width: 91.666667%;
                max-width: 64rem;
                max-height: 90vh;
                padding: 24px;
              }
            }

            @media (max-width: 799px) {
              .top-bar-wrapper {
                display: none;
              }

              .home-icon-container {
                position: absolute !important;
                top: 8px;
                left: 8px;
                z-index: 20;
              }

              .card-container {
                border-radius: 0;
                box-shadow: none;
                height: calc(100vh - 60px);
                position: relative;
                top: -20px;
              }
            }
          `}
        </style>

        <div className="home-icon-container">
          <a href="https://gautamfamily.org.np/" className="home-icon">
            <FaHome />
          </a>
        </div>

        <div className="top-bar-wrapper">
          {!isMobile && (
            <ToggleView
              isTableView={isTableView}
              toggleView={toggleView}
              availableId={id}
            />
          )}
          <a
            href="https://gautamfamily.org.np/"
            className="top-bar-btn flex-center"
          >
            <FaHome />
            Homepage
          </a>
        </div>

        <div className="card-container">
          {isInfoOpen ? (
            <div className="card-wrapper">
              <CardImageSection
                person={currentPerson}
                isExpanded={isExpanded}
                onScrollLeft={scrollLeft}
                onScrollRight={scrollRight}
                isHovered={isHovered}
                onSwipe={() => {}}
                isMobile={isMobile}
                maleImage={male}
                femaleImage={female}
                convertToNepaliNumerals={convertToNepaliNumerals}
                onToggleInfo={handleToggleInfo}
              />
            </div>
          ) : (
            <TinderCard
              className="card-wrapper"
              preventSwipe={["up", "down"]}
              onSwipe={handleSwipe}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CardImageSection
                person={currentPerson}
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
          )}

          <CardFooterSection
            id={id}
            onGenerateFamilyTree={handleFooterGenerate}
            infoPopup={infoPopup}
            isMobile={isMobile}
            onSearchButtonClick={() => setShowSearchPopup(true)}
            isExpanded={isExpanded}
            onToggleInfo={handleToggleInfo}
            convertToNepaliNumerals={convertToNepaliNumerals}
            person={currentPerson}
          />
        </div>

        {selectedPerson && (
          <div className="family-tree-modal">
            <div className="family-tree-content">
              <FamilyTreeGraph
                id={id}
                selectedPerson={selectedPerson}
                isMobile={isMobile}
                closePopup={() => {
                  setSelectedPerson(null);
                  setIsHorizontal(false);
                }}
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
