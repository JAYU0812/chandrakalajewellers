import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/919427080359"
      target="_blank"
      rel="noreferrer"
      className="
      fixed
      bottom-6
      right-6
      bg-green-500
      text-white
      p-4
      rounded-full
      shadow-xl
      z-50
      hover:scale-110
      transition
      "
    >
      <FaWhatsapp size={28} />
    </a>
  );
}