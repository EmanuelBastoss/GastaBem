const router = require('express').Router();
const authRoutes = require('./auth.routes');
const lancamentosRoutes = require('./lancamentos.routes');
const { authenticateToken } = require('../middlewares/auth');

router.use('/auth', authRoutes);
router.use('/lancamentos', authenticateToken, lancamentosRoutes);

module.exports = router; 