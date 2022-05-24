export class HttpException extends Error {
    statusCode?: number;
    status?: number;
    message: string;
    error: string | null;
    errorCode: string | null;

    constructor(statusCode: number, message: string, error?: string, errorCode?: string, stack?: string) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.error = error || '';
        this.errorCode = errorCode || '';
        this.stack = stack || '';
    }
}
