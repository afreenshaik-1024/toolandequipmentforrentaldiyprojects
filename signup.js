document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");
  const message = document.getElementById("message");

  const rtlToggle = document.getElementById("rtlToggle");
  const directionText = document.getElementById("directionText");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message";
    if (type) message.classList.add(type);
  }

  // Restore saved theme and direction. The controls still work if storage is blocked.
  try {
    document.body.classList.toggle("dark-mode", localStorage.getItem("toolnest-theme") === "dark");
    document.documentElement.dir = localStorage.getItem("toolnest-direction") === "rtl" ? "rtl" : "ltr";
  } catch (error) {
    document.documentElement.dir = document.documentElement.dir === "rtl" ? "rtl" : "ltr";
  }

  function updateThemeButton() {
    const dark = document.body.classList.contains("dark-mode");
    themeIcon.textContent = dark ? "☀" : "☾";
    themeText.textContent = dark ? "Light Mode" : "Dark Mode";
    darkModeToggle.setAttribute("aria-pressed", String(dark));
    darkModeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  function updateDirectionButton() {
    const rtl = document.documentElement.dir === "rtl";
    directionText.textContent = rtl ? "LTR" : "RTL";
    rtlToggle.setAttribute("aria-pressed", String(rtl));
    rtlToggle.setAttribute("aria-label", rtl ? "Switch to left-to-right layout" : "Switch to right-to-left layout");
  }

  updateThemeButton();
  updateDirectionButton();

  darkModeToggle.addEventListener("click", function () {
    const dark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", dark);
    try { localStorage.setItem("toolnest-theme", dark ? "dark" : "light"); } catch (error) {}
    updateThemeButton();
  });

  rtlToggle.addEventListener("click", function () {
    const direction = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = direction;
    document.body.classList.toggle("rtl-mode", direction === "rtl");
    try { localStorage.setItem("toolnest-direction", direction); } catch (error) {}
    updateDirectionButton();
  });

  // Show/hide both password fields.
  document.querySelectorAll(".show-password").forEach(function (button) {
    button.addEventListener("click", function () {
      const target = document.getElementById(button.dataset.target);
      if (!target) return;
      const show = target.type === "password";
      target.type = show ? "text" : "password";
      button.textContent = show ? "Hide" : "Show";
      button.setAttribute("aria-pressed", String(show));
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    showMessage("");

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const phoneValue = phone.value.trim();

    if (nameValue.length < 2) {
      showMessage("Please enter your full name (at least 2 characters).", "error");
      fullName.focus();
      return;
    }
    if (!emailValue || !email.validity.valid) {
      showMessage("Please enter a valid email address.", "error");
      email.focus();
      return;
    }
    if (!phoneValue || phoneValue.replace(/\D/g, "").length < 7) {
      showMessage("Please enter a valid phone number.", "error");
      phone.focus();
      return;
    }
    if (password.value.length < 8) {
      showMessage("Password must contain at least 8 characters.", "error");
      password.focus();
      return;
    }
    if (password.value !== confirmPassword.value) {
      showMessage("Passwords do not match. Please check them.", "error");
      confirmPassword.focus();
      return;
    }
    if (!terms.checked) {
      showMessage("Please agree to the Terms of Service and Privacy Policy.", "error");
      terms.focus();
      return;
    }

    showMessage("Form validated! Connect your registration backend to create the account.", "success");
  });
});
