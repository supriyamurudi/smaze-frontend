import api from "../api/api";

// Save Offer
export const saveOffer = async (offerId) => {
  const response = await api.post("/saved-offers", {
    offerId,
  });

  return response.data;
};

// Get Saved Offers
export const getSavedOffers = async () => {
  const response = await api.get("/saved-offers");
  return response.data;
};

// Remove Saved Offer
export const removeSavedOffer = async (id) => {
  const response = await api.delete(`/saved-offers/${id}`);

  return response.data;
};
