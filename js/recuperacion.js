// Mejorar accesibilidad en el formulario de recuperación
const formularioVerificacion = document.getElementById('verifyForm');
formularioVerificacion.setAttribute('aria-label', 'Formulario de verificación de identidad');
formularioVerificacion.setAttribute('role', 'form');
const formularioNuevaContrasena = document.getElementById('resetForm');
formularioNuevaContrasena.setAttribute('aria-label', 'Formulario de nueva contraseña');
formularioNuevaContrasena.setAttribute('role', 'form');

// Elementos del DOM para formularios y mensajes
const mensajeErrorVerificacion = document.getElementById('verifyMessage');
const botonVerificar = formularioVerificacion.querySelector('button[type="submit"]');
const mensajeExitoNuevaContrasena = document.getElementById('resetMessage');

/**
 * Validación en tiempo real de los campos del formulario de recuperación.
 * Marca en rojo y muestra mensaje si el campo es inválido.
 */
function validarCampoRecuperacion(campo, validador, mensaje, submitBtn, errorEl) {
  campo.addEventListener('input', function() {
    if (!validador(campo.value)) {
      campo.style.borderColor = '#e53935';
      errorEl.textContent = mensaje;
      errorEl.style.display = 'block';
      submitBtn.disabled = true;
    } else {
      campo.style.borderColor = '';
      errorEl.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
}
const soloNumeros = v => /^\d+$/.test(v.trim());
const correoValido = v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v.trim());
const passwordSeguro = v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
validarCampoRecuperacion(document.getElementById('verifyIdNumber'), soloNumeros, 'El número de identificación solo debe contener números.', botonVerificar, mensajeErrorVerificacion);
validarCampoRecuperacion(document.getElementById('verifyEmail'), correoValido, 'Ingrese un correo electrónico válido.', botonVerificar, mensajeErrorVerificacion);
const botonActualizarContrasena = formularioNuevaContrasena.querySelector('button[type="submit"]');
validarCampoRecuperacion(document.getElementById('newPassword'), passwordSeguro, 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número.', botonActualizarContrasena, mensajeExitoNuevaContrasena);

// Evento principal: verifica identidad y muestra formulario de nueva contraseña
formularioVerificacion.addEventListener("submit", function (e) {
  e.preventDefault();

  const idType = document.getElementById("verifyIdType").value;
  const idNumber = document.getElementById("verifyIdNumber").value.trim();
  const email = document.getElementById("verifyEmail").value.trim();

  const usuariosRegistrados = JSON.parse(localStorage.getItem("users")) || [];
  let indiceUsuarioVerificado = usuariosRegistrados.findIndex(
    (u) =>
      u.idType === idType &&
      u.idNumber === idNumber &&
      u.email.toLowerCase() === email.toLowerCase()
  );

  if (indiceUsuarioVerificado !== -1) {
    formularioVerificacion.style.display = "none";
    formularioNuevaContrasena.style.display = "block";
    mensajeErrorVerificacion.textContent = "";
  } else {
    mensajeErrorVerificacion.textContent = "Datos incorrectos. Verifique su información.";
  }
});

// Evento para actualizar la contraseña del usuario verificado
formularioNuevaContrasena.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevaContrasena = document.getElementById("newPassword").value.trim();
  const usuariosRegistrados = JSON.parse(localStorage.getItem("users")) || [];

  if (indiceUsuarioVerificado !== -1 && nuevaContrasena !== "") {
    usuariosRegistrados[indiceUsuarioVerificado].password = nuevaContrasena;
    localStorage.setItem("users", JSON.stringify(usuariosRegistrados));

    mensajeExitoNuevaContrasena.innerHTML = `
      ✅ Contraseña actualizada correctamente.<br>
      <a href="index.html">Volver al inicio de sesión</a>
    `;
    formularioNuevaContrasena.reset();
    formularioNuevaContrasena.style.display = "none";
  }
});

// Botón cancelar: vuelve al login

  document.getElementById("cancelBtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
