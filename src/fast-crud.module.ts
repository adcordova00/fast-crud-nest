import { DynamicModule, Module, Provider } from '@nestjs/common';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { LoginModule } from './modules/login/login.module';

type FastCrudModuleOptions = {
  onboarding?: {
    repositoryProvider: Provider;
    imports?: any[]; // Imports adicionales para el módulo
  };
  login?: {
    repositoryProvider: Provider;
    imports?: any[]; // Imports adicionales para el módulo
  };
};

@Module({})
export class FastCrudModule {
  static forRoot(options: FastCrudModuleOptions): DynamicModule {
    console.log('[FAST-CRUD] FastCrudModule.forRoot called with options:', Object.keys(options));

    if (!options || (Object.keys(options).length === 0)) {
      throw new Error('[FAST-CRUD] FastCrudModule requires at least one module configuration. Please provide implementations for the modules you want to use.');
    }

    const modules: DynamicModule[] = [];

    // Register Onboarding Module if provided
    if (options.onboarding?.repositoryProvider) {
      console.log('[FAST-CRUD] Registering OnboardingModule');
      modules.push(
        OnboardingModule.register({
          repositoryProvider: options.onboarding.repositoryProvider,
          imports: options.onboarding.imports,
        })
      );
    }

    // Register Login Module if provided
    if (options.login?.repositoryProvider) {
      console.log('[FAST-CRUD] Registering LoginModule');
      modules.push(
        LoginModule.register({
          repositoryProvider: options.login.repositoryProvider,
          imports: options.login.imports,
        })
      );
    }

    if (modules.length === 0) {
      throw new Error('[FAST-CRUD] No valid module configurations found. Please provide repository providers for the modules you want to use.');
    }

    return {
      module: FastCrudModule,
      imports: modules,
      exports: modules,
    };
  }
}
