import axios from "axios";

const DB_URL = "https://dummyjson.com/products";

export const getDataFromDummy = async () => {
  try {
    const data = await axios.get(DB_URL);
    return data;
  } catch (error) {
    return Promise.reject(null);
  }
};
