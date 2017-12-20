"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validation = (function () {
    function Validation() {
    }
    Validation.checkFieldsIn = function (existsIn, fields) {
        var errors = [];
        fields.forEach(function (item) {
            if (existsIn[item] === undefined || existsIn[item].length == 0) {
                errors.push("Required field '" + item + "' was not provided.");
            }
        });
        return errors.length == 0 ? false : errors;
    };
    return Validation;
}());
exports.Validation = Validation;
//# sourceMappingURL=validation.js.map