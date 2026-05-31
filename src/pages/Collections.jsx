import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Elegant Necklace",
      category: "Necklaces",
      image: "/products/necklace.jpg",
    },
    {
      id: 2,
      name: "Silver Bracelet",
      category: "Bracelets",
      image: "/products/bracelet.jpg",
    },
    {
      id: 3,
      name: "Premium Silver Set",
      category: "Silver",
      image: "/products/silver.jpg",
    },
    {
      id: 4,
      name: "Designer Earrings",
      category: "Earrings",
      image: "/products/necklace.jpg",
    },
  ];

  const categories = [
    "All",
    "Necklaces",
    "Bracelets",
    "Silver",
    "Earrings",
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === activeCategory
        );

  return (
    <>
      <Navbar />

      <main className="bg-[#faf8f5] min-h-screen pt-24">

        {/* Hero Banner */}
        <section className="py-20 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            Our Collections
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Explore our handcrafted jewellery collections,
            designed with elegance and crafted with trust.
          </p>
        </section>

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-4 mb-16">
          <div className="flex flex-wrap justify-center gap-4">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full transition ${
                  activeCategory === category
                    ? "bg-yellow-500 text-white"
                    : "bg-white border border-gray-200 hover:border-yellow-500"
                }`}
              >
                {category}
              </button>
            ))}

          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-24">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  shadow-md
                  border
                  border-yellow-100
                  hover:shadow-xl
                  hover:-translate-y-2
                  transition-all
                "
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    h-80
                    w-full
                    object-cover
                  "
                />

                <div className="p-6">

                  <span className="text-yellow-600 text-sm">
                    {product.category}
                  </span>

                  <h3 className="text-xl font-semibold mt-2">
                    {product.name}
                  </h3>

                  <div className="mt-6 flex gap-3">

                    <Link
                      to={`/product/${product.id}`}
                      className="
                        flex-1
                        text-center
                        bg-yellow-500
                        text-white
                        py-3
                        rounded-xl
                        hover:bg-yellow-600
                        transition
                      "
                    >
                      View Details
                    </Link>

                    <a
                      href="https://wa.me/919427080359"
                      target="_blank"
                      rel="noreferrer"
                      className="
                        flex-1
                        text-center
                        bg-green-500
                        text-white
                        py-3
                        rounded-xl
                        hover:bg-green-600
                        transition
                      "
                    >
                      Inquiry
                    </a>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>

      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}