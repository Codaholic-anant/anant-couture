import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Orders() {

const [orders,setOrders] = useState([]);

useEffect(()=>{

fetchOrders()

},[])

const fetchOrders = ()=>{

API.get("orders/my-orders/")
.then(res=>setOrders(res.data))
.catch(err=>console.log(err))

}

const cancelOrder = (id) => {

API.post(`orders/cancel/${id}/`)
.then((res)=>{

alert(res.data.message)
fetchOrders()

})
.catch((err)=>{

alert(err.response?.data?.error || "Cannot cancel order")

})

}

const getStep = (status)=>{

switch(status){

case "pending": return 1
case "confirm": return 2
case "tailoring": return 3
case "shipped": return 4
case "delivered": return 5
default: return 0

}

}

return(

<Layout>

<div className="max-w-6xl mx-auto py-20">

<h1 className="text-3xl font-bold mb-10">
My Orders
</h1>

{orders.map(order=>(

<div key={order.id} className="border rounded-xl p-6 mb-10">

{/* ORDER HEADER */}

<div className="flex justify-between mb-6">

<div>

<h2 className="font-bold text-lg">
Order #{order.id}
</h2>

<p className="text-gray-500">
Total ₹{order.total_price}
</p>

</div>

<div>

<span className="px-3 py-1 bg-gray-100 rounded-full">
{order.status}
</span>

</div>

</div>

{/* TRACKING TIMELINE */}

<div className="flex justify-between mb-8 text-sm">

{["Placed","Confirmed","Tailoring","Shipped","Delivered"].map((step,i)=>(

<div key={i} className="flex flex-col items-center w-full">

<div className={`w-6 h-6 rounded-full 
${getStep(order.status) > i ? "bg-green-500" : "bg-gray-300"}`}>
</div>

<p className="mt-2">{step}</p>

</div>

))}

</div>

{/* PRODUCTS */}

{order.items.map((item,index)=>(

<div key={index} className="flex items-center gap-4 border-t pt-4 mb-4">

<img
src={item.image}
alt=""
className="w-20 h-20 object-contain"
/>

<div>

<p className="font-semibold">
{item.product_name}
</p>

<p className="text-gray-500">
Qty: {item.quantity}
</p>

</div>

<p className="ml-auto font-semibold">
₹{item.price}
</p>

</div>

))}

{/* CANCEL BUTTON */}

{order.status !== "cancelled" &&
order.status !== "Tailored" &&
order.status !== "shipped" && (

<button
onClick={()=>cancelOrder(order.id)}
className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg"
>
Cancel Order
</button>

)}

</div>

))}

</div>

</Layout>

)

}