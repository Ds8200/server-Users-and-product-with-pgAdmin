"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleJsonfileError = exports.handleError = void 0;
var chalk_1 = require("chalk");
var handleError = function (res, error, status) {
    if (status === void 0) { status = 400; }
    if (error && error instanceof Error)
        return res.status(status).send(error.message);
    return res.status(status).send("Oops... an error accorded");
};
exports.handleError = handleError;
var handleJsonfileError = function (error) {
    if (error instanceof Error)
        return Promise.reject(error);
    console.log(chalk_1.default.redBright(error));
    return Promise.reject(new Error("Something went wong!"));
};
exports.handleJsonfileError = handleJsonfileError;
