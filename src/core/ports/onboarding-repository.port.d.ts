import { CreateOnboardingDto } from '../../modules/onboarding/dto/create-onboarding.dto';
export declare const ONBOARDING_REPOSITORY_PORT = "OnboardingRepositoryPort";
export interface OnboardingRepositoryPort {
    create(data: CreateOnboardingDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;
}
