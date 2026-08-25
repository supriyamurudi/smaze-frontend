// frontend/src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ✅ Added padding-top to account for fixed navbar */}
      <main className="flex-1 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
