import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth } from "../services/authService"; // ✅ IMPORT THIS

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import ShopLayout from "../layouts/ShopLayout";
import AdminLayout from "../layouts/AdminLayout";

// ================= PUBLIC =================
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Categories from "../components/Categories";
import PublicOffersList from "../components/PublicOffersList";
import PublicOfferDetails from "../components/PublicOfferDetails";

// ================= AUTH =================
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPasswordRequest from "../pages/ForgotPasswordRequest";
import ForgotPassword from "../pages/ForgotPassword";

// ================= CUSTOMER =================
import CustomerDashboard from "../pages/customer/Dashboard";
import CustomerCategories from "../pages/customer/Categories";
import CustomerOffers from "../pages/customer/Offers";
import CustomerOfferDetails from "../pages/customer/OfferDetails";
import SavedOffers from "../pages/customer/SavedOffers";
import Notifications from "../pages/customer/Notifications";
import Profile from "../pages/customer/Profile";
import Settings from "../pages/customer/Settings";
import EditProfile from "../pages/customer/EditProfile";
import Shops from "../pages/customer/Shops";
import CustomerShopDetails from "../pages/customer/ShopDetails";
import CustomerFeedback from "../pages/customer/Feedback";

// ================= SHOP =================
import ShopDashboard from "../pages/shop/Dashboard";
import CreateShop from "../pages/shop/CreateShop";
import ShopAddOffer from "../pages/shop/AddOffer";
import MyOffers from "../pages/shop/MyOffers";
import ShopOfferDetails from "../pages/shop/ShopOfferDetails";
import ShopEditOffer from "../pages/shop/ShopEditOffer";
import Analytics from "../pages/shop/Analytics";
import ShopProfile from "../pages/shop/Profile";
import ShopSettings from "../pages/shop/Settings";
import ShopNotifications from "../pages/shop/ShopNotifications";
import ShopRatings from "../pages/shop/Ratings";

// ================= ADMIN =================
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import UserDetails from "../pages/admin/UserDetails";
import EditUser from "../pages/admin/EditUser";
import AdminShops from "../pages/admin/Shops";
import AddShop from "../pages/admin/AddShop";
import EditShop from "../pages/admin/EditShop";
import ShopDetails from "../pages/admin/ShopDetails";
import AdminOffers from "../pages/admin/Offers";
import AdminAddOffer from "../pages/admin/AddOffer";
import EditOffer from "../pages/admin/EditOffer";
import AdminOfferDetails from "../pages/admin/OfferDetails";
import AdminCategories from "../pages/admin/Categories";
import AddCategory from "../pages/admin/AddCategory";
import EditCategory from "../pages/admin/EditCategory";
import CategoryDetails from "../pages/admin/CategoryDetails";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";
import AdminSendNotification from "../pages/admin/AdminSendNotification";
import AdminFeedback from "../pages/admin/Feedback";

// ===============================
// CENTRAL AUTH GUARD COMPONENT
// ===============================
const RequireAuth = ({ allowedRoles, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // ✅ Browser automatically sends the HttpOnly cookie with this request
        const response = await checkAuth();
        const fetchedUser = response.user;

        if (allowedRoles.includes(fetchedUser.role)) {
          setUser(fetchedUser);
        } else {
          // Wrong role, redirect to their dashboard
          window.location.href =
            "/#/" + fetchedUser.role.toLowerCase() + "/dashboard";
        }
      } catch {
        // Cookie invalid or expired -> Not logged in
        window.location.href = "/#/login";
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// ===============================
// MAIN ROUTES
// ===============================
const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/offers" element={<PublicOffersList />} />
        <Route path="/offers/:id" element={<PublicOfferDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordRequest />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Route>

      {/* ================= CUSTOMER ================= */}
      <Route
        element={
          <RequireAuth allowedRoles={["CUSTOMER"]}>
            <CustomerLayout />
          </RequireAuth>
        }
      >
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/categories" element={<CustomerCategories />} />
        <Route path="/customer/offers" element={<CustomerOffers />} />
        <Route path="/customer/offers/:id" element={<CustomerOfferDetails />} />
        <Route path="/customer/saved-offers" element={<SavedOffers />} />
        <Route path="/customer/notifications" element={<Notifications />} />
        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/edit-profile" element={<EditProfile />} />
        <Route path="/customer/settings" element={<Settings />} />
        <Route path="/customer/shops" element={<Shops />} />
        <Route path="/customer/shops/:id" element={<CustomerShopDetails />} />
        <Route path="/customer/feedback" element={<CustomerFeedback />} />
      </Route>

      {/* ================= SHOP ================= */}
      <Route
        element={
          <RequireAuth allowedRoles={["SHOP_OWNER"]}>
            <ShopLayout />
          </RequireAuth>
        }
      >
        <Route path="/shop/dashboard" element={<ShopDashboard />} />
        <Route path="/shop/create-shop" element={<CreateShop />} />
        <Route path="/shop/add-offer" element={<ShopAddOffer />} />
        <Route path="/shop/my-offers" element={<MyOffers />} />
        <Route path="/shop/offers/:id" element={<ShopOfferDetails />} />
        <Route path="/shop/offers/edit/:id" element={<ShopEditOffer />} />
        <Route path="/shop/analytics" element={<Analytics />} />
        <Route path="/shop/profile" element={<ShopProfile />} />
        <Route path="/shop/settings" element={<ShopSettings />} />
        <Route path="/shop/notifications" element={<ShopNotifications />} />
        <Route path="/shop/ratings" element={<ShopRatings />} />
      </Route>

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="shops/add" element={<AddShop />} />
        <Route path="shops/edit/:id" element={<EditShop />} />
        <Route path="shops/:id" element={<ShopDetails />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="offers/add" element={<AdminAddOffer />} />
        <Route path="offers/edit/:id" element={<EditOffer />} />
        <Route path="offers/:id" element={<AdminOfferDetails />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />
        <Route path="categories/:id" element={<CategoryDetails />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="send-notification" element={<AdminSendNotification />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
