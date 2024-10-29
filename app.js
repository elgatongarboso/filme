// Movie data (for demonstration purposes)
const movies = [
    { title: "Inception", image: "inception.jpg" },
    { title: "The Matrix", image: "matrix.jpg" },
    { title: "Interstellar", image: "interstellar.jpg" }
];

// Initial setup
let currentMovieIndex = 0;
let isTransitioning = false;

// DOM Elements
const movieImage = document.getElementById('movieImage');
const movieTitle = document.getElementById('movieTitle');
const prevMovieBtn = document.getElementById('prevMovieBtn');
const nextMovieBtn = document.getElementById('nextMovieBtn');
const searchBar = document.getElementById('searchBar');
const user1Comment = document.getElementById('user1-comment');
const user1Rating = document.getElementById('user1-rating');
const user2Comment = document.getElementById('user2-comment');
const user2Rating = document.getElementById('user2-rating');

// Load initial movie
function loadMovie(index) {
    movieTitle.textContent = movies[index].title;
    movieImage.src = movies[index].image;
    loadReviews(index);
}

// Clear review fields
function clearReviews() {
    user1Comment.value = "";
    user1Rating.value = "";
    user2Comment.value = "";
    user2Rating.value = "";
}

// Save reviews and ratings to localStorage
function saveReviews(index) {
    const reviews = {
        user1Comment: user1Comment.value,
        user1Rating: user1Rating.value,
        user2Comment: user2Comment.value,
        user2Rating: user2Rating.value
    };
    localStorage.setItem(`movie-${index}-reviews`, JSON.stringify(reviews));
}

// Load reviews and ratings from localStorage
function loadReviews(index) {
    const savedReviews = localStorage.getItem(`movie-${index}-reviews`);
    if (savedReviews) {
        const reviews = JSON.parse(savedReviews);
        user1Comment.value = reviews.user1Comment || "";
        user1Rating.value = reviews.user1Rating || "";
        user2Comment.value = reviews.user2Comment || "";
        user2Rating.value = reviews.user2Rating || "";
    } else {
        clearReviews(); // If no saved data, clear fields
    }
}

// Add rolling transition for movie change
function changeMovieWithEffect(newIndex) {
    if (isTransitioning) return;  // Prevent multiple transitions at once
    isTransitioning = true;

    // Add rolling out effect to current movie
    const movieDisplay = document.querySelector('.movie-display');
    movieDisplay.classList.add('rolling-out');

    // Wait for animation to finish, then switch the movie
    setTimeout(() => {
        saveReviews(currentMovieIndex);  // Save current movie reviews

        // Update the current index
        currentMovieIndex = newIndex;

        // Load the new movie data
        loadMovie(currentMovieIndex);

        // Add rolling-in effect to the new movie
        movieDisplay.classList.remove('rolling-out');
        movieDisplay.classList.add('rolling-in');

        // Wait for the roll-in to finish before allowing another transition
        setTimeout(() => {
            movieDisplay.classList.remove('rolling-in');
            isTransitioning = false;
        }, 500);  // Match the duration of the animation (0.5s)
    }, 500);  // Match the duration of the animation (0.5s)
}

// Event listeners for navigation
prevMovieBtn.addEventListener('click', () => {
    const newIndex = (currentMovieIndex === 0) ? movies.length - 1 : currentMovieIndex - 1;
    changeMovieWithEffect(newIndex);
});

nextMovieBtn.addEventListener('click', () => {
    const newIndex = (currentMovieIndex === movies.length - 1) ? 0 : currentMovieIndex + 1;
    changeMovieWithEffect(newIndex);
});

// Search bar functionality
searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const foundMovie = movies.find(movie => movie.title.toLowerCase().includes(query));
    
    if (foundMovie) {
        const newIndex = movies.indexOf(foundMovie);
        changeMovieWithEffect(newIndex);
    }
});

// Save reviews when users leave the page (optional)
window.addEventListener('beforeunload', () => {
    saveReviews(currentMovieIndex);
});

// Initial movie load
loadMovie(currentMovieIndex);
