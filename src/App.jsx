import { Routes, Route } from "react-router-dom"; 
import Splash from "./pages/Splash"; 
import Home from "./pages/Home"; 
import Collections from "./pages/Collections"; 
import ProductDetails from "./pages/ProductDetails"; 
import Contact from "./pages/Contact"; 
import About from "./pages/About"; 
import Dashboard from "./pages/admin/Dashboard"; 
import Products from "./pages/admin/Products"; 
import Rates from "./pages/admin/Rates"; 
import AddProduct from "./pages/admin/AddProduct"; 
import Categories from "./pages/admin/Categories"; 

export default function App() {   
  return (     
    <Routes>   
      {/* Public Routes */}   
      <Route path="/" element={<Splash />} />   
      <Route path="/home" element={<Home />} />   
      <Route path="/collections" element={<Collections />} />   
      <Route path="/product/:id" element={<ProductDetails />} />   
      <Route path="/contact" element={<Contact />} />   
      <Route path="/about" element={<About />} />   

      {/* Admin Routes */}   
      <Route path="/admin/dashboard" element={<Dashboard />} />   
      <Route path="/admin/products" element={<Products />} />   
      <Route path="/admin/products/add" element={<AddProduct />} />   
      <Route path="/admin/categories" element={<Categories />} />   
    </Routes>   
  ); 
}