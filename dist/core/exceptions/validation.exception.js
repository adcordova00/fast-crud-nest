"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastCrudValidationException = void 0;
const fast_crud_exception_1 = require("./fast-crud.exception");
class FastCrudValidationException extends fast_crud_exception_1.FastCrudException {
    constructor(message, context) {
        super('VALIDATION_ERROR', message, 400, context);
    }
}
exports.FastCrudValidationException = FastCrudValidationException;
