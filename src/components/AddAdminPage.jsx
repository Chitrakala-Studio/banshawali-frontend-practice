import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { NotebookPen, Trash2 } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ClipLoader from "react-spinners/ClipLoader";
import AddAdminForm from "./AddAdminForm";

const AddAdminPage = () => {
  const navigate = useNavigate();
  const [isAdminLocal, setIsAdminLocal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      if (user && user.token && user.role === "admin") {
        setIsAdminLocal(true);
        fetchAdmins();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`${API_URL}/auth/auth/user-list/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setAdmins(response.data || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to fetch admins.",
        icon: "error",
        confirmButtonColor: "#2E4568",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    Swal.fire({
      title: `<span style="display:block; text-align:center; width:100%;">Edit Admin</span>`,
      html: `
        <button id="custom-close-btn"
          style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #888;
            line-height: 1;
            z-index: 10;
          ">&times;</button>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
          <div style="flex: 1;">
            <label for="firstname" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px;">First Name</label>
            <input id="firstname" type="text" value="${admin.first_name || ''}" placeholder="Enter first name" style="width: 100%;" class="swal-textarea" />
          </div>
          <div style="flex: 1;">
            <label for="lastname" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px;">Last Name</label>
            <input id="lastname" type="text" value="${admin.last_name || ''}" placeholder="Enter last name" style="width: 100%;" class="swal-textarea" />
          </div>
        </div>
        <label for="username" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Username</label>
        <input id="username" type="text" value="${admin.username || ''}" placeholder="Enter username" style="width: 100%;" class="swal-textarea" />
        <label for="email" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Email</label>
        <input id="email" type="email" value="${admin.email || ''}" placeholder="Enter email" style="width: 100%;" class="swal-textarea" />
        <label for="phone" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Phone Number</label>
        <input id="phone" type="text" value="${admin.phone || ''}" placeholder="Enter phone number" style="width: 100%;" class="swal-textarea" />
        <label for="password" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">New Password</label>
        <input id="password" type="password" placeholder="Enter new password (leave blank to keep current)" style="width: 100%;" class="swal-textarea" />
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2E4568",
      cancelButtonColor: "#E9D4B0",
      didOpen: () => {
        const closeBtn = document.getElementById("custom-close-btn");
        if (closeBtn) {
          closeBtn.onclick = () => Swal.close();
        }
        const titleElement = document.querySelector(".swal2-title");
        const popupElement = document.querySelector(".swal2-popup");
        const confirmButton = document.querySelector(".swal2-confirm");
        const cancelButton = document.querySelector(".swal2-cancel");
  
        if (titleElement) titleElement.classList.add("swal-title");
        if (popupElement) popupElement.classList.add("swal-popup");
        if (confirmButton) {
          confirmButton.classList.add("swal-confirm-btn");
          confirmButton.addEventListener("mouseover", () => {
            confirmButton.style.backgroundColor = "#4A6A9D";
            confirmButton.style.transform = "scale(1.05)";
          });
          confirmButton.addEventListener("mouseout", () => {
            confirmButton.style.backgroundColor = "#2E4568";
            confirmButton.style.transform = "scale(1)";
          });
        }
        if (cancelButton) {
          cancelButton.classList.add("swal-cancel-btn");
          cancelButton.addEventListener("mouseover", () => {
            cancelButton.style.backgroundColor = "#D9C4A0";
            cancelButton.style.transform = "scale(1.05)";
          });
          cancelButton.addEventListener("mouseout", () => {
            cancelButton.style.backgroundColor = "#E9D4B0";
            cancelButton.style.transform = "scale(1)";
          });
        }
      },
      preConfirm: async () => {
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;
  
        if (!firstname || !lastname || !username || !email || !phone) {
          Swal.showValidationMessage("All fields except password are required.");
          return false;
        }
  
        const payload = { first_name: firstname, last_name: lastname, username, email, phone };
        if (password) payload.password = password;
  
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          await axios.put(`${API_URL}/auth/admins/${admin.id}/`, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          });
          fetchAdmins();
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Failed to update admin: ${
              error.response?.data?.message || error.message
            }`
          );
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Success!",
          text: "Admin has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#2E4568",
        });
        setSelectedAdmin(null);
      }
    });
  };

  const handleDeleteAdmin = (admin) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${admin.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E9D4B0",
      cancelButtonColor: "#AAABAC",
      confirmButtonText: "Yes, delete it!",
      didOpen: () => {
        const titleElement = document.querySelector(".swal2-title");
        const popupElement = document.querySelector(".swal2-popup");
        const confirmButton = document.querySelector(".swal2-confirm");
        const cancelButton = document.querySelector(".swal2-cancel");

        if (titleElement) titleElement.classList.add("swal-title");
        if (popupElement) popupElement.classList.add("swal-popup");
        if (confirmButton) {
          confirmButton.classList.add("swal-confirm-btn");
          confirmButton.addEventListener("mouseover", () => {
            confirmButton.style.backgroundColor = "#D9C4A0";
            confirmButton.style.transform = "scale(1.05)";
          });
          confirmButton.addEventListener("mouseout", () => {
            confirmButton.style.backgroundColor = "#E9D4B0";
            confirmButton.style.transform = "scale(1)";
          });
        }
        if (cancelButton) {
          cancelButton.classList.add("swal-cancel-btn");
          cancelButton.addEventListener("mouseover", () => {
            cancelButton.style.backgroundColor = "#B9BAC3";
            cancelButton.style.transform = "scale(1.05)";
          });
          cancelButton.addEventListener("mouseout", () => {
            cancelButton.style.backgroundColor = "#AAABAC";
            cancelButton.style.transform = "scale(1)";
          });
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          await axios.delete(`${API_URL}/auth/auth/user-list/${admin.id}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          });
          fetchAdmins();
          Swal.fire({
            title: "Deleted!",
            text: `${admin.username} has been deleted.`,
            icon: "success",
            confirmButtonColor: "#2E4568",
          });
        } catch (error) {
          console.error("Error deleting admin:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete admin.",
            icon: "error",
            confirmButtonColor: "#2E4568",
          });
        }
      }
    });
  };

  return (
    <div className="table-view transition-all duration-300 relative">
      <style>
        {`
               
          :root {
            --primary-dark: #2E4568;
            --primary-hover: #4A6A9D;
            --secondary-light: #E9D4B0;
            --secondary-lighter: #D9C4A0;
            --neutral-gray: #B9BAC3;
            --neutral-light-gray: #E0E0E0;
            --background-start: #F8E5C0;
            --background-end: #CDE8D0;
            --row-bg: #F7F7F7;
            --row-alt-bg: #FFFFFF;
            --white: #FFFFFF;
            --popup-start: #A6C8A5;
            --popup-end: #B9BAC3;
          }

          .table-view {
            background: radial-gradient(circle at top, var(--background-start) 30%, var(--background-end) 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .table-wrapper {
          margin-left: 25px;
            width: 100%;
            margin-top: 20px;
          
            border-radius: 15px;
           
          }

          .table-wrapper table {
            width: 100%;
            border-collapse: collapse;
            background: var(--white);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
          }

          .table-wrapper thead {
            background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            color: var(--primary-dark);
            text-align: center;
            font-family: 'Playfair Display', serif;
            font-size: 20px;
            font-weight: 600;
          }

          .table-wrapper th, .table-wrapper td {
            padding: 12px 16px;
            text-align: center;
            vertical-align: middle;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-dark);
          }

          .table-wrapper tbody tr:nth-child(even) {
            background-color: var(--row-bg);
          }

          .table-wrapper tbody tr:nth-child(odd) {
            background-color: var(--row-alt-bg);
          }

          .table-wrapper tbody tr:hover {
            background-color: var(--neutral-light-gray);
            transition: background-color 0.3s ease;
          }

          .top-bar-btn {
            padding: 8px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            color: var(--secondary-light);
            background-color: var(--primary-dark);
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .top-bar-btn:hover {
            background-color: var(--primary-hover);
            color: var (--white);
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }

          .flex-center {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .no-data {
            text-align: center;
            padding: 16px;
            color: var(--neutral-gray);
            font-family: 'Merriweather', serif;
            font-size: 16px;
          }

          .loading-row {
            height: 60px;
          }

          .action-btn {
            color: var(--primary-dark);
            transition: all 0.3s ease;
          }

          .action-btn:hover {
            color: var(--primary-hover);
            transform: scale(1.1);
          }

          .swal-textarea {
            height: 40px;
            width: 300px;
            // background-color: var(--popup-start);
            border: 2px solid var(--secondary-light);
            border-radius: 10px;
            padding: 10px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-dark);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
            
          }

          .swal-textarea:focus {
            outline: none;
            border-color: var(--secondary-lighter);
            box-shadow: 0 0 0 3px rgba(233, 212, 176, 0.2);
          }

          .swal-title {
            font-size: 24px;
            color: var(--primary-dark);
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid var(--secondary-light);
            padding-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
          }

          .swal-popup {
            // background: linear-gradient(to bottom, var(--popup-start), var(--popup-end));
            border-radius: 15px;
            padding: 25px;
            border: 2px solid var(--secondary-light);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .swal-confirm-btn, .swal-cancel-btn {
            border-radius: 8px;
            padding: 10px 20px;
            font-family: 'Playfair Display', serif;
            font-size: 16px;
            transition: background-color 0.2s, transform 0.2s;
          }

          .swal-confirm-btn {
            background-color: var(--primary-dark);
            color: var(--secondary-light);
          }

          .swal-cancel-btn {
            background-color: var(--secondary-light);
            color: var(--primary-dark);
          }

          .react-tooltip {
            background-color: var(--primary-dark) !important;
            color: var(--white) !important;
            border: 1px solid var(--secondary-light) !important;
            border-radius: 6px !important;
            padding: 6px 10px !important;
            font-family: 'Merriweather', serif !important;
            font-size: 12px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }

          .react-tooltip-arrow {
            border-color: var(--secondary-light) !important;
          }
          
          table td:first-child {
            display: block;
          }
        `}
      </style>

      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={() => navigate("/")}
          className="top-bar-btn flex-center"
        >
          <FaArrowLeft />
          <span>Back to Table</span>
        </button>
        {isAdminLocal && (
          <button
            onClick={() => setShowAddForm(true)}
            className="top-bar-btn flex-center"
          >
            <FaUserPlus />
            <span>Add New Admin</span>
          </button>
        )}
      </div>

      {showAddForm && (
        <AddAdminForm
          onClose={() => setShowAddForm(false)}
          onAdminAdded={() => {
            setShowAddForm(false);
            fetchAdmins();
          }}
          API_URL={API_URL}
        />
      )}

      <div className="table-wrapper ">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row">
                <td colSpan="3">
                  <div className="flex-center">
                    <ClipLoader
                      color="var(--neutral-gray)"
                      loading={true}
                      size={35}
                    />
                  </div>
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No admins found.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.first_name || "-"}</td>
                  <td>{admin.last_name || "-"}</td>
                  <td>{admin.username || "-"}</td>
                  <td className="flex-center space-x-2">
                    <button
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Edit"
                      className="action-btn"
                      onClick={() => handleEditAdmin(admin)}
                    >
                      <NotebookPen size={18} />
                    </button>
                    <button
                      data-tooltip-id="tooltip"
                      data-tooltip-content="Delete"
                      className="action-btn"
                      onClick={() => handleDeleteAdmin(admin)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ReactTooltip id="tooltip" place="top" effect="solid" />
    </div>
  );
};

export default AddAdminPage;
