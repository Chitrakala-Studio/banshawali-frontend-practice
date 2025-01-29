import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import { Face, Face3 } from "@mui/icons-material"; // Import MUI icons

// Dummy database data (simulated API response)
const dummyDatabase = [
  {
    selectedPerson: "Ram Bahadur Kafle",
    father: { name: "Pitashree", photo: "null", gender: "male", pusta: "10" },
    mother: { name: "Matashree", photo: "src/assets/public/sample_6.jpg", gender: "female", pusta: "10" },
    fathersSiblings: [
      { name: "Uncle 1", spouse: { name: "Aunt-in-law 1", photo: null, gender: "female", pusta: "10" }, gender: "male", photo: null, pusta: "10" },
      { name: "Aunt 1", spouse: null, gender: "female", photo: null, pusta: "10" }
    ],
    grandfather: { name: "Grandfather", photo: "src/assets/public/grandpa.jpg", gender: "male", pusta: "9" },
    grandmother: { name: "Grandmother", photo: "src/assets/public/grandma.jpg", gender: "female", pusta: "9" },
    siblings: [
      { name: "Sibling 1", gender: "male", photo: null , pusta: "11" },
      { name: "Sibling 2", gender: "female", photo: "src/assets/public/sample_3.jpg", pusta: "11" }
    ],
    gender: "male",
    photo: "src/assets/public/sample_1.jpg",
    pusta: "11",
    spouse: { name: "Sita Devi Kafle", photo: null, gender: "female", pusta: "11" }
  },
  {
    selectedPerson: "Sita Devi Kafle",
    // father: { name: "Pitashree", photo: null, gender: "male", pusta: "12" },
    // mother: { name: "Matashree", photo: "src/assets/public/sample_1.jpg", gender: "female", pusta: "12" },
    father: null,
    mother: null,
    fathersSiblings: [
      { name: "Uncle 1", spouse: { name: "Aunt-in-law 1", photo: "src/assets/public/sample_2.jpg", gender: "female", pusta: "12" }, gender: "male", photo: null, pusta: "12" },
      { name: "Aunt 1", spouse: null, gender: "female", photo: null, pusta: "12" }
    ],
    grandfather: { name: "Grandfather", photo: "src/assets/public/grandpa.jpg", gender: "male", pusta: "11" },
    grandmother: { name: "Grandmother", photo: "src/assets/public/grandma.jpg", gender: "female", pusta: "11" },
    siblings: [],
    spouse: { name: "Hari Kafle", gender: "male", photo: "src/assets/public/sample_4.jpg", pusta: "14" },  // Add spouse here
    children: [ // Adding children to Sita Devi Kafle
      {
        name: "Child 1",
        gender: "male",
        photo: "src/assets/public/sample_2.jpg",
        pusta: "14",
        spouse: { name: "Spouse 1", gender: "female", photo: "src/assets/public/sample_1.jpg", pusta: "14" },
        children: [ // Adding grandchildren for Child 1
          { name: "Grandchild 1", gender: "female", photo: null , pusta: "15" },
          { name: "Grandchild 2", gender: "male", photo: null, pusta: "15" }
        ]
      },
      {
        name: "Child 2",
        gender: "female",
        photo: "src/assets/public/sample_6.jpg",
        pusta: "14",
        spouse: { name: "Spouse 2", gender: "male", photo: "null", pusta: "14" },
        children: [ // Adding grandchildren for Child 2
          { name: "Grandchild 3", gender: "male", photo: "src/assets/public/sample_3.jpg", pusta: "15" },
          { name: "Grandchild 4", gender: "female", photo: "src/assets/public/sample_4.jpg", pusta: "15" }
        ]
      }
    ],
    gender: "female",
    photo: "src/assets/public/sample_3.jpg",
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
const transformToTreeData = (familyData,generationLevel) => {
  if (!familyData) return null;
  if (generationLevel === "below") {
    return {
      name: `${familyData.selectedPerson} & ${familyData.spouse.name}`,  // Selected person and spouse at the top
      photo: `${familyData.photo} & ${familyData.spouse.photo}`,
      gender: `${familyData.gender} & ${familyData.spouse.gender}`,
      pusta: `${familyData.pusta} & ${familyData.spouse.pusta}`,
      children: [
        ...familyData.children.map((child) => ({
          name: child.spouse ? `${child.name} & ${child.spouse.name}` : child.name,  // Add child + spouse if exists
          photo: child.spouse ? `${child.photo} & ${child.spouse.photo}` : child.photo,
          gender: child.spouse ? `${child.gender} & ${child.spouse.gender}` : child.gender,
          pusta: child.spouse ? `${child.pusta} & ${child.spouse.pusta}` : child.pusta,
          children: child.children.map((grandchild) => ({
            name: grandchild.name,
            photo: grandchild.photo,
            gender: grandchild.gender,
            pusta: grandchild.pusta
          }))
        }))
      ]
    };
  }

  if (generationLevel === "upper") {
     return {
    name: `${familyData.grandfather.name} - ${familyData.grandmother.name}`,
    photo: `${familyData.grandfather.photo} - ${familyData.grandmother.photo}`,
    gender: `${familyData.grandfather.gender} - ${familyData.grandmother.gender}`,
    pusta: `${familyData.grandfather.pusta} - ${familyData.grandmother.pusta}`,
    spouse: `${familyData.name} - ${familyData.spouse.name}`,
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
}

// Rendering the tree data with photos or icons
const FamilyTreeGraph = ({ selectedPerson, isMobile }) => {
  const [treeData, setTreeData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 550 });
  const treeContainerRef = useRef(null);
  const [generationLevel, setGenerationLevel] = useState("current");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasUpperGeneration, setHasUpperGeneration] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const familyData = await fetchFamilyData(selectedPerson); // Simulated API call
      setHasChildren(familyData.children && familyData.children.length > 0);

      // Checking if the selected person has a father or mother for "Upper Generation" button
      setHasUpperGeneration(familyData.father || familyData.mother);
      if (familyData.father || familyData.mother) {
        setGenerationLevel("upper");  // Default to upper generation if available
      } else {
        setGenerationLevel("below");  // Otherwise, default to lower generation
      }
  
      const tree = transformToTreeData(familyData, generationLevel);
      setTreeData(tree);
    };

    fetchData();
  }, [selectedPerson, generationLevel]);

  const handleGenerationChange = (direction) => {
    setGenerationLevel(direction);
  };

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

    const circleRadius = 45;
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
            stroke={ "white"} // Dark stroke if no photo
          />
          {shouldDisplayIcon ? (
            <foreignObject x="-45" y="-45" width={imageSize} height={imageSize}>
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
            cx="-45"
            cy="0"
            r={circleRadius}
            fill={photo1 === "null" ? iconColor1 : "transparent"} // Transparent if there's a photo, else color based on gender
            stroke={ "white"} // No stroke if photo exists
          />
          {photo1 === "null" ? (
            <foreignObject x="-90" y="-45" width={imageSize} height={imageSize}>
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
            cx="45"
            cy="0"
            r={circleRadius}
            fill={photo2 === "null" ? iconColor2 : "transparent"} // Transparent if there's a photo, else color based on gender
            stroke={"white"  } // No stroke if photo exists
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

  const translateX = isMobile ? dimensions.width / 3 : dimensions.width / 2; // Adjust for mobile and desktop
  const nodeSize = isMobile ? { x: 100, y: 80 } : { x: 180, y: 190 }; // Smaller nodes on mobile
  const scale = isMobile ? 0.8 : 1.2; // Scale down the tree for mobile to fit

  return (
    <>
    
    <div
      ref={treeContainerRef}
      style={{
        width: "100%",
        height: "32em",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
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
      <div style={{display:"flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute", top: "0px", right: "0", padding: "1em"}}>
      <button className="bg-purple-700/70 text-white px-4 py-2 my-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-slate-500 hover:text-white hover:opacity-75" onClick={() => handleGenerationChange("upper") } disabled={!hasUpperGeneration} style={{
        opacity: hasUpperGeneration ? 1 : 0.5,
        cursor: hasUpperGeneration ? "pointer" : "not-allowed"

      }}>
       Above Generation
      </button>
      <button className="bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-slate-500 hover:text-white hover:opacity-75" onClick={() => handleGenerationChange("below")} disabled={!hasChildren} style={{
        opacity: hasChildren ? 1 : 0.5,
        cursor: hasChildren ? "pointer" : "not-allowed"
      }}>
       Below Generation
      </button>
        
      </div>
    </div>
    </>
  );
};

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default FamilyTreeGraph;
