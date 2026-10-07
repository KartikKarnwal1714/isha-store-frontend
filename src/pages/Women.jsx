import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { getFrontendSubcategories } from "../api/subcategoryAPI";

const DEFAULT_IMAGES = {
  "T-Shirts":
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
  Lowers:
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  "Night Suits":
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1200&auto=format&fit=crop",
  Shorts:
    "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop",
  Capris:
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  "Swimming Costumes":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  "Co-Ord Sets":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
  "UGs (Innerwear)":
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1200&auto=format&fit=crop",
  Jeans:
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
  Jeggings:
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  Palazzos:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
  "Cargo Pants":
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
  "Cotton Pants":
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  "Flare Pants":
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
  "Relax Pants":
    "https://images.unsplash.com/photo-1506629905607-d9d297d9949a?q=80&w=1200&auto=format&fit=crop",
  "Yoga Pants":
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
  "Gym Lowers":
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop",
  "Gym T-Shirts":
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  Socks:
    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200&auto=format&fit=crop",
  Handkerchiefs:
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1200&auto=format&fit=crop",
  Umbrellas:
    "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?q=80&w=1200&auto=format&fit=crop",
  Raincoats:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
};

export default function Women() {
  const [search, setSearch] = useState("");
  const [womenCategories, setWomenCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWomenCategories = async () => {
      try {
        const response = await getFrontendSubcategories("Women");

        const data = response.data?.subcategories || [];

        setWomenCategories(
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
          "Women subcategories error:",
          error.response?.data || error.message
        );

        setWomenCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenCategories();
  }, []);

  const filteredCategories = womenCategories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fff7ed] min-h-screen">
      <Navbar variant="page" />

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative rounded-[40px] overflow-hidden h-[500px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop"
            alt="Women"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-[15px]">
              WOMEN
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
          Women Categories
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
                    to={`/women/products/${encodeURIComponent(
                      category.name
                    )}`}
                    className="block bg-[#7c3aed] text-white text-center text-[10px] sm:text-base py-1.5 sm:py-4 rounded-lg sm:rounded-2xl font-bold"
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