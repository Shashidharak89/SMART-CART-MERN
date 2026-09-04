const express = require('express');
const router = express.Router();
const {
  subscribeUser,
  getSubscribers,
  updateSubscriber,
  deleteSubscriber,
} = require('../controllers/subscriberController');

router.route('/')
  .get(getSubscribers)
  .post(subscribeUser);

router.route('/:id')
  .put(updateSubscriber)
  .delete(deleteSubscriber);

module.exports = router;
