"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var OnboardingModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingModule = void 0;
const common_1 = require("@nestjs/common");
const onboarding_service_1 = require("./onboarding.service");
const onboarding_controller_1 = require("./onboarding.controller");
let OnboardingModule = OnboardingModule_1 = class OnboardingModule {
    static register(config) {
        console.log('[FAST-CRUD] OnboardingModule.register called');
        if (!config?.repositoryProvider) {
            throw new Error('[FAST-CRUD] OnboardingModule requires a repository provider. Please provide an implementation of OnboardingRepositoryPort.');
        }
        return {
            module: OnboardingModule_1,
            imports: config.imports || [],
            controllers: [onboarding_controller_1.OnboardingController],
            providers: [
                onboarding_service_1.OnboardingService,
                config.repositoryProvider,
            ],
            exports: [onboarding_service_1.OnboardingService],
        };
    }
};
exports.OnboardingModule = OnboardingModule;
exports.OnboardingModule = OnboardingModule = OnboardingModule_1 = __decorate([
    (0, common_1.Module)({})
], OnboardingModule);
//# sourceMappingURL=onboarding.module.js.map