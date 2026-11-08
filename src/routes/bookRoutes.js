import { Router } from 'express';
import { createBook , getAllBooks , updateBook , deleteBook, getBookById} from "../controllers/bookController.js";
const router = Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;