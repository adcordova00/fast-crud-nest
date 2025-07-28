import { DynamicModule, Provider } from '@nestjs/common';
export interface LoginModuleConfig {
    repositoryProvider: Provider;
    imports?: any[];
}
export declare class LoginModule {
    static register(config: LoginModuleConfig): DynamicModule;
}
