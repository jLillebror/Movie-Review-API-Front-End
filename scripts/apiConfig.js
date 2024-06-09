const API_BASE_URL = "https://localhost:7028/";

const ENDPOINTS = {
    movies: API_BASE_URL + "api/Movies/",
    reviews: API_BASE_URL + "api/MovieReviews/",
    login: API_BASE_URL + "login",
    register: API_BASE_URL + "register",
    deleteMovie: (id) => API_BASE_URL + `api/Movies/${id}`,
    editMovie: (id) => API_BASE_URL + `api/Movies/${id}`,
    createMovie: API_BASE_URL + "api/Movies",
    addReview: API_BASE_URL + "api/MovieReviews/",
    deleteReview: (id) => API_BASE_URL + `api/MovieReviews/${id}`,
    editReview: (id) => API_BASE_URL + `api/MovieReviews/${id}`,
};

export default ENDPOINTS;
