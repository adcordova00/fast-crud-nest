import { Injectable, Inject } from '@nestjs/common';
import { OnboardingRepositoryPort, ONBOARDING_REPOSITORY_PORT } from 'core/ports/onboarding-repository.port';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { FastCrudValidationException } from 'core/exceptions/validation.exception';
import { FastCrudException } from 'core/exceptions/fast-crud.exception';

@Injectable()
export class OnboardingService {
    constructor(
        @Inject(ONBOARDING_REPOSITORY_PORT)
        private readonly repository: OnboardingRepositoryPort,
    ) { }

    async create(dto: CreateOnboardingDto): Promise<any> {
        try {
            return await this.repository.create(dto);
        } catch (error) {
            throw new FastCrudException('CREATE_FAILED', 'Failed to create onboarding', 500, error);
        }
    }

    async findAll(params: any = {}): Promise<any[]> {
        try {
            return await this.repository.findAll(params);
        } catch (error) {
            throw new FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve onboarding records', 500, error);
        }
    }

    async findById(id: string): Promise<any> {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve onboarding record', 500, error);
        }
    }

    async update(id: string, dto: Partial<CreateOnboardingDto>): Promise<any> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            return await this.repository.update(id, dto);
        } catch (error) {
            throw new FastCrudException('UPDATE_FAILED', 'Failed to update onboarding record', 500, error);
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        } catch (error) {
            throw new FastCrudException('DELETE_FAILED', 'Failed to delete onboarding record', 500, error);
        }
    }
}
