import bcrypt from 'bcryptjs';
import { User } from '../../domain/entities/User.mjs';

export class RegisterUser {
    constructor(userRepository, vehicleRepository, dbClient, securityConfig) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.db = dbClient;
        this.securityConfig = securityConfig;
    }

    async execute(userData, vehicleData, companyData) {
        // Validation logic can be here or in Domain
        if (await this.userRepository.findByEmail(userData.email)) {
            throw new Error("Email already in use");
        }

        const client = await this.db.getClient();
        await client.query('BEGIN');

        try {
            const hashedPassword = await bcrypt.hash(userData.senha, this.securityConfig.bcrypt.saltRounds);
            
            const user = new User({
                ...userData,
                senha: hashedPassword
            });
            user.validate();

            const userId = await this.userRepository.create(user);

            if (vehicleData && vehicleData.placa) {
                await this.vehicleRepository.create({
                    ...vehicleData,
                    usuarioId: userId
                });
            }

            // company registration logic here...

            await client.query('COMMIT');
            client.release();

            return { id: userId, email: user.email };
        } catch (error) {
            await client.query('ROLLBACK');
            client.release();
            throw error;
        }
    }
}
