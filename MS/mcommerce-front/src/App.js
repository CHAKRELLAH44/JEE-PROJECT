import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Produits from "./pages/Produits";
import Commandes from "./pages/Commandes";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/produits">Produits</Link> |{" "}
        <Link to="/commandes">Commandes</Link>
      </nav>

      <Routes>
        <Route path="/produits" element={<Produits />} />
        <Route path="/commandes" element={<Commandes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
