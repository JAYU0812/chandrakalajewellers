import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { supabase } from "../../services/supabase";

export default function Rates() {
  const [rates, setRates] = useState({
    id: null,
    gold_24k: 0,
    gold_22k: 0,
    gold_18k: 0,
    silver: 0,
    silver_925: 0,
    making_charge: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch current rates from Supabase row entry
  const fetchRates = async () => {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("rates")
        .select("*")
        .maybeSingle(); // Prevents crashing if 0 rows exist

      if (error) throw error;

      // If no row exists at all, initialize the first row automatically
      if (!data) {
        const { data: newRow, error: insertError } = await supabase
          .from("rates")
          .insert([{
            gold_24k: 7500,
            gold_22k: 6800,
            gold_18k: 5600,
            silver: 90,
            silver_925: 110,
            making_charge: 12
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        if (newRow) setRates(newRow);
      } else {
        setRates(data);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      alert("Database error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRates((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from("rates")
        .update({
          gold_24k: rates.gold_24k,
          gold_22k: rates.gold_22k,
          gold_18k: rates.gold_18k,
          silver: rates.silver,
          silver_925: rates.silver_925,
          making_charge: rates.making_charge,
          updated_at: new Date().toISOString(),
        })
        .eq("id", rates.id);

      if (error) throw error;
      alert("Market metal rates updated successfully!");
    } catch (error) {
      console.error("Error updating rates:", error);
      alert("Failed to update rates: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-gray-500 py-12 text-center font-medium">
          Loading live market data deck...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8">Update Daily Market Rates</h1>
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl border border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 24K Rate (per gram)</label>
            <input
              type="number"
              name="gold_24k"
              value={rates.gold_24k}
              onChange={handleChange}
              placeholder="Gold 24K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 22K Rate (per gram)</label>
            <input
              type="number"
              name="gold_22k"
              value={rates.gold_22k}
              onChange={handleChange}
              placeholder="Gold 22K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 18K Rate (per gram)</label>
            <input
              type="number"
              name="gold_18k"
              value={rates.gold_18k}
              onChange={handleChange}
              placeholder="Gold 18K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Standard Silver Rate (per gram)</label>
            <input
              type="number"
              name="silver"
              value={rates.silver}
              onChange={handleChange}
              placeholder="Silver Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Silver 925 Rate (per gram)</label>
            <input
              type="number"
              name="silver_925"
              value={rates.silver_925}
              onChange={handleChange}
              placeholder="Silver 925 Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Making Charges (%)</label>
            <input
              type="number"
              name="making_charge"
              value={rates.making_charge}
              onChange={handleChange}
              placeholder="Making Charges Percentage"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={updating}
          className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-xl transition shadow-md disabled:bg-gray-400"
        >
          {updating ? "Saving Rates..." : "Save Rates"}
        </button>
      </div>
    </AdminLayout>
  );
}