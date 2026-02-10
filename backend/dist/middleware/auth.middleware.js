"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const error_1 = require("../utils/error");
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new error_1.UnauthorizedError('Invalid Token');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new error_1.UnauthorizedError('Invalid Token');
    }
    try {
        const decoded = (0, jwt_1.verifyJWT)(token);
        if (decoded) {
            req.userId = decoded.userId;
            req.username = decoded.username;
            next();
            return;
        }
        throw new error_1.UnauthorizedError('Invalid token');
    }
    catch {
        throw new error_1.UnauthorizedError('Invalid Token');
    }
};
exports.authMiddleware = authMiddleware;
