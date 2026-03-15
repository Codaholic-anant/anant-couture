import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function QuickView({ product, close }) {
    const navigate = useNavigate();

    if (!product) return null;

    // Place order function
    const addToCart = () => {
        API.post("cart/", {
            product: product.id,
            quantity: 1
        })
            .then(() => {
                alert("Added to cart");
            })
            .catch(err => console.log(err));

    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-[500px] relative">

                <button
                    onClick={close}
                    className="absolute right-4 top-2 text-xl"
                >
                    ✕
                </button>

                <img
                    src={product.image}
                    className="h-64 w-full object-contain rounded-lg mb-4"
                />

                <h2 className="text-2xl font-semibold">{product.name}</h2>

                <p className="text-gray-500 mt-2">{product.description}</p>

                <p className="text-xl font-bold mt-4">₹{product.price}</p>

                <button
                    onClick={addToCart}
                    className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                >
                    Add to Cart
                </button>


            </div>
        </div>
    );
}