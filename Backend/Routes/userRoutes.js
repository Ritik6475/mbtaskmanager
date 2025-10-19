import express from "express";
import { registerUser } from "../Controllers/userController";

const router = express.Router();

// POST /api/users
router.post("/register", registerUser);

export default router;
