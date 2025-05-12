import { FastCrudException } from './fast-crud.exception';

export class FastCrudValidationException extends FastCrudException {
    constructor(message: string, context?: any) {
        super('VALIDATION_ERROR', message, 400, context);
    }
}
