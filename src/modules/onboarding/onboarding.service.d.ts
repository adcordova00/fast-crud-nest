import { OnboardingRepositoryPort } from '../../core/ports/onboarding-repository.port';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
export declare class OnboardingService {
    private readonly repository;
    constructor(repository: OnboardingRepositoryPort);
    create(dto: CreateOnboardingDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateOnboardingDto>): Promise<any>;
    softDelete(id: string): Promise<void>;
}
