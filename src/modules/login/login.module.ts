import { Module, DynamicModule, Provider } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LOGIN_REPOSITORY_PORT } from '../../core/ports/login-repository.port';

export interface LoginModuleConfig {
  repositoryProvider: Provider;
  imports?: any[]; // Imports adicionales que el cliente necesite
}

@Module({})
export class LoginModule {
  static register(config: LoginModuleConfig): DynamicModule {
    console.log('[FAST-CRUD] LoginModule.register called');
    
    if (!config?.repositoryProvider) {
      throw new Error('[FAST-CRUD] LoginModule requires a repository provider. Please provide an implementation of LoginRepositoryPort.');
    }

    return {
      module: LoginModule,
      imports: config.imports || [],
      controllers: [LoginController],
      providers: [
        LoginService,
        config.repositoryProvider,
      ],
      exports: [LoginService],
    };
  }
} 