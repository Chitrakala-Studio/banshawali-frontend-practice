import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";

// Dummy database data
const dummyDatabase = [
  {
    selectedPerson: "Ram Bahadur Kafle",
    fathersName: "Pitashree",
    mothersName: "Matashree",
    fathersSiblings: [
      { name: "Uncle 1", spouse: "Aunt-in-law 1" },
      { name: "Aunt 1", spouse: null }
    ],
    grandfathersName: "Grandfather ",
    grandmothersName: "Grandmother",
    siblings: ["Sibling 1", "Sibling 2"]
  },
  {
    selectedPerson: "Sita Devi Kafle",
    fathersName: "Pitashre",
    mothersName: "Matashre",
    fathersSiblings: [
      { name: "Uncle 1", spouse: "Aunt-in-law 1" },
      { name: "Aunt 1", spouse: "Uncle-in-law 2" }
    ],
    grandfathersName: "Grandfather",
    grandmothersName: "Grandmother",
    siblings: []
  }
];

// Simulated API function
const fetchFamilyData = async (selectedPerson) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const familyData = dummyDatabase.find((data) => data.selectedPerson === selectedPerson);
      resolve(familyData);
    }, 1000); // Simulating API delay
  });
};

// Transform API response to ReactD3Tree format
const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  return {
    name: `${familyData.grandfathersName} - ${familyData.grandmothersName}`,
    children: [
      {
        name: `${familyData.fathersName} - ${familyData.mothersName}`, // Father and Mother combined
        children: [
          { name: familyData.selectedPerson }, // The selected person
          ...familyData.siblings.map((s) => ({ name: s })) // Other siblings
        ]
      },
      ...familyData.fathersSiblings.map((sibling) => ({
        name: sibling.spouse ? `${sibling.name} & ${sibling.spouse}` : sibling.name
      }))
    ]
  };
};

const FamilyTreeGraph = ({ selectedPerson }) => {
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

  if (!treeData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={treeContainerRef}
      style={{
        width: "100%",
        height: "500px",
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
          nodeSize={{ x: 200, y: 150 }}
          pathFunc="step"
          draggable={false} // Disable dragging
          zoomable={false} // Disable zooming 
          translate={{ x: dimensions.width / 1.8, y:50 }}
          renderCustomNodeElement={({ nodeDatum }) => {
            const isPair = nodeDatum.name.includes(" - ") || nodeDatum.name.includes(" & "); // Check if it's a pair (either "-" or "&")
          
            if (isPair) {
              // Determine the delimiter (" - " or " & ") and split the name
              const delimiter = nodeDatum.name.includes(" - ") ? " - " : " & ";
              const [firstName, secondName] = nodeDatum.name.split(delimiter);
          
              return (
                <g>
                  {/* First Circle */}
                  <circle cx="-48" cy="0" r={47} fill="#e7f3e9" />
                  <text fill="none" x="-46" y="5" textAnchor="middle" fontSize="16">
                    {firstName}
                  </text>
          
                  {/* Second Circle */}
                  <circle cx="48" cy="0" r={47} fill="#e7f3e9" />
                  <text fill="none" x="50" y="5" textAnchor="middle" fontSize="16">
                    {secondName}
                  </text>
                </g>
              );
            }
          
            // For single names (e.g., selected person or siblings)
            return (
              <g>
                <circle r={48} fill="#e7f3e9" />
                <text fill="white" x="0" y="5" textAnchor="middle">
                  {nodeDatum.name}
                </text>
              </g>
            );
          }}
          
          
        />
      </div>
    </div>
  );
};

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
};

export default FamilyTreeGraph;
