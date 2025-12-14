/**
 * API Error Classes
 * Custom error types for different API error scenarios
 */

/**
 * Base API error class
 * Extended by specific error types
 */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Validation error (422 status)
 * Contains field-specific validation errors
 */
export class ValidationError extends ApiError {
  errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message, 422, "VALIDATION_ERROR", errors);
    this.name = "ValidationError";
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Not found error (404 status)
 * Resource does not exist
 */
export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Unauthorized error (401 status)
 * User not authenticated
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden error (403 status)
 * User authenticated but lacks permission
 */
export class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Conflict error (409 status)
 * Resource conflict (e.g., duplicate)
 */
export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
    this.name = "ConflictError";
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Server error (500 status)
 * Internal server error
 */
export class ServerError extends ApiError {
  constructor(message: string) {
    super(message, 500, "SERVER_ERROR");
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Network error
 * Connection/timeout issues
 */
export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Parse error response and throw appropriate error
 */
export function parseErrorResponse(status: number, data: unknown): never {
  // biome-ignore lint/suspicious/noExplicitAny: error responses have dynamic structure
  const message = (data as any)?.message || (data as any)?.error || "An unexpected error occurred";

  switch (status) {
    case 400:
      throw new ApiError(message, 400, "BAD_REQUEST", data);
    case 401:
      throw new UnauthorizedError(message);
    case 403:
      throw new ForbiddenError(message);
    case 404:
      throw new NotFoundError(message);
    case 409:
      throw new ConflictError(message);
    case 422:
      // biome-ignore lint/suspicious/noExplicitAny: validation errors have dynamic structure
      throw new ValidationError(message, (data as any)?.errors || {});
    case 500:
    case 502:
    case 503:
      throw new ServerError(message);
    default:
      throw new ApiError(message, status, "UNKNOWN_ERROR", data);
  }
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
