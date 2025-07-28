import { Module, DynamicModule, Provider } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CUSTOMERS_REPOSITORY_PORT } from '../../core/ports/customers-repository.port';

export interface CustomersModuleConfig {
  repositoryProvider: Provider;
  imports?: any[]; // Imports adicionales que el cliente necesite
}

@Module({})
export class CustomersModule {
  static register(config: CustomersModuleConfig): DynamicModule {
    console.log('[FAST-CRUD] CustomersModule.register called');
    
    if (!config?.repositoryProvider) {
      throw new Error('[FAST-CRUD] CustomersModule requires a repository provider. Please provide an implementation of CustomersRepositoryPort.');
    }

    return {
      module: CustomersModule,
      imports: config.imports || [],
      controllers: [CustomersController],
      providers: [
        CustomersService,
        config.repositoryProvider,
      ],
      exports: [CustomersService],
    };
  }
} 