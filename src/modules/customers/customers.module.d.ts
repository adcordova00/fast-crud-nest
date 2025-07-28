import { DynamicModule, Provider } from '@nestjs/common';
export interface CustomersModuleConfig {
    repositoryProvider: Provider;
    imports?: any[];
}
export declare class CustomersModule {
    static register(config: CustomersModuleConfig): DynamicModule;
}
