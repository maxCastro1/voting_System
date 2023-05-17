const express = require('express')
const router = express.Router()
const { getAllUsers,deleteUserById,search,updateUser } = require('../controllers/User');

router.get('/', getAllUsers);
router.post('/delete/:userId', deleteUserById);
router.post('/search', search);
router.post('/update/:id', updateUser);


module.exports = router
