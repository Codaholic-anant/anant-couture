import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Navbar() {
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("access");
    const isLoggedIn = !!token;

    useEffect(() => {
        if (!isLoggedIn) return;
        API.get("cart/")
            .then(res => {
                const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(total);
            })
            .catch(() => {});
    }, [isLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <Link to="/">
                    <h1 className="text-2xl font-semibold tracking-wide">
                        ANANT COUTURE
                    </h1>
                </Link>

                <div className="flex items-center gap-8 text-gray-700">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <Link to="/shop" className="hover:text-black">Shop</Link>

                    {isLoggedIn && (
                        <Link to="/orders" className="hover:text-black">Orders</Link>
                    )}

                    {isLoggedIn && (
                        <Link to="/cart" className="flex items-center gap-2 hover:text-black">
                            <ShoppingCart size={18} />
                            Cart ({cartCount})
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="flex items-center gap-1 hover:text-black">
                                <User size={18} />
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="hover:text-black text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 hover:text-black">
                            <User size={18} />
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}