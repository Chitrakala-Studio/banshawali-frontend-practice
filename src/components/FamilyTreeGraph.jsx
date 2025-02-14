import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import axios from "axios";
import "./App.css";


// Fetch family data
const fetchFamilyData = async (id) => {
  try {
    if (!id) {
      console.error("Error: selectedPerson is undefined!");
      return null;
    }
    console.log(`Fetching data for ID: ${id}`);
    const response = await axios.get(`https://gautamfamily.org.np/familytree/${id}/`);
    console.log("Fetched Data:", response.data);
    // setCurrentData(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching family data:", error);
    return null;
  }
};

// Transform family data into ReactD3Tree format
const transformToTreeData = (familyData, newGenLevel) => {
  if (!familyData) return null;

  if (newGenLevel === "below") {
    return {
      name: familyData.selectedPerson,
      photo: familyData.photo,
      gender: familyData.gender,
      pusta: familyData.pusta,
      id: familyData.id,
      children: familyData.children ? familyData.children.map(child => ({
        name: child.name,
        photo: child.photo,
        gender: child.gender,
        pusta: child.pusta,
        id: child.id,
        children: child.children ? child.children.map(grandchild => ({
          name: grandchild.name,
          photo: grandchild.photo,
          gender: grandchild.gender,
          pusta: grandchild.pusta,
          id: grandchild.id,
        })) : []
      })) : []
    };
  }

  if (newGenLevel === "upper") {
    if (familyData.father) {
      if (familyData.father.father) {
        // Three-generation tree: Grandfather → Father & Siblings → Children
        return {
          name: familyData.father.father.name,
          photo: familyData.father.father.photo,
          gender: familyData.father.father.gender,
          pusta: familyData.father.father.pusta,
          id: familyData.father.father.id,
          children: familyData.father.father.children.map(sibling => ({
            name: sibling.name,
            photo: sibling.photo,
            gender: sibling.gender,
            pusta: sibling.pusta,
            id: sibling.id,
            children: sibling.id === familyData.father.id ? 
              (familyData.father.children || []).map(child => ({
                name: child.name,
                photo: child.photo,
                gender: child.gender,
                pusta: child.pusta,
                id: child.id,
              })) : []
          }))
        };
      } else {
        // Two-generation tree: Father → Children
        return {
          name: familyData.father.name,
          photo: familyData.father.photo,
          gender: familyData.father.gender,
          pusta: familyData.father.pusta,
          id: familyData.father.id,
          children: familyData.father.children ? familyData.father.children.map(child => ({
            name: child.name,
            photo: child.photo,
            gender: child.gender,
            pusta: child.pusta,
            id: child.id,
          })) : []
        };
      }
    }
  }

  return null;
};

// FamilyTreeGraph Component
const FamilyTreeGraph = ({ selectedPerson, isMobile, id }) => {
  const [treeData, setTreeData] = useState(null);
  const [generationLevel, setGenerationLevel] = useState("upper");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasUpperGeneration, setHasUpperGeneration] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const treeContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 850, height: 550 });
  const[currentData,setCurrentData] = useState();


  // Fetch Data and Determine Generation Level
  const fetchData = async (id, genLevel = null) => {
    try {
      setIsFetching(true);
      const data = await fetchFamilyData(id);
      setCurrentData(data);
      if (!data) {
        setTreeData(null);
        return;
      }

      const hasChildren = data.children && data.children.length > 0;
      const hasParents = data.father || data.mother;

      let newGenLevel = genLevel || generationLevel;
      if (hasChildren) {
        newGenLevel = "below";
      } else if (hasParents) {
        newGenLevel = "upper";
      } else {
        newGenLevel = "none";
      }

      setGenerationLevel(newGenLevel);
      setHasChildren(hasChildren);
      setHasUpperGeneration(hasParents);

      const tree = transformToTreeData(data, newGenLevel);
      setTreeData(tree);
    } catch (error) {
      setError("Failed to fetch family data");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  const handleGenerationChange = async (direction) => {
    setGenerationLevel(direction); // Explicitly update the state
    console.log("Selected Person",selectedPerson)
    console.log("ID:",currentData.father.id)
    fetchData(currentData.father.id);

  };
  const renderNode = (nodeDatum) => {
    const circleRadius = 50;
    const imageSize = circleRadius * 1.35;
    const photo = nodeDatum.photo; // Direct photo URL
    const gender = nodeDatum.gender;
    const shouldDisplayIcon = !photo || photo === "null"; // Check for null, undefined, or "null" as string
    // const nameLines = nodeDatum.name ? nodeDatum.name.split(' ') : [];
    const wrapText = (text, width) => {
      const words = text.split(" ")
      const lines = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        if (currentLine.length + words[i].length < width) {
          currentLine += " " + words[i]
        } else {
          lines.push(currentLine)
          currentLine = words[i]
        }
      }
      lines.push(currentLine)
      return lines
    }
    const nameLines = wrapText(nodeDatum.name, 12)
    // Single person node rendering
    return (
      <g className="tree">
        <rect
          x="-50"
          y="-50"
          width="165"
          height="68"
          rx="30"
          ry="30"
          fill="#f2f3f4 "
        />
        {shouldDisplayIcon ? (
               gender === "male" ? (
                <image x="-50.3" y="-50" rx="0" ry="0" width={imageSize} height={imageSize} href="src/assets/public/maleicon.png" preserveAspectRatio="xMidYMid slice" />
              ) : (
                <image x="-50.3" y="-50" rx="0" ry="0" width={imageSize} height={imageSize} href={"src/assets/public/iconfemale.png"} preserveAspectRatio="xMidYMid slice" />
              )
           
        ) : (
          
            <image x="-50.3" y="-50" rx="0" ry="0" width={imageSize} height={imageSize} href={nodeDatum.photo} preserveAspectRatio="xMidYMid slice" />
        
        )}
       <text
        x="60"
        y={-27.5 + (nameLines.length > 1 ? -10 : 0)}
        textAnchor="middle"
        fontSize="14"
        fontFamily="cursive"
        dominantBaseline="middle"
        fill="black"
        fontWeight= "200"
      >
        {nameLines.map((line, i) => (
          <tspan key={i} x="60" dy={i === 0 ? 0 : 20}
            fontWeight="200">
            {line}
          </tspan>
        ))}
      </text>
        <text
          x="50"
          y="15"
          textAnchor="middle"
          fontSize={12}
           fontWeight= "normal"
        >
          {nodeDatum.pusta}
        </text>
      </g>
    )
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!treeData) {
    return <div>No data available</div>;
  }
  dimensions.width = isMobile ? 850 : 550; // Adjust for mobile and desktop
  dimensions.height = isMobile ? 550 : 850; // Adjust for mobile and desktop
  const translateX = isMobile ? dimensions.width  : dimensions.width / 1.25; // 
  // Adjust for mobile and desktop
  const translateY = isMobile ? dimensions.height/1.5 : 80; // Adjust for mobile and desktop
  const nodeSize = isMobile ? { x: 160, y: 80 } : { x: 200, y: 150 }; // Smaller nodes on mobile
  const scale = 1; // Scale down the tree for mobile to fit

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%", zIndex: "100" }}>
        <div
          className="tree"
          ref={treeContainerRef}
          style={{
            width: isMobile ? "80vh" : "100%",
            height: isMobile ? "160vw" : "32em",
            display: "flex",
            flexDirection: "column", // Apply row when horizontal layout
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            transform: isMobile ? "rotate(90deg)" : "none", // Apply rotation only for horizontal layout
            transformOrigin: isMobile ? "down left" : "none", // Set the origin of the rotation when horizontal
            overflow: isMobile ? "auto" : "hidden", // Apply overflow for horizontal layout
            zIndex: "10"
          }}

        >


          <h2>{selectedPerson}'s Family Tree</h2>
          <ReactD3Tree
            data={treeData}
            orientation="vertical"
            nodeSize={nodeSize}
            pathFunc="step"
            draggable={false} // Disable dragging
            zoomable={true} // Disable zooming
            translate={{
              x: translateX,
              y: translateY,

            }}

            scale={scale} // Apply scaling for mobile view
            renderCustomNodeElement={({ nodeDatum }) => renderNode(nodeDatum)}
          />

        </div>
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "absolute",
          transform: isMobile ? "rotate(90deg)" : "none",
          top: isMobile ? "85%" : "10px",
          right: isMobile ? "-20px" : "0px",
          padding: "1em"
        }}>
          <button className="bg-purple-700/70 text-white px-4 py-2 my-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-slate-500 hover:text-white hover:opacity-75" onClick={() => handleGenerationChange("upper")} onTouchEnd={(e) => () => {
            e.stopPropagation()
            handleGenerationChange("upper")
          }} disabled={!hasUpperGeneration && generationLevel==="upper"} style={{
            opacity: ((hasUpperGeneration|| familyData.father) && generationLevel!=="upper" ) ? 1 : 0.5,
            cursor: ((hasUpperGeneration|| familyData.father) && generationLevel!=="upper") ? "pointer" : "not-allowed"

          }}>
            {isMobile ? "Above" : " Above Generation"}
          </button>
          <button className="bg-purple-700/70 text-white px-4 py-2 rounded-lg text-sm cursor-pointer z-20 hover:bg-slate-500 hover:text-white hover:opacity-75" onClick={() => handleGenerationChange("below")}
            onTouchEnd={(e) => {
              e.stopPropagation()
              handleGenerationChange("below")
            }
            }
            disabled={!hasChildren|| generationLevel==="below"} style={{
              opacity: (hasChildren && generationLevel!=="below") ? 1 : 0.5,
              cursor: (hasChildren && generationLevel!=="below") ? "pointer" : "not-allowed"
            }}>
            {isMobile ? "Below" : " Below Generation"}
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