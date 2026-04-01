// Container de Injeção de Dependência — Awilix
import { createContainer, asClass, asValue } from 'awilix';
import { PgUserRepository } from '../database/PgUserRepository.mjs';
import { PgVehicleRepository } from '../database/PgVehicleRepository.mjs';
import { PgRouteRepository } from '../database/PgRouteRepository.mjs';
import { RegisterUser } from '../../application/use-cases/RegisterUser.mjs';
import { LoginUser } from '../../application/use-cases/LoginUser.mjs';
import { AuthController } from '../../interface/http/controllers/AuthController.mjs';
import { securityConfig } from './security-config.mjs';
import db from './db.mjs';

const container = createContainer();

container.register({
    // Serviços de infraestrutura
    db: asValue(db),
    securityConfig: asValue(securityConfig),

    // Repositórios
    userRepository: asClass(PgUserRepository).singleton(),
    vehicleRepository: asClass(PgVehicleRepository).singleton(),
    routeRepository: asClass(PgRouteRepository).singleton(),

    // Casos de uso
    registerUserUseCase: asClass(RegisterUser).singleton(),
    loginUserUseCase: asClass(LoginUser).singleton(),

    // Controladores HTTP
    authController: asClass(AuthController).singleton(),
});

export default container;
