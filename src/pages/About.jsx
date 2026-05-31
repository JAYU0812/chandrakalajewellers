import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="bg-[#faf8f5] min-h-screen pt-24">

        {/* Hero */}
        <section className="py-20 text-center px-4">

          <h1 className="text-5xl md:text-6xl font-bold">
            About Chandrakala Jewellers
          </h1>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto">
            A legacy of trust, craftsmanship, and timeless
            jewellery designs for every generation.
          </p>

        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <img
                src="/products/necklace.jpg"
                alt="About Us"
                className="
                  rounded-3xl
                  shadow-xl
                  w-full
                "
              />
            </div>

            <div>

              <h2 className="text-4xl font-bold mb-6">
                Our Story
              </h2>

              <p className="text-gray-600 leading-8">
                Chandrakala Jewellers has been serving families
                with premium jewellery collections crafted with
                precision, authenticity, and dedication.
              </p>

              <p className="text-gray-600 leading-8 mt-5">
                Every piece reflects our commitment to quality,
                purity, and timeless elegance.
              </p>

            </div>

          </div>

        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-20">

          <div className="max-w-6xl mx-auto px-4">

            <h2 className="text-4xl font-bold text-center mb-12">
              Why Choose Us
            </h2>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="p-8 rounded-3xl bg-[#faf8f5]">
                <h3 className="font-bold text-xl mb-4">
                  Certified Purity
                </h3>

                <p className="text-gray-600">
                  Trusted gold and silver jewellery with
                  guaranteed quality.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf8f5]">
                <h3 className="font-bold text-xl mb-4">
                  Custom Designs
                </h3>

                <p className="text-gray-600">
                  Unique jewellery tailored to your style.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#faf8f5]">
                <h3 className="font-bold text-xl mb-4">
                  Trusted Service
                </h3>

                <p className="text-gray-600">
                  Years of trust and customer satisfaction.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="py-20 text-center px-4">

          <h2 className="text-4xl font-bold">
            Visit Our Store
          </h2>

          <p className="text-gray-600 mt-4">
            Opp. Bhoomi Complex, Civil Road,
            Khedbrahma - 383255
          </p>

          <a
            href="https://wa.me/919427080359"
            target="_blank"
            rel="noreferrer"
            className="
              inline-block
              mt-8
              bg-green-500
              text-white
              px-8
              py-4
              rounded-full
              hover:bg-green-600
              transition
            "
          >
            Contact on WhatsApp
          </a>

        </section>

      </main>

      <Footer />
      <WhatsappButton />
    </>
  );
}