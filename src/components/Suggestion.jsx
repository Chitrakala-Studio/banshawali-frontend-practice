import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import SuggestionModal from "./SuggestionModal"; // Import the new card

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSuggestions(1);
  }, []);

  const fetchSuggestions = async (page) => {
    try {
      const response = await axios.get(
        `${API_URL}/people/suggestions/?page=${page}`
      );
      const suggestionArray = response.data.data;
      if (page === 1) {
        setSuggestions(suggestionArray);
      } else {
        setSuggestions((prev) => [...prev, ...suggestionArray]);
      }
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setHasMore(false);
    }
  };

  const updateSuggestionStatus = async (
    id,
    newStatus,
    suggestionText,
    name_in_nepali,
    image
  ) => {
    try {
      const payload = {
        status: newStatus,
        suggestion: suggestionText,
        name_in_nepali: name_in_nepali,
        image: image,
        id: id,
      };
      await axios.put(`${API_URL}/people/suggestions/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setSuggestions((prevSuggestions) =>
        prevSuggestions.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      Swal.fire({
        title: `${newStatus}!`,
        text: `Suggestion status updated to ${newStatus}.`,
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating suggestion status:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update suggestion status.",
        icon: "error",
      });
    }
  };

  const handleAccept = (e, id, name_in_nepali, suggestionText, image) => {
    e.stopPropagation();
    updateSuggestionStatus(
      id,
      "Approved",
      suggestionText,
      name_in_nepali,
      image
    );
  };

  const handleReject = (e, id, name_in_nepali, suggestionText, image) => {
    e.stopPropagation();
    updateSuggestionStatus(
      id,
      "Rejected",
      suggestionText,
      name_in_nepali,
      image
    );
  };

  // Open the new SuggestionCard when the eye icon is clicked.
  const handleViewClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowSuggestionModal(true);
  };

  const convertToNepaliNumerals = (number) => {
    const nepaliNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((digit) => (digit === "/" ? "/" : nepaliNumerals[digit]))
      .join("");
  };

  return (
    <div className="table-wrapper">
      <InfiniteScroll
        dataLength={suggestions.length}
        next={() => {
          if (hasMore) {
            const nextPage = Math.floor(suggestions.length / 15) + 1;
            fetchSuggestions(nextPage);
          }
        }}
        hasMore={hasMore}
        loader={
          hasMore ? (
            <div className="flex justify-center items-center h-screen">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : null
        }
        style={{ overflow: "hidden" }}
      >
        <table className="ml-3 w-full">
          <thead className="text-center border-b-2 border-gray-700 bg-gray-100">
            <tr className="text-center">
              <th className="text-center">सुझाव</th>
              <th className="text-center">मिति</th>
              <th className="text-center">कार्यहरू</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion) => (
              <tr
                key={suggestion.id}
                className="border-b-2 border-gray-700 text-center hover:bg-gray-100"
              >
                <td className="text-center">{suggestion.suggestion}</td>
                <td className="text-center">
                  {convertToNepaliNumerals(
                    new Date(suggestion.date).toLocaleDateString()
                  )}
                </td>
                <td className="text-center">
                  {suggestion.status === "Pending" ? (
                    <>
                      <button
                        onClick={(e) =>
                          handleAccept(
                            e,
                            suggestion.id,
                            suggestion.suggestion_to?.name_in_nepali,
                            suggestion.suggestion,
                            suggestion.image
                          )
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-all mr-2"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={(e) =>
                          handleReject(
                            e,
                            suggestion.id,
                            suggestion.suggestion_to?.name_in_nepali,
                            suggestion.suggestion,
                            suggestion.image
                          )
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleViewClick(suggestion)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all ml-2"
                      >
                        <FaEye />
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          suggestion.status === "Approved"
                            ? "bg-green-100 text-green-700 px-2 py-1 rounded inline-flex items-center"
                            : suggestion.status === "Rejected"
                            ? "bg-red-100 text-red-700 px-2 py-1 rounded inline-flex items-center"
                            : ""
                        }
                      >
                        {suggestion.status === "Approved" && (
                          <FaCheck className="mr-1" />
                        )}
                        {suggestion.status === "Rejected" && (
                          <FaTimes className="mr-1" />
                        )}
                        {suggestion.status}
                      </span>
                      <button
                        onClick={() => handleViewClick(suggestion)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-all ml-2"
                      >
                        <FaEye />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>

      {/* Conditionally render the custom SuggestionCard */}
      {showSuggestionModal && selectedSuggestion && (
        <SuggestionModal
          suggestion={selectedSuggestion}
          onClose={() => {
            setShowSuggestionModal(false);
            setSelectedSuggestion(null);
          }}
          convertToNepaliNumerals={convertToNepaliNumerals}
        />
      )}
    </div>
  );
};

export default Suggestion;
