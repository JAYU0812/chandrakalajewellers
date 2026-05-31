import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsappButton from "../components/WhatsappButton";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <div className="bg-[#faf8f5] min-h-screen pt-28">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 gap-12">

            {/* Image */}

            <div>
              <img
                src="/products/necklace.jpg"
                alt="product"
                className="
                  w-full
                  rounded-3xl
                  shadow-lg
                "
              />
            </div>

            {/* Details */}

            <div>

              <span
                className="
                inline-block
                bg-yellow-100
                text-yellow-700
                px-4
                py-2
                rounded-full
                mb-4
                "
              >
                Gold Collection
              </span>

              <h1 className="text-5xl font-bold">
                Gold Necklace
              </h1>

              <p className="text-gray-500 mt-6 leading-8">
                Premium handcrafted jewellery
                designed with elegance and
                attention to detail.
              </p>

              <div className="mt-8 space-y-3">

                <p>
                  <strong>Metal:</strong> Gold
                </p>

                <p>
                  <strong>Weight:</strong> 12g
                </p>

                <p>
                  <strong>Purity:</strong> 22K
                </p>

              </div>

              <a
                href="https://wa.me/919427080359"
                target="_blank"
                rel="noreferrer"
                className="
                mt-10
                inline-block
                bg-green-500
                text-white
                px-8
                py-4
                rounded-xl
                "
              >
                WhatsApp Inquiry
              </a>

            </div>

          </div>

        </div>

      </div>

      <Footer />

      <WhatsappButton />
    </>
  );
}