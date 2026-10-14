document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const message = document.getElementById("message");
  const forgotLink = document.getElementById("forgotLink");
  const rtlToggle = document.getElementById("rtlToggle");
  const directionLabel = document.getElementById("directionLabel");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");

  function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message";
    if (type) message.classList.add(type);
  }

  // Restore saved appearance settings. The toggles still work if storage is blocked.
  try {
    document.body.classList.toggle("dark-mode", localStorage.getItem("toolnest-theme") === "dark");
    document.documentElement.dir = localStorage.getItem("toolnest-direction") === "rtl" ? "rtl" : "ltr";
  } catch (error) {
    document.documentElement.dir = document.documentElement.dir === "rtl" ? "rtl" : "ltr";
  }
  document.body.classList.toggle("rtl-mode", document.documentElement.dir === "rtl");

  function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light" : "Dark";
    darkModeToggle.setAttribute("aria-pressed", String(isDark));
    darkModeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    darkModeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  function updateDirectionButton() {
    const isRTL = document.documentElement.dir === "rtl";
    directionLabel.textContent = isRTL ? "LTR" : "RTL";
    rtlToggle.setAttribute("aria-pressed", String(isRTL));
    rtlToggle.setAttribute("aria-label", isRTL ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
    rtlToggle.title = isRTL ? "Switch to LTR" : "Switch to RTL";
  }

  updateThemeButton();
  updateDirectionButton();

  darkModeToggle.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", isDark);
    try { localStorage.setItem("toolnest-theme", isDark ? "dark" : "light"); } catch (error) {}
    updateThemeButton();
  });

  rtlToggle.addEventListener("click", function () {
    const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = direction;
    document.body.classList.toggle("rtl-mode", direction === "rtl");
    try { localStorage.setItem("toolnest-direction", direction); } catch (error) {}
    updateDirectionButton();
  });

  togglePassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-pressed", String(isHidden));
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    showMessage("");
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }
    if (!emailInput.validity.valid) {
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }
    if (password.length < 6) {
      showMessage("Password must contain at least 6 characters.", "error");
      passwordInput.focus();
      return;
    }
    showMessage("Form validated! Connect your authentication backend to sign in.", "success");
  });

  forgotLink.addEventListener("click", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      showMessage("Enter your email address first to reset your password.", "error");
      emailInput.focus();
      return;
    }
    if (!emailInput.validity.valid) {
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }
    showMessage("Password reset requires a connected authentication service.", "success");
  });
});
