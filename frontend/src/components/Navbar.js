import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Navbar() {

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {

        API.get("cart/")
            .then(res => {
                const total = res.data.reduce((sum, item) => sum + item.quantity, 0)
                setCartCount(total)
            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    return (

        <nav className="bg-white shadow-sm border-b">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-semibold tracking-wide">
                    ANANT COUTURE
                </h1>

                <div className="flex items-center gap-8 text-gray-700">

                    <Link to="/home" className="hover:text-black">
                        Home
                    </Link>

                    <Link to="/shop" className="hover:text-black">
                        Shop
                    </Link>

                    <Link to="/orders" className="hover:text-black">
                        Orders
                    </Link>

                    <Link to="/cart" className="flex items-center gap-2 hover:text-black">
                        <ShoppingCart size={18} />
                        Cart ({cartCount})
                    </Link>

                    <Link to="/profile" className="flex items-center gap-1 hover:text-black">
                        <User size={18} />
                        Profile
                    </Link>

                </div>

            </div>

        </nav>

    )

}