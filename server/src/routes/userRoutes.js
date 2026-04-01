// Rotas de usuário — dados e perfil
const Router = require('koa-router');
const router = new Router();
const UserController = require('../controllers/userController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/api/dashboard', autenticar, UserController.getDashboardData);
router.get('/api/motorista/profile', autenticar, UserController.getMotoristaProfile);
router.put('/api/motorista/profile/update', autenticar, UserController.updateMotoristaProfile);
router.get('/api/responsavel/profile', autenticar, UserController.getResponsavelProfile);

module.exports = router;
