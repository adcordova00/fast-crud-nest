import { Module, DynamicModule, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingEntity } from './entities/onboarding.entity';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { OnboardingRepositoryPort, ONBOARDING_REPOSITORY_PORT } from 'core/ports/onboarding-repository.port';
import { BaseOnboardingRepository } from './repositories/base-onboarding.repository';

@Module({})
export class OnboardingModule {
  static register(customRepo?: Provider): DynamicModule {
    const repositoryProvider: Provider = customRepo ?? {
      provide: ONBOARDING_REPOSITORY_PORT,
      useClass: BaseOnboardingRepository,
    };

    return {
      module: OnboardingModule,
      imports: [TypeOrmModule.forFeature([OnboardingEntity])],
      controllers: [OnboardingController],
      providers: [
        OnboardingService,
        repositoryProvider,
        ...(customRepo ? [customRepo] : []),
      ],
      exports: [OnboardingService],
    };
  }
}
