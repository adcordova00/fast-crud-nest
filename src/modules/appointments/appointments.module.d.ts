import { DynamicModule, Provider } from '@nestjs/common';
export interface AppointmentsModuleConfig {
    repositoryProvider: Provider;
    imports?: any[];
}
export declare class AppointmentsModule {
    static register(config: AppointmentsModuleConfig): DynamicModule;
}
