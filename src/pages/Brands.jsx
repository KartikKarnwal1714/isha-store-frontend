import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import { API_URL } from "../utils/apiUrl";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${API_URL}/brands`);
        const data = await res.json();

        setBrands(data.brands || []);
      } catch (error) {
        console.log("Brand Fetch Error:", error);
      }
    };

    fetchBrands();
  }, []);

  const sliderBrands = brands.filter((brand) => brand.bannerImage);

  useEffect(() => {
    if (sliderBrands.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderBrands.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderBrands.length]);

  const selectedBanner = sliderBrands[currentIndex];

  return (
    <div className="min-h-screen bg-[#fff7ed]">
      {/* NAVBAR */}

      <Navbar variant="page" />

      {/* HERO SECTION */}

      {selectedBanner ? (
        <section className="relative h-[500px] overflow-hidden rounded-b-[50px]">
          <img
            src={selectedBanner.bannerImage}
            alt={selectedBanner.name}
            className="w-full h-full object-cover duration-700 transition-all"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12">
            <p className="text-white uppercase tracking-[4px]">
              Premium Brand Collection
            </p>

            <h1
              className="text-6xl font-black mt-4"
              style={{
                color: selectedBanner.nameColor || "#ffffff",
              }}
            >
              {selectedBanner.name}
            </h1>

            <p className="text-gray-200 mt-5 max-w-xl">
              {selectedBanner.tagline ||
                `Discover premium collections and trending products from ${selectedBanner.name}`}
            </p>

            <Link
              to={`/brand/${selectedBanner.name}`}
              className="mt-8 bg-white text-[#1f2937] px-8 py-4 rounded-full w-[180px] font-semibold hover:bg-[#7c3aed] hover:text-white transition text-center"
            >
              Explore
            </Link>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {sliderBrands.map((brand, index) => (
              <button
                key={brand._id}
                onClick={() => setCurrentIndex(index)}
                className={`rounded-full transition-all ${
                  currentIndex === index
                    ? "w-8 h-3 bg-white"
                    : "w-3 h-3 bg-orange-200"
                }`}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="h-[180px] sm:h-[350px] bg-[#7c3aed] text-white flex items-center justify-center rounded-b-[30px] sm:rounded-b-[50px] px-4 text-center">
          <h1 className="text-2xl sm:text-5xl font-black">
            Brand Collection
          </h1>
        </section>
      )}

      {/* TOP BRANDS */}

      <section className="px-4 sm:px-8 py-8 sm:py-14">
        <h2 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-8">
          Top Brands
        </h2>

        {brands.length === 0 ? (
          <p className="text-gray-500">
            No brands added yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/brand/${brand.name}`}
                className="bg-white rounded-2xl sm:rounded-3xl py-3.5 sm:py-6 text-sm sm:text-base font-semibold text-center shadow hover:bg-[#7c3aed] hover:text-white transition"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BRAND IMAGE CARDS */}

      <section className="px-4 sm:px-8 pb-10 sm:pb-20">
        <div className="mb-5 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-black">
            Trending Brand Collections
          </h2>

          <p className="text-gray-500 mt-1.5 sm:mt-3 text-sm sm:text-base">
            Discover premium fashion, cosmetics and lifestyle brands
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              to={`/brand/${brand.name}`}
              className="bg-white rounded-2xl sm:rounded-[35px] border border-orange-100 overflow-hidden shadow-md hover:shadow-2xl transition duration-500 group"
            >
              <div className="relative h-[130px] sm:h-[350px] overflow-hidden">
                <img
                  src={brand.brandImage}
                  alt={brand.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 sm:p-5">
                  <h3
                    className="text-base sm:text-4xl font-black text-center"
                    style={{
                      color: brand.nameColor || "#ffffff",
                    }}
                  >
                    {brand.name}
                  </h3>
                </div>
              </div>

              <div className="p-2.5 sm:p-6">
                <h3 className="text-xs sm:text-2xl font-bold line-clamp-1">
                  {brand.name}
                </h3>

                <p className="text-gray-500 text-[10px] sm:text-base mt-1 sm:mt-2 line-clamp-1">
                  {brand.tagline || "Premium Collection"}
                </p>

                <button className="mt-2 sm:mt-5 bg-[#7c3aed] text-white text-[10px] sm:text-base px-3 py-1.5 sm:px-6 sm:py-3 rounded-full w-full sm:w-auto">
                  View Products
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER */}

      <footer className="bg-[#7c3aed] text-white px-4 sm:px-8 py-8 sm:py-14 rounded-t-[30px] sm:rounded-t-[50px]">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h2 className="text-3xl font-black tracking-[6px]">
              ISHA STORE
            </h2>

            <p className="text-gray-400 mt-5 leading-8">
              Explore premium fashion brands, beauty essentials and trending
              products.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5">
              Categories
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>Fashion</p>
              <p>Beauty</p>
              <p>Sports</p>
              <p>Lifestyle</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5">
              Support
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>Help Center</p>
              <p>Shipping</p>
              <p>Returns</p>
              <p>Contact</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5">
              Newsletter
            </h3>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full px-5 py-4 rounded-2xl text-[#1f2937]"
            />

            <button className="w-full bg-white text-[#1f2937] py-4 rounded-2xl mt-5 font-semibold">
              Subscribe
            </button>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-10 pt-5 text-center text-gray-400">
          © 2026 ISHA STORE. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}