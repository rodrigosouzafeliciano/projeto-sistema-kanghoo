// Rotas de CEP — consulta de endereço
const Router = require('koa-router');
const router = new Router();
const CepController = require('../controllers/cepController');

router.get('/api/cep/:cep', CepController.buscarCEPData);

module.exports = router;
