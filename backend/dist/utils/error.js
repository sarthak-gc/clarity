"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, { status = 500, code = 'INTERNAL_ERROR', details = null }) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
exports.AppError = AppError;
class BadRequestError extends AppError {
    constructor(message = 'Bad Request', details) {
        super(message, { status: 400, code: 'BAD_REQUEST', details });
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details) {
        super(message, { status: 401, code: 'UNAUTHORIZED', details });
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details) {
        super(message, { status: 403, code: 'FORBIDDEN', details });
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends AppError {
    constructor(message = 'Not Found', details) {
        super(message, { status: 404, code: 'NOT_FOUND', details });
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error', details) {
        super(message, { status: 500, code: 'INTERNAL_SERVER_ERROR', details });
    }
}
exports.InternalServerError = InternalServerError;
class ConflictError extends AppError {
    constructor(message = 'Conflict', details) {
        super(message, { status: 409, code: 'CONFLICT', details });
    }
}
exports.ConflictError = ConflictError;
