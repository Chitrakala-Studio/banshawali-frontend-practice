"use client"

import { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import ReactD3Tree from "react-d3-tree"
import axios from "axios"
import { ChevronRight } from "lucide-react"
import "./App.css"
import html2canvas from "html2canvas";
import jsPDF from "jspdf"
import Swal from "sweetalert2"
import "svg2pdf.js";
import { Canvg } from "canvg";

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const convertImagesToBase64 = async (svgElement) => {
  const images = svgElement.querySelectorAll('image');
  for (const img of images) {
    const href = img.getAttribute('href') || img.getAttribute('xlink:href');
    if (href && href.startsWith('http')) {
      try {
        const response = await fetch(href, { mode: 'cors' });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            img.setAttribute('href', reader.result);
            resolve();
          };
        });
      } catch (error) {
        console.warn(`Failed to load image: ${href}`, error);
      }
    }
  }
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

  const handlePrint = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to print the family tree?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, print it!",
    });

    if (confirmation.isConfirmed) {
      const svgElement = document.querySelector(".rd3t-svg"); // Target the SVG directly
      if (svgElement) {
        await delay(500);
        await convertImagesToBase64(svgElement);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = svgElement.clientWidth * 2;
          canvas.height = svgElement.clientHeight * 2;
          const ctx = canvas.getContext("2d");
          const v = Canvg.fromString(ctx, svgElement.outerHTML);
          await v.render();

          const image = canvas.toDataURL("image/png");
          const newWindow = window.open();
          newWindow.document.write(`<img src='${image}' />`);
          newWindow.print();
          Swal.fire("Printed!", "Your family tree has been sent to the printer.", "success");
        } catch (error) {
          console.log(error)
          Swal.fire("Error", "There was a problem printing the family tree.", "error");
        }
      }
    }
  };

  // Function to handle downloading the graph as a PDF with Swal confirmation using canvg
  const handlePDF = async () => {
    const confirmation = await Swal.fire({
      title: "Download PDF?",
      text: "Do you want to download the family tree as a PDF?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, download it!",
    });

    if (confirmation.isConfirmed) {
      const svgElement = document.querySelector(".rd3t-svg"); // Target the SVG directly
      if (svgElement) {
        await delay(500);
        await convertImagesToBase64(svgElement);
        try {
          const canvas = document.createElement("canvas");
          canvas.width = svgElement.clientWidth * 2;
          canvas.height = svgElement.clientHeight * 2;
          const ctx = canvas.getContext("2d");
          const v = Canvg.fromString(ctx, svgElement.outerHTML);
          await v.render();

          const image = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
          pdf.save("FamilyTree.pdf");
          Swal.fire("Downloaded!", "Your family tree PDF has been saved.", "success");
        } catch (error) {
          Swal.fire("Error", "There was a problem downloading the PDF.", "error");
        }
      }
    }
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
      if (!text || text.trim() === "") {
        return [];
      }

      // Check if text contains "/"
      if (text.includes("/")) {
        const nameParts = text.split("/").map((part) => part.trim());

        if (nameParts.length <= 2) {
          return [nameParts.join(" / ")]; // If only two names, put them in one line
        }

        const firstLine = nameParts.slice(0, 2).join(" / "); // First two names
        const secondLine = "/ " + nameParts.slice(2).join(" / "); // Remaining names with leading "/"

        return [firstLine, secondLine];
      }

      // If no "/", break text based on word count for balance
      const words = text.split(" ");
      const mid = Math.ceil(words.length / 2); // Find middle point

      const firstLine = words.slice(0, mid).join(" "); // First half
      const secondLine = words.slice(mid).join(" "); // Second half

      return secondLine ? [firstLine, secondLine] : [firstLine]; // Avoid empty second line
    };

    const nameLines = wrapText(nodeDatum.name, 8);
    console.log(gender)
    return (
      <g className="tree" id="family-tree" strokeWidth="0.5" fontFamily="sans-sarif" cursor="pointer" fontWeight={"200"} onClick={() => handleNodeClick(nodeDatum)}>
        {/* Background */}
        {!isGroupNode &&
          <rect x="-95" y="-40" width="180" height="65" rx="30" ry="30" fill={gender === "Male" ? "#d4fff5" : "#ffcee9"} pointerEvents="all" />
        }
        {isGroupNode &&
          <rect x="-95" y="-40" width="165" height="65" rx="30" ry="30" fill={"#e7e7e7"} pointerEvents="all" />
        }
        {/* Only show image for actual persons, not "Father" or "Children" */}
        {!isGroupNode && (
          nodeDatum.photo && nodeDatum.photo !== "null" ? (
            <image
              x="-95"
              y="-40"
              width="65"
              height="65"
              href={nodeDatum.photo}
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          ) : (
            <image
              x="-95"
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
            x="25"
            y={-13.5 + (nameLines.length > 0 ? -10 : 0)}
            textAnchor="middle"
            fontSize="14"
            //  fontFamily="cursive"
            dominantBaseline="middle"
            fill="black"
            strokeWidth="0"
            fontWeight="200"
          >
            {nameLines.map((line, i) => (
              <tspan key={i} x="25" dy={i === 0 ? 0 : 20}
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
            transform={`translate(45, -10) rotate(${nodeDatum.collapsed ? 0 : 90})`}
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
        <div style={{ display: "flex",flexDirection:"row", gap: "10px", marginTop: "10px" }}>
          <button onClick={handlePDF} className="save-button bg-teal-700 text-white h-6 border-black/10 px-4 py-3 rounded-md focus:outline-none hover:bg-teal-600 hover:scale-110 hover:border-black/10 hover:shadow-lg transition-all shadow-md flex items-center space-x-2 text-sm">
            Save as PDF
          </button>
          <button onClick={handlePrint} className="print-button bg-teal-700 text-sm text-white border-black/10  h-6 px-4 py-3 rounded-md focus:outline-none hover:bg-teal-600 hover:scale-110 hover:border-black/10 hover:shadow-lg transition-all shadow-md flex items-center space-x-2 ">
            Print Family Tree
          </button>
        </div>
      </div>
    </>
  )
}

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default FamilyTreeGraph