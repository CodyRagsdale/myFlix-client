import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "The Room",
            description: "This is a very bad movie.",
            imageURL: "https://via.placeholder.com/150",
            genre: { name: "Drama" },
            director: { name: "Tommy Wisseau" }
        },
        {
            id: 2,
            title: "House of the Dead",
            description: "This is a very bad movie.",
            imageURL: "https://via.placeholder.com/150",
            genre: { name: "Action" },
            director: { name: "Uwe Boll" }
        },
        {
            id: 3,
            title: "Bloodrayne",
            description: "This is a very bad movie.",
            imageURL: "https://via.placeholder.com/150",
            genre: { name: "Action" },
            director: { name: "Uwe Boll" }
        }
    ]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const onMovieClick = (movie) => {
        console.log('onMovieClick called with movie:', movie);
        setSelectedMovie(movie);
    }

    if (selectedMovie) {
        return (
            <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
        )
    }

    if (movies.length === 0) {
        return <div>The list is empty, oh no!</div>
    }

    return (
        <div>
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onMovieClick={(newSelectedMovie) => {
                        setSelectedMovie(newSelectedMovie);
                    }}
                />
            ))}
        </div>
    );
};