import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import { Face, Face3 } from "@mui/icons-material"; // Import MUI icons

// Dummy database data (simulated API response)
const dummyDatabase = [
  {
    selectedPerson: "Ram Bahadur Kafle",
    father: { name: "Pitashree", photo: "null", gender: "male", pusta: "10" },
    mother: { name: "Matashree", photo: "/assets/public/sample_6.jpg", gender: "female", pusta: "10" },
    fathersSiblings: [
      { name: "Uncle 1", spouse: { name: "Aunt-in-law 1", photo: null, gender: "female", pusta: "10" }, gender: "male", photo: null, pusta: "10" },
      { name: "Aunt 1", spouse: null, gender: "female", photo: null, pusta: "10" }
    ],
    grandfather: { name: "Grandfather", photo: "/assets/public/grandpa.jpg", gender: "male", pusta: "9" },
    grandmother: { name: "Grandmother", photo: null, gender: "female", pusta: "9" },
    siblings: [
      { name: "Sibling 1", gender: "male", photo: null , pusta: "11" },
      { name: "Sibling 2", gender: "female", photo: "/assets/public/sample_3.jpg", pusta: "11" }
    ],
    gender: "male",
    photo: "/assets/public/sample_1",
    pusta: "11"
  },
  {
    selectedPerson: "Sita Devi Kafle",
    father: { name: "Pitashree", photo: null, gender: "male", pusta: "12" },
    mother: { name: "Matashree", photo: "/assets/public/sample_1", gender: "female", pusta: "12" },
    fathersSiblings: [
      { name: "Uncle 1", spouse: { name: "Aunt-in-law 1", photo: "/assets/public/sample_2", gender: "female", pusta: "12" }, gender: "male", photo: null, pusta: "12" },
      { name: "Aunt 1", spouse: null, gender: "female", photo: null, pusta: "12" }
    ],
    grandfather: { name: "Grandfather", photo: "/assets/public/grandpa", gender: "male", pusta: "11" },
    grandmother: { name: "Grandmother", photo: "/assets/public/grandma", gender: "female", pusta: "11" },
    siblings: [],
    gender: "female",
    photo: "/assets/public/sample_3",
    pusta: "13"
  }
];

// Simulated API function to fetch family data
const fetchFamilyData = async (selectedPerson) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const familyData = dummyDatabase.find((data) => data.selectedPerson === selectedPerson);
      resolve(familyData);
    }, 1000); // Simulating API delay
  });
};

// Transforming API response to ReactD3Tree format
const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  return {
    name: `${familyData.grandfather.name} - ${familyData.grandmother.name}`,
    photo: `${familyData.grandfather.photo} - ${familyData.grandmother.photo}`,
    gender: `${familyData.grandfather.gender} - ${familyData.grandmother.gender}`,
    pusta: `${familyData.grandfather.pusta} - ${familyData.grandmother.pusta}`,
    children: [
      {
        name: `${familyData.father.name} - ${familyData.mother.name}`,
        photo: `${familyData.father.photo} - ${familyData.mother.photo}`,
        gender: `${familyData.father.gender} - ${familyData.mother.gender}`,
        pusta: `${familyData.father.pusta} - ${familyData.mother.pusta}`,
        children: [
          {
            name: familyData.selectedPerson,
            photo: familyData.photo,
            gender: familyData.gender,
            pusta: familyData.pusta
          },
          ...familyData.siblings.map((sibling) => ({
            name: sibling.name,
            photo: sibling.photo,
            gender: sibling.gender,
            pusta: sibling.pusta
          }))
        ]
      },
      ...familyData.fathersSiblings.map((sibling) => ({
        name: sibling.spouse ? `${sibling.name} & ${sibling.spouse.name}` : sibling.name,
        photo: sibling.spouse ? `${sibling.photo} & ${sibling.spouse.photo}` : sibling.photo,
        gender: sibling.spouse ? `${sibling.gender} & ${sibling.spouse.gender}` : sibling.gender,
        pusta: sibling.spouse ? `${sibling.pusta} & ${sibling.spouse.pusta}` : sibling.pusta
      }))
    ]
  };
};

// Rendering the tree data with photos or icons
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
        height: treeContainerRef.current.offsetHeight
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: treeContainerRef.current.offsetHeight
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderNode = (nodeDatum) => {
    const isPair = nodeDatum.name.includes(" - ") || nodeDatum.name.includes(" & ");
    

    // Blue for male, Pink for female

    const circleRadius = 47;
    const imageSize = circleRadius * 2;
    if(!isPair){
      const photo = nodeDatum.photo; // Direct photo URL
      const gender = nodeDatum.gender;
      const iconColor = gender === "male" ? "#93d9d9" : "#fab3eb"; // Blue for male, Pink for female
      const shouldDisplayIcon = !photo || photo === "null"; // Check for null, undefined, or "null" as string

      return (
        <g>
          <circle
            r={circleRadius}
            fill={shouldDisplayIcon ? iconColor : "transparent"} // Use iconColor if no photo, else transparent
            stroke={shouldDisplayIcon ? "#000" : "white"} // Dark stroke if no photo
          />
          {shouldDisplayIcon ? (
            <foreignObject x="-47" y="-47" width={imageSize} height={imageSize}>
              <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {gender === "male" ? (
                  <Face style={{ fontSize: imageSize / 1.5 }} />
                ) : (
                  <Face3 style={{ fontSize: imageSize / 1.5 }} />
                )}
              </div>
            </foreignObject>
          ) : (
            <image
              x={-circleRadius}
              y={-circleRadius}
              width={imageSize}
              height={imageSize}
              href={photo}
              clipPath="circle(50%)"
            />
          )}
          <text fill="white" x="0" y="60" textAnchor="middle" fontSize={14}>
            {nodeDatum.name}
          </text>
          <text fill="white" x="0" y="75" textAnchor="middle" fontSize={14}>
            {nodeDatum.pusta}
          </text>
        </g>
      );
    
  
    
  }
    // If the node is a pair (e.g., a couple), handle it separately
    if (isPair) {
      const delimiter = nodeDatum.name.includes(" - ") ? " - " : " & ";
      const [firstName, secondName] = nodeDatum.name.split(delimiter);
      const [photo1, photo2] = nodeDatum.photo.split(delimiter);
      const [gender1, gender2] = nodeDatum.gender.split(delimiter);
      const [pusta1, pusta2] = nodeDatum.pusta.split(delimiter);
      const iconColor1 = gender1 === "male" ? "#93d9d9" : "#fab3eb";
      const iconColor2 = gender2 === "male" ? "#93d9d9" : "#fab3eb";
      return (
        <g>
          {/* First Circle */}
          <circle
            cx="-47"
            cy="0"
            r={circleRadius}
            fill={photo1 === "null" ? iconColor1 : "transparent"} // Transparent if there's a photo, else color based on gender
            stroke={photo1 === "null" ? "#000" : "white"} // No stroke if photo exists
          />
          {photo1 === "null" ? (
            <foreignObject x="-95" y="-47" width={imageSize} height={imageSize}>
              <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {gender1 === "male" ? (
                  <Face style={{ fontSize: imageSize / 1.5 }} />
                ) : (
                  <Face3 style={{ fontSize: imageSize / 1.5 }} />
                )}
              </div>
            </foreignObject>
          ) : (
            <image
              x="-95"
              y="-45"
              width={imageSize}
              height={imageSize}
              href={photo1}
              clipPath="circle(50%)"
            />)}
          <text fill="white" x="-50" y="58" textAnchor="middle" fontSize={14}>
            {firstName}
          </text>
          <text fill="white" x="-50" y="72" textAnchor="middle" fontSize={14}>
            {pusta1}
          </text>

          {/* Second Circle */}
          <circle
            cx="47"
            cy="0"
            r={circleRadius}
            fill={photo2 === "null" ? iconColor2 : "transparent"} // Transparent if there's a photo, else color based on gender
            stroke={photo2=== "null" ? "#000":"white"  } // No stroke if photo exists
          />
          {photo2 === "null" ? (
            <foreignObject x="0" y="-47" width={imageSize} height={imageSize}>
              <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {gender2 === "male" ? (
                  <Face style={{ fontSize: imageSize / 1.5 }} />
                ) : (
                  <Face3 style={{ fontSize: imageSize / 1.5 }} />
                )}
              </div>
            </foreignObject>

          ) : (
            <image
              x="0"
              y="-45"
              width={imageSize}
              height={imageSize}
              href={photo2}
              clipPath="circle(50%)"
            />
          )}
          <text fill="white" x="48" y="58" textAnchor="middle" fontSize={14}>
            {secondName}
          </text>
          <text fill="white" x="48" y="72" textAnchor="middle" fontSize={14}>
            {pusta2}
          </text>
        </g>
      );
    }
    
    // Single person node rendering
   
  };

  if (!treeData) {
    return <div>Loading...</div>;
  }

  const translateX = isMobile ? dimensions.width / 3 : dimensions.width / 1.7; // Adjust for mobile and desktop
  const nodeSize = isMobile ? { x: 100, y: 80 } : { x: 200, y: 150 }; // Smaller nodes on mobile
  const scale = isMobile ? 0.8 : 1.2; // Scale down the tree for mobile to fit

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
