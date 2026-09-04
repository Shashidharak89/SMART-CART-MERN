const express = require('express');
const router = express.Router();
const { subscribeUser, getSubscribers } = require('../controllers/subscriberController');

router.post('/', subscribeUser);
router.get('/', getSubscribers);

module.exports = router;
