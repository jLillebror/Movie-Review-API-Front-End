import ENDPOINTS from './apiConfig.js';

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;

        try {
            const response = await fetch(ENDPOINTS.login, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken);
                    window.location.href = "/index.html";
                } else {
                    alert("Login failed. Access token not found in response.");
                }
            } else {
                alert("Login failed. Please check your email and password.");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('emailRegister').value;
        const password = document.getElementById('passwordRegister').value;

        try {
            const response = await fetch(ENDPOINTS.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Registration successful! Please log in.");
            } else {
                const errorData = await response.json();
                console.error("Registration failed:", errorData);
                alert("Registration failed: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("An error occurred during registration:", error);
            alert("An error occurred during registration. Please try again later.");
        }
    });
}

const showLoginSection = () => {
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');

    if (loginNavItem && registerNavItem && logoutNavItem) {
        loginNavItem.style.display = 'flex';
        registerNavItem.style.display = 'flex';
        logoutNavItem.style.display = 'none';
    }
};

const showLogoutSection = () => {
    const loginNavItem = document.getElementById('loginNavItem');
    const registerNavItem = document.getElementById('registerNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');

    if (loginNavItem && registerNavItem && logoutNavItem) {
        loginNavItem.style.display = 'none';
        registerNavItem.style.display = 'none';
        logoutNavItem.style.display = 'flex';
    }
};

const accessToken = localStorage.getItem('accessToken');
if (accessToken) {
    showLogoutSection();
} else {
    showLoginSection();
}

const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        window.location.href = "/index.html";
    });
}
