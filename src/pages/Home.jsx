import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

/*
  Home.jsx - Busca + paginação + persistência de query/page
  Estratégia: salvar somente query e page; ao montar, se houver query salva,
  re-executar a busca (fetch) para repopular `movies`.
*/

export default function Home() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toggleFavorite, isFavorite } = useFavorites();

  // --- Montagem: tentar restaurar query/page e refazer a busca automaticamente ---
  useEffect(() => {
    const savedQuery = localStorage.getItem("query");
    const savedPage = Number(localStorage.getItem("page") || 1);

    if (savedQuery) {
      // preenche o input e a página
      setQuery(savedQuery);
      setPage(savedPage);
      // re-executa a busca usando os valores salvos (não depender do state atual)
      fetchMovies(savedPage, savedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // roda só na montagem

  // --- Salvamos apenas query e page no localStorage ---
  useEffect(() => {
    localStorage.setItem("query", query);
    localStorage.setItem("page", String(page));
  }, [query, page]);

  /* 
    fetchMovies: aceita customPage e customQuery para evitar dependência de estados
    (assim você pode chamar fetchMovies(2, "batman") imediatamente sem aguardar setState).
  */
  async function fetchMovies(customPage = page, customQuery = query) {
    if (!customQuery) return; // evita busca vazia

    setLoading(true);
    setError("");
    setMovies([]); // limpa UI enquanto carrega (opcional)

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      customQuery
    )}&include_adult=false&language=pt-BR&page=${customPage}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro na requisição: " + res.status);
      const data = await res.json();
      setMovies(data.results || []);
      // opcional: atualiza o estado da página caso a busca tenha vindo de outra página
      setPage(customPage);
    } catch (err) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Buscar Filmes</h1>

      {/* Campo de busca */}
      <input
        type="text"
        placeholder="Digite o nome do filme"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "8px", width: "60%", maxWidth: 400, marginRight: 8 }}
      />
      <button
        onClick={() => {
          setPage(1);
          fetchMovies(1, query); // usa explicitamente query atual
        }}
      >
        Buscar
      </button>

      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "crimson" }}>Erro: {error}</p>}

      {/* Grid de filmes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {movies.map((m) => (
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
              style={{ borderRadius: "6px", marginBottom: "8px", width: "100%", height: "auto" }}
            />
            <h3>{m.title}</h3>
            <p>{m.release_date ? m.release_date.slice(0, 4) : "Sem ano"}</p>

            <Link to={`/details/${m.id}`}>
              <button>Ver Detalhes</button>
            </Link>

            <button style={{ marginTop: "8px" }} onClick={() => toggleFavorite(m)}>
              {isFavorite(m.id) ? "Remover Favorito" : "Adicionar Favorito"}
            </button>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {movies.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => {
              const newPage = page - 1;
              if (newPage >= 1) {
                // chama fetch com query + newPage explícitos
                fetchMovies(newPage, query);
              }
            }}
            disabled={page === 1}
          >
            Anterior
          </button>

          <span style={{ margin: "0 10px" }}>Página {page}</span>

          <button
            onClick={() => {
              const newPage = page + 1;
              fetchMovies(newPage, query);
            }}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
