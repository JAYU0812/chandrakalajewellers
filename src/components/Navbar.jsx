import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-3"
            >
              <img
                src={logo}
                alt="Chandrakala Jewellers"
                className="w-12 h-12 object-contain"
              />

              <div>
                <h1 className="font-bold text-gray-900 text-lg">
                  CHANDRAKALA
                </h1>

                <p className="text-xs tracking-widest text-yellow-600">
                  JEWELLERS
                </p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">

              <Link
                to="/home"
                className="text-gray-700 hover:text-yellow-600 transition"
              >
                Home
              </Link>

              <Link
                to="/collections"
                className="text-gray-700 hover:text-yellow-600 transition"
              >
                Collections
              </Link>

              <Link
                to="/about"
                className="text-gray-700 hover:text-yellow-600 transition"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-gray-700 hover:text-yellow-600 transition"
              >
                Contact
              </Link>

              <a
                href="https://wa.me/919427080359"
                target="_blank"
                rel="noreferrer"
                className="
                  bg-green-500
                  hover:bg-green-600
                  text-white
                  px-5
                  py-2
                  rounded-full
                  transition
                "
              >
                WhatsApp
              </a>

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-3xl"
            >
              {menuOpen ? <HiX /> : <HiMenu />}
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed
          top-20
          left-0
          w-full
          bg-white
          shadow-lg
          z-40
          transition-all
          duration-300
          ${
            menuOpen
              ? "translate-y-0"
              : "-translate-y-[120%]"
          }
        `}
      >
        <div className="flex flex-col p-6 gap-5">

          <Link
            to="/home"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/collections"
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          <a
            href="https://wa.me/919427080359"
            target="_blank"
            rel="noreferrer"
            className="
              bg-green-500
              text-white
              text-center
              py-3
              rounded-xl
            "
          >
            WhatsApp
          </a>

        </div>
      </div>
    </>
  );
}