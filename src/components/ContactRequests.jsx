import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCheck, FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import SuggestionModal from "./SuggestionModal";
import ClipLoader from "react-spinners/ClipLoader";
import { Check, Eye, X } from "lucide-react";

const ContactRequest = () => {
  const [contactrequests, setcontactrequests] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedContactRequest, setSelectedContactRequest] = useState(null);
  const [showContactRequestModal, setShowContactRequestModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchcontactrequests(1);
  }, []);

  const fetchcontactrequests = async (page) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_URL}/people/contact-requests/?page=${page}`
      );
      const contactrequestArray = response.data.data;
      if (page === 1) {
        setcontactrequests(contactrequestArray);
      } else {
        setcontactrequests((prev) => [...prev, ...contactrequestArray]);
      }
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error("Error fetching contactrequests:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  

  const handleViewClick = (contactrequests) => {
    setSelectedContactRequest(contactrequests);
    setShowContactRequestModal(true);
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
    <div className="contactdetails-responsive-wrapper">
      <style>
        {`
          /* Card (mobile) styles */
          .contactdetails-card-list-wrapper {
            display: block;
          }
          .contactdetails-card-list {
            display: flex;
            flex-direction: column;
            gap: 18px;
            max-width: 500px;
            margin: 0 auto;
          }
          .contactdetails-card {
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
          .contactdetails-card.expanded {
            box-shadow: 0 4px 16px rgba(0,0,0,0.13);
          }
          .contactdetails-main {
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
          .contactdetails-divider {
            border-bottom: 1px solid #ececec;
            margin: 0 0 0 0;
            width: 100%;
          }
          .contactdetails-detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.97rem;
            padding: 6px 0;
          }
          .contactdetails-detail-label {
            font-weight: 600;
            color: #1F2937;
            min-width: 60px;
          }
          .contactdetails-detail-value {
            color: #444;
            text-align: right;
            flex: 1;
          }
          .contactdetails-actions {
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
            .contactdetails-card-list-wrapper {
              display: none;
            }
            .contactdetails-table-wrapper {
              display: block;
            }
          }
          /* Hide table view on mobile */
          @media (max-width: 767px) {
            .contactdetails-table-wrapper {
              display: none;
            }
            .contactdetails-card-list-wrapper {
              display: block;
            }
          }
        `}
      </style>
      {/* Card view for mobile */}
      <div className="contactdetails-card-list-wrapper">
        <InfiniteScroll
          dataLength={contactrequests.length}
          next={() => {
            if (hasMore) {
              const nextPage = Math.floor(contactrequests.length / 15) + 1;
              fetchcontactrequests(nextPage);
            }
          }}
          hasMore={hasMore}
          style={{ overflow: "hidden" }}
        >
          <div className="contactdetails-card-list">
            {loading && contactrequests.length === 0 ? (
              <div className="no-data" style={{textAlign:'center'}}>
                <ClipLoader color="#D1D5DB" loading={true} size={35} />
              </div>
            ) : contactrequests.length === 0 ? (
              <div className="no-data">No contactrequests available.</div>
            ) : (
              contactrequests.map((contact) => {
                const isExpanded = expandedId === contact.id;
                return (
                  <div className={`contactdetails-card${isExpanded ? " expanded" : ""}`} key={contact.id}>
                    <button
                      className="expand-btn"
                      onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                    <div className="contactdetails-main">
                      {(() => {
                        const text = contact.reason || "-";
                        const words = text.split(" ");
                        if (words.length > 15) {
                          return words.slice(0, 15).join(" ") + " ...";
                        }
                        return text;
                      })()}
                    </div>
                    <div className="suggestion-meta byathi-meta">
                      {contact.person?.name_in_nepali || "-"}
                    </div>
                    {isExpanded && (
                      <>
                        <div className="contactdetails-divider" />
                        <div className="contactdetails-detail-row">
                          <span className="contactdetails-detail-label">नाम</span>
                          <span className="contactdetails-detail-value">{contact.requester_name || "-"}</span>
                        </div>
                        <div className="contactdetails-divider" />
                        <div className="contactdetails-detail-row">
                          <span className="contactdetails-detail-label">इमेल</span>
                          <span className="contactdetails-detail-value">{contact.requester_email || "-"}</span>
                        </div>
                        <div className="contactdetails-divider" />
                        <div className="contactdetails-detail-row">
                          <span className="contactdetails-detail-label">फोन</span>
                          <span className="contactdetails-detail-value">{contact.requester_phone || "-"}</span>
                        </div>
                        <div className="contactdetails-divider" />
                        <div className="contactdetails-detail-row">
                          <span className="contactdetails-detail-label">मिति</span>
                          <span className="contactdetails-detail-value">{convertToNepaliNumerals(new Date(contact.requested_at).toLocaleDateString())}</span>
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
      <div className="contactdetails-table-wrapper">
        <InfiniteScroll
          dataLength={contactrequests.length}
          next={() => {
            if (hasMore) {
              const nextPage = Math.floor(contactrequests.length / 15) + 1;
              fetchcontactrequests(nextPage);
            }
          }}
          hasMore={hasMore}
          style={{ overflow: "hidden" }}
        >
          <div className="table-wrapper flex-center">
            <table>
              <thead>
                <tr>
                  
                  <th>अनुरोध कारण</th>
                  <th>अनुरोध गरिएका व्यक्ति</th>
                  <th>अनुरोध गर्नेको नाम</th>
                  <th>इमेल</th>
                  <th>फोन</th>
                  <th>मिति</th>
                </tr>
              </thead>
              <tbody>
                {loading && contactrequests.length === 0 ? (
                  <tr className="loading-row">
                    <td colSpan={7} className="flex-center">
                      <ClipLoader color="var(--neutral-gray)" loading={true} size={35} />
                    </td>
                  </tr>
                ) : contactrequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
                      No Contact Requests available.
                    </td>
                  </tr>
                ) : (
                  contactrequests.map((contact) => (
                    <tr key={contact.id}>
                      <td className="contactdetails-text" style={{ display: "block" }}>
                        {(() => {
                          const text = contact.reason || "-";
                          const words = text.split(" ");
                          if (words.length > 15) {
                            return words.slice(0, 15).join(" ") + " ...";
                          }
                          return text;
                        })()}
                      </td>
                      <td>{contact.person_details?.name_in_nepali || "-"}</td>
                      <td>{contact.requester_name || "-"}</td>
                      <td>{contact.requester_email || "-"}</td>
                      <td>{contact.requester_phone || "-"}</td>
                      <td className="contactdetails-date">
                        {convertToNepaliNumerals(
                          new Date(contact.requested_at).toLocaleDateString()
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
      {showContactRequestModal && selectedContactRequest && (
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

export default ContactRequest;
