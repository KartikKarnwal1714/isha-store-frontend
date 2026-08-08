import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaHome,
  FaArrowLeft,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";

import { useCart } from "../CartContext";
import { useWishlist } from "../WishlistContext";

const NAV_CATEGORIES = [
  "men",
  "women",
  "kids",
  "brands",
  "cosmetics",
  "jewellery",
];

/**
 * Shared site navbar used on every page.
 *
 * variant="home"  -> fixed, translucent bar with category links (used on the homepage hero)
 * variant="page"  -> sticky bar with back/home/forward controls (used on all other pages)
 *
 * The search / wishlist / profile / cart buttons behave identically everywhere:
 *  - Search always goes to the /search page.
 *  - Wishlist always links to /wishlist with a live count badge.
 *  - Profile opens the "My Account" sidebar if the customer is logged in,
 *    otherwise sends them to /login (same rule on every page).
 *  - Cart always links to /cart with a live count badge.
 *
 * On small / mobile screens the category links, wishlist and profile
 * collapse into a single hamburger drawer so the header never overflows.
 * The store name always stays perfectly centered on mobile.
 */
export default function Navbar({ variant = "page" }) {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isLoggedIn = () => {
    const customerToken = localStorage.getItem("customerToken");
    const customer = localStorage.getItem("customer");
    return Boolean(customerToken || customer);
  };

  const handleProfileClick = () => {
    setShowMobileMenu(false);

    if (isLoggedIn()) {
      setShowSidebar(true);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("customerToken");
    setShowSidebar(false);
    setShowMobileMenu(false);
    navigate("/login");
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  const iconButtonClasses =
    "relative w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-orange-200 flex items-center justify-center hover:bg-[#7c3aed] hover:text-white transition shrink-0";

  const badgeClasses =
    "absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center";

  return (
    <>
      <nav
        className={
          variant === "home"
            ? "fixed top-0 left-0 w-full flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 sm:py-5 border-b border-orange-200 bg-[#fff7ed]/95 backdrop-blur-xl z-[1000] shadow-md"
            : "bg-[#fff7ed]/95 backdrop-blur-xl sticky top-0 z-50 border-b border-orange-200 shadow-sm"
        }
      >
        <div
          className={
            variant === "home"
              ? "w-full flex items-center justify-between gap-2"
              : "max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2"
          }
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger — mobile / tablet only */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-orange-200 flex items-center justify-center hover:bg-[#7c3aed] hover:text-white transition shrink-0"
            >
              <FaBars size={15} />
            </button>

            {/* Back / Home / Forward — desktop only, "page" variant */}
            {variant !== "home" && (
              <div className="hidden lg:flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center hover:bg-[#7c3aed] hover:text-white transition"
                >
                  <FaArrowLeft size={14} />
                </button>

                <Link
                  to="/"
                  className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center hover:bg-[#7c3aed] hover:text-white transition"
                >
                  <FaHome size={15} />
                </Link>

                <button
                  onClick={() => navigate(1)}
                  className="w-10 h-10 rounded-full border border-orange-200 flex items-center justify-center hover:bg-[#7c3aed] hover:text-white transition"
                >
                  <FaArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* CENTER — store name always centered on mobile */}
          <Link
            to="/"
            className="flex-1 lg:flex-none text-center min-w-0 px-1"
          >
            <h1 className="truncate text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-[2px] sm:tracking-[4px] lg:tracking-[6px] text-[#7c3aed]">
              ISHA STORE
            </h1>
          </Link>

          {/* CATEGORY LINKS — desktop only, "home" variant */}
          {variant === "home" && (
            <div className="hidden lg:flex items-center gap-6 text-base font-bold">
              {NAV_CATEGORIES.map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  className="px-4 py-2 rounded-full hover:bg-[#7c3aed] hover:text-white transition-all duration-300 uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}

          {/* RIGHT SIDE — icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/search")}
              aria-label="Search"
              className={iconButtonClasses}
            >
              <FaSearch size={14} />
            </button>

            {/* Wishlist — hidden on the smallest screens, lives in the menu drawer instead */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={`${iconButtonClasses} hidden sm:flex`}
            >
              <FaHeart size={14} />

              {wishlistItems.length > 0 && (
                <span className={badgeClasses}>
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Profile — hidden below sm, available from the menu drawer instead */}
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Account"
              className={`${iconButtonClasses} hidden sm:flex`}
            >
              <FaUser size={14} />
            </button>

            <Link to="/cart" aria-label="Cart" className={iconButtonClasses}>
              <FaShoppingCart size={14} />

              {cartItems.length > 0 && (
                <span className={badgeClasses}>{cartItems.length}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER — categories + account links */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[2500] lg:hidden"
            onClick={closeMobileMenu}
          />

          <div className="fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white shadow-2xl z-[3000] p-6 overflow-y-auto lg:hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black tracking-[2px] text-[#7c3aed]">
                ISHA STORE
              </h2>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="w-9 h-9 rounded-full border border-orange-200 flex items-center justify-center"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Shop by category
            </p>

            <div className="flex flex-col mb-6">
              {NAV_CATEGORIES.map((item) => (
                <Link
                  key={item}
                  to={`/${item}`}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between py-3 border-b border-orange-100 uppercase font-bold text-sm hover:text-[#7c3aed] transition"
                >
                  {item}
                  <FaChevronRight size={11} className="text-gray-300" />
                </Link>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Your account
            </p>

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={handleProfileClick}
                className="flex items-center gap-3 py-3 border-b border-orange-100 text-sm font-semibold text-left"
              >
                <FaUser size={14} /> My Account
              </button>

              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-3 border-b border-orange-100 text-sm font-semibold"
              >
                <FaHeart size={14} /> Wishlist
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-3 border-b border-orange-100 text-sm font-semibold"
              >
                <FaShoppingCart size={14} /> Cart
                {cartItems.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/help"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 py-3 border-b border-orange-100 text-sm font-semibold"
              >
                Help
              </Link>
            </div>
          </div>
        </>
      )}

      {/* ACCOUNT SIDEBAR — opened via the profile icon / drawer link */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[2000]"
            onClick={() => setShowSidebar(false)}
          />

          <div className="fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-[3000] p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#7c3aed]">
                My Account
              </h2>

              <button
                type="button"
                onClick={() => setShowSidebar(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                to="/profile"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                Profile
              </Link>

              <Link
                to="/addresses"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                My Addresses
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                Wishlist
              </Link>

              <Link
                to="/cart"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                My Cart
              </Link>

              <Link
                to="/previous-orders"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                Previous Orders
              </Link>

              <Link
                to="/current-orders"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                Current Orders
              </Link>

              <Link
                to="/help"
                onClick={() => setShowSidebar(false)}
                className="border-b pb-3 text-lg"
              >
                Help
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-red-500 text-white py-3 rounded-lg mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
