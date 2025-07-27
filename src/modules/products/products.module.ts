import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PRODUCTS_REPOSITORY_PORT } from '../../core/ports/products-repository.port';

export interface ProductsModuleConfig {
  repositoryProvider: Provider;
  imports?: any[]; // Imports adicionales que el cliente necesite
}

@Module({})
export class ProductsModule {
  static register(config: ProductsModuleConfig): DynamicModule {
    console.log('[FAST-CRUD] ProductsModule.register called');
    
    if (!config?.repositoryProvider) {
      throw new Error('[FAST-CRUD] ProductsModule requires a repository provider. Please provide an implementation of ProductsRepositoryPort.');
    }

    return {
      module: ProductsModule,
      imports: config.imports || [],
      controllers: [ProductsController],
      providers: [
        ProductsService,
        config.repositoryProvider,
      ],
      exports: [ProductsService],
    };
  }
} 