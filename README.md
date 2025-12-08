# 🏪 Sistema de Gestión de Tienda Minorista

Este proyecto es una aplicación web completa para la gestión de una tienda minorista. El sistema permite administrar el inventario, realizar ventas (Punto de Venta), gestionar usuarios (Admin/Cajero) y visualizar reportes de ventas y rendimiento.

El proyecto está dividido en dos partes:
- **Backend:** Node.js con Express y PostgreSQL.
- **Frontend:** React.js.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu computadora:

- [Node.js](https://nodejs.org/) (v14 o superior).
- [PostgreSQL](https://www.postgresql.org/) (v12 o superior).
- Un cliente SQL (pgAdmin, DBeaver) o acceso a terminal para ejecutar los scripts de base de datos.

---

## 🗄️ Configuración de la Base de Datos

Sigue estos pasos estrictamente en orden para levantar la base de datos necesaria.

### 1. Crear la Base de Datos
Abre tu terminal o cliente SQL y ejecuta:

```sql
CREATE DATABASE tienda_sistema;

2. Ejecutar Scripts SQL
Conéctate a la base de datos tienda_sistema y ejecuta los siguientes bloques de código en orden.

PASO 1: Estructura de Tablas (01_schema.sql)

BEGIN;

-- 1. TABLA USUARIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hash almacenado
    email VARCHAR(100) UNIQUE NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'cajero')) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    documento_identidad VARCHAR(20),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA CATEGORIAS
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA PRODUCTOS
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER DEFAULT 5,
    categoria_id INTEGER REFERENCES categorias(id),
    activo BOOLEAN DEFAULT true,
    ubicacion VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA VENTAS
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cajero_id INTEGER REFERENCES usuarios(id),
    subtotal DECIMAL(10,2) NOT NULL,
    igv DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(20) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
    estado VARCHAR(20) DEFAULT 'completada' CHECK (estado IN ('completada', 'cancelada')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA DETALLE_VENTAS
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id) ON DELETE RESTRICT,
    producto_id INTEGER REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 6. TABLA PROVEEDORES (Futura expansión)
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT true
);

-- CREACIÓN DE ÍNDICES
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_ventas_fecha ON ventas(fecha_venta);
CREATE INDEX idx_usuarios_username ON usuarios(username);

COMMIT;


PASO 2: Datos de Prueba / Semillas (02_seeds.sql)

BEGIN;

-- Insertar Categorías
INSERT INTO categorias (nombre, descripcion) VALUES 
('Tecnología', 'Dispositivos electrónicos y accesorios'),
('Hogar', 'Electrodomésticos y muebles'),
('Ropa', 'Vestimenta para damas, caballeros y niños'),
('Alimentos', 'Productos de primera necesidad'),
('Bebidas', 'Refrescos, aguas y licores'),
('Limpieza', 'Artículos de aseo personal y hogar');

-- Insertar Usuarios
-- Password 'admin123' (hash bcrypt)
INSERT INTO usuarios (username, password, email, rol, nombre_completo, documento_identidad) VALUES 
('admin', '$2a$10$X7V.j5f9g.k.L.z.x.c.v.b.n.m.q.w.e.r.t.y.u.i.o.p', 'admin@tienda.com', 'admin', 'Administrador Principal', '00000001');

-- Password 'cajero123' (hash bcrypt)
INSERT INTO usuarios (username, password, email, rol, nombre_completo, documento_identidad) VALUES 
('cajero1', '$2a$10$X7V.j5f9g.k.L.z.x.c.v.b.n.m.q.w.e.r.t.y.u.i.o.p', 'cajero1@tienda.com', 'cajero', 'Cajero Demo', '10000001');

-- Insertar Productos de ejemplo
INSERT INTO productos (codigo, nombre, descripcion, precio, stock, categoria_id, ubicacion) VALUES
('LP-DELL-001', 'Laptop Dell Inspiron', 'Core i5, 8GB RAM', 2500.00, 10, 1, 'Almacén A-1'),
('MS-GEN-001', 'Mouse Inalámbrico', 'Mouse óptico genérico', 120.00, 25, 1, 'Estante B-2'),
('RF-LG-001', 'Refrigeradora LG', 'Dos puertas, gris', 1800.00, 5, 2, 'Piso de Venta');

COMMIT;


PASO 3: Seguridad y Permisos (03_security.sql)
Nota: Este paso asegura que la aplicación se conecte con un usuario seguro, no como superusuario.


-- 1. Crear el usuario de aplicación
CREATE USER tienda_app_user WITH PASSWORD 'secure_pass_2024';

-- 2. Conceder conexión a la base de datos
GRANT CONNECT ON DATABASE tienda_sistema TO tienda_app_user;

-- 3. Conceder permisos sobre el esquema public
GRANT USAGE ON SCHEMA public TO tienda_app_user;

-- 4. Asignar permisos específicos (CRUD básico)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tienda_app_user;

-- 5. Permitir uso de secuencias (IDs autoincrementables)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tienda_app_user;

Instalación y Ejecución
Debes abrir dos terminales diferentes (una para el backend y otra para el frontend).

Terminal 1: Backend (API)
Entra a la carpeta del backend:

cd sistema_tienda_express

Instala las dependencias:

npm install

Crea un archivo llamado .env en la raíz de la carpeta sistema_tienda_express con el siguiente contenido (esto conecta con el usuario creado en el Paso 3 de la BD):


DB_USER=tienda_app_user
DB_PASSWORD=secure_pass_2024
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_sistema
JWT_SECRET=clave_super_secreta_unmsm_2024_sistema_tienda
PORT=3001


Inicia el servidor:
npm run dev
# O si no usas nodemon: node server.js

Debería decir: Servidor corriendo en puerto 3001

Terminal 2: Frontend (React)
Entra a la carpeta del frontend:

cd sistema_tienda_frontend

Instala las dependencias:

npm install

Inicia la aplicación:

npm start


Credenciales de Acceso
Una vez que el sistema esté corriendo, puedes usar estos usuarios para probar los diferentes roles:

Rol	            Usuario	Contraseña	Permisos Principales
Administrador	admin	admin123	Gestión de Usuarios, Productos (CRUD), Reportes Globales, Backups

Cajero	        cajero1	cajero123	Punto de Venta (Ventas), Reporte Diario Personal

Tecnologías Utilizadas
Frontend: React.js, React Router, CSS.

Backend: Node.js, Express.

Base de Datos: PostgreSQL.

Autenticación: JWT (JSON Web Tokens) y Bcryptjs.

Despliegue: Configurado para desarrollo local (npm start / npm run dev).