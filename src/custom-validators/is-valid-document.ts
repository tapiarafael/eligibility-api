import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDocument',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const cpfRegex = /^[0-9]{11}$/;
          const cnpjRegex = /^[0-9]{14}$/;

          return cpfRegex.test(value) || cnpjRegex.test(value);
        },
      },
    });
  };
}
