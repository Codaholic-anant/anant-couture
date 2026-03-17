import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

export default function Checkout() {

const [cartItems, setCartItems] = useState([]);

const [address, setAddress] = useState({
full_name: "",
phone: "",
address: "",
city: "",
state: "",
pincode: ""
});

useEffect(() => {

API.get("cart/")
.then(res => setCartItems(res.data))
.catch(err => console.log(err));

}, []);

const totalPrice = cartItems.reduce((total, item) => {
return total + item.product_price * item.quantity;
}, 0);

const handleChange = (e) => {

setAddress({
...address,
[e.target.name]: e.target.value
});

};

const checkout = () => {

API.post("orders/checkout/", address)
.then(res => {

const data = res.data;

const options = {

key: "rzp_test_SRQyFTwNocmDdq",

amount: data.amount * 100,

currency: "INR",

name: "Fashion Store",

description: "Order Payment",

order_id: data.razorpay_order_id,

handler: function (response) {

API.post("orders/verify-payment/", {

razorpay_order_id: response.razorpay_order_id,
razorpay_payment_id: response.razorpay_payment_id,
razorpay_signature: response.razorpay_signature

})
.then(() => {

alert("Payment Successful 🎉");

window.location.href = "/orders";

})
.catch(err => console.log(err));

},

prefill: {

name: address.full_name,
contact: address.phone

},

theme: {
color: "#000"
}

};

const rzp = new window.Razorpay(options);

rzp.open();

})
.catch(err => console.log(err));

};

return (

<Layout>

<div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-2 gap-10">

{/* Shipping Address */}

<div>

<h2 className="text-2xl font-semibold mb-6">
Shipping Address
</h2>

<input
name="full_name"
placeholder="Full Name"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

<input
name="phone"
placeholder="Phone"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

<input
name="address"
placeholder="Address"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

<input
name="city"
placeholder="City"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

<input
name="state"
placeholder="State"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

<input
name="pincode"
placeholder="Pincode"
onChange={handleChange}
className="border p-3 w-full mb-4"
/>

</div>

{/* Order Summary */}

<div>

<h2 className="text-2xl font-semibold mb-6">
Order Summary
</h2>

{cartItems.map(item => (

<div key={item.id} className="flex justify-between mb-3">

<span>
{item.product_name} x {item.quantity}
</span>

<span>
₹{item.product_price * item.quantity}
</span>

</div>

))}

<hr className="my-4"/>

<h3 className="text-xl font-bold">
Total: ₹{totalPrice}
</h3>

<button
onClick={checkout}
className="bg-black text-white px-8 py-3 rounded-full mt-6 w-full hover:bg-gray-800"
>
Proceed to Payment
</button>

</div>

</div>

</Layout>

);

}