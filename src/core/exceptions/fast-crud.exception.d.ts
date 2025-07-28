export declare class FastCrudException extends Error {
    readonly code: string;
    readonly message: string;
    readonly statusCode: number;
    readonly context?: any;
    constructor(code: string, message: string, statusCode?: number, context?: any);
}
