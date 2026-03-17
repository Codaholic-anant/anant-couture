import React, { useState } from "react";
import { User, Lock, ArrowRight, ShieldCheck, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import fashionBg from "../assets/images/fashion.jpg";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {

            await API.post("users/register/", {
                username,
                password,
                role
            });

            // login immediately
            const res = await API.post("login/", {
                username,
                password
            });

            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            navigate("/");

        } catch (err) {

            console.log(err);
            setError("User already exists or connection issue");

        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-start bg-cover bg-right bg-no-repeat px-8 md:px-24 relative"
            style={{ backgroundImage: `url(${fashionBg})` }}
        >
            {/* Keep background unblurred and clear. 
         Card is placed on the left to show the model on the right.
      */}

            <div className="relative z-10 bg-white/75 backdrop-blur-xl w-full max-w-[420px] rounded-[45px] shadow-2xl p-10 border border-white/40">

                {/* Brand Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl tracking-[10px] font-light text-black uppercase font-serif leading-none">Anant</h1>
                    <p className="text-[10px] tracking-[6px] text-gray-400 uppercase mt-2">Couture</p>
                    <div className="w-12 h-[2px] bg-[#b08d57] mx-auto mt-4"></div>
                </div>

                <h2 className="text-2xl text-center font-serif mb-1 text-[#1a1a1a]">Create Account</h2>
                <p className="text-center text-gray-500 text-xs mb-8">Join the world of luxury fashion</p>

                <form onSubmit={handleRegister} className="space-y-4">

                    {/* Username */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 shadow-sm focus-within:bg-white transition-all">
                        <User size={18} className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 shadow-sm focus-within:bg-white transition-all">
                        <Lock size={18} className="text-gray-400 mr-3" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 shadow-sm focus-within:bg-white transition-all">
                        <ShieldCheck size={18} className="text-gray-400 mr-3" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Role Dropdown */}
                    <div className="flex items-center bg-white/60 border border-white/20 rounded-2xl px-4 py-4 shadow-sm focus-within:bg-white transition-all">
                        <Briefcase size={18} className="text-gray-400 mr-3" />
                        <select
                            className="bg-transparent outline-none w-full text-sm text-gray-500 cursor-pointer appearance-none"
                            onChange={(e) => setRole(e.target.value)}
                            value={role}
                        >
                            <option value="customer">Customer</option>
                            <option value="designer">Designer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <button className="w-full bg-[#0d0d0d] text-white py-4 rounded-2xl flex items-center justify-between px-8 hover:bg-black transition-all shadow-xl mt-6 group">
                        <span className="tracking-[3px] text-xs font-bold uppercase">Create Account</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* Footer Link */}
                <p className="text-center mt-10 text-xs text-gray-500">
                    Already have an account?
                    <span
                        onClick={() => navigate("/")}
                        className="ml-2 text-[#b08d57] font-bold cursor-pointer hover:underline underline-offset-4"
                    >
                        Login →
                    </span>
                </p>

                {error && <p className="text-red-500 text-center mt-4 text-[11px] font-medium">{error}</p>}
            </div>
        </div>
    );
}