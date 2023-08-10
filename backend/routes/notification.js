const express = require('express');
const router = express.Router();

const { getNotifications,
    updateAcceptance,
    deleteNotification,
    createNotification } = require ('../controllers/notification');

router.post('/:userId', getNotifications);
router.post('/', updateAcceptance);
router.delete('/:id', deleteNotification);

module.exports = router;
