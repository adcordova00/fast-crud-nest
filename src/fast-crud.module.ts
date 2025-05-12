import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { OnboardingRepositoryPort } from './core/ports/onboarding-repository.port';

type FastCrudModuleOptions = {
  onboarding?: {
    repository: Provider;
  };
};

@Module({})
export class FastCrudModule {
  static forRoot(options?: FastCrudModuleOptions): DynamicModule {
    const modules: DynamicModule[] = [];

    if (options?.onboarding?.repository) {
      modules.push(OnboardingModule.register(options.onboarding.repository));
    } else {
      modules.push(OnboardingModule.register());
    }

    return {
      module: FastCrudModule,
      imports: modules,
      exports: modules,
    };
  }
}
