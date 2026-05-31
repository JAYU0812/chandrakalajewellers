import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../services/supabase";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    categoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data: allProducts, error: pError } = await supabase
          .from("products")
          .select("is_favourite, category");

        if (pError) throw pError;

        if (allProducts) {
          const total = allProducts.length;
          const featured = allProducts.filter(p => p.is_favourite).length;
          
          // Get unique categories list from items parsed
          const uniqueCats = [...new Set(allProducts.map(p => p.category).filter(Boolean))];

          setMetrics({
            totalProducts: total,
            featuredProducts: featured,
            categoriesCount: uniqueCats.length,
          });
        }
      } catch (error) {
        console.error("Error generating dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
      <p className="text-gray-500 mb-8">Live status updates for Chandrakala Jewellers Storefront.</p>
      
      {loading ? (
        <div className="text-gray-500 text-center py-12">Compiling platform statistics...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Total Products</h3>
            <p className="text-5xl font-bold text-gray-800 mt-3">{metrics.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Featured Showcase</h3>
            <p className="text-5xl font-bold text-yellow-600 mt-3">{metrics.featuredProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow border border-gray-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Active Categories</h3>
            <p className="text-5xl font-bold text-gray-800 mt-3">{metrics.categoriesCount}</p>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}