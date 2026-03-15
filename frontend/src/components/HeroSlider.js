import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "../assets/images/fashion.jpg";
import img2 from "../assets/images/hero.jpg";
import img3 from "../assets/images/women.jpg";

const slides = [
    { img: img1, title: "New Arrivals", subtitle: "Luxury Collection 2026", btn: "Explore Now" },
    { img: img2, title: "Men's Edit", subtitle: "Modern Classics Redefined", btn: "Shop Men" },
    { img: img3, title: "Women's Edit", subtitle: "Elegance Meets Comfort", btn: "Shop Women" },
];

export default function HeroSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[92vh] overflow-hidden">

            {/* Image crossfade */}
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={slides[index].img}
                    alt="hero"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Text */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >
                        <p className="text-xs tracking-[8px] text-[#b08d57] uppercase mb-4">
                            Anant Couture
                        </p>
                        <h1 className="text-6xl md:text-8xl font-serif mb-4 leading-tight">
                            {slides[index].title}
                        </h1>
                        <p className="text-lg text-gray-200 tracking-widest mb-10">
                            {slides[index].subtitle}
                        </p>
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#b08d57", color: "#fff" }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-white text-black px-12 py-4 rounded-full text-sm tracking-[4px] uppercase font-semibold transition-colors duration-300"
                            >
                                {slides[index].btn}
                            </motion.button>
                        </Link>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)}
                        className={`transition-all duration-300 rounded-full ${
                            i === index ? "w-8 h-2 bg-[#b08d57]" : "w-2 h-2 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}