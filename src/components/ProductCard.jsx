import { FaWhatsapp } from "react-icons/fa";

export default function ProductCard({
  image,
  name,
}) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      overflow-hidden
      shadow-md
      hover:shadow-2xl
      transition-all
      hover:-translate-y-2
    "
    >
      <img
        src={image}
        alt={name}
        className="
        h-72
        w-full
        object-cover
      "
      />

      <div className="p-5">

        <h3 className="font-semibold text-lg">
          {name}
        </h3>

        <button
          className="
          mt-4
          w-full
          bg-green-500
          text-white
          py-3
          rounded-xl
          flex
          justify-center
          items-center
          gap-2
        "
        >
          <FaWhatsapp />
          Inquiry
        </button>

      </div>
    </div>
  );
}