const express = require('express');
const { productsController } = require('../controllers')
const router = express.Router()

router.get('/get', productsController.getProducts)
router.post('/add', productsController.addProduct)
router.delete('/delete/:produk_id', productsController.deleteProduct)
router.patch(`/update`, productsController.updateProduct)

module.exports = router