document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const form = document.getElementById("registerForm");
    const errorMsg = document.getElementById("registerError");
    const successMsg = document.getElementById("registerSuccess");

    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    const user = {
      idType: document.getElementById("idType").value,
      idNumber: document.getElementById("idNumber").value.trim(),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      gender: document.getElementById("gender").value,
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      password: document.getElementById("password").value.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      transactions: [],
    };
  
    // Validar campos vacíos
    for (let key in user) {
      if (user[key] === "") {
        errorMsg.textContent = "Por favor complete todos los campos.";
        errorMsg.style.display = "block";
        return;
      }
    }
  
    // Obtener usuarios existentes
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Validar que no exista ya
    const exists = users.some(
      (u) => u.idType === user.idType && u.idNumber === user.idNumber
    );
    if (exists) {
      errorMsg.textContent = "Ya existe un usuario con esa identificación.";
      errorMsg.style.display = "block";
      return;
    }
  
    // Generar número de cuenta única
    user.accountNumber = `ACME-${String(users.length + 1).padStart(4, "0")}`;
    user.balance = 0;
  
    // Guardar
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  
    // Mostrar resumen y redirigir
    successMsg.innerHTML = `✅ Cuenta creada exitosamente.<br>Número de cuenta: <strong>${user.accountNumber}</strong><br>Redirigiendo al inicio de sesión...`;
    successMsg.style.display = "block";
    form.reset();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2500);
  });
  
  document.getElementById("cancelBtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
  