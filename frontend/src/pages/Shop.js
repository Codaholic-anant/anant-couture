import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.get(`products/?search=${search}&category=${category}`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [search, category]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-3xl font-semibold mb-8">Shop Collection</h2>

                <div className="flex flex-col md:flex-row gap-4 justify-between mb-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded-lg w-full md:w-72"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border px-4 py-2 rounded-lg w-full md:w-48"
                    >
                        <option value="">All Categories</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kids">Kids</option>
                    </select>
                </div>

                {loading ? (
                    <div className="grid grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-gray-400 py-20">No products found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}