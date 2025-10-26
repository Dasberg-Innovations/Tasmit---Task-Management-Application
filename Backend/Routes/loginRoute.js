import express from 'express';
import { User } from '../Models/UserLoginModel.js';
import bcrypt from 'bcrypt'; // Encryption for Password

const router = express.Router();

router.post("/signup", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username && !email) {
            return response.status(400).json({ error: "Username or Email is required to signup." });
        }
        if (!password) {
            return response.status(400).json({ error: "Password is required" });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return response.status(400).json({ error: "This Username or Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        response.status(201).json({
            message: "User created successfully",
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        response.status(500).json({ error: "Registration failed. Please try again." });
    }
});

router.post("/login", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username && !email || !password) {
            return response.status(400).json({ error: "Username or email and password are required" });
        } 

        const user = await User.findOne({
            $or: [{ username: username }, { email: email }]
        });

        if (!user) {
            return response.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({ error: "Invalid credentials" });
        }

        response.status(200).json({
            message: "Login successful",
            user: {
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        response.status(500).json({ error: "Login failed. Please try again." });
    }
});

export default router;