import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Shop(){

const [products,setProducts] = useState([]);
const [search,setSearch] = useState("")
const [category,setCategory] = useState("")

useEffect(()=>{

API.get(`products/?search=${search}&category=${category}`)
.then(res=>{
setProducts(res.data)
})

},[search,category])

// const fetchProducts = async ()=>{

// try{

// const res = await API.get("products/");
// setProducts(res.data);

// }catch(err){
// console.log(err);
// }

// };

return(

<Layout>

<h2 className="text-3xl font-semibold mb-8">
Shop Collection
</h2>

<div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-4 justify-between">

<input
type="text"
placeholder="Search products..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border px-4 py-2 rounded-lg w-full md:w-72"
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
className="border px-4 py-2 rounded-lg w-full md:w-48"
>

<option value="">All Categories</option>
<option value="men">Men</option>
<option value="women">Women</option>
<option value="kids">Kids</option>

</select>

</div>

<div className="grid grid-cols-4 gap-8">

{products.map(product => (

<ProductCard key={product.id} product={product}/>

))}

</div>

</Layout>

)

}