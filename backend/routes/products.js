const express = require('express');
const rateLimit = require('express-rate-limit');
const productController = require('../controllers/products');
const router = express.Router();

const apiLimit = rateLimit({
    windowMs: 1000 * 60 * 3, //3 minute
    max: 100,
    message: 'You have exceeded the 100 requests in 3 minutes limit!',
});

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProduct);
router.post('/products', productController.createProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router; 