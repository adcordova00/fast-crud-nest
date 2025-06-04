import { Module, DynamicModule, Provider } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { ONBOARDING_REPOSITORY_PORT } from '../../core/ports/onboarding-repository.port';

export interface OnboardingModuleConfig {
  repositoryProvider: Provider;
  imports?: any[]; // Imports adicionales que el cliente necesite
}

@Module({})
export class OnboardingModule {
  static register(config: OnboardingModuleConfig): DynamicModule {
    console.log('[FAST-CRUD] OnboardingModule.register called');
    
    if (!config?.repositoryProvider) {
      throw new Error('[FAST-CRUD] OnboardingModule requires a repository provider. Please provide an implementation of OnboardingRepositoryPort.');
    }

    return {
      module: OnboardingModule,
      imports: config.imports || [],
      controllers: [OnboardingController],
      providers: [
        OnboardingService,
        config.repositoryProvider,
      ],
      exports: [OnboardingService],
    };
  }
}
