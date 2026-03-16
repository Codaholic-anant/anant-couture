import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Edit3, Save, X, Package, LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [form, setForm] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("access");

    useEffect(() => {
        if (!token) { navigate("/"); return; }
        fetchProfile();
        fetchOrders();
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await API.get("users/profile/");
            setProfile(res.data);
            setForm(res.data);
        } catch {
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await API.get("orders/");
            setOrders(res.data);
        } catch {
            setOrders([]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            const res = await API.put("users/profile/", form);
            setProfile(res.data);
            setEditing(false);
            setSuccess("Profile updated successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            setError("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/");
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            confirm: "bg-blue-100 text-blue-700",
            tailoring: "bg-purple-100 text-purple-700",
            shipped: "bg-orange-100 text-orange-700",
            delivered: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    const getInitials = () => {
        if (profile?.first_name && profile?.last_name)
            return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
        return profile?.username?.[0]?.toUpperCase() || "A";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#b08d57] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Loading</p>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#faf9f7]">

                {/* Hero Banner */}
                <div className="h-48 w-full relative"
                    style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #8B6914 50%, #1a1a1a 100%)" }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
                    <div className="absolute top-4 right-6">
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-full border border-white/20 transition">
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-3xl font-serif text-white translate-y-12"
                            style={{ background: "linear-gradient(135deg, #1a1a1a, #8B6914)" }}>
                            {getInitials()}
                        </motion.div>
                    </div>
                </div>

                {/* Name + Role */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16 mb-6">
                    <h1 className="text-2xl font-serif text-[#1a1a1a]">
                        {profile?.first_name && profile?.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : profile?.username}
                    </h1>
                    <p className="text-xs tracking-[4px] text-[#b08d57] uppercase mt-1">{profile?.role}</p>
                    <div className="w-10 h-[1px] bg-[#b08d57] mx-auto mt-3"></div>
                </motion.div>

                {/* Stats Row */}
                <div className="max-w-2xl mx-auto px-6 mb-8">
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Orders", value: orders.length },
                            { label: "Delivered", value: orders.filter(o => o.status === "delivered").length },
                            { label: "Pending", value: orders.filter(o => o.status === "pending").length },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                                <p className="text-2xl font-serif text-[#1a1a1a]">{stat.value}</p>
                                <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-2xl mx-auto px-6 mb-6">
                    <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "orders", label: "Orders", icon: Package },
                        ].map(({ id, label, icon: Icon }) => (
                            <button key={id} onClick={() => setActiveTab(id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                                    activeTab === id
                                        ? "bg-[#1a1a1a] text-white shadow"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}>
                                <Icon size={14} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-2xl mx-auto px-6 pb-24">

                    {/* Profile Tab */}
                    {activeTab === "profile" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-serif text-lg text-[#1a1a1a]">Personal Information</h2>
                                {!editing ? (
                                    <button onClick={() => setEditing(true)}
                                        className="flex items-center gap-2 text-xs text-[#b08d57] border border-[#b08d57] px-4 py-2 rounded-full hover:bg-[#b08d57] hover:text-white transition">
                                        <Edit3 size={12} /> Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditing(false); setForm(profile); }}
                                            className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-full hover:bg-gray-50 transition">
                                            <X size={12} /> Cancel
                                        </button>
                                        <button onClick={handleSave} disabled={saving}
                                            className="flex items-center gap-1 text-xs text-white bg-[#1a1a1a] px-4 py-2 rounded-full hover:bg-black transition disabled:opacity-50">
                                            <Save size={12} /> {saving ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {success && <p className="text-green-600 text-xs mb-4 text-center bg-green-50 py-2 rounded-xl">{success}</p>}
                            {error && <p className="text-red-500 text-xs mb-4 text-center bg-red-50 py-2 rounded-xl">{error}</p>}

                            <div className="space-y-4">
                                {[
                                    { label: "First Name", key: "first_name", icon: User },
                                    { label: "Last Name", key: "last_name", icon: User },
                                    { label: "Email", key: "email", icon: Mail },
                                    { label: "Phone", key: "phone", icon: Phone },
                                    { label: "Address", key: "address", icon: MapPin },
                                ].map(({ label, key, icon: Icon }) => (
                                    <div key={key} className="flex items-start gap-3 p-4 rounded-2xl bg-[#faf9f7] border border-gray-100">
                                        <Icon size={16} className="text-[#b08d57] mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">{label}</p>
                                            {editing ? (
                                                key === "address" ? (
                                                    <textarea
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#b08d57] transition resize-none"
                                                        rows={2}
                                                        value={form[key] || ""}
                                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                                        placeholder={`Enter ${label}`}
                                                    />
                                                ) : (
                                                    <input
                                                        type={key === "email" ? "email" : "text"}
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#b08d57] transition"
                                                        value={form[key] || ""}
                                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                                        placeholder={`Enter ${label}`}
                                                    />
                                                )
                                            ) : (
                                                <p className="text-sm text-[#1a1a1a]">
                                                    {profile[key] || <span className="text-gray-300 italic">Not provided</span>}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Role - read only */}
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#faf9f7] border border-gray-100">
                                    <Shield size={16} className="text-[#b08d57] shrink-0" />
                                    <div>
                                        <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-1">Role</p>
                                        <span className="text-xs bg-[#1a1a1a] text-white px-3 py-1 rounded-full capitalize">{profile?.role}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                                    <Package size={40} className="text-gray-200 mx-auto mb-4" />
                                    <p className="font-serif text-gray-400">No orders yet</p>
                                    <p className="text-xs text-gray-300 mt-1">Your fashion journey starts here</p>
                                    <button onClick={() => navigate("/home")}
                                        className="mt-6 text-xs text-white bg-[#1a1a1a] px-6 py-3 rounded-full hover:bg-black transition">
                                        Shop Now
                                    </button>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="text-xs text-gray-400 tracking-widest uppercase">Order</p>
                                                <p className="font-serif text-[#1a1a1a]">#{order.id}</p>
                                            </div>
                                            <span className={`text-[10px] font-semibold px-3 py-1 rounded-full capitalize tracking-wider ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="h-[1px] bg-gray-100 mb-3"></div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-gray-400">{order.created_at}</p>
                                            <p className="font-serif text-[#1a1a1a]">₹{order.total_price}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
}