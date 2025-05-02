import React from "react";
import { X } from "lucide-react";

const SuggestionModal = ({ suggestion, onClose, convertToNepaliNumerals }) => {
  console.log("Suggestions:"  , suggestion);
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
    <div className="suggestion-modal">
      <style>
        {`
          :root {
            --primary-text: #1F2937;
            --secondary-text: #6B7280;
            --header-dark: #14632F;
            --header-maroon: #800000;
            --gold-accent: #F49D37;
            --neutral-gray: #D1D5DB;
          }

          .suggestion-modal {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
          }

          .modal-container {
            width: 90%;
            max-width: 960px;
            max-height: 95vh;
            display: flex;
            flex-direction: column;
            border-radius: 30px;
            background: linear-gradient(to bottom, #14632F, #800000);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px solid var(--gold-accent);
            padding: 4px;
            overflow: hidden;
          }

          .modal-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            border-radius: 26px;
            background: linear-gradient(to bottom, #fffaf0, #ffffff);
          }

          @media (min-width: 768px) {
            .modal-content {
              flex-direction: row;
            }
          }

          .close-btn {
            position: absolute;
            right: 16px;
            top: 16px;
            z-index: 10;
            background-color: var(--gold-accent);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s ease, transform 0.2s ease;
          }

          .close-btn:hover,
          .close-btn:focus {
            background-color: #e68b2a;
            transform: scale(1.05);
            outline: none;
          }

          .close-btn svg {
            color: var(--header-maroon);
            width: 24px;
            height: 24px;
          }

          .left-section,
          .right-section {
            flex: 1;
            padding: 24px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .left-section {
            border-bottom: 1px solid var(--gold-accent);
            border-radius: 26px 26px 0 0;
            background: linear-gradient(to right, #fffaf0, #ffffff);
            box-shadow: inset -5px 0 10px rgba(0, 0, 0, 0.05);
          }

          .right-section {
            border-radius: 0 0 26px 26px;
            background: linear-gradient(to left, #fffaf0, #ffffff);
            box-shadow: inset 5px 0 10px rgba(0, 0, 0, 0.05);
          }

          @media (min-width: 768px) {
            .left-section {
              border-bottom: none;
              border-right: 1px solid var(--gold-accent);
              border-radius: 26px 0 0 26px;
            }

            .right-section {
              border-radius: 0 26px 26px 0;
            }
          }

          .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .left-section .section-title {
            color: var(--header-dark);
          }

          .right-section .section-title {
            color: var(--header-maroon);
            font-size: 28px;
          }

          .section-text {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            line-height: 1.6;
          }

          .detail-item {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-text);
            margin-bottom: 12px;
          }

          .detail-item strong {
            color: var(--header-dark);
            font-weight: 600;
          }

          .suggestion-image {
            width: 100%;
            max-height: 400px;
            height: auto;
            margin: 0 auto;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            border: 2px solid var(--gold-accent);
            transition: opacity 0.2s ease;
            cursor: pointer;
          }

          .suggestion-image:hover {
            opacity: 0.9;
          }

          .no-image-text {
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--secondary-text);
            font-style: italic;
            text-align: center;
          }
        `}
      </style>

      <div className="suggestion-modal">
        <div className="modal-container">
          <div className="modal-content">
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <X />
            </button>

            <div className="left-section">
              <div>
                <h3 className="section-title">सुझाव</h3>
                <p className="section-text">{suggestionText}</p>
              </div>

              <div className="mt-6 text-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Suggestion"
                    className="suggestion-image"
                    onClick={() => window.open(imageUrl, "_blank")}
                    title="Click to view in full size"
                  />
                ) : (
                  <p className="no-image-text">No Image Provided.</p>
                )}
              </div>
            </div>

            <div className="right-section">
              <h2 className="section-title">{personName}</h2>
              <div className="space-y-3">
                <p className="detail-item">
                  <strong>बुबाको नाम:</strong> {fatherName}
                </p>
                <p className="detail-item">
                  <strong>आमाको नाम:</strong> {motherName}
                </p>
                <p className="detail-item">
                  <strong>जन्म मिति:</strong> {dob}
                </p>
                <p className="detail-item">
                  <strong>पुस्ता नम्बर:</strong> {pustaNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;