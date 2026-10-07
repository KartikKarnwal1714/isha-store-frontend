import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";
import { getFrontendSubcategories } from "../api/subcategoryAPI";

const DEFAULT_IMAGES = {
  Deodorants:
    "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop",
  Perfumes:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
  "Face Wash":
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
  "Body Wash":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
  "Shaving Creams":
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
  Blades:
    "https://images.unsplash.com/photo-1532710093739-9470acff8783?q=80&w=1200&auto=format&fit=crop",
  Razors:
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
  "Face Creams":
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
  "Roll-Ons":
    "https://images.unsplash.com/photo-1595425964071-2c1ec7c3aa7e?q=80&w=1200&auto=format&fit=crop",
  "Hair Combs":
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
  "Professional Shampoos":
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
  "Hair Color":
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
  Serums:
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
  Masks:
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1200&auto=format&fit=crop",
  Conditioners:
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
  Makeup:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
  "Lakme Products":
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop",
  "Color Bar Products":
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
  Toiletries:
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
  "Baby Face Creams":
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
  "Baby Shampoos":
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
  "Baby Soaps":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
};

export default function Cosmetics() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("women");

  const [categories, setCategories] = useState({
    women: [],
    men: [],
    kids: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCosmeticCategories = async () => {
      try {
        const [womenResponse, menResponse, kidsResponse] =
          await Promise.all([
            getFrontendSubcategories("Womens-Cosmetics"),
            getFrontendSubcategories("Mens-Cosmetics"),
            getFrontendSubcategories("Kids-Cosmetics"),
          ]);

        const prepareCategories = (response) => {
          const data =
            response.data?.subcategories || [];

          return data.map((subcategory) => ({
            ...subcategory,
            image:
              subcategory.image ||
              DEFAULT_IMAGES[subcategory.name] ||
              DEFAULT_IMAGES["Toiletries"],
          }));
        };

        setCategories({
          women: prepareCategories(womenResponse),
          men: prepareCategories(menResponse),
          kids: prepareCategories(kidsResponse),
        });
      } catch (error) {
        console.error(
          "Cosmetics subcategories error:",
          error.response?.data || error.message
        );

        setCategories({
          women: [],
          men: [],
          kids: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCosmeticCategories();
  }, []);

  const selectedCategories =
    activeTab === "women"
      ? categories.women
      : activeTab === "men"
      ? categories.men
      : categories.kids;

  const filteredCategories = selectedCategories.filter(
    (category) =>
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
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1400&auto=format&fit=crop"
            alt="Cosmetics"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-white text-6xl md:text-8xl font-black tracking-[12px]">
              COSMETICS
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

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-5">
          <button
            onClick={() => {
              setActiveTab("women");
              setSearch("");
            }}
            className={`py-2 sm:py-4 px-1 rounded-xl sm:rounded-2xl text-[11px] sm:text-base font-bold transition ${
              activeTab === "women"
                ? "bg-[#7c3aed] text-white"
                : "bg-white text-[#1f2937] border hover:bg-[#fff7ed]"
            }`}
          >
            Women's Cosmetics
          </button>

          <button
            onClick={() => {
              setActiveTab("men");
              setSearch("");
            }}
            className={`py-2 sm:py-4 px-1 rounded-xl sm:rounded-2xl text-[11px] sm:text-base font-bold transition ${
              activeTab === "men"
                ? "bg-[#7c3aed] text-white"
                : "bg-white text-[#1f2937] border hover:bg-[#fff7ed]"
            }`}
          >
            Men's Cosmetics
          </button>

          <button
            onClick={() => {
              setActiveTab("kids");
              setSearch("");
            }}
            className={`py-2 sm:py-4 px-1 rounded-xl sm:rounded-2xl text-[11px] sm:text-base font-bold transition ${
              activeTab === "kids"
                ? "bg-[#7c3aed] text-white"
                : "bg-white text-[#1f2937] border hover:bg-[#fff7ed]"
            }`}
          >
            Kids Care
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="text-2xl sm:text-4xl font-black text-center mb-6 sm:mb-10">
          {activeTab === "women"
            ? "Women's Cosmetics"
            : activeTab === "men"
            ? "Men's Cosmetics"
            : "Kids Care"}
        </h1>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">
              Loading categories...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <h2 className="text-center text-3xl font-bold">
            No Categories Found
          </h2>
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
                    to={`/cosmetics/products/${activeTab}/${encodeURIComponent(
                      category.name
                    )}`}
                    className="block w-full bg-[#7c3aed] text-white text-[10px] sm:text-base py-1.5 sm:py-3 rounded-lg sm:rounded-2xl hover:bg-[#1e1b4b] transition"
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