import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("access");
    const isLoggedIn = !!token;

    useEffect(() => {
        // Only fetch cart if logged in
        if (!isLoggedIn) return;
        API.get("cart/")
            .then(res => {
                const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(total);
            })
            .catch(() => {});
    }, [isLoggedIn]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <>
            {/* Marquee ticker */}
            <div className="bg-[#1a1a1a] text-[#b08d57] text-xs py-2 overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="mx-12 tracking-[4px] uppercase">
                            ✦ New Luxury Collection 2026 &nbsp;&nbsp; ✦ Free Shipping Above ₹2999 &nbsp;&nbsp; ✦ Premium Indian Fashion &nbsp;&nbsp; ✦ Exclusive Designs
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Navbar */}
            <motion.nav
                className={`sticky top-0 z-50 transition-all duration-500 ${
                    scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white border-b border-gray-100"
                }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* Logo */}
                    <Link to="/">
                        <motion.div whileHover={{ scale: 1.02 }} className="text-center">
                            <h1 className="text-2xl font-serif tracking-[8px] text-[#1a1a1a] uppercase leading-none">Anant</h1>
                            <p className="text-[8px] tracking-[6px] text-[#b08d57] uppercase">Couture</p>
                        </motion.div>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase text-gray-600">
                        <Link to="/" className="hover:text-[#b08d57] transition-colors">Home</Link>
                        <Link to="/shop" className="hover:text-[#b08d57] transition-colors">Shop</Link>
                        {isLoggedIn && (
                            <Link to="/orders" className="hover:text-[#b08d57] transition-colors">Orders</Link>
                        )}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-5">
                        {isLoggedIn ? (
                            <>
                                <Link to="/cart">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="relative text-[#1a1a1a] hover:text-[#b08d57] transition-colors"
                                    >
                                        <ShoppingCart size={20} />
                                        {cartCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-2 -right-2 bg-[#b08d57] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                                            >
                                                {cartCount}
                                            </motion.span>
                                        )}
                                    </motion.div>
                                </Link>
                                <Link to="/profile">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#b08d57] transition-colors"
                                    >
                                        <User size={14} className="text-white" />
                                    </motion.div>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-[#b08d57] transition-colors"
                                >
                                    <LogOut size={18} />
                                </motion.button>
                            </>
                        ) : (
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    className="bg-[#1a1a1a] text-white text-xs tracking-[3px] uppercase px-5 py-2 rounded-full hover:bg-[#b08d57] transition-colors"
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.nav>
        </>
    );
}