"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = void 0;
const success = (res, message, status = 200, data) => {
    res.status(status).json({
        message,
        data
    });
};
exports.success = success;
