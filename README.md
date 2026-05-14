# Pink Room Nails 💅

Sistema de gestión para salón de uñas "Pink Room Nails". El proyecto consta de una API construida con Laravel y una aplicación web moderna con React + Vite.

## 🚀 Estructura del Proyecto

- `/backend`: API REST desarrollada en **Laravel 12**.
- `/frontend`: Aplicación cliente desarrollada con **React 19** y **Vite**.

---

## 🛠️ Tecnologías y Librerías

### Backend (Laravel)
- **Framework:** Laravel 12.x
- **Autenticación:** Laravel Sanctum (Tokens API).
- **Base de Datos:** PostgreSQL (o compatible como MySQL/SQLite).
- **Librerías Clave:**
  - `laravel/sanctum`: Manejo de tokens y sesiones.
  - `laravel/tinker`: Consola interactiva.
  - `fakerphp/faker`: Generación de datos de prueba.

### Frontend (React)
- **Framework/Bundler:** Vite
- **UI & Estilos:**
  - **Tailwind CSS 4**: Diseño moderno y responsivo.
  - **Framer Motion**: Animaciones fluidas.
  - **Lucide React & React Icons**: Set de iconos premium.
- **Estado y Navegación:**
  - **React Router Dom v7**: Gestión de rutas.
  - **Axios**: Cliente HTTP para conectar con la API.
- **Utilidades:**
  - **date-fns**: Manejo y formateo de fechas.
  - **React Hot Toast**: Notificaciones elegantes.
  - **Recharts**: Gráficos para el dashboard.

---

## 💻 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente después de clonarlo.

### 1. Clonar el repositorio
```bash
git clone https://github.com/jordyymerooo/pinkroomnails.git
cd pinkroomnails
```

### 2. Configurar el Backend
```bash
cd backend
# Instalar dependencias de PHP
composer install
# Instalar dependencias de JS (Vite/Tailwind)
npm install
# Crear archivo de entorno
cp .env.example .env
# Generar la clave de la aplicación
php artisan key:generate
```
> [!IMPORTANT]
> Configura tus credenciales de base de datos en el archivo `.env`. Luego ejecuta las migraciones:
> ```bash
> php artisan migrate
> ```

### 3. Configurar el Frontend
```bash
cd ../frontend
# Instalar dependencias
npm install
# Crear archivo de entorno (si aplica)
cp .env.example .env
```
> [!NOTE]
> Asegúrate de que `VITE_API_BASE_URL` en el `.env` del frontend apunte a la dirección de tu backend (ej. `http://localhost:8000/api`).

---

## 🏃 Ejecución

### Ejecutar Backend
En la carpeta `/backend`:
```bash
php artisan serve
```
*El servidor correrá normalmente en `http://localhost:8000`*

### Ejecutar Frontend
En la carpeta `/frontend`:
```bash
npm run dev
```
*La aplicación estará disponible en `http://localhost:5173`*

---

## ✨ Características Principales
- 📅 Gestión de Citas (Appointments).
- 💅 Catálogo de Servicios por Categorías.
- 🖼️ Galería de Inspiración interactiva.
- 📊 Dashboard Administrativo con reportes mensuales.
- 🔒 Autenticación de Administrador.
- 📱 Diseño totalmente responsivo.

---
Desarrollado con ❤️ para Pink Room Nails.
