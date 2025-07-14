// Utilidades para demo (simulación de usuario y movimientos)
// Lee el usuario activo y sus movimientos desde LocalStorage
let usuarioActivo = JSON.parse(localStorage.getItem('activeUser'));
if (!usuarioActivo) {
  window.location.href = 'index.html';
}
let movimientosUsuario = JSON.parse(localStorage.getItem(`movimientos_${usuarioActivo.accountNumber}`)) || [];

/**
 * Actualiza los datos del usuario activo en LocalStorage y en la lista de usuarios registrados.
 */
function actualizarUsuarioActivo() {
  localStorage.setItem('activeUser', JSON.stringify(usuarioActivo));
  let usuariosRegistrados = JSON.parse(localStorage.getItem('users')) || [];
  usuariosRegistrados = usuariosRegistrados.map(u => u.accountNumber === usuarioActivo.accountNumber ? usuarioActivo : u);
  localStorage.setItem('users', JSON.stringify(usuariosRegistrados));
}

/**
 * Guarda el historial de movimientos del usuario activo en LocalStorage.
 */
function guardarMovimientosUsuario() {
  localStorage.setItem(`movimientos_${usuarioActivo.accountNumber}` , JSON.stringify(movimientosUsuario));
}

/**
 * Muestra una notificación de éxito en la parte superior del dashboard.
 * @param {string} mensaje - Mensaje a mostrar.
 */
function mostrarNotificacion(mensaje) {
  let notif = document.getElementById('successNotification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'successNotification';
    notif.className = 'notification-success';
    document.querySelector('.main-content').prepend(notif);
  }
  notif.textContent = mensaje;
  notif.classList.add('active');
  setTimeout(() => {
    notif.classList.remove('active');
  }, 2000);
}

/**
 * Muestra la sección seleccionada del dashboard y oculta los resúmenes de transacción si no corresponde.
 * @param {string} id - ID de la sección a mostrar.
 */
function mostrarSeccionDashboard(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Ocultar resúmenes al cambiar de sección
  if (id !== 'deposit') document.getElementById('depositSummary').style.display = 'none';
  if (id !== 'withdraw') document.getElementById('withdrawSummary').style.display = 'none';
  if (id !== 'services') document.getElementById('servicesSummary').style.display = 'none';
}

// Mejorar accesibilidad en la manipulación del DOM
// Ejemplo: añadir aria-label a botones de impresión y roles a tablas
function imprimirSeccion(id) {
  const printContent = document.getElementById(id).outerHTML;
  const win = window.open('', '', 'width=800,height=600');
  win.document.write('<html><head><title>Imprimir</title>');
  win.document.write('<link rel="stylesheet" href="css/Styles.css" />');
  win.document.write('</head><body>');
  win.document.write(printContent);
  win.document.write('</body></html>');
  win.document.close();
  win.print();
}
// Mejorar accesibilidad en tablas
const tablaTransacciones = document.getElementById('transactionsTable');
if (tablaTransacciones) {
  tablaTransacciones.setAttribute('role', 'table');
  tablaTransacciones.setAttribute('aria-label', 'Tabla de últimas transacciones');
}
const tablaExtracto = document.querySelector('#statementResult table');
if (tablaExtracto) {
  tablaExtracto.setAttribute('role', 'table');
  tablaExtracto.setAttribute('aria-label', 'Tabla de extracto bancario');
}
// Mejorar accesibilidad en botones de impresión
const botonesImprimir = document.querySelectorAll('button[onclick^="imprimirSeccion"], button[onclick^="printSection"]');
botonesImprimir.forEach(btn => {
  btn.setAttribute('aria-label', 'Imprimir sección');
  btn.setAttribute('tabindex', '0');
});

/**
 * Muestra los datos del usuario activo en las diferentes secciones del dashboard.
 */
function mostrarDatosUsuario() {
  // Bienvenida y resumen
  const nombre = usuarioActivo.firstName ? `${usuarioActivo.firstName} ${usuarioActivo.lastName}` : (usuarioActivo.nombre || 'Usuario');
  document.getElementById('welcomeUser').textContent = `Bienvenido, ${nombre}`;
  document.getElementById('accountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('createdAt').textContent = usuarioActivo.createdAt || usuarioActivo.creado || '';
  document.getElementById('balance').textContent = (usuarioActivo.balance !== undefined ? usuarioActivo.balance : 0).toLocaleString('es-CO');
  // Consignar
  document.getElementById('depositAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('depositFullName').textContent = nombre;
  // Retirar
  document.getElementById('withdrawAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('withdrawFullName').textContent = nombre;
  // Servicios
  document.getElementById('servicesAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('servicesFullName').textContent = nombre;
  // Extracto
  document.getElementById('statementAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('statementFullName').textContent = nombre;
  // Certificado
  document.getElementById('certificateFullName').textContent = nombre;
  document.getElementById('certificateAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || '';
  document.getElementById('certificateCreatedAt').textContent = usuarioActivo.createdAt || usuarioActivo.creado || '';
  document.getElementById('certificateCity').textContent = usuarioActivo.city || usuarioActivo.ciudad || '';
  const hoy = new Date();
  document.getElementById('certificateDate').textContent = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()}`;
}

/**
 * Muestra las últimas 10 transacciones del usuario activo en la tabla de transacciones.
 */
function mostrarTransaccionesUsuario() {
  const tbody = document.querySelector('#transactionsTable tbody');
  tbody.innerHTML = '';
  movimientosUsuario.slice(-10).reverse().forEach(mov => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${mov.fecha}</td><td>${mov.ref}</td><td>${mov.tipo}</td><td>${mov.desc}</td><td>${mov.valor<0?'-':''}$${Math.abs(mov.valor).toLocaleString('es-CO')}</td>`;
    tbody.appendChild(tr);
  });
}

// Consignación
const formularioConsignacion = document.getElementById('depositForm');
formularioConsignacion.addEventListener('submit', function(e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById('depositAmount').value);
  if (isNaN(monto) || monto <= 0) return;
  const now = new Date();
  const fecha = now.toISOString().slice(0,10);
  const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ref = Math.random().toString(36).substring(2,8).toUpperCase();
  movimientosUsuario.push({fecha, hora, ref, tipo:'Consignación', desc:'Consignación por canal electrónico', valor: monto});
  usuarioActivo.balance += monto;
  actualizarUsuarioActivo();
  guardarMovimientosUsuario();
  mostrarNotificacion('Consignación realizada con éxito.');
  document.getElementById('depositMsg').style.display = 'none';
  // Resumen
  document.getElementById('depositSummary').style.display = 'block';
  document.getElementById('depositDate').textContent = fecha + ' ' + hora;
  document.getElementById('depositRef').textContent = ref;
  document.getElementById('depositValue').textContent = monto.toLocaleString('es-CO');
  mostrarDatosUsuario();
  mostrarTransaccionesUsuario();
});

// Retiro
const formularioRetiro = document.getElementById('withdrawForm');
formularioRetiro.addEventListener('submit', function(e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById('withdrawAmount').value);
  if (isNaN(monto) || monto <= 0) return;
  if (usuarioActivo.balance < monto) {
    document.getElementById('withdrawMsg').style.display = 'block';
    document.getElementById('withdrawMsg').textContent = 'Saldo insuficiente.';
    setTimeout(()=>{document.getElementById('withdrawMsg').style.display='none';},2000);
    return;
  }
  const now = new Date();
  const fecha = now.toISOString().slice(0,10);
  const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ref = Math.random().toString(36).substring(2,8).toUpperCase();
  movimientosUsuario.push({fecha, hora, ref, tipo:'Retiro', desc:'Retiro de dinero', valor: -monto});
  usuarioActivo.balance -= monto;
  actualizarUsuarioActivo();
  guardarMovimientosUsuario();
  mostrarNotificacion('Retiro realizado con éxito.');
  document.getElementById('withdrawMsg').style.display = 'none';
  // Resumen
  document.getElementById('withdrawSummary').style.display = 'block';
  document.getElementById('withdrawDate').textContent = fecha + ' ' + hora;
  document.getElementById('withdrawRef').textContent = ref;
  document.getElementById('withdrawValue').textContent = monto.toLocaleString('es-CO');
  mostrarDatosUsuario();
  mostrarTransaccionesUsuario();
});

// Pago de servicios
const formularioPagoServicios = document.getElementById('servicesForm');
formularioPagoServicios.addEventListener('submit', function(e) {
  e.preventDefault();
  const tipo = document.getElementById('serviceType').value;
  const ref = document.getElementById('serviceRef').value;
  const valor = parseFloat(document.getElementById('serviceValue').value);
  if (!tipo || !ref || isNaN(valor) || valor <= 0) return;
  if (usuarioActivo.balance < valor) {
    document.getElementById('servicesMsg').style.display = 'block';
    document.getElementById('servicesMsg').textContent = 'Saldo insuficiente.';
    setTimeout(()=>{document.getElementById('servicesMsg').style.display='none';},2000);
    return;
  }
  const now = new Date();
  const fecha = now.toISOString().slice(0,10);
  const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const refGen = Math.random().toString(36).substring(2,8).toUpperCase();
  movimientosUsuario.push({fecha, hora, ref: refGen, tipo:'Retiro', desc:`Pago de servicio público ${tipo}`, valor: -valor});
  usuarioActivo.balance -= valor;
  actualizarUsuarioActivo();
  guardarMovimientosUsuario();
  mostrarNotificacion('Pago de servicio realizado con éxito.');
  document.getElementById('servicesMsg').style.display = 'none';
  // Resumen
  document.getElementById('servicesSummary').style.display = 'block';
  document.getElementById('servicesDate').textContent = fecha + ' ' + hora;
  document.getElementById('servicesRefSummary').textContent = refGen;
  document.getElementById('servicesTypeSummary').textContent = tipo;
  document.getElementById('servicesValueSummary').textContent = valor.toLocaleString('es-CO');
  mostrarDatosUsuario();
  mostrarTransaccionesUsuario();
});

// Extracto bancario
const formularioExtracto = document.getElementById('statementForm');
formularioExtracto.addEventListener('submit', function(e) {
  e.preventDefault();
  const year = document.getElementById('statementYear').value;
  const month = document.getElementById('statementMonth').value;
  const tbody = document.getElementById('statementTableBody');
  tbody.innerHTML = '';
  const filtrados = movimientosUsuario.filter(mov => {
    const d = new Date(mov.fecha);
    return d.getFullYear() == year && (d.getMonth()+1) == parseInt(month);
  });
  let saldoInicial = usuarioActivo.balance;
  let saldoFinal = usuarioActivo.balance;
  // Calcular saldo inicial y final
  let movimientosAntes = movimientosUsuario.filter(mov => {
    const d = new Date(mov.fecha);
    return d.getFullYear() < year || (d.getFullYear() == year && (d.getMonth()+1) < parseInt(month));
  });
  saldoInicial = movimientosAntes.reduce((acc, mov) => acc + mov.valor, 0);
  saldoFinal = saldoInicial + filtrados.reduce((acc, mov) => acc + mov.valor, 0);
  // Mostrar movimientos
  if (filtrados.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6" style="text-align:center;color:#888;">No hay movimientos para este periodo.</td>';
    tbody.appendChild(tr);
  } else {
    filtrados.forEach(mov => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${mov.fecha} ${mov.hora || ''}</td><td>${mov.ref}</td><td>${mov.tipo}</td><td>${mov.desc}</td><td>${mov.valor<0?'-':''}$${Math.abs(mov.valor).toLocaleString('es-CO')}</td>`;
      tbody.appendChild(tr);
    });
  }
  // Mostrar saldo inicial y final
  const table = tbody.parentElement;
  let tfoot = table.querySelector('tfoot');
  if (!tfoot) {
    tfoot = document.createElement('tfoot');
    table.appendChild(tfoot);
  }
  tfoot.innerHTML = `<tr><td colspan="4" style="text-align:right;font-weight:600;">Saldo inicial:</td><td>$${saldoInicial.toLocaleString('es-CO')}</td></tr>
    <tr><td colspan="4" style="text-align:right;font-weight:600;">Saldo final:</td><td>$${saldoFinal.toLocaleString('es-CO')}</td></tr>`;
  document.getElementById('statementResult').style.display = 'block';
  // Botón de impresión
  if (!document.getElementById('printStatementBtn')) {
    const btn = document.createElement('button');
    btn.id = 'printStatementBtn';
    btn.textContent = 'Imprimir Extracto';
    btn.onclick = function() { imprimirSeccion('statement'); };
    document.getElementById('statementResult').appendChild(btn);
  }
});

// Inicialización
window.onload = function() {
  mostrarDatosUsuario();
  mostrarTransaccionesUsuario();
  mostrarSeccionDashboard('overview');
};

// Cerrar sesión (demo)
function logout() {
  localStorage.removeItem('activeUser');
  window.location.href = 'index.html';
}

// Lógica menú hamburguesa responsive
window.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.querySelector('.sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
    // Cerrar menú al hacer clic fuera
    document.body.addEventListener('click', function(e) {
      if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
          sidebar.classList.remove('open');
          document.body.classList.remove('menu-open');
        }
      }
    });
    // Cerrar menú al seleccionar una opción
    sidebar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
          sidebar.classList.remove('open');
          document.body.classList.remove('menu-open');
        }
      });
    });
  }
});
  