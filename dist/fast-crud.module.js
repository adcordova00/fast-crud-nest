"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FastCrudModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastCrudModule = void 0;
const common_1 = require("@nestjs/common");
const onboarding_module_1 = require("./modules/onboarding/onboarding.module");
let FastCrudModule = FastCrudModule_1 = class FastCrudModule {
    static forRoot(options) {
        if (!options?.onboarding?.repositoryProvider) {
            throw new Error('[FAST-CRUD] FastCrudModule requires repository providers. Please provide implementations for all modules you want to use.');
        }
        const modules = [
            onboarding_module_1.OnboardingModule.register({
                repositoryProvider: options.onboarding.repositoryProvider,
                imports: options.onboarding.imports,
            }),
        ];
        return {
            module: FastCrudModule_1,
            imports: modules,
            exports: modules,
        };
    }
};
exports.FastCrudModule = FastCrudModule;
exports.FastCrudModule = FastCrudModule = FastCrudModule_1 = __decorate([
    (0, common_1.Module)({})
], FastCrudModule);
