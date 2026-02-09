export class DomainError extends Error {
  constructor(message: string, public code: string = "DOMAIN_ERROR") {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND");
  }
}

export class ValidationError extends DomainError {
  constructor(message = "Validation error") {
    super(message, "VALIDATION_ERROR");
  }
}
