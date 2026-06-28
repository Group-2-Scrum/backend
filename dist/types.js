"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticatedRequest = isAuthenticatedRequest;
const mongoose_1 = require("mongoose");
function isAuthenticatedRequest(req) {
    return (req.user !== undefined &&
        req.user?.id instanceof mongoose_1.Types.ObjectId);
}
