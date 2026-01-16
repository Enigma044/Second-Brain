import mongoose from "mongoose";
const { Schema, model } = mongoose;

mongoose.connect("mongodb://localhost:27017/brainly");

// 1. User Schema
const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});
export const User = model('User', userSchema);

// 2. Tag Schema
const tagSchema = new Schema({
    title: { type: String, required: true, unique: true },
});
export const Tag = model('Tag', tagSchema);

// 3. Content Schema
const contentType = ['image', 'video', 'article', 'audio'];
const contentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentType, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}); // <--- This was missing a closing brace '}' in your code
export const Content = model('Content', contentSchema);

// 4. Link Schema
const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}); 
export const Link = model('Link', linkSchema);