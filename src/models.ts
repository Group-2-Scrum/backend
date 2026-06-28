import { Schema, model, Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  userId: Types.ObjectId; // Tied to the user who created it
}

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    createdAt: Date;
}

export interface INote extends Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    category: ICategory;
    user: Types.ObjectId;
}

export interface IItem extends Document {
  title: string;
  description?: string;
  url?: string;
  userId: Types.ObjectId;
  categoryId?: Types.ObjectId; // Optional
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure a user can't make duplicate categories with the exact same name
categorySchema.index({ name: 1, userId: 1 }, { unique: true });

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } });

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  url: { type: String, trim: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: true });

// Add a text index to title and description for high-performance searching
ItemSchema.index({ title: 'text', description: 'text' });

export const Item = model<IItem>('Item', ItemSchema);
export const Category = model<ICategory>('Category', categorySchema);
export const User = model<IUser>('User', userSchema);