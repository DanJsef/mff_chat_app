class Validator {
  private stringLength(length: number, input: string): string {
    if (input.length < length) return `Must be ${length} or more characters`;
    return "";
  }

  private onlyAlphabetAndNumbers(input: string): string {
    if (!input.match(/^([a-z]|[A-Z]|[0-9])+$/g)) {
      return "Only alphabet and numbers allowed";
    }
    return "";
  }

  private sameStrings(firstInput: string, secondInput: string): string {
    if (firstInput !== secondInput) return "Passwords don't match";
    return "";
  }

  public validateUsername(username: string): string {
    let characterValidation: string = this.onlyAlphabetAndNumbers(username);
    if (characterValidation) return characterValidation;

    let lengthValidation: string = this.stringLength(2, username);
    if (lengthValidation) return lengthValidation;

    return "";
  }

  public validatePassword(password: string): string {
    let characterValidation: string = this.onlyAlphabetAndNumbers(password);
    if (characterValidation) return characterValidation;

    let lengthValidation: string = this.stringLength(8, password);
    if (lengthValidation) return lengthValidation;

    return "";
  }
  public validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): string {
    let equalityValidation: string = this.sameStrings(
      password,
      confirmPassword
    );
    if (equalityValidation) return equalityValidation;

    return "";
  }
}

export default new Validator();
