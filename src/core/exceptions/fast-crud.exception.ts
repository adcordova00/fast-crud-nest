export class FastCrudException extends Error {
    constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly statusCode: number = 500,
        public readonly context?: any
    ) {
        super(message);
    }
}
