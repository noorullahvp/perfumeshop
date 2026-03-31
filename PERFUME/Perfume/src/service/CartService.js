import axios from 'axios';
import { URL } from './api.js';

export const CartService = {
 
  getCart: async (token) => {
    const response = await axios.get(`${URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data.data?.items || [];
  },


  addToCart: async (token, productId, size, quantity) => {
    await axios.post(`${URL}/cart`, {
      productId: parseInt(productId),
      size,
      quantity: parseInt(quantity),
    }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    
    return await CartService.getCart(token);
  },

 
  removeFromCart: async (token, cartItemId) => {
    await axios.delete(`${URL}/cart/${cartItemId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

   
    return await CartService.getCart(token);
  },


  updateCartQuantity: async (token, cartItemId, quantity) => {
    await axios.put(`${URL}/cart/${cartItemId}`, {
      quantity: parseInt(quantity),
    }, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

   
    return await CartService.getCart(token);
  },


  clearCart: async (token) => {
    await axios.delete(`${URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });


    return await CartService.getCart(token);
  },
};