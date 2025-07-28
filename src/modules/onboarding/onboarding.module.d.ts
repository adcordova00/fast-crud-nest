import { DynamicModule, Provider } from '@nestjs/common';
export interface OnboardingModuleConfig {
    repositoryProvider: Provider;
    imports?: any[];
}
export declare class OnboardingModule {
    static register(config: OnboardingModuleConfig): DynamicModule;
}
