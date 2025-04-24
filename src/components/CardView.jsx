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

  /* ───────────────────────── State ───────────────────────── */
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

  /* ───────────── Window‑resize listener for mobile flag ───────────── */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ───────────── Fetch person(s) when id changes or search resets ───────────── */
  useEffect(() => {
    if (isSearchActive) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/people/${id}/`, {
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
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isSearchActive, navigate]);

  /* ───────────── Keep URL in sync when searching within list ───────────── */
  useEffect(() => {
    if (isSearchActive && data.length > 0) {
      navigate(`/card/${data[currentIndex].id}`, { replace: true });
    }
  }, [currentIndex, data, isSearchActive, navigate]);

  /* ────────────────────── Handlers ────────────────────── */
  const toggleView = () => setIsTableView(!isTableView);

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
    setInfoPopup(null);
    setIsExpanded(false);
    if (isSearchActive) {
      if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    } else {
      navigate(`/card/${previousIndex}`);
    }
  };

  const scrollRight = () => {
    setInfoPopup(null);
    setIsExpanded(false);
    if (isSearchActive) {
      if (currentIndex < data.length - 1) setCurrentIndex((prev) => prev + 1);
    } else {
      navigate(`/card/${nextIndex}`);
    }
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

  /* ────────────────────── Early returns ────────────────────── */
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-t from-black via-black/60 to-transparent">
        <Circles
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="loading..."
        />
      </div>
    );

  if (error) return <div>Error: {error.message || error.toString()}</div>;

  if (!data || data.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white text-lg">No results found.</p>
      </div>
    );

  /* ────────────────────── Render ────────────────────── */
  const currentPerson = data[currentIndex];
  const isInfoOpen =
    isExpanded &&
    infoPopup === (currentPerson?.name || currentPerson?.name_in_nepali);

  return (
    <>
      <div className="flex flex-col h-screen bg-gradient-to-t from-black via-black/60 to-transparent">
        {/* Toggle table/card view button (desktop only) */}
        {!isMobile && (
          <ToggleView
            isTableView={isTableView}
            toggleView={toggleView}
            availableId={id}
          />
        )}

        {/* Card container */}
        <div
          className={
            isMobile
              ? "w-[98vw] m-auto rounded-2xl overflow-hidden"
              : "w-[40vw] m-auto rounded-2xl overflow-hidden"
          }
        >
          {/* ───── Conditional wrapper: plain <div> when info panel open ───── */}
          {isInfoOpen ? (
            <div className="relative w-full h-full snap-center flex flex-col group">
              <CardImageSection
                person={currentPerson}
                isExpanded={isExpanded}
                onScrollLeft={scrollLeft}
                onScrollRight={scrollRight}
                isHovered={isHovered}
                onSwipe={() => {}} // swipes disabled
                isMobile={isMobile}
                maleImage={male}
                femaleImage={female}
                convertToNepaliNumerals={convertToNepaliNumerals}
                onToggleInfo={handleToggleInfo}
              />
            </div>
          ) : (
            <TinderCard
              className="relative w-full h-full snap-center flex flex-col group"
              preventSwipe={["up", "down"]} // horizontal swipes allowed
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

          {/* Footer (always present) */}
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

        {/* Family‑tree modal */}
        {selectedPerson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-11/12 max-w-4xl max-h-[90vh] p-6 rounded-lg relative overflow-auto">
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
