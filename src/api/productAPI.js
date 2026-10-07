import api from "./client";

export const getProducts = (params = {}) => {
  return api.get("/products", {
    params,
  });
};

export const getSingleProduct = (id) => {
  return api.get(`/products/${id}`);
};

export const trackProductSearch = (query) => {
  return api.post("/products/track-search", {
    query,
  });
};