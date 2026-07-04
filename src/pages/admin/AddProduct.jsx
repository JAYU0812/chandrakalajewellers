import { useState } from "react"; 
import AdminLayout from "../../layouts/AdminLayout"; 
import { supabase } from "../../services/supabase"; 

export default function AddProduct() {   
  const [name, setName] = useState("");   
  const [category, setCategory] = useState("");   
  const [metalType, setMetalType] = useState("");   
  const [weight, setWeight] = useState("");   
  const [description, setDescription] = useState("");   
  const [featured, setFeatured] = useState(false);   
  const [image, setImage] = useState(null);   
  const [preview, setPreview] = useState(null);   
  const [loading, setLoading] = useState(false);   

  const resetForm = () => {     
    setName("");     
    setCategory("");     
    setMetalType("");     
    setWeight("");     
    setDescription("");     
    setFeatured(false);     
    setImage(null);     
    setPreview(null);   
  };   

  const handleSubmit = async () => {     
    try {       
      if (!name) {         
        alert("Please enter product name");         
        return;       
      }       
      if (!image) {         
        alert("Please select an image");         
        return;       
      }       
      setLoading(true);       
      
      const fileName = Date.now() + "-" + image.name.replace(/\s+/g, "-");       
      const { error: uploadError } = await supabase.storage         
        .from("product-images")         
        .upload(fileName, image); 

      if (uploadError) {   
        console.log(uploadError);   
        alert(JSON.stringify(uploadError));   
        throw uploadError;       
      }

      const { data: imageData } = supabase.storage         
        .from("product-images")         
        .getPublicUrl(fileName);       
      
      const imageUrl = imageData.publicUrl;       
      
      const { error } = await supabase         
        .from("products")         
        .insert([           
          {             
            name,             
            category,             
            metal_type: metalType,             
            weight,             
            description,             
            image_url: imageUrl,             
            is_favourite: featured,           
          },         
        ]);       

      if (error) throw error;       
      alert("Product Added Successfully!");       
      resetForm();     
    } catch (error) {       
      console.error(error);       
      alert(error.message);     
    } finally {       
      setLoading(false);     
    }   
  };   

  return (     
    <AdminLayout>       
      <div className="max-w-5xl mx-auto">         
        <h1 className="text-4xl font-bold mb-8">           
          Add New Product         
        </h1>         
        <div className="bg-white rounded-3xl shadow-lg p-8">           
          <div className="grid md:grid-cols-2 gap-6">             
            {/* Product Name */}             
            <div>               
              <label className="block mb-2 font-medium">                 
                Product Name               
              </label>               
              <input                 
                type="text"                 
                value={name}                 
                onChange={(e) => setName(e.target.value)}                 
                placeholder="Gold Necklace"                 
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"               
              />             
            </div>             
            
            {/* Category */}             
            <div>               
              <label className="block mb-2 font-medium">                 
                Category               
              </label>               
              <input                 
                type="text"                 
                value={category}                 
                onChange={(e) => setCategory(e.target.value)}                 
                placeholder="Necklace"                 
                className="w-full border border-gray-300 rounded-xl p-3"               
              />             
            </div>             
            
            {/* Metal Type */}             
            <div>               
              <label className="block mb-2 font-medium">                 
                Metal Type               
              </label>               
              <select   
                value={metalType}   
                onChange={(e) => setMetalType(e.target.value)}   
                className="w-full border border-gray-300 rounded-xl p-3"
              >   
                <option value="">Select Metal</option>   
                <option value="gold">Gold</option>   
                <option value="silver">Silver</option>   
                <option value="silver_925">Silver 925</option> 
              </select>             
            </div>             
            
            {/* Weight */}             
            <div>               
              <label className="block mb-2 font-medium">                 
                Weight (grams)               
              </label>               
              <input                 
                type="number"                 
                value={weight}                 
                onChange={(e) => setWeight(e.target.value)}                 
                placeholder="10"                 
                className="w-full border border-gray-300 rounded-xl p-3"               
              />             
            </div>           
          </div>           
          
          {/* Description */}           
          <div className="mt-6">             
            <label className="block mb-2 font-medium">               
              Description             
            </label>             
            <textarea               
              rows="5"               
              value={description}               
              onChange={(e) => setDescription(e.target.value)}               
              placeholder="Enter product description..."               
              className="w-full border border-gray-300 rounded-xl p-3"             
            />           </div>           
          
          {/* Image Upload */}           
          <div className="mt-6">             
            <label className="block mb-2 font-medium">               
              Product Image             
            </label>             
            <input               
              type="file"               
              accept="image/*"               
              onChange={(e) => {                 
                const file = e.target.files[0];                 
                if (file) {                   
                  setImage(file);                   
                  setPreview(URL.createObjectURL(file));                 
                }               
              }}               
              className="w-full border border-dashed border-yellow-500 rounded-xl p-4"             
            />             
            {preview && (               
              <div className="mt-6">                 
                <img                   
                  src={preview}                   
                  alt="Preview"                   
                  className="w-64 h-64 object-cover rounded-2xl shadow-lg border"                 
                />               
              </div>             
            )}           
          </div>           
          
          {/* Featured Product */}           
          <div className="mt-6 flex items-center gap-3">             
            <input               
              type="checkbox"               
              checked={featured}               
              onChange={() => setFeatured(!featured)}             
            />             
            <label>               
              Show in Featured Collection             
            </label>           
          </div>           
          
          {/* Buttons */}           
          <div className="mt-8 flex gap-4">             
            <button               
              onClick={handleSubmit}               
              disabled={loading}               
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl transition"             
            >               
              {loading ? "Saving..." : "Save Product"}             
            </button>             
            <button               
              onClick={resetForm}               
              className="bg-gray-200 hover:bg-gray-300 px-8 py-3 rounded-xl transition"             
            >               
              Reset             
            </button>           
          </div>         
        </div>       
      </div>     
    </AdminLayout>   
  ); 
}