import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import SuggestionModal from "./SuggestionModal";
import ClipLoader from "react-spinners/ClipLoader";
import { Check, Eye, X } from "lucide-react";

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSuggestions(1);
  }, []);

  const fetchSuggestions = async (page) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
    <div className="suggestion-table-wrapper">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --approved-bg: #10B981;
            --approved-text: #FFFFFF;
            --rejected-bg: #EF4444;
            --rejected-text: #FFFFFF;
            --header-start: #6B7280;
            --header-end: #4B5563;
            --header-text: #FFFFFF;
            --row-bg: #F9FAFB;
            --row-alt-bg: #FFFFFF;
            --row-hover-bg: #E5E7EB;
            --neutral-gray: #D1D5DB;
            --action-btn: #2E4568;
            --action-btn-hover: #4A6A9D;
          }

          

          .suggestion-table-wrapper table {
            width: 100%;
            border-collapse: collapse;
            background: var(--row-alt-bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }

          .suggestion-table-wrapper thead {
            background: linear-gradient(to bottom, var(--header-start), var(--header-end));
            color: var(--header-text);
            text-align: center;
            border-bottom: 2px solid var(--neutral-gray);
            font-family: 'Playfair Display', serif;
          }

          .suggestion-table-wrapper th, .suggestion-table-wrapper td {
            padding: 12px 16px;
            text-align: center;
            vertical-align: middle;
            font-family: 'Merriweather', serif;
          }

          .suggestion-table-wrapper tbody tr:nth-child(even) {
            background-color: var(--row-bg);
          }

          .suggestion-table-wrapper tbody tr:nth-child(odd) {
            background-color: var(--row-alt-bg);
          }

          .suggestion-table-wrapper tbody tr:hover {
            background-color: var(--row-hover-bg);
            transition: background-color 0.3s ease;
          }

          .suggestion-text {
            color: var(--primary-text);
            text-align: left;
          }

          .suggestion-date {
            color: var(--secondary-text);
          }

          .status-approved {
            background-color: var(--approved-bg);
            color: var(--approved-text);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .status-rejected {
            background-color: var(--rejected-bg);
            color: var(--rejected-text);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .action-btn {
            color: var(--action-btn);
            transition: color 0.15s ease;
            padding: 4px;
          }

          .action-btn:hover,
          .action-btn:focus {
            color: var(--action-btn-hover);
            transform: scale(1.1);
            outline: none;
          }

          .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .no-data {
            text-align: center;
            padding: 16px;
            color: var(--secondary-text);
            font-family: 'Merriweather', serif;
          }

          .loading-row {
            height: 60px;
          }

          .loading-row td {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
        `}
      </style>

      <InfiniteScroll
        dataLength={suggestions.length}
        next={() => {
          if (hasMore) {
            const nextPage = Math.floor(suggestions.length / 15) + 1;
            fetchSuggestions(nextPage);
          }
        }}
        hasMore={hasMore}
        style={{ overflow: "hidden" }}
      >
        <div className="table-wrapper flex-center">
          <table>
            <thead>
              <tr>
                <th>सुझाव</th>      
                <th>सुझाव गरिएका व्यक्ति</th>          
                <th>सुझाव दिनेको नाम</th>
                <th>इमेल</th>
                <th>फोन</th>
                <th>मिति</th>
                <th>कार्यहरू</th>
              </tr>
            </thead>
            <tbody>
              {loading && suggestions.length === 0 ? (
                <tr className="loading-row">
                  <td colSpan={3} className="flex-center">
                    <ClipLoader
                      color="var(--neutral-gray)"
                      loading={true}
                      size={35}
                    />
                  </td>
                </tr>
              ) : suggestions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="no-data">
                    No suggestions available.
                  </td>
                </tr>
              ) : (
                suggestions.map((suggestion) => (
                  <tr key={suggestion.id}>
                    <td className="suggestion-text" style={{ display: "block" }}>
                      {(() => {
                        const text = suggestion.suggestion || "-";
                        const words = text.split(" ");
                        if (words.length > 15) {
                          return words.slice(0, 15).join(" ") + " ...";
                        }
                        return text;
                      })()}
                    </td>
                    <td>{suggestion.suggestion_to.name_in_nepali || "-" }</td>
                    <td>{suggestion.suggestion_by_name || "-"}</td>
                    <td>{suggestion.suggestion_by_email || "-"}</td>
                    <td>{suggestion.suggestion_by_phone || "-"}</td>          
                    <td className="suggestion-date">
                      {convertToNepaliNumerals(
                        new Date(suggestion.date).toLocaleDateString()
                      )}
                    </td>
                    <td className="flex-center">
                      {suggestion.status === "Pending" ? (
                        <>
                          <button
                            className="action-btn"
                            onClick={(e) =>
                              handleAccept(
                                e,
                                suggestion.id,
                                suggestion.suggestion_to?.name_in_nepali,
                                suggestion.suggestion,
                                suggestion.image
                              )
                            }
                            aria-label="Accept Suggestion"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={(e) =>
                              handleReject(
                                e,
                                suggestion.id,
                                suggestion.suggestion_to?.name_in_nepali,
                                suggestion.suggestion,
                                suggestion.image
                              )
                            }
                            aria-label="Reject Suggestion"
                          >
                            <X size={18} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => handleViewClick(suggestion)}
                            aria-label="View Suggestion"
                          >
                            <Eye size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className={
                              suggestion.status === "Approved"
                                ? "status-approved"
                                : "status-rejected"
                            }
                          >
                            {suggestion.status === "Approved" && (
                              <FaCheck size={14} />
                            )}
                            {suggestion.status === "Rejected" && (
                              <FaTimes size={14} />
                            )}
                            {suggestion.status}
                          </span>
                          <button
                            className="action-btn"
                            onClick={() => handleViewClick(suggestion)}
                            aria-label="View Suggestion"
                          >
                            <FaEye size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </InfiniteScroll>

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
