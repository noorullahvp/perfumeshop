import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../Users/Context/ContextPro";
import { useLocation } from "react-router-dom";
import api from "../service/api";

const AdminProducts = () => {
  const { products, setProducts, triggerNotification } = useContext(AppContext);
  const location = useLocation();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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


  useEffect(() => {
    if (location.state?.openAddProduct) {
      setShowAddProductModal(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/Product/admin");
        console.log("API Response:", response.data); 

        const backendProducts = response.data.data || [];
        console.log("Backend Products:", backendProducts); 

        
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

        console.log("Mapped Products:", mappedProducts); 
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
    const productBrand = product.brand || "";
    const productDescription = product.description || "";
    const productCategory = product.category || "";

    const matchesSearch =
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || productCategory === selectedCategory;

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

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.stock ||
      newProduct.images[0] === ""
    ) {
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
      setNewProduct({
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
    } catch (error) {
      console.error("Error adding product:", error);
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
      featured: false,
      bestseller: false,
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

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

      setProducts((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? mapped : p))
      );

      triggerNotification("Product updated successfully!", "success");
      setShowEditProductModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      triggerNotification("Failed to update product.", "error");
    }
  };

  
  const handleSoftDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to deactivate this product?"))
      return;

    try {
      await api.patch(`/Product/status/${productId}`);

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: false } : p))
      );

      triggerNotification("Product deactivated successfully.", "success");
    } catch (error) {
      console.error("Error deactivating product:", error);
      triggerNotification("Failed to deactivate product.", "error");
    }
  };

  
  const handleActivateProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to activate this product?"))
      return;

    try {
      await api.patch(`/Product/status/${productId}`, { isActive: true });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: true } : p))
      );

      triggerNotification("Product activated successfully.", "success");
    } catch (error) {
      console.error("Error activating product:", error);
      triggerNotification("Failed to activate product.", "error");
    }
  };

  
  const ProductFormModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-3xl">
          <h2 className="text-3xl font-bold">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form
          onSubmit={isEdit ? handleUpdateProduct : handleAddProduct}
          className="p-8 space-y-6"
        >
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleNewProductChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleNewProductChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g. Perfumes"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={newProduct.brand}
                onChange={handleNewProductChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g. Chanel"
              />
            </div>
          </div>

          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Product Images *
            </label>
            {newProduct.images.map((img, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {newProduct.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-purple-600 font-semibold hover:text-purple-800 transition"
            >
              + Add Another Image
            </button>
          </div>

          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={newProduct.isActive}
              onChange={handleNewProductChange}
              className="w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
            />
            <label className="text-gray-700 font-semibold">
              Active (visible to customers)
            </label>
          </div>

          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
            >
              {isEdit ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={() => {
                isEdit
                  ? setShowEditProductModal(false)
                  : setShowAddProductModal(false);
                setSelectedProduct(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <main className="max-w-7xl mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
          Product Management
        </h1>

        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Search products..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[200px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
            >
              + Add Product
            </button>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50 transition">
                    <td className="px-6 py-4">
                      <img
                        src={
                          p.images && p.images.length > 0
                            ? p.images[0]
                            : "https://via.placeholder.com/64?text=No+Image"
                        }
                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                        alt={p.name}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-purple-700 font-bold">
                      ₹{p.price?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          p.stock < 10
                            ? "text-red-600 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(p)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
                        >
                          Edit
                        </button>

                        {p.isActive ? (
                          <button
                            onClick={() => handleSoftDeleteProduct(p.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivateProduct(p.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-gray-500 text-xl">No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      
      {showAddProductModal && <ProductFormModal />}
      {showEditProductModal && <ProductFormModal isEdit={true} />}
    </div>
  );
};

export default AdminProducts;
