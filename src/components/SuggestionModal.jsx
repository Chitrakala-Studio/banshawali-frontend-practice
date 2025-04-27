import React from "react";
import { X } from "lucide-react";

const SuggestionModal = ({ suggestion, onClose, convertToNepaliNumerals }) => {
  const person = suggestion.suggestion_to;
  const personName = person?.name_in_nepali || "Unknown";
  const fatherName = person?.father_name || "Not available";
  const motherName = person?.mother_name || "Not available";
  const dob = person?.dob
    ? new Date(person.dob).toLocaleDateString()
    : "Not available";
  const pustaNumber = person?.pusta_number
    ? convertToNepaliNumerals(person.pusta_number)
    : "Not available";

  const suggestionText = suggestion.suggestion || "No suggestion provided.";
  const imageUrl = suggestion.image;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
      <div
        className="w-[90%] max-w-5xl max-h-[95vh] flex flex-col md:flex-row shadow-2xl relative overflow-hidden"
        style={{
          borderRadius: "30px",
          background: "linear-gradient(to bottom, #14632F, #800000)", // Dark green to maroon gradient
          boxShadow:
            "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.1)",
          border: "2px solid #F49D37", // Gold border
          padding: "4px", // Space for inner content
        }}
      >
        {/* Inner Content with White Background */}
        <div
          className="w-full h-full flex flex-col md:flex-row"
          style={{
            borderRadius: "26px", // Slightly smaller radius to fit within outer border
            background: "linear-gradient(to bottom, #fffaf0, #ffffff)", // Creamy page-like background
          }}
        >
          {/* Close Button with Circle */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10"
            title="Close"
            style={{
              backgroundColor: "#F49D37", // Gold circle
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e68b2a")
            } // Darker gold on hover
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#F49D37")
            }
          >
            <X size={24} style={{ color: "#800000" }} /> {/* Maroon X */}
          </button>

          {/* Left Side: Suggestion and Image (Left Page of the Book) */}
          <div
            className="flex-1 p-6 md:p-8 flex flex-col justify-between"
            style={{
              borderRight: "1px solid #d4af37",
              borderRadius: "26px 0 0 26px",
              background: "linear-gradient(to right, #fffaf0, #ffffff)",
              position: "relative",
              boxShadow: "inset -5px 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Suggestion Text */}
            <div>
              <h3
                className="text-xl md:text-2xl font-semibold mb-4"
                style={{
                  color: "#14632F",
                  fontFamily: "'Playfair Display', serif",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                सुझाव
              </h3>
              <p
                className="text-base md:text-lg leading-relaxed"
                style={{
                  color: "#374151",
                  fontFamily: "'Merriweather', serif",
                }}
              >
                {suggestionText}
              </p>
            </div>

            {/* Suggestion Image */}
            <div className="mt-6 text-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Suggestion"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "auto",
                    maxHeight: "700px",
                    margin: "0 auto",
                    borderRadius: "15px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    border: "2px solid #F49D37",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  title="Click to view in full size"
                  onClick={() => window.open(imageUrl, "_blank")}
                />
              ) : (
                <p
                  className="italic"
                  style={{
                    color: "#6B7280",
                    fontFamily: "'Merriweather', serif",
                  }}
                >
                  No Image Provided.
                </p>
              )}
            </div>
          </div>

          {/* Right Side: Person Details (Right Page of the Book) */}
          <div
            className="flex-1 p-6 md:p-8"
            style={{
              background: "linear-gradient(to left, #fffaf0, #ffffff)",
              borderRadius: "0 26px 26px 0",
              boxShadow: "inset 5px 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h2
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{
                color: "#800000",
                fontFamily: "'Playfair Display', serif",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            >
              {personName}
            </h2>
            <div
              className="space-y-3 text-base md:text-lg"
              style={{
                color: "#374151",
                fontFamily: "'Merriweather', serif",
              }}
            >
              <p>
                <strong style={{ color: "#14632F" }}>बुबाको नाम:</strong>{" "}
                {fatherName}
              </p>
              <p>
                <strong style={{ color: "#14632F" }}>आमाको नाम:</strong>{" "}
                {motherName}
              </p>
              <p>
                <strong style={{ color: "#14632F" }}>जन्म मिति:</strong> {dob}
              </p>
              <p>
                <strong style={{ color: "#14632F" }}>पुस्ता नम्बर:</strong>{" "}
                {pustaNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
