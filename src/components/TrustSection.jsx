export default function TrustSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-4xl font-bold text-center mb-4">
          Why Choose Chandrakala Jewellers
        </h2>

        <p className="text-center text-gray-500 mb-14">
          Trusted craftsmanship and quality.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-[#faf8f5] p-8 rounded-3xl">
            <h3 className="font-bold text-xl mb-3">
              Certified Quality
            </h3>

            <p className="text-gray-600">
              Premium gold and silver jewellery with trusted purity.
            </p>
          </div>

          <div className="bg-[#faf8f5] p-8 rounded-3xl">
            <h3 className="font-bold text-xl mb-3">
              Custom Designs
            </h3>

            <p className="text-gray-600">
              Unique jewellery crafted to match your style.
            </p>
          </div>

          <div className="bg-[#faf8f5] p-8 rounded-3xl">
            <h3 className="font-bold text-xl mb-3">
              Trusted Service
            </h3>

            <p className="text-gray-600">
              Generations of trust and customer satisfaction.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}