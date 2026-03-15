import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductDetail() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    useEffect(() => {

        API.get(`products/${id}/`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(err => console.log(err));

    }, [id]);



    const addToCart = () => {

        const token = localStorage.getItem("access");

        if (!token) {
            alert("Please login first");
            return;
        }

        API.post("cart/", {
            product_id: product.id,
            quantity: 1
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(res => {
                alert("Product added to cart");
            })
            .catch(err => {
                console.log(err);
                alert("Error adding to cart");
            });

    };



    if (!product) return <h2 className="text-center mt-20">Loading...</h2>;



    return (

        <Layout>

            <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

                <img
                    src={product.image}
                    className="rounded-xl shadow-lg w-full"
                />

                <div>

                    <h1 className="text-4xl font-semibold mb-6">
                        {product.name}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        {product.description}
                    </p>

                    <h2 className="text-2xl font-bold mb-6">
                        ₹{product.price}
                    </h2>

                    <button
                        onClick={addToCart}
                        className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </Layout>
    );
}