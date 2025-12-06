import { User } from "../models/user.models.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register : Admin only register 
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Only admin can create users
        // here req.user means it is check by jwt :
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Only admin can create users"
            })
        }

        // check existing email :
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                message: "email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // create user : 
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
}

// Login :
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare( password,user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // create jwt token :
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email
        }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRE
            });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
}