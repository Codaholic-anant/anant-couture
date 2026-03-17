import { useState } from "react";
import QuickView from "./QuickView";
import API from "../services/api";

export default function ProductCard({ product }) {

const [show, setShow] = useState(false);

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

<div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">

<div className="h-60 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
  <img 
    src={product.image} 
    alt={product.name} 
    className="h-64 w-full object-cover"
    onError={(e) => { e.target.src = "https://placehold.co/300x300?text=No+Image" }}
/>
</div>

<div className="mt-4 flex flex-col flex-grow">

<h2 className="text-lg font-semibold">
{product.name}
</h2>

<p className="text-gray-500 text-sm">
{product.category?.name}
</p>

<p className="text-xl font-bold mt-3">
₹{product.price}
</p>

<div className="mt-auto flex gap-2 pt-4">

<button
onClick={addToCart}
className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
>
Add to Cart
</button>

<button
onClick={() => setShow(true)}
className="flex-1 border border-black py-2 rounded-lg hover:bg-gray-100"
>
Quick View
</button>

</div>

</div>

{show && (
<QuickView product={product} close={() => setShow(false)} />
)}

</div>

);
}