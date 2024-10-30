const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const upload = require('../middleware/multer');

router.get('/producer/:producerId', productController.getProductsByProducer);
router.get('/', productController.getAllProducts);
router.post('/', upload.single('image'), productController.addProduct);
router.get('/:id', productController.getProductById);
router.put('/:id/:producerId', productController.updateProduct);
router.delete('/:id/:producerId', productController.deleteProduct);



module.exports = router;

