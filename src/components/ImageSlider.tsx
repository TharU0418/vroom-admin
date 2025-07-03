'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index: number) => setActiveSlide(index);
  const goToPrev = () => setActiveSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative w-full max-w-3xl mx-auto h-[500px] overflow-hidden rounded-lg shadow-lg mb-8">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
            width={100}
            height={100}
          />
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl z-20"
      >
        <FaArrowLeft />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl z-20"
      >
        <FaArrowRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${
              index === activeSlide ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
