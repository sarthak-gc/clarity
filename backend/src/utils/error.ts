export class AppError extends Error {
  status: number;
  code: string;
  details: any;

  constructor(
    message: string,
    {
      status = 500,
      code = "INTERNAL_ERROR",
      details = null,
    }: { status?: number; code?: string; details?: any },
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", details?: any) {
    super(message, { status: 400, code: "BAD_REQUEST", details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", details?: any) {
    super(message, { status: 401, code: "UNAUTHORIZED", details });
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", details?: any) {
    super(message, { status: 403, code: "FORBIDDEN", details });
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found", details?: any) {
    super(message, { status: 404, code: "NOT_FOUND", details });
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error", details?: any) {
    super(message, { status: 500, code: "INTERNAL_SERVER_ERROR", details });
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", details?: any) {
    super(message, { status: 409, code: "CONFLICT", details });
  }
}
