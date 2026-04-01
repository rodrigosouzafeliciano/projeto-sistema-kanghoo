// Rotas de contato — formulário do site
const Router = require('koa-router');
const router = new Router();
const ContactController = require('../controllers/contactController');

router.post('/api/contact', ContactController.enviarMensagem);

module.exports = router;
