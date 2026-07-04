const categories = [
  {
    name: "Necklaces",
    image: "/products/necklace.jpg",
  },
  {
    name: "Bracelets",
    image: "/products/bracelet.jpg",
  },
  {
    name: "Silver Collection",
    image: "/products/silver.jpg",
  },
  {
    name: "Earrings",
    image: "/products/necklace.jpg",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-24 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-center mb-4">
          Shop By Category
        </h2>

        <p className="text-center text-gray-500 mb-14">
          Discover our handcrafted collections
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {categories.map((category, index) => (
            <div
              key={index}
              className="
              relative
              overflow-hidden
              rounded-3xl
              cursor-pointer
              group
              shadow-md
            "
            >
              <img
                src={category.image}
                alt={category.name}
                className="
                h-72
                w-full
                object-cover
                transition
                duration-500
                group-hover:scale-110
              "
              />

              <div
                className="
                absolute
                inset-0
                bg-black/30
                flex
                items-center
                justify-center
              "
              >
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}