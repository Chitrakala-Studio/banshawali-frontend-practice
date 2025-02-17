import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import axios from "axios";
import "./App.css";

const fetchFamilyData = async (id) => {
  try {
    if (!id) return null;
    console.log(`Fetching data for ID: ${id}`);
    const response = await axios.get(`https://gautamfamily.org.np/familytree/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching family data:", error);
    return null;
  }
};

const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  const tree = {
    name: familyData.selectedPerson,
    photo: familyData.photo,
    gender: familyData.gender,
    id: familyData.id,
    children: [],
  };

  if (familyData.father && familyData.father.id) {
    tree.children.push({
      name: familyData.father.name,
      id: `father-${familyData.father.id}`,
      photo: familyData.father.photo,
      gender: familyData.father.gender,
      children: [],
    });
  }

  if (familyData.children && familyData.children.length) {
    tree.children = tree.children.concat(
      familyData.children.map(child => ({
        name: child.name,
        id: `child-${child.id}`,
        photo: child.photo,
        gender: child.gender,
        children: [],
      }))
    );
  }

  return tree;
};

const findNodeById = (tree, id) => {
  if (tree.id === id) return tree;
  if (!tree.children) return null;
  for (const child of tree.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

const FamilyTreeGraph = ({ selectedPerson, id }) => {
  const [treeData, setTreeData] = useState(null);
  const treeContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFamilyData(id);
      setTreeData(transformToTreeData(data));
    };
    fetchData();
  }, [id]);

  const handleNodeClick = async (nodeDatum) => {
    if (!nodeDatum.id.startsWith("child") && !nodeDatum.id.startsWith("father")) return;

    const nodeId = nodeDatum.id.replace(/^(father|child)-/, "");
    const data = await fetchFamilyData(nodeId);
    if (!data) return;

    const newChildren = (data.children || []).map(child => ({
      name: child.name,
      id: `child-${child.id}`,
      photo: child.photo,
      gender: child.gender,
      children: [],
    }));

    setTreeData((prevTree) => {
      const newTree = JSON.parse(JSON.stringify(prevTree));
      const targetNode = findNodeById(newTree, nodeDatum.id);
      if (targetNode) {
        targetNode.children = newChildren;
      }
      return newTree;
    });
  };

  const renderNode = (nodeDatum) => {
    const circleRadius = 50;
    const imageSize = circleRadius * 1.35;
    const photo = nodeDatum.photo;
    const gender = nodeDatum.gender;
    const shouldDisplayIcon = !photo || photo === "null";

    return (
      <g className="tree" stroke={"#07213b"} strokeWidth={1} fontSize={14} fontWeight={100}>
        <rect x="-50" y="-50" width="168" height="68" rx="30" ry="30" fill={gender === "Male" ? "#d2e8ff" : "#ffdff1"} />
        {shouldDisplayIcon ? (
          gender === "Male" ? (
            <image x="-50.3" y="-50" width={imageSize} height={imageSize} href="src/assets/public/maleicon.png" />
          ) : (
            <image x="-50.3" y="-50" width={imageSize} height={imageSize} href="src/assets/public/iconfemale.png" />
          )
        ) : (
          <image x="-50" y="-50" width={imageSize} height={imageSize} href={nodeDatum.photo} />
        )}
        <text x="60" y="-20" textAnchor="middle" fill="black" fontFamily="sans-serif" dominantBaseline="middle">
          {nodeDatum.name}
        </text>
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
          onNodeClick={handleNodeClick}
        />
      )}
    </div>
  );
};

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default FamilyTreeGraph;
