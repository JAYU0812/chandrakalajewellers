export default function RateCard({ title, price }) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-6
      shadow-md
      hover:shadow-xl
      transition
      border
      border-yellow-100
      text-center
    "
    >
      <h3 className="text-gray-500 mb-3">
        {title}
      </h3>

      <h2 className="text-3xl font-bold text-yellow-600">
        ₹ {price}
      </h2>
    </div>
  );
}