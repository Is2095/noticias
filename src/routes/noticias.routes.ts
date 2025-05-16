import { Router } from 'express';
import NoticiasController from '../controllers/noticias.controllers';

const router: Router = Router();
const noticiasController = new NoticiasController();

router.get('/news', noticiasController.buscarNoticiasNuevas);
router.get('/news/search', noticiasController.buscarNoticiaPorPalabra);
router.get('/news/:id', noticiasController.buscarNoticiaPorId);
router.post('/news/fetch', noticiasController.cargarNoticiasNuevas);
router.delete('/news/:id', noticiasController.eliminarNoticiaPorId);

export default router;
