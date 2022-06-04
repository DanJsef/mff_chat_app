class ErrorDescription extends Error {
  name: string;
  httpStatusCode: number;
  message: string;

  constructor(name: string, message: string, httpStatusCode: number) {
    super();

    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.message = message;
  }
}

export default ErrorDescription;
