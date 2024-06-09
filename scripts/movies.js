import ENDPOINTS from './apiConfig.js';

function getHeaders() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error("No access token found. Please log in.");
    }

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };
}

async function fetchAndDisplayMovies() {
    try {
        const response = await fetch(ENDPOINTS.movies);
        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.statusText}`);
        }
        const movies = await response.json();
        console.log('Fetched movies:', movies);

        const moviesListContainer = document.getElementById('movies-list');
        if (!moviesListContainer) {
            throw new Error("Element with ID 'movies-list' not found.");
        }
        moviesListContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('col-md-4');
            movieCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title} (${movie.releaseYear})</h5>
                        <p class="card-text">Director: ${movie.director}</p>
                        <p class="card-text">${movie.description}</p>
                        <button class="btn btn-primary edit-button" data-id="${movie.movieId}">Edit</button>
                        <button class="btn btn-danger delete-button" data-id="${movie.movieId}">Delete</button>
                    </div>
                </div>
            `;
            moviesListContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error fetching and displaying movies:', error);
        displayErrorMessage('Error fetching movies: ' + error.message, 'movie-error-message');
    }
}

document.getElementById('createMovieForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const title = document.getElementById('title').value;
        const director = document.getElementById('director').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const year = document.getElementById('year').value;

        const newMovie = { title, director, description, genre, releaseYear: year };

        const response = await fetch(ENDPOINTS.createMovie, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(newMovie)
        });

        if (response.ok) {
            console.log('Movie created successfully');
            fetchAndDisplayMovies();
            document.getElementById('createMovieForm').reset();
        } else {
            throw new Error(`Failed to create movie: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error creating movie:', error.message);
        displayErrorMessage('Error creating movie: ' + error.message, 'movie-error-message');
    }
});

document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
        const movieId = event.target.dataset.id;
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                const response = await fetch(ENDPOINTS.deleteMovie(movieId), {
                    method: 'DELETE',
                    headers: getHeaders()
                });
                if (response.ok) {
                    console.log(`Movie with ID ${movieId} deleted successfully`);
                    fetchAndDisplayMovies();
                } else {
                    console.error('Failed to delete movie:', response.statusText);
                    throw new Error(`Failed to delete movie: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
                displayErrorMessage('Error deleting movie: ' + error.message, 'movie-error-message');
            }
        }
    }

    if (event.target.classList.contains('edit-button')) {
        const movieId = event.target.dataset.id;

        try {
            const response = await fetch(ENDPOINTS.movies + movieId);
            if (!response.ok) {
                throw new Error(`Failed to fetch movie details: ${response.statusText}`);
            }
            const movie = await response.json();
            console.log('Fetched movie details:', movie);

            document.getElementById('editTitle').value = movie.title;
            document.getElementById('editDirector').value = movie.director;
            document.getElementById('editDescription').value = movie.description;
            document.getElementById('editGenre').value = movie.genre;
            document.getElementById('editYear').value = movie.releaseYear;
            document.getElementById('editMovieId').value = movie.movieId;

            $('#editModal').modal('show');
        } catch (error) {
            console.error('Error fetching movie details:', error);
            displayErrorMessage('Error fetching movie details: ' + error.message, 'movie-error-message');
        }
    }
});

document.getElementById('editMovieForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const id = document.getElementById('editMovieId').value;
        const title = document.getElementById('editTitle').value;
        const director = document.getElementById('editDirector').value;
        const description = document.getElementById('editDescription').value;
        const genre = document.getElementById('editGenre').value;
        const year = document.getElementById('editYear').value;

        const updatedMovie = { movieId: id, title, director, description, genre, releaseYear: year };

        const response = await fetch(ENDPOINTS.editMovie(id), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(updatedMovie)
        });

        if (response.ok) {
            console.log(`Movie with ID ${id} updated successfully`);
            $('#editModal').modal('hide');
            fetchAndDisplayMovies();
        } else {
            throw new Error(`Failed to update movie: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error updating movie:', error.message);
        displayErrorMessage('Error updating movie: ' + error.message, 'movie-error-message');
    }
});

document.getElementById('movieIdInput').addEventListener('change', async () => {
    try {
        const movieId = document.getElementById('movieIdInput').value.trim();
        await fetchAndDisplayMovieById(movieId);
    } catch (error) {
        console.error('Error fetching and displaying movie details:', error);
        displayErrorMessage('Error fetching movie details: ' + error.message, 'movie-error-message');
    }
});

async function fetchAndDisplayMovieById(movieId) {
    try {
        const response = await fetch(ENDPOINTS.movies + movieId);
        if (response.status === 404) {
            const reviewsListContainer = document.getElementById("movies-list");
            reviewsListContainer.innerHTML = "";
            displayErrorMessage('There is no movie with this ID.', 'movie-error-message');
            return;
        }
        const movie = await response.json();
        console.log('Fetched movie by ID:', movie);

        const reviewsListContainer = document.getElementById("movies-list");
        reviewsListContainer.innerHTML = "";

        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching and displaying movie details:', error);
        displayErrorMessage('An error occurred while fetching movie details.', 'movie-error-message');
    }
}

function displayMovieDetails(movie) {
    const moviesListContainer = document.getElementById('movies-list');
    moviesListContainer.innerHTML = '';

    const movieCard = document.createElement('div');
    movieCard.classList.add('col-md-4');
    movieCard.innerHTML = `
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">${movie.title} (${movie.releaseYear})</h5>
                <p class="card-text">Director: ${movie.director}</p>
                <p class="card-text">${movie.description}</p>
                <button class="btn btn-primary edit-button" data-id="${movie.movieId}">Edit</button>
                <button class="btn btn-danger delete-button" data-id="${movie.movieId}">Delete</button>
            </div>
        </div>
    `;

    moviesListContainer.appendChild(movieCard);
}

function displayErrorMessage(message, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const errorMessage = document.createElement('div');
    errorMessage.classList.add('alert', 'alert-danger');
    errorMessage.textContent = message;

    container.appendChild(errorMessage);
}

document.getElementById('toggleMoviesButton').addEventListener('click', toggleMovies);

function toggleMovies() {
    const moviesListContainer = document.getElementById('movies-list');
    if (moviesListContainer.innerHTML.trim() !== '') {
        moviesListContainer.innerHTML = '';
    } else {
        fetchAndDisplayMovies();
    }
}

fetchAndDisplayMovies();
