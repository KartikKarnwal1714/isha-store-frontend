import api from "./client";

export const getFrontendSubcategories = (category) => {
  return api.get("/subcategories/frontend", {
    params: { category },
  });
};