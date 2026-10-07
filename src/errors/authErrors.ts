export class GoogleEmailMissingError extends Error {
  constructor() {
    super("Google account email not available");
    this.name = "GoogleEmailMissingError";
  }
}

export class GoogleEmailNotVerifiedError extends Error {
  constructor() {
    super("Google account email is not verified");
    this.name = "GoogleEmailNotVerifiedError";
  }
}

export class GoogleAccountConflictError extends Error {
  constructor() {
    super("This email is already linked to another Google account");
    this.name = "GoogleAccountConflictError";
  }
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super("A user with this email or Google account already exists");
    this.name = "UserAlreadyExistsError";
  }
}