export class Exception extends Error {
  name: string;
  args: object;
  description?: string;
  code?: string;

  constructor({ code = '', description = '', args = {} } = {}) {
    super();
    this.name = this.constructor.name;
    this.args = args;
    if (code) this.code = code;
    if (description) this.description = description;
  }
}
