// Utilidad para mostrar secciones
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

// Cargar usuario activo y datos
function loadUserData() {
  const user = JSON.parse(localStorage.getItem('activeUser'));
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('welcomeUser').textContent = `Bienvenido, ${user.firstName}`;
  document.getElementById('accountNumber').textContent = user.accountNumber;
  document.getElementById('createdAt').textContent = user.createdAt;
  document.getElementById('balance').textContent = user.balance.toFixed(2);
}

// Mostrar transacciones ficticias
function mostrarTransacciones() {
  const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
  const user = JSON.parse(localStorage.getItem('activeUser'));
  const lista = transacciones.filter(t => t.accountNumber === user.accountNumber);
  let html = '<div class="card"><h3>Últimos Movimientos</h3>';
  if (lista.length === 0) {
    html += '<p>No hay transacciones registradas.</p>';
  } else {
    html += '<ul style="padding-left:1.2em;">';
    lista.slice(-10).reverse().forEach(t => {
      html += `<li>${t.date} - ${t.type} - $${t.amount.toFixed(2)}</li>`;
    });
    html += '</ul>';
  }
  html += '</div>';
  document.getElementById('transactions').innerHTML = html;
}

// Formulario visual para consignar
function mostrarConsignar() {
  document.getElementById('deposit').innerHTML = `<div class="card"><h3>Consignar Dinero</h3>
    <form id="formConsignar"><input type="number" min="1" step="0.01" placeholder="Monto a consignar" required style="margin-bottom:1rem;width:100%;padding:0.7rem;">
    <button type="submit">Consignar</button></form></div>`;
  document.getElementById('formConsignar').onsubmit = function(e) {
    e.preventDefault();
    const monto = parseFloat(this.querySelector('input').value);
    if (isNaN(monto) || monto <= 0) return alert('Monto inválido.');
    let user = JSON.parse(localStorage.getItem('activeUser'));
    user.balance += monto;
    document.getElementById('balance').textContent = user.balance.toFixed(2);
    // Guardar transacción
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    transacciones.push({accountNumber: user.accountNumber, type: 'Consignación', amount: monto, date: new Date().toLocaleString()});
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    // Actualizar usuario
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(user));
    alert('Consignación exitosa.');
    this.reset();
  };
}

// Formulario visual para retirar
function mostrarRetirar() {
  document.getElementById('withdraw').innerHTML = `<div class="card"><h3>Retirar Dinero</h3>
    <form id="formRetirar"><input type="number" min="1" step="0.01" placeholder="Monto a retirar" required style="margin-bottom:1rem;width:100%;padding:0.7rem;">
    <button type="submit">Retirar</button></form></div>`;
  document.getElementById('formRetirar').onsubmit = function(e) {
    e.preventDefault();
    const monto = parseFloat(this.querySelector('input').value);
    let user = JSON.parse(localStorage.getItem('activeUser'));
    if (isNaN(monto) || monto <= 0) return alert('Monto inválido.');
    if (monto > user.balance) return alert('Saldo insuficiente.');
    user.balance -= monto;
    document.getElementById('balance').textContent = user.balance.toFixed(2);
    // Guardar transacción
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    transacciones.push({accountNumber: user.accountNumber, type: 'Retiro', amount: monto, date: new Date().toLocaleString()});
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    // Actualizar usuario
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(user));
    alert('Retiro exitoso.');
    this.reset();
  };
}

// Pago de servicios ficticio
function mostrarServicios() {
  document.getElementById('services').innerHTML = `<div class="card"><h3>Pagar Servicios</h3>
    <form id="formServicios">
      <input type="text" placeholder="Nombre del servicio" required style="margin-bottom:0.7rem;width:100%;padding:0.7rem;">
      <input type="number" min="1" step="0.01" placeholder="Monto a pagar" required style="margin-bottom:1rem;width:100%;padding:0.7rem;">
      <button type="submit">Pagar</button>
    </form></div>`;
  document.getElementById('formServicios').onsubmit = function(e) {
    e.preventDefault();
    const servicio = this.querySelector('input[type=text]').value;
    const monto = parseFloat(this.querySelector('input[type=number]').value);
    let user = JSON.parse(localStorage.getItem('activeUser'));
    if (isNaN(monto) || monto <= 0) return alert('Monto inválido.');
    if (monto > user.balance) return alert('Saldo insuficiente.');
    user.balance -= monto;
    document.getElementById('balance').textContent = user.balance.toFixed(2);
    // Guardar transacción
    let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
    transacciones.push({accountNumber: user.accountNumber, type: `Pago: ${servicio}`, amount: monto, date: new Date().toLocaleString()});
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    // Actualizar usuario
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify(user));
    alert('Pago realizado.');
    this.reset();
  };
}

// Extracto ficticio
function mostrarExtracto() {
  const user = JSON.parse(localStorage.getItem('activeUser'));
  let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
  transacciones = transacciones.filter(t => t.accountNumber === user.accountNumber);
  let html = '<div class="card"><h3>Extracto Bancario</h3>';
  if (transacciones.length === 0) {
    html += '<p>No hay movimientos.</p>';
  } else {
    html += '<table style="width:100%;margin-top:1rem;"><thead><tr><th>Fecha</th><th>Tipo</th><th>Monto</th></tr></thead><tbody>';
    transacciones.slice(-20).reverse().forEach(t => {
      html += `<tr><td>${t.date}</td><td>${t.type}</td><td>$${t.amount.toFixed(2)}</td></tr>`;
    });
    html += '</tbody></table>';
  }
  html += '</div>';
  document.getElementById('statement').innerHTML = html;
}

// Certificado ficticio
function mostrarCertificado() {
  const user = JSON.parse(localStorage.getItem('activeUser'));
  let html = `<div class="card"><h3>Certificado Bancario</h3>
    <p><strong>Nombre:</strong> ${user.firstName} ${user.lastName}</p>
    <p><strong>Número de cuenta:</strong> ${user.accountNumber}</p>
    <p><strong>Saldo actual:</strong> $${user.balance.toFixed(2)}</p>
    <p><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</p>
    <p style="margin-top:1.5rem;font-size:0.95rem;color:#888;">Este certificado es generado automáticamente y no tiene validez legal.</p>
  </div>`;
  document.getElementById('certificate').innerHTML = html;
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('activeUser');
  window.location.href = 'index.html';
}

// Asignar eventos a botones de las secciones
window.onload = function() {
  loadUserData();
  // Navegación y acciones
  document.querySelector('button[onclick*="showSection(\'overview\')"]').onclick = function() {
    showSection('overview');
  };
  document.querySelector('button[onclick*="showSection(\'transactions\')"]').onclick = function() {
    showSection('transactions');
    mostrarTransacciones();
  };
  document.querySelector('button[onclick*="showSection(\'deposit\')"]').onclick = function() {
    showSection('deposit');
    mostrarConsignar();
  };
  document.querySelector('button[onclick*="showSection(\'withdraw\')"]').onclick = function() {
    showSection('withdraw');
    mostrarRetirar();
  };
  document.querySelector('button[onclick*="showSection(\'services\')"]').onclick = function() {
    showSection('services');
    mostrarServicios();
  };
  document.querySelector('button[onclick*="showSection(\'statement\')"]').onclick = function() {
    showSection('statement');
    mostrarExtracto();
  };
  document.querySelector('button[onclick*="showSection(\'certificate\')"]').onclick = function() {
    showSection('certificate');
    mostrarCertificado();
  };
}; 