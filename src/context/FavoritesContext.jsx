import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Carrega favoritos do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Adiciona ou remove
  function toggleFavorite(movie) {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === movie.id);
      if (exists) {
        return prev.filter((f) => f.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  }

  // Verifica se já está nos favoritos
  function isFavorite(id) {
    return favorites.some((f) => f.id === id);
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook para consumir o contexto
export function useFavorites() {
  return useContext(FavoritesContext);
}
