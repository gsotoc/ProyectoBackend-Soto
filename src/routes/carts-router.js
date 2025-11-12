const express = require('express');
const router = express.Router();
const controller = require("../controllers/cartController");

router.post('/', controller.createCart); 
router.get('/:cid', controller.getById);
router.put('/:cid/product/:pid', controller.update);

module.exports = router;
