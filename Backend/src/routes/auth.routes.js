import express from 'express'
import { registerUser, loginUser } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { roleMiddleware } from '../middlewares/role.middleware.js'
import bcrypt from 'bcryptjs'
import { User } from '../models/user.models.js'
const router = express.Router();

// Only admin can register new users
router.post("/register", authMiddleware, roleMiddleware("admin"), registerUser);

// TEMPORARY — delete after first admin created
// router.post("/create-first-admin", async (req, res) => {
//   const { name, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const admin = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     role: "admin"
//   });

//   res.status(201).json({ message: "First admin created", admin });
// });

// Login for all users
router.post("/login", loginUser);

export default router;