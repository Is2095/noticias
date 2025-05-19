import { Router } from 'express';
import NoticiasController from '../controllers/noticias.controllers';

const router: Router = Router();
const noticiasController = new NoticiasController();

router.get('/news', noticiasController.buscarNoticiasNuevas);
router.get('/news/search', noticiasController.buscarNoticiaPorPalabra);
router.get('/news/:id', noticiasController.buscarNoticiaPorId);
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
 *                   example: Actualización de noticias actualizadas en base de datos
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post('/news/fetch', noticiasController.cargarNoticiasNuevas);
router.delete('/news/:id', noticiasController.eliminarNoticiaPorId);

export default router;
