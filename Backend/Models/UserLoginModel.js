import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            sparse: true
        },
        email: {
            type: String,
            required: false,
            unique: true,
            trim: true,
            lowercase: true,
            sparse: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a Valid Email Address.']
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', function (next) {
    const identifier = this.username || this.email; 

    if (identifier && (identifier.toLowerCase() === 'admin' || identifier.toLowerCase() === 'admin@example.com')) {
        this.role = 'Admin';
    }
    next();
});

export const User = mongoose.model('User', UserSchema, 'User');