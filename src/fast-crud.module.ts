import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OnboardingModule } from './modules/onboarding/onboarding.module';

type FastCrudModuleOptions = {
  onboarding: {
    repositoryProvider: Provider;
    imports?: any[]; // Imports adicionales para el módulo
  };
};

@Module({})
export class FastCrudModule {
  static forRoot(options: FastCrudModuleOptions): DynamicModule {
    if (!options?.onboarding?.repositoryProvider) {
      throw new Error('[FAST-CRUD] FastCrudModule requires repository providers. Please provide implementations for all modules you want to use.');
    }

    const modules = [
      OnboardingModule.register({
        repositoryProvider: options.onboarding.repositoryProvider,
        imports: options.onboarding.imports,
      }),
    ];

    return {
      module: FastCrudModule,
      imports: modules,
      exports: modules,
    };
  }
}
