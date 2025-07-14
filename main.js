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

// Consignar dinero
function consignar() {
  const monto = parseFloat(prompt('¿Cuánto deseas consignar?'));
  if (isNaN(monto) || monto <= 0) {
    alert('Monto inválido.');
    return;
  }
  let user = JSON.parse(localStorage.getItem('activeUser'));
  user.balance += monto;
  document.getElementById('balance').textContent = user.balance.toFixed(2);
  // Actualizar en localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', JSON.stringify(user));
  alert('Consignación exitosa.');
}

// Retirar dinero
function retirar() {
  const monto = parseFloat(prompt('¿Cuánto deseas retirar?'));
  let user = JSON.parse(localStorage.getItem('activeUser'));
  if (isNaN(monto) || monto <= 0) {
    alert('Monto inválido.');
    return;
  }
  if (monto > user.balance) {
    alert('Saldo insuficiente.');
    return;
  }
  user.balance -= monto;
  document.getElementById('balance').textContent = user.balance.toFixed(2);
  // Actualizar en localStorage
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('activeUser', JSON.stringify(user));
  alert('Retiro exitoso.');
}

// Cerrar sesión
function logout() {
  localStorage.removeItem('activeUser');
  window.location.href = 'index.html';
}

// Asignar eventos a botones de las secciones
window.onload = function() {
  loadUserData();

  // Navegación de secciones
  document.querySelector('button[onclick*="showSection(\'deposit\')"]').onclick = function() {
    showSection('deposit');
  };
  document.querySelector('button[onclick*="showSection(\'withdraw\')"]').onclick = function() {
    showSection('withdraw');
  };

  // Consignar dinero con formulario
  const depositForm = document.getElementById('depositForm');
  if (depositForm) {
    depositForm.onsubmit = function(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('depositAmount').value);
      const msg = document.getElementById('depositMsg');
      msg.style.display = 'none';
      if (isNaN(amount) || amount <= 0) {
        msg.textContent = 'Monto inválido.';
        msg.className = 'error-message';
        msg.style.display = 'block';
        return;
      }
      let user = JSON.parse(localStorage.getItem('activeUser'));
      user.balance += amount;
      document.getElementById('balance').textContent = user.balance.toFixed(2);
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('activeUser', JSON.stringify(user));
      msg.textContent = 'Consignación exitosa.';
      msg.className = 'success-message';
      msg.style.display = 'block';
      depositForm.reset();
    };
  }

  // Retirar dinero con formulario
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.onsubmit = function(e) {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('withdrawAmount').value);
      const msg = document.getElementById('withdrawMsg');
      msg.style.display = 'none';
      let user = JSON.parse(localStorage.getItem('activeUser'));
      if (isNaN(amount) || amount <= 0) {
        msg.textContent = 'Monto inválido.';
        msg.className = 'error-message';
        msg.style.display = 'block';
        return;
      }
      if (amount > user.balance) {
        msg.textContent = 'Saldo insuficiente.';
        msg.className = 'error-message';
        msg.style.display = 'block';
        return;
      }
      user.balance -= amount;
      document.getElementById('balance').textContent = user.balance.toFixed(2);
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.map(u => (u.accountNumber === user.accountNumber ? user : u));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('activeUser', JSON.stringify(user));
      msg.textContent = 'Retiro exitoso.';
      msg.className = 'success-message';
      msg.style.display = 'block';
      withdrawForm.reset();
    };
  }
}; 