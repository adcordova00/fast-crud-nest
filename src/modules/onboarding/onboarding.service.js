"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const onboarding_repository_port_1 = require("../../core/ports/onboarding-repository.port");
const validation_exception_1 = require("../../core/exceptions/validation.exception");
const fast_crud_exception_1 = require("../../core/exceptions/fast-crud.exception");
let OnboardingService = class OnboardingService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            return await this.repository.create(dto);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('CREATE_FAILED', 'Failed to create onboarding', 500, error);
        }
    }
    async findAll(params = {}) {
        try {
            return await this.repository.findAll(params);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve onboarding records', 500, error);
        }
    }
    async findById(id) {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve onboarding record', 500, error);
        }
    }
    async update(id, dto) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            return await this.repository.update(id, dto);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('UPDATE_FAILED', 'Failed to update onboarding record', 500, error);
        }
    }
    async softDelete(id) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Onboarding with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('DELETE_FAILED', 'Failed to delete onboarding record', 500, error);
        }
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(onboarding_repository_port_1.ONBOARDING_REPOSITORY_PORT)),
    __metadata("design:paramtypes", [Object])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map