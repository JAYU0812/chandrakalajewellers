export default function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">

        <h3 className="text-xl font-semibold">
          Chandrakala Jewellers
        </h3>

        <p className="text-gray-400 mt-2">
          Timeless Elegance • Crafted With Trust
        </p>

        <p className="text-gray-500 mt-4 text-sm">
          © {new Date().getFullYear()} Chandrakala Jewellers
        </p>

      </div>
    </footer>
  );
}