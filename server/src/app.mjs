// Configuração principal da aplicação Koa
import Koa from 'koa';
import KoaRouter from 'koa-router';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import cors from '@koa/cors';
import compress from 'koa-compress';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { constants } from 'zlib';

// Módulos ESM do projeto
import container from './infrastructure/config/container.mjs';
import { errorHandler } from './utils/api-response.mjs';
import { securityConfig, getSecurityHeaders } from './infrastructure/config/security-config.mjs';
import { generalRateLimit } from './interface/http/middlewares/rateLimitMiddleware.mjs';

// Adaptador para carregar módulos CommonJS legados
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();
const router = new KoaRouter();

// Middleware — Tratamento global de erros
app.use(errorHandler);

// Middleware — Headers de segurança
app.use(async (ctx, next) => {
    const headers = getSecurityHeaders();
    Object.entries(headers).forEach(([key, value]) => ctx.set(key, value));
    ctx.remove('X-Powered-By');
    await next();
});

// Middleware — Compressão de resposta
app.use(compress({
    filter(content_type) { return /text|javascript|json|xml|svg/.test(content_type); },
    threshold: 1024,
    gzip: { flush: constants.Z_SYNC_FLUSH },
    deflate: { flush: constants.Z_SYNC_FLUSH },
    br: false
}));

// Middleware — CORS
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

// Middleware — Arquivos estáticos do frontend
app.use(serve(path.join(__dirname, '../../frontend/public')));
app.use(serve(path.join(__dirname, '../../frontend')));

// Middleware — Parser de corpo da requisição
app.use(bodyParser());
app.use(json());

// Middleware — Rate limiting
app.use(generalRateLimit);

// Injeção de dependência
const { authController } = container.cradle;

// ── Rotas da camada Clean Architecture ──
router.post('/api/auth/register', (ctx) => authController.register(ctx));
router.post('/api/auth/login', (ctx) => authController.login(ctx));

// Verificação de saúde do servidor
router.get('/api/health', (ctx) => {
    ctx.body = { status: 'UP', timestamp: new Date().toISOString(), versao: '2.0.0' };
});

// ── Rotas legadas (CommonJS) ──
const legacyRoutes = require('./routes/legacyRoutes');
const motoristaEscolarRoutes = require('./routes/motorista-escolar-simple');
const motoristaExcursaoRoutes = require('./routes/motorista-excursao');
const responsavelRoutes = require('./routes/responsavel');
const rotasEscolaresRoutes = require('./routes/rotas-escolares');
const buscarRotasRoutes = require('./routes/buscar-rotas');
const transportesRoutes = require('./routes/transportes');
const rastreamentoRoutes = require('./routes/rastreamento');
const conferenciaRoutes = require('./routes/conferencia-criancas');
const cadastroCriancasRoutes = require('./routes/cadastro-criancas');
const planosAssinaturaRoutes = require('./routes/planos-assinatura');
const gpsTrackingRoutes = require('./routes/gps-tracking-api');
const googleMapsRoutes = require('./routes/google-maps-api');
const notificationRoutes = require('./routes/notification-preferences');
const trackingRoutes = require('./routes/tracking-api');
const mapsConfigRoutes = require('./routes/maps-config');
const posicaoCriancasRoutes = require('./routes/posicao-criancas');
const atualizacaoPosicaoRoutes = require('./routes/atualizacao-posicao');
const rastreamentoGpsRoutes = require('./routes/rastreamento-gps');
const contactRoutes = require('./routes/contactRoutes');
const cepRoutes = require('./routes/cepRoutes');

// Registro de todas as rotas legadas
app.use(legacyRoutes.routes()).use(legacyRoutes.allowedMethods());
app.use(motoristaEscolarRoutes.routes()).use(motoristaEscolarRoutes.allowedMethods());
app.use(motoristaExcursaoRoutes.routes()).use(motoristaExcursaoRoutes.allowedMethods());
app.use(responsavelRoutes.routes()).use(responsavelRoutes.allowedMethods());
app.use(rotasEscolaresRoutes.routes()).use(rotasEscolaresRoutes.allowedMethods());
app.use(buscarRotasRoutes.routes()).use(buscarRotasRoutes.allowedMethods());
app.use(transportesRoutes.routes()).use(transportesRoutes.allowedMethods());
app.use(rastreamentoRoutes.routes()).use(rastreamentoRoutes.allowedMethods());
app.use(conferenciaRoutes.routes()).use(conferenciaRoutes.allowedMethods());
app.use(cadastroCriancasRoutes.routes()).use(cadastroCriancasRoutes.allowedMethods());
app.use(planosAssinaturaRoutes.routes()).use(planosAssinaturaRoutes.allowedMethods());
app.use(gpsTrackingRoutes.routes()).use(gpsTrackingRoutes.allowedMethods());
app.use(googleMapsRoutes.routes()).use(googleMapsRoutes.allowedMethods());
app.use(notificationRoutes.routes()).use(notificationRoutes.allowedMethods());
app.use(trackingRoutes.routes()).use(trackingRoutes.allowedMethods());
app.use(mapsConfigRoutes.routes()).use(mapsConfigRoutes.allowedMethods());
app.use(posicaoCriancasRoutes.routes()).use(posicaoCriancasRoutes.allowedMethods());
app.use(atualizacaoPosicaoRoutes.routes()).use(atualizacaoPosicaoRoutes.allowedMethods());
app.use(rastreamentoGpsRoutes.routes()).use(rastreamentoGpsRoutes.allowedMethods());
app.use(contactRoutes.routes()).use(contactRoutes.allowedMethods());
app.use(cepRoutes.routes()).use(cepRoutes.allowedMethods());

// Registro das rotas do roteador principal (auth + health)
app.use(router.routes()).use(router.allowedMethods());

export default app;
