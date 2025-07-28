"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProductsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const products_controller_1 = require("./products.controller");
let ProductsModule = ProductsModule_1 = class ProductsModule {
    static register(config) {
        console.log('[FAST-CRUD] ProductsModule.register called');
        if (!config?.repositoryProvider) {
            throw new Error('[FAST-CRUD] ProductsModule requires a repository provider. Please provide an implementation of ProductsRepositoryPort.');
        }
        return {
            module: ProductsModule_1,
            imports: config.imports || [],
            controllers: [products_controller_1.ProductsController],
            providers: [
                products_service_1.ProductsService,
                config.repositoryProvider,
            ],
            exports: [products_service_1.ProductsService],
        };
    }
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = ProductsModule_1 = __decorate([
    (0, common_1.Module)({})
], ProductsModule);
//# sourceMappingURL=products.module.js.map