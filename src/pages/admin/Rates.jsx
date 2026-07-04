import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        
        // 1. Double check that our supabase client initialization profile exists
        if (!supabase) {
          console.error("Supabase client profile config missing initialization link.");
          setLoading(false);
          return;
        }

        let { data, error } = await supabase
          .from("rates")
          .select("*")
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // 2. Safe-seed placeholder values to prevent downstream component reading crashes
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
            .maybeSingle();

          if (insertError) throw insertError;
          if (newRow) setRates(newRow);
        } else {
          setRates(data);
        }
      } catch (error) {
        console.error("Caught target crash context inside rates loader loop:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRates((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = async () => {
    if (!rates.id) {
      alert("Cannot update. No structural database row ID linked yet.");
      return;
    }
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
      console.error("Error setting pricing updates:", error);
      alert("Failed to save data transitions: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center font-medium text-gray-500">
        Loading live market data deck...
      </div>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Update Daily Market Rates</h1>
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl border border-gray-100">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 24K Rate (per gram)</label>
            <input
              type="number"
              name="gold_24k"
              value={rates.gold_24k || 0}
              onChange={handleChange}
              placeholder="Gold 24K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 22K Rate (per gram)</label>
            <input
              type="number"
              name="gold_22k"
              value={rates.gold_22k || 0}
              onChange={handleChange}
              placeholder="Gold 22K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Gold 18K Rate (per gram)</label>
            <input
              type="number"
              name="gold_18k"
              value={rates.gold_18k || 0}
              onChange={handleChange}
              placeholder="Gold 18K Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Standard Silver Rate (per gram)</label>
            <input
              type="number"
              name="silver"
              value={rates.silver || 0}
              onChange={handleChange}
              placeholder="Silver Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Silver 925 Rate (per gram)</label>
            <input
              type="number"
              name="silver_925"
              value={rates.silver_925 || 0}
              onChange={handleChange}
              placeholder="Silver 925 Price"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Making Charges (%)</label>
            <input
              type="number"
              name="making_charge"
              value={rates.making_charge || 0}
              onChange={handleChange}
              placeholder="Making Charges Percentage"
              className="border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-yellow-500 outline-none"
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