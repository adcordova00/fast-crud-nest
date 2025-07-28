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
const login_module_1 = require("./modules/login/login.module");
const products_module_1 = require("./modules/products/products.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const customers_module_1 = require("./modules/customers/customers.module");
let FastCrudModule = FastCrudModule_1 = class FastCrudModule {
    static forRoot(options) {
        console.log('[FAST-CRUD] FastCrudModule.forRoot called with options:', Object.keys(options));
        if (!options || (Object.keys(options).length === 0)) {
            throw new Error('[FAST-CRUD] FastCrudModule requires at least one module configuration. Please provide implementations for the modules you want to use.');
        }
        const modules = [];
        if (options.onboarding?.repositoryProvider) {
            console.log('[FAST-CRUD] Registering OnboardingModule');
            modules.push(onboarding_module_1.OnboardingModule.register({
                repositoryProvider: options.onboarding.repositoryProvider,
                imports: options.onboarding.imports,
            }));
        }
        if (options.login?.repositoryProvider) {
            console.log('[FAST-CRUD] Registering LoginModule');
            modules.push(login_module_1.LoginModule.register({
                repositoryProvider: options.login.repositoryProvider,
                imports: options.login.imports,
            }));
        }
        if (options.products?.repositoryProvider) {
            console.log('[FAST-CRUD] Registering ProductsModule');
            modules.push(products_module_1.ProductsModule.register({
                repositoryProvider: options.products.repositoryProvider,
                imports: options.products.imports,
            }));
        }
        if (options.appointments?.repositoryProvider) {
            console.log('[FAST-CRUD] Registering AppointmentsModule');
            modules.push(appointments_module_1.AppointmentsModule.register({
                repositoryProvider: options.appointments.repositoryProvider,
                imports: options.appointments.imports,
            }));
        }
        if (options.customers?.repositoryProvider) {
            console.log('[FAST-CRUD] Registering CustomersModule');
            modules.push(customers_module_1.CustomersModule.register({
                repositoryProvider: options.customers.repositoryProvider,
                imports: options.customers.imports,
            }));
        }
        if (modules.length === 0) {
            throw new Error('[FAST-CRUD] No valid module configurations found. Please provide repository providers for the modules you want to use.');
        }
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
//# sourceMappingURL=fast-crud.module.js.map