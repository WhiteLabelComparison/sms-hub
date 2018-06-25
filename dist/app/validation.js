"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Validation {
    static checkFieldsIn(existsIn, fields) {
        const errors = [];
        fields.forEach(item => {
            if (existsIn[item] === undefined || existsIn[item].length === 0) {
                errors.push(`Required field '${item}' was not provided.`);
            }
        });
        return errors.length === 0 ? false : errors;
    }
}
exports.Validation = Validation;
//# sourceMappingURL=validation.js.map