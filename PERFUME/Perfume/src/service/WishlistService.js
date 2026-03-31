import axios from "axios";
import { URL } from "./api.js"; 

const WISHLIST_URL = `${URL}/wishlist`;

export const WishlistService = {
  async getWishlist(userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${WISHLIST_URL}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; 
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  async toggleWishlist(productId) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${WISHLIST_URL}/${productId}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; 
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  },
};