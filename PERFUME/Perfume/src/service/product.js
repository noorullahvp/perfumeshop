import axios from "axios";
import { URL } from "./api";

export async function GetAllProducts(start = 0, end = 100) {
  try {
    const response = await axios.get(`${URL}/product`);
    let data = response.data.data;
    if (!Array.isArray(data)) data = data.products || [];
    return data.slice(start, end);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function GetProductById(id) {
  try {
    const response = await axios.get(`${URL}/products/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function FilterProducts({
  name = "",
  categoryId = "",
  brand = "",
  page = 1,
  pageSize = 20,
  descending = false,
}) {
  try {
    const response = await axios.get(`${URL}/products/filter`, {
      params: {
        name,
        categoryId,
        brand,
        page,
        pageSize,
        descending,
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
}

export const CreateProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${URL}/products`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};


export const ToggleProductStatus = async (productId) => {
  try {
    const token = localStorage.getItem("token"); 
    const response = await axios.patch(
      `${URL}/Products/status/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Failed to toggle product status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product status"
    );
  }
};


export const UpdateProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${URL}/Products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(error.response?.data?.message || "Failed to update product");
  }
};