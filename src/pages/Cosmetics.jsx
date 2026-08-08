import { useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";

export default function Cosmetics() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("women");

  const womenCategories = [
    {
      name: "Deodorants",
      path: "/womens-deodorants",
      image:
        "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Perfumes",
      path: "/womens-perfumes",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Face Wash",
      path: "/womens-face-wash",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Body Wash",
      path: "/womens-body-wash",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Face Creams",
      path: "/womens-face-creams",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Roll-Ons",
      path: "/womens-roll-ons",
      image:
        "https://images.unsplash.com/photo-1595425964071-2c1ec7c3aa7e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Hair Combs",
      path: "/womens-hair-combs",
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Professional Shampoos",
      path: "/professional-shampoos",
      image:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Serums",
      path: "/serums",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Masks",
      path: "/masks",
      image:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Conditioners",
      path: "/conditioners",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Makeup",
      path: "/makeup",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Lakme Products",
      path: "/lakme-products",
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Color Bar Products",
      path: "/color-bar-products",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Toiletries",
      path: "/womens-toiletries",
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const menCategories = [
    {
      name: "Deodorants",
      path: "/mens-deodorants",
      image:
        "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Perfumes",
      path: "/mens-perfumes",
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Face Wash",
      path: "/mens-face-wash",
      image:
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Body Wash",
      path: "/mens-body-wash",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Shaving Creams",
      path: "/mens-shaving-creams",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Blades",
      path: "/mens-blades",
      image:
        "https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Razors",
      path: "/mens-razors",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Face Creams",
      path: "/mens-face-creams",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Roll-Ons",
      path: "/mens-roll-ons",
      image:
        "https://images.unsplash.com/photo-1595425964071-2c1ec7c3aa7e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Hair Combs",
      path: "/mens-hair-combs",
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Toiletries",
      path: "/mens-toiletries",
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const kidsCategories = [
    {
      name: "Baby Face Creams",
      path: "/baby-face-creams",
      image:
        "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Baby Shampoos",
      path: "/baby-shampoos",
      image:
        "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Baby Soaps",
      path: "/baby-soaps",
      image:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Toiletries",
      path: "/kids-toiletries",
      image:
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const selectedCategories =
    activeTab === "women"
      ? womenCategories
      : activeTab === "men"
      ? menCategories
      : kidsCategories;

  const filteredCategories = selectedCategories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fff7ed] min-h-screen">

      {/* NAVBAR */}

      <Navbar variant="page" />

      {/* HERO */}

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

      {/* SEARCH */}

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

      {/* TAB BUTTONS */}

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

      {/* CATEGORIES */}

      <div className="max-w-7xl mx-auto px-6 py-14">

        <h1 className="text-2xl sm:text-4xl font-black text-center mb-6 sm:mb-10">

          {activeTab === "women"
            ? "Women's Cosmetics"
            : activeTab === "men"
            ? "Men's Cosmetics"
            : "Kids Care"}

        </h1>

        {filteredCategories.length === 0 ? (

          <h2 className="text-center text-3xl font-bold">
            No Categories Found
          </h2>

        ) : (

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">

            {filteredCategories.map((category, index) => (

              <div
                key={index}
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
                    to={`/cosmetics/products/${activeTab}/${encodeURIComponent(category.name)}`}
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