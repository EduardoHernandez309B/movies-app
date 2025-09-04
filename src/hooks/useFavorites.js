// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Carrega favoritos do localStorage quando o app inicia
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Sempre que favorites mudar, salva no localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Adiciona ou remove um filme
  function toggleFavorite(movie) {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === movie.id);
      if (exists) {
        return prev.filter((f) => f.id !== movie.id); // remove
      } else {
        return [...prev, movie]; // adiciona
      }
    });
  }

  // Verifica se um filme já é favorito
  function isFavorite(id) {
    return favorites.some((f) => f.id === id);
  }

  return { favorites, toggleFavorite, isFavorite };
}
