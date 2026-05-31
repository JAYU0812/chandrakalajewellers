import RateCard from "./RateCard";

export default function RatesSection() {
  return (
    <section className="py-20 px-4 bg-[#faf8f5]">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-4">
          Today's Rates
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Updated Daily
        </p>

        <div
          className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-6
        "
        >
          <RateCard
            title="Gold 24K"
            price="9800/g"
          />

          <RateCard
            title="Gold 22K"
            price="9100/g"
          />

          <RateCard
            title="Silver"
            price="112/g"
          />

          <RateCard
            title="Silver 925"
            price="125/g"
          />
        </div>

      </div>

    </section>
  );
}