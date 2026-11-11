
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export const predictCrop = async (inputData) => {
  const response = await API.post("/predict", inputData);
  return response.data;
};

export const getFeatureImportance = async () => {
  const response = await API.get("/feature-importance");
  return response.data;
};

export const checkAPIHealth = async () => {
  const response = await API.get("/health");
  return response.data;
};

export default API;
