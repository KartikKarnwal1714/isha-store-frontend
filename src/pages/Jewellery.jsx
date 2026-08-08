import { useState } from "react";

import { Link } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Navbar from "../components/Navbar";

export default function Jewellery() {
  const [search, setSearch] = useState("");

  const jewelleryCategories = [
    {
      name: "Earrings",
      path: "/jewellery-earrings",
      image:
        "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Necklaces",
      path: "/jewellery-necklaces",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Chains",
      path: "/jewellery-chains",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Bangles",
      path: "/jewellery-bangles",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Bracelets",
      path: "/jewellery-bracelets",
      image:
        "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Rings",
      path: "/jewellery-rings",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Anklets",
      path: "/jewellery-anklets",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Hair Accessories",
      path: "/jewellery-hair-accessories",
      image:
        "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const filteredCategories = jewelleryCategories.filter((category) =>
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

      {/* SEARCH */}

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

      {/* CATEGORIES */}

      <div className="max-w-7xl mx-auto px-6 py-14">

        <h1 className="text-2xl sm:text-4xl font-black text-center mb-6 sm:mb-10">
          Jewellery Categories
        </h1>

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
                 to={`/jewellery/products/${encodeURIComponent(category.name)}`}
                  className="block w-full bg-[#7c3aed] text-white py-3 rounded-2xl hover:bg-[#7c3aed] transition"
                >
                  View Products
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}