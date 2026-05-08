const express = require('express');
const router = express.Router();
const { setupTOTP, verifyTOTP } = require('../controllers/totpController');
const { verifyAdmin } = require('../middleware/verifyToken');

router.get('/setup', verifyAdmin, setupTOTP);
router.post('/verify', verifyAdmin, verifyTOTP);

module.exports = router;