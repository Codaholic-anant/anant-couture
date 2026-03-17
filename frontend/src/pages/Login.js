import React, { useState } from "react";
import { User, Lock, Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import fashionBg from "../assets/images/fashion.jpg";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const res = await API.post("login/", {
                username: username,
                password: password
            });

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            navigate("/");

        } catch (err) {

            console.log(err);
            setError("Invalid credentials");

        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-start bg-cover bg-right bg-no-repeat px-8 md:px-24 relative"
            style={{ backgroundImage: `url(${fashionBg})` }}
        >
            {/* Note: We removed the dark overlay and global blur to keep 
         the background exactly as crisp as your uploaded image.
      */}

            {/* The Luxury Card - Set to left with justify-start in parent */}
            <div className="relative z-10 bg-white/70 backdrop-blur-lg w-full max-w-[400px] rounded-[45px] shadow-2xl p-10 border border-white/40">

                {/* Branding Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl tracking-[10px] font-light text-black uppercase font-serif">Anant</h1>
                    <p className="text-[10px] tracking-[6px] text-gray-400 uppercase mt-1">Couture</p>
                    <div className="w-12 h-[2px] bg-[#b08d57] mx-auto mt-4"></div>
                </div>

                <h2 className="text-2xl text-center font-serif mb-1 text-[#1a1a1a]">Welcome Back</h2>
                <p className="text-center text-gray-500 text-xs mb-8">Sign in to continue your fashion journey</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Username Input - White semi-transparent matching the image */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 focus-within:bg-white transition-all shadow-sm">
                        <User size={18} className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 focus-within:bg-white transition-all shadow-sm">
                        <Lock size={18} className="text-gray-400 mr-3" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Eye size={18} className="text-gray-400 hover:text-black cursor-pointer" />
                    </div>

                    {/* Login Button - Pill shaped and dark */}
                    <button className="w-full bg-[#0a0a0a] text-white py-4 rounded-2xl flex items-center justify-between px-8 hover:bg-black transition-all shadow-xl mt-6 group">
                        <span className="tracking-[4px] text-xs font-bold">LOGIN</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* Separator */}
                <div className="relative flex items-center my-8">
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                    <span className="px-3 text-[10px] text-gray-400 uppercase tracking-widest">or continue with</span>
                    <div className="flex-1 h-[1px] bg-gray-200"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex justify-between gap-2">
                    {["Google", "Apple", "Facebook"].map((name) => (
                        <button key={name} className="flex-1 bg-white/80 border border-white/40 py-2.5 rounded-xl text-[10px] font-semibold text-gray-600 shadow-sm hover:bg-white transition">
                            {name}
                        </button>
                    ))}
                </div>

                {/* Footer Link */}
                <p className="text-center mt-10 text-xs text-gray-500">
                    New here?
                    <span
                        onClick={() => navigate("/register")}
                        className="ml-2 text-[#b08d57] font-bold cursor-pointer hover:underline underline-offset-4"
                    >
                        Create Account →
                    </span>
                </p>

                {error && <p className="text-red-500 text-center mt-4 text-[11px] font-medium">{error}</p>}
            </div>
        </div>
    );
}