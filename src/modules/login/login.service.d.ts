import { LoginRepositoryPort } from '../../core/ports/login-repository.port';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
export declare class LoginService {
    private readonly repository;
    constructor(repository: LoginRepositoryPort);
    register(dto: CreateLoginDto): Promise<any>;
    login(emailOrUsername: string, password: string): Promise<any>;
    socialLogin(provider: string, socialId: string, profileData?: any): Promise<any>;
    socialRegister(provider: string, socialId: string, profileData: any): Promise<any>;
    create(dto: CreateLoginDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: string, dto: UpdateLoginDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    changePassword(id: string, oldPassword: string, newPassword: string): Promise<void>;
    resetPassword(email: string): Promise<void>;
    lockAccount(id: string, lockDuration?: number): Promise<void>;
    unlockAccount(id: string): Promise<void>;
}
