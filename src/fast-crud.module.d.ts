import { DynamicModule, Provider } from '@nestjs/common';
type FastCrudModuleOptions = {
    onboarding?: {
        repositoryProvider: Provider;
        imports?: any[];
    };
    login?: {
        repositoryProvider: Provider;
        imports?: any[];
    };
    products?: {
        repositoryProvider: Provider;
        imports?: any[];
    };
    appointments?: {
        repositoryProvider: Provider;
        imports?: any[];
    };
    customers?: {
        repositoryProvider: Provider;
        imports?: any[];
    };
};
export declare class FastCrudModule {
    static forRoot(options: FastCrudModuleOptions): DynamicModule;
}
export {};
