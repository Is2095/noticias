import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import ActualizarNoticiasController from '../controllers/actualizarNoticias.controllers';
import validarQueryGetNoticias from '../middlewares/getNoticias.middlewares';
import validarUrlXML from '../middlewares/url_post.middlewares';
import ClienteError from '../manejador_de_errores/erroresPersonalizados/ErrorParaClienteGeneral';

const router: Router = Router();
const actualizarNoticiasController = new ActualizarNoticiasController();

const deleteLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutos
  max: 2, // Máximo 2 peticiones
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ClienteError('Límite de eliminaciones alcanzado.'))
  },
});

router.post('/news/pruebas', actualizarNoticiasController.pruebas);
/**
 * @swagger
 * /news:
 *   get:
 *     summary: Obtener todas las noticias paginadas
 *     tags: [News]
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
router.get('/news', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiasNuevas);
router.get('/news/search', actualizarNoticiasController.buscarNoticiaPorPalabra);
/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Obtener una noticia por ID
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
router.get('/news/:id', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiaPorId);
/**
 * @swagger
 * /news/fetch:
 *   post:
 *     summary: Ingestión de noticias desde feeds RSS
 *     description: Recibe una URL de RSS en el cuerpo del request para procesar noticias.
 *     tags:
 *       - Noticias
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
 *                 example: https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada
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
router.post('/news/fetch', validarUrlXML, actualizarNoticiasController.cargarNoticiasNuevas);
router.get('/news/:id', validarQueryGetNoticias, actualizarNoticiasController.buscarNoticiaPorId);
/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Elimina una noticia por su ID
 *     tags:
 *       - Recursos
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
  '/news/:id',
  deleteLimiter,
  validarQueryGetNoticias,
  actualizarNoticiasController.eliminarNoticiaPorId
);

export default router;
