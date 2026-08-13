import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
