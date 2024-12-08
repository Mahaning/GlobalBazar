import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    Role: { type: Number, enum: [0, 1, 2, 3], required: true, default: 2 }, // 0-Admin, 1-shopOwner, 2-user, 3-deliveryPartners
    street: { type: String, required: true, default: "" },
    city: { type: String, required: true, default: "" },
    state: { type: String, required: true, default: "" },
    country: { type: String, required: true, default: "" },
    pincode: { type: String, required: true, default: "" },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Correct reference to User model
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
