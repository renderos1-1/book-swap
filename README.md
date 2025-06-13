# Guía de Pruebas - BookSwap API

## Configuración Inicial

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar seeders:**
   ```bash
   npm run seed
   ```

3. **Iniciar aplicación:**
   ```bash
   npm run start:dev
   ```

4. **Swagger UI:** `http://localhost:3000/api`

---

## Credenciales de Prueba

- **Email:** `test@esen.edu.sv`
- **Password:** `password123`

---

## Endpoints

### 1. Login (POST /auth/login)
```json
{
  "email": "test@esen.edu.sv",
  "password": "password123"
}
```
**Respuesta:** JWT token para autenticación

### 2. Obtener libros públicos (GET /public/books)
- Sin autenticación
- Retorna todos los libros con nombre del propietario

### 3. Crear libro (POST /books)
- **Headers:** `Authorization: Bearer {token}`
```json
{
  "title": "Título único",
  "author": "Nombre del autor",
  "description": "Descripción del libro"
}
```
**Validaciones:**
- Título no puede estar duplicado (409 Conflict)
- Campos requeridos (400 Bad Request)
- Token válido requerido (401 Unauthorized)

---

## Flujo de Prueba

1. Hacer login → obtener token
2. Probar endpoint público
3. Crear libro con token → verificar que solo retorna nombre del propietario
4. Intentar crear libro con título duplicado → verificar error 409