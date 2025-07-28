"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LoginModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const login_controller_1 = require("./login.controller");
let LoginModule = LoginModule_1 = class LoginModule {
    static register(config) {
        console.log('[FAST-CRUD] LoginModule.register called');
        if (!config?.repositoryProvider) {
            throw new Error('[FAST-CRUD] LoginModule requires a repository provider. Please provide an implementation of LoginRepositoryPort.');
        }
        return {
            module: LoginModule_1,
            imports: config.imports || [],
            controllers: [login_controller_1.LoginController],
            providers: [
                login_service_1.LoginService,
                config.repositoryProvider,
            ],
            exports: [login_service_1.LoginService],
        };
    }
};
exports.LoginModule = LoginModule;
exports.LoginModule = LoginModule = LoginModule_1 = __decorate([
    (0, common_1.Module)({})
], LoginModule);
//# sourceMappingURL=login.module.js.map