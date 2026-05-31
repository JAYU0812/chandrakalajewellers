import ProductCard from "./ProductCard";

export default function FeaturedCollection() {
  return (
    <section
      className="
      py-20
      px-4
      bg-white
    "
    >
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          Featured Collection
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Handpicked Jewellery Pieces
        </p>

        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
        "
        >
          <ProductCard
            image="/products/necklace.jpg"
            name="Silver Necklace"
          />

          <ProductCard
            image="/products/bracelet.jpeg"
            name="Designer Bracelet"
          />

          <ProductCard
            image="/products/silver.jpg"
            name="Premium Silver Set"
          />
        </div>

      </div>
    </section>
  );
}