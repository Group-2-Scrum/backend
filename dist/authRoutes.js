"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("./models");
const middleware_1 = require("./middleware");
const error_1 = require("./error");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET;
router.post('/register', (0, middleware_1.validateBody)(['email', 'password']), async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await models_1.User.exists({ $or: [{ email }] });
        if (userExists) {
            throw new error_1.BadRequestError('Email credentials already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const newUser = new models_1.User({ email, passwordHash });
        await newUser.save();
        res.status(201).json({ message: 'Account created successfully', userId: newUser._id });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', (0, middleware_1.validateBody)(['email', 'password']), async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await models_1.User.findOne({ email });
        if (!user)
            throw new error_1.BadRequestError('Email invalid');
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            throw new error_1.BadRequestError('Password Invalid');
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token, message: "Login successful! Welcome to Stash!" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
