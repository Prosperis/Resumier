import {
  ApiError,
  ConflictError,
  ForbiddenError,
  getErrorMessage,
  isApiError,
  NetworkError,
  NotFoundError,
  parseErrorResponse,
  ServerError,
  UnauthorizedError,
  ValidationError,
} from "../errors";

/**
 * Tests for API Error Classes and Utilities
 */
describe("API Errors", () => {
  describe("ApiError", () => {
    it("creates error with message, status, and code", () => {
      const error = new ApiError("Test error", 400, "TEST_CODE");

      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.code).toBe("TEST_CODE");
      expect(error.name).toBe("ApiError");
      expect(error instanceof Error).toBe(true);
    });

    it("creates error without code", () => {
      const error = new ApiError("Test error", 400);

      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.code).toBeUndefined();
    });
  });

  describe("ValidationError", () => {
    it("creates validation error with field errors", () => {
      const errors = {
        email: ["Invalid email format"],
        password: ["Password too short", "Password must contain a number"],
      };
      const error = new ValidationError("Validation failed", errors);

      expect(error.message).toBe("Validation failed");
      expect(error.status).toBe(422);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.errors).toEqual(errors);
      expect(error instanceof ApiError).toBe(true);
    });

    it("creates validation error with empty errors object", () => {
      const error = new ValidationError("Validation failed", {});

      expect(error.errors).toEqual({});
    });
  });

  describe("NotFoundError", () => {
    it("creates not found error", () => {
      const error = new NotFoundError("Resource not found");

      expect(error.message).toBe("Resource not found");
      expect(error.status).toBe(404);
      expect(error.code).toBe("NOT_FOUND");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("UnauthorizedError", () => {
    it("creates unauthorized error", () => {
      const error = new UnauthorizedError("Please log in");

      expect(error.message).toBe("Please log in");
      expect(error.status).toBe(401);
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("ForbiddenError", () => {
    it("creates forbidden error", () => {
      const error = new ForbiddenError("Access denied");

      expect(error.message).toBe("Access denied");
      expect(error.status).toBe(403);
      expect(error.code).toBe("FORBIDDEN");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("ConflictError", () => {
    it("creates conflict error", () => {
      const error = new ConflictError("Resource already exists");

      expect(error.message).toBe("Resource already exists");
      expect(error.status).toBe(409);
      expect(error.code).toBe("CONFLICT");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("ServerError", () => {
    it("creates server error", () => {
      const error = new ServerError("Internal server error");

      expect(error.message).toBe("Internal server error");
      expect(error.status).toBe(500);
      expect(error.code).toBe("SERVER_ERROR");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("NetworkError", () => {
    it("creates network error", () => {
      const error = new NetworkError("Network connection failed");

      expect(error.message).toBe("Network connection failed");
      expect(error.status).toBe(0);
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error instanceof ApiError).toBe(true);
    });
  });

  describe("parseErrorResponse", () => {
    it("throws ValidationError for 422 status with field errors", () => {
      const data = {
        message: "Validation failed",
        errors: {
          email: ["Invalid email"],
        },
      };

      expect(() => parseErrorResponse(422, data)).toThrow(ValidationError);
      expect(() => parseErrorResponse(422, data)).toThrow("Validation failed");
    });

    it("throws NotFoundError for 404 status", () => {
      const data = { message: "Not found" };

      expect(() => parseErrorResponse(404, data)).toThrow(NotFoundError);
      expect(() => parseErrorResponse(404, data)).toThrow("Not found");
    });

    it("throws UnauthorizedError for 401 status", () => {
      const data = { message: "Unauthorized" };

      expect(() => parseErrorResponse(401, data)).toThrow(UnauthorizedError);
      expect(() => parseErrorResponse(401, data)).toThrow("Unauthorized");
    });

    it("throws ForbiddenError for 403 status", () => {
      const data = { message: "Forbidden" };

      expect(() => parseErrorResponse(403, data)).toThrow(ForbiddenError);
      expect(() => parseErrorResponse(403, data)).toThrow("Forbidden");
    });

    it("throws ConflictError for 409 status", () => {
      const data = { message: "Conflict" };

      expect(() => parseErrorResponse(409, data)).toThrow(ConflictError);
      expect(() => parseErrorResponse(409, data)).toThrow("Conflict");
    });

    it("throws ServerError for 500 status", () => {
      const data = { message: "Server error" };

      expect(() => parseErrorResponse(500, data)).toThrow(ServerError);
      expect(() => parseErrorResponse(500, data)).toThrow("Server error");
    });

    it("throws ServerError for other 5xx statuses", () => {
      const data = { message: "Bad gateway" };

      expect(() => parseErrorResponse(502, data)).toThrow(ServerError);
      expect(() => parseErrorResponse(503, data)).toThrow(ServerError);
    });

    it("throws ApiError for unknown status codes", () => {
      const data = { message: "Unknown error" };

      expect(() => parseErrorResponse(418, data)).toThrow(ApiError);
      expect(() => parseErrorResponse(418, data)).toThrow("Unknown error");
    });

    it("uses default message if no message in data", () => {
      expect(() => parseErrorResponse(404, {})).toThrow(
        "An unexpected error occurred",
      );
    });

    it("handles null data", () => {
      expect(() => parseErrorResponse(500, null)).toThrow(
        "An unexpected error occurred",
      );
    });

    it("handles undefined data", () => {
      expect(() => parseErrorResponse(500, undefined)).toThrow(
        "An unexpected error occurred",
      );
    });
  });

  describe("isApiError", () => {
    it("returns true for ApiError instances", () => {
      const error = new ApiError("Test", 400);
      expect(isApiError(error)).toBe(true);
    });

    it("returns true for ApiError subclasses", () => {
      expect(isApiError(new ValidationError("Test", {}))).toBe(true);
      expect(isApiError(new NotFoundError("Test"))).toBe(true);
      expect(isApiError(new UnauthorizedError("Test"))).toBe(true);
      expect(isApiError(new ForbiddenError("Test"))).toBe(true);
      expect(isApiError(new ConflictError("Test"))).toBe(true);
      expect(isApiError(new ServerError("Test"))).toBe(true);
      expect(isApiError(new NetworkError("Test"))).toBe(true);
    });

    it("returns false for regular Error instances", () => {
      const error = new Error("Test");
      expect(isApiError(error)).toBe(false);
    });

    it("returns false for TypeError instances", () => {
      const error = new TypeError("Test");
      expect(isApiError(error)).toBe(false);
    });

    it("returns false for non-error objects", () => {
      expect(isApiError({})).toBe(false);
      expect(isApiError({ message: "Test", status: 400 })).toBe(false);
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError("string")).toBe(false);
      expect(isApiError(123)).toBe(false);
    });
  });

  describe("getErrorMessage", () => {
    it("extracts message from ApiError", () => {
      const error = new ApiError("API error message", 400);
      expect(getErrorMessage(error)).toBe("API error message");
    });

    it("extracts message from ApiError subclasses", () => {
      expect(getErrorMessage(new NotFoundError("Not found"))).toBe("Not found");
      expect(getErrorMessage(new ValidationError("Invalid", {}))).toBe(
        "Invalid",
      );
    });

    it("extracts message from regular Error", () => {
      const error = new Error("Regular error");
      expect(getErrorMessage(error)).toBe("Regular error");
    });

    it("returns default message for unknown errors", () => {
      expect(getErrorMessage("string error")).toBe(
        "An unexpected error occurred",
      );
      expect(getErrorMessage(123)).toBe("An unexpected error occurred");
      expect(getErrorMessage({})).toBe("An unexpected error occurred");
      expect(getErrorMessage(null)).toBe("An unexpected error occurred");
      expect(getErrorMessage(undefined)).toBe("An unexpected error occurred");
    });
  });

  describe("Error Inheritance", () => {
    it("maintains proper prototype chain", () => {
      const validationError = new ValidationError("Test", {});
      const notFoundError = new NotFoundError("Test");

      expect(validationError instanceof ValidationError).toBe(true);
      expect(validationError instanceof ApiError).toBe(true);
      expect(validationError instanceof Error).toBe(true);

      expect(notFoundError instanceof NotFoundError).toBe(true);
      expect(notFoundError instanceof ApiError).toBe(true);
      expect(notFoundError instanceof Error).toBe(true);
    });

    it("errors have correct names", () => {
      expect(new ValidationError("Test", {}).name).toBe("ValidationError");
      expect(new NotFoundError("Test").name).toBe("NotFoundError");
      expect(new UnauthorizedError("Test").name).toBe("UnauthorizedError");
      expect(new ForbiddenError("Test").name).toBe("ForbiddenError");
      expect(new ConflictError("Test").name).toBe("ConflictError");
      expect(new ServerError("Test").name).toBe("ServerError");
      expect(new NetworkError("Test").name).toBe("NetworkError");
    });
  });
});
