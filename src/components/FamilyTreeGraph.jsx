"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ReactD3Tree from "react-d3-tree";
import axiosInstance from "./axiosInstance";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import "svg2pdf.js";
import { Canvg } from "canvg";
import { ChevronRight, X as XIcon } from "lucide-react";
import male1 from "./male1.png";
import female1 from "./female1.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fetchFamilyData = async (id) => {
  try {
    if (!id) return null;
    console.log(`Fetching data for ID: ${id}`);
    const response = await axiosInstance.get(`${API_URL}/familytree/${id}/tree/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching family data:", error);
    return null;
  }
};

const transformToTreeData = (familyData) => {
  if (!familyData) return null;

  console.log("Transforming family data:", familyData);

  const tree = {
    name: familyData.name,
    photo: familyData.photo,
    gender: familyData.gender,
    id: familyData.id,
    real_id: familyData.id, // Ensure real_id is present for root
    pusta: familyData.pusta,
    isCollapsible: false, // Not collapsible for main node
    children: [],
  };

  // Always add Father and Children group nodes, even if empty, to ensure the structure is present
  tree.children.push({
    name: "Father",
    id: `father-group-${familyData.id}`,
    real_id: familyData.id,
    isCollapsible: true,
    collapsed: true,
    children: [],
  });
  tree.children.push({
    name: "Children",
    id: `children-group-${familyData.id}`,
    real_id: familyData.id,
    isCollapsible: true,
    collapsed: true,
    children: [],
  });

  return tree;
};

const findNodeById = (tree, id) => {
  if (!tree) return null;

  if (tree.id === id) return tree;

  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const convertImagesToBase64 = async (svgElement) => {
  const images = svgElement.querySelectorAll("image");
  for (const img of images) {
    const href = img.getAttribute("href") || img.getAttribute("xlink:href");
    if (href && href.startsWith("http")) {
      try {
        const response = await fetch(href, { mode: "cors" });
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        await new Promise((resolve) => {
          reader.onloadend = () => {
            img.setAttribute("href", reader.result);
            resolve();
          };
        });
      } catch (error) {
        console.warn(`Failed to load image: ${href}`, error);
      }
    }
  }
};

const FamilyTreeGraph = ({ selectedPerson, id, isMobile, closePopup }) => {
  const [treeData, setTreeData] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const treeContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 850, height: 600 });
  const [expandfather, setexpandfather] = useState(false);
  const [expandchild, setexpandchild] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setDimensions({
      width: isMobile ? 850 : 600,
      height: isMobile ? 600 : 1000,
    });
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      console.log(`Fetching data for new ID: ${id}`);
      const data = await fetchFamilyData(id);
      if (data) {
        setFamilyData(data);
        setTreeData(transformToTreeData(data));
      }
      setIsLoading(false);
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
      const svgElement = document.querySelector(".rd3t-svg");
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
          Swal.fire(
            "Printed!",
            "Your family tree has been sent to the printer.",
            "success"
          );
        } catch (error) {
          console.log(error);
          Swal.fire(
            "Error",
            "There was a problem printing the family tree.",
            "error"
          );
        }
      }
    }
  };

  const handlePDF = async () => {
    const confirmation = await Swal.fire({
      title: "Download PDF?",
      text: "Do you want to download the family tree as a PDF?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, download it!",
    });

    if (confirmation.isConfirmed) {
      const svgElement = document.querySelector(".rd3t-svg");
      if (svgElement) {
        await delay(500);

        function inlineStyles(svg) {
          const allElements = svg.querySelectorAll("*");
          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);
            let styleString = "";
            for (let i = 0; i < computedStyle.length; i++) {
              const key = computedStyle[i];
              styleString += `${key}:${computedStyle.getPropertyValue(key)};`;
            }
            el.setAttribute("style", styleString);
          });
        }

        inlineStyles(svgElement);

        svgElement.querySelectorAll("path, line").forEach((el) => {
          el.setAttribute("stroke", "#B9BAC3");
          el.setAttribute("stroke-width", "2");
        });

        await convertImagesToBase64(svgElement);

        try {
          const scale = 2;
          const canvas = document.createElement("canvas");
          canvas.width = svgElement.clientWidth * scale;
          canvas.height = svgElement.clientHeight * scale;

          const ctx = canvas.getContext("2d");
          ctx.scale(scale, scale);

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

          Swal.fire(
            "Downloaded!",
            "Your family tree PDF has been saved.",
            "success"
          );
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "There was a problem downloading the PDF.",
            "error"
          );
        }
      }
    }
  };

  const handleNameClick = (nodeDatum) => {
    // Prevent navigation in mobile view
    if (isMobile) {
      return; // Do nothing if in mobile view
    }

    if (!nodeDatum.isCollapsible && nodeDatum.real_id) {
      if (typeof closePopup === "function") {
        closePopup();
      }
      navigate(`/card/${nodeDatum.real_id}`);
    }
  };

  const handleNodeClick = async (nodeDatum) => {
    console.log("Node clicked:", nodeDatum);

    if (!nodeDatum.isCollapsible) {
      console.log(`Fetching additional data for: ${nodeDatum.name}`);
      const newData = await fetchFamilyData(nodeDatum.real_id);
      if (newData) {
        setTreeData((prevTree) => {
          if (!prevTree) return null;

          const newTree = JSON.parse(JSON.stringify(prevTree));
          const targetNode = findNodeById(newTree, nodeDatum.id);

          if (targetNode) {
            targetNode.children = targetNode.children || [];

            if (nodeDatum.id.startsWith("father-")) {
              if (
                newData.father &&
                newData.father !== " " &&
                newData.father.id
              ) {
                if (
                  !targetNode.children.some(
                    (c) => c.id === `father-${newData.father.id}`
                  )
                ) {
                  targetNode.children.push({
                    name: newData.father.name,
                    id: `father-${newData.father.id}`,
                    real_id: newData.father.id,
                    photo: newData.father.photo || null,
                    gender: newData.father.gender || "Male",
                    pusta: newData.father.pusta || "",
                    children: [],
                  });
                }
              }
            }

            if (nodeDatum.id.startsWith("child-")) {
              if (newData.children && newData.children.length > 0) {
                newData.children.forEach((child) => {
                  if (
                    !targetNode.children.some(
                      (c) => c.id === `child-${child.id}`
                    )
                  ) {
                    targetNode.children.push({
                      name: child.name,
                      id: `child-${child.id}`,
                      real_id: child.id,
                      photo: child.photo || null,
                      gender: child.gender || "Male",
                      pusta: child.pusta || "",
                      children: [],
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

    setTreeData((prevTree) => {
      if (!prevTree) return null;

      const newTree = JSON.parse(JSON.stringify(prevTree));
      const targetNode = findNodeById(newTree, nodeDatum.id);

      if (targetNode) {
        targetNode.collapsed = !targetNode.collapsed;
        console.log(`Toggled collapsed state: ${targetNode.collapsed}`);

        if (!targetNode.collapsed && nodeDatum.name === "Father") {
          console.log("Expanding father group");
          if (familyData.father && familyData.father.id) {
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
    const isHovered = hoveredNodeId === nodeDatum.id;
    let name = nodeDatum.name || "";
    const pusta = nodeDatum.pusta || "";
    const photo = nodeDatum.photo && nodeDatum.photo !== "null" ? nodeDatum.photo : (gender === "Male" ? male1 : female1);

    // Node dimensions and style (match ProfileCard proportions)
    const NODE_WIDTH = 160;
    const NODE_HEIGHT = 160;
    const HEADER_HEIGHT = 54;
    const BLUE = "#2196F3";
    const HEADER_BG = "#f5f5f5";
    const BORDER = isHovered ? "#1976D2" : "#B9BAC3";
    const SHADOW = isHovered ? "0 4px 16px #1976D244" : "0 2px 8px #B9BAC344";

    // Show pusta number in header as Name (pustaNum)
    let headerText = name;
    if (pusta) {
      headerText = `${name}  (${pusta})`;
    }

    // For name wrapping
    const MAX_LINE_LENGTH = 18;
    const wrapText = (text) => {
      if (!text) return [""];
      let lines = [];
      let remaining = text.trim();
      while (remaining.length > MAX_LINE_LENGTH && lines.length < 2) {
        let breakIdx = Math.max(
          remaining.lastIndexOf("/", MAX_LINE_LENGTH),
          remaining.lastIndexOf(" ", MAX_LINE_LENGTH)
        );
        if (breakIdx <= 0) breakIdx = MAX_LINE_LENGTH;
        lines.push(remaining.slice(0, breakIdx).trim());
        remaining = remaining.slice(breakIdx).trim();
      }
      if (remaining.length) lines.push(remaining);
      return lines;
    };
    const nameLines = wrapText(headerText);

    if (isGroupNode) {
      // Group node style: pill with orange border, white fill, bold text
      return (
        <g
          className="tree-node group-node"
          onClick={() => handleNodeClick(nodeDatum)}
          style={{ cursor: "pointer" }}
        >
          <rect
            x={-60}
            y={-20}
            width={120}
            height={36}
            rx={18}
            ry={18}
            fill="#fff"
            stroke="#F49D37"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 2px 8px #F49D3722)" }}
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="15"
            fill="#2E4568"
            style={{ fontFamily: 'Merriweather, serif', letterSpacing: 1 }}
            pointerEvents="none"
          >
            {nodeDatum.name}
          </text>
          {nodeDatum.isCollapsible && (
            <g
              transform={`translate(50, 0) rotate(${nodeDatum.collapsed ? 0 : 90})`}
              style={{ transition: "transform 0.3s ease" }}
              pointerEvents="none"
            >
              <ChevronRight size="18" color="#2E4568" />
            </g>
          )}
        </g>
      );
    }

    // Main person node
    return (
      <g
        className="tree-node person-node"
        onMouseEnter={() => setHoveredNodeId(nodeDatum.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        onClick={() => handleNodeClick(nodeDatum)}
        style={{ filter: SHADOW, cursor: "pointer" }}
      >
        {/* Outer rounded rectangle with border */}
        <rect
          x={-NODE_WIDTH / 2}
          y={-NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx={20}
          ry={20}
          fill="#fff"
          stroke={BORDER}
          strokeWidth={isHovered ? 3 : 2}
        />
        {/* Name text in header */}
        <text
          x={0}
          y={-NODE_HEIGHT / 2 + 38}
          textAnchor="middle"
          fontSize="20"
          pointerEvents="none"
          fill="#2E4568"
        >
          {headerText}
        </text>
        {/* Thick blue divider */}
        <rect
          x={-NODE_WIDTH / 2 + 24}
          y={-NODE_HEIGHT / 2 + 60}
          width={NODE_WIDTH - 48}
          height={2}
          rx={3.5}
          fill="#2196F3"
        />
        
        {/* Profile image or icon centered */}
        <image
          x={-36}
          y={-NODE_HEIGHT / 2 + 82}
          width={72}
          height={72}
          href={photo}
          style={{}}
          pointerEvents="none"
        />
        {/* Chevron for collapsible nodes */}
        {nodeDatum.isCollapsible && (
          <g
            transform={`translate(${NODE_WIDTH / 2 - 18}, 0) rotate(${nodeDatum.collapsed ? 0 : 90})`}
            style={{ transition: "transform 0.3s ease" }}
            pointerEvents="none"
          >
            <ChevronRight size="18" color="#2E4568" />
          </g>
        )}
      </g>
    );
  };

  // Center the tree automatically as it grows horizontally and as nodes expand
  useEffect(() => {
    if (!treeContainerRef.current) return;
    const container = treeContainerRef.current;
    setTimeout(() => {
      const svg = container.querySelector('.rd3t-svg');
      if (svg) {
        const nodes = svg.querySelectorAll('.rd3t-node');
        if (nodes.length > 0) {
          // Find the root node (first node)
          const rootNode = nodes[0];
          const rootRect = rootNode.getBoundingClientRect();
          const svgRect = svg.getBoundingClientRect();
          // Calculate the center position of the root node relative to the SVG
          const rootCenterX = rootRect.left + rootRect.width / 2 - svgRect.left;
          const rootCenterY = rootRect.top + rootRect.height / 2 - svgRect.top;

          // Center the container on the root node
          let targetScrollLeft = rootCenterX - container.clientWidth / 2;
          let targetScrollTop = rootCenterY - container.clientHeight / 2;

          // --- Enhanced auto-drag logic: ---
          // If the root node is too close to the left or right edge, auto-drag to keep it visible and centered
          const margin = 60; // px, how close to edge before auto-drag
          const rootLeftInContainer = rootRect.left - container.getBoundingClientRect().left;
          const rootRightInContainer = rootRect.right - container.getBoundingClientRect().left;

          // If root node is going out left
          if (rootLeftInContainer < margin) {
            targetScrollLeft = Math.max(0, container.scrollLeft - (margin - rootLeftInContainer));
          }
          // If root node is going out right
          if (rootRightInContainer > container.clientWidth - margin) {
            targetScrollLeft = Math.min(
              svg.clientWidth - container.clientWidth,
              container.scrollLeft + (rootRightInContainer - (container.clientWidth - margin))
            );
          }

          // Clamp scroll values
          targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, svg.clientWidth - container.clientWidth));
          targetScrollTop = Math.max(0, Math.min(targetScrollTop, svg.clientHeight - container.clientHeight));

          container.scrollLeft = targetScrollLeft;
          container.scrollTop = targetScrollTop;
        } else {
          // Fallback: center the SVG
          container.scrollLeft = (svg.clientWidth - container.clientWidth) / 2;
          container.scrollTop = (svg.clientHeight - container.clientHeight) / 2;
        }
      }
    }, 400);
  }, [treeData, dimensions]);

  return (
    <div
      style={{
        color: "var(--primary-dark)",
        position: "relative",
      }}
    >
      <style>
        {`
          :root {
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --secondary-light: #E9D4B0;
            --secondary-lighter: #D9C4A0;
            --accent-male: #4A6A9D;
            --accent-female: #D4A5A5;
            --accent-other: #B9BAC3;
            --neutral-gray: #B9BAC3;
            --neutral-light-gray: #E0E0E0;
            --background-start: #fdf6e3;
            --background-end: #e0f7fa;
            --white: #FFFFFF;
            --popup-start: #A6C8A5;
            --popup-end: #B9BAC3;
            --gold-accent: #F49D37;
          }
          .tree-container {
            background: linear-gradient(120deg, #fbe7c6 0%, #a1c4fd 100%);
            border: 3px solid var(--gold-accent);
            box-shadow: 0 8px 32px rgba(44, 62, 80, 0.12);
            border-radius: 24px;
            padding: 24px 0 0 0;
            margin: 0 auto;
            overflow: auto;
            position: relative;
            width: 850px;        
            height: 570px; 
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .tree-title {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: var(--primary-dark);
            margin-bottom: 18px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.08);
            letter-spacing: 1px;
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid var(--neutral-gray);
            border-top: 4px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-text {
            margin-top: 16px;
            font-family: 'Merriweather', serif;
            font-size: 18px;
            color: var(--primary-dark);
          }

          .action-buttons {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-top: 10px;
            justify-content: center;
          }

          .action-button {
            padding: 10px 22px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            color: var(--white);
            background: linear-gradient(90deg, var(--primary-dark), var(--primary-hover));
            font-family: 'Playfair Display', serif;
            font-size: 1rem;
            border: none;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;
          }

          .action-button:hover {
            background: linear-gradient(90deg, var(--primary-hover), var(--primary-dark));
            transform: scale(1.05);
          }

          .close-button {
            background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            border: 2px solid var(--secondary-light);
            border-radius: 50%;
            padding: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            line-height: 0;
            position: absolute;
            top: 12px;
            right: 12px;
            z-index: 1000;
            transition: transform 0.3s ease;
          }

          .close-button:hover {
            transform: scale(1.1);
          }

          .custom-link {
            stroke: var(--neutral-gray) !important;
            stroke-width: 4px !important;
            fill: none !important;
          }

          @media (max-width: 800px) {
            .tree-container {
              width: 100vw;
              min-width: 0;
              max-width: 100vw;
              height: 500px;
              border-radius: 0;
              padding: 0;
            }
            .tree-title {
              font-size: 1.2rem;
              margin-bottom: 10px;
            }
          }
        `}
      </style>

      {typeof closePopup === "function" && (
        <button
          aria-label="Close family tree"
          onClick={closePopup}
          onTouchStart={closePopup}
          className="close-button"
        >
          <XIcon size={18} color="var(--primary-dark)" />
        </button>
      )}

      <div className="tree-container" ref={treeContainerRef}>
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading Family Tree...</p>
          </div>
        ) : (
          <>
            <h2 className="tree-title">{selectedPerson} Family Tree</h2>
            {treeData && (
              <ReactD3Tree
                data={treeData}
                orientation="horizontal"
                nodeSize={{ x: 200, y: 200 }}
                translate={{
                  x: isMobile ? dimensions.width / 6 : dimensions.width / 2,
                  y: isMobile ? dimensions.height / 1.3 : dimensions.height / 3,
                }}
                renderCustomNodeElement={({ nodeDatum }) =>
                  renderNode(nodeDatum)
                }
                onNodeClick={handleNodeClick}
                separation={{ siblings: 0.9, nonSiblings: 1.3 }}
                pathFunc="step"
                pathProps={{
                  fill: "none",
                  stroke: "var(--neutral-gray)",
                  strokeWidth: 1.2,
                }}
                pathClassFunc={() => "custom-link"}
              />
            )}
            <div className="action-buttons mb-2">
              <button onClick={handlePDF} className="action-button">
                Save as PDF
              </button>
              {/* <button onClick={handlePrint} className="action-button">
                Print Family Tree
              </button> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

FamilyTreeGraph.propTypes = {
  selectedPerson: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  closePopup: PropTypes.func,
};

export default FamilyTreeGraph;
