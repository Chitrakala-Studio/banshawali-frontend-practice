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
import { FaHome, FaSpinner, FaArrowDown, FaArrowUp } from "react-icons/fa";

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
  const [isNameAtTop, setIsNameAtTop] = useState(false); // Only for mobile

  const API_URL = import.meta.env.VITE_API_URL;
  const MAX_CARD_ID = 4000;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSearchActive) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        let cardId = id;

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
          navigate("/");
        }
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isSearchActive, navigate]);

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

  const handleMoveName = () => {
    if (isMobile) {
      setIsNameAtTop(!isNameAtTop);
      setIsExpanded(!isExpanded); // Toggle expanded state for mobile
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
      .map((d) => nepaliNumerals[parseInt(d)] || d)
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
              height: calc(100vh - 50px);
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
  background: #E9D4B0; 
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
              flex-wrap: wrap;
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

            .name-at-top {
              display: flex;
              align-items: center;
              gap: 8px;
              color: var(--secondary-light);
              background-color: var(--primary-dark);
              padding: 8px 16px;
              border-radius: 6px;
              font-family: 'Merriweather', serif;
              font-size: 16px;
              margin-left: auto; /* Align to the right */
            }

            .name-at-top button {
              background: transparent;
              border: none;
              color: var(--secondary-light);
              cursor: pointer;
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

              .name-at-top {
                display: none; /* Disable name-at-top for web view */
              }
            }

            @media (max-width: 799px) {
              .mobile-header-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 16px;
                background: var(--primary-dark);
                color: var(--secondary-light);
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 30;
              }
              .mobile-header-bar .person-name {
                font-family: 'Merriweather', serif;
                padding-left:9px;
                font-size: 18px;
                font-weight: 600;
                color: var(--secondary-light);
                margin: 0;
                flex: 1;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .mobile-header-bar .toggle-btn {
                background: transparent;
                border: none;
                color: var(--secondary-light);
                font-size: 20px;
                cursor: pointer;
                margin-left: 8px;
              }
              .card-container {
                margin-top: 50px;
              }
            }
          `}
        </style>
        {isMobile && !isExpanded && (
          <div
            className="top-bar-wrapper"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              background: "var(--primary-dark)",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ToggleView
              isTableView={isTableView}
              toggleView={toggleView}
              availableId={id}
            />
            <a
              href="https://gautamfamily.org.np/"
              className="top-bar-btn flex-center"
              style={{
                background: "transparent",
                color: "var(--gold-accent)",
                boxShadow: "none",
                borderRadius: "50%",
                padding: 0,
              }}
            >
              <FaHome style={{ fontSize: 24 }} />
            </a>
          </div>
        )}
        {isMobile && isExpanded && currentPerson && (
          <div
            className="mobile-header-bar"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              background: "var(--primary-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
            }}
          >
            <span className="person-name">
              {currentPerson?.name_in_nepali || currentPerson?.name || "-"}
              {currentPerson?.pusta_number && (
                <span style={{ marginLeft: "8px" }}>
                  {convertToNepaliNumerals(currentPerson?.pusta_number)}
                </span>
              )}
            </span>

            <button
              className="toggle-btn"
              onClick={(event) => {
                event.stopPropagation(); // Prevent swipe behavior
                handleMoveName();
              }}
              onTouchStart={(e) => e.stopPropagation()} // Prevent touch events
              onTouchMove={(e) => e.stopPropagation()} // Prevent touch move
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <FaArrowDown size={20} /> : <FaArrowUp size={20} />}
            </button>
          </div>
        )}
        {!isMobile && (
          <div className="top-bar-wrapper">
            <ToggleView
              isTableView={isTableView}
              toggleView={toggleView}
              availableId={id}
            />
            <a
              href="https://gautamfamily.org.np/"
              className="top-bar-btn flex-center"
            >
              <FaHome />
              <span className="top-bar-text">Homepage</span>
            </a>
          </div>
        )}

        <div className="card-container">
          {isExpanded ? (
            <div
              className="card-wrapper"
              style={{ paddingBottom: isMobile ? 80 : 0, touchAction: "pan-y" }}
            >
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
            onMoveName={handleMoveName}
            isNameAtTop={isNameAtTop}
            convertToNepaliNumerals={convertToNepaliNumerals}
            person={{
              ...currentPerson,
              pusta_number: currentPerson?.pusta_number
                ? convertToNepaliNumerals(currentPerson.pusta_number)
                : "-",
            }}
          />
        </div>

        {selectedPerson && (
          <div className="family-tree-modal">
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
