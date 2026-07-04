import { useEffect, useState } from "react";

const slides = [
  {
    image: "/hero/hero1.jpg",
    title: "Timeless Elegance",
    subtitle: "Luxury Jewellery For Every Occasion",
  },
  {
    image: "/hero/hero2.jpg",
    title: "Crafted With Passion",
    subtitle: "Premium Gold & Silver Collections",
  },
  {
    image: "/hero/hero3.jpg",
    title: "Trusted By Generations",
    subtitle: "Discover Chandrakala Jewellers",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            current === index
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/45"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">

              <h1 className="text-white text-4xl md:text-7xl font-bold">
                {slide.title}
              </h1>

              <p className="text-white mt-4 text-lg md:text-2xl">
                {slide.subtitle}
              </p>

              <button
                className="
                  mt-8
                  bg-yellow-500
                  hover:bg-yellow-600
                  text-white
                  px-8
                  py-3
                  rounded-full
                  transition
                "
              >
                Explore Collection
              </button>

            </div>
          </div>
        </div>
      ))}

      {/* Dots */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">

        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index
                ? "bg-yellow-500"
                : "bg-white"
            }`}
          />
        ))}

      </div>
    </section>
  );
}