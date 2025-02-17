import Swal from "sweetalert2";

function handleBackendError(
  error,
  fallbackTitle,
  fallbackMessage,
  showUI = true
) {
  // Always log the raw error to the console
  console.error(`${fallbackTitle}:`, error);

  // Log the backend response data, if any
  if (error.response) {
    console.error(
      "Backend response data:",
      JSON.stringify(error.response.data, null, 2)
    );
  }

  // Default error message
  let errorMessage = fallbackMessage;

  // If the server sent a specific error payload, extract it
  if (error.response?.data) {
    const data = error.response.data;
    // If it's an object, look for a 'message' or show the entire object
    if (typeof data === "object") {
      errorMessage = data.message || JSON.stringify(data, null, 2);
    } else {
      // If it's a string, use it directly
      errorMessage = data;
    }
  }

  // Only show UI error if flag is true
  if (showUI) {
    Swal.fire({
      icon: "error",
      title: fallbackTitle,
      text: errorMessage,
    });
  }
}

export default handleBackendError;
