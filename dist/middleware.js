"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
exports.requestLogger = requestLogger;
exports.validateBody = validateBody;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = require("mongoose");
const error_1 = require("./error");
const JWT_SECRET = process.env.JWT_SECRET;
class UnauthorizedError extends error_1.AppError {
    constructor(message = 'Access denied. Invalid or missing token.') {
        super(401, message);
    }
}
function authGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authorization token required using Bearer format');
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: new mongoose_1.Types.ObjectId(decoded.userId),
            email: decoded.email
        };
        next();
    }
    catch (error) {
        next(new UnauthorizedError('Session expired or authentication token is invalid'));
    }
}
function requestLogger(req, res, next) {
    const timestamp = new Date().toISOString();
    const { method, url, ip } = req;
    console.log(`[${timestamp}] ${method} request sent to ${url} from ${ip}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} responded with status ${res.statusCode} (${duration}ms)`);
    });
    next();
}
function validateBody(requiredFields) {
    return (req, res, next) => {
        const body = req.body;
        const missingFields = [];
        for (const field of requiredFields) {
            if (!body || body[field] === undefined || body[field] === null) {
                missingFields.push(String(field));
            }
        }
        if (requiredFields.includes('category') && body && body.category) {
            if (!body.category.name) {
                missingFields.push('category.name');
            }
        }
        if (missingFields.length > 0) {
            throw new error_1.BadRequestError(`Missing required fields: ${missingFields.join(', ')}`);
        }
        next();
    };
}
