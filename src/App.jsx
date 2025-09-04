import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Favorites from "./pages/Favorites";
import { FavoritesProvider } from "./context/FavoritesContext";

function NavBar() {
  const navigate = useNavigate();

  function goHomeAndReset() {
    // 🔹 limpa os dados salvos da Home
    localStorage.removeItem("query");
    localStorage.removeItem("movies");
    localStorage.removeItem("page");

    // 🔹 navega para Home
    navigate("/");
  }

  return (
    <nav style={{ marginBottom: "20px" }}>
      {/* Botão Home que zera a busca */}
      <button
        onClick={goHomeAndReset}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "blue",
          textDecoration: "underline",
          fontSize: "1rem",
          padding: 0,
          marginRight: "10px",
        }}
      >
        Home
      </button>

      {/* Favoritos continua normal */}
      <Link to="/favorites">Favoritos</Link>
    </nav>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Router>
    </FavoritesProvider>
  );
}
