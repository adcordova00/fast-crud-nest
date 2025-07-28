import { DynamicModule, Provider } from '@nestjs/common';
export interface ProductsModuleConfig {
    repositoryProvider: Provider;
    imports?: any[];
}
export declare class ProductsModule {
    static register(config: ProductsModuleConfig): DynamicModule;
}
