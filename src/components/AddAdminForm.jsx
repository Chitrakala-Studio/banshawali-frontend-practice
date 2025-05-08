import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AddAdminForm = ({ onClose, onAdminAdded, API_URL }) => {
  useEffect(() => {
    Swal.fire({
      title: "Add New Admin",
      background: "#ffffff",
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
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <label for="firstname" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px;">First Name</label>
            <input id="firstname" type="text" placeholder="Enter first name" style="width: 100%;" class="swal-textarea" />
          </div>
          <div style="flex: 1;">
            <label for="lastname" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px;">Last Name</label>
            <input id="lastname" type="text" placeholder="Enter last name" style="width: 100%;" class="swal-textarea" />
          </div>
        </div>
        <label for="username" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Username</label>
        <input id="username" type="text" placeholder="Enter username" style="width: 100%;" class="swal-textarea" />
        <label for="email" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Email</label>
        <input id="email" type="email" placeholder="Enter email" style="width: 100%;" class="swal-textarea" />
        <label for="phone" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Phone Number</label>
        <input id="phone" type="text" placeholder="Enter phone number" style="width: 100%;" class="swal-textarea" />
        <label for="password" style="color: black; font-size: 14px; text-align: left; display: block; margin-bottom: 5px; margin-top: 10px;">Password</label>
        <input id="password" type="password" placeholder="Enter password" style="width: 100%;" class="swal-textarea" />
      `,
      backdrop: `rgba(10,10,10,0.8)`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
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
        const first_name = document.getElementById("firstname").value;
        const last_name = document.getElementById("lastname").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        if (!first_name || !last_name || !username || !email || !phone || !password) {
          Swal.showValidationMessage("All fields are required.");
          return false;
        }

        const payload = { first_name, last_name, username, email, phone, password, role: "admin" };
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          await axios.post(`${API_URL}/auth/auth/register/`, payload, {
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
