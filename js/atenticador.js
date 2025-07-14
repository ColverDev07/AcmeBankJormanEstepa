// Mejorar accesibilidad en el formulario de login
const formularioLogin = document.getElementById("loginForm");
formularioLogin.setAttribute('aria-label', 'Formulario de inicio de sesión');
formularioLogin.setAttribute('role', 'form');

// Evento principal de login: valida credenciales y redirige al dashboard si son correctas
formularioLogin.addEventListener("submit", function (e) {
    e.preventDefault();
  
    const idType = document.getElementById("idType").value;
    const idNumber = document.getElementById("idNumber").value.trim();
    const password = document.getElementById("password").value.trim();
  
    // Validación básica de campos vacíos
    if (!idType || idNumber === "" || password === "") {
      mensajeErrorLogin.textContent = "Por favor complete todos los campos.";
      return;
    }
  
    const usuariosRegistrados = JSON.parse(localStorage.getItem("users")) || [];
  
    // Busca el usuario y valida la contraseña
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) =>
        u.idType === idType &&
        u.idNumber === idNumber &&
        u.password === password
    );
  
    if (usuarioEncontrado) {
      // Guardamos usuario activo y redirigimos
      localStorage.setItem("activeUser", JSON.stringify(usuarioEncontrado));
      window.location.href = "main.html";
    } else {
      mensajeErrorLogin.textContent = "Credenciales incorrectas. Intente nuevamente.";
    }
  });
  