let verifiedUserIndex = null;

document.getElementById("verifyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const idType = document.getElementById("verifyIdType").value;
  const idNumber = document.getElementById("verifyIdNumber").value.trim();
  const email = document.getElementById("verifyEmail").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  verifiedUserIndex = users.findIndex(
    (u) =>
      u.idType === idType &&
      u.idNumber === idNumber &&
      u.email.toLowerCase() === email.toLowerCase()
  );

  const verifyMessage = document.getElementById("verifyMessage");
  if (verifiedUserIndex !== -1) {
    // Mostrar formulario de nueva contraseña
    document.getElementById("verifyForm").style.display = "none";
    document.getElementById("resetForm").style.display = "block";
    verifyMessage.textContent = "";
  } else {
    verifyMessage.textContent = "Datos incorrectos. Verifique su información.";
  }
});

document.getElementById("resetForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value.trim();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (verifiedUserIndex !== null && newPassword !== "") {
    users[verifiedUserIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("resetMessage").innerHTML = `
      ✅ Contraseña actualizada correctamente.<br>
      <a href="index.html">Volver al inicio de sesión</a>
    `;
    document.getElementById("resetForm").reset();
    document.getElementById("resetForm").style.display = "none";
  }
});

document.getElementById("cancelBtn").addEventListener("click", function () {
  window.location.href = "index.html";
});
