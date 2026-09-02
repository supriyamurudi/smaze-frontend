import { useEffect } from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    // Ask the browser to make storage persistent
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        console.log("Persistent storage granted:", persistent);
      });
    }
  }, []);

  return (
    <HashRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </HashRouter>
  );
}

export default App;
