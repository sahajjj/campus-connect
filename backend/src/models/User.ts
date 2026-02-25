import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    verified: boolean;
    campus: string;
    otp?: string;
    otpExpires?: Date;
    isBanned: boolean;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@vitbhopal\.ac\.in$/, 'Only VIT Bhopal emails are allowed'],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    campus: {
        type: String,
        default: 'VIT Bhopal',
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<IUser>('User', UserSchema);
