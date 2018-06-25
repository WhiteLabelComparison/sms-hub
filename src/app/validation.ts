export class Validation {

  static checkFieldsIn(existsIn: any, fields: string[]): string[] | boolean {
    const errors: string[] = [];

    fields.forEach(item => {
      if (existsIn[item] === undefined || existsIn[item].length === 0) {
        errors.push(`Required field '${item}' was not provided.`);
      }
    });

    return errors.length === 0 ? false : errors;
  }

}