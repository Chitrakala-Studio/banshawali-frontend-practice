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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const fetchFamilyData = async (id) => {
  try {
    if (!id) return null;
    console.log(`Fetching data for ID: ${id}`);
    const response = await axiosInstance.get(`${API_URL}/people/familytree/${id}/`);
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
      children: [],
    });
  }

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
    const isGroupNode =
      nodeDatum.name === "Father" || nodeDatum.name === "Children";
    const gender = nodeDatum.gender;
    const MAX_LINE_LENGTH = 16;
    const MAX_LINES = 2;
    const wrapText = (text) => {
      if (!text || text.trim() === "") return [];
      let lines = [];
      let remaining = text.trim();

      while (remaining.length > MAX_LINE_LENGTH && lines.length < MAX_LINES) {
        let breakIdx = Math.max(
          remaining.lastIndexOf("/", MAX_LINE_LENGTH),
          remaining.lastIndexOf(" ", MAX_LINE_LENGTH)
        );
        if (breakIdx <= 0) breakIdx = MAX_LINE_LENGTH;
        lines.push(remaining.slice(0, breakIdx).trim());
        remaining = remaining.slice(breakIdx).trim();
      }
      if (remaining) {
        if (lines.length < MAX_LINES) {
          lines.push(
            remaining.length > MAX_LINE_LENGTH
              ? remaining.slice(0, MAX_LINE_LENGTH - 3) + "..."
              : remaining
          );
        } else {
          lines[MAX_LINES - 1] =
            lines[MAX_LINES - 1].slice(0, MAX_LINE_LENGTH - 3) + "...";
        }
      }
      return lines;
    };

    const nameLines = wrapText(nodeDatum.name);
    const nameBlockHeight = nameLines.length * 22;

    return (
      <g
        className="tree-node"
        id="family-tree"
        strokeWidth="0.5"
        fontFamily="'Merriweather', serif"
        cursor="pointer"
        fontWeight="200"
        onClick={() => handleNodeClick(nodeDatum)}
      >
        {/* Background */}
        {!isGroupNode && (
          <rect
            x="-95"
            y="-40"
            width="180"
            height="65"
            rx="15"
            ry="15"
            fill={
              gender === "Male" ? "var(--accent-male)" : "var(--accent-female)"
            }
            stroke="var(--neutral-gray)"
            strokeWidth="1"
            filter="url(#shadow)"
            pointerEvents="all"
          />
        )}
        {isGroupNode && (
          <rect
            x="-55"
            y="-25"
            width="120"
            height="40"
            rx="20"
            ry="20"
            fill="var(--secondary-light)"
            stroke="var(--neutral-gray)"
            strokeWidth="1"
            filter="url(#shadow)"
            pointerEvents="all"
          />
        )}
        {/* Shadow Definition */}
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>
        {/* Image */}
        {!isGroupNode &&
          (nodeDatum.photo && nodeDatum.photo !== "null" ? (
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
              href={
                nodeDatum.gender === "Male"
                  ? "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/maleicon_anaxb1.png"
                  : "https://res.cloudinary.com/da48nhp3z/image/upload/v1740120672/femaleicon_vhrive.jpg"
              }
              preserveAspectRatio="xMidYMid slice"
              pointerEvents="none"
            />
          ))}
        {/* Name */}
        {isGroupNode && (
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fontSize="14"
            fill="var(--primary-dark)"
            strokeWidth="0"
            fontWeight="bold"
            pointerEvents="none"
          >
            {nodeDatum.name}
          </text>
        )}
        {!isGroupNode && (
          <text
            x="25"
            y={-13.5 + (nameLines.length > 0 ? -10 : 0)}
            textAnchor="middle"
            fontSize="16"
            dominantBaseline="middle"
            fill="var(--white)"
            strokeWidth="0"
            fontWeight="500"
            // Only make the name clickable in non-mobile view
            cursor={isMobile ? "default" : "pointer"}
            className="name-text"
            onClick={
              isMobile
                ? undefined // No click handler in mobile view
                : (e) => {
                    e.stopPropagation();
                    handleNameClick(nodeDatum);
                  }
            }
          >
            {nameLines.map((line, i) => (
              <tspan key={i} x="25" dy={i === 0 ? 0 : 22} strokeWidth="0">
                {line}
              </tspan>
            ))}
          </text>
        )}

        {/* Pusta (Family Lineage) */}
        {!isGroupNode && (
          <text
            x="20"
            y="20"
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="var(--white)"
            pointerEvents="none"
          >
            {nodeDatum.pusta}
          </text>
        )}
        {/* Expand/Collapse Icon */}
        {nodeDatum.isCollapsible && (
          <g
            transform={`translate(35, -5) rotate(${
              nodeDatum.collapsed ? 0 : 90
            })`}
            style={{ transition: "transform 0.3s ease" }}
            pointerEvents="none"
          >
            <ChevronRight size="18" color="var(--primary-dark)" />
          </g>
        )}
      </g>
    );
  };

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
            --background-start: #F8E5C0;
            --background-end: #CDE8D0;
            --white: #FFFFFF;
            --popup-start: #A6C8A5;
            --popup-end: #B9BAC3;
          }

                 .tree-container {
    background: #E9D4B0;
    position: relative;
    width: 850px;        
    height: 570px;      
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: auto;    
    border: 2px solid transparent;
  }

  @media (max-width: 800px) {
    .tree-container {
      width: 600px;     /* a smaller fixed size on narrow screens */
      height: 500px;
    }
  }
          .tree-title {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            color: var(--primary-dark);
            margin-bottom: 16px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
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
            margin-top: 10px; /* Changed from margin-bottom to margin-top */
            justify-content: center;
          }

          .action-button {
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: var(--secondary-light);
            background-color: var(--primary-dark);
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .action-button:hover {
            background-color: var(--primary-hover);
            color: var(--white);
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .close-button {
            background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            border: 2px solid var(--secondary-light);
            border-radius: 50%;
            padding: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
            stroke-width: 1px !important;
            fill: none !important;
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
                separation={{ siblings: 0.5, nonSiblings: 0.9 }}
                pathFunc="step"
                pathProps={{
                  fill: "none",
                  stroke: "var(--neutral-gray)",
                  strokeWidth: 0.5,
                }}
                pathClassFunc={() => "custom-link"}
              />
            )}
            <div className="action-buttons">
              <button onClick={handlePDF} className="action-button">
                Save as PDF
              </button>
              <button onClick={handlePrint} className="action-button">
                Print Family Tree
              </button>
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
