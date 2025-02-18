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

  if (familyData.father ) {
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
  if (tree.id === id) return tree;
  console.log("TRee ", tree.children);
  if (!tree.children) return null;




  for (const child of tree.children) {
    console.log("Child",child );
    console.log("ID:",id);
    const found = findNodeById(child, id);
    console.log("Found",found);
    if (found) return found;
  }
  return null;
};



const FamilyTreeGraph = ({ selectedPerson, id }) => {
  const [treeData, setTreeData] = useState(null)
  const [familyData, setFamilyData] = useState(null)
  const treeContainerRef = useRef(null)

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
  
    // If a real person (not "Father" or "Children") is clicked, update the selected person
    if (!nodeDatum.isCollapsible) {
      console.log(`Updating selected person to: ${nodeDatum.name}`);
      const newData = await fetchFamilyData(nodeDatum.real_id);
      if (newData) {
        console.log("Family Data: ", familyData);
        setFamilyData(newData);
        console.log("new Data: ", newData);
        setTreeData(transformToTreeData(newData)); // Reset tree with new person
      }
      return; // Prevent further processing
    }
  
    // If it's a group node, toggle expansion and load data dynamically
    setTreeData((prevTree) => {
      if (!prevTree) return null;
  
      const newTree = JSON.parse(JSON.stringify(prevTree)); // Deep copy
      const targetNode = findNodeById(newTree, nodeDatum.id);
  
      if (targetNode) {
        targetNode.collapsed = !targetNode.collapsed;
        console.log(`Toggled collapsed state: ${targetNode.collapsed}`);
  
        // If expanding the "Father" group, check if the father exists and show only the father
        if (!targetNode.collapsed && nodeDatum.name === "Father") {
          console.log("Expanding father group");
  
          // Only expand if the father exists (i.e. father is not an empty string or null)
          if (familyData.father && familyData.father.id) {
            targetNode.children = [
              {
                name: familyData.father.name,
                id: `father-${familyData.father.id}`,
                real_id: familyData.father.id,
                photo: familyData.father.photo || null,
                gender: familyData.father.gender || "Male",
                pusta: familyData.father.pusta || "",
                // father: familyData.father.father||"",
                children: [], // Keep this empty as we don't want to show the children here
              },
            ];
          } else {
            console.log("Father does not exist, not expanding.");
            targetNode.children = []; // Don't expand, no father exists
          }
        } 
        // If expanding the "Children" group, show only the children and not the father
        else if (!targetNode.collapsed && nodeDatum.name === "Children") {
          console.log("Expanding children group");
  
          // Show the children if there are any
          if (familyData.children && familyData.children.length > 0) {
            targetNode.children = familyData.children.map((child) => ({
              name: child.name,
              id: `child-${child.id}`,
              real_id: child.id,
              photo: child.photo || null,
              gender: child.gender || "Male",
              pusta: child.pusta || "",
              children: [], // Keep this empty as we don't want to show the father
            }));
          } else {
            console.log("No children to expand.");
            targetNode.children = []; // Don't expand, no children available
          }
        }
        // If collapsing, clear the children (whether it's father or children group)
        else {
          console.log("Collapsing, clearing children.");
          targetNode.children = [];
        }
      }
  
      return newTree;
    });
  };
  
  
  
  
  
  
  const renderNode = (nodeDatum) => {
    const isGroupNode = nodeDatum.name === "Father" || nodeDatum.name === "Children";
  
    return (
      <g className="tree" strokeWidth="0.5" cursor="pointer" onClick={() => handleNodeClick(nodeDatum)}>
        {/* Background */}
        <rect x="-80" y="-40" width="165" height="65" rx="30" ry="30" fill="#f2f3f4" pointerEvents="all" />
  
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
              x="-50.3"
              y="-50"
              width="65"
              height="65"
              href={nodeDatum.gender === "male" ? "src/assets/public/maleicon.png" : "src/assets/public/iconfemale.png"}
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          )
        )}
  
        {/* Name */}
        <text x="20" y="-10" textAnchor="middle" fontSize="14" fontFamily="Arial" fill="black" fontWeight="bold">
          {nodeDatum.name}
        </text>
  
        {/* Pusta (Family Lineage) */}
        {!isGroupNode && (
          <text x="50" y="15" textAnchor="middle" fontSize="12" fontWeight="normal">
            {nodeDatum.pusta}
          </text>
        )}
  
        {/* Expand/Collapse Icon */}
        {nodeDatum.isCollapsible && (
          <g
            transform={`translate(40, -10) rotate(${nodeDatum.collapsed ? 0 : 90})`}
            style={{ transition: "transform 0.3s ease" }}
          >
            <ChevronRight size={20} />
          </g>
        )}
      </g>
    );
  };
  

  return (
    <div ref={treeContainerRef} style={{ width: "100%", height: "60vh" }}>
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

