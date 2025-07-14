# ProyectoAcmebank_JormanEstepa

## Descripción
Aplicación web para la autogestión de cuentas bancarias, desarrollada en JavaScript puro, HTML y CSS. Permite a los usuarios crear cuentas, iniciar sesión, gestionar transacciones, consultar extractos y recuperar contraseñas, todo con persistencia en el navegador.

## Instalación y Ejecución
1. Clona o descarga este repositorio.
2. Abre el archivo `index.html` en tu navegador preferido (no requiere backend).

## Estructura de Carpetas
```
ProyectoBancoAcme/
  ├── assets/           # Imágenes y recursos
  ├── css/              # Hojas de estilo
  ├── js/               # Scripts JavaScript
  ├── index.html        # Inicio de sesión
  ├── registro.html     # Registro de usuario
  ├── recuperacion.html # Recuperación de contraseña
  ├── main.html         # Dashboard principal
  └── README.md         # Documentación
```

## Funcionalidades
- **Inicio de sesión:** Validación en tiempo real, mensajes claros, acceso seguro al dashboard.
- **Registro:** Todos los campos obligatorios, validación en tiempo real, generación automática de número de cuenta.
- **Recuperación de contraseña:** Validación de identidad y cambio seguro de contraseña.
- **Dashboard:**
  - Resumen de cuenta (número, saldo, fecha de creación)
  - Últimas 10 transacciones (tabla, impresión)
  - Consignación electrónica (formulario, resumen, impresión)
  - Retiro de dinero (formulario, resumen, impresión)
  - Pago de servicios públicos (formulario, resumen, impresión)
  - Extracto bancario (filtro por año/mes, impresión, saldo inicial/final)
  - Certificado bancario (modelo imprimible)
  - Cerrar sesión
- **Persistencia:** Todos los datos se almacenan en LocalStorage en formato JSON.
- **Diseño:** Responsive, accesible, colores y tipografía profesional, animaciones simples.

## Accesibilidad
- Navegación por teclado
- Etiquetas y roles ARIA en formularios y tablas
- Contraste y enfoque visual mejorados

## Créditos
- Desarrollado por: ColverDev07
- Proyecto académico para Banco Acme 