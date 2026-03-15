import API from "./api";

export const addToCart = async (productId) => {
  return await API.post("/cart/", {
    product: productId,
    quantity: 1
  });
};