import ENDPOINTS from './apiConfig.js';

let eventListenersAttached = false;

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

function attachEventListeners() {
    if (!eventListenersAttached) {
        document.getElementById("addReviewForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            try {
                const movieId = document.getElementById("movieIdInput").value;
                const reviewText = document.getElementById("review").value;
                const rating = document.getElementById("rating").value;
                const newReview = {
                    movieId: parseInt(movieId, 10),
                    comment: reviewText,
                    rating: rating,
                };

                const response = await fetch(ENDPOINTS.addReview, {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify(newReview),
                });

                if (response.ok) {
                    fetchAndDisplayReviews();
                    $("#addReviewModal").modal("hide");
                } else if (response.status === 401) {
                    alert("Unauthorized. Please log in again.");
                    localStorage.removeItem('accessToken');
                    window.location.href = "/login.html"; // Redirect to login page
                } else {
                    throw new Error(`Failed to add review: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Error adding review:", error);
                displayErrorMessage("Error adding review: " + error.message, 'review-error-message');
            }
        });

        document.addEventListener("click", async (event) => {
            if (event.target.classList.contains("delete-button")) {
                const reviewId = event.target.dataset.reviewId;
                if (confirm("Are you sure you want to delete this review?")) {
                    try {
                        const response = await fetch(ENDPOINTS.deleteReview(reviewId), {
                            method: "DELETE",
                            headers: getHeaders()
                        });
                        if (response.ok) {
                            fetchAndDisplayReviews();
                        } else if (response.status === 401) {
                            alert("Unauthorized. Please log in again.");
                            localStorage.removeItem('accessToken');
                            window.location.href = "/login.html"; // Redirect to login page
                        } else {
                            throw new Error(`Failed to delete review: ${response.statusText}`);
                        }
                    } catch (error) {
                        console.error("Error deleting review:", error);
                        displayErrorMessage("Error deleting review: " + error.message, 'review-error-message');
                    }
                }
            }

            if (event.target.classList.contains("edit-button")) {
                const reviewId = event.target.dataset.reviewId;

                try {
                    const response = await fetch(ENDPOINTS.reviews + reviewId);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch review details: ${response.statusText}`);
                    }
                    const review = await response.json();

                    document.getElementById('editReview').value = review.comment;
                    document.getElementById('editRating').value = review.rating;
                    document.getElementById('editMovieId').value = review.movieId;
                    document.getElementById('editReviewId').value = reviewId;

                    $('#editReviewModal').modal('show');
                } catch (error) {
                    console.error('Error fetching review details:', error);
                    displayErrorMessage('Error fetching review details: ' + error.message, 'review-error-message');
                }
            }
        });

        document.getElementById("toggleReviewsButton").addEventListener("click", toggleReviews);
        eventListenersAttached = true;
    }
}

async function fetchAndDisplayReviews() {
    attachEventListeners();

    try {
        const response = await fetch(ENDPOINTS.reviews);
        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        const reviews = await response.json();

        const reviewsListContainer = document.getElementById("reviews-list");
        reviewsListContainer.innerHTML = "";

        reviews.forEach((review) => {
            displayReviewDetails(review);
        });
    } catch (error) {
        console.error("Error fetching and displaying reviews:", error);
        displayErrorMessage("Error fetching reviews: " + error.message, 'review-error-message');
    }
}

async function displayReviewDetails(review) {
    try {
        const movieResponse = await fetch(ENDPOINTS.movies + review.movieId);
        if (!movieResponse.ok) {
            throw new Error(`Failed to fetch movie details: ${movieResponse.statusText}`);
        }
        const movie = await movieResponse.json();

        const card = document.createElement("div");
        card.classList.add("card", "mb-3");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = movie.title;

        const rating = document.createElement("p");
        rating.classList.add("card-text");
        rating.innerHTML = `<strong>Rating:</strong> ${review.rating}`;

        const reviewText = document.createElement("p");
        reviewText.classList.add("card-text");
        reviewText.innerHTML = `<strong>Review:</strong> ${review.comment}`;

        const editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "edit-button");
        editButton.textContent = "Edit";
        editButton.setAttribute("data-review-id", review.id);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "delete-button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-review-id", review.id);

        cardBody.appendChild(title);
        cardBody.appendChild(rating);
        cardBody.appendChild(reviewText);
        cardBody.appendChild(editButton);
        cardBody.appendChild(deleteButton);

        card.appendChild(cardBody);

        const reviewsListContainer = document.getElementById("reviews-list");
        reviewsListContainer.appendChild(card);
    } catch (error) {
        console.error("Error displaying review details:", error);
        displayErrorMessage("Error displaying review details: " + error.message, 'review-error-message');
    }
}

document.getElementById("reviewIdInput").addEventListener("change", async () => {
    try {
        const reviewId = document.getElementById("reviewIdInput").value.trim();
        await fetchAndDisplayReviewById(reviewId);
    } catch (error) {
        console.error("Error fetching and displaying review details:", error);
        displayErrorMessage("Error fetching review details: " + error.message, 'review-error-message');
    }
});

async function fetchAndDisplayReviewById(reviewId) {
    try {
        const response = await fetch(ENDPOINTS.reviews + reviewId);
        if (response.status === 404) {
            const reviewsListContainer = document.getElementById("reviews-list");
            reviewsListContainer.innerHTML = "";
            displayErrorMessage("There is no review with this ID.", 'review-error-message');
            return;
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch review details: ${response.statusText}`);
        }
        const review = await response.json();

        const reviewsListContainer = document.getElementById("reviews-list");
        reviewsListContainer.innerHTML = "";

        displayReviewDetails(review);
    } catch (error) {
        console.error("Error fetching and displaying review details:", error);
        displayErrorMessage("An error occurred while fetching review details.", 'review-error-message');
    }
}

function displayErrorMessage(message, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const errorMessage = document.createElement("div");
    errorMessage.classList.add("alert", "alert-danger");
    errorMessage.textContent = message;

    container.appendChild(errorMessage);
}

function toggleReviews() {
    const reviewsListContainer = document.getElementById("reviews-list");
    if (reviewsListContainer.innerHTML.trim() !== "") {
        reviewsListContainer.innerHTML = "";
    } else {
        fetchAndDisplayReviews();
    }
}

document.getElementById('editReviewForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const id = document.getElementById('editReviewId').value;
        const comment = document.getElementById('editReview').value;
        const rating = document.getElementById('editRating').value;
        const movieId = document.getElementById('editMovieId').value;

        const updatedReview = { id, movieId: parseInt(movieId, 10), comment, rating };

        const response = await fetch(ENDPOINTS.editReview(id), {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(updatedReview)
        });

        if (response.ok) {
            $('#editReviewModal').modal('hide');
            fetchAndDisplayReviews();
        } else if (response.status === 401) {
            alert("Unauthorized. Please log in again.");
            localStorage.removeItem('accessToken');
            window.location.href = "/login.html"; // Redirect to login page
        } else {
            throw new Error(`Failed to update review: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error updating review:", error);
        displayErrorMessage("Error updating review: " + error.message, 'review-error-message');
    }
});

fetchAndDisplayReviews();
