import { HashRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <HashRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </HashRouter>
  );
}

export default App;
