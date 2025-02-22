const express = require('express');
const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
    windowMs: 1000 * 60 * 3, // 3 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 3 minutes'
});

const router = express.Router();
const customerController = require('../controllers/customers');

router.post('/customers', apiLimit, customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id',  customerController.deleteCustomer);
router.get('/customers/:id',  customerController.getCustomer);
router.get('/customers',  customerController.getCustomers);

module.exports = router;
