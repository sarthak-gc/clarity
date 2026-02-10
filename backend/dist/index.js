"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", routes_1.default);
app.use((err, _, res, __) => {
    res.status(400).json({
        success: false,
        msg: err.message,
        status: err.status || 123,
        code: err.code,
    });
    return;
});
app.listen(3000);
