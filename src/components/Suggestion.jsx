import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";

const Suggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSuggestions(1);
  }, []);

  const fetchSuggestions = async (page) => {
    try {
      const response = await axios.get(
        `${API_URL}/people/suggestions/?page=${page}`
      );
      console.log("API Response:", response.data); // Log the API response
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

  // Update suggestion status with name_in_nepali
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
        name_in_nepali: name_in_nepali, // Ensure name_in_nepali is included
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

  // Handle accept and reject with name_in_nepali
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

  // Handle view click with name_in_nepali
  const handleViewClick = (suggestion) => {
    console.log("Suggestion Object:", suggestion); // Log the suggestion object
    Swal.fire({
      title: `Suggestion Details for ${suggestion.name_in_nepali}`,
      html: `
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" rel="stylesheet" crossorigin="anonymous">
        <div style="text-align: left;">
          <p><strong>Suggestion:</strong> ${suggestion.suggestion}</p>
          ${
            suggestion.image
              ? `<img src="${suggestion.image}" alt="Suggestion" style="max-width: 400px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;" />`
              : "No Image"
          }
        </div>
    `,
      backdrop: `rgba(10,10,10,0.8)`,
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: "Close",
      didOpen: () => {
        const titleElement = document.querySelector(".swal2-title");
        if (titleElement) {
          titleElement.style.fontSize = "24px";
          titleElement.style.color = "antiquewhite";
          titleElement.style.fontFamily = "Times New Roman, sans-serif";
          titleElement.style.letterSpacing = "1px";
          titleElement.style.fontWeight = "bold";
          titleElement.style.marginBottom = "15px";
          titleElement.style.borderBottom = "2px solid #eaeaea";
          titleElement.style.paddingBottom = "10px";
        }
        const popupElement = document.querySelector(".swal2-popup");
        if (popupElement) {
          popupElement.style.backgroundColor = "#0b1d2e";
          popupElement.style.borderRadius = "10px";
          popupElement.style.padding = "20px";
          popupElement.style.border = "2px solid #0b1d2e";
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
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
                            suggestion.name_in_nepali,
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
                            suggestion.name_in_nepali,
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
    </div>
  );
};

export default Suggestion;
