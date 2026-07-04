import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black flex items-center overflow-hidden">

      <div className="absolute w-[700px] h-[700px] bg-yellow-500/10 rounded-full blur-[180px] right-0"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
          >
            Timeless
            <span className="text-yellow-400"> Elegance</span>
          </motion.h1>

          <p className="text-gray-400 mt-6 text-lg">
            Discover handcrafted jewellery designed with
            passion, trust and tradition.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/collections"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold"
            >
              Explore Collection
            </Link>

            <Link
              to="/contact"
              className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        >
          <img
            src="/1000070226.jpg"
            alt="Jewellery"
            className="rounded-3xl shadow-2xl"
          />
        </motion.div>

      </div>
    </section>
  );
}