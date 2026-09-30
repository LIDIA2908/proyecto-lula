# 🚀 Guía de Despliegue en Servidor Propio (VPS, Docker, Nginx, Node/PM2)

Esta guía detalla paso a paso cómo compilar y desplegar **Proyecto Lula** en tu propio servidor (VPS como Ubuntu/Debian/CentOS, servidor privado, Docker, o alojamiento tradicional como cPanel/Plesk).

---

## 📋 Requisitos Previos

Antes de desplegar, crea o edita tu archivo `.env` en la raíz del proyecto con las credenciales de producción:

```env
VITE_GEMINI_API_KEY=tu_clave_api_gemini
VITE_ELEVENLABS_API_KEY=tu_clave_api_elevenlabs
VITE_ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 🐳 Opción 1: Despliegue con Docker Compose (Recomendado)

El proyecto incluye un `Dockerfile` multietapa optimizado y un archivo `docker-compose.yml`.

### Pasos:

1. **Subir el proyecto a tu servidor** (mediante Git, SCP o rsync):
   ```bash
   git clone <tu-repositorio> proyecto-lula
   cd proyecto-lula
   ```

2. **Crear el archivo `.env`**:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Iniciar el contenedor**:
   ```bash
   docker compose up -d --build
   ```

4. Tu aplicación estará corriendo en el puerto **80** (`http://tu-ip-o-dominio.com`).

---

## ⚡ Opción 2: Servidor Node.js / PM2 (Sin Docker)

El proyecto incluye un servidor nativo ultra liviano en [`server.js`](file:///Users/lilium_07/Desktop/proyecto-lula/server.js) (en el puerto 3000 o configurable mediante `PORT`).

### Pasos:

1. **Instalar dependencias y compilar el paquete de producción**:
   ```bash
   npm install
   npm run build
   ```

2. **Probar el servidor en producción**:
   ```bash
   npm start
   ```

3. **Ejecutar en segundo plano con PM2**:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "proyecto-lula"
   pm2 save
   pm2 startup
   ```

---

## 🌐 Opción 3: Servidor Nginx Directo + SSL (Certbot / HTTPS)

Si tienes un servidor Linux propio con Nginx configurado:

1. **Compilar los archivos estáticos**:
   ```bash
   npm run build
   ```

2. **Copiar la carpeta `dist/` a la raíz de tu servidor Web**:
   ```bash
   sudo mkdir -p /var/www/proyecto-lula
   sudo cp -r dist/* /var/www/proyecto-lula/
   ```

3. **Copiar o crear la configuración de Nginx**:
   Copia el archivo [`nginx.conf`](file:///Users/lilium_07/Desktop/proyecto-lula/nginx.conf) a `/etc/nginx/sites-available/lula` y activa la ruta:
   ```bash
   sudo ln -s /etc/nginx/sites-available/lula /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Habilitar HTTPS con Certbot (Let's Encrypt)**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tudominio.com
   ```

---

## 📁 Opción 4: Subida por FTP / SCP / cPanel / Apache

Dado que la aplicación se compila como una Single Page Application (SPA):

1. Ejcuta en tu computadora:
   ```bash
   npm run build
   ```
2. Sube todo el contenido generado dentro de la carpeta `dist/` a la carpeta `public_html` de tu servidor.
3. Si utilizas **Apache**, crea un archivo `.htaccess` en `public_html/`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🔍 Verificación y Pruebas

Para asegurarte de que el build local compila sin errores antes de subirlo:

```bash
npm run build
npm run preview
```
