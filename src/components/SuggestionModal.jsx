import React from "react";
import { X } from "lucide-react"; // Or any other close icon

const SuggestionModal = ({ suggestion, onClose, convertToNepaliNumerals }) => {
  // Destructure person details from the nested suggestion_to object.
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

  // Suggestion text and image.
  const suggestionText = suggestion.suggestion || "No suggestion provided.";
  const imageUrl = suggestion.image;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "1200px",
          height: "80vh",
          display: "flex",
          flexDirection: "row",
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          position: "relative",
          padding: "30px",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "16px",
            top: "16px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          title="Close"
        >
          <X size={24} />
        </button>

        {/* Left Side: Suggestion and Image */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid #E5E7EB", // border on right to separate from person details
            textAlign: "left",
          }}
        >
          {/* Suggestion Text */}
          <div>
            <h3
              style={{
                marginBottom: "12px",
                fontSize: "18px",
                color: "#1F2937",
              }}
            >
              Suggestion
            </h3>
            <p style={{ fontSize: "16px", color: "#374151" }}>
              {suggestionText}
            </p>
          </div>

          {/* Suggestion Image */}
          <div style={{ marginTop: "16px", textAlign: "center" }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Suggestion"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "80%",
                  maxHeight: "500px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Click to view in full size"
                onClick={() => window.open(imageUrl, "_blank")}
              />
            ) : (
              <p style={{ color: "#6B7280" }}>No Image Provided.</p>
            )}
          </div>
        </div>

        {/* Right Side: Person Details */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            borderLeft: "1px solid #E5E7EB", // border on left for proper separation
            textAlign: "left",
          }}
        >
          <h2
            style={{
              marginBottom: "12px",
              fontSize: "22px",
              color: "#1F2937",
            }}
          >
            {personName}
          </h2>
          <p>
            <strong>Father's Name:</strong> {fatherName}
          </p>
          <p>
            <strong>Mother's Name:</strong> {motherName}
          </p>
          <p>
            <strong>Date of Birth:</strong> {dob}
          </p>
          <p>
            <strong>Pusta Number:</strong> {pustaNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
