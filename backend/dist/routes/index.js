"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use(auth_middleware_1.authMiddleware);
router.use('/transactions', transaction_routes_1.default);
router.use('/categories', category_routes_1.default);
exports.default = router;
