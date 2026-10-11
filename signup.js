document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    const rtlToggle = document.getElementById("rtlToggle");
    const directionText = document.getElementById("directionText");

    const darkModeToggle = document.getElementById("darkModeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");

    const form = document.getElementById("signupForm");
    const message = document.getElementById("message");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");


    // ========================================
    // LOCAL STORAGE HELPERS
    // ========================================

    function readSetting(key, defaultValue) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? defaultValue : value;
        } catch (error) {
            return defaultValue;
        }
    }

    function saveSetting(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The page remains functional without storage.
        }
    }


    // ========================================
    // DARK MODE
    // ========================================

    function updateTheme() {
        const isDark = document.body.classList.contains("dark-mode");

        if (themeIcon) {
            themeIcon.textContent = isDark ? "☀" : "☾";
        }

        if (themeText) {
            themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
        }

        if (darkModeToggle) {
            darkModeToggle.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        }
    }

    // Restore saved theme.
    if (readSetting("toolnest-theme", "light") === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateTheme();

    // Toggle theme.
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            const isDark = document.body.classList.contains("dark-mode");

            saveSetting(
                "toolnest-theme",
                isDark ? "dark" : "light"
            );

            updateTheme();
        });
    }


    // ========================================
    // RTL / LTR
    // ========================================

    function updateDirection() {
        const isRTL = document.body.classList.contains("rtl-mode");

        document.documentElement.setAttribute(
            "dir",
            isRTL ? "rtl" : "ltr"
        );

        if (directionText) {
            directionText.textContent = isRTL ? "LTR" : "RTL";
        }

        if (rtlToggle) {
            rtlToggle.setAttribute(
                "aria-label",
                isRTL
                    ? "Switch to left-to-right layout"
                    : "Switch to right-to-left layout"
            );
        }
    }

    // Restore saved direction.
    if (readSetting("toolnest-direction", "ltr") === "rtl") {
        document.body.classList.add("rtl-mode");
    }

    updateDirection();

    // Toggle direction.
    if (rtlToggle) {
        rtlToggle.addEventListener("click", function () {
            document.body.classList.toggle("rtl-mode");

            const isRTL = document.body.classList.contains("rtl-mode");

            saveSetting(
                "toolnest-direction",
                isRTL ? "rtl" : "ltr"
            );

            updateDirection();
        });
    }


    // ========================================
    // SHOW / HIDE PASSWORD
    // ========================================

    document.querySelectorAll(".show-password").forEach(function (button) {

        button.addEventListener("click", function () {
            const targetId = button.getAttribute("data-target");
            const input = document.getElementById(targetId);

            if (!input) {
                return;
            }

            const shouldShow = input.type === "password";

            input.type = shouldShow ? "text" : "password";
            button.textContent = shouldShow ? "Hide" : "Show";

            button.setAttribute(
                "aria-label",
                shouldShow ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                shouldShow ? "true" : "false"
            );
        });

    });


    // ========================================
    // VALIDATION HELPERS
    // ========================================

    function clearErrors() {
        document.querySelectorAll("#signupForm input").forEach(function (input) {
            input.classList.remove("invalid");
        });
    }

    function markInvalid(input) {
        if (input) {
            input.classList.add("invalid");
            input.focus();
        }
    }

    function showMessage(text, type) {
        if (!message) {
            return;
        }

        message.textContent = text;
        message.className = "message";

        if (type) {
            message.classList.add(type);
        }
    }


    // ========================================
    // LIVE PASSWORD MATCHING
    // ========================================

    function checkPasswordMatch() {
        if (!password || !confirmPassword) {
            return true;
        }

        if (
            confirmPassword.value.length > 0 &&
            password.value !== confirmPassword.value
        ) {
            confirmPassword.classList.add("invalid");
            return false;
        }

        confirmPassword.classList.remove("invalid");
        return true;
    }

    if (password) {
        password.addEventListener("input", checkPasswordMatch);
    }

    if (confirmPassword) {
        confirmPassword.addEventListener("input", checkPasswordMatch);
    }


    // ========================================
    // SIGNUP FORM VALIDATION
    // ========================================

    if (form) {
        form.addEventListener("submit", function (event) {

            event.preventDefault();

            clearErrors();
            showMessage("", "");

            // Full name
            const nameValue = fullName.value.trim();

            if (nameValue.length < 2) {
                showMessage(
                    "Please enter your full name.",
                    "error"
                );

                markInvalid(fullName);
                return;
            }

            // Email
            const emailValue = email.value.trim();

            if (!emailValue || !email.checkValidity()) {
                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                markInvalid(email);
                return;
            }

            // Phone
            const phoneValue = phone.value.trim();
            const phoneDigits = phoneValue.replace(/\D/g, "");

            if (
                !/^[0-9+\s()-]+$/.test(phoneValue) ||
                phoneDigits.length < 7 ||
                phoneDigits.length > 15
            ) {
                showMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                markInvalid(phone);
                return;
            }

            // Password
            if (password.value.length < 8) {
                showMessage(
                    "Password must contain at least 8 characters.",
                    "error"
                );

                markInvalid(password);
                return;
            }

            // Confirm password
            if (password.value !== confirmPassword.value) {
                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                markInvalid(confirmPassword);
                return;
            }

            // Terms and privacy
            if (!terms.checked) {
                showMessage(
                    "Please accept the Terms of Service and Privacy Policy.",
                    "error"
                );

                terms.focus();
                return;
            }

            // Frontend validation passed.
            // Actual account creation requires a backend.
            showMessage(
                "All fields are valid! Backend connection is required to create your account.",
                "success"
            );

        });
    }

});