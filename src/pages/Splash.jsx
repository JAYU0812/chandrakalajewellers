import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import "../styles/splash.css";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative h-screen bg-black overflow-hidden flex items-center justify-center">

      {/* Gold Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-yellow-500/10 blur-[150px]" />

      {/* Animated Particles */}
      <div className="particles"></div>

      <div className="relative z-10 text-center">

        <motion.img
          src={logo}
          alt="Chandrakala Jewellers"
          className="w-44 md:w-56 mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        <motion.h1
          className="text-white text-4xl md:text-6xl font-bold tracking-[10px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          CHANDRAKALA
        </motion.h1>

        <motion.h2
          className="text-yellow-400 text-xl md:text-2xl tracking-[6px] mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          JEWELLERS
        </motion.h2>

        <motion.p
          className="text-gray-400 mt-6 text-sm md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Timeless Elegance • Crafted With Trust
        </motion.p>

        <div className="w-64 h-1 bg-gray-800 rounded-full mx-auto mt-10 overflow-hidden">
          <motion.div
            className="h-full bg-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 4 }}
          />
        </div>
      </div>
    </div>
  );
}