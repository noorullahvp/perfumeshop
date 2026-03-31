import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/ContextPro";
import { CartContext } from "../Context/cartContext";
import { useContext, useEffect, useState } from "react";
import api from "../../service/api";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const { isLoggedIn, triggerNotification, addToWishlist } =
    useContext(AppContext);

  
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/Product/${id}`);
        setProduct(res.data.data);
      } catch {
        triggerNotification("Product not found", "error");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  
  const onAddToCart = async () => {
    if (!isLoggedIn) {
      triggerNotification("Please login first.", "error");
      navigate("/login");
      return;
    }

    await addToCart(product.id, 1); 
    triggerNotification("Added to cart 🛒", "success");
  };

  
  const onAddToWishlists = async () => {
    if (!isLoggedIn) {
      triggerNotification("Please login first.", "error");
      navigate("/login");
      return;
    }

    await addToWishlist(product.id);
  };

  return (
    <div className="container mx-auto p-6">
      <button className="mb-4" onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8 bg-white p-6 shadow rounded">
        <img
          src={product.imageUrls?.[0] || "/placeholder.png"}
          className="w-full rounded shadow"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-4">{product.description}</p>

          <p className="text-3xl text-purple-700 font-bold mb-6">
            ₹{product.price}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onAddToCart}
              className="bg-purple-700 text-white px-6 py-3 rounded"
            >
              Add to Cart
            </button>

            <button
              onClick={onAddToWishlists}
              className="border-2 border-pink-500 text-pink-600 px-6 py-3 rounded"
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
