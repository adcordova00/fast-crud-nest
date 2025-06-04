"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastCrudException = void 0;
class FastCrudException extends Error {
    constructor(code, message, statusCode = 500, context) {
        super(message);
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
        this.context = context;
    }
}
exports.FastCrudException = FastCrudException;
