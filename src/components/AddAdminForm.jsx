import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AddAdminForm = ({ onClose, onAdminAdded, API_URL }) => {
  useEffect(() => {
    Swal.fire({
      title: "Add New Admin",
      background: "#ffffff",
      html: `
  <label for="name" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px;">Name</label>
  <input id="name" type="text" placeholder="Enter name" style="width:420px" class="swal-textarea" />
  <label for="username" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Username</label>
  <input id="username" type="text" placeholder="Enter username" style="width:420px" class="swal-textarea" />
  <label for="password" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Password</label>
  <input id="password" type="password" placeholder="Enter password" style="width:420px" class="swal-textarea" />
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

        if (titleElement) {
          titleElement.classList.add("swal-title");
          titleElement.style.color = "#f49d37";
        }
        if (popupElement) {
          popupElement.classList.add("swal-popup");
          popupElement.style.backgroundColor = "white";
          popupElement.style.border = "2px solid #f49d37";
        }
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

        const textAreas = document.querySelectorAll(".swal-textarea");
        textAreas.forEach((area) => {
          area.style.backgroundColor = "white";
        });
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
        onAdminAdded();
      }
      onClose();
    });
  }, [onClose, onAdminAdded, API_URL]);

  return null;
};

export default AddAdminForm;
