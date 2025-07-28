import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
export declare class OnboardingController {
    private readonly service;
    constructor(service: OnboardingService);
    create(dto: CreateOnboardingDto): Promise<any>;
    findAll(page?: number, limit?: number): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: Partial<CreateOnboardingDto>): Promise<any>;
    softDelete(id: string): Promise<void>;
}
