import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2 } from "lucide-react";
import placeOrder from "../pages/Checkout";
import { useNavigate } from "react-router-dom";

export default function Cart() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    const fetchCart = () => {

        API.get("cart/")
            .then(res => {
                setCartItems(res.data);
            })
            .catch(err => {
                console.log(err);
            });

    };

    useEffect(() => {
        fetchCart();
    }, []);

    // Inside Cart.js
    const handleCheckout = () => {
        API.post("orders/checkout/")  // make sure the endpoint matches your backend
            .then(res => {
                alert("Order placed successfully!");
                fetchCart();  // optionally refresh cart
            })
            .catch(err => {
                console.error(err);
                alert("Error placing order");
            });
    };


    const removeItem = (id) => {

        API.delete(`cart/delete/${id}/`)
            .then(() => {
                fetchCart();
            })
            .catch(err => console.log(err));

    };



    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.product_price * item.quantity;
    }, 0);



    return (

        <Layout>

            <div className="max-w-6xl mx-auto px-6 py-20">

                <h1 className="text-4xl font-semibold mb-12 text-center">
                    Your Cart
                </h1>


                {cartItems.length === 0 ? (

                    <p className="text-center text-gray-500">
                        Your cart is empty
                    </p>

                ) : (

                    <div className="space-y-6">

                        {cartItems.map(item => (

                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white shadow-md rounded-xl p-6"
                            >

                                <div className="flex items-center gap-6">

                                    <img
                                        src={item.product_image}
                                        className="h-24 w-24 object-cover rounded-lg"
                                    />

                                    <div>

                                        <h2 className="text-lg font-semibold">
                                            {item.product_name}
                                        </h2>

                                        <p className="text-gray-500">
                                            ₹{item.product_price}
                                        </p>

                                        <p className="text-sm text-gray-400">
                                            Qty: {item.quantity}
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={20} />
                                </button>

                            </div>

                        ))}


                        <div className="flex justify-between items-center mt-10 border-t pt-6">

                            <h2 className="text-2xl font-semibold">
                                Total: ₹{totalPrice}
                            </h2>

                           <button
onClick={() => navigate("/checkout")}
className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
>
Checkout
</button>

                        </div>

                    </div>

                )}

            </div>

        </Layout>

    );
}