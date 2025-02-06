import { useState } from "react";
import PropTypes from "prop-types";
import FamilyTreeModal from "./FamilyTreeModal";

const CardViewPopup = ({ selectedData, onClose }) => {
    const [showFamilyTree, setShowFamilyTree] = useState(false);

    if (!selectedData) return null;

    return (
        <>
            {/* Main CardView Popup */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                <div
                    className="relative bg-cover bg-center bg-no-repeat rounded-lg max-w-lg w-full h-[500px] shadow-lg"
                    style={{
                        backgroundImage: `url(${selectedData.photo_url || "https://via.placeholder.com/150"})`,
                    }}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-gray-700 font-bold text-lg z-10 bg-white rounded-full px-2 py-1"
                        onClick={onClose}
                    >
                        &#x2715;
                    </button>

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white flex flex-col justify-end p-6">
                        <h2 className="text-2xl font-bold">{selectedData.name}</h2>
                        <div className="flex justify-center items-center bg-[#E9FFEF] text-[#409261] text-base font-normal rounded-full h-10 w-32 mt-2">
                            Pusta no. {selectedData.pusta_number}
                        </div>
                        <button
                            className="mt-4 bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-white hover:text-purple-700"
                            onClick={() => setShowFamilyTree(true)}
                            onTouchEnd={() => setShowFamilyTree(true)}
                        >
                            Generate Family Tree
                        </button>
                    </div>
                </div>
            </div>

            {/* Family Tree Modal */}
            {showFamilyTree && (
                <FamilyTreeModal
                    familyData={selectedData}
                    onClose={() => setShowFamilyTree(false)}
                />
            )}
        </>
    );
};

CardViewPopup.propTypes = {
    selectedData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo_url: PropTypes.string,
        pusta_number: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default CardViewPopup;