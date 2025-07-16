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

    // Generar fecha de vencimiento aleatoria (3-5 años en el futuro)
    const hoy = new Date();
    const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const anio = hoy.getFullYear() + 3 + Math.floor(Math.random() * 3); // 3-5 años
    nuevoUsuario.expiry = `${mes}/${String(anio).slice(-2)}`;

    // Color de tarjeta por defecto
    nuevoUsuario.cardColor = '#00b6ff';
  
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

  // --- VALIDACIÓN EN TIEMPO REAL DE TODOS LOS CAMPOS ---
  const camposRegistro = [
    { id: 'idType', validador: v => v !== '', mensaje: 'Seleccione un tipo de identificación.' },
    { id: 'idNumber', validador: v => /^\d+$/.test(v.trim()), mensaje: 'El número de identificación solo debe contener números.' },
    { id: 'firstName', validador: v => v.trim() !== '', mensaje: 'El nombre es obligatorio.' },
    { id: 'lastName', validador: v => v.trim() !== '', mensaje: 'El apellido es obligatorio.' },
    { id: 'gender', validador: v => v !== '', mensaje: 'Seleccione un género.' },
    { id: 'phone', validador: v => /^\d+$/.test(v.trim()), mensaje: 'El teléfono solo debe contener números.' },
    { id: 'email', validador: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()), mensaje: 'Ingrese un correo válido.' },
    { id: 'address', validador: v => v.trim() !== '', mensaje: 'La dirección es obligatoria.' },
    { id: 'city', validador: v => v.trim() !== '', mensaje: 'La ciudad es obligatoria.' },
    { id: 'password', validador: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v), mensaje: 'La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula y número.' }
  ];

  function validarFormularioRegistroTiempoReal() {
    let valido = true;
    for (const campo of camposRegistro) {
      const input = document.getElementById(campo.id);
      if (!campo.validador(input.value)) {
        valido = false;
        input.style.borderColor = '#e53935';
        mensajeErrorRegistro.textContent = campo.mensaje;
        mensajeErrorRegistro.style.display = 'block';
        botonCrearCuenta.disabled = true;
        break;
      } else {
        input.style.borderColor = '';
        mensajeErrorRegistro.style.display = 'none';
      }
    }
    if (valido) {
      mensajeErrorRegistro.style.display = 'none';
      botonCrearCuenta.disabled = false;
    }
  }

  camposRegistro.forEach(campo => {
    const input = document.getElementById(campo.id);
    input.addEventListener('input', validarFormularioRegistroTiempoReal);
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', validarFormularioRegistroTiempoReal);
    }
  });
  