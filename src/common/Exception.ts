export class Exception {
  code?: string;
  description?: string;
  error: object | undefined;

  constructor(error: object | undefined = undefined) {
    if (error) this.error = error;
  }
}
