import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { getFrontendSubcategories } from "../api/subcategoryAPI";

const DEFAULT_IMAGES = {
  "T-Shirts":
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200&auto=format&fit=crop",
  Lowers:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  Shorts:
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop",
  Capris:
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  "Night Suits":
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1200&auto=format&fit=crop",
  "New Born Suits":
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
  Nappies:
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
  "Co-Ord Sets":
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=1200&auto=format&fit=crop",
  "Swimming Costumes":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  Caps:
    "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200&auto=format&fit=crop",
  Socks:
    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200&auto=format&fit=crop",
  Handkerchiefs:
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop",
  Umbrellas:
    "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=1200&auto=format&fit=crop",
  Raincoats:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
};

export default function Kids() {
  const [search, setSearch] = useState("");
  const [kidsCategories, setKidsCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKidsCategories = async () => {
      try {
        const response = await getFrontendSubcategories("Kids");

        const data = response.data?.subcategories || [];

        setKidsCategories(
          data.map((subcategory) => ({
            ...subcategory,
            image:
              subcategory.image ||
              DEFAULT_IMAGES[subcategory.name] ||
              DEFAULT_IMAGES["T-Shirts"],
          }))
        );
      } catch (error) {
        console.error(
          "Kids subcategories error:",
          error.response?.data || error.message
        );

        setKidsCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKidsCategories();
  }, []);

  const filteredCategories = kidsCategories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fff7ed] min-h-screen">
      <Navbar variant="page" />

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative rounded-[40px] overflow-hidden h-[500px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1400&auto=format&fit=crop"
            alt="Kids"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-7xl md:text-8xl font-black tracking-[15px]">
              KIDS
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-full border-orange-200 flex items-center px-6 py-4 shadow border">
          <FaSearch className="text-gray-500" />

          <input
            id="searchInput"
            type="text"
            placeholder="Search Categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-4 outline-none"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="text-2xl sm:text-4xl font-black text-center mb-6 sm:mb-10">
          Kids Categories
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            <h2 className="text-2xl font-bold">
              No category found
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-2xl sm:rounded-[35px] border border-orange-100 overflow-hidden shadow-sm hover:shadow-xl transition group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-[130px] sm:h-[280px] w-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="p-2.5 sm:p-6 text-center">
                  <h2 className="text-xs sm:text-2xl font-bold mb-2 sm:mb-5 line-clamp-2">
                    {category.name}
                  </h2>

                  <Link
                    to={`/kids/products/${encodeURIComponent(
                      category.name
                    )}`}
                    className="block w-full bg-[#7c3aed] text-white py-3 rounded-2xl hover:bg-[#1e1b4b] transition"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}