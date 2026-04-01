// Rotas de autenticação — login e registro
const Router = require('koa-router');
const router = new Router();
const AuthController = require('../controllers/authController');
const { loginRateLimit, cadastroRateLimit } = require('../middlewares/rateLimitMiddleware');

router.post('/cadastrar', cadastroRateLimit, AuthController.cadastrar);
router.post('/login', loginRateLimit, AuthController.login);
router.post('/api/validate-token', AuthController.validateToken);

module.exports = router;
