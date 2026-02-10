"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.DB_URL = void 0;
exports.DB_URL = process.env.DATABASE_URL || "test";
exports.JWT_SECRET = process.env.JWT_SECRET || "something";
