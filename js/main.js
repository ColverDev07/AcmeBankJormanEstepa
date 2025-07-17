// Utilidades para demo (simulación de usuario y movimientos)
// Lee el usuario activo y sus movimientos desde LocalStorage
let usuarioActivo = JSON.parse(localStorage.getItem('activeUser'));
if (!usuarioActivo) {
  window.location.href = 'index.html';
}
let movimientosUsuario = JSON.parse(localStorage.getItem(`movimientos_${usuarioActivo.accountNumber}`)) || [];

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
 * Carga y muestra los datos del certificado bancario del usuario activo.
 * Se usa en la sección de certificado.
 */
function cargarDatosCertificado() {
  console.log('=== CARGANDO DATOS DEL CERTIFICADO ===');
  console.log('Usuario activo:', usuarioActivo);
  
  if (!usuarioActivo) {
    console.error('No hay usuario activo');
    return;
  }
  
  // Extraer nombre completo
  const nombre = usuarioActivo.firstName && usuarioActivo.lastName
    ? `${usuarioActivo.firstName} ${usuarioActivo.lastName}`
    : (usuarioActivo.nombre || usuarioActivo.name || 'Usuario');
  
  // Extraer número de cuenta
  const numeroCuenta = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  
  // Extraer fecha de creación
  const fechaCreacion = usuarioActivo.createdAt || usuarioActivo.creado || 'No disponible';
  
  // Extraer ciudad
  const ciudad = usuarioActivo.city || usuarioActivo.ciudad || 'No disponible';
  
  // Fecha actual
  const hoy = new Date();
  const fechaActual = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()}`;
  
  console.log('Datos extraídos:', {
    nombre,
    numeroCuenta,
    fechaCreacion,
    ciudad,
    fechaActual
  });
  
  // Asignar datos a los elementos del certificado
  const elementos = {
    'certificateFullName': nombre,
    'certificateAccountNumber': numeroCuenta,
    'certificateCreatedAt': fechaCreacion,
    'certificateCity': ciudad,
    'certificateDate': fechaActual
  };
  
  // Asignar cada dato y verificar
  Object.entries(elementos).forEach(([id, valor]) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
      console.log(`✅ ${id}: "${valor}"`);
    } else {
      console.error(`❌ Elemento no encontrado: ${id}`);
    }
  });
  
  console.log('=== FIN CARGANDO CERTIFICADO ===');
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

  // Siempre actualizar datos del usuario al cambiar de sección
  mostrarDatosUsuario();

  // Si se muestra el certificado, cargar datos específicos
  if (id === 'certificate') {
    setTimeout(() => cargarDatosCertificado(), 100);
  }
}

/**
 * Imprime una sección específica del dashboard (extracto, resumen, etc).
 * @param {string} id - ID del contenedor a imprimir.
 */
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
 * Actualiza nombre, saldo, número de cuenta, etc.
 */
function mostrarDatosUsuario() {
  console.log('=== DEBUG: Datos del usuario activo ===');
  console.log('Usuario activo:', usuarioActivo);
  
  // Bienvenida y resumen
  const nombre = usuarioActivo.firstName && usuarioActivo.lastName
    ? `${usuarioActivo.firstName} ${usuarioActivo.lastName}`
    : (usuarioActivo.nombre || usuarioActivo.name || 'Usuario');
  console.log('Nombre extraído:', nombre);
  
  document.getElementById('welcomeUser').textContent = `Bienvenido, ${nombre}`;
  document.getElementById('accountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  document.getElementById('createdAt').textContent = usuarioActivo.createdAt || usuarioActivo.creado || 'No disponible';
  document.getElementById('balance').textContent = (usuarioActivo.balance !== undefined ? usuarioActivo.balance : 0).toLocaleString('es-CO');
  // Consignar
  document.getElementById('depositAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  document.getElementById('depositFullName').textContent = nombre;
  // Retirar
  document.getElementById('withdrawAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  document.getElementById('withdrawFullName').textContent = nombre;
  // Servicios
  document.getElementById('servicesAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  document.getElementById('servicesFullName').textContent = nombre;
  // Extracto
  document.getElementById('statementAccountNumber').textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  document.getElementById('statementFullName').textContent = nombre;
  // Certificado
  const certificateFullName = document.getElementById('certificateFullName');
  const certificateAccountNumber = document.getElementById('certificateAccountNumber');
  const certificateCreatedAt = document.getElementById('certificateCreatedAt');
  const certificateCity = document.getElementById('certificateCity');
  const certificateDate = document.getElementById('certificateDate');
  
  if (certificateFullName) certificateFullName.textContent = nombre;
  if (certificateAccountNumber) certificateAccountNumber.textContent = usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible';
  if (certificateCreatedAt) certificateCreatedAt.textContent = usuarioActivo.createdAt || usuarioActivo.creado || 'No disponible';
  if (certificateCity) certificateCity.textContent = usuarioActivo.city || usuarioActivo.ciudad || 'No disponible';
  if (certificateDate) {
    const hoy = new Date();
    certificateDate.textContent = `${hoy.getDate()}/${hoy.getMonth()+1}/${hoy.getFullYear()}`;
  }
  
  console.log('=== Datos del certificado ===');
  console.log('Nombre:', nombre);
  console.log('Cuenta:', usuarioActivo.accountNumber || usuarioActivo.cuenta || 'No disponible');
  console.log('Fecha creación:', usuarioActivo.createdAt || usuarioActivo.creado || 'No disponible');
  console.log('Ciudad:', usuarioActivo.city || usuarioActivo.ciudad || 'No disponible');
  console.log('=== FIN DEBUG ===');
}

/**
 * Muestra las últimas 10 transacciones del usuario activo en la tabla de transacciones.
 * Se usa en la sección de transacciones del dashboard.
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

// Retiro
const formularioRetiro = document.getElementById('withdrawForm');
// Elimino el antiguo submit de retiro (si existe)
if (typeof formularioRetiro !== 'undefined' && formularioRetiro) {
  formularioRetiro.removeEventListener('submit', formularioRetiro.onsubmit);
}

window.addEventListener('DOMContentLoaded', function() {
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    const withdrawAmount = document.getElementById('withdrawAmount');
    const withdrawMsg = document.getElementById('withdrawMsg');
    const withdrawSummary = document.getElementById('withdrawSummary');
    /**
     * Maneja el flujo de retiro de dinero:
     * - Valida el monto
     * - Actualiza el saldo y movimientos en localStorage
     * - Muestra un resumen visual con saldo actual
     * - Actualiza el dashboard y transacciones
     */
    withdrawForm.onsubmit = function(e) {
      e.preventDefault();
      withdrawMsg.style.display = 'none';
      withdrawSummary.style.display = 'none';
      const amount = parseFloat(withdrawAmount.value);
      if (isNaN(amount) || amount <= 0) {
        withdrawMsg.textContent = 'Ingrese un monto válido.';
        withdrawMsg.style.display = 'block';
        return;
      }
      let user = JSON.parse(localStorage.getItem('activeUser'));
      if (user.balance < amount) {
        withdrawMsg.textContent = 'Saldo insuficiente.';
        withdrawMsg.style.display = 'block';
        return;
      }
      // Simula proceso
      setTimeout(() => {
        try {
          user.balance -= amount;
          let users = JSON.parse(localStorage.getItem('users')) || [];
          users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('activeUser', JSON.stringify(user));
          // Guardar movimiento
          let movimientos = JSON.parse(localStorage.getItem(`movimientos_${user.accountNumber}`)) || [];
          const now = new Date();
          const fecha = now.toISOString().slice(0,10);
          const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const ref = Math.random().toString(36).substring(2,8).toUpperCase();
          movimientos.push({fecha, hora, ref, tipo:'Retiro', desc:'Retiro de dinero', valor: -amount, referencia: ref});
          localStorage.setItem(`movimientos_${user.accountNumber}`, JSON.stringify(movimientos));
          // Mostrar resumen visual
          withdrawSummary.style.display = 'block';
          document.getElementById('withdrawDate').textContent = fecha + ' ' + hora;
          document.getElementById('withdrawRef').textContent = ref;
          document.getElementById('withdrawValue').textContent = amount.toLocaleString('es-CO');
          // Mostrar saldo actual
          let saldoEl = document.getElementById('withdrawSaldo');
          if (!saldoEl) {
            const p = document.createElement('p');
            p.innerHTML = '<strong>Saldo actual:</strong> <span id="withdrawSaldo"></span>';
            document.getElementById('withdrawSummary').appendChild(p);
            saldoEl = document.getElementById('withdrawSaldo');
          }
          saldoEl.textContent = user.balance.toLocaleString('es-CO');
          withdrawForm.reset();
          // Actualizar dashboard y transacciones
          actualizarTarjetaCreditoDashboard(user);
          renderTransaccionesDashboard(user);
        } catch (err) {
          withdrawMsg.textContent = 'Ocurrió un error inesperado.';
          withdrawMsg.style.display = 'block';
        }
      }, 1200);
    };
  }
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
  // Elimino las llamadas a actualizarUsuarioActivo y guardarMovimientosUsuario
  mostrarNotificacion('Pago de servicio realizado con éxito.');
  document.getElementById('servicesMsg').style.display = 'none';
  // Resumen
  document.getElementById('servicesSummary').style.display = 'block';
  document.getElementById('servicesDate').textContent = fecha + ' ' + hora;
  document.getElementById('servicesRefSummary').textContent = refGen;
  document.getElementById('servicesTypeSummary').textContent = tipo;
  document.getElementById('servicesValueSummary').textContent = valor.toLocaleString('es-CO');
  mostrarDatosUsuario(); // Actualiza en tiempo real
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
  
  // Agregar botón de debug al certificado
  setTimeout(() => {
    const certificateSection = document.getElementById('certificate');
    if (certificateSection) {
      const debugBtn = document.createElement('button');
      debugBtn.textContent = '🔧 Debug Certificado';
      debugBtn.style.cssText = 'background: #ff6b6b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; margin: 1rem 0; cursor: pointer;';
      debugBtn.onclick = cargarDatosCertificado;
      certificateSection.insertBefore(debugBtn, certificateSection.firstChild);
    }
  }, 1000);
}

/**
 * Actualiza la tarjeta de crédito en el dashboard con los datos del usuario.
 * Incluye saldo, nombre, color, últimos movimientos, etc.
 * @param {object} usuario - Objeto usuario a mostrar.
 */
function actualizarTarjetaCreditoDashboard(usuario) {
  if (!usuario) return;
  // Formatear número de cuenta tipo tarjeta (últimos 4 dígitos)
  let cuenta = usuario.accountNumber || '';
  let ultimos = cuenta.slice(-4);
  let cardNumber = '•••• •••• •••• ' + ultimos;
  document.getElementById('cardAccountNumber').textContent = cardNumber;
  document.getElementById('cardFullName').textContent = usuario.firstName + ' ' + usuario.lastName;

  // Saldo (oculto/visible)
  const saldoSpan = document.getElementById('cardBalance');
  const eyeIcon = document.getElementById('eyeIcon');
  let mostrarSaldo = localStorage.getItem('mostrarSaldo') !== 'false';
  saldoSpan.textContent = mostrarSaldo ? ('$' + (usuario.balance || 0).toLocaleString('es-CO', {minimumFractionDigits:2})) : '••••••';
  eyeIcon.textContent = mostrarSaldo ? '👁️' : '🙈';

  // Fecha de vencimiento
  document.getElementById('cardExpiry').textContent = usuario.expiry || '--/--';

  // Estado de la cuenta
  document.getElementById('cardStatus').textContent = usuario.status || 'Activa';

  // Color de tarjeta
  const cardDiv = document.getElementById('creditCard');
  const color = usuario.cardColor || '#00b6ff';
  cardDiv.style.background = `linear-gradient(135deg, #232325 60%, ${color} 100%)`;
  // Selector de color
  document.querySelectorAll('.color-option').forEach(opt => {
    if (opt.dataset.color === color) {
      opt.classList.add('selected');
    } else {
      opt.classList.remove('selected');
    }
  });

  // Últimos 3 movimientos
  const movimientos = JSON.parse(localStorage.getItem(`movimientos_${usuario.accountNumber}`)) || [];
  const ultimosMovs = movimientos.slice(-3).reverse();
  const movList = document.getElementById('lastMovementsList');
  movList.innerHTML = '';
  if (ultimosMovs.length === 0) {
    movList.innerHTML = '<li>No hay movimientos recientes.</li>';
  } else {
    ultimosMovs.forEach(mov => {
      const li = document.createElement('li');
      li.innerHTML = `<span class='credit-card__movements-date'>${mov.fecha || ''}</span><span class='credit-card__movements-type'>${mov.tipo || ''}</span><span class='credit-card__movements-value'>${mov.valor ? (mov.valor < 0 ? '-$' : '+$') + Math.abs(mov.valor).toLocaleString('es-CO') : ''}</span>`;
      movList.appendChild(li);
    });
  }
}

// --- EVENTOS DE INTERACCIÓN TARJETA ---
window.addEventListener('DOMContentLoaded', function() {
  let usuario = JSON.parse(localStorage.getItem('activeUser'));
  actualizarTarjetaCreditoDashboard(usuario);

  // Alternar visibilidad de saldo
  document.getElementById('toggleBalanceBtn').onclick = function() {
    let mostrar = localStorage.getItem('mostrarSaldo') !== 'false';
    localStorage.setItem('mostrarSaldo', (!mostrar).toString());
    actualizarTarjetaCreditoDashboard(usuario);
  };

  // Selector de color
  document.querySelectorAll('.color-option').forEach(opt => {
    opt.onclick = function() {
      usuario.cardColor = this.dataset.color;
      localStorage.setItem('activeUser', JSON.stringify(usuario));
      // Actualizar en lista de usuarios
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.map(u => u.accountNumber === usuario.accountNumber ? {...u, cardColor: usuario.cardColor} : u);
      localStorage.setItem('users', JSON.stringify(users));
      actualizarTarjetaCreditoDashboard(usuario);
    };
    opt.onkeydown = function(e) {
      if (e.key === 'Enter' || e.key === ' ') this.click();
    };
  });

  // Copiar número de cuenta
  document.getElementById('copyAccountBtn').onclick = function() {
    navigator.clipboard.writeText(usuario.accountNumber);
    this.classList.add('copied');
    this.title = '¡Copiado!';
    setTimeout(() => {
      this.classList.remove('copied');
      this.title = 'Copiar número de cuenta';
    }, 1200);
  };
});

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
  
/**
 * Renderiza el resumen, filtros y timeline de transacciones en el dashboard.
 * @param {object} usuario - Objeto usuario a mostrar.
 */
function renderTransaccionesDashboard(usuario) {
  if (!usuario) return;
  const movimientos = JSON.parse(localStorage.getItem(`movimientos_${usuario.accountNumber}`)) || [];
  // Filtros
  const texto = (document.getElementById('transBuscar')?.value || '').toLowerCase();
  const tipo = document.getElementById('transTipoFiltro')?.value || '';
  const fechaFiltro = document.getElementById('transFechaFiltro')?.value;

  let filtrados = movimientos.filter(mov => {
    let ok = true;
    if (texto) {
      ok = (mov.referencia || '').toLowerCase().includes(texto) || (mov.desc || '').toLowerCase().includes(texto);
    }
    if (ok && tipo) {
      ok = (mov.tipo || '').toLowerCase() === tipo.toLowerCase();
    }
    if (ok && fechaFiltro) {
      ok = (mov.fecha || '').startsWith(fechaFiltro);
    }
    return ok;
  });
  // Ordenar descendente
  filtrados = filtrados.sort((a,b) => (b.fecha || '').localeCompare(a.fecha || ''));

  // Resumen
  let saldo = usuario.balance || 0;
  let ingresos = movimientos.filter(m => m.valor > 0).reduce((a,b) => a + b.valor, 0);
  let egresos = movimientos.filter(m => m.valor < 0).reduce((a,b) => a + b.valor, 0);
  document.getElementById('transSaldo').textContent = '$' + saldo.toLocaleString('es-CO', {minimumFractionDigits:2});
  document.getElementById('transIngresos').textContent = '$' + ingresos.toLocaleString('es-CO', {minimumFractionDigits:2});
  document.getElementById('transEgresos').textContent = '$' + Math.abs(egresos).toLocaleString('es-CO', {minimumFractionDigits:2});

  // Timeline
  const timeline = document.getElementById('transactionsTimeline');
  timeline.innerHTML = '';
  if (filtrados.length === 0) {
    timeline.innerHTML = '<li class="transaction-item">No hay transacciones para mostrar.</li>';
    return;
  }
  filtrados.forEach(mov => {
    const li = document.createElement('li');
    let icon = '💸';
    let clase = '';
    if (mov.tipo === 'Consignación') { icon = '💰'; clase = 'ingreso'; }
    else if (mov.tipo === 'Retiro') { icon = '💸'; clase = 'egreso'; }
    else if (mov.tipo === 'Pago' || mov.tipo === 'Pago Servicio') { icon = '🧾'; clase = 'egreso'; }
    else if (mov.valor > 0) { clase = 'ingreso'; }
    else if (mov.valor < 0) { clase = 'egreso'; }
    li.className = `transaction-item ${clase}`;
    li.innerHTML = `
      <span class="transaction-icon" aria-hidden="true">${icon}</span>
      <div class="transaction-details">
        <span class="transaction-title">${mov.tipo || 'Transacción'}</span>
        <span class="transaction-desc">${mov.desc || ''}</span>
        <div class="transaction-meta">
          <span>${mov.fecha || ''}</span>
          <span>Ref: ${mov.referencia || ''}</span>
        </div>
      </div>
      <span class="transaction-value ${clase}">${mov.valor ? (mov.valor < 0 ? '-$' : '+$') + Math.abs(mov.valor).toLocaleString('es-CO') : ''}</span>
    `;
    timeline.appendChild(li);
  });
}

// --- EVENTOS DE FILTRO Y ACTUALIZACIÓN EN TIEMPO REAL ---
window.addEventListener('DOMContentLoaded', function() {
  let usuario = JSON.parse(localStorage.getItem('activeUser'));
  if (document.getElementById('transactionsTimeline')) {
    renderTransaccionesDashboard(usuario);
    ['transBuscar','transTipoFiltro','transFechaFiltro'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => renderTransaccionesDashboard(usuario));
      if (el && el.tagName === 'SELECT') el.addEventListener('change', () => renderTransaccionesDashboard(usuario));
    });
  }
});
  
// --- CONSIGNACIÓN MEJORADA ---
window.addEventListener('DOMContentLoaded', function() {
  const depositForm = document.getElementById('depositForm');
  if (depositForm) {
    const depositAmount = document.getElementById('depositAmount');
    const depositMsg = document.getElementById('depositMsg');
    const depositError = document.getElementById('depositError');
    const depositLoader = document.getElementById('depositLoader');
    const depositSummary = document.getElementById('depositSummary');
    const depositCopyBtn = document.getElementById('depositCopyBtn');
    const depositClearBtn = document.getElementById('depositClearBtn');
    // Validación en tiempo real
    depositAmount.addEventListener('input', function() {
      if (isNaN(this.value) || Number(this.value) <= 0) {
        depositError.textContent = 'Ingrese un monto válido.';
        depositError.style.display = 'block';
        depositMsg.style.display = 'none';
      } else {
        depositError.style.display = 'none';
      }
    });
    // Limpiar formulario
    depositClearBtn.onclick = function() {
      depositForm.reset();
      depositMsg.style.display = 'none';
      depositError.style.display = 'none';
      depositSummary.style.display = 'none';
      depositLoader.style.display = 'none';
      depositAmount.focus();
    };
    // Copiar resumen
          if (depositCopyBtn) {
        depositCopyBtn.onclick = function() {
          const resumen = `Consignación Exitosa\nFecha: ${document.getElementById('depositDate').textContent}\nReferencia: ${document.getElementById('depositRef').textContent}\nMonto: ${document.getElementById('depositValue').textContent}\nSaldo actual: ${document.getElementById('depositSaldo').textContent}`;
          navigator.clipboard.writeText(resumen);
          depositCopyBtn.textContent = '¡Copiado!';
          setTimeout(()=>{ depositCopyBtn.textContent = 'Copiar Resumen'; }, 1200);
        };
      }
      // Enviar formulario
      depositForm.onsubmit = function(e) {
        e.preventDefault();
        depositMsg.style.display = 'none';
        depositError.style.display = 'none';
        depositSummary.style.display = 'none';
        depositLoader.style.display = 'block';
        const amount = parseFloat(depositAmount.value);
        if (isNaN(amount) || amount <= 0) {
          depositLoader.style.display = 'none';
          depositError.textContent = 'Ingrese un monto válido.';
          depositError.style.display = 'block';
          return;
        }
        // Simula proceso
        setTimeout(() => {
          try {
            let user = JSON.parse(localStorage.getItem('activeUser'));
            user.balance += amount;
            if (document.getElementById('balance')) document.getElementById('balance').textContent = user.balance.toFixed(2);
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('activeUser', JSON.stringify(user));
            // Guardar movimiento
            let movimientos = JSON.parse(localStorage.getItem(`movimientos_${user.accountNumber}`)) || [];
            const now = new Date();
            const fecha = now.toISOString().slice(0,10);
            const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const ref = Math.random().toString(36).substring(2,8).toUpperCase();
            movimientos.push({fecha, hora, ref, tipo:'Consignación', desc:'Consignación por canal electrónico', valor: amount, referencia: ref});
            localStorage.setItem(`movimientos_${user.accountNumber}`, JSON.stringify(movimientos));
            // Mostrar resumen visual
            depositLoader.style.display = 'none';
            depositSummary.style.display = 'block';
            // Asignar valores SOLO si los elementos existen
            const elFecha = document.getElementById('depositDate');
            const elRef = document.getElementById('depositRef');
            const elValue = document.getElementById('depositValue');
            const elSaldo = document.getElementById('depositSaldo');
            if (!elFecha || !elRef || !elValue || !elSaldo) {
              console.error('Algún elemento del resumen es null:', {elFecha, elRef, elValue, elSaldo});
              depositError.textContent = 'Error interno: elemento de resumen no encontrado.';
              depositError.style.display = 'block';
              depositSummary.style.display = 'none';
              return;
            }
            elFecha.textContent = fecha + ' ' + hora;
            elRef.textContent = ref;
            elValue.textContent = '$' + amount.toLocaleString('es-CO');
            elSaldo.textContent = '$' + user.balance.toLocaleString('es-CO');
            // Leer valores antes de resetear
            const resumen = `Consignación Exitosa\nFecha: ${elFecha.textContent}\nReferencia: ${elRef.textContent}\nMonto: ${elValue.textContent}\nSaldo actual: ${elSaldo.textContent}`;
            depositForm.reset();
            // Actualizar dashboard y transacciones
            actualizarTarjetaCreditoDashboard(user);
            renderTransaccionesDashboard(user);
            // Asignar evento copiar resumen solo cuando el botón existe
            setTimeout(() => {
              const depositCopyBtn = document.getElementById('depositCopyBtn');
              if (depositCopyBtn) {
                depositCopyBtn.onclick = function() {
                  navigator.clipboard.writeText(resumen);
                  depositCopyBtn.textContent = '¡Copiado!';
                  setTimeout(()=>{ depositCopyBtn.textContent = 'Copiar Resumen'; }, 1200);
                };
              } else {
                console.warn('No se encontró el botón de copiar resumen');
              }
            }, 100);
          } catch (err) {
            depositLoader.style.display = 'none';
            depositError.textContent = 'Ocurrió un error inesperado.';
            depositError.style.display = 'block';
          }
        }, 1200);
      };
    }
  });

const withdrawAllBtn = document.getElementById('withdrawAllBtn');
if (withdrawAllBtn) {
  withdrawAllBtn.onclick = function() {
    // Obtener el saldo actual del usuario activo
    let usuario = JSON.parse(localStorage.getItem('activeUser'));
    if (usuario && usuario.balance > 0) {
      document.getElementById('withdrawAmount').value = usuario.balance;
    }
  };
}