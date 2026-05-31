import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import RatesSection from "../components/RatesSection";
import FeaturedCollection from "../components/FeaturedCollection";
import CategoriesSection from "../components/CategoriesSection";
import TrustSection from "../components/TrustSection";
import WhatsappButton from "../components/WhatsappButton";

export default function Home() {
  return (
    <div className="bg-[#faf8f5] min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroCarousel />

      {/* Today's Rates */}
      <RatesSection />

      {/* Featured Collection */}
      <FeaturedCollection />

      {/* Categories */}
      <CategoriesSection />

      {/* Trust Section */}
      <TrustSection />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <img
                src="/products/necklace.jpg"
                alt="Chandrakala Jewellers"
                className="
                  rounded-3xl
                  shadow-xl
                  w-full
                  object-cover
                "
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">
                About Chandrakala Jewellers
              </h2>

              <p className="text-gray-600 leading-8">
                At Chandrakala Jewellers, we blend tradition,
                craftsmanship, and elegance to create timeless
                jewellery pieces that celebrate every occasion.
              </p>

              <p className="text-gray-600 leading-8 mt-4">
                From stunning gold collections to premium silver
                jewellery, every piece reflects quality,
                authenticity, and trust built over generations.
              </p>

              <button
                className="
                  mt-8
                  bg-yellow-500
                  text-white
                  px-8
                  py-3
                  rounded-full
                  hover:bg-yellow-600
                  transition
                "
              >
                Learn More
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold mb-4">
            Visit Our Store
          </h2>

          <p className="text-gray-600 mb-3">
            Opp. Bhoomi Complex, Civil Road,
            Khedbrahma - 383255
          </p>

          <p className="text-gray-600 mb-3">
            📞 +91 9427080359
          </p>

          <p className="text-gray-600 mb-8">
            ✉ chandrakalajewellers849@gmail.com
          </p>

          <a
            href="https://wa.me/919427080359"
            target="_blank"
            rel="noreferrer"
            className="
              bg-green-500
              text-white
              px-8
              py-3
              rounded-full
              hover:bg-green-600
              transition
            "
          >
            Contact On WhatsApp
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">

          <h3 className="text-xl font-semibold mb-2">
            Chandrakala Jewellers
          </h3>

          <p className="text-gray-400">
            Timeless Elegance • Crafted With Trust
          </p>

          <p className="text-gray-500 mt-4 text-sm">
            © {new Date().getFullYear()} Chandrakala Jewellers.
            All Rights Reserved.
          </p>

        </div>
      </footer>

      {/* Floating WhatsApp */}
      <WhatsappButton />

    </div>
  );
}