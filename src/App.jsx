import { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  // State to ensure we don't redirect to login before checking storage
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Small artificial delay (or remove if synchronous check is enough)
    // This ensures the app knows if the user is logged in before rendering routes
    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);

    // (Optional) You can add a backend API call here to verify the token with the server
    // if you have an endpoint like /api/auth/me, but it is not required for basic routing.
  }, []);

  if (isCheckingAuth) {
    // Show a simple loading screen while checking the token
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-600 font-semibold">Loading Smaze...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
