import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Give React a moment to read the browser storage
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf5ff",
        }}
      >
        <div
          style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7c3aed" }}
        >
          Loading...
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
