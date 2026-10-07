export class GoogleEmailMissingError extends Error {
  constructor() {
    super("Google account email not available");
    this.name = "GoogleEmailMissingError";
  }
}

export class GoogleAccountConflictError extends Error {
  constructor() {
    super("This email is already linked to another Google account");
    this.name = "GoogleAccountConflictError";
  }
}