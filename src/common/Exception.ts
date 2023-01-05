export class Exception {
  code?: string;
  description?: string;
  error: object | undefined;
  exceptionName: string;

  constructor(error: object | undefined = undefined) {
    if (error) this.error = error;
    this.exceptionName = this.constructor.name;
  }
}
