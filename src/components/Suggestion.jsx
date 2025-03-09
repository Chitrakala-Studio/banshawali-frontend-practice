import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaTimes } from "react-icons/fa";

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
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
    image
  ) => {
    try {
      const payload = {
        status: newStatus,
        suggestion: suggestionText,
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

  const handleAccept = (e, id, suggestion, image) => {
    // Prevent event from bubbling to the row
    e.stopPropagation();
    updateSuggestionStatus(id, "Approved", suggestion, image);
  };

  const handleReject = (e, id, suggestion, image) => {
    e.stopPropagation();
    updateSuggestionStatus(id, "Rejected", suggestion, image);
  };

  // Opens a SweetAlert modal with suggestion details
  const handleViewClick = (suggestion) => {
    Swal.fire({
      title: "Suggestion Details",
      html: `
        <div style="text-align: left;">
          <p><strong>Suggestion:</strong> ${suggestion.suggestion}</p>
          ${
            suggestion.image
              ? `<img src="${suggestion.image}" alt="Suggestion" style="max-width: 400px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;" />`
              : "No Image"
          }
        </div>
      `,
      showCloseButton: true,
      showCancelButton: false,
    });
  };

  return (
    <div className="table-wrapper">
      <InfiniteScroll
        dataLength={suggestions.length}
        next={() => {
          const nextPage = Math.floor(suggestions.length / 15) + 1;
          fetchSuggestions(nextPage);
        }}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center h-screen">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        }
        style={{ overflow: "hidden" }}
      >
        <table className="ml-3 w-full">
          <thead className="text-center border-b-2 border-gray-700 bg-gray-100">
            <tr className="text-center">
              <th className="text-center">Suggestion</th>
              <th className="text-center">Image</th>
              <th className="text-center">Date</th>
              <th className="text-center">View</th>
              <th className="text-center">Actions</th>
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
                  {suggestion.image ? (
                    <img
                      src={
                        suggestion.image.startsWith("http")
                          ? suggestion.image
                          : `${API_URL}${suggestion.image}`
                      }
                      alt="Suggestion"
                      className="w-10 h-10 object-cover rounded-full inline-block"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="text-center">
                  {new Date(suggestion.date).toLocaleDateString()}
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleViewClick(suggestion)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-all"
                  >
                    View
                  </button>
                </td>

                <td className="text-center">
                  {suggestion.status === "Pending" ? (
                    <>
                      <button
                        onClick={(e) =>
                          handleAccept(
                            e,
                            suggestion.id,
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
                            suggestion.suggestion,
                            suggestion.image
                          )
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-all"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default Suggestion;
