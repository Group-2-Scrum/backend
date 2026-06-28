"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Category = exports.Item = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
// Ensure a user can't make duplicate categories with the exact same name
categorySchema.index({ name: 1, userId: 1 }, { unique: true });
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });
const ItemSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    url: { type: String, trim: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });
// Add a text index to title and description for high-performance searching
ItemSchema.index({ title: 'text', description: 'text' });
exports.Item = (0, mongoose_1.model)('Item', ItemSchema);
exports.Category = (0, mongoose_1.model)('Category', categorySchema);
exports.User = (0, mongoose_1.model)('User', userSchema);
