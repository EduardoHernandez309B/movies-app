import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";


export default function Details() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    // Busca informações do filme
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
    )
      .then((res) => {
        console.log("[Detalhes] Status movie:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[Detalhes] Movie data:", data);
        setMovie(data);
      })
      .catch((err) => console.error("[Detalhes] Erro movie:", err));

    // Busca elenco e equipe
    fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=pt-BR`
    )
      .then((res) => {
        console.log("[Detalhes] Status credits:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("[Detalhes] Credits data:", data);
        setCredits(data);
      })
      .catch((err) => console.error("[Detalhes] Erro credits:", err));
  }, [id]);

  if (!movie) return <p className="text-center mt-10">Carregando...</p>;

  // Pega o diretor (se existir nos créditos)
  const director = credits?.crew?.find((person) => person.job === "Director");

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-8">
      {/* Container principal */}
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 object-cover"
        />

        {/* Conteúdo */}
        <div className="p-6 flex flex-col gap-4 md:w-2/3">
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
          <p className="text-gray-500 italic">
            {movie.release_date?.slice(0, 4)}
          </p>

          {/* Sinopse */}
          <p className="text-gray-700 leading-relaxed">{movie.overview}</p>

          {/* Informações extras */}
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">Diretor:</span>{" "}
              {director?.name || "Não informado"}
            </p>
            <p>
              <span className="font-semibold">Avaliação:</span>{" "}
              {movie.vote_average.toFixed(1)} / 10
            </p>
          </div>

          {/* Elenco */}
          {credits && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Elenco
              </h2>
              <div className="flex flex-wrap gap-2">
                {credits.cast.slice(0, 8).map((actor) => (
                  <span
                    key={actor.cast_id}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                    {actor.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
