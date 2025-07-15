# 📰 Gestor de Noticias RSS - El País

Proyecto backend desarrollado con Node.js y Express para la ingesta, normalización, enriquecimiento y gestión de noticias provenientes de múltiples feeds RSS del diario **El País**. Las noticias son convertidas desde XML a JSON, validadas, filtradas, almacenadas en MongoDB y expuestas mediante una API REST documentada con Swagger.

---

## 🚀 Tecnologías

- **Node.js** + **Express**
- **MongoDB** con Mongoose
- **Swagger (OpenAPI)** para documentación
- **Axios** para llamadas a los feeds RSS
- **fast-xml-parser** para parseo de XML a JSON
- **Rate Limiting** con express-rate-limit
- **Arquitectura por capas** (controladores, servicios, repositorios, validaciones)
- **Programación orientada a objetos** (uso de clases)

---

## 🛠️ Inicialización del proyecto

1. Clonar el repositorio

abre la consola y ejecuta:

git clone https://github.com/Is2095/noticias.git
cd noticias

2. Instalar dependencias

npm install

Asegurate de tener Node.js ≥ 18 instalado.

3. Crear el archivo .env
   Crea un archivo llamado .env en la raíz del proyecto y completalo con tus variables de entorno.
   Podés usar este ejemplo como base:

PORT=

(colocar los datos en caso de base de datos en nube, mongo Atlas)
DB_USER=
DB_PASSWORD=
DB_NAMEDB=
DB_CLUSTER=

IS_DEV = 'dev'
PROCESO_PRODUCCION = 'production'

URL_MONGO_LOCAL = "" en caso de usar mongo Atlas colocar la URI

URL_API_DE_NOTICIAS_XML = 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada,https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/chile/portada,https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/mexico/portada' 

📌 Las URLs de RSS que agregues en URL_API_DE_NOTICIAS_XML serán las únicas aceptadas por la API en el endpoint POST.

4. Iniciar el servidor

npm run dev

El servidor estará disponible en http://localhost:3000.

5. Acceder a la documentación Swagger

http://localhost:3001/doc

Desde aquí podrás probar todos los endpoints de forma visual e interactiva.

---

## 🧠 Funcionalidades principales

- ✅ Ingesta automática de noticias desde múltiples feeds RSS.
- ✅ Conversión de XML a JSON.
- ✅ Normalización y enriquecimiento de campos clave.
- ✅ Validaciones para mantener integridad de datos.
- ✅ Control de duplicados con índice compuesto en MongoDB.
- ✅ Eliminación automática de noticias con antigüedad.
- ✅ Paginación por query params (page, limit).
- ✅ Filtros por palabra clave y rango de fechas.
- ✅ Swagger para documentación completa.
- ✅ Rate limiting por IP y por tipo de operación.

---

## 🧪 Endpoints disponibles

### 🔍 GET

- `GET /noticias` → Lista paginada de noticias.
  - Query params: `page`, `limit`
- `GET /noticias/:id` → Obtener una noticia por su ID.
- `GET /noticias/search` → Buscar por:
  - `titulo` (palabra clave)
  - `fechaInicio`
  - `fechaFin`

### ➕ POST

- `POST /noticias` → Realiza la consulta a los feeds RSS, procesa y guarda las noticias nuevas en la base de datos.
  la base de datos.

Este endpoint espera recibir en el body un objeto JSON con la URL del feed RSS deseado.

Las URLs disponibles pueden consultarse en el sitio oficial de El País:
🔗 https://elpais.com/info/rss/

📥 Ejemplo de request (body):

{
"url": "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada"
}
📌 En este ejemplo se solicitan noticias de la sección Argentina.

El servidor validará la URL habilitadas en el archivo .env

### ❌ DELETE

- `DELETE /noticias/:id` → Elimina una noticia por su ID.

---

## 🛡️ Seguridad y robustez

- 🔐 **Rate limiting**: Límite de peticiones por IP, configurable por endpoint. Se aplica a toda la API y especialmente a DELETE.
- ✅ **Validaciones de entrada**: Control de tipos de datos, fechas válidas, URLs, etc.
- 💥 **Manejo de errores**: Sistema centralizado con clases personalizadas.
- ⛔ **Solo se aceptan URLs predefinidas**, evitando abusos o scraping arbitrario.

---

🧑‍💻 Autor
Ismael Díaz – LinkedIn: https://www.linkedin.com/in/ismael-diaz-3b440b27a/
