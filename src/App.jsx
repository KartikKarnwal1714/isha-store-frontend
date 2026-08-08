import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import Brands from "./pages/Brands";
import Cart from "./pages/Cart";
import Cosmetics from "./pages/Cosmetics";
import Jewellery from "./pages/Jewellery";
import Wishlist from "./pages/Wishlist";
import Jockey from "./pages/Jockey";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import BrandProducts from "./pages/BrandProducts";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import MenCategoryProducts from "./pages/MenCategoryProducts";
import WomenCategoryProducts from "./pages/WomenCategoryProducts";
import KidsCategoryProducts from "./pages/KidsCategoryProducts";
import CosmeticsCategoryProducts from "./pages/CosmeticsCategoryProducts";
import JewelleryCategoryProducts from "./pages/JewelleryCategoryProducts";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import CompleteProfile from "./pages/CompleteProfile";
import PreviousOrders from "./pages/PreviousOrders";
import CurrentOrder from "./pages/CurrentOrder";
import Addresses from "./pages/Addresses";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />
      <Route path="/kids" element={<Kids />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/cosmetics" element={<Cosmetics />} />
      <Route path="/jewellery" element={<Jewellery />} />

      <Route path="/wishlist" element={<Wishlist />} />

      <Route path="/jockey" element={<Jockey />} />

      <Route path="/login" element={<Login />} />

      <Route path="/search" element={<SearchPage />} />

      <Route
        path="/brand/:brandName"
        element={<BrandProducts />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route path="/my-orders" element={<MyOrders />} />

      <Route
        path="/men/products/:subCategory"
        element={<MenCategoryProducts />}
      />

      <Route
        path="/women/products/:subCategory"
        element={<WomenCategoryProducts />}
      />

      <Route
        path="/kids/products/:subCategory"
        element={<KidsCategoryProducts />}
      />

      <Route
        path="/cosmetics/products/:type/:subCategory"
        element={<CosmeticsCategoryProducts />}
      />

      <Route
        path="/jewellery/products/:subCategory"
        element={<JewelleryCategoryProducts />}
      />

      <Route path="/profile" element={<Profile />} />

      <Route
        path="/current-orders"
        element={<CurrentOrder />}
      />

      <Route path="/help" element={<Help />} />

      <Route
        path="/complete-profile"
        element={<CompleteProfile />}
      />

      <Route
        path="/previous-orders"
        element={<PreviousOrders />}
      />

      <Route
        path="/addresses"
        element={<Addresses />}
      />

      <Route
        path="/checkout"
        element={<Checkout />}
      />

      <Route
        path="/payment"
        element={<Payment />}
      />

      <Route
        path="/payment-success"
        element={<PaymentSuccess />}
      />

      <Route
       path="/payment-failed"
       element={<PaymentFailed />}
      />

    </Routes>
  );
}

export default App;