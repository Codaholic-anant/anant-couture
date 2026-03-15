import axios from "./api";

export const registerUser = async (data) => {
  const response = await axios.post("users/register/", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post("/login/", data);

  localStorage.setItem("token", response.data.access);

  return response.data;
};