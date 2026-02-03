import * as userService from "../services/userService.js";

export async function init() {
  const form = document.querySelector(".register-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const togglePasswordBtns = document.querySelectorAll(".toggle-password");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  var passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  //Check if user is logged in
  const BASE_URL = window.location.origin;
  const currentUser = await userService.getCurrentUser();
  if (currentUser) {
    // If no user, redirect to login/index page
    history.replaceState(null, null, `${BASE_URL}/index.html`);
    window.location.reload();
  }

  // Toggle password visibility
  togglePasswordBtns.forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Get the parent container
      const parent = toggleBtn.closest(".password-group");

      // Get the input inside this parent only
      const input = parent.querySelector("input");

      // Toggle type
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Toggle icon
      toggleBtn.classList.toggle("fa-eye");
      toggleBtn.classList.toggle("fa-eye-slash");
    });
  });

  // Live validation
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim().length >= 3) {
      nameInput.classList.add("valid");
      nameInput.classList.remove("invalid");
      nameError.textContent = "";
    } else {
      nameInput.classList.add("invalid");
      nameInput.classList.remove("valid");
      nameError.textContent = "Name must be at least 3 characters";
    }
  });

  emailInput.addEventListener("input", () => {
    if (emailPattern.test(emailInput.value)) {
      emailInput.classList.add("valid");
      emailInput.classList.remove("invalid");
      emailError.textContent = "";
    } else {
      emailInput.classList.add("invalid");
      emailInput.classList.remove("valid");
      emailError.textContent = "Invalid email format";
    }
  });

  passwordInput.addEventListener("input", () => {
    if (passwordPattern.test(passwordInput.value)) {
      passwordInput.classList.add("valid");
      passwordInput.classList.remove("invalid");
      passwordError.textContent = "";
    } else {
      passwordInput.classList.add("invalid");
      passwordInput.classList.remove("valid");
      passwordError.textContent =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }
  });

  confirmPasswordInput.addEventListener("input", () => {
    if (passwordInput.value === confirmPasswordInput.value) {
      confirmPasswordInput.classList.add("valid");
      confirmPasswordInput.classList.remove("invalid");
      confirmPasswordError.textContent = "";
    } else {
      confirmPasswordInput.classList.add("invalid");
      confirmPasswordInput.classList.remove("valid");
      confirmPasswordError.textContent = "Passwords do not match";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = nameInput.value.trim();
    const registerEmail = emailInput.value.trim().toLowerCase();
    const registerPassword = passwordInput.value;
    const registerConfirmPassword = confirmPasswordInput.value;

    if (
      !form ||
      !nameInput ||
      !emailInput ||
      !passwordInput ||
      !confirmPasswordInput
    ) {
      return;
    }

    // Validation before submitting
    if (userName.length < 3) return;
    if (!emailPattern.test(registerEmail)) return;
    if (!passwordPattern.test(registerPassword)) return;
    if (registerPassword !== registerConfirmPassword) return;

    // Check if email already exists
    const existingUser = await userService.emailExists(registerEmail);
    if (existingUser) {
      emailInput.classList.add("invalid");
      emailError.textContent = "Email already registered";
      return;
    }

    try {
      const newUser = {
        email: registerEmail,
        password: registerPassword,
        name: nameInput.value.trim(),
      };
      await userService.register(newUser);
      window.location.replace("login.html");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  });
}
