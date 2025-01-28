import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import { Face6Outlined, Face3Outlined } from '@mui/icons-material'; // Import MUI icons

// Dummy database data (simulated API response)
const dummyDatabase = [
  {
    selectedPerson: "Ram Bahadur Kafle",
    fathersName: { name: "Pitashree", photo: "sample_1" },
    mothersName: { name: "Matashree", photo: "sample_6" },
    fathersSiblings: [
      { name: "Uncle 1", spouse: "Aunt-in-law 1", gender: "male", photo: null },
      { name: "Aunt 1", spouse: "Uncle-in-law 2", gender: "female", photo: null }
    ],
    grandfathersName: { name: "Grandfather", photo: "/assets/public/grandpa" },
    grandmothersName: { name: "Grandmother", photo:null },
    siblings: [
      { name: "Sibling 1", gender: "male", photo: "/assets/public/sample_2" },
      { name: "Sibling 2", gender: "female", photo: "/assets/public/sample_3" }
    ],
    gender: "male",
    photo: "/assets/public/sample_1"
  },
  {
    selectedPerson: "Sita Devi Kafle",
    fathersName: { name: "Pitashree", photo: null },
    mothersName: { name: "Matashree", photo: "/assets/public/sample_1" },
    fathersSiblings: [
      { name: "Uncle 1", spouse: "Aunt-in-law 1", gender: "male", photo: null },
      { name: "Aunt 1", spouse: "Uncle-in-law 2", gender: "female", photo: null }
    ],
    grandfathersName: { name: "Grandfather", photo: "/assets/public/grandpa" },
    grandmothersName: { name: "Grandmother", photo: "/assets/public/grandma" },
    siblings: [],
    gender: "female",
    photo: "assests/public/sample_3"
  }
];

// Simulated API function to fetch family data
const fetchFamilyData = async (selectedPerson) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const familyData = dummyDatabase.find(
        (data) => data.selectedPerson === selectedPerson
      );
      resolve(familyData);
    }, 1000); // Simulating API delay
  });
};

// Transforming API response to ReactD3Tree format
const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  return {
    name: `${familyData.grandfathersName.name} - ${familyData.grandmothersName.name}`,
    photo: familyData.grandfathersName.photo || familyData.grandmothersName.photo,
    children: [
      {
        name: `${familyData.fathersName.name} - ${familyData.mothersName.name}`,
        photo: familyData.fathersName.photo || familyData.mothersName.photo,
        children: [
          { 
            name: familyData.selectedPerson, 
            photo: familyData.photo, 
            gender: familyData.gender 
          }, // The selected person
          ...familyData.siblings.map((sibling) => ({
            name: sibling.name,
            photo: sibling.photo,
            gender: sibling.gender,
          }))
        ]
      },
      ...familyData.fathersSiblings.map((sibling) => ({
        name: sibling.spouse ? `${sibling.name} & ${sibling.spouse}` : sibling.name,
        photo: sibling.photo,
        gender: sibling.gender
      }))
    ]
  };
};

// Helper function to get the image URL or use MUI icons
const getImageOrIcon = (photo, gender) => {
  if (photo) {
    return photo; // Use the provided photo if available
  }
  // Use gender-based MUI icons for null photos
  return gender === "male" ? <Face6Outlined style={{ fontSize: 48 }} /> : <Face3Outlined style={{ fontSize: 48 }} />;
};

const FamilyTreeGraph = ({ selectedPerson, isMobile }) => {
  const [treeData, setTreeData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const treeContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const familyData = await fetchFamilyData(selectedPerson); // Simulated API call
      const tree = transformToTreeData(familyData);
      setTreeData(tree);
    };

    fetchData();
  }, [selectedPerson]);

  useEffect(() => {
    if (treeContainerRef.current) {
      setDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: treeContainerRef.current.offsetHeight,
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: treeContainerRef.current.offsetHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!treeData) {
    return <div>Loading...</div>;
  }

  // Adjusting for mobile and desktop responsiveness
  const translateX = isMobile ? dimensions.width / 3 : dimensions.width / 1.6; // Adjust for mobile and desktop
  const nodeSize = isMobile ? { x: 100, y: 80 } : { x: 200, y: 150 }; // Smaller nodes on mobile
  const scale = isMobile ? 0.8 : 1; // Scale down the tree for mobile to fit

  const renderNode = (nodeDatum) => {
    const isPair = nodeDatum.name.includes(" - ") || nodeDatum.name.includes(" & ");
    const photo = nodeDatum.photo; // Direct photo URL
    const gender = nodeDatum.gender;
  
    // Define icon color based on gender
    const iconColor = gender === "male" ? "#0000FF" : "#FF69B4"; // Blue for male, Pink for female
    const circleRadius = 47;
    const imageSize = circleRadius * 2;
  
    // Get the appropriate icon or image
    const imageOrIcon = getImageOrIcon(photo, gender); // Using the helper function here
  
    // If the node is a pair (e.g., a couple), handle it separately
    if (isPair) {
      const delimiter = nodeDatum.name.includes(" - ") ? " - " : " & ";
      const [firstName, secondName] = nodeDatum.name.split(delimiter);
  
      return (
        <g>
          {/* First Circle */}
          <circle
            cx="-48"
            cy="0"
            r={circleRadius}
            fill={photo ? "transparent" : iconColor} // Transparent if there's a photo, else color based on gender
            stroke={photo ? "none" : "#000"} // No stroke if photo exists
          />
          {imageOrIcon ? (
            <image
              x="-95"
              y="-45"
              width={imageSize}
              height={imageSize}
              href={imageOrIcon}
              clipPath="circle(50%)"
            />
          ) : (
            imageOrIcon
          )}
          <text fill="white" x="-50" y="58" textAnchor="middle" fontSize={14}>
            {firstName}
          </text>
  
          {/* Second Circle */}
          <circle
            cx="48"
            cy="0"
            r={circleRadius}
            fill={photo ? "transparent" : iconColor} // Transparent if there's a photo, else color based on gender
            stroke={photo ? "none" : "#000"} // No stroke if photo exists
          />
          {imageOrIcon ? (
            <image
              x="0"
              y="-45"
              width={imageSize}
              height={imageSize}
              href={imageOrIcon}
              clipPath="circle(50%)"
            />
          ) : (
            imageOrIcon
          )}
          <text fill="white" x="48" y="58" textAnchor="middle" fontSize={14}>
            {secondName}
          </text>
        </g>
      );
    }
  
    // Single person node rendering
    return (
      <g>
        <circle
          r={circleRadius}
          fill={photo ? "transparent" : iconColor} // Transparent if there's a photo, else color based on gender
          stroke={photo ? "none" : "#000"} // No stroke if photo exists
        />
        {imageOrIcon ? (
          <image
            x="-48"
            y="-48"
            width={imageSize}
            height={imageSize}
            href={imageOrIcon}
            clipPath="circle(50%)"
          />
        ) : (
          imageOrIcon
        )}
        <text fill="white" x="0" y="55" textAnchor="middle" fontSize={14}>
          {nodeDatum.name}
        </text>
      </g>
    );
  };
  

  return (
    <div
      ref={treeContainerRef}
      style={{
        width: "100%",
        height: "32em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <h2>{selectedPerson}'s Family Tree</h2>
        <ReactD3Tree
          data={treeData}
          orientation="vertical"
          nodeSize={nodeSize}
          pathFunc="step"
          draggable={false} // Disable dragging
          zoomable={false} // Disable zooming
          translate={{
            x: translateX,
            y: 50,
          }}
          scale={scale} // Apply scaling for mobile view
          renderCustomNodeElement={({ nodeDatum }) => renderNode(nodeDatum)}
        />
      </div>
    </div>
  );
};

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default FamilyTreeGraph;
