// frontend/src/services/contactService.js
import api from "../api/api";

export const sendContactMessage = (formData) => {
  return api
    .post("/contact", formData)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};
