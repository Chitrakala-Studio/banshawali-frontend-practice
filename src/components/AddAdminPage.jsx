import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { NotebookPen, Trash2 } from "lucide-react";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ClipLoader from "react-spinners/ClipLoader";

const AddAdminPage = () => {
  const navigate = useNavigate();
  const [isAdminLocal, setIsAdminLocal] = useState(false);
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
      const response = await axios.get(`${API_URL}/auth/admins/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setAdmins(response.data.data || []);
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

  const handleAddAdmin = () => {
    Swal.fire({
      title: "Add New Admin",
      html: `
        <input id="name" type="text" placeholder="Enter name" class="swal-textarea" style="height: 40px; margin-bottom: 10px;" />
        <input id="username" type="text" placeholder="Enter username" class="swal-textarea" style="height: 40px; margin-bottom: 10px;" />
        <input id="password" type="password" placeholder="Enter password" class="swal-textarea" style="height: 40px;" />
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2E4568",
      cancelButtonColor: "#E9D4B0",
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
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!name || !username || !password) {
          Swal.showValidationMessage("All fields are required.");
          return false;
        }

        const payload = { name, username, password, role: "admin" };
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          await axios.post(`${API_URL}/auth/register/`, payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          });
          fetchAdmins();
          return true;
        } catch (error) {
          Swal.showValidationMessage(
            `Failed to add admin: ${
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
          text: "Admin has been added successfully.",
          icon: "success",
          confirmButtonColor: "#2E4568",
        });
      }
    });
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    Swal.fire({
      title: "Edit Admin",
      html: `
        <input id="name" type="text" value="${admin.name}" placeholder="Enter name" class="swal-textarea" style="height: 40px; margin-bottom: 10px;" />
        <input id="username" type="text" value="${admin.username}" placeholder="Enter username" class="swal-textarea" style="height: 40px; margin-bottom: 10px;" />
        <input id="password" type="password" placeholder="Enter new password (leave blank to keep current)" class="swal-textarea" style="height: 40px;" />
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2E4568",
      cancelButtonColor: "#E9D4B0",
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
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!name || !username) {
          Swal.showValidationMessage("Name and username are required.");
          return false;
        }

        const payload = { name, username };
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          await axios.delete(`${API_URL}/auth/admins/${admin.id}/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          });
          fetchAdmins();
          Swal.fire("Deleted!", `${admin.name} has been deleted.`, "success");
        } catch (error) {
          console.error("Error deleting admin:", error);
          Swal.fire("Error!", "Failed to delete admin.", "error");
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
            --background-start: #F8E5C0;
            --background-end: #CDE8D0;
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
            width: 100%;
            margin-top: 20px;
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
          }

          .table-wrapper th, .table-wrapper td {
            padding: 12px 16px;
            text-align: center;
            vertical-align: middle;
            font-family: 'Merriweather', serif;
          }

          .table-wrapper tbody tr:nth-child(even) {
            background-color: #F7F7F7;
          }

          .table-wrapper tbody tr:nth-child(odd) {
            background-color: #FFFFFF;
          }

          .table-wrapper tbody tr:hover {
            background-color: #E0E0E0;
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
            color: var(--white);
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
          }

          .loading-row {
            height: 60px;
          }

          .swal-textarea {
            width: 300px;
            background-color: var(--popup-start);
            border: 2px solid var(--secondary-light);
            border-radius: 10px;
            padding: 10px;
            font-family: 'Merriweather', serif;
            font-size: 16px;
            color: var(--primary-dark);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          <button onClick={handleAddAdmin} className="top-bar-btn flex-center">
            <FaUserPlus />
            <span>Add New Admin</span>
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row">
                <td colSpan="3">
                  <div className="flex-center">
                    <ClipLoader color="#B9BAC3" loading={true} size={35} />
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
                  <td>{admin.name}</td>
                  <td>{admin.username}</td>
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
