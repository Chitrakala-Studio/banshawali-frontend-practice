import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import SuggestionModal from "./SuggestionModal";
import ClipLoader from "react-spinners/ClipLoader";
import { Check, Eye, X } from "lucide-react";

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSuggestions(1);
  }, []);

  const fetchSuggestions = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_URL}/suggestions/?page=${page}`
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
      await axiosInstance.put(`${API_URL}/suggestions/${id}/`, payload, {
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
    <div className="suggestion-responsive-wrapper">
      <style>
        {`
          /* Card (mobile) styles */
          .suggestion-card-list-wrapper {
            display: block;
          }
          .suggestion-card-list {
            display: flex;
            flex-direction: column;
            gap: 18px;
            max-width: 500px;
            margin: 0 auto;
          }
          .suggestion-card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            padding: 12px 16px 10px 16px;
            display: flex;
            flex-direction: column;
            font-family: 'Merriweather', serif;
            position: relative;
            transition: box-shadow 0.2s;
          }
          .suggestion-card.expanded {
            box-shadow: 0 4px 16px rgba(0,0,0,0.13);
          }
          .suggestion-main {
            font-size: 1.18rem;
            color: #1F2937;
            font-weight: 700;
            word-break: break-word;
            margin-bottom: 2px;
            margin-top: 2px;
          }
          .byathi-meta {
            font-size: 0.93rem;
            color: #2E4568;
            font-weight: 400;
            margin-bottom: 2px;
            margin-top: 0px;
          }
          .suggestion-divider {
            border-bottom: 1px solid #ececec;
            margin: 0 0 0 0;
            width: 100%;
          }
          .suggestion-detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.97rem;
            padding: 6px 0;
          }
          .suggestion-detail-label {
            font-weight: 600;
            color: #1F2937;
            min-width: 60px;
          }
          .suggestion-detail-value {
            color: #444;
            text-align: right;
            flex: 1;
          }
          .suggestion-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 18px;
            margin-top: 10px;
          }
          .action-btn {
            background: none;
            border: none;
            color: #2E4568;
            font-size: 1.1rem;
            padding: 4px;
            border-radius: 50%;
            transition: background 0.15s, color 0.15s, transform 0.15s;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .action-btn:hover {
            background: #f0f4fa;
            color: #4A6A9D;
            transform: scale(1.1);
          }
          .status-approved {
            background: #10B981;
            color: #fff;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 0.92rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .status-rejected {
            background: #EF4444;
            color: #fff;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 0.92rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
          .expand-btn {
            position: absolute;
            top: 10px;
            right: 14px;
            background: none;
            border: none;
            color: #2E4568;
            font-size: 1.2rem;
            cursor: pointer;
            transition: color 0.15s;
            z-index: 2;
          }
          .expand-btn:hover {
            color: #4A6A9D;
          }
          .no-data {
            text-align: center;
            color: #6B7280;
            font-size: 1.1rem;
            padding: 24px 0;
          }
          /* Hide card view on tablet/desktop */
          @media (min-width: 768px) {
            .suggestion-card-list-wrapper {
              display: none;
            }
            .suggestion-table-wrapper {
              display: block;
            }
          }
          /* Hide table view on mobile */
          @media (max-width: 767px) {
            .suggestion-table-wrapper {
              display: none;
            }
            .suggestion-card-list-wrapper {
              display: block;
            }
          }
        `}
      </style>
      {/* Card view for mobile */}
      <div className="suggestion-card-list-wrapper">
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
          <div className="suggestion-card-list">
            {loading && suggestions.length === 0 ? (
              <div className="no-data" style={{textAlign:'center'}}>
                <ClipLoader color="#D1D5DB" loading={true} size={35} />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="no-data">No suggestions available.</div>
            ) : (
              suggestions.map((suggestion) => {
                const isExpanded = expandedId === suggestion.id;
                return (
                  <div className={`suggestion-card${isExpanded ? " expanded" : ""}`} key={suggestion.id}>
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                    <div className="suggestion-main">
                      {(() => {
                        const text = suggestion.suggestion || "-";
                        const words = text.split(" ");
                        if (words.length > 15) {
                          return words.slice(0, 15).join(" ") + " ...";
                        }
                        return text;
                      })()}
                    </div>
                    <div className="suggestion-meta byathi-meta">
                      {suggestion.suggestion_to?.name_in_nepali || "-"}
                    </div>
                    {isExpanded && (
                      <>
                        <div className="suggestion-divider" />
                        <div className="suggestion-detail-row">
                          <span className="suggestion-detail-label">नाम</span>
                          <span className="suggestion-detail-value">{suggestion.suggestion_by_name || "-"}</span>
                        </div>
                        <div className="suggestion-divider" />
                        <div className="suggestion-detail-row">
                          <span className="suggestion-detail-label">इमेल</span>
                          <span className="suggestion-detail-value">{suggestion.suggestion_by_email || "-"}</span>
                        </div>
                        <div className="suggestion-divider" />
                        <div className="suggestion-detail-row">
                          <span className="suggestion-detail-label">फोन</span>
                          <span className="suggestion-detail-value">{suggestion.suggestion_by_phone || "-"}</span>
                        </div>
                        <div className="suggestion-divider" />
                        <div className="suggestion-detail-row">
                          <span className="suggestion-detail-label">मिति</span>
                          <span className="suggestion-detail-value">{convertToNepaliNumerals(new Date(suggestion.date).toLocaleDateString())}</span>
                        </div>
                        <div className="suggestion-divider" />
                        <div className="suggestion-actions">
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
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </InfiniteScroll>
      </div>
      {/* Table view for desktop/tablet */}
      <div className="suggestion-table-wrapper">
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
                    <td colSpan={7} className="flex-center">
                      <ClipLoader color="var(--neutral-gray)" loading={true} size={35} />
                    </td>
                  </tr>
                ) : suggestions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
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
                      <td>{suggestion.suggestion_to?.name_in_nepali || "-" }</td>
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
      </div>
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
