"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ReactD3Tree from "react-d3-tree"
import axios from "axios"
import { ChevronRight } from "lucide-react"
import "./App.css"

const fetchFamilyData = async (id) => {
  try {
    if (!id) return null
    console.log(`Fetching data for ID: ${id}`)
    const response = await axios.get(`https://gautamfamily.org.np/familytree/${id}/`)
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




const FamilyTreeGraph = ({ selectedPerson, id }) => {
  const [treeData, setTreeData] = useState(null)
  const [familyData, setFamilyData] = useState(null)
  const treeContainerRef = useRef(null)
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
              if (newData.father && newData.length > 0 && !targetNode.children.some(child => child.id === `father-${newData.father.id}`)) {
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
    const circleRadius = 50;
    const gender = nodeDatum.gender;
    const imageSize = circleRadius * 1.25;
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
    const nameLines = wrapText(nodeDatum.name, 10)
    return (
      <g className="tree" strokeWidth="0.5" cursor="pointer" onClick={() => handleNodeClick(nodeDatum)}>
        {/* Background */}
        <rect x="-80" y="-40" width="165" height="63" rx="30" ry="30" fill="#f2f3f4" pointerEvents="all" />

        {/* Only show image for actual persons, not "Father" or "Children" */}
        {!isGroupNode && (
          nodeDatum.photo === "https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg" ? (
            gender === "male" ? (
              <image x="-80.3" y="-40" rx="0" ry="0" width={imageSize} height={imageSize} href="src/assets/public/maleicon.png" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <image x="-80.3" y="-40" rx="0" ry="0" width={imageSize} height={imageSize} href={"src/assets/public/iconfemale.png"} preserveAspectRatio="xMidYMid slice" />
            )

          ) : (
            <image
              x="-80.5"
              y="-39.5"
              width={imageSize}
              height={imageSize}
              href={nodeDatum.photo}
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          )
        )}

        {/* Name */}
        {isGroupNode &&
         <text x="0" y="-5" fill="black" textAnchor="middle" fontSize="16" fontWeight="300">
         {nodeDatum.name}
       </text>
        
        }
        {!isGroupNode &&
        <text
        x="20"
        y={-15.5 + (nameLines.length > 1 ? -10 : 0)}
        textAnchor="middle"
        fontSize="14"
        fontFamily="cursive"
        dominantBaseline="middle"
        fill="black"
        fontWeight= "200"
      >
        {nameLines.map((line, i) => (
          <tspan key={i} x="20" dy={i === 0 ? 0 : 20}
            fontWeight="200">
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
            transform={`translate(50, -10) rotate(${nodeDatum.collapsed ? 0 : 90})`}
            style={{ transition: "transform 0.3s ease" }}
          >
            <ChevronRight size={20} />
          </g>
        )}
      </g>
    );
  };


  return (
    <div ref={treeContainerRef} style={{ width: "100%", height: "100%" }}>
      <h2>{selectedPerson}'s Family Tree</h2>
      {treeData && (
        <ReactD3Tree
          data={treeData}
          orientation="horizontal"
          nodeSize={{ x: 200, y: 100 }}
          translate={{ x: 300, y: 200 }}
          renderCustomNodeElement={({ nodeDatum }) => renderNode(nodeDatum)}
          onNodeClick={handleNodeClick} // Keep this to capture clicks
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          pathFunc="step"
        />

      )}
    </div>
  )
}

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default FamilyTreeGraph

