const express = require('express');
const router = express.Router();

const { getAllCategories, addCategory, getCategory, deleteCategory, updateCategory } = require('../controller/categories_C');
const { isLoggedIn } = require('../middelware/auth_MID');


router.get('/', isLoggedIn, getAllCategories);
router.get('/:id', isLoggedIn, getCategory);
router.post('/', isLoggedIn, addCategory);
router.delete('/:id', isLoggedIn, deleteCategory);
router.put('/:id', isLoggedIn, updateCategory);

module.exports = router;