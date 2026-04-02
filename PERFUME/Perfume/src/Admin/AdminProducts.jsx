import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Users/Context/ContextPro";
import { useLocation } from "react-router-dom";
import api from "../service/api";
import axios from "axios"; // Cloudinary അപ്‌ലോഡിനായി axios ആവശ്യമാണ്

const AdminProducts = () => {
  const { products, setProducts, triggerNotification } = useContext(AppContext);
  const location = useLocation();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // അപ്‌ലോഡ് സ്റ്റാറ്റസ് അറിയാൻ

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    images: [""],
    featured: false,
    bestseller: false,
    isActive: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- CLOUDINARY UPLOAD FUNCTION ---
  const handleCloudinaryUpload = async (file, index) => {
    const cloudName = "duw4dyxoo"; // നിങ്ങളുടെ Cloud Name ഇവിടെ നൽകുക
    const uploadPreset = "ml_default"; // നിങ്ങളുടെ Unsigned Preset ഇവിടെ നൽകുക

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setIsUploading(true);
      triggerNotification("Uploading image...", "info");
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${duw4dyxoo}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      handleImageChange(index, imageUrl); // ലഭിച്ച ലിങ്ക് ഇൻപുട്ടിലേക്ക് മാറ്റുന്നു
      triggerNotification("Image uploaded successfully!", "success");
    } catch (error) {
      console.error("Upload Error:", error);
      triggerNotification("Image upload failed.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (location.state?.openAddProduct) {
      setShowAddProductModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/Product/admin");
        const backendProducts = response.data.data || [];
        
        const mappedProducts = backendProducts.map((p) => ({
          id: p.id,
          name: p.name || "",
          description: p.description || "",
          price: p.price || 0,
          brand: p.brand || "",
          category: p.categoryName || "", 
          stock: p.currentStock || 0, 
          images: p.imageUrls || [""], 
          isActive: p.isActive !== undefined ? p.isActive : true,
        }));

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        triggerNotification("Failed to fetch products.", "error");
      }
    };
    fetchProducts();
  }, [setProducts]);

  const allCategories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const productName = product.name || "";
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...newProduct.images];
    updated[index] = value;
    setNewProduct((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setNewProduct((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const updated = newProduct.images.filter((_, i) => i !== index);
    setNewProduct((prev) => ({ ...prev, images: updated }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || newProduct.images[0] === "") {
      triggerNotification("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await api.post("/Product", {
        name: newProduct.name,
        description: newProduct.description,
        brand: newProduct.brand,
        categoryName: newProduct.category,
        currentStock: parseInt(newProduct.stock),
        price: parseFloat(newProduct.price),
        imageUrls: newProduct.images.filter((img) => img.trim() !== ""),
        isActive: newProduct.isActive,
      });

      const createdBackend = response.data.data;
      const mapped = {
        id: createdBackend.id,
        name: createdBackend.name,
        description: createdBackend.description,
        price: createdBackend.price,
        brand: createdBackend.brand,
        category: createdBackend.categoryName,
        stock: createdBackend.currentStock,
        images: createdBackend.imageUrls,
        isActive: createdBackend.isActive,
      };

      setProducts((prev) => [...prev, mapped]);
      triggerNotification("Product added successfully!", "success");
      setShowAddProductModal(false);
      setNewProduct({ name: "", description: "", price: "", category: "", brand: "", stock: "", images: [""], isActive: true });
    } catch (error) {
      triggerNotification("Failed to add product.", "error");
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      images: [...product.images],
      isActive: product.isActive,
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/Product/${selectedProduct.id}`, {
        name: newProduct.name,
        description: newProduct.description,
        brand: newProduct.brand,
        categoryName: newProduct.category,
        currentStock: parseInt(newProduct.stock),
        price: parseFloat(newProduct.price),
        imageUrls: newProduct.images.filter((img) => img.trim() !== ""),
        isActive: newProduct.isActive,
      });

      const updatedBackend = response.data.data;
      const mapped = {
        id: updatedBackend.id,
        name: updatedBackend.name,
        description: updatedBackend.description,
        price: updatedBackend.price,
        brand: updatedBackend.brand,
        category: updatedBackend.categoryName,
        stock: updatedBackend.currentStock,
        images: updatedBackend.imageUrls,
        isActive: updatedBackend.isActive,
      };

      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? mapped : p)));
      triggerNotification("Product updated successfully!", "success");
      setShowEditProductModal(false);
    } catch (error) {
      triggerNotification("Failed to update product.", "error");
    }
  };

  // --- MODAL COMPONENT ---
  const ProductFormModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <h2 className="text-3xl font-bold">{isEdit ? "Edit Product" : "Add New Product"}</h2>
        </div>

        <form onSubmit={isEdit ? handleUpdateProduct : handleAddProduct} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Product Name *</label>
                <input type="text" name="name" value={newProduct.name} onChange={handleNewProductChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
             </div>
             <div className="col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea name="description" value={newProduct.description} onChange={handleNewProductChange} className="w-full p-3 border border-gray-300 rounded-xl" rows="3" />
             </div>
             <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (₹) *</label>
                <input type="number" name="price" value={newProduct.price} onChange={handleNewProductChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
             </div>
             <div>
                <label className="block text-gray-700 font-semibold mb-2">Stock *</label>
                <input type="number" name="stock" value={newProduct.stock} onChange={handleNewProductChange} className="w-full p-3 border border-gray-300 rounded-xl" required />
             </div>
          </div>

          {/* IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Product Images *</label>
            {newProduct.images.map((img, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border border-gray-100 rounded-2xl bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-xl bg-white"
                    placeholder="Image URL will appear here"
                    readOnly
                  />
                  {newProduct.images.length > 1 && (
                    <button type="button" onClick={() => removeImageField(index)} className="bg-red-500 text-white px-4 rounded-xl">✕</button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCloudinaryUpload(e.target.files[0], index)}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            ))}
            <button type="button" onClick={addImageField} className="text-purple-600 font-semibold hover:underline">+ Add Another Image</button>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={isUploading} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50">
              {isUploading ? "Uploading..." : isEdit ? "Update Product" : "Add Product"}
            </button>
            <button type="button" onClick={() => { setShowAddProductModal(false); setShowEditProductModal(false); }} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-gray-800">Product Management</h1>
          <button onClick={() => setShowAddProductModal(true)} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">+ Add Product</button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
            <input type="text" placeholder="Search products..." className="flex-1 p-3 rounded-xl border-none shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="p-3 rounded-xl border-none shadow-sm" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-6">Product</th>
                <th className="p-6">Price</th>
                <th className="p-6">Stock</th>
                <th className="p-6">Status</th>
                <th className="p-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-6 flex items-center gap-4">
                    <img src={p.images[0] || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="p-6">₹{p.price}</td>
                  <td className="p-6">{p.stock}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-6">
                    <button onClick={() => handleEditClick(p)} className="text-purple-600 font-bold mr-4">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddProductModal && <ProductFormModal />}
      {showEditProductModal && <ProductFormModal isEdit={true} />}
    </div>
  );
};

export default AdminProducts;