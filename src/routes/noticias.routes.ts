import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import ActualizarNoticiasController from '../controllers/actualizarNoticias.controllers';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';
import validarQueryGetNoticias from '../middlewares/getNoticias.middlewares';
import validarUrlXML from '../middlewares/url_post.middlewares';

const router: Router = Router();
const actualizarNoticiasController = new ActualizarNoticiasController();

const deleteLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 2, // Máximo 2 peticiones
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ClienteError('Límite de eliminaciones alcanzado.'));
  },
});

router.post('/pruebas', actualizarNoticiasController.pruebas);
/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Obtener todas las noticias paginadas
 *     tags: [news]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Cantidad de noticias por página
 *     responses:
 *       200:
 *         description: Lista de noticias paginadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: ""
 *                 noticias:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 40
 *                     limit:
 *                       type: integer
 *                       example: 2
 *                     total:
 *                       type: integer
 *                       example: 231
 *                     totalPage:
 *                       type: integer
 *                       example: 116
 *                     noticias:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Noticia'
 *
 * components:
 *   schemas:
 *     Noticia:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "68361723c8920faa365f76e8"
 *         tituloPais:
 *           type: string
 *           example: "EL PAÍS Edición Chile: El periódico global en EL PAÍS"
 *         titulo:
 *           type: string
 *           example: "Un atentado al corazón del Gobierno de Ciudad de México..."
 *         enlaceNoticia:
 *           type: string
 *           format: uri
 *           example: "https://elpais.com/..."
 *         descripcionNoticia:
 *           type: string
 *           example: "Las autoridades siguen sin detener a los implicados..."
 *         fechaPublicacion:
 *           type: string
 *           example: "Sun, 25 May 2025 02:14:40 GMT"
 *         imagen:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example:
 *             - "https://imagenes.elpais.com/imagen1.jpg"
 *             - "https://imagenes.elpais.com/imagen2.jpg"
 *         seccionOCategoria:
 *           type: array
 *           items:
 *             type: string
 *           example: ["méxico", "violencia en méxico"]
 *         fechaYHoraIngestion:
 *           type: string
 *           format: date-time
 *           example: "2025-05-27T19:48:51.332Z"
 *         fuente:
 *           type: string
 *           format: uri
 *           example: "https://feeds.elpais.com/..."
 *         identificadorUnico:
 *           type: string
 *           format: uuid
 *           example: "9f02d9b2-497a-4c8a-a0ea-a5acab538085"
 *         palabrasClaves:
 *           type: object
 *           properties:
 *             titulo:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["un atentado al", "gobierno", "ciudad"]
 *             descripcion:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["las autoridades siguen", "ximena"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-27T19:48:51.874Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-05-27T19:48:51.874Z"
 *         __v:
 *           type: integer
 *           example: 0
 */
router.get('/', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiasNuevas);
/**
 * @swagger
 * /api/v1/news/search:
 *   get:
 *     summary: Buscar noticias por palabra clave
 *     tags: [news]
 *     description: Devuelve una lista de noticias filtradas por título y/o rango de fechas.
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         required: false
 *         description: Palabra clave a buscar en el título.
 *       - in: query
 *         name: fechaFrom
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-01"
 *         required: false
 *         description: Desde la fecha (formato YYYY-MM-DD).
 *       - in: query
 *         name: fechaTo
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-06-30"
 *         required: false
 *         description: A la fecha (formato YYYY-MM-DD).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Número de página (paginación).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Cantidad de resultados por página.
 *     responses:
 *       200:
 *         description: Lista de noticias encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: ""
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 20
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     noticias:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Noticia'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 */
router.get('/search', actualizarNoticiasController.buscarNoticiaPorPalabra);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   get:
 *     summary: Obtener una noticia por ID
 *     tags: [news]
 *     description: Devuelve una única noticia según su ID de MongoDB
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la noticia (MongoDB ObjectId)
 *         schema:
 *           type: string
 *           example: "683756cbf626efae2fdb4019"
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: ""
 *                 noticia:
 *                   $ref: '#/components/schemas/Noticia'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 *       404:
 *         description: Noticia no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 */
router.get('/:id', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiaPorId);
/**
 * @swagger
 * /api/v1/news/fetch:
 *   post:
 *     summary: Ingestión de noticias desde feeds RSS
 *     tags: [news]
 *     description: Recibe una URL de RSS en el cuerpo del request para procesar noticias.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: URL del feed RSS a procesar.
 *                 example: https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/argentina/portada
 *     responses:
 *       200:
 *         description: Noticias actualizadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Actualización de noticias en la base de datos
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post('/fetch', validarUrlXML, actualizarNoticiasController.cargarNoticiasNuevas);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   get:
 *     summary: Obtiene una noticia por su ID
 *     tags: [news]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la noticia a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Noticia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 titulo:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 fechaPublicacion:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Noticia no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiaPorId);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   delete:
 *     summary: Elimina una noticia por su ID
 *     tags: [news]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la noticia a eliminar
 *     responses:
 *       200:
 *         description: Noticia eliminada correctamente
 *       404:
 *         description: Noticia no encontrada
 *       429:
 *         description: Límite de eliminaciones alcanzado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/:id',
  deleteLimiter,
  validarQueryGetNoticias,
  actualizarNoticiasController.eliminarNoticiaPorId
);

export default router;
