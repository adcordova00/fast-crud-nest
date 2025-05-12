import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnboardingRepositoryPort } from '../../../core/ports/onboarding-repository.port';
import { CreateOnboardingDto } from '../dto/create-onboarding.dto';
import { OnboardingEntity } from '../entities/onboarding.entity';

@Injectable()
export class BaseOnboardingRepository implements OnboardingRepositoryPort {
    constructor(
        @InjectRepository(OnboardingEntity)
        private readonly repo: Repository<OnboardingEntity>,
    ) { }

    async create(data: CreateOnboardingDto): Promise<OnboardingEntity> {
        const entity = this.repo.create({ ...data });
        return await this.repo.save(entity);
    }

    async findAll(params: any = {}): Promise<OnboardingEntity[]> {
        const { page = 1, limit = 10 } = params;
        return await this.repo.find({
            where: { isDeleted: false },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async findById(id: string): Promise<OnboardingEntity | null> {
        return await this.repo.findOne({
            where: { id, isDeleted: false },
        });
    }

    async update(id: string, data: Partial<CreateOnboardingDto>): Promise<OnboardingEntity> {
        await this.repo.update(id, data);
        return (await this.findById(id))!;
    }

    async softDelete(id: string): Promise<void> {
        await this.repo.update(id, { isDeleted: true });
    }
}

