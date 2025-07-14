document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const idType = document.getElementById("idType").value;
    const idNumber = document.getElementById("idNumber").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorEl = document.getElementById("loginError");
  
    // Validación básica
    if (!idType || idNumber === "" || password === "") {
      errorEl.textContent = "Por favor complete todos los campos.";
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    const user = users.find(
      (u) =>
        u.idType === idType &&
        u.idNumber === idNumber &&
        u.password === password
    );
  
    if (user) {
      // Guardamos usuario activo
      localStorage.setItem("activeUser", JSON.stringify(user));
      window.location.href = "main.html";
    } else {
      errorEl.textContent = "Credenciales incorrectas. Intente nuevamente.";
    }
  });
  