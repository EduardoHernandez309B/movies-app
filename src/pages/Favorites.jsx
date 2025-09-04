import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Nenhum favorito ainda.</p>;
  }

  return (
    <div className="container" style={{ padding: 16 }}>
      <h1>Meus Favoritos</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {favorites.map((m) => (
          <div
            key={m.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <img
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
                  : "/no-image.png"
              }
              alt={m.title}
              style={{ borderRadius: "6px", marginBottom: "8px" }}
            />
            <h3>{m.title}</h3>
            <p>{m.release_date ? m.release_date.slice(0, 4) : "Sem ano"}</p>
            <Link to={`/details/${m.id}`}>
              <button>Ver Detalhes</button>
            </Link>
            <button
              style={{ marginTop: "8px" }}
              onClick={() => toggleFavorite(m)}
            >
              Remover Favorito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
