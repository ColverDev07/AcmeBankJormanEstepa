// Evento principal para el registro de usuario
// Valida, guarda y muestra resumen de la cuenta creada

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const formularioRegistro = document.getElementById("registerForm");
    const mensajeErrorRegistro = document.getElementById("registerError");
    const mensajeExitoRegistro = document.getElementById("registerSuccess");

    mensajeErrorRegistro.style.display = "none";
    mensajeExitoRegistro.style.display = "none";

    // Objeto con los datos del nuevo usuario
    const nuevoUsuario = {
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
    for (let key in nuevoUsuario) {
      if (nuevoUsuario[key] === "") {
        mensajeErrorRegistro.textContent = "Por favor complete todos los campos.";
        mensajeErrorRegistro.style.display = "block";
        return;
      }
    }
  
    // Obtener usuarios existentes
    let usuariosRegistrados = JSON.parse(localStorage.getItem("users")) || [];
  
    // Validar que no exista ya
    const usuarioYaExiste = usuariosRegistrados.some(
      (u) => u.idType === nuevoUsuario.idType && u.idNumber === nuevoUsuario.idNumber
    );
    if (usuarioYaExiste) {
      mensajeErrorRegistro.textContent = "Ya existe un usuario con esa identificación.";
      mensajeErrorRegistro.style.display = "block";
      return;
    }
  
    // Generar número de cuenta única y saldo inicial
    nuevoUsuario.accountNumber = `ACME-${String(usuariosRegistrados.length + 1).padStart(4, "0")}`;
    nuevoUsuario.balance = 0;
  
    // Guardar usuario y movimientos en LocalStorage
    usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("users", JSON.stringify(usuariosRegistrados));
    localStorage.setItem(`movimientos_${nuevoUsuario.accountNumber}`, JSON.stringify([]));
  
    // Mostrar resumen y redirigir
    mensajeExitoRegistro.innerHTML = `✅ Cuenta creada exitosamente.<br>Número de cuenta: <strong>${nuevoUsuario.accountNumber}</strong><br>Redirigiendo al inicio de sesión...`;
    mensajeExitoRegistro.style.display = "block";
    formularioRegistro.reset();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2500);
  });
  
// Botón cancelar: vuelve al login
  document.getElementById("cancelBtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
  
/**
 * Validación en tiempo real de los campos del formulario de registro.
 * Marca en rojo y muestra mensaje si el campo es inválido.
 */
  const formularioRegistro = document.getElementById("registerForm");
  const mensajeErrorRegistro = document.getElementById("registerError");
  const mensajeExitoRegistro = document.getElementById("registerSuccess");
  const botonCrearCuenta = formularioRegistro.querySelector('button[type="submit"]');

  function validarCampoRegistro(campo, validador, mensaje) {
    campo.addEventListener('input', function() {
      if (!validador(campo.value)) {
        campo.style.borderColor = '#e53935';
        mensajeErrorRegistro.textContent = mensaje;
        mensajeErrorRegistro.style.display = 'block';
        botonCrearCuenta.disabled = true;
      } else {
        campo.style.borderColor = '';
        mensajeErrorRegistro.style.display = 'none';
        botonCrearCuenta.disabled = false;
      }
    });
  }

  // Validadores para los campos
  const noVacio = v => v.trim() !== '';
  const soloNumeros = v => /^\d+$/.test(v.trim());
  const correoValido = v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(v.trim());
  const passwordSeguro = v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);

  validarCampoRegistro(document.getElementById('idNumber'), soloNumeros, 'El número de identificación solo debe contener números.');
  validarCampoRegistro(document.getElementById('firstName'), noVacio, 'El nombre es obligatorio.');
  validarCampoRegistro(document.getElementById('lastName'), noVacio, 'El apellido es obligatorio.');
  validarCampoRegistro(document.getElementById('phone'), soloNumeros, 'El teléfono solo debe contener números.');
  validarCampoRegistro(document.getElementById('email'), correoValido, 'Ingrese un correo electrónico válido.');
  validarCampoRegistro(document.getElementById('address'), noVacio, 'La dirección es obligatoria.');
  validarCampoRegistro(document.getElementById('city'), noVacio, 'La ciudad es obligatoria.');
  validarCampoRegistro(document.getElementById('password'), passwordSeguro, 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número.');

  // Validación en selects
  ['idType','gender'].forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
      if (this.value === '') {
        this.style.borderColor = '#e53935';
        mensajeErrorRegistro.textContent = 'Seleccione una opción válida.';
        mensajeErrorRegistro.style.display = 'block';
        botonCrearCuenta.disabled = true;
      } else {
        this.style.borderColor = '';
        mensajeErrorRegistro.style.display = 'none';
        botonCrearCuenta.disabled = false;
      }
    });
  });
  