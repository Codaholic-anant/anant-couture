import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

import men from "../assets/images/hero.jpg";
import women from "../assets/images/women.jpg";
import kids from "../assets/images/kids.jpg";

// Scroll reveal wrapper
function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

// Animated section heading
function SectionHeading({ label, title }) {
    return (
        <Reveal>
            <div className="text-center mb-16">
                <p className="text-xs tracking-[6px] text-[#b08d57] uppercase mb-3">{label}</p>
                <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a]">{title}</h2>
                <div className="w-16 h-[1px] bg-[#b08d57] mx-auto mt-5"></div>
            </div>
        </Reveal>
    );
}

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");

    useEffect(() => {
        API.get("products/")
            .then(res => { setProducts(res.data); setLoading(false); })
            .catch((err) => {console.log(err);
                setLoading(false);
            });
    }, []);

    const subscribe = () => {
        if (!email) { alert("Enter email first"); return; }
        API.post("newsletter/", { email })
            .then(() => { alert("Subscribed!"); setEmail(""); })
            .catch(() => alert("Subscription failed"));
    };

    const categories = [
        { img: men, title: "Men's Collection", sub: "Modern & classic fashion" },
        { img: women, title: "Women's Collection", sub: "Elegant designer outfits" },
        { img: kids, title: "Kids' Collection", sub: "Comfortable stylish wear" },
    ];

    return (
        <Layout>

            {/* HERO */}
            <HeroSlider />

            {/* BRAND MESSAGE */}
            <section className="max-w-4xl mx-auto text-center py-28 px-6">
                <Reveal>
                    <p className="text-xs tracking-[8px] text-[#b08d57] uppercase mb-4">Our Philosophy</p>
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-6 leading-tight">
                        Timeless Fashion,<br />Crafted for You
                    </h2>
                    <div className="w-16 h-[1px] bg-[#b08d57] mx-auto mb-6"></div>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        ANANT COUTURE blends modern elegance with classic craftsmanship.
                        Designed for those who appreciate premium fashion and luxury lifestyle.
                    </p>
                </Reveal>
            </section>

            {/* MARQUEE STRIP */}
            <div className="bg-[#1a1a1a] py-5 overflow-hidden">
                <motion.div
                    className="flex whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="mx-10 text-[#b08d57] text-xs tracking-[5px] uppercase">
                            ✦ Premium Quality &nbsp; ✦ Luxury Fabrics &nbsp; ✦ Modern Designs &nbsp; ✦ Handcrafted &nbsp; ✦ New Collection 2026
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-28">
                <SectionHeading label="Explore" title="Shop by Category" />
                <div className="grid md:grid-cols-3 gap-8">
                    {categories.map(({ img, title, sub }, i) => (
                        <Reveal key={title} delay={i * 0.15}>
                            <motion.div
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="group cursor-pointer overflow-hidden rounded-3xl shadow-md"
                            >
                                <div className="relative h-[420px] overflow-hidden">
                                    <motion.img
                                        src={img}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-2xl font-serif">{title}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{sub}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="max-w-7xl mx-auto px-6 py-10 pb-28">
                <SectionHeading label="Handpicked" title="Featured Products" />
                {loading ? (
                    <div className="grid md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-8">
                        {products.slice(0, 4).map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                )}
                <Reveal delay={0.3}>
                    <div className="text-center mt-12">
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.04, backgroundColor: "#b08d57", color: "#fff" }}
                                className="border border-[#1a1a1a] text-[#1a1a1a] px-12 py-4 rounded-full text-xs tracking-[4px] uppercase font-semibold transition-colors duration-300"
                            >
                                View All Products
                            </motion.button>
                        </Link>
                    </div>
                </Reveal>
            </section>

            {/* TRENDING */}
            <section className="bg-[#faf9f7] py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeading label="What's Hot" title="Trending Collection" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { img: men, label: "Shop Men" },
                            { img: women, label: "Shop Women" },
                            { img: kids, label: "Shop Kids" },
                        ].map(({ img, label }, i) => (
                            <Reveal key={label} delay={i * 0.15}>
                                <div className="relative group overflow-hidden rounded-3xl h-[450px]">
                                    <motion.img
                                        src={img}
                                        className="w-full h-full object-cover"
                                        whileHover={{ scale: 1.06 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                        <Link to="/shop">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-white text-black px-8 py-3 rounded-full text-xs tracking-[4px] uppercase font-semibold hover:bg-[#b08d57] hover:text-white transition-colors"
                                            >
                                                {label}
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARALLAX BANNER */}
            <div
                className="h-[550px] bg-fixed bg-center bg-cover flex items-center justify-center text-white text-center relative"
                style={{ backgroundImage: `url(${women})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <Reveal>
                    <div className="relative z-10">
                        <p className="text-xs tracking-[8px] text-[#b08d57] uppercase mb-4">Limited Edition</p>
                        <h2 className="text-6xl font-serif mb-6">New Luxury Collection</h2>
                        <p className="text-gray-300 text-lg mb-8 tracking-wide">
                            Experience elegance crafted for modern fashion lovers
                        </p>
                        <Link to="/shop">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "#b08d57" }}
                                className="bg-white text-black px-10 py-4 rounded-full text-xs tracking-[4px] uppercase font-semibold transition-colors duration-300"
                            >
                                Shop Now
                            </motion.button>
                        </Link>
                    </div>
                </Reveal>
            </div>

            {/* WHY CHOOSE US */}
            <section className="max-w-6xl mx-auto py-28 px-6">
                <SectionHeading label="Our Promise" title="Why Choose Anant Couture" />
                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { icon: "✦", title: "Premium Quality", desc: "Carefully crafted fabrics designed for luxury and comfort." },
                        { icon: "✦", title: "Modern Designs", desc: "Inspired by international fashion trends and Indian heritage." },
                        { icon: "✦", title: "Fast Delivery", desc: "Quick shipping and a secure, seamless checkout experience." },
                    ].map(({ icon, title, desc }, i) => (
                        <Reveal key={title} delay={i * 0.15}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="text-center p-8 rounded-3xl border border-gray-100 hover:border-[#b08d57] hover:shadow-lg transition-all duration-300"
                            >
                                <div className="text-[#b08d57] text-3xl mb-4">{icon}</div>
                                <h3 className="text-xl font-serif text-[#1a1a1a] mb-3">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* NEWSLETTER */}
            <section className="bg-[#1a1a1a] text-white py-28 text-center">
                <Reveal>
                    <p className="text-xs tracking-[6px] text-[#b08d57] uppercase mb-3">Stay Connected</p>
                    <h2 className="text-4xl font-serif mb-4">Join Anant Couture</h2>
                    <div className="w-16 h-[1px] bg-[#b08d57] mx-auto mb-6"></div>
                    <p className="text-gray-400 mb-10 tracking-wide">
                        Get updates on new collections and exclusive offers
                    </p>
                    <div className="flex justify-center gap-3 flex-wrap">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-6 py-4 rounded-full text-black w-72 text-sm outline-none"
                        />
                        <motion.button
                            onClick={subscribe}
                            whileHover={{ scale: 1.04, backgroundColor: "#b08d57" }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white text-black px-8 py-4 rounded-full text-xs tracking-[4px] uppercase font-semibold transition-colors duration-300"
                        >
                            Subscribe
                        </motion.button>
                    </div>
                </Reveal>
            </section>

        </Layout>
    );
}