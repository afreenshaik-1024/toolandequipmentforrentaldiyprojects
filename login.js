
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const message = document.getElementById("message");
const forgotLink = document.getElementById("forgotLink");

// Show / hide password
togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
    );
});

// Display feedback
function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

// Login form validation
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    showMessage("", "");

    if (!email || !password) {
        showMessage("Please fill in all required fields.", "error");
        return;
    }

    if (password.length < 6) {
        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );
        return;
    }

    // Frontend demo only — no real authentication yet.
    showMessage(
        "Form validated! Connect your authentication backend to sign in.",
        "success"
    );
});

// Forgot password
forgotLink.addEventListener("click", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        showMessage(
            "Enter your email address first to reset your password.",
            "error"
        );
        emailInput.focus();
        return;
    }

    showMessage(
        "Password reset requires a connected authentication service.",
        "success"
    );
});

document.addEventListener("DOMContentLoaded", function () {

    // Elements
    const rtlToggle = document.getElementById("rtlToggle");
    const directionText = document.getElementById("directionText");

    const darkModeToggle = document.getElementById("darkModeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");
    const forgotLink = document.getElementById("forgotLink");

    // Restore saved theme
    const savedTheme = localStorage.getItem("toolnest-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    function updateThemeButton() {
        const isDark = document.body.classList.contains("dark-mode");

        themeIcon.textContent = isDark ? "☀️" : "🌙";
        themeText.textContent = isDark ? "Light Mode" : "Dark Mode";

        darkModeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    updateThemeButton();

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "toolnest-theme",
            isDark ? "dark" : "light"
        );

        updateThemeButton();
    });

    // Restore saved direction
    const savedDirection = localStorage.getItem("toolnest-direction");

    if (savedDirection === "rtl") {
        document.body.classList.add("rtl-mode");
        document.documentElement.setAttribute("dir", "rtl");
    }

    function updateDirectionButton() {
        const isRTL = document.body.classList.contains("rtl-mode");

        directionText.textContent = isRTL ? "LTR" : "RTL";

        rtlToggle.setAttribute(
            "aria-label",
            isRTL ? "Switch to left-to-right layout" :
                    "Switch to right-to-left layout"
        );
    }

    updateDirectionButton();

    // RTL / LTR Toggle
    rtlToggle.addEventListener("click", function () {
        document.body.classList.toggle("rtl-mode");

        const isRTL = document.body.classList.contains("rtl-mode");

        document.documentElement.setAttribute(
            "dir",
            isRTL ? "rtl" : "ltr"
        );

        localStorage.setItem(
            "toolnest-direction",
            isRTL ? "rtl" : "ltr"
        );

        updateDirectionButton();
    });

    // Show / Hide Password
    togglePassword.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        togglePassword.textContent = isPassword ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );
    });

    // Login form demo validation
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value;

        message.textContent = "";
        message.style.color = "";

        if (!email || !password) {
            message.textContent = "Please enter your email and password.";
            message.style.color = "#dc2626";
            return;
        }

        message.textContent =
            "Frontend validation successful. Connect a backend to sign in.";
        message.style.color = "#16a34a";
    });

    // Forgot password demo
    forgotLink.addEventListener("click", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();

        if (!email) {
            message.textContent =
                "Please enter your email address first.";
            message.style.color = "#dc2626";

            document.getElementById("email").focus();
            return;
        }

        message.textContent =
            "Password reset requires a backend or email service.";
        message.style.color = "#16a34a";
    });

});