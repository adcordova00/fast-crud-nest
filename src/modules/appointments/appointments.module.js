"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AppointmentsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsModule = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const appointments_controller_1 = require("./appointments.controller");
let AppointmentsModule = AppointmentsModule_1 = class AppointmentsModule {
    static register(config) {
        console.log('[FAST-CRUD] AppointmentsModule.register called');
        if (!config?.repositoryProvider) {
            throw new Error('[FAST-CRUD] AppointmentsModule requires a repository provider. Please provide an implementation of AppointmentsRepositoryPort.');
        }
        return {
            module: AppointmentsModule_1,
            imports: config.imports || [],
            controllers: [appointments_controller_1.AppointmentsController],
            providers: [
                appointments_service_1.AppointmentsService,
                config.repositoryProvider,
            ],
            exports: [appointments_service_1.AppointmentsService],
        };
    }
};
exports.AppointmentsModule = AppointmentsModule;
exports.AppointmentsModule = AppointmentsModule = AppointmentsModule_1 = __decorate([
    (0, common_1.Module)({})
], AppointmentsModule);
//# sourceMappingURL=appointments.module.js.map