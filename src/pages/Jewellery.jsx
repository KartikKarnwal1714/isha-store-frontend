import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { getFrontendSubcategories } from "../api/subcategoryAPI";

const DEFAULT_IMAGES = {
  Earrings:
    "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop",
  Necklaces:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
  Chains:
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
  Bangles:
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  Bracelets:
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop",
  Rings:
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
  Anklets:
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
  "Hair Accessories":
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
};

export default function Jewellery() {
  const [search, setSearch] = useState("");
  const [jewelleryCategories, setJewelleryCategories] =
    useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJewelleryCategories = async () => {
      try {
        const response =
          await getFrontendSubcategories("Jewellery");

        const data =
          response.data?.subcategories || [];

        setJewelleryCategories(
          data.map((subcategory) => ({
            ...subcategory,
            image:
              subcategory.image ||
              DEFAULT_IMAGES[subcategory.name] ||
              DEFAULT_IMAGES["Earrings"],
          }))
        );
      } catch (error) {
        console.error(
          "Jewellery subcategories error:",
          error.response?.data || error.message
        );

        setJewelleryCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJewelleryCategories();
  }, []);

  const filteredCategories =
    jewelleryCategories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="bg-[#fff7ed] min-h-screen">
      <Navbar variant="page" />

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative rounded-[40px] overflow-hidden h-[500px] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop"
            alt="Jewellery"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-[12px]">
              JEWELLERY
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-full border-orange-200 flex items-center px-6 py-4 shadow border border-[#7c3aed]/30">
          <FaSearch className="text-[#7c3aed]" />

          <input
            id="jewellerySearch"
            type="text"
            placeholder="Search jewellery categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none px-4 bg-transparent"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="text-2xl sm:text-4xl font-black text-center mb-6 sm:mb-10">
          Jewellery Categories
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold">
              No Categories Found
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
                    to={`/jewellery/products/${encodeURIComponent(
                      category.name
                    )}`}
                    className="block w-full bg-[#7c3aed] text-white py-3 rounded-2xl hover:bg-[#7c3aed] transition"
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