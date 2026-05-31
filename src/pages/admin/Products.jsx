import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../services/supabase";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle deleting a single product record
  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      // 1. If product has an image hosted in Supabase Storage, remove it first
      if (imageUrl) {
        const urlParts = imageUrl.split("/storage/v1/object/public/product-images/");
        if (urlParts.length === 2) {
          const fileName = urlParts[1];
          await supabase.storage.from("product-images").remove([fileName]);
        }
      }

      // 2. Delete item record from database
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      alert("Product deleted successfully!");
      // Refresh local view state
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Could not delete product: " + error.message);
    }
  };

  // Filter products based on active search input
  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Products</h1>
          <p className="text-gray-500 mt-2">Manage all jewellery products</p>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl transition font-medium"
        >
          + Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Products Table Wrapper */}
      <div className="bg-white rounded-3xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-600">Image</th>
              <th className="p-4 text-left font-semibold text-gray-600">Product Name</th>
              <th className="p-4 text-left font-semibold text-gray-600">Category</th>
              <th className="p-4 text-left font-semibold text-gray-600">Metal</th>
              <th className="p-4 text-left font-semibold text-gray-600">Weight</th>
              <th className="p-4 text-left font-semibold text-gray-600">Featured</th>
              <th className="p-4 text-center font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-gray-500">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-gray-500">
                  {searchTerm ? "No matching products found." : "No products found."}
                  <br />
                  {!searchTerm && (
                    <Link
                      to="/admin/products/add"
                      className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition"
                    >
                      Add Your First Product
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition">
                  {/* Thumbnail Image */}
                  <td className="p-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-xl border flex items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="p-4 font-medium text-gray-800">{product.name}</td>

                  {/* Category */}
                  <td className="p-4 text-gray-600">{product.category || "—"}</td>

                  {/* Metal Type */}
                  <td className="p-4 uppercase text-xs font-semibold tracking-wider text-gray-700">
                    {product.metal_type?.replace("_", " ") || "—"}
                  </td>

                  {/* Weight */}
                  <td className="p-4 text-gray-600">{product.weight ? `${product.weight}g` : "—"}</td>

                  {/* Featured Badge */}
                  <td className="p-4">
                    {product.is_favourite ? (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(product.id, product.image_url)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}