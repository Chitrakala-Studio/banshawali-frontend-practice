import React, { useState, useEffect, useRef } from "react";
import PropTypes, { node } from "prop-types";
import ReactD3Tree from "react-d3-tree";
// import {maleicon} from "src/assets/public/maleicon.png"; // Import MUI icons 
// import {femaleicon} from "src/assets/public/femaleicon.jpg"; // Import MUI icons
import "./App.css";
import { WrapText } from "@mui/icons-material";
import axios from "axios";
// Dummy database data (simulated API response)
// const dummyDatabase = [
//   {
//     id: "4",
//     selectedPerson: "Ram Bahadur Kafle",
//     father: {
//       name: "Pitashree",
//       photo:  "src/assets/public/sample_1.jpg",
//       gender: "male",
//       pusta: "10",
//       children: [
//         { id: "10", name: "Sita Kumari", pusta: "11", gender: "female", photo:null},
//         { id: "4", name: "Ram Bahadur Kafle", pusta: "11", gender: "male" , photo: null}
//       ],
//       father: { // Grandfather (father's father)
//         name: "Grandfather of Ram",
//         photo: "src/assets/public/sample_2.jpg",
//         gender: "male",
//         pusta: "9",
//         father: {
//           name: "hello",
//           id: "7",
//           pusta: "8",
//           gender: "male"

//         },
//         children: [
//           { id: "4", name: "Pitashree", pusta: "10", gender: "male"  }, // Father's child
//           { id: "5", name: "aunt 1", pusta: "10", gender: "female",photo: "src/assets/public/sample_1.jpg" }  // Father's sibling
//         ]
//       }
//     },
//     gender: "male",
//     photo: "src/assets/public/sample_1.jpg",
//     pusta: "11",
//     children: [
//       { id: "6", name: "children", pusta: "12", gender: "male", photo: "src/assets/public/sample_1.jpg" ,
//         children: [
//         {
//           id: "21",
//           name:"chora nati",
//           pusta: "13",
//           gender:"male", 
//         }
//       ]

//       }, // Father's child
//       { id: "7", name: "baby", pusta: "12", gender: "female" }  // Father's sibling
//     ]

//   },
//   {
//     id: "5",
//     selectedPerson: "Sita Devi Kafle",
//     father: {
//       name: "Pitashree",
//       photo: null,
//       gender: "male",
//       pusta: "12",
//       children: [
//         { id: "6", name: "Child 1", pusta: "12", gender: "male" },
//         { id: "5", name: "Sita Devi Kafle", pusta: "12", gender: "female" }
//       ],
//       father: { // Grandfather (father's father)
//         name: "Grandfather of Sita",
//         photo: "src/assets/public/sample_1.jpg",
//         gender: "male",
        
//         pusta: "11",
//         children: [
//           { id: "5", name: "Pitashree", pusta: "12", gender: "male" },
//           { id: "6", name: "Aunt 2", pusta: "12", gender: "female" }
//         ]
//       }
//     },
//     gender: "female",
//     photo: "src/assets/public/sample_6.jpg",
//     pusta: "13"
//   }
// ];


// Simulated API function to fetch family data
const fetchFamilyData = async (selectedPerson) => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`/api/family-data/${selectedPerson}`);
    return response.data;  // Assuming the API response contains the family data
  } catch (error) {
    console.error("Error fetching family data:", error);
    throw new Error("Failed to fetch family data");  // You can handle the error as needed
  }
};
// const fetchData = async () => {
//   try {
//     const familyData = await fetchFamilyData(selectedPerson); // API call using axios
//     const hasFather = familyData.father !== null; // Check if father exists
//     const hasChildren = familyData.father && familyData.father.children && familyData.father.children.length > 0;

//     // If no father info but has children, default to the "below" generation
//     if (!hasFather && hasChildren) {
//       setGenerationLevel("below");  // Set to show children if no father
//     } else {
//       setGenerationLevel("current");  // Otherwise, keep the current generation view
//     }

//     setHasChildren(hasChildren);  // Update whether the selected person has children
//     setHasUpperGeneration(familyData.father || familyData.mother);  // If either parent exists, we can go "above"

//     // Transform family data to the appropriate generation level
//     const tree = transformToTreeData(familyData, generationLevel);
//     setTreeData(tree);

//   } catch (error) {
//     console.error("Error in fetchData:", error);
//   }
// };


// Transforming API response to ReactD3Tree format
 // Helper function to transform data into tree structure
 const transformToTreeData = (familyData, generationLevel) => {
  if (!familyData) return null;

  const hasFatherFather = familyData.father && familyData.father.father; // Check if grandfather exists

  // Show "below" generation (children) if father is missing but there are children
  if (generationLevel === "below") {
    return {
      name: familyData.selectedPerson,
      photo: familyData.photo,
      gender: familyData.gender,
      pusta: familyData.pusta,
      id: familyData.id,
      children: familyData.children ? familyData.children.map((child) => ({
        name: child.name,
        photo: child.photo,
        gender: child.gender,
        pusta: child.pusta,
        id: child.id,
        children: child.children ? child.children.map((grandchild) => ({
          name: grandchild.name,
          photo: grandchild.photo,
          gender: grandchild.gender,
          pusta: grandchild.pusta,
          id: grandchild.id
        })) : [] // If no grandchildren, keep it empty
      })) : [] // If no children, show empty children
    };
  }
  

  // Show "above" generation (father’s father) if grandfather exists
  if (generationLevel === "upper" && hasFatherFather) {
    return {
      name: familyData.father.father.name,
      photo: familyData.father.father.photo,
      gender: familyData.father.father.gender,
      pusta: familyData.father.father.pusta,
      id: familyData.id,
      children: [
        ...familyData.father.father.children.map((sibling) => {
          if (sibling.name === familyData.father.name) {
            return {
              name: familyData.father.name,
              photo: familyData.father.photo,
              gender: familyData.father.gender,
              pusta: familyData.father.pusta,
              id: familyData.father.id,
              children: familyData.father.children.map((child) => ({
                name: child.name,
                photo: child.photo,
                gender: child.gender,
                pusta: child.pusta,
                id: child.id
              }))
            };
          } else {
            return {
              name: sibling.name,
              photo: sibling.photo,
              gender: sibling.gender,
              pusta: sibling.pusta,
              id: sibling.id,
              children: sibling.children
            };
          }
        })
      ]
    };
  }

  // If no grandfather, show just the father and his children
  if (generationLevel === "upper" && !hasFatherFather) {
    return {
      name: familyData.father.name,
      photo: familyData.father.photo,
      gender: familyData.father.gender,
      pusta: familyData.father.pusta,
      id: familyData.father.id,
      children: familyData.father.children.map((child) => ({
        name: child.name,
        photo: child.photo,
        gender: child.gender,
        pusta: child.pusta,
        id: child.id
      }))
    };
  }
};



// Rendering the tree data with photos or icons
const FamilyTreeGraph = ({ selectedPerson, isMobile }) => {
  const [treeData, setTreeData] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 850, height: 550 });
  const treeContainerRef = useRef(null);
  const [generationLevel, setGenerationLevel] = useState("current");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasUpperGeneration, setHasUpperGeneration] = useState(false);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
 
  // Data fetching effect
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsFetching(true);
      const data = await fetchFamilyData(selectedPerson);
      setFamilyData(data);
      setHasChildren(data.children && data.children.length > 0);
      setHasUpperGeneration(data.father);
      const tree = transformToTreeData(data, generationLevel);
      setTreeData(tree);
    } catch (error) {
      setError("Failed to fetch family data");
    } finally {
      setIsFetching(false);
    }
  };

  fetchData();  // Fetch data when selectedPerson or generationLevel change
}, [selectedPerson, generationLevel]);

// Cleanup effect for resetting isFetching on unmount
useEffect(() => {
  return () => {
    setIsFetching(false);  // Reset fetching state when the component unmounts
  };
}, []);


  const handleGenerationChange = (direction) => {
    setGenerationLevel(direction);

    // Re-fetch and transform the family data based on the new generation level
    fetchData();
  };

  useEffect(() => {
    if (treeContainerRef.current) {
      setDimensions({
        width: treeContainerRef.current.offsetWidth,
        height: treeContainerRef.current.offsetHeight
      });
      const handleResize = () => {
        setDimensions({
          width: treeContainerRef.current.offsetWidth,
          height: treeContainerRef.current.offsetHeight
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);


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
  const translateX = isMobile ? dimensions.width / 2.5 : dimensions.width / 1.25; // 
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