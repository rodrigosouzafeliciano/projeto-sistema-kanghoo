// Controlador de CEP — consulta via API ViaCEP
const logger = require('../utils/logger');
const https = require('https');

// Cache simples para CEPs (em memória)
const cepCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

class CepController {
    
    // Rota: GET /api/cep/:cep
    static async buscarCEPData(ctx) {
        const { cep } = ctx.params;
        
        // Validar formato do CEP
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            ctx.status = 400;
            ctx.body = { error: 'CEP deve ter 8 dígitos' };
            return;
        }
        
        // Verificar cache primeiro
        const cacheKey = cepLimpo;
        const cached = cepCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            ctx.status = 200;
            ctx.body = cached.data;
            return;
        }
        
        try {
            // Função para fazer requisição com timeout melhorado
            const buscarCEP = (url, timeout = 8000) => {
                return new Promise((resolve, reject) => {
                    const req = https.get(url, {
                        timeout: timeout,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (compatible; CEP-API/1.0)'
                        }
                    }, (res) => {
                        let data = '';
                        
                        res.on('data', (chunk) => {
                            data += chunk;
                        });
                        
                        res.on('end', () => {
                            try {
                                const jsonData = JSON.parse(data);
                                resolve(jsonData);
                            } catch (parseError) {
                                reject(new Error('Erro ao processar resposta da API'));
                            }
                        });
                    });
                    
                    req.on('error', (error) => {
                        reject(error);
                    });
                    
                    req.on('timeout', () => {
                        req.destroy();
                        reject(new Error('Timeout na requisição'));
                    });
                });
            };
            
            let dados = null;
            let ultimoErro = null;
            
            // Tentar ViaCEP primeiro
            try {
                dados = await buscarCEP(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                if (dados && !dados.erro && dados.localidade && dados.uf) {
                    // Sucesso com ViaCEP
                } else {
                    throw new Error('CEP não encontrado no ViaCEP');
                }
            } catch (error) {
                ultimoErro = error;
                logger.warn(`ViaCEP falhou para CEP ${cepLimpo}:`, error.message);
                
                // Fallback para API dos Correios (se disponível)
                try {
                    dados = await buscarCEP(`https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?cep=${cepLimpo}`, 5000);
                    if (dados && (dados.localidade || dados.cidade) && dados.uf) {
                        // Normalizar resposta dos Correios para formato ViaCEP
                        dados = {
                            cep: dados.cep || `${cepLimpo.substring(0,5)}-${cepLimpo.substring(5)}`,
                            logradouro: dados.logradouro || dados.end,
                            complemento: dados.complemento || '',
                            bairro: dados.bairro || dados.distrito,
                            localidade: dados.localidade || dados.cidade,
                            uf: dados.uf,
                            estado: dados.estado || dados.uf,
                            ibge: dados.ibge || '',
                            gia: dados.gia || '',
                            ddd: dados.ddd || '',
                            siafi: dados.siafi || ''
                        };
                    } else {
                        throw new Error('CEP não encontrado nos Correios');
                    }
                } catch (correiosError) {
                    logger.warn(`Correios também falhou para CEP ${cepLimpo}:`, correiosError.message);
                    throw ultimoErro; // Usar o erro original do ViaCEP
                }
            }
            
            if (!dados || dados.erro || !dados.localidade || !dados.uf) {
                ctx.status = 404;
                ctx.body = { 
                    error: 'CEP não encontrado',
                    details: 'Verifique se o CEP está correto e tente novamente'
                };
                return;
            }
            
            // Armazenar no cache
            cepCache.set(cacheKey, {
                data: dados,
                timestamp: Date.now()
            });
            
            // Limpar cache antigo periodicamente (manter apenas 1000 entradas)
            if (cepCache.size > 1000) {
                const entries = Array.from(cepCache.entries());
                entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
                const toDelete = entries.slice(0, 200); // Remove os 200 mais antigos
                toDelete.forEach(([key]) => cepCache.delete(key));
            }
            
            ctx.status = 200;
            ctx.body = dados;
        } catch (error) {
            logger.error('Erro ao buscar CEP:', error);
            ctx.status = 500;
            ctx.body = { 
                error: 'Erro interno do servidor',
                details: 'Tente novamente em alguns instantes'
            };
        }
    }
}

module.exports = CepController;
