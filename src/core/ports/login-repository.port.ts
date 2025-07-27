import { CreateLoginDto } from '../../modules/login/dto/create-login.dto';

export const LOGIN_REPOSITORY_PORT = 'LoginRepositoryPort';

export interface LoginRepositoryPort {
    create(data: CreateLoginDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findByUsername(username: string): Promise<any>;
    findBySocialId(provider: string, socialId: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
    incrementLoginAttempts(id: string): Promise<void>;
    resetLoginAttempts(id: string): Promise<void>;
    lockAccount(id: string, lockUntil: Date): Promise<void>;
    unlockAccount(id: string): Promise<void>;
} 