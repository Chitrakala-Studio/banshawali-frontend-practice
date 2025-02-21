"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ReactD3Tree from "react-d3-tree"
import axios from "axios"
import { ChevronRight } from "lucide-react"
import "./App.css"
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_API_URL;

const fetchFamilyData = async (id) => {
  try {
    if (!id) return null
    console.log(`Fetching data for ID: ${id}`)
    const response = await axios.get(`${API_URL}/familytree/familytree/${id}/`)
    return response.data
  } catch (error) {
    console.error("Error fetching family data:", error)
    return null
  }
}

const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  console.log("Transforming family data:", familyData);

  const tree = {
    name: familyData.selectedPerson,
    photo: familyData.photo,
    gender: familyData.gender,
    id: familyData.id,
    pusta: familyData.pusta,
    children: [],
  };

  if (familyData.father) {
    tree.children.push({
      name: "Father",
      id: `father-group-${familyData.id}`,
      real_id: familyData.id,
      isCollapsible: true,
      collapsed: true,
      children: [],
    });
  }

  if (familyData.children) {
    tree.children.push({
      name: "Children",
      id: `children-group-${familyData.id}`,
      real_id: familyData.id,
      isCollapsible: true,
      collapsed: true,
      children: [

      ],
    });
  }

  return tree;
};


const findNodeById = (tree, id) => {
  if (!tree) return null;

  // Direct match
  if (tree.id === id) return tree;

  // If children exist, search through them
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found; // Return the found node immediately
    }
  }

  return null; // If not found in this branch
};




const FamilyTreeGraph = ({ selectedPerson, id, isMobile }) => {
  const [treeData, setTreeData] = useState(null)
  const [familyData, setFamilyData] = useState(null)
  const treeContainerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 850, height: 550 });
  const [expandfather, setexpandfather] = useState(false);
  const [expandchild, setexpandchild] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;  // Prevent running when id is undefined
      console.log(`Fetching data for new ID: ${id}`);
      const data = await fetchFamilyData(id);
      if (data) {
        setFamilyData(data);
        setTreeData(transformToTreeData(data)); // Update tree
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    console.log("printed")
    const treeContainer = document.getElementById("tree-container");

    html2canvas(treeContainer, { useCORS: true, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      // Open the captured image in a new tab and print
      const newTab = window.open();
      newTab.document.write(`<img src="${imgData}" onload="window.print(); window.close();" />`);
    });
  };
  const handleNodeClick = async (nodeDatum) => {
    console.log("Node clicked:", nodeDatum);

    console.log("COLLAPASABLE", nodeDatum.isCollapsible);

    // If it's a real person (not "Father" or "Children"), expand instead of resetting the tree
    if (!nodeDatum.isCollapsible) {
      console.log(`Fetching additional data for: ${nodeDatum.name}`);
      const newData = await fetchFamilyData(nodeDatum.real_id);
      if (newData) {
        setTreeData((prevTree) => {
          if (!prevTree) return null;

          const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep copy
          const targetNode = findNodeById(newTree, nodeDatum.id);

          if (targetNode) {
            targetNode.children = targetNode.children || [];

            console.log("IDDDD", nodeDatum.id)


            // Expand father if available
            if (nodeDatum.id.startsWith("father-")) {
              if (newData.father && newData.father !== " " && newData.father.id) {
                targetNode.children.push({
                  name: newData.father.name,
                  id: `father-${newData.father.id}`,
                  real_id: newData.father.id,
                  photo: newData.father.photo || null,
                  gender: newData.father.gender || "Male",
                  pusta: newData.father.pusta || "",
                  children: []
                });
              }


            }
            if (nodeDatum.id.startsWith("child-")) {
              // Expand children if available
              if (newData.children && newData.children.length > 0) {
                newData.children.forEach(child => {
                  if (!targetNode.children.some(c => c.id === `child-${child.id}`)) {
                    targetNode.children.push({
                      name: child.name,
                      id: `child-${child.id}`,
                      real_id: child.id,
                      photo: child.photo || null,
                      gender: child.gender || "Male",
                      pusta: child.pusta || "",
                      children: []
                    });
                  }
                });
              }
            }
          }
          return newTree;
        });
      }
      return;
    }

    // If it's a "Father" or "Children" group, toggle expansion
    setTreeData((prevTree) => {
      if (!prevTree) return null;

      const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep copy
      const targetNode = findNodeById(newTree, nodeDatum.id);

      if (targetNode) {
        targetNode.collapsed = !targetNode.collapsed;
        console.log(`Toggled collapsed state: ${targetNode.collapsed}`);

        if (!targetNode.collapsed && nodeDatum.name === "Father") {
          console.log("Expanding father group");
          // setexpandfather(true);
          if (familyData.father && familyData.father.id) {
            // setexpandfather(true);
            targetNode.children = [
              {
                name: familyData.father.name,
                id: `father-${familyData.father.id}`,
                real_id: familyData.father.id,
                photo: familyData.father.photo || null,
                gender: familyData.father.gender || "Male",
                pusta: familyData.father.pusta || "",
                children: [],
              },
            ];
            setexpandfather(true);
          } else {
            console.log("Father does not exist.");
            targetNode.children = [];
          }
        } else if (!targetNode.collapsed && nodeDatum.name === "Children") {
          console.log("Expanding children group");

          if (familyData.children && familyData.children.length > 0) {
            // setexpandchild(true);
            targetNode.children = familyData.children.map((child) => ({
              name: child.name,
              id: `child-${child.id}`,
              real_id: child.id,
              photo: child.photo || null,
              gender: child.gender || "Male",
              pusta: child.pusta || "",
              children: [],
            }));
            setexpandchild(true);
          } else {
            console.log("No children to expand.");
            targetNode.children = [];
          }
        } else {
          console.log("Collapsing, clearing children.");
          targetNode.children = [];
        }
      }

      return newTree;
    });
  };




  const renderNode = (nodeDatum) => {
    const isGroupNode = nodeDatum.name === "Father" || nodeDatum.name === "Children";
    const gender = nodeDatum.gender;
    const wrapText = (text) => {
      if (!text || text === '') {
        return [];
      }

      const nameParts = text.split("/").map((part) => part.trim());

      if (nameParts.length <= 2) {
        return [nameParts.join(" / ")]; // If only two words, put them on one line
      }

      const firstLine = nameParts.slice(0, 2).join(" / "); // First two names
      const secondLine = "/ " + nameParts.slice(2).join(" / "); // Remaining names with a leading "/"

      return [firstLine, secondLine];
    };







    const nameLines = wrapText(nodeDatum.name, 8);
    console.log(gender)
    return (
      <g className="tree" id="tree-container" strokeWidth="0.5" fontFamily="sans-sarif" cursor="pointer" fontWeight={"200"} onClick={() => handleNodeClick(nodeDatum)}>
        {/* Background */}
        {!isGroupNode &&
          <rect x="-80" y="-40" width="175" height="65" rx="30" ry="30" fill={gender === "Male" ? "#d4fff5" : "#ffcee9"} pointerEvents="all" />
        }
        {isGroupNode &&
          <rect x="-80" y="-40" width="165" height="65" rx="30" ry="30" fill={"#e7e7e7"} pointerEvents="all" />
        }
        {/* Only show image for actual persons, not "Father" or "Children" */}
        {!isGroupNode && (
          nodeDatum.photo && nodeDatum.photo !== "null" ? (
            <image
              x="-80.3"
              y="-40"
              width="65"
              height="65"
              href={nodeDatum.photo}
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          ) : (
            <image
              x="-80.3"
              y="-40"
              width="65"
              height="65"
              href={nodeDatum.gender === "Male" ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png" : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"}
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          )
        )}

        {/* Name */}
        {isGroupNode &&
          <text x="-10" y="-10" textAnchor="middle" fontSize="14" fill="black" strokeWidth="0" fontWeight={"bold"}>
            {nodeDatum.name}
          </text>
        }
        {!isGroupNode &&
          <text
            x="30"
            y={-10.5 + (nameLines.length > 0 ? -10 : 0)}
            textAnchor="middle"
            fontSize="14"
            //  fontFamily="cursive"
            dominantBaseline="middle"
            fill="black"
            strokeWidth="0"
            fontWeight="200"
          >
            {nameLines.map((line, i) => (
              <tspan key={i} x="30" dy={i === 0 ? 0 : 20}
                strokeWidth="0">
                {line}
              </tspan>
            ))}
          </text>
        }
        {/* Pusta (Family Lineage) */}
        {!isGroupNode && (
          <text x="20" y="15" textAnchor="middle" fontSize="12" fontWeight="normal">
            {nodeDatum.pusta}
          </text>
        )}

        {/* Expand/Collapse Icon */}
        {nodeDatum.isCollapsible && (
          <g
            transform={`translate(58, -10) rotate(${nodeDatum.collapsed ? 0 : 90})`}
            style={{ transition: "transform 0.3s ease" }}
          >
            <ChevronRight size={20} />
          </g>
        )}
      </g>
    );
  };
  dimensions.width = isMobile ? 850 : 550; // Adjust for mobile and desktop
  dimensions.height = isMobile ? 550 : 850; // Adjust for mobile and desktop
  const translateX = isMobile ? dimensions.width / 6 : dimensions.width / 2; // 
  // Adjust for mobile and desktop
  const translateY = isMobile ? dimensions.height / 1.3 : dimensions.height / 4; // Adjust for mobile and desktop
  const nodeSize = isMobile ? { x: 160, y: 80 } : { x: 200, y: 150 }; // Smaller nodes on mobile
  const scale = 1; // Scale down the tree for mobile to fit

  return (
    <>

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
          // position: "relative",
          transform: isMobile ? "rotate(90deg)" : "none", // Apply rotation only for horizontal layout
          transformOrigin: isMobile ? "down left" : "none", // Set the origin of the rotation when horizontal
          overflow: isMobile ? "auto" : "hidden", // Apply overflow for horizontal layout
          zIndex: "10"
        }}

      >
        <h2>{selectedPerson}'s Family Tree</h2>
        {treeData && (
          <ReactD3Tree
            data={treeData}
            orientation="horizontal"
            nodeSize={{ x: 200, y: 100 }}
            translate={{
              x: translateX,
              y: translateY,

            }}
            renderCustomNodeElement={({ nodeDatum }) => renderNode(nodeDatum)}
            onNodeClick={handleNodeClick} // Keep this to capture clicks
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            pathFunc="step"
          />

        )}
        {/* <button onClick={handlePrint} className="print-button">
          Print Family Tree
        </button> */}
      </div>
    </>
  )
}

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default FamilyTreeGraph