import authService from "../services/auth.service.js";

export const renderRegister = (req, res) => {
  let errorMessage = null;
  let successMessage = null;

  if (req.query.error === "user_exists") {
    errorMessage = "El usuario ya está registrado";
  }

  if (req.query.success === "registered") {
    successMessage = "Registro exitoso, ahora podés iniciar sesión";
  }

  res.render("register", {
    error: errorMessage,
    success: successMessage
  });
};

export const renderLogin = (req, res) => {
  res.render("login", { error: req.query.error });
};

export const registerUser = (req, res) => {
  res.redirect("/api/sessions/login/?success=registered");
};

export const loginUser = async (req, res) => {
  const token = await authService.login(req.user);

  res.cookie("token", token, {
    httpOnly: true
  });

  res.redirect("/products");
};

export const getCurrentUser = async (req, res) => {
  res.render("profile", {
    user: {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role
    }
  });
};
